import * as Recoil from "recoil";
import { TodoistApi, Project, Task } from "@doist/todoist-api-typescript";


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
  id: number}) => {
    const cli = await snapshot.getPromise(client);
    if (!cli) {
      throw new Error("No client");
    }
    const response = await cli.getTask(params.id);
    return response.completed
  };

});
};


export const useSetTaskComplete = () => {
  return Recoil.useRecoilCallback(({ snapshot }) => {
return async (params: {
  id: number}) => {
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
    const response = await cli.getTasks({ "filter": "today" });
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








/* hacked functions
async function importProjects() {
  const api = new TodoistApi('3b9286b9fc7495014013276e7e55f36d707fcba1');

  let pBlocks: string[] = []
  let pBlockUrls: string[] = []

  await api.getProjects()
    .then((projects) =>
      projects.forEach(function(project) {
        pBlockUrls.push(project.url)
        pBlocks.push(project.name + "!;!;!todoist://project?id=" + project.id)
      }))
    .catch((error) => console.log(error))

  console.log("current pBlocks")
  console.log(pBlocks)

  let pBlocksArr: CraftBlockInsert[] = []
  pBlocksArr.push(
    craft.blockFactory.textBlock({
      content: "Todoist Projects:"
    })
  )

  pBlocks.forEach(function(block) {
    pBlocksArr.push(
      craft.blockFactory.textBlock({
        content: [{ text: block.split("!;!;!")[0], link: { type: "url", url: block.split("!;!;!")[1] } }]
      })
    )
  })

  craft.dataApi.addBlocks(pBlocksArr);

}


async function importTodaysTasks(){
  const api = new TodoistApi('3b9286b9fc7495014013276e7e55f36d707fcba1');


  let pBlocks: string[] = []

  await api.getTasks({ "filter": "today" })
    .then(
      (tasks) =>
        tasks.forEach(function(task) {
          pBlocks.push(task.content + "!;!;!todoist://task?id=" + task.id)
        })
    )
    .catch((error) => console.log(error))

  let pBlocksArr: CraftBlockInsert[] = []
  pBlocksArr.push(
    craft.blockFactory.textBlock({
      content: "Todays Tasks:"
    })
  )

  pBlocks.forEach(function(block) {
    pBlocksArr.push(
      craft.blockFactory.textBlock({
        content: [{ text: block.split("!;!;!")[0], link: { type: "url", url: block.split("!;!;!")[1] } }]
      })
    )
  })

  craft.dataApi.addBlocks(pBlocksArr);
}


async function crosslinkOpenTasks(){

  const api = new TodoistApi('3b9286b9fc7495014013276e7e55f36d707fcba1');

  let todoItems: string[] = [];
  let todoBlocks: CraftTextBlock[] = [];

  const getPageResult = await craft.dataApi.getCurrentPage();

  if (getPageResult.status !== "success") {
    throw new Error(getPageResult.message)
  }
  const pageBlock = getPageResult.data
  // Concatenate the text runs together to get the page title
  //const pageTitle = pageBlock.content.map(x => x.text).join()
  pageBlock.subblocks.forEach(function(subBlock) {
    if (subBlock.listStyle.type == "todo") {
      if (subBlock.listStyle.state == "unchecked") {
        if (subBlock.type == "textBlock") {
          todoBlocks.push(subBlock);
          subBlock.content.forEach(function(contentItem) {
            todoItems.push("[" + contentItem.text + "](craftdocs://open?blockId=" + subBlock.id + "&spaceId="+ subBlock.spaceId + ")")
          })
        }
      }
    }

  })



  todoBlocks.forEach(function(block){
      block.content.forEach(function(contentItem){
        let taskStr = "[" + contentItem.text + "](craftdocs://open?blockId=" + block.id + "&spaceId="+ block.spaceId + ")"
        api.addTask({
          content: taskStr,
        })
          .then(async function(task){
              block.content = [ contentItem,
              {
                text: " "
              },
              {
                text: "Todoist Task", link: { type: "url", url: "todoist://task?id=" + task.id}
              },
              {
                text: " "
              },
              {
                text: "Weblink", link: { type: "url", url: task.url}
              }
            ]

              const result = await craft.dataApi.updateBlocks([ block ])
              if (result.status !== "success") {
                throw new Error(result.message)
              }
          }
        )
          .catch((error) => console.log(error))
      })
  })
}

*/
