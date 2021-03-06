import { Button } from "@chakra-ui/button";
import { DownloadIcon } from "@chakra-ui/icons";
import { Box, Center } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { CraftBlockInsert } from "@craftdocs/craft-extension-api";
import React from "react";
import { useRecoilValue } from "recoil";
import { createLocationContainerAfterCurrentSelection } from "../craftBlockInteractor";
import { getSettingsGroupAllTasksOption, taskImportAfterSelectedBlock } from "../settingsUtils";
import * as TodoistWrapper from "../todoistApiWrapper";

const ImportAllTasksButton: React.FC = () => {
  const toast = useToast();

  const getAllTasks = TodoistWrapper.useGetAllTasks();
  const projectList = useRecoilValue(TodoistWrapper.projects);
  const sectionList = useRecoilValue(TodoistWrapper.sections);
  const labelList = useRecoilValue(TodoistWrapper.labels);
  const [isLoading, setIsLoading] = React.useState(false);
  let blocksToAdd: CraftBlockInsert[] = [];
  const onClick = async () => {
    setIsLoading(true);

    // disabled for import all tasks
    //    let existingTaskIds = await CraftBlockInteractor.getCurrentTodoistTaskIdsOfTasksOnPage();

    try {
      const taskList = await getAllTasks()
      let taskGroupingSettings = await getSettingsGroupAllTasksOption();
      blocksToAdd = blocksToAdd.concat(await TodoistWrapper.createGroupedBlocksFromFlatTaskArray(projectList, sectionList, labelList, taskList, false, [], taskGroupingSettings))

      if (taskImportAfterSelectedBlock == "enabled") {
        let location = await createLocationContainerAfterCurrentSelection();
        if (location) {
          craft.dataApi.addBlocks(blocksToAdd, location);
        } else {
          craft.dataApi.addBlocks(blocksToAdd);
        }
      } else {
        craft.dataApi.addBlocks(blocksToAdd);
      }
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
  return (
    <Button
      leftIcon={<DownloadIcon />}
      colorScheme='red'
      onClick={onClick}
      width="100%"
      mb="1"
      isLoading={isLoading}
    >
      Import All Tasks
    </Button>
  );
}

export default ImportAllTasksButton;
