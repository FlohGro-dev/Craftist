import React from "react";
import { Button } from "@chakra-ui/button";
import { PlusSquareIcon } from "@chakra-ui/icons";
import * as TodoistWrapper from "../todoistApiWrapper";
import * as CraftBlockInteractor from "../craftBlockInteractor";
import { useToast } from "@chakra-ui/toast";
import { CraftBlock, CraftTextBlock, CraftTextRun } from "@craftdocs/craft-extension-api";
import { Box, Center } from "@chakra-ui/react";
import { taskSetDueDatesBasedOnDailyNote } from "../settingsUtils";
import { useRecoilValue } from "recoil";


const CreateTasksFromSelectionButton: React.FC = () => {
  const toast = useToast();
  const add = TodoistWrapper.useAddTask();
  const todoistProjectUrl = TodoistWrapper.todoistProjectLinkUrl;
  const labelList = useRecoilValue(TodoistWrapper.labels);
  const [isLoading, setIsLoading] = React.useState(false);
  const onClick = async () => {
    setIsLoading(true);

    // check if document is linked to a todoist project
    let foundProjectIDs: string[] = [];
    let linkedProjectId: number;

    let linkedProjectBlocksPromise = CraftBlockInteractor.checkIfPageContainsExternalUrlInAnyBlockAndReturnFoundUrls(todoistProjectUrl);
    linkedProjectBlocksPromise.catch(() => {
      toast({
        status: "error",
        position: "bottom",
        title: "couldn't check if document is linked to a project",
        duration: 1000,
      });
    })
      .then((urls) => {
        if (urls) {
          return Promise.all(
            urls
              .map((url) => {
                if (url.includes(todoistProjectUrl)) {
                  foundProjectIDs.push(url.replace(todoistProjectUrl, ""));
                }
              })
          )
        }
      })
      .finally(() => {
        if (foundProjectIDs.length > 0) {
          if (foundProjectIDs.every((val, _i, arr) => val === arr[0])) {
            // all ids are equal - thats valid
            linkedProjectId = parseInt(foundProjectIDs[0]);
          }
          else {
            // not all ids are equal - this is not valid!
            toast({
              status: "error",
              position: "bottom",
              title: "linkedProjectIds are not all equal",
              duration: 1000,
            });
          }
        }
      })

    // get page for document linking
    const getPageResult = await craft.dataApi.getCurrentPage();

    if (getPageResult.status !== "success") {
      throw new Error(getPageResult.message)
    }

    const pageBlock = getPageResult.data
    let documentDate:string | undefined = undefined;

    if(taskSetDueDatesBasedOnDailyNote == "enabled"){
      documentDate = CraftBlockInteractor.getIsoDateIfCurrentDocumentIsDailyNote(pageBlock);
    }




    // retrieve selection and add tasks
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
          render: () => (
            <Center>
              <Box color='white' w='80%' borderRadius='lg' p={3} bg='yellow.500'>
                No Blocks selected
            </Box>
            </Center>
          ),
        })
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
              const documentTitle = "Craft Document: " + CraftBlockInteractor.getMarkdownLinkToCraftTextBlock(pageBlock);
              const mdLink = CraftBlockInteractor.getMarkdownLinkToCraftTextBlock(block);

              if (CraftBlockInteractor.blockContainsString("Todoist Task", block)) {
                // nothing to be done - task is already linked
              } else {

                add({
                  description: documentTitle,
                  content: mdLink,
                  projectId: linkedProjectId,
                  due_date: documentDate
                })
                  .then(async function(task) {
                    // append task link to block

                    let blockToAppend: CraftTextRun[] = TodoistWrapper.createBlockTextRunFromTask(task, labelList)

                    block.content = blockToAppend;
                    //block.listStyle.type = "todo";
                    block.listStyle = {
                      type: "todo",
                      state: "unchecked"
                    };
                    const result = await craft.dataApi.updateBlocks([block])
                    if (result.status !== "success") {
                      throw new Error(result.message)
                    } else {

                    }
                    // //block.listStyle.type = "todo";
                    // CraftBlockInteractor.appendCraftTextRunToBlock(blockToAppend, block);
                    // CraftBlockInteractor.prependCraftTextRunToBlock(blockToPrepend, block);
                  })
                  .catch(() => {
                    //ERROR
                    toast({
                      position: "bottom",
                      render: () => (
                        <Center>
                          <Box color='white' w='80%' borderRadius='lg' p={3} bg='red.500'>
                            Failed adding Task - please try to login again
                        </Box>
                        </Center>
                      ),
                    })
                  })
              }
            })
        )
      })
      .finally(() => {
        setIsLoading(false);
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
