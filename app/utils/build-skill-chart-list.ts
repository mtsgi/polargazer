import type { ScoreSongRow, SkillChartRow } from '../types/view-model'
import { calculateChartSkill } from './calculate-chart-skill'

/**
 * 楽曲一覧から全プレイ済み譜面のSKILL行リストを構築する
 * @param rows - 楽曲一覧の行データ配列
 * @returns 単曲SKILL値降順でソートされたSKILL行データ配列
 */
export function buildSkillChartList(rows: ScoreSongRow[]): SkillChartRow[] {
  const result: SkillChartRow[] = []

  for (const row of rows) {
    for (const best of row.difficultyBests) {
      // 未プレイ譜面はSKILLリストに含めない
      if (best.totalPlayCount === 0) {
        continue
      }

      // 譜面メタがない場合は整数レベルを定数値として扱う（参考値扱い）
      const isEstimatedConst = best.constValue === undefined
      const constValue = best.constValue ?? best.level

      const skillValue = calculateChartSkill(best.bestAchievementRate, constValue)

      result.push({
        musicId: row.musicId,
        songName: row.name,
        composer: row.composer,
        difficultyKey: best.key,
        difficultyLabel: best.label,
        level: best.level,
        constValue,
        isEstimatedConst,
        bestAchievementRate: best.bestAchievementRate,
        skillValue,
        isPaSkillTarget: best.nicePlayRank > 0,
      })
    }
  }

  // 単曲SKILL値の降順にソートする
  result.sort((a, b) => b.skillValue - a.skillValue)

  return result
}

/**
 * PA SKILL対象譜面のSKILL上位N件の平均を計算する
 * @param skillChartRows - buildSkillChartList の結果（SKILL降順済み）
 * @param topN - 対象とする上位件数（デフォルト: 30）
 * @returns 平均SKILL値 対象譜面が存在しない場合は null
 */
export function calculatePaSkillAverage(skillChartRows: SkillChartRow[], topN: number = 30): number | null {
  const targets = skillChartRows.filter((row) => row.isPaSkillTarget)

  if (targets.length === 0) {
    return null
  }

  const topRows = targets.slice(0, topN)
  const sum = topRows.reduce((acc, row) => acc + row.skillValue, 0)
  return sum / topRows.length
}
