import { describe, expect, it } from 'vitest'
import { buildSkillChartList, calculatePaSkillAverage } from '../../app/utils/build-skill-chart-list'
import type { ScoreSongRow } from '../../app/types/view-model'

/** テスト用のScoreSongRow最小構成を生成するヘルパー */
function makeRow(overrides: Partial<ScoreSongRow> = {}): ScoreSongRow {
  return {
    musicId: 'm1',
    name: 'Song 1',
    composer: 'Comp 1',
    genre: 1,
    levels: { easy: 5, normal: 8, hard: 11, influence: 13, polar: 15 },
    bestHighscore: 0,
    bestAchievementRate: 0,
    totalPlayCount: 0,
    chartCount: 0,
    difficultyBests: [],
    ...overrides,
  }
}

describe('buildSkillChartList', () => {
  it('未プレイ譜面（totalPlayCount = 0）はリストに含まれない', () => {
    const rows = [
      makeRow({
        difficultyBests: [
          {
            key: 'hard',
            label: 'hard',
            level: 11,
            bestHighscore: 0,
            bestAchievementRate: 0,
            clearRank: '-',
            totalPlayCount: 0,
            maxCombo: 0, comboRank: 0, scoreRank: 0, clearStatus: 0,
            clearCount: 0, allPerfectCount: 0, fullComboCount: 0,
            latestUpdatedAt: null, nicePlayRank: 0,
            chartLevelFromPdata: 0, isAllPerfect: false, isFullCombo: false,
          },
        ],
      }),
    ]

    expect(buildSkillChartList(rows)).toHaveLength(0)
  })

  it('プレイ済み譜面をSKILL行として返す', () => {
    const rows = [
      makeRow({
        difficultyBests: [
          {
            key: 'hard',
            label: 'hard',
            level: 11,
            bestHighscore: 900000,
            bestAchievementRate: 9800,
            clearRank: 'S',
            totalPlayCount: 3,
            maxCombo: 100, comboRank: 5, scoreRank: 6, clearStatus: 2,
            clearCount: 2, allPerfectCount: 0, fullComboCount: 0,
            latestUpdatedAt: '2025-01-01 00:00:00', nicePlayRank: 0,
            chartLevelFromPdata: 11, isAllPerfect: false, isFullCombo: false,
          },
        ],
      }),
    ]

    const result = buildSkillChartList(rows)
    expect(result).toHaveLength(1)
    expect(result[0]?.musicId).toBe('m1')
    expect(result[0]?.songName).toBe('Song 1')
    expect(result[0]?.difficultyKey).toBe('hard')
    expect(result[0]?.level).toBe(11)
    expect(result[0]?.constValue).toBe(11)
    expect(result[0]?.isEstimatedConst).toBe(true)
    expect(result[0]?.bestAchievementRate).toBe(9800)
  })

  it('定数表あり: isEstimatedConst = false かつ constValue に定数値が入る', () => {
    const rows = [
      makeRow({
        difficultyBests: [
          {
            key: 'influence',
            label: 'influence',
            level: 13,
            bestHighscore: 950000,
            bestAchievementRate: 9500,
            clearRank: 'AAA',
            totalPlayCount: 5,
            maxCombo: 150, comboRank: 7, scoreRank: 7, clearStatus: 3,
            clearCount: 5, allPerfectCount: 0, fullComboCount: 1,
            latestUpdatedAt: '2025-01-01 00:00:00', nicePlayRank: 2,
            chartLevelFromPdata: 13, isAllPerfect: false, isFullCombo: true,
            constValue: 13.5,
          },
        ],
      }),
    ]

    const result = buildSkillChartList(rows)
    expect(result[0]?.isEstimatedConst).toBe(false)
    expect(result[0]?.constValue).toBe(13.5)
  })

  it('SKILL値降順でソートされている', () => {
    const rows = [
      makeRow({
        musicId: 'm1',
        name: 'Low SKILL',
        difficultyBests: [
          {
            key: 'easy',
            label: 'easy',
            level: 5,
            bestHighscore: 500000,
            bestAchievementRate: 7000,
            clearRank: 'C',
            totalPlayCount: 1,
            maxCombo: 50, comboRank: 2, scoreRank: 2, clearStatus: 1,
            clearCount: 1, allPerfectCount: 0, fullComboCount: 0,
            latestUpdatedAt: null, nicePlayRank: 0,
            chartLevelFromPdata: 5, isAllPerfect: false, isFullCombo: false,
          },
        ],
      }),
      makeRow({
        musicId: 'm2',
        name: 'High SKILL',
        difficultyBests: [
          {
            key: 'polar',
            label: 'polar',
            level: 15,
            bestHighscore: 990000,
            bestAchievementRate: 9900,
            clearRank: 'SSS',
            totalPlayCount: 10,
            maxCombo: 500, comboRank: 9, scoreRank: 9, clearStatus: 4,
            clearCount: 10, allPerfectCount: 2, fullComboCount: 5,
            latestUpdatedAt: '2025-01-02 00:00:00', nicePlayRank: 1,
            chartLevelFromPdata: 15, isAllPerfect: true, isFullCombo: true,
          },
        ],
      }),
    ]

    const result = buildSkillChartList(rows)
    expect(result).toHaveLength(2)
    expect(result[0]?.musicId).toBe('m2')
    expect(result[1]?.musicId).toBe('m1')
    expect(result[0]!.skillValue).toBeGreaterThan(result[1]!.skillValue)
  })

  it('isPaSkillTarget: nicePlayRank > 0 のとき true', () => {
    const rows = [
      makeRow({
        difficultyBests: [
          {
            key: 'polar',
            label: 'polar',
            level: 15,
            bestHighscore: 999000,
            bestAchievementRate: 9950,
            clearRank: 'SSS+',
            totalPlayCount: 5,
            maxCombo: 500, comboRank: 9, scoreRank: 9, clearStatus: 5,
            clearCount: 5, allPerfectCount: 1, fullComboCount: 4,
            latestUpdatedAt: '2025-02-01 00:00:00', nicePlayRank: 3,
            chartLevelFromPdata: 15, isAllPerfect: true, isFullCombo: true,
          },
          {
            key: 'hard',
            label: 'hard',
            level: 11,
            bestHighscore: 900000,
            bestAchievementRate: 9200,
            clearRank: 'AA',
            totalPlayCount: 2,
            maxCombo: 100, comboRank: 5, scoreRank: 5, clearStatus: 2,
            clearCount: 2, allPerfectCount: 0, fullComboCount: 0,
            latestUpdatedAt: '2025-01-01 00:00:00', nicePlayRank: 0,
            chartLevelFromPdata: 11, isAllPerfect: false, isFullCombo: false,
          },
        ],
      }),
    ]

    const result = buildSkillChartList(rows)
    const polar = result.find((r) => r.difficultyKey === 'polar')
    const hard = result.find((r) => r.difficultyKey === 'hard')
    expect(polar?.isPaSkillTarget).toBe(true)
    expect(hard?.isPaSkillTarget).toBe(false)
  })
})

