//import * as Recoil from "recoil";

import { taskGroupingOptions } from "./todoistApiWrapper";


export let taskMetadataSettingsValues:string[] = [];
export let taskLinkSettingsValues:string[] = ["web","mobile"];
export let taskGroupingTodayValues:string[] = ["sections","projects"];
export let taskGroupingProjectValues:string[] = ["sections"];
export let taskGroupingAllValues:string[] = ["sections","projects"];

// const taskMetadataSettingsDefaultValues:string[] = [];
// const taskLinkSettingsDefaultValues:string[] = ["web","mobile"];
// const taskGroupingTodayDefaultValues:string[] = ["sections","projects"];
// const taskGroupingProjectDefaultValues:string[] = ["sections"];
// const taskGroupingAllDefaultValues:string[] = ["sections","projects"];

const useSettingsLinkTypeMobileAppKey:string = "SettingsLinkTypeMobileAppKey"
const useSettingsLinkTypeWebKey:string = "useSettingsLinkTypeWebKey"

export async function setSettingsMobileUrlUsage(useMobileUrls:boolean){
  const settingsString = "mobile"
  const index = taskLinkSettingsValues.indexOf(settingsString, 0);
  if(useMobileUrls){
    if (index == -1) {
    taskLinkSettingsValues.push(settingsString)
  }
  } else {
    if (index > -1) {
      taskLinkSettingsValues.splice(index, 1);
    }
  }
  await craft.storageApi.put(useSettingsLinkTypeMobileAppKey,String(useMobileUrls));
}

