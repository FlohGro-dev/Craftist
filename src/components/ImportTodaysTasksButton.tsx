import { Button } from "@chakra-ui/button";
import { CalendarIcon } from "@chakra-ui/icons";
import { Box, Center } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { CraftBlockInsert } from "@craftdocs/craft-extension-api";
import React from "react";
import { useRecoilValue } from "recoil";
import * as CraftBlockInteractor from "../craftBlockInteractor";
import { createLocationContainerAfterCurrentSelection } from "../craftBlockInteractor";
import { getSettingsGroupTodaysTasksOption, taskImportAfterSelectedBlock, taskImportPersonalTasksOnly } from "../settingsUtils";
import * as TodoistWrapper from "../todoistApiWrapper";

const ImportTodaysTasksButton: React.FC = () => {
  const toast = useToast();
  const projectList = useRecoilValue(TodoistWrapper.projects);
  const sectionList = useRecoilValue(TodoistWrapper.sections);
  const labelList = useRecoilValue(TodoistWrapper.labels);
  const getTasksFromFilter = TodoistWrapper.useGetTasksFromFilter();
  const t = TodoistWrapper.useGetTodaysTasks();
  const [isLoading, setIsLoading] = React.useState(false);
  let blocksToAdd: CraftBlockInsert[] = [];
  const onClick = async () => {
    setIsLoading(true);
    let existingTaskIds = await CraftBlockInteractor.getCurrentTodoistTaskIdsOfTasksOnPage();

    try {
      let filterStr = "(overdue, today)"
      if (taskImportPersonalTasksOnly) {
        filterStr = filterStr + " & (assigned to: me | !assigned)"
      }
      const todaysTasks = await getTasksFromFilter({ filter: filterStr });

      let taskGroupingSettings = await getSettingsGroupTodaysTasksOption();

      blocksToAdd = blocksToAdd.concat(await TodoistWrapper.createGroupedBlocksFromFlatTaskArray(projectList, sectionList, labelList, todaysTasks, true, existingTaskIds, taskGroupingSettings, TodoistWrapper.tasksSortByOptions.priority))

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
      mb="1"
      isLoading={isLoading}
    >
      Import Todays Tasks
    </Button>
  );
}

export default ImportTodaysTasksButton;
