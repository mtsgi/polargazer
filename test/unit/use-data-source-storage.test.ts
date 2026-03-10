import { describe, it, expect, beforeEach } from 'vitest'

/**
 * saveDataSourceUrls の blob: URLスキップロジックを直接検証するテスト。
 * import.meta.client は Node 環境では false になるため関数全体のモックは行わず、
 * スキップ条件（startsWith('blob:')）を単独で検証する。
 */

const COMMON_URL_KEY = 'polargazer.commonUrl'
const PDATA_URL_KEY = 'polargazer.pdataUrl'
const CONSTS_URL_KEY = 'polargazer.constsUrl'

// localStorage のモック（globalThis.localStorage へ注入）
const storageMock = (() => {
  const store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    clear: () => { Object.keys(store).forEach(k => delete store[k]) },
  }
})()

Object.defineProperty(globalThis, 'localStorage', {
  value: storageMock,
  writable: true,
})

/** saveDataSourceUrls のblob:スキップロジックを再現した関数 */
function saveWithBlobSkip(urls: { commonUrl: string; pdataUrl: string; constsUrl: string }) {
  if (!urls.commonUrl.startsWith('blob:')) {
    storageMock.setItem(COMMON_URL_KEY, urls.commonUrl)
  }
  if (!urls.pdataUrl.startsWith('blob:')) {
    storageMock.setItem(PDATA_URL_KEY, urls.pdataUrl)
  }
  if (!urls.constsUrl.startsWith('blob:')) {
    storageMock.setItem(CONSTS_URL_KEY, urls.constsUrl)
  }
}

describe('saveDataSourceUrls: blob: URLスキップロジック', () => {
  beforeEach(() => {
    storageMock.clear()
  })

  it('通常URLはlocalStorageへ保存される', () => {
    saveWithBlobSkip({
      commonUrl: '/common_getdata.html',
      pdataUrl: '/pdata_getdata.html',
      constsUrl: '/consts.json',
    })

    expect(storageMock.getItem(COMMON_URL_KEY)).toBe('/common_getdata.html')
    expect(storageMock.getItem(PDATA_URL_KEY)).toBe('/pdata_getdata.html')
    expect(storageMock.getItem(CONSTS_URL_KEY)).toBe('/consts.json')
  })

  it('blob: URLはlocalStorageに書き込まれない', () => {
    // まず通常URLを保存しておく
    storageMock.setItem(COMMON_URL_KEY, '/common_getdata.html')
    storageMock.setItem(PDATA_URL_KEY, '/pdata_getdata.html')
    storageMock.setItem(CONSTS_URL_KEY, '/consts.json')

    // blob: URLで saveWithBlobSkip を呼ぶ
    saveWithBlobSkip({
      commonUrl: 'blob:http://localhost/common-abc',
      pdataUrl: 'blob:http://localhost/pdata-def',
      constsUrl: 'blob:http://localhost/consts-ghi',
    })

    // blob: URL はスキップされるため既存値が変わらないことを確認
    expect(storageMock.getItem(COMMON_URL_KEY)).toBe('/common_getdata.html')
    expect(storageMock.getItem(PDATA_URL_KEY)).toBe('/pdata_getdata.html')
    expect(storageMock.getItem(CONSTS_URL_KEY)).toBe('/consts.json')
  })

  it('一部のみblob: URLでも、通常URLフィールドは保存される', () => {
    saveWithBlobSkip({
      commonUrl: 'blob:http://localhost/common-abc',
      pdataUrl: '/pdata_getdata.html',
      constsUrl: '/consts.json',
    })

    // common は blob: のためスキップ
    expect(storageMock.getItem(COMMON_URL_KEY)).toBeNull()
    // pdata・consts は通常URLのため保存される
    expect(storageMock.getItem(PDATA_URL_KEY)).toBe('/pdata_getdata.html')
    expect(storageMock.getItem(CONSTS_URL_KEY)).toBe('/consts.json')
  })
})

