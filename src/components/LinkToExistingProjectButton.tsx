import React from "react";
import { Button } from "@chakra-ui/button";
import { ChevronDownIcon } from "@chakra-ui/icons";
import * as TodoistWrapper from "../todoistApiWrapper";
import { useToast } from "@chakra-ui/toast";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { CraftBlockInsert } from "@craftdocs/craft-extension-api";
import { useRecoilValue } from "recoil";

const LinkToExistingProjectButton: React.FC = () => {
  // const projectList = useRecoilValue(States.projects);
  const toast = useToast();
  const projectList = useRecoilValue(TodoistWrapper.projects);
  const [isLoading, setIsLoading] = React.useState(false);
  let blocksToAdd: CraftBlockInsert[] = [];
  const onClick = async (projectName:string, projectId:number, projectUrl:string) => {
    setIsLoading(true);

    const getPageResult = await craft.dataApi.getCurrentPage();

    if (getPageResult.status !== "success") {
      throw new Error(getPageResult.message)
    }
    const pageBlock = getPageResult.data

    let mdContent = craft.markdown.markdownToCraftBlocks("Project in Todoist: [" + projectName + "](todoist://project?id=" + projectId + ") [(Webview)](" + projectUrl + ")");
    blocksToAdd = blocksToAdd.concat(mdContent);

    const loc = craft.location.indexLocation(pageBlock.id, 0);

// The resulting loc object:
// {
//   type: "indexLocation",
//.  pageId: <pageId>,
//   index: 3,
// }

// loc can be used in the dataApi.addBlocks call

  craft.dataApi.addBlocks(blocksToAdd, loc);

    // let projects = getProjectList();
    // projects.then((projects) => {
    //   if (!projects.length) { return; }
    //   return Promise.all(
    //     projects
    //       .map((project) => {
    //         let mdContent = craft.markdown.markdownToCraftBlocks("- [" + project.name + "](todoist://project?id=" + project.id + ") [(Webview)](" + project.url + ")");
    //         blocksToAdd = blocksToAdd.concat(mdContent);
    //
    //       })
    //   )
    // })
    //   .then(() => {
    //     craft.dataApi.addBlocks(blocksToAdd);
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //     toast({
    //       position: "bottom",
    //       render: () => (
    //         <Center>
    //           <Box color='white' w='80%' borderRadius='lg' p={3} bg='blue.500'>
    //             Imported Project List
    //         </Box>
    //         </Center>
    //       ),
    //     })
    //   });
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
