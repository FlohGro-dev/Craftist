import React from "react";
import { Button } from "@chakra-ui/button";
import { SettingsIcon } from "@chakra-ui/icons";
import { Box, Center, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, useToast } from "@chakra-ui/react";
import { setSettingsDueDateUsage, setSettingsMobileUrlUsage, setSettingsWebUrlUsage } from "../settingsUtils";

const SettingsMenu: React.FC = () => {
  // const projectList = useRecoilValue(States.projects);
  const toast = useToast();
  const onClick = async (value: string) => {
    let toastText = ""

    switch (value) {
      case "enableMobileUrls":
        await setSettingsMobileUrlUsage(true);
        toastText = "enabled mobile urls"
        break;
      case "disableMobileUrls":
        await setSettingsMobileUrlUsage(false);
        toastText = "disabled mobile urls"
        break;
      case "enableWebUrls":
        await setSettingsWebUrlUsage(true);
        toastText = "enabled web urls"
        break;
      case "disableWebUrls":
        await setSettingsWebUrlUsage(false);
        toastText = "disabled web urls"
        break;
      case "enableDueDates":
        await setSettingsDueDateUsage(true);
        toastText = "enabled due dates"
        break;
      case "disableDueDates":
        await setSettingsDueDateUsage(false);
        toastText = "disabled due dates"
        break;
    }

    toast({
      position: "bottom",
      render: () => (
        <Center>
          <Box color='white' w='80%' borderRadius='lg' p={3} bg='green.500'>
            {toastText}
          </Box>
        </Center>
      ),
    })
  }
  return (
    <Menu closeOnSelect={false} >
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
            <MenuGroup title='Mobile Links'>
              <MenuItem value='enableMobileUrls' onClick={() => onClick("enableMobileUrls")}>Enable Mobile Links</MenuItem>
              <MenuItem value='disableMobileUrls' onClick={() => onClick("disableMobileUrls")}>Disable Mobile Links</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title='Webview Links'>
              <MenuItem value='enableWebUrls' onClick={() => onClick("enableWebUrls")}>Enable Webview Links</MenuItem>
              <MenuItem value='disableWebUrls' onClick={() => onClick("disableWebUrls")}>Disable Webview Links</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title='Due Dates'>
              <MenuItem value='enableDueDates' onClick={() => onClick("enableDueDates")}>Enable Due Dates</MenuItem>
              <MenuItem value='disableDueDates' onClick={() => onClick("disableDueDates")}>Disable Due Dates</MenuItem>
            </MenuGroup>
          </MenuList>
        </>
      )}
    </Menu>
  );
}

export default SettingsMenu;
