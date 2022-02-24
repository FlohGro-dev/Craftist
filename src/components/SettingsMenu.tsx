import React from "react";
import { Button } from "@chakra-ui/button";
import { SettingsIcon } from "@chakra-ui/icons";
import { Box, Center, Menu, MenuButton, MenuDivider, MenuItemOption, MenuList, MenuOptionGroup, useToast } from "@chakra-ui/react";
import { setSettingsDueDateUsage, setSettingsGroupAllTasksOption, setSettingsGroupProjectTasksOption, setSettingsGroupTodaysTasksOption, setSettingsMobileUrlUsage, setSettingsWebUrlUsage } from "../settingsUtils";

const SettingsMenu: React.FC = () => {
  // const projectList = useRecoilValue(States.projects);
  const toast = useToast();

  const onChangeLinks = async (value: string | string[]) => {

    switch(value){
      case 'webAndMobile': await setSettingsMobileUrlUsage(true); await setSettingsWebUrlUsage(true); break;
      case 'webOnly': await setSettingsMobileUrlUsage(false); await setSettingsWebUrlUsage(true); break;
      case 'mobileOnly': await setSettingsMobileUrlUsage(true); await setSettingsWebUrlUsage(false); break;
      case 'none': await setSettingsMobileUrlUsage(false); await setSettingsWebUrlUsage(false); break;
    }
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            Task Links set to {value}
          </Box>
        </Center>
      ),
    })
  }

  const onChangeDueDates = async (value: string | string[]) => {
    if (value.toString() == "enabled") {
      await setSettingsDueDateUsage(true);
    } else {
      await setSettingsDueDateUsage(false);
    }
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            Due dates {value}
          </Box>
        </Center>
      ),
    })
  }


  const onChangeTodayGrouping = async (value: string | string[]) => {
    await setSettingsGroupTodaysTasksOption(value.toString());
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            Grouping for Today Tasks changed to: {value}
          </Box>
        </Center>
      ),
    })
  }

  const onChangeProjectGrouping = async (value: string | string[]) => {
    await setSettingsGroupProjectTasksOption(value.toString());
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            Grouping for Today Tasks changed to: {value}
          </Box>
        </Center>
      ),
    })
  }

  const onChangeAllTasksGrouping = async (value: string | string[]) => {
    await setSettingsGroupAllTasksOption(value.toString());
    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            Grouping for Today Tasks changed to: {value}
          </Box>
        </Center>
      ),
    })
  }

  return (
    <Menu closeOnSelect={false}>
      {({ isOpen }) => (
        <>
          <MenuButton
            isActive={isOpen}
            as={Button}
            rightIcon={<SettingsIcon />}
            colorScheme='red'
            width="100%"
            mb="2">
            {isOpen ? 'Close Settings' : 'Settings'}
          </MenuButton >
          <MenuList>
            <MenuOptionGroup defaultValue='webAndMobile' title='Task Links' type='radio' onChange={(value) => onChangeLinks(value)}>
              <MenuItemOption value='webAndMobile'>Web and Mobile links</MenuItemOption>
              <MenuItemOption value='webOnly'>only Weblinks</MenuItemOption>
              <MenuItemOption value='mobileOnly'>only Mobile links</MenuItemOption>
              <MenuItemOption value='none'>no links (not recommended)</MenuItemOption>
            </MenuOptionGroup>
            <MenuDivider />
            <MenuDivider />
            <MenuOptionGroup defaultValue='enabled' title='Import Due Dates' type='radio' onChange={(value) => onChangeDueDates(value)}>
              <MenuItemOption value='enabled'>enabled</MenuItemOption>
              <MenuItemOption value='disabled'>disabled</MenuItemOption>
            </MenuOptionGroup>
            <MenuDivider />
            <MenuOptionGroup defaultValue='projectAndSection' title='Task Grouping for Import Todays Tasks' type='radio' onChange={(value) => onChangeTodayGrouping(value)}>
              <MenuItemOption value='none'>no grouping</MenuItemOption>
              <MenuItemOption value='projectAndSection'>group by project and section</MenuItemOption>
              <MenuItemOption value='projectOnly'>group by project</MenuItemOption>
              <MenuItemOption value='sectionOnly'>group by section</MenuItemOption>
            </MenuOptionGroup>
            <MenuDivider />
            <MenuOptionGroup defaultValue='sectionOnly' title='Task Grouping for Import Project Tasks' type='radio' onChange={(value) => onChangeProjectGrouping(value)}>
              <MenuItemOption value='none'>no grouping</MenuItemOption>
              <MenuItemOption value='projectAndSection'>group by project and section</MenuItemOption>
              <MenuItemOption value='projectOnly'>group by project</MenuItemOption>
              <MenuItemOption value='sectionOnly'>group by section</MenuItemOption>
            </MenuOptionGroup>
            <MenuDivider />
            <MenuOptionGroup defaultValue='projectAndSection' title='Task Grouping for All Tasks Import' type='radio' onChange={(value) => onChangeAllTasksGrouping(value)}>
              <MenuItemOption value='none'>no grouping</MenuItemOption>
              <MenuItemOption value='projectAndSection'>group by project and section</MenuItemOption>
              <MenuItemOption value='projectOnly'>group by project</MenuItemOption>
              <MenuItemOption value='sectionOnly'>group by section</MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </>
      )}
    </Menu>
  );
}
//<MenuItemOption value='byLabel'>group by label</MenuItemOption>
export default SettingsMenu;
