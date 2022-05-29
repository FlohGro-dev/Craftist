import { Button } from "@chakra-ui/button";
import { ChevronDownIcon, DownloadIcon } from "@chakra-ui/icons";
import { Box, Center, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { CraftBlockInsert } from "@craftdocs/craft-extension-api";
import React from "react";
import { useRecoilValue } from "recoil";
import * as CraftBlockInteractor from "../craftBlockInteractor";
import { getSettingsGroupLabelTasksOption, taskImportAfterSelectedBlock, taskImportPersonalTasksOnly } from "../settingsUtils";
import * as TodoistWrapper from "../todoistApiWrapper";

const ImportTasksWithLabel: React.FC = () => {
  // const projectList = useRecoilValue(States.projects);
  const toast = useToast();
  const labelList = useRecoilValue(TodoistWrapper.labels)
  const projectList = useRecoilValue(TodoistWrapper.projects);
  const sectionList = useRecoilValue(TodoistWrapper.sections);
  const getTasksFromFilter = TodoistWrapper.useGetTasksFromFilter();
  const [isLoading, setIsLoading] = React.useState(false);

  const onClick = async (labelName: string) => {
    setIsLoading(true);
    let existingTaskIds = await CraftBlockInteractor.getCurrentTodoistTaskIdsOfTasksOnPage();
    let blocksToAdd: CraftBlockInsert[] = [];

    try {
      let filterStr = "@" + labelName
      if (taskImportPersonalTasksOnly) {
        filterStr = filterStr + " & (assigned to: me | !assigned)"
      }
      const labelTasks = await getTasksFromFilter({ filter: filterStr });

      let taskGroupingSettings = await getSettingsGroupLabelTasksOption();

      blocksToAdd = blocksToAdd.concat(await TodoistWrapper.createGroupedBlocksFromFlatTaskArray(projectList, sectionList, labelList, labelTasks, true, existingTaskIds, taskGroupingSettings, TodoistWrapper.tasksSortByOptions.priority))

      if (taskImportAfterSelectedBlock == "enabled") {
        let location = await CraftBlockInteractor.createLocationContainerAfterCurrentSelection();
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
    <Menu isLazy >
      {({ isOpen }) => (
        <>
          <MenuButton
            isActive={isOpen}
            as={Button}
            leftIcon={<DownloadIcon />}
            rightIcon={<ChevronDownIcon />}
            colorScheme='red'
            width="100%"
            isLoading={isLoading}
            mb="1">
            {isOpen ? 'Abort' : 'Import Tasks with Label'}
          </MenuButton >
          <MenuList>
            {
              labelList
                .map(
                  (x) => x
                )
                .map((label) => (
                  <MenuItem onClick={() => onClick(label.name)}>{label.name}</MenuItem>
                ))
            }
          </MenuList>
        </>
      )}
    </Menu>
  );
}

export default ImportTasksWithLabel;
