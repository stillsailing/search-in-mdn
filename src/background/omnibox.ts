import { MDN_SITE_URL } from './contants'
import search from './search'

interface Suggestion {
  title: string
  url: string
}

let lastSuggestions: Suggestion[] = []
chrome.omnibox.onInputChanged.addListener(async function (text, suggest) {
  if (text) {
    chrome.omnibox.setDefaultSuggestion({
      description: text,
    })
  }

  const result = await search(text)
  if (result && result.length > 0) {
    lastSuggestions = result.map((s) => ({ title: s.item.title, url: s.item.url }))
    suggest(
      result.map((index) => ({
        content: index.item.title,
        description: `<match>${index.item.title}</match>  ➔  <url>${MDN_SITE_URL}${index.item.url}</url>`,
      }))
    )
  }
})

chrome.omnibox.onInputEntered.addListener((content) => {
  const item = lastSuggestions.find((item) => item.title === content)
  let url = item ? `${MDN_SITE_URL}${item.url}` : `${MDN_SITE_URL}/zh-CN/search?q=${content}`
  chrome.tabs.update({ url })
})
