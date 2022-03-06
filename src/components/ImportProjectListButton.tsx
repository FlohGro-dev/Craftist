import React from "react";
import { Button } from "@chakra-ui/button";
import { DownloadIcon } from "@chakra-ui/icons";
import * as TodoistWrapper from "../todoistApiWrapper";
import { useToast } from "@chakra-ui/toast";
import { Box, Center } from "@chakra-ui/react";
import { CraftBlockInsert } from "@craftdocs/craft-extension-api";
import { taskImportAfterSelectedBlock } from "../settingsUtils";
import { createLocationContainerAfterCurrentSelection } from "../craftBlockInteractor";

const ImportProjectListButton: React.FC = () => {
  const toast = useToast();
  const getProjectList = TodoistWrapper.useGetProjects();
  const [isLoading, setIsLoading] = React.useState(false);
  let blocksToAdd: CraftBlockInsert[] = [];
  const onClick = async () => {
    setIsLoading(true);

    try {
      let projects = await getProjectList()
      projects = projects.sort((a, b) => ((a.order ?? 0) < (b.order ?? 0) ? -1 : 1));
      projects.map((project) => {

        let mdContent = craft.markdown.markdownToCraftBlocks(TodoistWrapper.createProjectMdString(project, "- "));
        blocksToAdd = blocksToAdd.concat(mdContent);
      })

      if(taskImportAfterSelectedBlock == "enabled"){
        let location = await createLocationContainerAfterCurrentSelection();
        if(location){
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
                Imported Project List
            </Box>
            </Center>
          ),
        })
    } catch(error) {
      toast({
        position: "bottom",
        render: () => (
          <Center>
            <Box color='white' w='80%' borderRadius='lg' p={3} bg='red.500'>
              Failed importing project list - please try to login again
          </Box>
          </Center>
        ),
      })
      setIsLoading(false);
    }
  }
  return (
    <Button
      leftIcon={<DownloadIcon />}
      colorScheme='red'
      onClick={onClick}
      width="100%"
      mb="2"
      isLoading={isLoading}
    >
      Import Project List
      </Button>
  );
}


export default ImportProjectListButton;
