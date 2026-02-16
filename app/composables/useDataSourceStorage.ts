import type { DataSourceUrls } from '../types/view-model'

const COMMON_URL_KEY = 'polargazer.commonUrl'
const PDATA_URL_KEY = 'polargazer.pdataUrl'

export const DEFAULT_COMMON_URL = '/common_getdata.html'
export const DEFAULT_PDATA_URL = '/pdata_getdata.html'

/**
 * localStorageから前回入力URLを読み込む。
 */
export function loadDataSourceUrls(): DataSourceUrls {
  // SSR時はlocalStorageが使えないためデフォルトを返す。
  if (!import.meta.client) {
    return {
      commonUrl: DEFAULT_COMMON_URL,
      pdataUrl: DEFAULT_PDATA_URL,
    }
  }

  // 未保存時は開発用デフォルトURLを利用する。
  const commonUrl = localStorage.getItem(COMMON_URL_KEY) || DEFAULT_COMMON_URL
  const pdataUrl = localStorage.getItem(PDATA_URL_KEY) || DEFAULT_PDATA_URL

  return {
    commonUrl,
    pdataUrl,
  }
}

/**
 * 入力URLをlocalStorageへ保存する。
 */
export function saveDataSourceUrls(urls: DataSourceUrls): void {
  // SSR時は何もしない。
  if (!import.meta.client) {
    return
  }

  localStorage.setItem(COMMON_URL_KEY, urls.commonUrl)
  localStorage.setItem(PDATA_URL_KEY, urls.pdataUrl)
}
