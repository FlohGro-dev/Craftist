import React from "react";
import { Button } from "@chakra-ui/button";
import { ChevronDownIcon } from "@chakra-ui/icons";
import * as TodoistWrapper from "../todoistApiWrapper";
import { useToast } from "@chakra-ui/toast";
import { Box, Center, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { CraftBlockInsert } from "@craftdocs/craft-extension-api";
import { useRecoilValue } from "recoil";

const LinkToExistingProjectButton: React.FC = () => {
  // const projectList = useRecoilValue(States.projects);
  const toast = useToast();
  const projectList = useRecoilValue(TodoistWrapper.projects);
  const onClick = async (projectName:string, projectId:number, projectUrl:string, projectSyncId?:number) => {
    let blocksToAdd: CraftBlockInsert[] = [];
    const getPageResult = await craft.dataApi.getCurrentPage();

    if (getPageResult.status !== "success") {
      throw new Error(getPageResult.message)
    }
    const pageBlock = getPageResult.data

// check if its a shared project
    if(projectSyncId){
      let mdContent2 = craft.markdown.markdownToCraftBlocks("Project in Todoist with SyncId only Webview link for now if both should have access: [" + projectName + "](" + projectUrl + ")");
      blocksToAdd = blocksToAdd.concat(mdContent2);
    } else {
      let mdContent = craft.markdown.markdownToCraftBlocks("Project in Todoist: [" + projectName + "](todoist://project?id=" + projectId + ") [(Webview)](" + projectUrl + ")");
      blocksToAdd = blocksToAdd.concat(mdContent);
    }

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
          mb="2">
            {isOpen ? 'Abort' : 'Link Note to Project'}
          </MenuButton >
          <MenuList>
            {
              projectList
              .map(
                (x) => x
              )
              //.sort((a, b) => ((a.order ?? 0) < (b.order ?? 0) ? -1 : 1))
              .sort((a, b) => ((a.name ?? 0) < (b.name ?? 0) ? -1 : 1))
              .map((project) => (
                <MenuItem onClick={() => onClick(project.name, project.id, project.url, project.syncId)}>{project.name}</MenuItem>
              ))
            }
          </MenuList>
        </>
      )}
    </Menu>
  );
}

export default LinkToExistingProjectButton;
