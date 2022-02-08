import React from "react";
import { Button } from "@chakra-ui/button";
import { DownloadIcon } from "@chakra-ui/icons";
import * as TodoistWrapper from "../todoistApiWrapper";
import { useToast } from "@chakra-ui/toast";
import { Box, Center } from "@chakra-ui/react";
import { CraftBlockInsert } from "@craftdocs/craft-extension-api";

const ImportProjectListButton: React.FC = () => {
  const toast = useToast();
  const getProjectList = TodoistWrapper.useGetProjects();
  const [isLoading, setIsLoading] = React.useState(false);
  let blocksToAdd: CraftBlockInsert[] = [];
  const onClick = () => {
    setIsLoading(true);
    let projects = getProjectList();
    projects.then((projects) => {
      if (!projects.length) { return; }
      return Promise.all(
        projects
          .sort((a, b) => ((a.order ?? 0) < (b.order ?? 0) ? -1 : 1))
          .map((project) => {
            let mdContent = craft.markdown.markdownToCraftBlocks("- [" + project.name + "](todoist://project?id=" + project.id + ") [(Webview)](" + project.url + ")");
            blocksToAdd = blocksToAdd.concat(mdContent);

          })
      )
    })
      .then(() => {
        craft.dataApi.addBlocks(blocksToAdd);
      })
      .finally(() => {
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
      });
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
