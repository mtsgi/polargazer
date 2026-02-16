import type { CommonMusic, CommonResponse } from '../types/common'

/**
 * commonレスポンスから楽曲配列だけを取り出す。
 */
export function normalizeCommon(response: CommonResponse): CommonMusic[] {
  const musicList = response?.data?.musiclist?.music

  // 想定外構造でも落ちないように空配列を返す。
  if (!Array.isArray(musicList)) {
    return []
  }

  return musicList
}
