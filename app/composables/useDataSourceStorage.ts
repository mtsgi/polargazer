import type { DataSourceUrls } from '../types/view-model'

const COMMON_URL_KEY = 'polargazer.commonUrl'
const PDATA_URL_KEY = 'polargazer.pdataUrl'
const META_URL_KEY = 'polargazer.metaUrl'

export const DEFAULT_COMMON_URL = '/common_getdata.html'
export const DEFAULT_PDATA_URL = '/pdata_getdata.html'
export const DEFAULT_META_URL = '/meta.json'

/**
 * localStorageから前回入力URLを読み込む。
 */
export function loadDataSourceUrls(): DataSourceUrls {
  // SSR時はlocalStorageが使えないためデフォルトを返す。
  if (!import.meta.client) {
    return {
      commonUrl: DEFAULT_COMMON_URL,
      pdataUrl: DEFAULT_PDATA_URL,
      metaUrl: DEFAULT_META_URL,
    }
  }

  // 未保存時は開発用デフォルトURLを利用する。
  const commonUrl = localStorage.getItem(COMMON_URL_KEY) || DEFAULT_COMMON_URL
  const pdataUrl = localStorage.getItem(PDATA_URL_KEY) || DEFAULT_PDATA_URL
  // metaUrl はユーザーが明示的に空にした場合も維持するため ?? を使う。
  const metaUrl = localStorage.getItem(META_URL_KEY) ?? DEFAULT_META_URL

  return {
    commonUrl,
    pdataUrl,
    metaUrl,
  }
}

/**
 * 入力URLをlocalStorageへ保存する。
 * blob: URLはリロード後に無効になるため保存をスキップする。
 */
export function saveDataSourceUrls(urls: DataSourceUrls): void {
  // SSR時は何もしない。
  if (!import.meta.client) {
    return
  }

  if (!urls.commonUrl.startsWith('blob:')) {
    localStorage.setItem(COMMON_URL_KEY, urls.commonUrl)
  }
  if (!urls.pdataUrl.startsWith('blob:')) {
    localStorage.setItem(PDATA_URL_KEY, urls.pdataUrl)
  }
  if (!urls.metaUrl.startsWith('blob:')) {
    localStorage.setItem(META_URL_KEY, urls.metaUrl)
  }
}
