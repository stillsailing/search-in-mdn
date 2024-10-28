import { MDN_SITE_URL } from './contants'
import search from './search'

chrome.omnibox.onInputChanged.addListener(async function (text, suggest) {
  const result = await search(text)
  const suggestions = [
    {
      content: `${MDN_SITE_URL}/zh-CN/search?q=${text}`,
      description: 'Search in MDN',
    },
  ]
  if (result && result.length > 0) {
    suggestions.push(
      ...result.map((index) => ({
        content: `${MDN_SITE_URL}${index.item.url}`,
        description: `${index.item.title}  ➔  ${MDN_SITE_URL}${index.item.url}`,
      }))
    )
  }
  suggest(suggestions)
})

chrome.omnibox.onInputEntered.addListener(function (text) {
  chrome.tabs.update({ url: text })
})
