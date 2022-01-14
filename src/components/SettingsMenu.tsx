import React from "react";
import { Button } from "@chakra-ui/button";
import { SettingsIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/toast";
import { Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";

const SettingsMenu: React.FC = () => {
  // const projectList = useRecoilValue(States.projects);
  const toast = useToast();
  const onClick = async (value:string) => {
    switch(value){
      case "enableWebviewLinks":
        break;
      case "disableWebviewLinks":
        break;
    }
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
            <MenuOptionGroup title='Add Webview Links' type='radio'>
              <MenuItemOption value='true' onClick={() => onClick("enableWebviewLinks")}>yes</MenuItemOption>
              <MenuItemOption value='false'onClick={() => onClick("disableWebviewLinks")}>no</MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </>
      )}
    </Menu>
  );
}

export default SettingsMenu;
