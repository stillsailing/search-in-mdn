const prefix = 'mdn_search_index_'
function getKey() {
  const lang = chrome.i18n.getUILanguage()
  return `${prefix}${lang}`
}

interface IndexItem {
  title: string
  url: string
}

/**
 * 更新 MDN 搜索索引文件
 */
async function updateSearchIndex() {
  const map = {
    'zh_CN': 'https://developer.mozilla.org/zh-CN/search-index.json',
    'en': 'https://developer.mozilla.org/en-US/search-index.json',
  }
  const index = await fetch(map[chrome.i18n.getUILanguage()]).then(
    (response) => response.json()
  )
  await chrome.storage.local.set({ [getKey()]: index })
}

chrome.alarms.onAlarm.addListener(updateSearchIndex)
chrome.runtime.onInstalled.addListener(() => {
  updateSearchIndex()
  chrome.alarms.create('updateSearchIndex', {
    periodInMinutes: 1440, // per day
  })
})

export async function getSearchIndex(): Promise<IndexItem[]> {
  const index = await chrome.storage.local.get()
  const key = getKey()
  if (index && index[key]) {
    return index[key]
  }
  await updateSearchIndex()
  return await chrome.storage.local.get()[key]
}
