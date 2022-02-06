import * as Recoil from "recoil";
import { TodoistApi, Project, Task } from "@doist/todoist-api-typescript";
import { CraftBlockInsert } from "@craftdocs/craft-extension-api";
import { useRecoilValue } from "recoil";


export const API_TOKEN_KEY = "TODOIST_API_TOKEN";

const globalScopeClient: { current?: TodoistApi } = { current: undefined };

export const apiToken = Recoil.atom({
  key: "todoistApiToken",
  default: "",
});

export const client = Recoil.atom<TodoistApi | undefined>({
  key: "client",
  default: Recoil.selector({
    key: "client:default",
    get: ({ get }) => {
      const token = get(apiToken);
      if (token) {
        globalScopeClient.current = new TodoistApi(token);
        return globalScopeClient.current;
      }
      return undefined;
    },
  }),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newValue) => {
        globalScopeClient.current = newValue;
      });
    },
  ],
});

export const useLoginCallback = () =>
  Recoil.useRecoilCallback(({ set }) => {
    return async (token: string) => {
      let cli = new TodoistApi(token);
      return cli.getProjects().then(async () => {
        set(apiToken, token);
        set(client, cli);
        await craft.storageApi.put(API_TOKEN_KEY, token);
        window.localStorage.setItem(API_TOKEN_KEY, token);
      });
    };
  });

export const useLogoutCallback = () =>
  Recoil.useRecoilCallback(({ reset }) => {
    return async () => {
      //        reset(projects);
      reset(apiToken);
      reset(client);
      await craft.storageApi.delete(API_TOKEN_KEY);
      window.localStorage.removeItem(API_TOKEN_KEY);
    };
  });

export const useAddTask = () => {
  return Recoil.useRecoilCallback(({ snapshot }) => {
    return async (params: {
      projectId?: number;
      content: string;
      description?: string;
    }) => {
      const cli = await snapshot.getPromise(client);
      if (!cli) {
        throw new Error("No client");
      }
      const resp = await cli.addTask(params);
      //set(taskFamily(resp.id), resp);
      return resp;
    };
  });
};

export const useCheckIfTaskIsCompleted = () => {
  return Recoil.useRecoilCallback(({ snapshot }) => {
    return async (params: {
      id: number
    }) => {
      const cli = await snapshot.getPromise(client);
      if (!cli) {
        throw new Error("No client");
      }
      const response = await cli.getTask(params.id);
      return response.completed
    };

  });
};


export const useCheckIfTaskIsRecurring = ()  => {
  return Recoil.useRecoilCallback(({ snapshot }) => {
    return async (params: {
      id: number
    }) => {
      const cli = await snapshot.getPromise(client);
      if (!cli) {
        throw new Error("No client");
      }
      const response = await cli.getTask(params.id);
      if(response.due?.recurring == true){
        return true;
      }
      else {
        return false;
      }
    };

  });
};


export const useSetTaskComplete = () => {
  return Recoil.useRecoilCallback(({ snapshot }) => {
    return async (params: {
      id: number
    }) => {
      const cli = await snapshot.getPromise(client);
      if (!cli) {
        throw new Error("No client");
      }
      const response = await cli.closeTask(params.id);
      return response
    };

  });
};

export const useGetTodaysTasks = () => {
  return Recoil.useRecoilCallback(({ snapshot }) => {
    return async () => {
      const cli = await snapshot.getPromise(client);
      if (!cli) {
        throw new Error("No client");
      }
      const response = await cli.getTasks({ "filter": "today | overdue" });
      return response
    };

  });
};

export const useGetAllTasks = () => {
  return Recoil.useRecoilCallback(({ snapshot }) => {
    return async () => {
      const cli = await snapshot.getPromise(client);
      if (!cli) {
        throw new Error("No client");
      }
      const response = await cli.getTasks({});
      return response
    };

  });
};

export const useGetTasksFromProject = () => {
  return Recoil.useRecoilCallback(({ snapshot }) => {
    return async (params: {
      projectId: number
    }) => {
      const cli = await snapshot.getPromise(client);
      if (!cli) {
        throw new Error("No client");
      }
      const response = await cli.getTasks(params);
      return response
    };

  });
};


export const useGetProjects = () => {
  return Recoil.useRecoilCallback(({ snapshot }) => {
    return async () => {
      const cli = await snapshot.getPromise(client);
      if (!cli) {
        throw new Error("No client");
      }
      const response = await cli.getProjects();
      return response
    };

  });
};

export const todoistProjectLinkUrl = "todoist://project?id="

export const projects = Recoil.atom<Project[]>({
  key: "projects",
  default: Recoil.selector({
    key: "projects:default",
    get: ({ get }) => {
      const cli = get(client);
      if (!cli) return [];
      return cli.getProjects();
    },
  }),
});

