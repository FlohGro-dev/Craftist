import { Button } from "@chakra-ui/button";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Center, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { CraftBlockInsert } from "@craftdocs/craft-extension-api";
import React from "react";
import { useRecoilValue } from "recoil";
import * as TodoistWrapper from "../todoistApiWrapper";

const LinkToExistingProjectButton: React.FC = () => {
  // const projectList = useRecoilValue(States.projects);
  const toast = useToast();
  const projectList = useRecoilValue(TodoistWrapper.projects);
  const onClick = async (projectName: string, projectId: string, projectUrl: string) => {
    let blocksToAdd: CraftBlockInsert[] = [];
    const getPageResult = await craft.dataApi.getCurrentPage();

    if (getPageResult.status !== "success") {
      throw new Error(getPageResult.message)
    }
    const pageBlock = getPageResult.data

    let mdContent = craft.markdown.markdownToCraftBlocks("Project in Todoist: [" + projectName + "](todoist://project?id=" + projectId + ") [(Webview)](" + projectUrl + ")");
    blocksToAdd = blocksToAdd.concat(mdContent);

    const loc = craft.location.indexLocation(pageBlock.id, 0);

    craft.dataApi.addBlocks(blocksToAdd, loc)
      .finally(() => {
        toast({
          position: "bottom",
          render: () => (
            <Center>
              <Box color='white' w='80%' borderRadius='lg' p={3} bg='blue.500'>
                Linked Note to Project
              </Box>
            </Center>
          ),
        })
      })

  }
  return (
    <Menu isLazy >
      {({ isOpen }) => (
        <>
          <MenuButton
            isActive={isOpen}
            as={Button}
            rightIcon={<ChevronDownIcon />}
            colorScheme='red'
            width="100%"
            mb="1">
            {isOpen ? 'Abort' : 'Link Note to Project'}
          </MenuButton >
          <MenuList>
            {
              projectList
                .map(
                  (x) => x
                )
                .sort((a, b) => ((a.order ?? 0) < (b.order ?? 0) ? -1 : 1))
                .map((project) => (
                  <MenuItem onClick={() => onClick(project.name, project.id, project.url)}>{project.name}</MenuItem>
                ))
            }
          </MenuList>
        </>
      )}
    </Menu>
  );
}

export default LinkToExistingProjectButton;
