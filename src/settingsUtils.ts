
import { taskGroupingOptions } from "./todoistApiWrapper";


export let taskMetadataSettingsValues: string[] = [];
export let taskLinkSettingsValues: string[] = [];
export let taskGroupingTodayValues: string[] = [];
export let taskGroupingProjectValues: string[] = [];
export let taskGroupingAllValues: string[] = [];
export let taskImportAfterSelectedBlock: string = "";
export let taskSetDueDatesBasedOnDailyNote: string = "";

// const taskMetadataSettingsDefaultValues:string[] = [];
// const taskLinkSettingsDefaultValues:string[] = ["web","mobile"];
// const taskGroupingTodayDefaultValues:string[] = ["sections","projects"];
// const taskGroupingProjectDefaultValues:string[] = ["sections"];
// const taskGroupingAllDefaultValues:string[] = ["sections","projects"];

const useSettingsLinkTypeMobileAppKey: string = "SettingsLinkTypeMobileAppKey"
const useSettingsLinkTypeWebKey: string = "useSettingsLinkTypeWebKey"

export async function setSettingsMobileUrlUsage(useMobileUrls: boolean) {
  const settingsString = "mobile"
  const index = taskLinkSettingsValues.indexOf(settingsString, 0);
  if (useMobileUrls) {
    if (index == -1) {
      taskLinkSettingsValues.push(settingsString)
    }
  } else {
    if (index > -1) {
      taskLinkSettingsValues.splice(index, 1);
    }
  }
  await craft.storageApi.put(useSettingsLinkTypeMobileAppKey, String(useMobileUrls));
}

export async function setSettingsWebUrlUsage(useWebUrls: boolean) {
  const settingsString = "web"
  const index = taskLinkSettingsValues.indexOf(settingsString, 0);
  if (useWebUrls) {
    if (index == -1) {
      taskLinkSettingsValues.push(settingsString)
    }
  } else {
    if (index > -1) {
      taskLinkSettingsValues.splice(index, 1);
    }
  }
  await craft.storageApi.put(useSettingsLinkTypeWebKey, String(useWebUrls));
}

export async function getSettingsMobileUrlUsage(): Promise<string> {
  let mobileAppLinksEnabled = await craft.storageApi.get(useSettingsLinkTypeMobileAppKey);
  if (mobileAppLinksEnabled.status == "success") {
    const settingsString = "mobile"
    if (mobileAppLinksEnabled.data == "true") {
      const index = taskLinkSettingsValues.indexOf(settingsString, 0);
      if (index == -1) {
        taskLinkSettingsValues.push(settingsString)
      }
    }
    return mobileAppLinksEnabled.data
  } else {
    return "error"
  }
}

export async function getSettingsWebUrlUsage(): Promise<string> {
  let webLinksEnabled = await craft.storageApi.get(useSettingsLinkTypeWebKey);
  if (webLinksEnabled.status == "success") {
    const settingsString = "web"
    if (webLinksEnabled.data == "true") {
      const index = taskLinkSettingsValues.indexOf(settingsString, 0);
      if (index == -1) {
        taskLinkSettingsValues.push(settingsString)
      }
    }
    return webLinksEnabled.data
  } else {
    return "error"
  }
}

export function isAnyTaskLinkEnabled(): boolean {
  if (taskLinkSettingsValues.length > 0) {
    return true;
  } else {
    return false;
  }
}

// due Dates
const useSettingsDueDatesEnabledKey: string = "useSettingsDueDatesKey"

export async function setSettingsDueDateUsage(useDueDates: boolean) {
  const settingsString = "dueDates"
  const index = taskMetadataSettingsValues.indexOf(settingsString, 0);
  if (useDueDates) {
    if (index == -1) {
      taskMetadataSettingsValues.push(settingsString)
    }
  } else {
    if (index > -1) {
      taskMetadataSettingsValues.splice(index, 1);
    }
  }
  await craft.storageApi.put(useSettingsDueDatesEnabledKey, String(useDueDates));
}

export async function getSettingsDueDateUsage(): Promise<string> {
  let dueDatesEnabled = await craft.storageApi.get(useSettingsDueDatesEnabledKey);
  if (dueDatesEnabled.status == "success") {
    const settingsString = "dueDates"
    if (dueDatesEnabled.data == "true") {
      const index = taskMetadataSettingsValues.indexOf(settingsString, 0);
      if (index == -1) {
        taskMetadataSettingsValues.push(settingsString)
      }
    }
    return dueDatesEnabled.data
  } else {
    return "error"
  }
}

