export default async function getLang() {
  const langs = await chrome.i18n.getAcceptLanguages()
  return langs[0]
}
