import type { PDataChart, PDataResponse, PDataUserProfile } from '../types/pdata'
import type { NormalizedPDataMusic } from '../types/view-model'

/**
 * pdataレスポンスから楽曲別スコアを正規化して返す。
 */
export function normalizePDataMusic(response: PDataResponse): NormalizedPDataMusic[] {
  const musicList = response?.data?.score_data?.usr_music_highscore?.music

  // 想定外構造時のフォールバック。
  if (!Array.isArray(musicList)) {
    return []
  }

  return musicList.map((music) => {
    const chart = music.chart_list?.chart
    const charts = normalizeChartList(chart)

    return {
      musicId: music.music_id,
      charts,
    }
  })
}

/**
 * pdataレスポンスからプロフィールのみ抽出する。
 */
export function extractUserProfile(response: PDataResponse): PDataUserProfile | null {
  const profile = response?.data?.play_data?.usr_profile
  if (!profile) {
    return null
  }
  return profile
}

/**
 * chartが単体オブジェクトでも配列でも、配列へ統一する。
 */
function normalizeChartList(chart: PDataChart | PDataChart[] | undefined): PDataChart[] {
  if (!chart) {
    return []
  }

  if (Array.isArray(chart)) {
    return chart
  }

  return [chart]
}
