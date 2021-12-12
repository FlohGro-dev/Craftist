import React from "react";
import { Button } from "@chakra-ui/button";
import { CalendarIcon, LinkIcon } from "@chakra-ui/icons";
import * as TodoistWrapper from "../todoistApiWrapper";
import * as CraftBlockInteractor from "../craftBlockInteractor";
import { useToast } from "@chakra-ui/toast";
import { Box, Center } from "@chakra-ui/react";
import { CraftBlockInsert } from "@craftdocs/craft-extension-api";
const ImportTodaysTasksButton: React.FC = () => {
  const toast = useToast();
  const getTodaysTasks = TodoistWrapper.useGetTodaysTasks();
  const [isLoading, setIsLoading] = React.useState(false);
  let blocksToAdd:CraftBlockInsert[] = [];
  const onClick = () => {
    setIsLoading(true);
    let tasks = getTodaysTasks();
    tasks.then((tasks) => {
      if(!tasks.length){return;}
return Promise.all(
  tasks
  .map((task) => {
    var urlsForBlock = new Map([
[ "Todoist Task","todoist://task?id=" + task.id ],
        [ "Webview",task.url ]
     ]);


     let blockToAdd = CraftBlockInteractor.createExternalLinkBlockFromStringAndUrlMap(urlsForBlock," ", task.content);
     blockToAdd.listStyle = craft.blockFactory.defaultListStyle("todo");
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
                Imported Todays Tasks
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
      Import Todays Tasks
      </Button>
  );
}

export default ImportTodaysTasksButton;
