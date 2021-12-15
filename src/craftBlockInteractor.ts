import { CraftBlockInsert, CraftBlock, CraftTextBlock, CraftTextRun, CraftTextBlockInsert } from "@craftdocs/craft-extension-api";

export async function getAllTodoItemsFromCurrentPage() {
  let todoBlocks: CraftTextBlock[] = [];

  const getPageResult = await craft.dataApi.getCurrentPage();

  if (getPageResult.status !== "success") {
    throw new Error(getPageResult.message)
  }
  const pageBlock = getPageResult.data

  pageBlock.subblocks.forEach(function(subBlock) {
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

  pageBlock.subblocks.forEach(function(subBlock) {
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

  pageBlock.subblocks.forEach(function(subBlock) {
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

  pageBlock.subblocks.forEach(function(subBlock) {
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

export function blockContainsString(compareString: string, block: CraftTextBlock){
  let blockText: string = block.content.map((c) => c.text).join("");
  if(blockText.includes(compareString)){
    return true;
  } else {
    return false;
  }


}

export function getBlockContentAsString(block: CraftTextBlock){
  let blockText: string = block.content.map((c) => c.text).join("");
  return blockText;
}

export function getExternalUrlsFromBlock(block: CraftTextBlock){
  let urls:string[] = [];
  block.content.forEach(function(contentItem){
    if(contentItem.link?.type == "url"){
      urls.push(contentItem.link.url);
    }
  }
)
  return urls;
}

export function createExternalLinkBlockFromStringAndUrl(blockText:string, blockUrl:string){
  return craft.blockFactory.textBlock({
    content: [{ text: blockText, link: { type: "url", url: blockUrl } }]
  })
}

export function createExternalLinkBlockFromStringAndUrlMap(urlsToUse:Map<string,string>,separator=" ",description=""){

  let block:CraftTextBlockInsert;
  let textRun:CraftTextRun[] = [];

  if(description != ""){
    textRun.push({text: description})
    textRun.push({text: separator})
  }

  for (let [text, url] of urlsToUse.entries()) {
    textRun.push({ text: text, link: { type: "url", url: url } })
    textRun.push({text: separator})
  }

  block = craft.blockFactory.textBlock({
    content: textRun
  }
  )

  return block
}

export function getParentDocumentMdLinkOfBlock(block:CraftBlock){
  // to be implemented
  return ""
}
