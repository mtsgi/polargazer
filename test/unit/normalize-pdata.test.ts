import { describe, expect, it } from 'vitest'
import { extractUserProfile, normalizePDataMusic } from '../../app/utils/normalize-pdata'

describe('normalizePDataMusic', () => {
  it('chartが単体オブジェクトでも配列に正規化できる', () => {
    const result = normalizePDataMusic({
      status: 0,
      data: {
        status: 0,
        fail_code: 0,
        score_data: {
          usr_music_highscore: {
            music: [
              {
                music_id: 'm1',
                name: 'Song 1',
                composer: 'Comp',
                license: '',
                genre: 1,
                chart_list: {
                  chart: {
                    chart_difficulty_type: 2,
                    difficult: 8,
                    achievement_rate: 9999,
                    highscore: 1000,
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
                },
              },
            ],
          },
        },
        play_data: {
          result: 0,
          usr_profile: {
            usr_name: 'tester',
            usr_rank: 1,
            comment: '',
            is_tutorial_cleared: true,
            exp: 100,
            pa_class: 1,
            pa_skill: '1.00',
          },
          crew_id: 'crew',
        },
      },
    })

    expect(result).toHaveLength(1)
    expect(result[0]?.charts).toHaveLength(1)
    expect(result[0]?.charts[0]?.highscore).toBe(1000)
  })

  it('chartが配列でもそのまま正規化できる', () => {
    const result = normalizePDataMusic({
      status: 0,
      data: {
        status: 0,
        fail_code: 0,
        score_data: {
          usr_music_highscore: {
            music: [
              {
                music_id: 'm1',
                name: 'Song 1',
                composer: 'Comp',
                license: '',
                genre: 1,
                chart_list: {
                  chart: [
                    {
                      chart_difficulty_type: 2,
                      difficult: 8,
                      achievement_rate: 9999,
                      highscore: 1000,
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
                      achievement_rate: 9950,
                      highscore: 2000,
                      maxcombo: 200,
                      combo_rank: 7,
                      score_rank: 8,
                      clear_status: 2,
                      play_count: 4,
                      clear_count: 4,
                      perfect_clear_count: 0,
                      full_combo_count: 0,
                      updated_at: '2025-01-02 00:00:00',
                      nice_play_rank: 0,
                    },
                  ],
                },
              },
            ],
          },
        },
        play_data: {
          result: 0,
          usr_profile: {
            usr_name: 'tester',
            usr_rank: 1,
            comment: '',
            is_tutorial_cleared: true,
            exp: 100,
            pa_class: 1,
            pa_skill: '1.00',
          },
          crew_id: 'crew',
        },
      },
    })

    expect(result[0]?.charts).toHaveLength(2)
  })
})

describe('extractUserProfile', () => {
  it('プロフィールを抽出できる', () => {
    const profile = extractUserProfile({
      status: 0,
      data: {
        status: 0,
        fail_code: 0,
        score_data: {
          usr_music_highscore: {
            music: [],
          },
        },
        play_data: {
          result: 0,
          usr_profile: {
            usr_name: 'tester',
            usr_rank: 1,
            comment: '',
            is_tutorial_cleared: true,
            exp: 100,
            pa_class: 1,
            pa_skill: '1.00',
          },
          crew_id: 'crew',
        },
      },
    })

    expect(profile?.usr_name).toBe('tester')
  })
})
