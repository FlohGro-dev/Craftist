import React from "react";
import { Button } from "@chakra-ui/button";
import { DownloadIcon } from "@chakra-ui/icons";
import * as TodoistWrapper from "../todoistApiWrapper";
import * as CraftBlockInteractor from "../craftBlockInteractor";
import { useToast } from "@chakra-ui/toast";
import { Box, Center } from "@chakra-ui/react";
import { CraftBlockInsert } from "@craftdocs/craft-extension-api";
import { useRecoilValue } from "recoil";
import { getSettingsGroupProjectTasksOption } from "../settingsUtils";

const ImportTasksFromLinkedProjectButton: React.FC = () => {
  // const projectList = useRecoilValue(States.projects);
  const toast = useToast();
  const todoistProjectUrl = TodoistWrapper.todoistProjectLinkUrl;
  const getTasksFromProject = TodoistWrapper.useGetTasksFromProject();
  const projectList = useRecoilValue(TodoistWrapper.projects);
  const sectionList = useRecoilValue(TodoistWrapper.sections);
  const [isLoading, setIsLoading] = React.useState(false);
  let blocksToAdd: CraftBlockInsert[] = [];
  const onClick = async () => {
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
      .finally(async () => {
        if (foundProjectIDs.length > 0) {
          if (foundProjectIDs.every((val, _i, arr) => val === arr[0])) {
            // all ids are equal - thats valid
            linkedProjectId = parseInt(foundProjectIDs[0]);

            try{
            let taskList = await getTasksFromProject({ projectId: linkedProjectId });

            taskList.sort()

            let existingTaskIds = await CraftBlockInteractor.getCurrentTodoistTaskIdsOfTasksOnPage();

            let taskGroupingSettings = await getSettingsGroupProjectTasksOption();

            blocksToAdd = blocksToAdd.concat(await TodoistWrapper.createGroupedBlocksFromFlatTaskArray(projectList, sectionList, taskList, true, existingTaskIds, taskGroupingSettings))



            craft.dataApi.addBlocks(blocksToAdd);

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
          } catch (error) {
            toast({
              position: "bottom",
              render: () => (
                <Center>
                  <Box color='white' w='80%' borderRadius='lg' p={3} bg='red.500'>
                    Failed importing Tasks - please try to login again
                </Box>
                </Center>
              ),
            })
            setIsLoading(false);
          }

          }
          else {
            setIsLoading(false);
            // not all ids are equal - this is not valid!
            toast({
              position: "bottom",
              duration: 3000,
              render: () => (
                <Center>
                  <Box color='white' w='80%' borderRadius='lg' p={3} bg='red.500'>
                    linkedProjectIds are not all equal please remove links to other projects
              </Box>
                </Center>
              ),
            });
          }
        } else {
          setIsLoading(false);
          toast({
            position: "bottom",
            duration: 3000,
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
      leftIcon={<DownloadIcon />}
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
