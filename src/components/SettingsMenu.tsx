import React from "react";
import { Button } from "@chakra-ui/button";
import { SettingsIcon } from "@chakra-ui/icons";
import { Box, Center, Checkbox, CheckboxGroup, FormControl, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, StackDivider, useDisclosure, useToast } from "@chakra-ui/react";
import { setSettingsDescriptionUsage, setSettingsDueDateUsage, setSettingsGroupAllTasksOption, setSettingsGroupProjectTasksOption, setSettingsGroupTodaysTasksOption, setSettingsImportAfterSelectedBlockOption, setSettingsLabelsUsage, setSettingsMobileUrlUsage, setSettingsSetDueDateBasedOnDailyNoteOption, setSettingsWebUrlUsage, taskGroupingAllValues, taskGroupingProjectValues, taskGroupingTodayValues, taskImportAfterSelectedBlock, taskLinkSettingsValues, taskMetadataSettingsValues, taskSetDueDatesBasedOnDailyNote } from "../settingsUtils";



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
            Due dates {value ? "enabled":"disabled"}
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
            Labels {value ? "enabled":"disabled"}
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
            Descriptions {value ? "enabled":"disabled"}
          </Box>
        </Center>
      ),
    })
  }


  const onChangeWebUrls = async (value: boolean) => {
    const settingsString = "web"
    let toastActive = false;
    const index = taskLinkSettingsValues.indexOf(settingsString, 0);
    if(value){
      if (index == -1) {
      taskLinkSettingsValues.push(settingsString)
    }
    } else {
      if (index > -1) {
        taskLinkSettingsValues.splice(index, 1);
        if(taskLinkSettingsValues.length == 0){
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
    if(!toastActive){
      toast({
        position: "bottom",
        render: () => (
          <Center>
            <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
              Web URLs {value ? "enabled":"disabled"}
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
    if(value){
      if (index == -1) {
      taskLinkSettingsValues.push(settingsString)
    }
    } else {
      if (index > -1) {
        taskLinkSettingsValues.splice(index, 1);
        if(taskLinkSettingsValues.length == 0){
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
    if(!toastActive){
      toast({
        position: "bottom",
        render: () => (
          <Center>
            <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
              Mobile URLs {value ? "enabled":"disabled"}
            </Box>
          </Center>
        ),
      })
    }
  }

  const onChangeTaskGroupingTodayProjects = async (value: boolean) => {
    const settingsString = "projects"
    const index = taskGroupingTodayValues.indexOf(settingsString, 0);
    if(value){
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
    if(value){
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
    if (projectsIndex > -1 && sectionsIndex > -1){
      // both present
      newSetting = "projectAndSection"
    } else if (projectsIndex > -1 && sectionsIndex == -1){
      // projects only
      newSetting = "projectOnly"
    } else if (projectsIndex == -1 && sectionsIndex > -1){
      // sections only
      newSetting = "sectionOnly"
    } else if (projectsIndex == -1 && sectionsIndex == -1){
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
    if(value){
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
    if(value){
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
    if (projectsIndex > -1 && sectionsIndex > -1){
      // both present
      newSetting = "projectAndSection"
    } else if (projectsIndex > -1 && sectionsIndex == -1){
      // projects only
      newSetting = "projectOnly"
    } else if (projectsIndex == -1 && sectionsIndex > -1){
      // sections only
      newSetting = "sectionOnly"
    } else if (projectsIndex == -1 && sectionsIndex == -1){
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
    if(value){
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
    if(value){
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
    if (projectsIndex > -1 && sectionsIndex > -1){
      // both present
      newSetting = "projectAndSection"
    } else if (projectsIndex > -1 && sectionsIndex == -1){
      // projects only
      newSetting = "projectOnly"
    } else if (projectsIndex == -1 && sectionsIndex > -1){
      // sections only
      newSetting = "sectionOnly"
    } else if (projectsIndex == -1 && sectionsIndex == -1){
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

  const onChangeEnableImportAfterSelectedBlocks = async (enable:boolean) => {
    await setSettingsImportAfterSelectedBlockOption(enable)
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            Location After Selected Block {enable ? "enabled":"disabled"}
          </Box>
        </Center>
      ),
    })
  }

  const onChangeEnableSetDueDateBasedOnDailyNote = async (enable:boolean) => {
    await setSettingsSetDueDateBasedOnDailyNoteOption(enable)
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            Due Dates based on Daily Notes {enable ? "enabled":"disabled"}
          </Box>
        </Center>
      ),
    })
  }


  return (
    <>
      <Button onClick={onOpen}
      width="100%"
      mb="2"
      //isLoading={isLoading}
      rightIcon={<SettingsIcon />}
      colorScheme='red'
      variant='solid'
      >Settings</Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
        <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
            <Stack spacing={[1, 5]} direction={['column', 'row']} divider={<StackDivider borderColor='gray.200' />}>
            <CheckboxGroup colorScheme='red' defaultValue={taskLinkSettingsValues}> Task Links
              <Stack spacing={[1, 5]} direction={['column', 'row']}>
              <Checkbox value='mobile' onChange={(value) => onChangeMobileUrls(value.target.checked)}>mobile</Checkbox>
              <Checkbox value='web' onChange={(value) => onChangeWebUrls(value.target.checked)}>web</Checkbox>
              </Stack>
            </CheckboxGroup>
              <CheckboxGroup colorScheme='red' defaultValue={taskMetadataSettingsValues}> task metadata import
                <Stack spacing={[1, 5]} direction={['column', 'row']}>
                <Checkbox value='dueDates' onChange={(value) => onChangeDueDates(value.target.checked)}>due dates</Checkbox> setTaskMetadataOptions
                <Checkbox value='labels' onChange={(value) => onChangeLabels(value.target.checked)}>labels</Checkbox>
                <Checkbox value='description' onChange={(value) => onChangeDescriptions(value.target.checked)}>description</Checkbox>
                </Stack>
              </CheckboxGroup>
              <CheckboxGroup colorScheme='red' defaultValue={taskGroupingTodayValues}> import todays tasks grouping
                <Stack spacing={[1, 5]} direction={['column', 'row']}>
                <Checkbox value='projects' onChange={(value) => onChangeTaskGroupingTodayProjects(value.target.checked)}>projects</Checkbox>
                <Checkbox value='sections' onChange={(value) => onChangeTaskGroupingTodaySections(value.target.checked)}>sections</Checkbox>
                </Stack>
              </CheckboxGroup>
              <CheckboxGroup colorScheme='red' defaultValue={taskGroupingProjectValues}> import project tasks grouping
                <Stack spacing={[1, 5]} direction={['column', 'row']}>
                <Checkbox value='projects' onChange={(value) => onChangeTaskGroupingProjectImportProjects(value.target.checked)}>projects</Checkbox>
                <Checkbox value='sections' onChange={(value) => onChangeTaskGroupingProjectImportSections(value.target.checked)}>sections</Checkbox>
                </Stack>
              </CheckboxGroup>
              <CheckboxGroup colorScheme='red' defaultValue={taskGroupingAllValues}> import all tasks grouping
                <Stack spacing={[1, 5]} direction={['column', 'row']}>
                <Checkbox value='projects' onChange={(value) => onChangeTaskGroupingAllProjects(value.target.checked)}>projects</Checkbox>
                <Checkbox value='sections' onChange={(value) => onChangeTaskGroupingAllSections(value.target.checked)}>sections</Checkbox>
                </Stack>
              </CheckboxGroup>
              <RadioGroup colorScheme='red' defaultValue={taskImportAfterSelectedBlock}> import tasks after selected blocks
              <Stack spacing={[1, 5]} direction={['column', 'row']}>
              <Radio value='enabled' onChange={() => onChangeEnableImportAfterSelectedBlocks(true)}>enabled</Radio>
              <Radio value='disabled' onChange={() => onChangeEnableImportAfterSelectedBlocks(false)}>disabled</Radio>
              </Stack>
              </RadioGroup>
              <RadioGroup colorScheme='red' defaultValue={taskSetDueDatesBasedOnDailyNote}> set due dates based on daily note
              <Stack spacing={[1, 5]} direction={['column', 'row']}>
              <Radio value='enabled' onChange={() => onChangeEnableSetDueDateBasedOnDailyNote(true)}>enabled</Radio>
              <Radio value='disabled' onChange={() => onChangeEnableSetDueDateBasedOnDailyNote(false)}>disabled</Radio>
              </Stack>
              </RadioGroup>
            </Stack>
            </FormControl>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
//<MenuItemOption value='byLabel'>group by label</MenuItemOption>
export default SettingsMenu;
