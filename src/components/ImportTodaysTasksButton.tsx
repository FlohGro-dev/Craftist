import React from "react";
import { Button } from "@chakra-ui/button";
import { CalendarIcon } from "@chakra-ui/icons";
import * as TodoistWrapper from "../todoistApiWrapper";
import * as CraftBlockInteractor from "../craftBlockInteractor";
import { useToast } from "@chakra-ui/toast";
import { Box, Center } from "@chakra-ui/react";
import { CraftBlockInsert } from "@craftdocs/craft-extension-api";
import { useRecoilValue } from "recoil";
import { getSettingsGroupTodaysTasksOption } from "../settingsUtils";

const ImportTodaysTasksButton: React.FC = () => {
  const toast = useToast();
  const projectList = useRecoilValue(TodoistWrapper.projects)
  const sectionList = useRecoilValue(TodoistWrapper.sections);
  const labelList = useRecoilValue(TodoistWrapper.labels);
  const getTodaysTasks = TodoistWrapper.useGetTodaysTasks();
  const [isLoading, setIsLoading] = React.useState(false);
  let blocksToAdd: CraftBlockInsert[] = [];
  const onClick = async () => {
    setIsLoading(true);
    let existingTaskIds = await CraftBlockInteractor.getCurrentTodoistTaskIdsOfTasksOnPage();

    try{
    const todaysTasks = await getTodaysTasks();

    let taskGroupingSettings = await getSettingsGroupTodaysTasksOption();

    blocksToAdd = blocksToAdd.concat(await TodoistWrapper.createGroupedBlocksFromFlatTaskArray(projectList, sectionList, labelList, todaysTasks, true, existingTaskIds, taskGroupingSettings, TodoistWrapper.tasksSortByOptions.priority))

    craft.dataApi.addBlocks(blocksToAdd);
    setIsLoading(false);
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='blue.500'>
            Imported Todays Tasks
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
      leftIcon={<CalendarIcon />}
      colorScheme='red'
      onClick={onClick}
      width="100%"
      mb="2"
      isLoading={isLoading}
    >
      Import Todays Tasks
      </Button>
  );
}

export default ImportTodaysTasksButton;
