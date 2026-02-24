import { describe, expect, it } from 'vitest'
import type { DifficultyBest, ScoreSongRow, SongFilterCondition } from '../../app/types/view-model'
import {
  filterRowsByConditions,
  matchesAllConditions,
  matchesCondition,
  resolveClearConditionMatched,
} from '../../app/utils/filter-score-rows'

function createDifficultyBest(overrides: Partial<DifficultyBest>): DifficultyBest {
  return {
    key: 'hard',
    label: 'hard',
    level: 10,
    bestHighscore: 700000,
    bestAchievementRate: 9950,
    clearRank: 'SSS+',
    totalPlayCount: 5,
    maxCombo: 100,
    comboRank: 8,
    scoreRank: 8,
    clearStatus: 3,
    clearCount: 5,
    allPerfectCount: 1,
    fullComboCount: 2,
    latestUpdatedAt: '2025-01-01 00:00:00',
    nicePlayRank: 0,
    chartLevelFromPdata: 10,
    isAllPerfect: true,
    isFullCombo: true,
    ...overrides,
  }
}

function createRow(musicId: string, difficulties: DifficultyBest[]): ScoreSongRow {
  return {
    musicId,
    name: musicId,
    composer: 'Comp',
    genre: 1,
    levels: {
      easy: 1,
      normal: 2,
      hard: 10,
      influence: 0,
      polar: 0,
    },
    bestHighscore: 700000,
    bestAchievementRate: 9950,
    totalPlayCount: difficulties.reduce((sum, difficulty) => sum + difficulty.totalPlayCount, 0),
    chartCount: difficulties.length,
    difficultyBests: difficulties,
  }
}

describe('resolveClearConditionMatched', () => {
  const base = createDifficultyBest({})

  it('AP/FC/クリア/プレイ条件の判定を返す', () => {
    expect(resolveClearConditionMatched(base, 'ap')).toBe(true)
    expect(resolveClearConditionMatched(base, 'fc')).toBe(true)
    expect(resolveClearConditionMatched(base, 'clear')).toBe(true)
    expect(resolveClearConditionMatched(base, 'play')).toBe(true)
  })
})

describe('matchesCondition', () => {
  it('レベル条件で難易度種別と範囲を判定する', () => {
    const difficulty = createDifficultyBest({ key: 'hard', level: 10 })

    expect(matchesCondition(difficulty, {
      type: 'level',
      difficultyKey: 'hard',
      minLevel: 9,
      maxLevel: 11,
    })).toBe(true)

    expect(matchesCondition(difficulty, {
      type: 'level',
      difficultyKey: 'easy',
      minLevel: 9,
      maxLevel: 11,
    })).toBe(false)
  })

  it('クリア状況条件で only と exclude を判定する', () => {
    const difficulty = createDifficultyBest({ isAllPerfect: false })

    expect(matchesCondition(difficulty, {
      type: 'clearStatus',
      difficultyKey: 'hard',
      target: 'ap',
      mode: 'only',
    })).toBe(false)

    expect(matchesCondition(difficulty, {
      type: 'clearStatus',
      difficultyKey: 'hard',
      target: 'ap',
      mode: 'exclude',
    })).toBe(true)

    expect(matchesCondition(difficulty, {
      type: 'clearStatus',
      difficultyKey: 'easy',
      target: 'ap',
      mode: 'exclude',
    })).toBe(false)
  })
})

