import React from "react";
import { Button } from "@chakra-ui/button";
import { SmallAddIcon, UpDownIcon } from "@chakra-ui/icons";
import * as TodoistWrapper from "../todoistApiWrapper";
import * as CraftBlockInteractor from "../craftBlockInteractor";
import { useToast } from "@chakra-ui/toast";
import { CraftTextBlock, CraftTextRun } from "@craftdocs/craft-extension-api";
import { Box, Center } from "@chakra-ui/react";

const SyncTaskStatesButton: React.FC = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const isTaskCompleted = TodoistWrapper.useCheckIfTaskIsCompleted();
  const setTaskCompleted = TodoistWrapper.useSetTaskComplete();
  const onClick = () => {
    setIsLoading(true);
    let todoBlocks = CraftBlockInteractor.getAllTodoItemsFromCurrentPage();
    todoBlocks.then((blocks) => {
      if (!blocks.length) {
        return;
      }
      return Promise.all(blocks
        .filter(
          (block): block is CraftTextBlock => block.type === "textBlock"
        ).map((block) => {
          if (CraftBlockInteractor.blockContainsString("Todoist Task", block)) {
            let blockUrls = CraftBlockInteractor.getExternalUrlsFromBlock(block);
            let taskId = "";
            blockUrls.forEach(function(url) {


            })

            for (let url of blockUrls) {
              if (url.includes("todoist://task?id=")) {
                taskId = url.replace("todoist://task?id=", "");
                break;
              }
            }
            // now we have the task ID - check its state with todoist api
            let getIsTaskStateCompleted = isTaskCompleted({
              id: Number(taskId)
            })

            getIsTaskStateCompleted.then(async function(isCompleted) {
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
            )
          } else {
            // nothing to be done - task is not crosslinked between todoist and craft (maybe link it right now?)
          }

        }
        )

      )
    })
      .finally(() => {
        setIsLoading(false);
        toast({
          position: "bottom",
          render: () => (
            <Center>
              <Box color='white' w='80%' borderRadius='lg' p={3} bg='blue.500'>
                Synced Task states
            </Box>
            </Center>
          ),
        })
      });
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
