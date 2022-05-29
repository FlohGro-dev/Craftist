import { AfterBlockLocation, CraftBlock, CraftTextBlock, CraftTextBlockInsert, CraftTextRun } from "@craftdocs/craft-extension-api";

export async function getAllTodoItemsFromCurrentPage() {
  let todoBlocks: CraftTextBlock[] = [];

  const getPageResult = await craft.dataApi.getCurrentPage();

  if (getPageResult.status !== "success") {
    throw new Error(getPageResult.message)
  }
  const pageBlock = getPageResult.data

  pageBlock.subblocks.forEach(function (subBlock) {
    if (subBlock.listStyle.type == "todo") {
      if (subBlock.type == "textBlock") {
        todoBlocks.push(subBlock);
      }
    }
  })
  return todoBlocks;
}

export async function getUncheckedTodoItemsFromCurrentPage() {
  let todoBlocks: CraftTextBlock[] = [];

  const getPageResult = await craft.dataApi.getCurrentPage();

  if (getPageResult.status !== "success") {
    throw new Error(getPageResult.message)
  }
  const pageBlock = getPageResult.data

  pageBlock.subblocks.forEach(function (subBlock) {
    if (subBlock.listStyle.type == "todo") {
      if (subBlock.listStyle.state == "unchecked") {
        if (subBlock.type == "textBlock") {
          todoBlocks.push(subBlock);
        }
      }
    }

  })

  return todoBlocks;
}

export async function getCheckedTodoItemsFromCurrentPage() {
  let todoBlocks: CraftTextBlock[] = [];

  const getPageResult = await craft.dataApi.getCurrentPage();

  if (getPageResult.status !== "success") {
    throw new Error(getPageResult.message)
  }
  const pageBlock = getPageResult.data

  pageBlock.subblocks.forEach(function (subBlock) {
    if (subBlock.listStyle.type == "todo") {
      if (subBlock.listStyle.state == "checked") {
        if (subBlock.type == "textBlock") {
          todoBlocks.push(subBlock);
        }
      }
    }

  })

  return todoBlocks;
}

export async function getCanceledTodoItemsFromCurrentPage() {
  let todoBlocks: CraftTextBlock[] = [];

  const getPageResult = await craft.dataApi.getCurrentPage();

  if (getPageResult.status !== "success") {
    throw new Error(getPageResult.message)
  }
  const pageBlock = getPageResult.data

  pageBlock.subblocks.forEach(function (subBlock) {
    if (subBlock.listStyle.type == "todo") {
      if (subBlock.listStyle.state == "canceled") {
        if (subBlock.type == "textBlock") {
          todoBlocks.push(subBlock);
        }
      }
    }

  })
  return todoBlocks;
}

export function getMarkdownLinkToCraftTextBlock(block: CraftTextBlock) {
  let blockText: string = block.content.map((c) => c.text).join("");
  return "[" + blockText + "](craftdocs://open?blockId=" + block.id + "&spaceId=" + block.spaceId + ")"
}

export function getMarkdownContentWithLinkToCraftTextBlock(block: CraftBlock) {
  const blocks: CraftBlock[] = [block];
  //let blockText: string = block.content.map((c) => c.text).join("");
  let mdContent = craft.markdown.craftBlockToMarkdown(blocks, "common", { tableSupported: false });
  mdContent = mdContent.replace("- [ ]", "")
  return "[" + mdContent + "](craftdocs://open?blockId=" + block.id + "&spaceId=" + block.spaceId + ")"
  //return mdContent + " [linkTest](craftdocs://open?blockId=" + block.id + "&spaceId=" + block.spaceId + ")"
}




export async function appendCraftTextRunToBlock(textToAppend: CraftTextRun[], block: CraftTextBlock) {
  block.content = block.content.concat(textToAppend)
  const result = await craft.dataApi.updateBlocks([block])
  if (result.status !== "success") {
    throw new Error(result.message)
  }
}

export async function prependCraftTextRunToBlock(textToPrepend: CraftTextRun[], block: CraftTextBlock) {
  block.content = textToPrepend.concat(block.content);
  const result = await craft.dataApi.updateBlocks([block])
  if (result.status !== "success") {
    throw new Error(result.message)
  }
}

export function blockContainsString(compareString: string, block: CraftTextBlock) {
  let blockText: string = block.content.map((c) => c.text).join("");
  if (blockText.includes(compareString)) {
    return true;
  } else {
    return false;
  }


}

export function getBlockContentAsString(block: CraftTextBlock) {
  let blockText: string = block.content.map((c) => c.text).join("");
  return blockText;
}

export function getExternalUrlsFromBlock(block: CraftTextBlock) {
  let urls: string[] = [];
  block.content.forEach(function (contentItem) {
    if (contentItem.link?.type == "url") {
      urls.push(contentItem.link.url);
    }
  }
  )
  return urls;
}

export function createExternalLinkBlockFromStringAndUrl(blockText: string, blockUrl: string) {
  return craft.blockFactory.textBlock({
    content: [{ text: blockText, link: { type: "url", url: blockUrl } }]
  })
}

export function createExternalLinkBlockFromStringAndUrlMap(urlsToUse: Map<string, string>, separator = " ", description = "") {

  let block: CraftTextBlockInsert;
  let textRun: CraftTextRun[] = [];

  if (description != "") {
    textRun.push({ text: description })
    textRun.push({ text: separator })
  }

  for (let [text, url] of urlsToUse.entries()) {
    textRun.push({ text: text, link: { type: "url", url: url } })
    textRun.push({ text: separator })
  }

  block = craft.blockFactory.textBlock({
    content: textRun
  }
  )

  return block
}

