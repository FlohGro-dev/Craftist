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
