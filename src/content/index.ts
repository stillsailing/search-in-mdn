function push() {
  const selection = window.getSelection().toString()
  if (selection) {
    chrome.runtime.sendMessage({ type: 'textSelection', selection })
  }
}

document.addEventListener('mouseup', push)
document.addEventListener(
  'visibilitychange',
  () => document.visibilityState === 'visible' && push()
)
