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
      result.map((index) => {
        const { title, url } = index.item
        return {
          content: title,
          description: `${highlight(title, text)}  ➔  <url>${MDN_SITE_URL}${url}</url>`,
        }
      })
    )
  }
})

/**
 * https://stackoverflow.com/questions/1091945/what-characters-do-i-need-to-escape-in-xml-documents/1091953
 */
function escaping(text: string) {
  const map = {
    '"': '&quot;',
    "'": '&apos;',
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
  }
  let escaped = ''
  for (let char of text) {
    escaped += map[char] ? map[char] : char
  }
  return escaped
}

function highlight(text: string, keyword: string) {
  const index = text.indexOf(keyword)
  if (index === -1) {
    return escaping(text)
  }
  const escapedText = escaping(text)
  const escapedKeyword = escaping(keyword)
  const escapedIndex = escapedText.indexOf(escapedKeyword)
  const result =
    escapedText.slice(0, escapedIndex) +
    `<match>${escapedKeyword}</match>` +
    escapedText.slice(escapedIndex + escapedKeyword.length)
  return result
}

chrome.omnibox.onInputEntered.addListener((content) => {
  const item = lastSuggestions.find((item) => item.title === content)
  let url = item ? `${MDN_SITE_URL}${item.url}` : `${MDN_SITE_URL}/zh-CN/search?q=${content}`
  chrome.tabs.update({ url })
})