export const projectsDict = Recoil.selector({
  key: "projects:dict",
  get: ({ get }) => Object.fromEntries(get(projects).map((p) => [p.id, p])),
});



export type todoistTaskType = Task

// helper functions for nesting

interface NestedTask {
  task: Task;
  //  subtasks: NestedTask[]
  children?: NestedTask[];
}


function getParentTask(nestedTask: NestedTask, parentTaskId: number): NestedTask | undefined {
  if (nestedTask.task.id == parentTaskId) {
    return nestedTask;
  } else if (nestedTask.children != undefined) {
    let result = undefined;
    for (let i = 0; result == undefined && i < nestedTask.children.length; i++) {
      result = getParentTask(nestedTask.children[i], parentTaskId);
    }
    return result;
  }
  return undefined
}


function createBlocksFromNestedTasks(tasks: NestedTask[], indentationLevel: number, ignoreExistingTasks = false, existingTaskIds:number[] = []) {
  let blocksToAdd: CraftBlockInsert[] = [];

  tasks.forEach((curTask) => {
    if (!ignoreExistingTasks || !existingTaskIds.includes(curTask.task.id)){
      let mdContent = craft.markdown.markdownToCraftBlocks("- [ ] " + curTask.task.content + " [Todoist Task](todoist://task?id=" + curTask.task.id + ") [(Webview)](" + curTask.task.url + ")");

      mdContent.forEach((block) => {
        block.indentationLevel = indentationLevel;
      })

      blocksToAdd = blocksToAdd.concat(mdContent);
    }

    if (curTask.children != undefined) {
      blocksToAdd = blocksToAdd.concat(createBlocksFromNestedTasks(curTask.children, indentationLevel + 1, ignoreExistingTasks, existingTaskIds));
    }

  })

  return blocksToAdd;

}

export function createGroupedBlocksFromFlatTaskArray(projectList:Project[],flatTaskArray:Task[],ignoreExistingTasks = false, existingTaskIds:number[] = []):CraftBlockInsert[] {

 let blocksToAdd: CraftBlockInsert[] = [];

  let nestedTasks: NestedTask[] = [];

  let unnestedChildTasks: Task[] = [];

  flatTaskArray.forEach((curTask) => {
    if (curTask.parentId == undefined) {
      // task has no parentId and therefore is a parent task
      nestedTasks.push({ task: curTask });
    } else {
      unnestedChildTasks.push(curTask);
    }
  })


  while (unnestedChildTasks.length > 0) {
    unnestedChildTasks.forEach((curTask, index) => {

      let parentExtists = flatTaskArray.find(task => task.id == curTask.parentId)

      if (parentExtists == undefined) {
        // remove task from unnestedChildTasks since either the parent was found or no parent is existing in the currently imported tasks
        // add it to the nested tasks list since it should be included in the imported tasks in the project section
        nestedTasks.push({ task: curTask })
        unnestedChildTasks.splice(index, 1);
      } else {
        let parentNestedTask: NestedTask | undefined = undefined;
        for (let i = 0; parentNestedTask == undefined && i < nestedTasks.length; i++) {
          if (curTask.parentId) {
            parentNestedTask = getParentTask(nestedTasks[i], curTask.parentId)
          }
        }

        if (parentNestedTask) {
          if (parentNestedTask.children) {
            parentNestedTask.children.push({ task: curTask })
          } else {
            parentNestedTask.children = [{ task: curTask }]
          }
          unnestedChildTasks.splice(index, 1);
        }
      }
    })
  }


  let projectToTasksMap: Map<number, NestedTask[]> = new Map([]);

  nestedTasks.forEach((curTask) => {
    let projectItem = projectToTasksMap.get(curTask.task.projectId);
    if (projectItem != undefined) {
      // project already exists, just add the taskId
      projectItem.push(curTask);
    } else {
      projectToTasksMap.set(curTask.task.projectId, [curTask]);
    }
  })
  projectToTasksMap.forEach((projectTasks, projectId) => {
    // get projectName
    // (block): block is CraftTextBlock => block.type === "textBlock"


    let projectBlockToAdd:CraftBlockInsert[] = [];
    let taskBlocksToAdd:CraftBlockInsert[] = [];

      projectList
        .filter((project) => project.id === projectId)
        .map((project) => {
          projectBlockToAdd = craft.markdown.markdownToCraftBlocks("+ " + project.name);
        })

      projectTasks.map((task) => {
        taskBlocksToAdd = taskBlocksToAdd.concat(createBlocksFromNestedTasks([task], 1, ignoreExistingTasks, existingTaskIds))
      })

      if(taskBlocksToAdd.length > 0){
        blocksToAdd = blocksToAdd.concat(projectBlockToAdd).concat(taskBlocksToAdd);
      }




  })

return blocksToAdd;


}
