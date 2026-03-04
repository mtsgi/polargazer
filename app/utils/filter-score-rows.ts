import type { DifficultyBest, ScoreSongRow, SongFilterCondition } from '../types/view-model'

/**
 * 楽曲一覧にAND条件の絞り込みを適用する
 */
export function filterRowsByConditions(rows: ScoreSongRow[], conditions: SongFilterCondition[]): ScoreSongRow[] {
  if (conditions.length === 0) {
    return rows
  }

  return rows.filter((row) =>
    row.difficultyBests.some((difficulty) => matchesAllConditions(difficulty, conditions)),
  )
}

/**
 * 単一難易度が全ての条件を満たすか判定する
 */
export function matchesAllConditions(difficulty: DifficultyBest, conditions: SongFilterCondition[]): boolean {
  return conditions.every((condition) => matchesCondition(difficulty, condition))
}

/**
 * 単一難易度が単一条件を満たすか判定する
 */
export function matchesCondition(difficulty: DifficultyBest, condition: SongFilterCondition): boolean {
  if (condition.type === 'level') {
    if (difficulty.key !== condition.difficultyKey) {
      return false
    }

    if (condition.minLevel !== null && difficulty.level < condition.minLevel) {
      return false
    }

    if (condition.maxLevel !== null && difficulty.level > condition.maxLevel) {
      return false
    }

    return true
  }

  if (difficulty.key !== condition.difficultyKey) {
    return false
  }

  const matched = resolveClearConditionMatched(difficulty, condition.target)
  return condition.mode === 'only' ? matched : !matched
}

/**
 * クリア状況条件の一致可否を返す
 */
export function resolveClearConditionMatched(difficulty: DifficultyBest, target: 'ap' | 'fc' | 'clear' | 'play'): boolean {
  switch (target) {
    case 'ap':
      return difficulty.isAllPerfect
    case 'fc':
      return difficulty.isFullCombo
    case 'clear':
      return difficulty.clearStatus >= 2
    case 'play':
      return difficulty.totalPlayCount > 0
    default:
      return false
  }
}
