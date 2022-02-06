import React from "react";
import { Button } from "@chakra-ui/button";
import { CalendarIcon } from "@chakra-ui/icons";
import * as TodoistWrapper from "../todoistApiWrapper";
import * as CraftBlockInteractor from "../craftBlockInteractor";
import { useToast } from "@chakra-ui/toast";
import { Box, Center } from "@chakra-ui/react";
import { CraftBlockInsert } from "@craftdocs/craft-extension-api";
import { useRecoilValue } from "recoil";



// interface NestedTask {
//   task: TodoistWrapper.todoistTaskType;
//   //  subtasks: NestedTask[]
//   children?: NestedTask[];
// }
//
//
// function getParentTask(nestedTask: NestedTask, parentTaskId: number): NestedTask | undefined {
//   if (nestedTask.task.id == parentTaskId) {
//     return nestedTask;
//   } else if (nestedTask.children != undefined) {
//     let result = undefined;
//     for (let i = 0; result == undefined && i < nestedTask.children.length; i++) {
//       result = getParentTask(nestedTask.children[i], parentTaskId);
//     }
//     return result;
//   }
//   return undefined
// }
//
//
// function createBlocksFromNestedTasks(tasks: NestedTask[], indentationLevel: number) {
//   let blocksToAdd: CraftBlockInsert[] = [];
//
//   tasks.forEach((curTask) => {
//     let mdContent = craft.markdown.markdownToCraftBlocks("- [ ] " + curTask.task.content);
//
//     mdContent.forEach((block) => {
//       block.indentationLevel = indentationLevel;
//     })
//
//
//     blocksToAdd = blocksToAdd.concat(mdContent);
//
//     if (curTask.children != undefined) {
//       blocksToAdd = blocksToAdd.concat(createBlocksFromNestedTasks(curTask.children, indentationLevel + 1));
//     }
//     // indentationLevel = indentationLevel + 1;
//
//   })
//
//   return blocksToAdd;
//
// }




const ImportTodaysTasksButton: React.FC = () => {
  const toast = useToast();
  const projectList = useRecoilValue(TodoistWrapper.projects);
  const getTodaysTasks = TodoistWrapper.useGetTodaysTasks();
  const [isLoading, setIsLoading] = React.useState(false);
  let blocksToAdd: CraftBlockInsert[] = [];
  const onClick = async () => {
    setIsLoading(true);
    let existingTaskIds = await CraftBlockInteractor.getCurrentTodoistTaskIdsOfTasksOnPage();

        const todaysTasks = await getTodaysTasks();

        blocksToAdd = blocksToAdd.concat(TodoistWrapper.createGroupedBlocksFromFlatTaskArray(projectList,todaysTasks, true, existingTaskIds))



craft.dataApi.addBlocks(blocksToAdd);
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


    // let tasks = getTodaysTasks();
    // tasks.then((tasks) => {
    //   if (!tasks.length) { return; }
    //   return Promise.all(
    //     tasks
    //       .map((task) => {
    //         if (!existingTaskIds.includes(task.id)) {
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
    //             Imported Todays Tasks
    //         </Box>
    //         </Center>
    //       ),
    //     })
    //   });
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
