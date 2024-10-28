import Fuse from 'fuse.js'
import { getSearchIndex } from './search-index'
import { SEARCH_LIMIT } from './contants'

export default async function search(keyword: string) {
  const index = await getSearchIndex()
  if (!index) {
    return []
  }
  const fuse = new Fuse(index, {
    keys: ['title', 'url'],
  })
  return fuse.search(keyword, { limit: SEARCH_LIMIT })
}
