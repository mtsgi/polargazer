import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { ScoreSongRow } from '../../app/types/view-model'
import DataSourceForm from '../../app/components/DataSourceForm.vue'
import ScoreFilterSort from '../../app/components/ScoreFilterSort.vue'
import ScoreSongTable from '../../app/components/ScoreSongTable.vue'
import UserProfileCard from '../../app/components/UserProfileCard.vue'
import SkillChartItem from '../../app/components/SkillChartItem.vue'
import App from '../../app/app.vue'

describe('コンポーネント表示', () => {
  it('DataSourceFormをマウントできる', async () => {
    const component = await mountSuspended(DataSourceForm, {
      props: {
        commonUrl: '/common_getdata.html',
        pdataUrl: '/pdata_getdata.html',
        constsUrl: '/consts.json',
        loading: false,
      },
    })

    expect(component.text()).toContain('common')
    expect(component.text()).toContain('pdata')
    expect(component.text()).toContain('consts')
  })

  it('ScoreSongTableで難易度別自己ベストを表示できる', async () => {
    const component = await mountSuspended(ScoreSongTable, {
      props: {
        rows: [
          {
            musicId: 'm1',
            name: 'Song 1',
            composer: 'Comp',
            genre: 1,
            levels: {
              easy: 1,
              normal: 2,
              hard: 3,
              influence: 4,
              polar: 5,
            },
            bestHighscore: 123456,
            bestAchievementRate: 9987,
            totalPlayCount: 10,
            chartCount: 2,
            difficultyBests: [
              {
                key: 'easy',
                label: 'easy',
                level: 1,
                bestHighscore: 123456,
                bestAchievementRate: 9987,
                clearRank: 'SSS+',
                totalPlayCount: 10,
                maxCombo: 200,
                comboRank: 8,
                scoreRank: 8,
                clearStatus: 4,
                clearCount: 10,
                allPerfectCount: 2,
                fullComboCount: 3,
                latestUpdatedAt: '2025-01-03 01:02:03',
                nicePlayRank: 5,
                chartLevelFromPdata: 1,
                isAllPerfect: true,
                isFullCombo: true,
              },
              {
                key: 'hard',
                label: 'hard',
                level: 3,
                bestHighscore: 120000,
                bestAchievementRate: 9900,
                clearRank: 'SSS',
                totalPlayCount: 4,
                maxCombo: 100,
                comboRank: 7,
                scoreRank: 8,
                clearStatus: 3,
                clearCount: 4,
                allPerfectCount: 0,
                fullComboCount: 2,
                latestUpdatedAt: '2025-01-02 01:02:03',
                nicePlayRank: 3,
                chartLevelFromPdata: 3,
                isAllPerfect: false,
                isFullCombo: true,
              },
            ],
          },
        ],
        currentPage: 1,
        totalItems: 1,
        pageSize: 50,
        hideUnplayedDifficulties: false,
      },
    })

    expect(component.text()).toContain('Song 1')
    expect(component.text()).toContain('EASY')
    expect(component.text()).toContain('HARD')
    expect(component.text()).toContain('ACHIEVEMENT RATE')
    expect(component.text()).toContain('CLEAR RANK')
    expect(component.text()).toContain('AP')
    expect(component.text()).toContain('FC')
  })

  it('ScoreSongTableで難易度クリック時に選択イベントを発火できる', async () => {
    const component = await mountSuspended(ScoreSongTable, {
      props: {
        rows: [
          {
            musicId: 'm1',
            name: 'Song 1',
            composer: 'Comp',
            genre: 1,
            levels: {
              easy: 1,
              normal: 2,
              hard: 3,
              influence: 4,
              polar: 5,
            },
            bestHighscore: 123456,
            bestAchievementRate: 9987,
            totalPlayCount: 10,
            chartCount: 1,
            difficultyBests: [
              {
                key: 'easy',
                label: 'easy',
                level: 1,
                bestHighscore: 123456,
                bestAchievementRate: 9987,
                clearRank: 'SSS+',
                totalPlayCount: 10,
                maxCombo: 200,
                comboRank: 8,
                scoreRank: 8,
                clearStatus: 4,
                clearCount: 10,
                allPerfectCount: 2,
                fullComboCount: 3,
                latestUpdatedAt: '2025-01-03 01:02:03',
                nicePlayRank: 5,
                chartLevelFromPdata: 1,
                isAllPerfect: true,
                isFullCombo: true,
              },
            ],
          },
        ],
        currentPage: 1,
        totalItems: 1,
        pageSize: 50,
        hideUnplayedDifficulties: false,
      },
    })

    await component.get('.difficulty-item').trigger('click')

    const emitted = component.emitted('selectDifficulty')
    expect(emitted).toBeTruthy()
    const payload = emitted?.[0]?.[0] as { row: { musicId: string }, difficulty: { key: string } } | undefined
    expect(payload?.row.musicId).toBe('m1')
    expect(payload?.difficulty.key).toBe('easy')
  })

  it('ScoreSongTableでページ移動イベントを発火できる', async () => {
    const rows: ScoreSongRow[] = Array.from({ length: 2 }, (_, index) => ({
      musicId: `m${index + 1}`,
      name: `Song ${index + 1}`,
      composer: 'Comp',
      genre: 1,
      levels: {
        easy: 1,
        normal: 2,
        hard: 3,
        influence: 4,
        polar: 5,
      },
      bestHighscore: 123456,
      bestAchievementRate: 9987,
      totalPlayCount: 10,
      chartCount: 1,
      difficultyBests: [
        {
          key: 'easy',
          label: 'easy',
          level: 1,
          bestHighscore: 123456,
          bestAchievementRate: 9987,
          clearRank: 'SSS+',
          totalPlayCount: 10,
          maxCombo: 200,
          comboRank: 8,
          scoreRank: 8,
          clearStatus: 4,
          clearCount: 10,
          allPerfectCount: 2,
          fullComboCount: 3,
          latestUpdatedAt: '2025-01-03 01:02:03',
          nicePlayRank: 5,
          chartLevelFromPdata: 1,
          isAllPerfect: true,
          isFullCombo: true,
        },
      ],
    }))

    const component = await mountSuspended(ScoreSongTable, {
      props: {
        rows: [rows[0]!],
        currentPage: 1,
        totalItems: 2,
        pageSize: 1,
        hideUnplayedDifficulties: false,
      },
    })

    await component.get('.song-list__page-next').trigger('click')

    const emitted = component.emitted('update:currentPage')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]?.[0]).toBe(2)
  })

  it('ScoreFilterSortでソート項目/並び順/表示件数を更新できる', async () => {
    const component = await mountSuspended(ScoreFilterSort, {
      props: {
        searchWord: '',
        sortField: 'default',
        sortOrder: 'asc',
        pageSize: '50',
        filterConditions: [],
        hideUnplayedDifficulties: false,
      },
    })

    await component.get('#sort-field').setValue('easyLevel')
    await component.get('#sort-order').setValue('desc')
    await component.get('#page-size').setValue('20')

    expect(component.emitted('update:sortField')?.[0]?.[0]).toBe('easyLevel')
    expect(component.emitted('update:sortOrder')?.[0]?.[0]).toBe('desc')
    expect(component.emitted('update:pageSize')?.[0]?.[0]).toBe('20')
  })

  it('ScoreFilterSortで条件追加と未プレイ非表示更新を発火できる', async () => {
    const component = await mountSuspended(ScoreFilterSort, {
      props: {
        searchWord: '',
        sortField: 'default',
        sortOrder: 'asc',
        pageSize: '50',
        filterConditions: [],
        hideUnplayedDifficulties: false,
      },
    })

    await component.get('.sort-filter__condition-header .ui-button').trigger('click')
    await component.get('input#hide-unplayed-difficulties').setValue(true)

    const emittedConditions = component.emitted('update:filterConditions')
    expect(emittedConditions).toBeTruthy()
    expect((emittedConditions?.[0]?.[0] as Array<{ type: string }>)[0]?.type).toBe('level')
    expect(component.emitted('update:hideUnplayedDifficulties')?.[0]?.[0]).toBe(true)
  })

  it('ScoreSongTableで未プレイ難易度非表示を反映できる', async () => {
    const component = await mountSuspended(ScoreSongTable, {
      props: {
        rows: [
          {
            musicId: 'm1',
            name: 'Song 1',
            composer: 'Comp',
            genre: 1,
            levels: {
              easy: 1,
              normal: 2,
              hard: 3,
              influence: 4,
              polar: 5,
            },
            bestHighscore: 123456,
            bestAchievementRate: 9987,
            totalPlayCount: 10,
            chartCount: 2,
            difficultyBests: [
              {
                key: 'easy',
                label: 'easy',
                level: 1,
                bestHighscore: 123456,
                bestAchievementRate: 9987,
                clearRank: 'SSS+',
                totalPlayCount: 0,
                maxCombo: 0,
                comboRank: 0,
                scoreRank: 0,
                clearStatus: 0,
                clearCount: 0,
                allPerfectCount: 0,
                fullComboCount: 0,
                latestUpdatedAt: null,
                nicePlayRank: 0,
                chartLevelFromPdata: 1,
                isAllPerfect: false,
                isFullCombo: false,
              },
              {
                key: 'hard',
                label: 'hard',
                level: 3,
                bestHighscore: 120000,
                bestAchievementRate: 9900,
                clearRank: 'SSS',
                totalPlayCount: 4,
                maxCombo: 100,
                comboRank: 7,
                scoreRank: 8,
                clearStatus: 3,
                clearCount: 4,
                allPerfectCount: 0,
                fullComboCount: 2,
                latestUpdatedAt: '2025-01-02 01:02:03',
                nicePlayRank: 3,
                chartLevelFromPdata: 3,
                isAllPerfect: false,
                isFullCombo: true,
              },
            ],
          },
        ],
        currentPage: 1,
        totalItems: 1,
        pageSize: 50,
        hideUnplayedDifficulties: true,
      },
    })

    expect(component.findAll('.difficulty-item')).toHaveLength(1)
    expect(component.text()).toContain('HARD')
    expect(component.text()).not.toContain('EASY')
  })

  it('app.vueは初期表示で未読み込みメッセージを表示する', async () => {
    const component = await mountSuspended(App)
    expect(component.text()).toContain('未読み込みです。URLを確認して「Load Data」を押してください。')
  })

  it('UserProfileCardでPA SKILLグレードを表示できる', async () => {
    const component = await mountSuspended(UserProfileCard, {
      props: {
        profile: {
          usr_name: 'tester',
          usr_rank: 1,
          comment: '',
          is_tutorial_cleared: true,
          exp: 100,
          pa_class: 2,
          pa_skill: '15.60',
        },
      },
    })

    expect(component.text()).toContain('スキル')
    expect(component.text()).toContain('スキルグレード')
    expect(component.text()).toContain('Navy+')
  })

  it('SkillChartItemで楽曲名・AR・SKILL値を表示できる', async () => {
    const component = await mountSuspended(SkillChartItem, {
      props: {
        row: {
          musicId: 'm1',
          songName: 'Test Song',
          composer: 'Test Composer',
          difficultyKey: 'hard',
          difficultyLabel: 'HARD',
          level: 11,
          constValue: 11.3,
          isEstimatedConst: false,
          bestAchievementRate: 9950,
          skillValue: 13.63,
          isPaSkillTarget: true,
        },
      },
    })

    expect(component.text()).toContain('Test Song')
    expect(component.text()).toContain('99.50%')
    expect(component.text()).toContain('13.6300')
    // isEstimatedConst=false のとき参考値バッジは非表示
    expect(component.text()).not.toContain('参考値')
  })

  it('SkillChartItemでisEstimatedConst=trueのとき参考値バッジを表示する', async () => {
    const component = await mountSuspended(SkillChartItem, {
      props: {
        row: {
          musicId: 'm2',
          songName: 'Unknown Song',
          composer: 'Unknown',
          difficultyKey: 'polar',
          difficultyLabel: 'POLAR',
          level: 13,
          constValue: 13,
          isEstimatedConst: true,
          bestAchievementRate: 9800,
          skillValue: 13.50,
          isPaSkillTarget: false,
        },
      },
    })

    expect(component.text()).toContain('Unknown Song')
    expect(component.text()).toContain('参考値')
  })
})
