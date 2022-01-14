import React from "react";
import { Button } from "@chakra-ui/button";
import { ArrowDownIcon } from "@chakra-ui/icons";
import * as TodoistWrapper from "../todoistApiWrapper";
import * as CraftBlockInteractor from "../craftBlockInteractor";
import { useToast } from "@chakra-ui/toast";
import { Box, Center } from "@chakra-ui/react";
import { CraftBlockInsert } from "@craftdocs/craft-extension-api";

const ImportTasksFromLinkedProjectButton: React.FC = () => {
  // const projectList = useRecoilValue(States.projects);
  const toast = useToast();
  const todoistProjectUrl = TodoistWrapper.todoistProjectLinkUrl;
  const getTasksFromProject = TodoistWrapper.useGetTasksFromProject();
  const [isLoading, setIsLoading] = React.useState(false);
  let blocksToAdd: CraftBlockInsert[] = [];
  const onClick = () => {
    setIsLoading(true);

    // check if document is linked to a todoist project
    let foundProjectIDs: string[] = [];
    let linkedProjectId: number = -1;

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

            let tasks = getTasksFromProject({ projectId: linkedProjectId });
            tasks.then((tasks) => {
              if (!tasks.length) { return; }
              return Promise.all(
                tasks
                  .map((task) => {
                    let mdContent = craft.markdown.markdownToCraftBlocks("- [ ] " + task.content + " [Todoist Task](todoist://task?id=" + task.id + ") [(Webview)](" + task.url + ")");
                    blocksToAdd = blocksToAdd.concat(mdContent);
                  })
              )
            })
              .then(() => {
                craft.dataApi.addBlocks(blocksToAdd);
              })
              .finally(() => {
                setIsLoading(false);
                toast({
                  position: "bottom",
                  render: () => (
                    <Center>
                      <Box color='white' w='80%' borderRadius='lg' p={3} bg='blue.500'>
                        Imported Tasks from project
                  </Box>
                    </Center>
                  ),
                })
              });

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
        } else {
          setIsLoading(false);
          toast({
            position: "bottom",
            render: () => (
              <Center>
                <Box color='white' w='80%' borderRadius='lg' p={3} bg='red.500'>
                  document is not linked to a project
            </Box>
              </Center>
            ),
          })
        }
      });



  }
  return (
    <Button
      leftIcon={<ArrowDownIcon />}
      colorScheme='red'
      onClick={onClick}
      width="100%"
      mb="2"
      isLoading={isLoading}
    >
      Import Tasks from linked Project
      </Button>
  );
}

export default ImportTasksFromLinkedProjectButton;