// labels
const useSettingsLabelsEnabledKey: string = "useSettingsLabelsKey"

export async function setSettingsLabelsUsage(useLabels: boolean) {
  const settingsString = "labels"
  const index = taskMetadataSettingsValues.indexOf(settingsString, 0);
  if (useLabels) {
    if (index == -1) {
      taskMetadataSettingsValues.push(settingsString)
    }
  } else {
    if (index > -1) {
      taskMetadataSettingsValues.splice(index, 1);
    }
  }
  await craft.storageApi.put(useSettingsLabelsEnabledKey, String(useLabels));
}

export async function getSettingsLabelsUsage(): Promise<string> {
  let labelsEnabled = await craft.storageApi.get(useSettingsLabelsEnabledKey);
  if (labelsEnabled.status == "success") {
    const settingsString = "labels"
    if (labelsEnabled.data == "true") {
      const index = taskMetadataSettingsValues.indexOf(settingsString, 0);
      if (index == -1) {
        taskMetadataSettingsValues.push(settingsString)
      }
    }
    return labelsEnabled.data
  } else {
    return "error"
  }
}

// descriptions
const useSettingsDescriptionEnabledKey: string = "useSettingsDescriptionKey"

export async function setSettingsDescriptionUsage(useDescriptions: boolean) {
  const settingsString = "description"
  const index = taskMetadataSettingsValues.indexOf(settingsString, 0);
  if (useDescriptions) {
    if (index == -1) {
      taskMetadataSettingsValues.push(settingsString)
    }
  } else {
    if (index > -1) {
      taskMetadataSettingsValues.splice(index, 1);
    }
  }
  await craft.storageApi.put(useSettingsDescriptionEnabledKey, String(useDescriptions));
}

export async function getSettingsDescriptionUsage(): Promise<string> {
  let descriptionsEnabled = await craft.storageApi.get(useSettingsDescriptionEnabledKey);
  if (descriptionsEnabled.status == "success") {
    const settingsString = "description"
    if (descriptionsEnabled.data == "true") {
      const index = taskMetadataSettingsValues.indexOf(settingsString, 0);
      if (index == -1) {
        taskMetadataSettingsValues.push(settingsString)
      }
    }
    return descriptionsEnabled.data
  } else {
    return "error"
  }
}

// todays task grouping
const useSettingsGroupTodaysTasksOption: string = "useSettingsGroupTodaysTasksOptionKey"

export async function setSettingsGroupTodaysTasksOption(groupByOption: string) {
  let projectsIndex = taskGroupingTodayValues.indexOf("projects");
  let sectionsIndex = taskGroupingTodayValues.indexOf("sections");
  switch (groupByOption) {
    case "projectAndSection":
      if (projectsIndex == -1) {
        taskGroupingTodayValues.push("projects");
      }
      if (sectionsIndex == -1) {
        taskGroupingTodayValues.push("sections");
      }
      break;
    case "projectOnly":
      if (projectsIndex == -1) {
        taskGroupingTodayValues.push("projects");
      }
      if (sectionsIndex > -1) {
        taskGroupingTodayValues.splice(sectionsIndex, 0);
      }
      break;
    case "sectionOnly": ;
      if (sectionsIndex == -1) {
        taskGroupingTodayValues.push("sections");
      }
      if (projectsIndex > -1) {
        taskGroupingTodayValues.splice(projectsIndex, 0);
      }
      break;
    //case "label": return taskGroupingOptions.label;
    case "none":
      if (projectsIndex > -1) {
        taskGroupingTodayValues.splice(projectsIndex, 0);
      }
      if (sectionsIndex > -1) {
        taskGroupingTodayValues.splice(sectionsIndex, 0);
      }
      break;
  }
  await craft.storageApi.put(useSettingsGroupTodaysTasksOption, groupByOption);
}

