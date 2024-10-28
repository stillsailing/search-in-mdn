import { MDN_SITE_URL } from './contants'
import search from './search'

const ExtensionMenuId = 'search-in-mdn'

let subMenuIds = []
async function setupSubMenu(selection: string) {
  // remove all sub menu
  subMenuIds.forEach((id) => {
    chrome.contextMenus.remove(id)
  })
  subMenuIds = []

  const result = await search(selection)
  if (!result || result.length === 0) {
    subMenuIds.push(
      chrome.contextMenus.create({
        parentId: ExtensionMenuId,
        id: 'no-result',
        title: '没有过滤到结果，直接在 MDN 中搜索',
        type: 'normal',
        contexts: ['selection'],
      })
    )
    return
  }

  result.forEach((index) => {
    const { title, url } = index.item
    subMenuIds.push(
      chrome.contextMenus.create({
        parentId: ExtensionMenuId,
        id: url,
        title: title,
        type: 'normal',
        contexts: ['selection'],
      })
    )
  })
}

function handleMenuClick(info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) {
  const index = tab!.index + 1
  const menuItemId = String(info.menuItemId)
  if (menuItemId === 'no-result') {
    const selection = info.selectionText
    chrome.tabs.create({
      url: `${MDN_SITE_URL}/zh-CN/search?q=${selection}`,
      index,
    })
  }

  const url = `${MDN_SITE_URL}${menuItemId}`
  chrome.tabs.create({ url, index })
}

chrome.runtime.onMessage.addListener(
  (message) => message.type === 'textSelection' && setupSubMenu(message.selection)
)
chrome.runtime.onInstalled.addListener(() =>
  chrome.contextMenus.create({
    id: ExtensionMenuId,
    title: 'Search in MDN',
    type: 'normal',
    contexts: ['selection'],
  })
)
chrome.contextMenus.onClicked.addListener(handleMenuClick)
