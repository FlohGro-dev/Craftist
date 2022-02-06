import React from "react";
import { Button } from "@chakra-ui/button";
import { DownloadIcon } from "@chakra-ui/icons";
import * as TodoistWrapper from "../todoistApiWrapper";
import * as CraftBlockInteractor from "../craftBlockInteractor";
import { useToast } from "@chakra-ui/toast";
import { Box, Center } from "@chakra-ui/react";
import { CraftBlockInsert } from "@craftdocs/craft-extension-api";
import { useRecoilValue } from "recoil";
const ImportAllTasksButton: React.FC = () => {
  const toast = useToast();

  const getAllTasks = TodoistWrapper.useGetAllTasks();
  const projectList = useRecoilValue(TodoistWrapper.projects);

  const [isLoading, setIsLoading] = React.useState(false);
  let blocksToAdd: CraftBlockInsert[] = [];
  const onClick = async () => {
    setIsLoading(true);

    let existingTaskIds = await CraftBlockInteractor.getCurrentTodoistTaskIdsOfTasksOnPage();


    const taskList = await getAllTasks();
    blocksToAdd = blocksToAdd.concat(TodoistWrapper.createGroupedBlocksFromFlatTaskArray(projectList,taskList, true, existingTaskIds))
    craft.dataApi.addBlocks(blocksToAdd);

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
    // let tasks = getAllTasks();
    //
    // tasks.then((tasks) => {
    //   if (!tasks.length) { return; }
    //   return Promise.all(
    //     tasks
    //       .map((task) => {
    //         if(!existingTaskIds.includes(task.id)){
    //           let mdContent = craft.markdown.markdownToCraftBlocks("- [ ] " + task.content + " [Todoist Task](todoist://task?id=" + task.id + ") [(Webview)](" + task.url + ")");
    //           blocksToAdd = blocksToAdd.concat(mdContent);
    //         }
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
    //             Imported All Tasks
    //         </Box>
    //         </Center>
    //       ),
    //     })
    //   });
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
      Import All Tasks
      </Button>
  );
}

export default ImportAllTasksButton;
