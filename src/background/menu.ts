import getMDNSearchURL from "../util/getMDNSearchURL"

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'search-in-mdn',
    title: 'Search in MDN"',
    type: 'normal',
    contexts: ['selection'],
  })
})

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  const selection = info.selectionText
  const newTabIndex = tab!.index + 1
  const url = getMDNSearchURL(selection!)
  chrome.tabs.create({ url, index: newTabIndex })
})