describe('matchesAllConditions', () => {
  it('条件が空配列の場合はtrueを返す', () => {
    const difficulty = createDifficultyBest({ key: 'hard', level: 10 })
    expect(matchesAllConditions(difficulty, [])).toBe(true)
  })

  it('単一条件の一致可否を返す', () => {
    const difficulty = createDifficultyBest({ key: 'hard', level: 10 })

    expect(matchesAllConditions(difficulty, [{
      type: 'level',
      difficultyKey: 'hard',
      minLevel: 10,
      maxLevel: 10,
    }])).toBe(true)

    expect(matchesAllConditions(difficulty, [{
      type: 'level',
      difficultyKey: 'hard',
      minLevel: 11,
      maxLevel: null,
    }])).toBe(false)
  })

  it('複数条件は全て一致した場合のみtrueを返す', () => {
    const difficulty = createDifficultyBest({ key: 'hard', level: 10, isAllPerfect: false })

    expect(matchesAllConditions(difficulty, [
      {
        type: 'level',
        difficultyKey: 'hard',
        minLevel: 9,
        maxLevel: 11,
      },
      {
        type: 'clearStatus',
        difficultyKey: 'hard',
        target: 'ap',
        mode: 'exclude',
      },
    ])).toBe(true)

    expect(matchesAllConditions(difficulty, [
      {
        type: 'level',
        difficultyKey: 'hard',
        minLevel: 9,
        maxLevel: 11,
      },
      {
        type: 'clearStatus',
        difficultyKey: 'hard',
        target: 'ap',
        mode: 'only',
      },
    ])).toBe(false)
  })
})

describe('filterRowsByConditions', () => {
  it('条件未設定時は元配列を返す', () => {
    const rows = [createRow('m1', [createDifficultyBest({})])]
    expect(filterRowsByConditions(rows, [])).toEqual(rows)
  })

  it('複数AND条件は同一難易度で同時に満たす必要がある', () => {
    const rows = [
      createRow('m1', [
        createDifficultyBest({ key: 'hard', level: 10, isAllPerfect: false }),
        createDifficultyBest({ key: 'polar', level: 10, isAllPerfect: true }),
      ]),
      createRow('m2', [
        createDifficultyBest({ key: 'hard', level: 10, isAllPerfect: true }),
      ]),
    ]

    const conditions: SongFilterCondition[] = [
      {
        type: 'level',
        difficultyKey: 'hard',
        minLevel: 9,
        maxLevel: 11,
      },
      {
        type: 'clearStatus',
        difficultyKey: 'hard',
        target: 'ap',
        mode: 'only',
      },
    ]

    const filtered = filterRowsByConditions(rows, conditions)
    expect(filtered).toHaveLength(1)
    expect(filtered[0]?.musicId).toBe('m2')
  })

  it('AP除外かつHARD 9-11で未達成曲のみ抽出できる', () => {
    const rows = [
      createRow('m1', [createDifficultyBest({ key: 'hard', level: 10, isAllPerfect: true })]),
      createRow('m2', [createDifficultyBest({ key: 'hard', level: 10, isAllPerfect: false })]),
      createRow('m3', [createDifficultyBest({ key: 'normal', level: 10, isAllPerfect: false })]),
    ]

    const conditions: SongFilterCondition[] = [
      {
        type: 'level',
        difficultyKey: 'hard',
        minLevel: 9,
        maxLevel: 11,
      },
      {
        type: 'clearStatus',
        difficultyKey: 'hard',
        target: 'ap',
        mode: 'exclude',
      },
    ]

    const filtered = filterRowsByConditions(rows, conditions)
    expect(filtered.map((row) => row.musicId)).toEqual(['m2'])
  })

  it('レベル範囲は片側未指定を許容する', () => {
    const rows = [
      createRow('m1', [createDifficultyBest({ key: 'hard', level: 8 })]),
      createRow('m2', [createDifficultyBest({ key: 'hard', level: 10 })]),
      createRow('m3', [createDifficultyBest({ key: 'hard', level: 12 })]),
    ]

    const conditions: SongFilterCondition[] = [{
      type: 'level',
      difficultyKey: 'hard',
      minLevel: 10,
      maxLevel: null,
    }]

    const filtered = filterRowsByConditions(rows, conditions)
    expect(filtered.map((row) => row.musicId)).toEqual(['m2', 'm3'])
  })
})