describe('calculatePaSkillAverage', () => {
  it('PA SKILL対象譜面が0件のとき null を返す', () => {
    const rows = buildSkillChartList([
      makeRow({
        difficultyBests: [
          {
            key: 'hard',
            label: 'hard',
            level: 11,
            bestHighscore: 900000,
            bestAchievementRate: 9800,
            clearRank: 'S',
            totalPlayCount: 3,
            maxCombo: 100, comboRank: 5, scoreRank: 5, clearStatus: 2,
            clearCount: 2, allPerfectCount: 0, fullComboCount: 0,
            latestUpdatedAt: null, nicePlayRank: 0,
            chartLevelFromPdata: 11, isAllPerfect: false, isFullCombo: false,
          },
        ],
      }),
    ])

    expect(calculatePaSkillAverage(rows)).toBeNull()
  })

  it('PA SKILL対象譜面の上位N件の平均を返す', () => {
    // SKILL値が既知の対象譜面リストを直接渡してテスト
    const skillRows = [
      { isPaSkillTarget: true, skillValue: 15.0, musicId: 'm1', songName: 'A', composer: 'X', difficultyKey: 'polar' as const, difficultyLabel: 'polar', level: 15, constValue: 15, isEstimatedConst: false, bestAchievementRate: 9500 },
      { isPaSkillTarget: true, skillValue: 14.0, musicId: 'm2', songName: 'B', composer: 'Y', difficultyKey: 'polar' as const, difficultyLabel: 'polar', level: 14, constValue: 14, isEstimatedConst: false, bestAchievementRate: 9500 },
      { isPaSkillTarget: false, skillValue: 16.0, musicId: 'm3', songName: 'C', composer: 'Z', difficultyKey: 'polar' as const, difficultyLabel: 'polar', level: 15, constValue: 15, isEstimatedConst: false, bestAchievementRate: 10000 },
    ]

    // PA SKILL対象2件の平均: (15 + 14) / 2 = 14.5
    expect(calculatePaSkillAverage(skillRows)).toBeCloseTo(14.5)
  })

  it('PA SKILL対象が topN より少ない場合は全件の平均を返す', () => {
    const skillRows = [
      { isPaSkillTarget: true, skillValue: 12.0, musicId: 'm1', songName: 'A', composer: 'X', difficultyKey: 'hard' as const, difficultyLabel: 'hard', level: 12, constValue: 12, isEstimatedConst: false, bestAchievementRate: 9500 },
    ]

    expect(calculatePaSkillAverage(skillRows, 30)).toBeCloseTo(12.0)
  })
})