export async function loadTodayGroupingSettingsIntoVar() {
  const result = await craft.storageApi.get(useSettingsGroupTodaysTasksOption);
  if (result.status == "success") {
    const groupByOption = result.data;
    let projectsIndex = taskGroupingTodayValues.indexOf("projects");
    let sectionsIndex = taskGroupingTodayValues.indexOf("sections");
    switch (groupByOption) {
      case "projectAndSection":
        if (projectsIndex == -1) {
          taskGroupingTodayValues.push("projects");
        }
        if (sectionsIndex == -1) {
          taskGroupingTodayValues.push("sections");
        }
        break;
      case "projectOnly":
        if (projectsIndex == -1) {
          taskGroupingTodayValues.push("projects");
        }
        if (sectionsIndex > -1) {
          taskGroupingTodayValues.splice(sectionsIndex, 0);
        }
        break;
      case "sectionOnly": ;
        if (sectionsIndex == -1) {
          taskGroupingTodayValues.push("sections");
        }
        if (projectsIndex > -1) {
          taskGroupingTodayValues.splice(projectsIndex, 0);
        }
        break;
      //case "label": return taskGroupingOptions.label;
      case "none":
        if (projectsIndex > -1) {
          taskGroupingTodayValues.splice(projectsIndex, 0);
        }
        if (sectionsIndex > -1) {
          taskGroupingTodayValues.splice(sectionsIndex, 0);
        }
        break;
    }
  }
}

export async function getSettingsGroupTodaysTasksOption(): Promise<taskGroupingOptions> {
  let result = await craft.storageApi.get(useSettingsGroupTodaysTasksOption);
  if (result.status == "success") {
    switch (result.data) {
      case "projectAndSection": return taskGroupingOptions.projectAndSection;
      case "projectOnly": return taskGroupingOptions.projectOnly;
      case "sectionOnly": return taskGroupingOptions.sectionOnly;
      //case "label": return taskGroupingOptions.label;
      case "none": return taskGroupingOptions.none;
    }
  } else {
    return taskGroupingOptions.error;
  }
  // return to prevent errors.
  return taskGroupingOptions.error;
}

// project task grouping
const useSettingsGroupProjectTasksOption: string = "useSettingsGroupProjectTasksOptionKey"

export async function setSettingsGroupProjectTasksOption(groupByOption: string) {
  let projectsIndex = taskGroupingProjectValues.indexOf("projects");
  let sectionsIndex = taskGroupingProjectValues.indexOf("sections");
  switch (groupByOption) {
    case "projectAndSection":
      if (projectsIndex == -1) {
        taskGroupingProjectValues.push("projects");
      }
      if (sectionsIndex == -1) {
        taskGroupingProjectValues.push("sections");
      }
      break;
    case "projectOnly":
      if (projectsIndex == -1) {
        taskGroupingProjectValues.push("projects");
      }
      if (sectionsIndex > -1) {
        taskGroupingTodayValues.splice(sectionsIndex, 0);
      }
      break;
    case "sectionOnly": ;
      if (sectionsIndex == -1) {
        taskGroupingProjectValues.push("sections");
      }
      if (projectsIndex > -1) {
        taskGroupingTodayValues.splice(projectsIndex, 0);
      }
      break;
    //case "label": return taskGroupingOptions.label;
    case "none":
      if (projectsIndex > -1) {
        taskGroupingTodayValues.splice(projectsIndex, 0);
      }
      if (sectionsIndex > -1) {
        taskGroupingTodayValues.splice(sectionsIndex, 0);
      }
      break;
  }
  await craft.storageApi.put(useSettingsGroupProjectTasksOption, groupByOption);
}

export async function loadProjectGroupingSettingsIntoVar() {
  const result = await craft.storageApi.get(useSettingsGroupProjectTasksOption);
  let projectsIndex = taskGroupingProjectValues.indexOf("projects");
  let sectionsIndex = taskGroupingProjectValues.indexOf("sections");
  const groupByOption = result.data;
  switch (groupByOption) {
    case "projectAndSection":
      if (projectsIndex == -1) {
        taskGroupingProjectValues.push("projects");
      }
      if (sectionsIndex == -1) {
        taskGroupingProjectValues.push("sections");
      }
      break;
    case "projectOnly":
      if (projectsIndex == -1) {
        taskGroupingProjectValues.push("projects");
      }
      if (sectionsIndex > -1) {
        taskGroupingTodayValues.splice(sectionsIndex, 0);
      }
      break;
    case "sectionOnly": ;
      if (sectionsIndex == -1) {
        taskGroupingProjectValues.push("sections");
      }
      if (projectsIndex > -1) {
        taskGroupingTodayValues.splice(projectsIndex, 0);
      }
      break;
    //case "label": return taskGroupingOptions.label;
    case "none":
      if (projectsIndex > -1) {
        taskGroupingTodayValues.splice(projectsIndex, 0);
      }
      if (sectionsIndex > -1) {
        taskGroupingTodayValues.splice(sectionsIndex, 0);
      }
      break;
  }
}

