document.addEventListener('mouseup', () => {
  const selection = window.getSelection().toString()
  if (selection) {
    chrome.runtime.sendMessage({ type: 'textSelection', selection })
  }
})
