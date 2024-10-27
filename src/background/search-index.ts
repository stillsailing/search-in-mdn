const key = 'mdn_search_index'

chrome.storage.local.get(key)

const lang = {
  zh: 'zh-CN',
  en: 'en-US',
}

/**
 * 更新 MDN 搜索索引文件
 */
async function updateSearchIndex() {
  const index = await fetch('https://developer.mozilla.org/zh-CN/search-index.json').then(
    (response) => response.json()
  )
  chrome.storage.local.set({ [key]: index })
}

chrome.runtime.onInstalled.addListener(updateSearchIndex)