export async function getSettingsGroupProjectTasksOption(): Promise<taskGroupingOptions> {
  let result = await craft.storageApi.get(useSettingsGroupProjectTasksOption);
  if (result.status == "success") {
    switch (result.data) {
      case "projectAndSection": return taskGroupingOptions.projectAndSection;
      case "projectOnly": return taskGroupingOptions.projectOnly;
      case "sectionOnly": return taskGroupingOptions.sectionOnly;
      //case "label": return taskGroupingOptions.label;
      case "none": return taskGroupingOptions.none;
    }
  } else {
    return taskGroupingOptions.error;
  }
  // return to prevent errors.
  return taskGroupingOptions.error;
}

// project task grouping
const useSettingsGroupAllTasksOption: string = "useSettingsGroupAllTasksOptionKey"

export async function setSettingsGroupAllTasksOption(groupByOption: string) {
  let projectsIndex = taskGroupingAllValues.indexOf("projects");
  let sectionsIndex = taskGroupingAllValues.indexOf("sections");
  switch (groupByOption) {
    case "projectAndSection":
      if (projectsIndex == -1) {
        taskGroupingAllValues.push("projects");
      }
      if (sectionsIndex == -1) {
        taskGroupingAllValues.push("sections");
      }
      break;
    case "projectOnly":
      if (projectsIndex == -1) {
        taskGroupingAllValues.push("projects");
      }
      if (sectionsIndex > -1) {
        taskGroupingTodayValues.splice(sectionsIndex, 0);
      }
      break;
    case "sectionOnly": ;
      if (sectionsIndex == -1) {
        taskGroupingAllValues.push("sections");
      }
      if (projectsIndex > -1) {
        taskGroupingTodayValues.splice(projectsIndex, 0);
      }
      break;
    //case "label": return taskGroupingOptions.label;
    case "none":
      if (projectsIndex > -1) {
        taskGroupingTodayValues.splice(projectsIndex, 0);
      }
      if (sectionsIndex > -1) {
        taskGroupingTodayValues.splice(sectionsIndex, 0);
      }
      break;
  }
  await craft.storageApi.put(useSettingsGroupAllTasksOption, groupByOption);
}

export async function loadAllGroupingSettingsIntoVar() {
  const result = await craft.storageApi.get(useSettingsGroupAllTasksOption);
  let projectsIndex = taskGroupingAllValues.indexOf("projects");
  let sectionsIndex = taskGroupingAllValues.indexOf("sections");
  const groupByOption = result.data;
  switch (groupByOption) {
    case "projectAndSection":
      if (projectsIndex == -1) {
        taskGroupingAllValues.push("projects");
      }
      if (sectionsIndex == -1) {
        taskGroupingAllValues.push("sections");
      }
      break;
    case "projectOnly":
      if (projectsIndex == -1) {
        taskGroupingAllValues.push("projects");
      }
      if (sectionsIndex > -1) {
        taskGroupingTodayValues.splice(sectionsIndex, 0);
      }
      break;
    case "sectionOnly": ;
      if (sectionsIndex == -1) {
        taskGroupingAllValues.push("sections");
      }
      if (projectsIndex > -1) {
        taskGroupingTodayValues.splice(projectsIndex, 0);
      }
      break;
    //case "label": return taskGroupingOptions.label;
    case "none":
      if (projectsIndex > -1) {
        taskGroupingTodayValues.splice(projectsIndex, 0);
      }
      if (sectionsIndex > -1) {
        taskGroupingTodayValues.splice(sectionsIndex, 0);
      }
      break;
  }
}

export async function getSettingsGroupAllTasksOption(): Promise<taskGroupingOptions> {
  let result = await craft.storageApi.get(useSettingsGroupAllTasksOption);
  if (result.status == "success") {
    switch (result.data) {
      case "projectAndSection": return taskGroupingOptions.projectAndSection;
      case "projectOnly": return taskGroupingOptions.projectOnly;
      case "sectionOnly": return taskGroupingOptions.sectionOnly;
      //case "label": return taskGroupingOptions.label;
      case "none": return taskGroupingOptions.none;
    }
  } else {
    return taskGroupingOptions.error;
  }
  // return to prevent errors.
  return taskGroupingOptions.error;
}