export async function checkIfPageContainsStringInAnyBlockAndReturnFoundBlocks(searchString: string) {
  let foundBlocks: CraftTextBlock[] = [];
  const getPageResult = await craft.dataApi.getCurrentPage();

  if (getPageResult.status !== "success") {
    throw new Error(getPageResult.message)
  }
  const pageBlock = getPageResult.data

  pageBlock.subblocks.forEach(function (subBlock) {
    if (subBlock.type == "textBlock") {
      let content = getBlockContentAsString(subBlock);
      if (content.includes(searchString)) {
        foundBlocks.push(subBlock);
      }
    }
  }
  )
  craft.dataApi.addBlocks(foundBlocks);

  return foundBlocks;
}

export async function checkIfPageContainsExternalUrlInAnyBlockAndReturnFoundUrls(searchString: string) {
  let foundUrls: string[] = [];

  const getPageResult = await craft.dataApi.getCurrentPage();

  if (getPageResult.status !== "success") {
    throw new Error(getPageResult.message)
  }
  const pageBlock = getPageResult.data

  pageBlock.subblocks.forEach(function (subBlock) {
    if (subBlock.type == "textBlock") {
      let blockUrls = getExternalUrlsFromBlock(subBlock);
      for (let url of blockUrls) {
        if (url.includes(searchString)) {
          foundUrls.push(url);
        }
      }
    }

  })


  return foundUrls;
}

export async function checkIfPageContainsTodoistTaskId(taskId: number) {
  let blockFound: boolean = false;
  const getPageResult = await craft.dataApi.getCurrentPage();

  if (getPageResult.status !== "success") {
    throw new Error(getPageResult.message)
  }
  const pageBlock = getPageResult.data

  pageBlock.subblocks.forEach(function (subBlock) {
    if (subBlock.type == "textBlock") {
      let content = getBlockContentAsString(subBlock);
      if (content.includes(taskId.toString())) {
        blockFound = true;
        return true;
      }
      else {
        blockFound = false;
      }
    }
  }
  )
  return blockFound;
}

export async function getCurrentTodoistTaskIdsOfTasksOnPage() {
  let taskIds: number[] = [];

  const todoistLinkSchemeMobile = "todoist://task?id=";
  const todoistLinkSchemeWeb = "https://todoist.com/showTask?id=";


  const getPageResult = await craft.dataApi.getCurrentPage();

  if (getPageResult.status !== "success") {
    throw new Error(getPageResult.message)
  }
  const pageBlock = getPageResult.data

  pageBlock.subblocks.forEach(function (subBlock) {
    if (subBlock.type == "textBlock") {
      let blockUrls = getExternalUrlsFromBlock(subBlock)

      // may produce duplicates in an array but doesnt really matter.
      for (let url of blockUrls) {
        if (url.includes(todoistLinkSchemeMobile)) {
          taskIds.push(Number(url.replace(todoistLinkSchemeMobile, "")));
          break;
        } else if (url.includes(todoistLinkSchemeWeb)) {
          taskIds.push(Number(url.replace(todoistLinkSchemeWeb, "")));
          break;
        }
      }
    }
  }
  )

  return taskIds;
}
const todoistTaskLinkMobileUrl = "todoist://task?id="
const todoistTaskLinkWebUrl = "https://todoist.com/showTask?id="

export function getTodoistTaskIdFromBlock(block: CraftTextBlock): string | undefined {
  let blockUrls = getExternalUrlsFromBlock(block);

  for (let url of blockUrls) {
    if (url.includes(todoistTaskLinkMobileUrl)) {
      return url.replace(todoistTaskLinkMobileUrl, "");
    } else if (url.includes(todoistTaskLinkWebUrl)) {
      return url.replace(todoistTaskLinkWebUrl, "");
    }
  }
  return undefined
}

export async function createLocationContainerAfterCurrentSelection(): Promise<AfterBlockLocation | undefined> {
  const getPageResult = await craft.dataApi.getCurrentPage();

  if (getPageResult.status !== "success") {
    throw new Error(getPageResult.message)
  }
  const pageBlock = getPageResult.data

  const currentSelection = await craft.editorApi.getSelection()

  if (currentSelection.status !== "success") {
    throw new Error(currentSelection.message)
  }

  const selectedBlocks = currentSelection.data;

  if (selectedBlocks.length == 0) {
    // no selection, return undefined
    return undefined;
  } else {

    const lastBlock = selectedBlocks[selectedBlocks.length - 1]
    return craft.location.afterBlockLocation(pageBlock.id, lastBlock.id);
  }
}

export function getIsoDateIfCurrentDocumentIsDailyNote(pageBlock: CraftTextBlock): string | undefined {

  let firstBlockText = pageBlock.content[0].text


  const regex = /(\d{4}).(\d{2}).(\d{2})$/gm;

  if (firstBlockText.match(regex)) {
    const subst = `$1-$2-$3`;
    // create iso Date from craft date format
    const isoDate = firstBlockText.replace(regex, subst);
    return isoDate;
  } else {
    return undefined
  }
}

export function getIsoDateFromBlockLinkedToDate(block: CraftTextBlock): string | undefined {
  let dateStr = "";
  block.content.map((bContent) => {
    if (bContent.link) {
      if (bContent.link.type == "dateLink") {
        dateStr = bContent.link.date;
      }
    }
  })

  if (dateStr == "") {
    return undefined;
  } else {
    return dateStr;
  }
}
