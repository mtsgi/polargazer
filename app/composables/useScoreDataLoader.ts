import type { CommonResponse } from '../types/common'
import type { PDataResponse } from '../types/pdata'
import type { DataSourceUrls, LoadedScoreData } from '../types/view-model'
import { fetchJson } from '../utils/fetch-json'
import { normalizeCommon } from '../utils/normalize-common'
import { extractUserProfile, normalizePDataMusic } from '../utils/normalize-pdata'
import { buildScoreList } from '../utils/build-score-list'

/**
 * common/pdataの読込と結合を担当するcomposable。
 */
export function useScoreDataLoader() {
  /** 読込中フラグ。 */
  const isLoading = ref(false)
  /** エラーメッセージ。 */
  const errorMessage = ref('')
  /** 読込結果データ。 */
  const loadedData = ref<LoadedScoreData | null>(null)

  /**
   * 指定URLからcommon/pdataを読込み、表示用データを構築する。
   */
  async function load(urls: DataSourceUrls): Promise<void> {
    isLoading.value = true
    errorMessage.value = ''

    try {
      // common/pdataは独立しているため並列取得する。
      const [commonResponse, pdataResponse] = await Promise.all([
        fetchJson<CommonResponse>(urls.commonUrl),
        fetchJson<PDataResponse>(urls.pdataUrl),
      ])

      // レスポンスをUIで扱いやすい形へ変換する。
      const commonList = normalizeCommon(commonResponse)
      const pdataList = normalizePDataMusic(pdataResponse)
      const profile = extractUserProfile(pdataResponse)
      const rows = buildScoreList(commonList, pdataList)

      loadedData.value = {
        commonList,
        pdataList,
        profile,
        rows,
      }
    } catch (error) {
      // 失敗時は表示データを破棄してメッセージを更新する。
      loadedData.value = null
      errorMessage.value = error instanceof Error ? error.message : 'Failed to load score data'
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    errorMessage,
    loadedData,
    load,
  }
}
