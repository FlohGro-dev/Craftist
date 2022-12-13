import { Box, Center, Checkbox, CheckboxGroup, FormControl, Radio, RadioGroup, Stack, StackDivider, useDisclosure, useToast } from "@chakra-ui/react";
import React from "react";
import { setSettingsDescriptionUsage, setSettingsDueDateUsage, setSettingsGroupAllTasksOption, setSettingsGroupLabelTasksOption, setSettingsGroupProjectTasksOption, setSettingsGroupTodaysTasksOption, setSettingsImportAfterSelectedBlockOption, setSettingsLabelsUsage, setSettingsMobileUrlUsage, setSettingsPrioritiesUsage, setSettingsSetContinuousSyncMode, setSettingsSetDueDateBasedOnDailyNoteOption, setSettingsSetUsePersonalTasksOnly, setSettingsWebUrlUsage, taskGroupingAllValues, taskGroupingLabelValues, taskGroupingProjectValues, taskGroupingTodayValues, taskImportAfterSelectedBlock, taskImportPersonalTasksOnly, taskLinkSettingsValues, taskMetadataSettingsValues, taskSetDueDatesBasedOnDailyNote, taskSyncContinuousMode } from "../settingsUtils";



const SettingsMenu: React.FC = () => {
  // const projectList = useRecoilValue(States.projects);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onChangeDueDates = async (value: boolean) => {
    await setSettingsDueDateUsage(value);
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            Due dates {value ? "enabled" : "disabled"}
          </Box>
        </Center>
      ),
    })
  }

  const onChangeLabels = async (value: boolean) => {
    await setSettingsLabelsUsage(value);
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            Labels {value ? "enabled" : "disabled"}
          </Box>
        </Center>
      ),
    })
  }

  const onChangeDescriptions = async (value: boolean) => {
    await setSettingsDescriptionUsage(value);
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            Descriptions {value ? "enabled" : "disabled"}
          </Box>
        </Center>
      ),
    })
  }

  const onChangePriorities = async (value: boolean) => {
    await setSettingsPrioritiesUsage(value);
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            Priorities {value ? "enabled" : "disabled"}
          </Box>
        </Center>
      ),
    })
  }


  const onChangeWebUrls = async (value: boolean) => {
    const settingsString = "web"
    let toastActive = false;
    const index = taskLinkSettingsValues.indexOf(settingsString, 0);
    if (value) {
      if (index == -1) {
        taskLinkSettingsValues.push(settingsString)
      }
    } else {
      if (index > -1) {
        taskLinkSettingsValues.splice(index, 1);
        if (taskLinkSettingsValues.length == 0) {
          // no more links are enabled - display warning
          toast({
            position: "bottom",
            render: () => (
              <Center>
                <Box color='white' w='80%' borderRadius='lg' p={3} bg='yellow.500'>
                  all URLs disabled - syncing states will not work anymore
                </Box>
              </Center>
            ),
          })
          toastActive = true;
        }
      }
    }
    await setSettingsWebUrlUsage(value);
    if (!toastActive) {
      toast({
        position: "bottom",
        render: () => (
          <Center>
            <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
              Web URLs {value ? "enabled" : "disabled"}
            </Box>
          </Center>
        ),
      })
    }
  }

  const onChangeMobileUrls = async (value: boolean) => {
    const settingsString = "mobile"
    let toastActive = false;
    const index = taskLinkSettingsValues.indexOf(settingsString, 0);
    if (value) {
      if (index == -1) {
        taskLinkSettingsValues.push(settingsString)
      }
    } else {
      if (index > -1) {
        taskLinkSettingsValues.splice(index, 1);
        if (taskLinkSettingsValues.length == 0) {
          // no more links are enabled - display warning
          toast({
            position: "bottom",
            render: () => (
              <Center>
                <Box color='white' w='80%' borderRadius='lg' p={3} bg='yellow.500'>
                  all URLs disabled - syncing states will not work anymore
                </Box>
              </Center>
            ),
          })
          toastActive = true;
        }
      }
    }
    await setSettingsMobileUrlUsage(value);
    if (!toastActive) {
      toast({
        position: "bottom",
        render: () => (
          <Center>
            <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
              Mobile URLs {value ? "enabled" : "disabled"}
            </Box>
          </Center>
        ),
      })
    }
  }

  const onChangeTaskGroupingTodayProjects = async (value: boolean) => {
    const settingsString = "projects"
    const index = taskGroupingTodayValues.indexOf(settingsString, 0);
    if (value) {
      if (index == -1) {
        taskGroupingTodayValues.push(settingsString)
      }
    } else {
      if (index > -1) {
        taskGroupingTodayValues.splice(index, 1);
      }
    }
    await applyTaskTodayGrouping();
  }

  const onChangeTaskGroupingTodaySections = async (value: boolean) => {
    const settingsString = "sections"
    const index = taskGroupingTodayValues.indexOf(settingsString, 0);
    if (value) {
      if (index == -1) {
        taskGroupingTodayValues.push(settingsString)
      }
    } else {
      if (index > -1) {
        taskGroupingTodayValues.splice(index, 1);
      }
    }
    await applyTaskTodayGrouping();
  }


  const applyTaskTodayGrouping = async () => {
    let projectsIndex = taskGroupingTodayValues.indexOf("projects");
    let sectionsIndex = taskGroupingTodayValues.indexOf("sections");
    let newSetting = "";
    if (projectsIndex > -1 && sectionsIndex > -1) {
      // both present
      newSetting = "projectAndSection"
    } else if (projectsIndex > -1 && sectionsIndex == -1) {
      // projects only
      newSetting = "projectOnly"
    } else if (projectsIndex == -1 && sectionsIndex > -1) {
      // sections only
      newSetting = "sectionOnly"
    } else if (projectsIndex == -1 && sectionsIndex == -1) {
      // none
      newSetting = "none"
    }
    await setSettingsGroupTodaysTasksOption(newSetting);
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            Today Task Grouping changed to {newSetting}
          </Box>
        </Center>
      ),
    })
  }

  const onChangeTaskGroupingAllProjects = async (value: boolean) => {
    const settingsString = "projects"
    const index = taskGroupingAllValues.indexOf(settingsString, 0);
    if (value) {
      if (index == -1) {
        taskGroupingAllValues.push(settingsString)
      }
    } else {
      if (index > -1) {
        taskGroupingAllValues.splice(index, 1);
      }
    }
    await applyTaskAllGrouping();
  }

  const onChangeTaskGroupingAllSections = async (value: boolean) => {
    const settingsString = "sections"
    const index = taskGroupingAllValues.indexOf(settingsString, 0);
    if (value) {
      if (index == -1) {
        taskGroupingAllValues.push(settingsString)
      }
    } else {
      if (index > -1) {
        taskGroupingAllValues.splice(index, 1);
      }
    }
    await applyTaskAllGrouping();
  }


  const applyTaskAllGrouping = async () => {
    let projectsIndex = taskGroupingAllValues.indexOf("projects");
    let sectionsIndex = taskGroupingAllValues.indexOf("sections");
    let newSetting = "";
    if (projectsIndex > -1 && sectionsIndex > -1) {
      // both present
      newSetting = "projectAndSection"
    } else if (projectsIndex > -1 && sectionsIndex == -1) {
      // projects only
      newSetting = "projectOnly"
    } else if (projectsIndex == -1 && sectionsIndex > -1) {
      // sections only
      newSetting = "sectionOnly"
    } else if (projectsIndex == -1 && sectionsIndex == -1) {
      // none
      newSetting = "none"
    }
    await setSettingsGroupAllTasksOption(newSetting);
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            All Tasks Grouping changed to {newSetting}
          </Box>
        </Center>
      ),
    })
  }


  const onChangeTaskGroupingProjectImportProjects = async (value: boolean) => {
    const settingsString = "projects"
    const index = taskGroupingProjectValues.indexOf(settingsString, 0);
    if (value) {
      if (index == -1) {
        taskGroupingProjectValues.push(settingsString)
      }
    } else {
      if (index > -1) {
        taskGroupingProjectValues.splice(index, 1);
      }
    }
    await applyTaskProjectImportGrouping();
  }

  const onChangeTaskGroupingProjectImportSections = async (value: boolean) => {
    const settingsString = "sections"
    const index = taskGroupingProjectValues.indexOf(settingsString, 0);
    if (value) {
      if (index == -1) {
        taskGroupingProjectValues.push(settingsString)
      }
    } else {
      if (index > -1) {
        taskGroupingProjectValues.splice(index, 1);
      }
    }
    await applyTaskProjectImportGrouping();
  }


  const applyTaskProjectImportGrouping = async () => {
    let projectsIndex = taskGroupingProjectValues.indexOf("projects");
    let sectionsIndex = taskGroupingProjectValues.indexOf("sections");
    let newSetting = "";
    if (projectsIndex > -1 && sectionsIndex > -1) {
      // both present
      newSetting = "projectAndSection"
    } else if (projectsIndex > -1 && sectionsIndex == -1) {
      // projects only
      newSetting = "projectOnly"
    } else if (projectsIndex == -1 && sectionsIndex > -1) {
      // sections only
      newSetting = "sectionOnly"
    } else if (projectsIndex == -1 && sectionsIndex == -1) {
      // none
      newSetting = "none"
    }
    await setSettingsGroupProjectTasksOption(newSetting);
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            Project Tasks Import Grouping changed to {newSetting}
          </Box>
        </Center>
      ),
    })
  }

  const onChangeTaskGroupingLabelProjects = async (value: boolean) => {
    const settingsString = "projects"
    const index = taskGroupingLabelValues.indexOf(settingsString, 0);
    if (value) {
      if (index == -1) {
        taskGroupingLabelValues.push(settingsString)
      }
    } else {
      if (index > -1) {
        taskGroupingLabelValues.splice(index, 1);
      }
    }
    await applyTaskLabelImportGrouping();
  }

  const onChangeTaskGroupingLabelSections = async (value: boolean) => {
    const settingsString = "sections"
    const index = taskGroupingLabelValues.indexOf(settingsString, 0);
    if (value) {
      if (index == -1) {
        taskGroupingLabelValues.push(settingsString)
      }
    } else {
      if (index > -1) {
        taskGroupingLabelValues.splice(index, 1);
      }
    }
    await applyTaskLabelImportGrouping();
  }


  const applyTaskLabelImportGrouping = async () => {
    let projectsIndex = taskGroupingLabelValues.indexOf("projects");
    let sectionsIndex = taskGroupingLabelValues.indexOf("sections");
    let newSetting = "";
    if (projectsIndex > -1 && sectionsIndex > -1) {
      // both present
      newSetting = "projectAndSection"
    } else if (projectsIndex > -1 && sectionsIndex == -1) {
      // projects only
      newSetting = "projectOnly"
    } else if (projectsIndex == -1 && sectionsIndex > -1) {
      // sections only
      newSetting = "sectionOnly"
    } else if (projectsIndex == -1 && sectionsIndex == -1) {
      // none
      newSetting = "none"
    }
    await setSettingsGroupLabelTasksOption(newSetting);
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            Label Tasks Import Grouping changed to {newSetting}
          </Box>
        </Center>
      ),
    })
  }




  const onChangeEnableImportAfterSelectedBlocks = async (enable: boolean) => {
    await setSettingsImportAfterSelectedBlockOption(enable)
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            Location After Selected Block {enable ? "enabled" : "disabled"}
          </Box>
        </Center>
      ),
    })
  }

  const onChangeEnableSetDueDateBasedOnDailyNote = async (enable: boolean) => {
    await setSettingsSetDueDateBasedOnDailyNoteOption(enable)
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            Due Dates based on Daily Notes {enable ? "enabled" : "disabled"}
          </Box>
        </Center>
      ),
    })
  }

  const onChangeSetContinuousSyncMode = async (enable: boolean) => {
    await setSettingsSetContinuousSyncMode(enable)
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            Continuous Task Sync {enable ? "enabled" : "disabled"}
          </Box>
        </Center>
      ),
    })
  }

  const onChangeSetImportPersonalTasksOnly = async (enable: boolean) => {
    await setSettingsSetUsePersonalTasksOnly(enable)
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            Use Personal Tasks only {enable ? "enabled" : "disabled"}
          </Box>
        </Center>
      ),
    })
  }

  //   const onChangeSetUseClutterFreeView = async (enable: boolean) => {
  //     await setSettingsSetUseClutterFreeView(enable)
  //     toast({
  //       position: "bottom",
  //       render: () => (
  //         <Center>
  //           <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
  //             Clutter Free View {enable ? "enabled" : "disabled"}
  //           </Box>
  //         </Center>
  //       ),
  //     })
  //   }
  //   <RadioGroup colorScheme='red' defaultValue={String(taskBlocksUseClutterFreeView)}> use clutter free task view for task blocks
  //   <Stack spacing={[1, 2]} direction={['column', 'row']}>
  //     <Radio value='true' onChange={() => onChangeSetUseClutterFreeView(true)}>enabled</Radio>
  //     <Radio value='false' onChange={() => onChangeSetUseClutterFreeView(false)}>disabled</Radio>
  //   </Stack>
  // </RadioGroup>

  return (
    <>
      <FormControl>
        <Stack spacing={1} direction={['column']} divider={<StackDivider borderColor='gray.200' />}>
          <CheckboxGroup colorScheme='red' defaultValue={taskLinkSettingsValues}> Task Links
            <Stack spacing={[1, 2]} direction={['column', 'row']}>
              <Checkbox value='mobile' onChange={(value:any) => onChangeMobileUrls(value.target.checked)}>mobile</Checkbox>
              <Checkbox value='web' onChange={(value:any) => onChangeWebUrls(value.target.checked)}>web</Checkbox>
            </Stack>
          </CheckboxGroup>
          <CheckboxGroup colorScheme='red' defaultValue={taskMetadataSettingsValues}> task metadata import
            <Stack spacing={[1, 2]} direction={['column', 'row']}>
              <Checkbox value='dueDates' onChange={(value:any) => onChangeDueDates(value.target.checked)}>due dates</Checkbox> setTaskMetadataOptions
              <Checkbox value='labels' onChange={(value:any) => onChangeLabels(value.target.checked)}>labels</Checkbox>
              <Checkbox value='description' onChange={(value:any) => onChangeDescriptions(value.target.checked)}>description</Checkbox>
              <Checkbox value='priorities' onChange={(value:any) => onChangePriorities(value.target.checked)}>priorities</Checkbox>
            </Stack>
          </CheckboxGroup>
          <CheckboxGroup colorScheme='red' defaultValue={taskGroupingTodayValues}> import todays tasks grouping
            <Stack spacing={[1, 2]} direction={['column', 'row']}>
              <Checkbox value='projects' onChange={(value:any) => onChangeTaskGroupingTodayProjects(value.target.checked)}>projects</Checkbox>
              <Checkbox value='sections' onChange={(value:any) => onChangeTaskGroupingTodaySections(value.target.checked)}>sections</Checkbox>
            </Stack>
          </CheckboxGroup>
          <CheckboxGroup colorScheme='red' defaultValue={taskGroupingProjectValues}> import project tasks grouping
            <Stack spacing={[1, 2]} direction={['column', 'row']}>
              <Checkbox value='projects' onChange={(value:any) => onChangeTaskGroupingProjectImportProjects(value.target.checked)}>projects</Checkbox>
              <Checkbox value='sections' onChange={(value:any) => onChangeTaskGroupingProjectImportSections(value.target.checked)}>sections</Checkbox>
            </Stack>
          </CheckboxGroup>
          <CheckboxGroup colorScheme='red' defaultValue={taskGroupingAllValues}> import all tasks grouping
            <Stack spacing={[1, 2]} direction={['column', 'row']}>
              <Checkbox value='projects' onChange={(value:any) => onChangeTaskGroupingAllProjects(value.target.checked)}>projects</Checkbox>
              <Checkbox value='sections' onChange={(value:any) => onChangeTaskGroupingAllSections(value.target.checked)}>sections</Checkbox>
            </Stack>
          </CheckboxGroup>
          <CheckboxGroup colorScheme='red' defaultValue={taskGroupingLabelValues}> import label tasks grouping
            <Stack spacing={[1, 2]} direction={['column', 'row']}>
              <Checkbox value='projects' onChange={(value:any) => onChangeTaskGroupingLabelProjects(value.target.checked)}>projects</Checkbox>
              <Checkbox value='sections' onChange={(value:any) => onChangeTaskGroupingLabelSections(value.target.checked)}>sections</Checkbox>
            </Stack>
          </CheckboxGroup>
          <RadioGroup colorScheme='red' defaultValue={taskImportAfterSelectedBlock}> import tasks after selected blocks
            <Stack spacing={[1, 2]} direction={['column', 'row']}>
              <Radio value='enabled' onChange={() => onChangeEnableImportAfterSelectedBlocks(true)}>enabled</Radio>
              <Radio value='disabled' onChange={() => onChangeEnableImportAfterSelectedBlocks(false)}>disabled</Radio>
            </Stack>
          </RadioGroup>
          <RadioGroup colorScheme='red' defaultValue={taskSetDueDatesBasedOnDailyNote}> set due dates based on daily note
            <Stack spacing={[1, 2]} direction={['column', 'row']}>
              <Radio value='enabled' onChange={() => onChangeEnableSetDueDateBasedOnDailyNote(true)}>enabled</Radio>
              <Radio value='disabled' onChange={() => onChangeEnableSetDueDateBasedOnDailyNote(false)}>disabled</Radio>
            </Stack>
          </RadioGroup>
          <RadioGroup colorScheme='red' defaultValue={String(taskImportPersonalTasksOnly)}> import personal tasks only (not assigned to others)
            <Stack spacing={[1, 2]} direction={['column', 'row']}>
              <Radio value='true' onChange={() => onChangeSetImportPersonalTasksOnly(true)}>enabled</Radio>
              <Radio value='false' onChange={() => onChangeSetImportPersonalTasksOnly(false)}>disabled</Radio>
            </Stack>
          </RadioGroup>
          <RadioGroup colorScheme='red' defaultValue={taskSyncContinuousMode}> enable continous task sync (beta)
            <Stack spacing={[1, 2]} direction={['column', 'row']}>
              <Radio value='enabled' onChange={() => onChangeSetContinuousSyncMode(true)}>enabled</Radio>
              <Radio value='disabled' onChange={() => onChangeSetContinuousSyncMode(false)}>disabled</Radio>
            </Stack>
          </RadioGroup>
        </Stack>
      </FormControl>
    </>
  );
}
//<MenuItemOption value='byLabel'>group by label</MenuItemOption>
export default SettingsMenu;