// import task location
const useSettingsImportAfterSelectedBlockOption: string = "useSettingsImportAfterSelectedBlockOptionKey"

export async function setSettingsImportAfterSelectedBlockOption(enabled: boolean) {
  if (enabled) {
    taskImportAfterSelectedBlock = "enabled";
  } else {
    taskImportAfterSelectedBlock = "disabled";
  }
  await craft.storageApi.put(useSettingsImportAfterSelectedBlockOption, taskImportAfterSelectedBlock);
}

export async function getSettingsImportAfterSelectedBlockOption(): Promise<string> {
  let result = await craft.storageApi.get(useSettingsImportAfterSelectedBlockOption);
  if (result.status == "success") {
    taskImportAfterSelectedBlock = result.data;
    return result.data
  } else {
    return "error"
  }
}

// set due dates based on daily notes settings

//taskSetDueDatesBasedOnDailyNote
const useSettingsSetDueDateBasedOnDailyNoteOption: string = "useSettingsSetDueDateBasedOnDailyNoteOptionKey"

export async function setSettingsSetDueDateBasedOnDailyNoteOption(enabled: boolean) {
  if (enabled) {
    taskSetDueDatesBasedOnDailyNote = "enabled";
  } else {
    taskSetDueDatesBasedOnDailyNote = "disabled";
  }
  await craft.storageApi.put(useSettingsSetDueDateBasedOnDailyNoteOption, taskSetDueDatesBasedOnDailyNote);
}

export async function getSettingsSetDueDateBasedOnDailyNoteOption(): Promise<string> {
  let result = await craft.storageApi.get(useSettingsSetDueDateBasedOnDailyNoteOption);
  if (result.status == "success") {
    taskSetDueDatesBasedOnDailyNote = result.data;
    return result.data
  } else {
    return "error"
  }
}



async function checkIfSettingExists(key: string): Promise<boolean> {
  let getSettingResult = await craft.storageApi.get(key);
  if (getSettingResult.status == "success") {
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
  let locationSettings = await getSettingsImportAfterSelectedBlockOption();
  let dailyNotesSettings = await getSettingsSetDueDateBasedOnDailyNoteOption();

  if (mobileUrlSettings == "error") {
    // write default
    await setSettingsMobileUrlUsage(true);
  }
  if (webUrlSettings == "error") {
    // write default
    await setSettingsWebUrlUsage(true);
  }
  if (dueDatesSettings == "error") {
    // write default
    await setSettingsDueDateUsage(true);
  }
  if (labelsSettings == "error") {
    // write default
    await setSettingsLabelsUsage(true);
  }
  if (descriptionSettings == "error") {
    // write default
    await setSettingsDescriptionUsage(false);
  }
  if (locationSettings == "error") {
    // write default
    await setSettingsImportAfterSelectedBlockOption(true);
  }
  if (dailyNotesSettings == "error") {
    // write default
    await setSettingsSetDueDateBasedOnDailyNoteOption(true);
  }
  if (!checkIfSettingExists(useSettingsGroupTodaysTasksOption)) {
    // write default
    await setSettingsGroupTodaysTasksOption("projectAndSection");
  } else {
    // just read into var
    let setting = await getSettingsGroupTodaysTasksOption()
    if (setting == taskGroupingOptions.error) {
      // key exists but no valid value stored, set default
      await setSettingsGroupTodaysTasksOption("projectAndSection");
    } else {
      await loadTodayGroupingSettingsIntoVar()
    }
  }
  if (!checkIfSettingExists(useSettingsGroupProjectTasksOption)) {
    // write default
    await setSettingsGroupProjectTasksOption("sectionOnly");
  } else {
    // just read into var
    let setting = await getSettingsGroupProjectTasksOption()
    if (setting == taskGroupingOptions.error) {
      // key exists but no valid value stored, set default
      await setSettingsGroupProjectTasksOption("sectionOnly");
    } else {
      await loadProjectGroupingSettingsIntoVar()
    }
  }
  if (!checkIfSettingExists(useSettingsGroupAllTasksOption)) {
    // write default
    await setSettingsGroupAllTasksOption("projectAndSection");
  } else {
    // just read into var
    let setting = await getSettingsGroupAllTasksOption()
    if (setting == taskGroupingOptions.error) {
      // key exists but no valid value stored, set default
      await setSettingsGroupAllTasksOption("projectAndSection");
    } else {
      await loadAllGroupingSettingsIntoVar()
    }
  }
}
