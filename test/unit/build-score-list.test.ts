import { describe, expect, it } from 'vitest'
import { buildScoreList } from '../../app/utils/build-score-list'

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
  })
})
