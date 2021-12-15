import React from "react";
import { Button } from "@chakra-ui/button";
import { LinkIcon, PlusSquareIcon } from "@chakra-ui/icons";
import * as TodoistWrapper from "../todoistApiWrapper";
import * as CraftBlockInteractor from "../craftBlockInteractor";
import { useToast } from "@chakra-ui/toast";
import { CraftBlock, CraftTextBlock, CraftTextRun } from "@craftdocs/craft-extension-api";
import { Box, Center } from "@chakra-ui/react";
// import { CraftEnv } from "../types"
//
// type CreateTasksFromSelectionButtonProperties = {
//   craftEnv: CraftEnv;
// }

const CreateTasksFromSelectionButton: React.FC = () => {
  const toast = useToast();
  const add = TodoistWrapper.useAddTask();
  const [isLoading, setIsLoading] = React.useState(false);
  const onClick = () => {
    setIsLoading(true);
    craft.editorApi
      .getSelection()
      .then((resp) => {
        if (!resp.data ?.length) {
          throw new Error();
        }
        return resp.data;
      })
      .catch(() => {
        toast({
          status: "error",
          position: "bottom",
          title: "No Blocks selected",
          duration: 1000,
        });
        return [] as CraftBlock[];
      })
      .then((blocks) => {
        if (!blocks.length) {
          return;
        }
        return Promise.all(
          blocks
            .filter(
              (block): block is CraftTextBlock => block.type === "textBlock"
            )
            .map((block) => {
              const documentTitle = CraftBlockInteractor.getParentDocumentMdLinkOfBlock(block);
              const mdLink = CraftBlockInteractor.getMarkdownLinkToCraftTextBlock(block);

              if (CraftBlockInteractor.blockContainsString("Todoist Task", block)) {
                // nothing to be done - task is already linked
              } else {

                add({
                  description: documentTitle,
                  content: mdLink
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

                    block.content = block.content.concat(blockToAppend);
                    //block.listStyle.type = "todo";
                    block.listStyle = { type: "todo",
                                        state: "unchecked" };
                    const result = await craft.dataApi.updateBlocks([block])
                    if (result.status !== "success") {
                      throw new Error(result.message)
                   }
                    // //block.listStyle.type = "todo";
                    // CraftBlockInteractor.appendCraftTextRunToBlock(blockToAppend, block);
                    // CraftBlockInteractor.prependCraftTextRunToBlock(blockToPrepend, block);
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
                Imported All Tasks
            </Box>
            </Center>
          ),
        })
      });
  }
  return (
    <Button
      leftIcon={<PlusSquareIcon />}
      colorScheme='red'
      onClick={onClick}
      width="100%"
      mb="2"
      isLoading={isLoading}
    >
      Create Tasks from Selection
      </Button>
  );
}

export default CreateTasksFromSelectionButton;
