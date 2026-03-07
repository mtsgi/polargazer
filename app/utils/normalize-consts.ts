import type { ConstsData } from '../types/view-model'

/**
 * 定数表JSONから楽曲名と難易度キーで引ける定数マップを構築する
 * @param consts - 定数表JSON
 * @returns 「楽曲名::難易度キー」をキー、定数値を値とするMap
 */
export function buildConstsMap(consts: ConstsData): Map<string, number> {
  const map = new Map<string, number>()

  for (const [constStr, entries] of Object.entries(consts)) {
    const constValue = parseFloat(constStr)
    // 不正な数値はスキップする。
    if (Number.isNaN(constValue)) {
      continue
    }

    for (const entry of entries) {
      const songName = entry[0]
      const difficultyKey = entry[1]
      if (!songName || !difficultyKey) {
        continue
      }
      // "楽曲名::難易度キー" 形式でマップに登録する。
      map.set(`${songName}::${difficultyKey}`, constValue)
    }
  }

  return map
}