export async function setSettingsWebUrlUsage(useWebUrls:boolean){
  const settingsString = "web"
  const index = taskLinkSettingsValues.indexOf(settingsString, 0);
  if(useWebUrls){
    if (index == -1) {
    taskLinkSettingsValues.push(settingsString)
  }
  } else {
    if (index > -1) {
      taskLinkSettingsValues.splice(index, 1);
    }
  }
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

export async function isAnyTaskLinkEnabled():Promise<boolean>{
  let webUrlSettings = await getSettingsWebUrlUsage();
  let mobileUrlSettings = await getSettingsMobileUrlUsage();
  let useMobileUrls: boolean;
  let useWebUrls: boolean;
  if (mobileUrlSettings == "true" || mobileUrlSettings == "error") {
    useMobileUrls = true;
  } else {
    useMobileUrls = false;
  }
  if (webUrlSettings == "true" || webUrlSettings == "error") {
    useWebUrls = true;
  } else {
    useWebUrls = false;
  }

  if(useWebUrls == false && useMobileUrls == false){
    return false;
  } else {
    return true;
  }


}

// due Dates
const useSettingsDueDatesEnabledKey:string = "useSettingsDueDatesKey"

export async function setSettingsDueDateUsage(useDueDates:boolean){
  const settingsString = "dueDates"
  const index = taskMetadataSettingsValues.indexOf(settingsString, 0);
  if(useDueDates){
    if (index == -1) {
    taskMetadataSettingsValues.push(settingsString)
  }
  } else {
    if (index > -1) {
      taskMetadataSettingsValues.splice(index, 1);
    }
  }
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

// labels
const useSettingsLabelsEnabledKey:string = "useSettingsLabelsKey"

export async function setSettingsLabelsUsage(useLabels:boolean){
  const settingsString = "labels"
  const index = taskMetadataSettingsValues.indexOf(settingsString, 0);
  if(useLabels){
    if (index == -1) {
    taskMetadataSettingsValues.push(settingsString)
  }
  } else {
    if (index > -1) {
      taskMetadataSettingsValues.splice(index, 1);
    }
  }
  await craft.storageApi.put(useSettingsLabelsEnabledKey,String(useLabels));
}

export async function getSettingsLabelsUsage():Promise<string>{
  let labelsEnabled = await craft.storageApi.get(useSettingsLabelsEnabledKey);
  if(labelsEnabled.status == "success"){
    return labelsEnabled.data
  } else {
    return "error"
  }
}

// descriptions
const useSettingsDescriptionEnabledKey:string = "useSettingsDescriptionKey"

export async function setSettingsDescriptionUsage(useDescriptions:boolean){
  const settingsString = "description"
  const index = taskMetadataSettingsValues.indexOf(settingsString, 0);
  if(useDescriptions){
    if (index == -1) {
    taskMetadataSettingsValues.push(settingsString)
  }
  } else {
    if (index > -1) {
      taskMetadataSettingsValues.splice(index, 1);
    }
  }
  await craft.storageApi.put(useSettingsDescriptionEnabledKey,String(useDescriptions));
}

export async function getSettingsDescriptionUsage():Promise<string>{
  let descriptionsEnabled = await craft.storageApi.get(useSettingsDescriptionEnabledKey);
  if(descriptionsEnabled.status == "success"){
    return descriptionsEnabled.data
  } else {
    return "error"
  }
}

// todays task grouping
const useSettingsGroupTodaysTasksOption:string = "useSettingsGroupTodaysTasksOptionKey"

export async function setSettingsGroupTodaysTasksOption(groupByOption:string){
  await craft.storageApi.put(useSettingsGroupTodaysTasksOption,groupByOption);
}

export async function getSettingsGroupTodaysTasksOption():Promise<taskGroupingOptions>{
  let result = await craft.storageApi.get(useSettingsGroupTodaysTasksOption);
  if(result.status == "success"){
    switch(result.data){
      case "projectAndSection": return taskGroupingOptions.projectAndSection;
      case "projectOnly": return taskGroupingOptions.projectOnly;
      case "sectionOnly": return taskGroupingOptions.sectionOnly;
      //case "label": return taskGroupingOptions.label;
      case "none": return taskGroupingOptions.none;
    }
  } else {
    return taskGroupingOptions.none;
  }
  // return to prevent errors.
  return taskGroupingOptions.none;
}

// project task grouping
const useSettingsGroupProjectTasksOption:string = "useSettingsGroupProjectTasksOptionKey"

export async function setSettingsGroupProjectTasksOption(groupByOption:string){
  await craft.storageApi.put(useSettingsGroupProjectTasksOption,groupByOption);
}

export async function getSettingsGroupProjectTasksOption():Promise<taskGroupingOptions>{
  let result = await craft.storageApi.get(useSettingsGroupProjectTasksOption);
  if(result.status == "success"){
    switch(result.data){
      case "projectAndSection": return taskGroupingOptions.projectAndSection;
      case "projectOnly": return taskGroupingOptions.projectOnly;
      case "sectionOnly": return taskGroupingOptions.sectionOnly;
      //case "label": return taskGroupingOptions.label;
      case "none": return taskGroupingOptions.none;
    }
  } else {
    return taskGroupingOptions.none;
  }
  // return to prevent errors.
  return taskGroupingOptions.none;
}

// project task grouping
const useSettingsGroupAllTasksOption:string = "useSettingsGroupAllTasksOptionKey"

export async function setSettingsGroupAllTasksOption(groupByOption:string){
  await craft.storageApi.put(useSettingsGroupAllTasksOption,groupByOption);
}

export async function getSettingsGroupAllTasksOption():Promise<taskGroupingOptions>{
  let result = await craft.storageApi.get(useSettingsGroupAllTasksOption);
  if(result.status == "success"){
    switch(result.data){
      case "projectAndSection": return taskGroupingOptions.projectAndSection;
      case "projectOnly": return taskGroupingOptions.projectOnly;
      case "sectionOnly": return taskGroupingOptions.sectionOnly;
      //case "label": return taskGroupingOptions.label;
      case "none": return taskGroupingOptions.none;
    }
  } else {
    return taskGroupingOptions.none;
  }
  // return to prevent errors.
  return taskGroupingOptions.none;
}

async function checkIfSettingExists(key:string):Promise<boolean>{
  let getSettingResult = await craft.storageApi.get(key);
  if(getSettingResult.status == "success"){
    return true
  } else {
    return false
  }
}

export const writeDefaultSettings = async () => {
  // shall only write defaults if no settings are present.
  let mobileUrlSettings = await getSettingsMobileUrlUsage();
  let webUrlSettings = await getSettingsWebUrlUsage();
  let dueDatesSettings = await getSettingsDueDateUsage();
  let labelsSettings = await getSettingsLabelsUsage();
  let descriptionSettings = await getSettingsDescriptionUsage();

  if (mobileUrlSettings == "error"){
    // write default
    setSettingsMobileUrlUsage(true);
  }
  if (webUrlSettings == "error"){
    // write default
    setSettingsWebUrlUsage(true);
  }
  if (dueDatesSettings == "error"){
    // write default
    setSettingsDueDateUsage(true);
  }
  if (labelsSettings == "error"){
    // write default
    setSettingsLabelsUsage(true);
  }
  if (descriptionSettings == "error"){
    // write default
    setSettingsDescriptionUsage(false);
  }
  if (!checkIfSettingExists(useSettingsGroupTodaysTasksOption)){
    // write default
    setSettingsGroupTodaysTasksOption("projectAndSection");
  }
  if (!checkIfSettingExists(useSettingsGroupProjectTasksOption)){
    // write default
    setSettingsGroupProjectTasksOption("sectionOnly");
  }
  if (!checkIfSettingExists(useSettingsGroupAllTasksOption)){
    // write default
    setSettingsGroupAllTasksOption("projectAndSection");
  }
}
