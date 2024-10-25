import getMDNSearchURL from "../util/getMDNSearchURL"

chrome.omnibox.onInputChanged.addListener(function (text, suggest) {
  suggest([
    { content: text, description: 'Open MDN' },
    {
      content: getMDNSearchURL(text),
      description: 'Search in MDN',
    },
  ])
})

chrome.omnibox.onInputEntered.addListener(function (text) {
  const url = /https?:\/\//g.test(text)
    ? text
    : getMDNSearchURL(text)
  chrome.tabs.update({ url })
})