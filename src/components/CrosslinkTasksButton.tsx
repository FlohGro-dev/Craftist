import React from "react";
import { Button } from "@chakra-ui/button";
import { LinkIcon, SmallAddIcon } from "@chakra-ui/icons";
import * as TodoistWrapper from "../todoistApiWrapper";
import * as CraftBlockInteractor from "../craftBlockInteractor";
import { useToast } from "@chakra-ui/toast";
import { CraftTextBlock, CraftTextRun } from "@craftdocs/craft-extension-api";
import { Box, Center } from "@chakra-ui/react";

const CrosslinkTasksButton: React.FC = () => {
  // const projectList = useRecoilValue(States.projects);
  const toast = useToast();
  const add = TodoistWrapper.useAddTask();
  const [isLoading, setIsLoading] = React.useState(false);
  const onClick = () => {
    setIsLoading(true);
    let openTasks = CraftBlockInteractor.getUncheckedTodoItemsFromCurrentPage();
    openTasks.then((blocks) => {
      if (!blocks.length) {
        return;
      }
      return Promise.all(
        blocks
          .filter(
            (block): block is CraftTextBlock => block.type === "textBlock"
          )
          .map((block) => {
            const documentTitle = "";
            //const description = `craftdocs://open?spaceId=${block.spaceId}&blockId=${block.id}`;
            const mdLink = CraftBlockInteractor.getMarkdownLinkToCraftTextBlock(block);
            // check if task is already crosslinked
            if(CraftBlockInteractor.blockContainsString("Todoist Task", block)){
              // nothing to be done - task is already linked
            } else {
            // create task and append link to block
            add({
              description: documentTitle,
              content: mdLink,
            })
              .then(async function(task) {
                // append task link to block
                let blockToAppend: CraftTextRun[] = [
                  {
                    text: " "
                  },
                  {
                    text: "Todoist Task", link: { type: "url", url: "todoist://task?id=" + task.id }
                  },
                  {
                    text: " "
                  },
                  {
                    text: "Weblink", link: { type: "url", url: task.url }
                  }

                ];
                CraftBlockInteractor.appendCraftTextRunToBlock(blockToAppend, block);
              });
            }
          })
      )
    })
      .finally(() => {
        setIsLoading(false);
        toast({
          position: "bottom",
          render: () => (
            <Center>
              <Box color='white' w='80%' borderRadius='lg' p={3} bg='blue.500'>
                Crosslinked Tasks
            </Box>
            </Center>
          ),
        })
      });
  }
  return (
    <Button
      leftIcon={<LinkIcon />}
      colorScheme='red'
      onClick={onClick}
      width="100%"
      mb="2"
      isLoading={isLoading}
    >
      Crosslink Open Tasks
      </Button>
  );
}

export default CrosslinkTasksButton;
