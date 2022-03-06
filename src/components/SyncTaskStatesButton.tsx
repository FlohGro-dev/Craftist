import React from "react";
import { Button } from "@chakra-ui/button";
import { UpDownIcon } from "@chakra-ui/icons";
import * as TodoistWrapper from "../todoistApiWrapper";
import * as CraftBlockInteractor from "../craftBlockInteractor";
import { useToast } from "@chakra-ui/toast";
import { CraftTextBlock } from "@craftdocs/craft-extension-api";
import { Box, Center } from "@chakra-ui/react";
import { isAnyTaskLinkEnabled, taskMetadataSettingsValues } from "../settingsUtils";
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
  const onClick = async () => {
    setIsLoading(true);
    // if no task links are enabled, return immediately and display a warning
    const taskLinkEnabled: boolean = await isAnyTaskLinkEnabled();
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

    let todoBlocks = await CraftBlockInteractor.getAllTodoItemsFromCurrentPage();


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
              toast({
                position: "bottom",
                render: () => (
                  <Center>
                    <Box color='white' w='80%' borderRadius='lg' p={3} bg='red.500'>
                      Failed syncing states - please try to login again
                      </Box>
                  </Center>
                ),
              })
            })

          getIsTaskStateCompleted.then(async function(isCompleted) {
            let isRecurring = isRecurringTask({
              id: Number(taskId)
            })

            let syncState: boolean;

            isRecurring.then(async function(isRecurring) {
              if (isRecurring) {
                // its a recurring task - not easy to handle since currently no metadata can be attached
                // ignore for now - workaround in planning
                syncState = false;
                if (taskMetadataSettingsValues.includes("dueDates")) {
                  // if due dates are imported as metadata enable it since the due date will be updated in the sync
                  syncState = true;
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
                    const result = await craft.dataApi.updateBlocks([block])
                    if (result.status !== "success") {
                      throw new Error(result.message)
                    }
                  }
                  if (!isCompleted && block.listStyle.state == "checked") {
                    // task is completed in craft but not in todoist
                    setTaskCompleted({
                      id: Number(taskId)
                    });
                  }

                  if (!isCompleted && block.listStyle.state == "canceled") {
                    // task is cancelled in craft but open in todoist
                    setTaskCompleted({
                      id: Number(taskId)
                    });
                  }
                }
              }
            })
          })
            .catch(async function() {
              if (block.listStyle.type == "todo") {
                // task couldn't be retrieved, mark it as done in craft since it is probably deleted
                block.listStyle.state = "checked";
                const result = await craft.dataApi.updateBlocks([block])
                if (result.status !== "success") {
                  throw new Error(result.message)
                }
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

                      let prefix = "- [ ] "
                      if (task.completed) {
                        prefix = "- [x] "
                      }

                      let newContent = TodoistWrapper.createTaskMdString(task, prefix, labelList);

                      let newBlock = craft.markdown.markdownToCraftBlocks(newContent);
                      const getPageResult = await craft.dataApi.getCurrentPage();
                      if (getPageResult.status != "success") {
                        throw new Error("get page failed")
                      }
                      // prevent readding task as open since somehow the craft api doesn't render the done checkbox correct.
                      if (!task.completed) {
                        const blockLocation = craft.location.afterBlockLocation(getPageResult.data.id, block.id);
                        await craft.dataApi.addBlocks(newBlock, blockLocation);
                        await craft.dataApi.deleteBlocks([block.id]);
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
        setIsLoading(false);
        if (!toast.isActive(tasksToSyncToastId)) {
          toast({
            id: tasksToSyncToastId,
            position: "bottom",
            render: () => (
              <Center>
                <Box color='white' w='80%' borderRadius='lg' p={3} bg='blue.500'>
                  Synced Task states
                    </Box>
              </Center>
            ),
          })
        }

      })
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
      Sync Task States
      </Button>
  );
}

export default SyncTaskStatesButton;
