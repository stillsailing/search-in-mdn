const key = 'mdn_search_index'

interface IndexItem {
  title: string
  url: string
}

/**
 * 更新 MDN 搜索索引文件
 */
async function updateSearchIndex() {
  const index = await fetch('https://developer.mozilla.org/zh-CN/search-index.json').then(
    (response) => response.json()
  )
  await chrome.storage.local.set({ [key]: index })
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
  if (index && index[key]) {
    return index[key]
  }
  await updateSearchIndex()
  return await chrome.storage.local.get()[key]
}
