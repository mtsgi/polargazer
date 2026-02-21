import { describe, expect, it } from 'vitest'
import { buildScoreList, calculateClearRank } from '../../app/utils/build-score-list'

describe('calculateClearRank', () => {
  it('プレイ未実施は-を返す', () => {
    expect(calculateClearRank(10000, false)).toBe('-')
  })

  it('ACHIEVEMENT RATEの境界値で正しいランクを返す', () => {
    expect(calculateClearRank(0, true)).toBe('D')
    expect(calculateClearRank(6999, true)).toBe('D')
    expect(calculateClearRank(7000, true)).toBe('C')
    expect(calculateClearRank(7999, true)).toBe('C')
    expect(calculateClearRank(8000, true)).toBe('B')
    expect(calculateClearRank(8499, true)).toBe('B')
    expect(calculateClearRank(8500, true)).toBe('A')
    expect(calculateClearRank(8999, true)).toBe('A')
    expect(calculateClearRank(9000, true)).toBe('AA')
    expect(calculateClearRank(9499, true)).toBe('AA')
    expect(calculateClearRank(9500, true)).toBe('AAA')
    expect(calculateClearRank(9799, true)).toBe('AAA')
    expect(calculateClearRank(9800, true)).toBe('S')
    expect(calculateClearRank(9849, true)).toBe('S')
    expect(calculateClearRank(9850, true)).toBe('SS')
    expect(calculateClearRank(9899, true)).toBe('SS')
    expect(calculateClearRank(9900, true)).toBe('SSS')
    expect(calculateClearRank(9949, true)).toBe('SSS')
    expect(calculateClearRank(9950, true)).toBe('SSS+')
    expect(calculateClearRank(10000, true)).toBe('SSS+')
  })
})

describe('buildScoreList', () => {
  it('楽曲IDでcommonとpdataを結合して集計値を計算できる', () => {
    const rows = buildScoreList(
      [
        {
          music_id: 'm1',
          genre: 1,
          name: 'Song 1',
          composer: 'Comp 1',
          license: '',
          easy: 1,
          normal: 2,
          hard: 3,
          influence: 4,
          polar: 5,
        },
      ],
      [
        {
          musicId: 'm1',
          charts: [
            {
              chart_difficulty_type: 2,
              difficult: 8,
              achievement_rate: 9900,
              highscore: 500000,
              maxcombo: 100,
              combo_rank: 8,
              score_rank: 8,
              clear_status: 4,
              play_count: 3,
              clear_count: 3,
              perfect_clear_count: 1,
              full_combo_count: 1,
              updated_at: '2025-01-01 00:00:00',
              nice_play_rank: 0,
            },
            {
              chart_difficulty_type: 3,
              difficult: 11,
              achievement_rate: 9990,
              highscore: 700000,
              maxcombo: 200,
              combo_rank: 8,
              score_rank: 8,
              clear_status: 3,
              play_count: 4,
              clear_count: 4,
              perfect_clear_count: 0,
              full_combo_count: 1,
              updated_at: '2025-01-02 00:00:00',
              nice_play_rank: 0,
            },
          ],
        },
      ],
    )

    expect(rows).toHaveLength(1)
    expect(rows[0]?.bestHighscore).toBe(700000)
    expect(rows[0]?.bestAchievementRate).toBe(9990)
    expect(rows[0]?.totalPlayCount).toBe(7)
    expect(rows[0]?.chartCount).toBe(2)
    expect(rows[0]?.difficultyBests).toHaveLength(5)
    expect(rows[0]?.difficultyBests[2]?.label).toBe('hard')
    expect(rows[0]?.difficultyBests[2]?.clearRank).toBe('SSS')

    const hard = rows[0]?.difficultyBests.find((item) => item.key === 'hard')
    expect(hard?.isAllPerfect).toBe(true)
    expect(hard?.isFullCombo).toBe(true)
    expect(hard?.maxCombo).toBe(100)
    expect(hard?.comboRank).toBe(8)
    expect(hard?.scoreRank).toBe(8)
    expect(hard?.clearStatus).toBe(4)
    expect(hard?.clearCount).toBe(3)
    expect(hard?.allPerfectCount).toBe(1)
    expect(hard?.fullComboCount).toBe(1)
    expect(hard?.latestUpdatedAt).toBe('2025-01-01 00:00:00')
    expect(hard?.nicePlayRank).toBe(0)
    expect(hard?.chartLevelFromPdata).toBe(8)

    const influence = rows[0]?.difficultyBests.find((item) => item.key === 'influence')
    expect(influence?.clearRank).toBe('SSS+')
    expect(influence?.isAllPerfect).toBe(false)
    expect(influence?.isFullCombo).toBe(true)
    expect(influence?.latestUpdatedAt).toBe('2025-01-02 00:00:00')
    expect(influence?.chartLevelFromPdata).toBe(11)
  })

  it('pdataが無い場合は難易度別自己ベストを初期値で返す', () => {
    const rows = buildScoreList(
      [
        {
          music_id: 'm1',
          genre: 1,
          name: 'Song 1',
          composer: 'Comp 1',
          license: '',
          easy: 1,
          normal: 2,
          hard: 3,
          influence: 0,
          polar: 0,
        },
      ],
      [],
    )

    expect(rows[0]?.bestHighscore).toBe(0)
    expect(rows[0]?.totalPlayCount).toBe(0)
    expect(rows[0]?.chartCount).toBe(0)
    expect(rows[0]?.difficultyBests.map((item) => item.key)).toEqual(['easy', 'normal', 'hard'])
    expect(rows[0]?.difficultyBests.every((item) => item.clearRank === '-')).toBe(true)
    expect(rows[0]?.difficultyBests.every((item) => item.latestUpdatedAt === null)).toBe(true)
    expect(rows[0]?.difficultyBests.every((item) => item.maxCombo === 0)).toBe(true)
  })
})
