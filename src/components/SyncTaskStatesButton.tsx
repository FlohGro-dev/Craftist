import React from "react";
import { Button } from "@chakra-ui/button";
import { UpDownIcon } from "@chakra-ui/icons";
import * as TodoistWrapper from "../todoistApiWrapper";
import * as CraftBlockInteractor from "../craftBlockInteractor";
import { useToast } from "@chakra-ui/toast";
import { CraftBlockUpdate, CraftTextBlock } from "@craftdocs/craft-extension-api";
import { Box, Center } from "@chakra-ui/react";
import { isAnyTaskLinkEnabled, taskMetadataSettingsValues, taskSyncContinuousMode } from "../settingsUtils";
import { useRecoilValue } from "recoil";

const SyncTaskStatesButton: React.FC = () => {
  const toast = useToast();
  const tasksToSyncToastId = 'tasks-to-sync'
  const [isLoading, setIsLoading] = React.useState(false);
  const labelList = useRecoilValue(TodoistWrapper.labels);
  const isTaskCompleted = TodoistWrapper.useCheckIfTaskIsCompleted();
  const isRecurringTask = TodoistWrapper.useCheckIfTaskIsRecurring();
  const setTaskCompleted = TodoistWrapper.useSetTaskComplete();
  const getTask = TodoistWrapper.useGetTask();
  const [continuousSyncIsEnabled, setContinuousSyncIsEnabled] = React.useState(false);
  const [intervalId, setIntervalId] = React.useState(0);

  const onSyncTasks = async () => {
    setIsLoading(true);
    // if no task links are enabled, return immediately and display a warning
    const taskLinkEnabled: boolean = isAnyTaskLinkEnabled();
    if (!taskLinkEnabled) {
      setIsLoading(false);
      toast({
        id: tasksToSyncToastId,
        position: "bottom",
        render: () => (
          <Center>
            <Box color='white' w='80%' borderRadius='lg' p={3} bg='red.500'>
              syncing not possible since no task links are enabled
          </Box>
          </Center>
        ),
      })
      return;
    }

    // get page for document linking
    const getPageResult = await craft.dataApi.getCurrentPage();

    if (getPageResult.status !== "success") {
      throw new Error(getPageResult.message)
    }

    const pageBlock = getPageResult.data
    let documentDate: string | undefined = undefined;
    documentDate = CraftBlockInteractor.getIsoDateIfCurrentDocumentIsDailyNote(pageBlock);

    let todoBlocks = await CraftBlockInteractor.getAllTodoItemsFromCurrentPage();
    let blocksToUpdate: CraftBlockUpdate[] = [];

    if (!todoBlocks.length) {
      setIsLoading(false);
      toast({
        id: tasksToSyncToastId,
        position: "bottom",
        render: () => (
          <Center>
            <Box color='white' w='80%' borderRadius='lg' p={3} bg='yellow.500'>
              No tasks to sync
          </Box>
          </Center>
        ),
      })
      return;
    }

    todoBlocks
      .filter(
        (block): block is CraftTextBlock => block.type === "textBlock"
      )
      .map(async (block) => {
        // check if block contains a syncable task
        let taskId = CraftBlockInteractor.getTodoistTaskIdFromBlock(block);
        if (taskId) {
          // taskId is defined


          // SYNC TODO STATE
          // now we have the task ID - check its state with todoist api
          let getIsTaskStateCompleted = isTaskCompleted({
            id: Number(taskId)
          })
            .catch(() => {
              //ERROR
              if (!toast.isActive("failedToSyncToast")) {
                toast({
                  id: "failedToSyncToast",
                  position: "bottom",
                  render: () => (
                    <Center>
                      <Box color='white' w='80%' borderRadius='lg' p={3} bg='red.500'>
                        Failed syncing states - please try to login again
                      </Box>
                    </Center>
                  ),
                })
              }
            })

          getIsTaskStateCompleted.then(async function(isCompleted) {
            let isRecurring = isRecurringTask({
              id: Number(taskId)
            })

            let syncState: boolean;
            let noSyncReason: string = "";

            isRecurring.then(async function(isRecurring) {
              if (isRecurring) {
                // its a recurring task - not easy to handle since currently no metadata can be attached
                // ignore for now - workaround in planning
                syncState = false;
                if (taskMetadataSettingsValues.includes("dueDates")) {
                  // if due dates are imported as metadata enable it since the due date will be updated in the sync
                  syncState = true;
                } else {
                  noSyncReason = "recurring task will not be synced without enabled due dates"
                }

              } else {
                // sync the state normally
                syncState = true;
              }

              if (syncState) {
                // typecheck to prevent syntax errors.
                if (block.listStyle.type == "todo") {
                  //sync states with this scheme:
                  // if the task is completed anywhere (Todoist or craft) complete it on the other platform
                  // if the task is cancelled in craft and open in todoist, close it

                  if (isCompleted && block.listStyle.state == "unchecked") {
                    // task is completed in todoist but not in Craft
                    block.listStyle.state = "checked";
                    //const result = await craft.dataApi.updateBlocks([block])
                    blocksToUpdate.push(block);
                  }
                  if (!isCompleted && block.listStyle.state == "checked") {
                    // task is completed in craft but not in todoist
                    await setTaskCompleted({
                      id: Number(taskId)
                    });

                    if (isRecurring) {
                      // special handling for recurring tasks:
                      // unlink a recurring task if it is in a daily note
                      if (documentDate) {
                        setTimeout(async function() {
                          await getTask({ taskId: Number(taskId) })
                            .catch()
                            .then((task) => {
                              block.content = TodoistWrapper.createBlockTextRunFromTask(task, labelList, true)
                              blocksToUpdate.push(block)
                            })
                        }, 200)
                      } else {
                        // otherwise uncheck the todo again
                        block.listStyle.state = "unchecked"
                        setTimeout(async function() {
                          await getTask({ taskId: Number(taskId) })
                            .catch()
                            .then((task) => {
                              block.content = TodoistWrapper.createBlockTextRunFromTask(task, labelList)
                              blocksToUpdate.push(block)
                            })
                        }, 200)
                      }
                    }
                  }

                  if (!isCompleted && block.listStyle.state == "unchecked"){
                    // task is uncompleted on both ends - just needed to sync metadate for recurring tasks
                    if (isRecurring) {
                        setTimeout(async function() {
                          await getTask({ taskId: Number(taskId) })
                            .catch()
                            .then((task) => {
                              block.content = TodoistWrapper.createBlockTextRunFromTask(task, labelList)
                              blocksToUpdate.push(block)
                            })
                        }, 200)
                    }
                  }

                  if (!isCompleted && block.listStyle.state == "canceled") {
                    // task is cancelled in craft but open in todoist
                    setTaskCompleted({
                      id: Number(taskId)
                    });
                  }
                }
              } else {
                //display a toast to show the user why a task was note synced
                if (!toast.isActive("no-sync-reason-id")) {
                  toast({
                    id: "no-sync-reason-id",
                    position: "bottom",
                    render: () => (
                      <Center>
                        <Box color='white' w='80%' borderRadius='lg' p={3} bg='yellow.500'>
                          {noSyncReason}
                          </Box>
                      </Center>
                    ),
                  })
                }
              }

            })
          })
            .catch(async function() {
              if (block.listStyle.type == "todo") {
                // task couldn't be retrieved, mark it as done in craft since it is probably deleted
                block.listStyle.state = "checked";
                blocksToUpdate.push(block);
              }


            }).finally(async function() {
              // SYNC METADATA:
              setTimeout(async function() {
                getTask({ taskId: Number(taskId) })
                  .catch(function() {
                    // task is not retrievable - was marked as done in Todoist
                  })
                  .then(async function(task) {
                    if (task) {
                      const getPageResult = await craft.dataApi.getCurrentPage();
                      if (getPageResult.status != "success") {
                        throw new Error("get page failed")
                      }
                      // only update uncompleted tasks and tasks which are not recurring here
                      if (!task.completed && !task.due ?.recurring) {
                        block.content = TodoistWrapper.createBlockTextRunFromTask(task, labelList)
                        blocksToUpdate.push(block)
                      }
                    }
                  })
              }, 1000);
            })
        } else {
          // nothing to be done - task is not crosslinked between todoist and craft (maybe link it right now?)
          if (!toast.isActive(tasksToSyncToastId)) {
            toast({
              id: tasksToSyncToastId,
              position: "bottom",
              render: () => (
                <Center>
                  <Box color='white' w='80%' borderRadius='lg' p={3} bg='yellow.500'>
                    no crosslinked tasks to sync
                    </Box>
                </Center>
              ),
            })
          }
        }

      })
    setTimeout(async function() {
      await craft.dataApi.updateBlocks(blocksToUpdate);
      setIsLoading(false);
      if (!toast.isActive(tasksToSyncToastId)) {
        toast({
          id: tasksToSyncToastId,
          position: "bottom",
          render: () => (
            <Center>
              <Box color='white' w='80%' borderRadius='lg' p={3} bg='blue.500'>
                Synced Tasks
                  </Box>
            </Center>
          ),
        })
      }
    }, 2000)
  }

  const onClick = async () => {
    // behavior: everytime the button is pressed the tasks will be synced / only if continuous sync is enabled no tasks will be synced
    // the settings will be toggled depending on the current state

    // check if we have to change the continuous sync variable
    if (taskSyncContinuousMode == "enabled") {
      // beta mode is enabled toggle the sync mode variable
      let appliedValue = true;
      if (continuousSyncIsEnabled == true) {
        setContinuousSyncIsEnabled(false)
        appliedValue = false;
        clearInterval(intervalId);
      } else {
        setContinuousSyncIsEnabled(true)
        setIntervalId(setInterval(onSyncTasks, 30000))
        onSyncTasks();
      }
      toast({
        id: tasksToSyncToastId,
        position: "bottom",
        render: () => (
          <Center>
            <Box color='white' w='80%' borderRadius='lg' p={3} bg='blue.500'>
              Continuous Task Sync {appliedValue == true ? "enabled" : "disabled"}
            </Box>
          </Center>
        ),
      })
    } else {
      setContinuousSyncIsEnabled(false)
      clearInterval(intervalId);
      onSyncTasks();
    }

  }

  return (
    <Button
      colorScheme='red'
      leftIcon={<UpDownIcon />}
      onClick={onClick}
      width="100%"
      mb="2"
      isLoading={isLoading}
    >
      Sync Tasks
      </Button>
  );
}

export default SyncTaskStatesButton;
