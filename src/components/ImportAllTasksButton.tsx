import React from "react";
import { Button } from "@chakra-ui/button";
import { CalendarIcon } from "@chakra-ui/icons";
import * as TodoistWrapper from "../todoistApiWrapper";
import * as CraftBlockInteractor from "../craftBlockInteractor";
import { useToast } from "@chakra-ui/toast";
import { Box, Center } from "@chakra-ui/react";
import { CraftBlockInsert, CraftTextBlockInsert } from "@craftdocs/craft-extension-api";
const ImportAllTasksButton: React.FC = () => {
  const toast = useToast();

  const getAllTasks = TodoistWrapper.useGetAllTasks();

  const [isLoading, setIsLoading] = React.useState(false);
  let blocksToAdd: CraftBlockInsert[] = [];
  const onClick = () => {
    setIsLoading(true);

    let tasks = getAllTasks();

    tasks.then((tasks) => {
      if (!tasks.length) { return; }
      return Promise.all(
        tasks
          .map((task) => {
            let mdContent = craft.markdown.markdownToCraftBlocks("- [ ] " + task.content + " [Todoist Task](todoist://task?id=" + task.id + ") [(Webview)](" + task.url + ")");
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
                Imported All Tasks
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
      Import All Tasks
      </Button>
  );
}

export default ImportAllTasksButton;
