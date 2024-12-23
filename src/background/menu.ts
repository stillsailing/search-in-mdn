import getLang from '@/util/getLang'
import { MDN_SITE_URL } from '@/contants'
import search from './search'

const ExtensionMenuId = 'search-in-mdn'

function clearSubMenu() {
  chrome.contextMenus.removeAll()
  chrome.contextMenus.create({
    id: ExtensionMenuId,
    title: chrome.runtime.getManifest().name,
    type: 'normal',
    contexts: ['selection'],
  })
}

async function setupSubMenu(selection: string) {
  clearSubMenu()

  const result = await search(selection)
  if (!result || result.length === 0) {
    chrome.contextMenus.create({
      parentId: ExtensionMenuId,
      id: 'no-result',
      title: chrome.i18n.getMessage('no_result'),
      type: 'normal',
      contexts: ['selection'],
    })
    return
  }

  result.forEach((index) => {
    const { title, url } = index.item
    chrome.contextMenus.create({
      parentId: ExtensionMenuId,
      id: url,
      title: title,
      type: 'normal',
      contexts: ['selection'],
    })
  })
}

async function handleMenuClick(info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) {
  const index = tab!.index + 1
  const menuItemId = String(info.menuItemId)
  if (!menuItemId || menuItemId === 'no-result') {
    const selection = info.selectionText
    const lang = await getLang()
    chrome.tabs.create({
      url: `${MDN_SITE_URL}/${lang}/search?q=${selection}`,
      index,
    })
    return
  }

  const url = `${MDN_SITE_URL}${menuItemId}`
  chrome.tabs.create({ url, index })
}

chrome.runtime.onMessage.addListener(
  (message) => message.type === 'textSelection' && setupSubMenu(message.selection)
)
chrome.contextMenus.onClicked.addListener((info, tab) => {
  handleMenuClick(info, tab)
  clearSubMenu()
})

chrome.tabs.onActivated.addListener((info) => {
  chrome.scripting.executeScript({
    target: { tabId: info.tabId },
    func: () => {
      function push() {
        const selection = window.getSelection().toString()
        if (selection) {
          chrome.runtime.sendMessage({ type: 'textSelection', selection })
        }
      }
      document.addEventListener('mouseup', push)
      document.addEventListener(
        'visibilitychange',
        () => document.visibilityState === 'visible' && push()
      )
    },
  })
})
