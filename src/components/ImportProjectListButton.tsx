import React from "react";
import { Button } from "@chakra-ui/button";
import { CalendarIcon } from "@chakra-ui/icons";
import * as TodoistWrapper from "../todoistApiWrapper";
import * as CraftBlockInteractor from "../craftBlockInteractor";
import { useToast } from "@chakra-ui/toast";
import { Box, Center } from "@chakra-ui/react";
import { CraftBlockInsert } from "@craftdocs/craft-extension-api";

const ImportProjectListButton: React.FC = () => {
  // const projectList = useRecoilValue(States.projects);
  const toast = useToast();
  const getProjectList = TodoistWrapper.useGetProjects();
  const [isLoading, setIsLoading] = React.useState(false);
  let blocksToAdd:CraftBlockInsert[] = [];
  const onClick = () => {
    setIsLoading(true);
    let projects = getProjectList();
    projects.then((projects) => {
      if(!projects.length){return;}
return Promise.all(
  projects
  .map((project) => {
    var urlsForBlock = new Map([
[ project.name,"todoist://project?id=" + project.id ],
        [ "(Webview)",project.url ]
     ]);


     let blockToAdd = CraftBlockInteractor.createExternalLinkBlockFromStringAndUrlMap(urlsForBlock);
     blockToAdd.listStyle = craft.blockFactory.defaultListStyle("bullet");
blocksToAdd.push(blockToAdd);
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
      leftIcon={<CalendarIcon />}
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
