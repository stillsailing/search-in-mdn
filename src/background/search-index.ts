import getLang from "@/util/getLang"
import { MDN_SITE_URL } from "@/contants"

const prefix = 'mdn_search_index_'
async function getKey() {
  const lang = await getLang()
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
    'zh-CN': `${MDN_SITE_URL}/zh-CN/search-index.json`,
    'en': `${MDN_SITE_URL}/en-US/search-index.json`,
  }
  const lang = await getLang()
  const index = await fetch(map[lang]).then(
    (response) => response.json()
  )
  const key = await getKey()
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
  const key = await getKey()
  if (index && index[key]) {
    return index[key]
  }
  await updateSearchIndex()
  return await chrome.storage.local.get()[key]
}
