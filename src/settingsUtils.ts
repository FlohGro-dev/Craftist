//import * as Recoil from "recoil";

const useSettingsLinkTypeMobileAppKey:string = "SettingsLinkTypeMobileAppKey"
const useSettingsLinkTypeWebKey:string = "useSettingsLinkTypeWebKey"

export async function setSettingsMobileUrlUsage(useMobileUrls:boolean){
  await craft.storageApi.put(useSettingsLinkTypeMobileAppKey,String(useMobileUrls));
}

export async function setSettingsWebUrlUsage(useWebUrls:boolean){
  await craft.storageApi.put(useSettingsLinkTypeWebKey,String(useWebUrls));
}

export async function getSettingsMobileUrlUsage():Promise<string>{
  let mobileAppLinksEnabled = await craft.storageApi.get(useSettingsLinkTypeMobileAppKey);
  if(mobileAppLinksEnabled.status == "success"){
    return mobileAppLinksEnabled.data
  } else {
    return "error"
  }
}

export async function getSettingsWebUrlUsage():Promise<string>{
  let webLinksEnabled = await craft.storageApi.get(useSettingsLinkTypeWebKey);
  if(webLinksEnabled.status == "success"){
    return webLinksEnabled.data
  } else {
    return "error"
  }
}

// due Dates
const useSettingsDueDatesEnabledKey:string = "useSettingsDueDatesKey"

export async function setSettingsDueDateUsage(useDueDates:boolean){
  await craft.storageApi.put(useSettingsDueDatesEnabledKey,String(useDueDates));
}

export async function getSettingsDueDateUsage():Promise<string>{
  let dueDatesEnabled = await craft.storageApi.get(useSettingsDueDatesEnabledKey);
  if(dueDatesEnabled.status == "success"){
    return dueDatesEnabled.data
  } else {
    return "error"
  }
}





// export const API_TOKEN_KEY = "TODOIST_API_TOKEN";
//
// const globalScopeClient: { current?: TodoistApi } = { current: undefined };
//
// export const apiToken = Recoil.atom({
//   key: "todoistApiToken",
//   default: "",
// });
//
// export const client = Recoil.atom<TodoistApi | undefined>({
//   key: "client",
//   default: Recoil.selector({
//     key: "client:default",
//     get: ({ get }) => {
//       const token = get(apiToken);
//       if (token) {
//         globalScopeClient.current = new TodoistApi(token);
//         return globalScopeClient.current;
//       }
//       return undefined;
//     },
//   }),
//   effects_UNSTABLE: [
//     ({ onSet }) => {
//       onSet((newValue) => {
//         globalScopeClient.current = newValue;
//       });
//     },
//   ],
// });
//
// export const useLoginCallback = () =>
//   Recoil.useRecoilCallback(({ set }) => {
//     return async (token: string) => {
//       let cli = new TodoistApi(token);
//       return cli.getProjects().then(async () => {
//         set(apiToken, token);
//         set(client, cli);
//         await craft.storageApi.put(API_TOKEN_KEY, token);
//         window.localStorage.setItem(API_TOKEN_KEY, token);
//       });
//     };
//   });
//
// export const useLogoutCallback = () =>
//   Recoil.useRecoilCallback(({ reset }) => {
//     return async () => {
//       //        reset(projects);
//       reset(apiToken);
//       reset(client);
//       await craft.storageApi.delete(API_TOKEN_KEY);
//       window.localStorage.removeItem(API_TOKEN_KEY);
//     };
//   });
//
// export const useAddTask = () => {
//   return Recoil.useRecoilCallback(({ snapshot }) => {
//     return async (params: {
//       projectId?: number;
//       content: string;
//       description?: string;
//     }) => {
//       const cli = await snapshot.getPromise(client);
//       if (!cli) {
//         throw new Error("No client");
//       }
//       const resp = await cli.addTask(params);
//       //set(taskFamily(resp.id), resp);
//       return resp;
//     };
//   });
// };
