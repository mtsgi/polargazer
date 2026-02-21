import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DataSourceForm from '../../app/components/DataSourceForm.vue'
import ScoreSongTable from '../../app/components/ScoreSongTable.vue'
import UserProfileCard from '../../app/components/UserProfileCard.vue'
import App from '../../app/app.vue'

describe('コンポーネント表示', () => {
  it('DataSourceFormをマウントできる', async () => {
    const component = await mountSuspended(DataSourceForm, {
      props: {
        commonUrl: '/common_getdata.html',
        pdataUrl: '/pdata_getdata.html',
        loading: false,
      },
    })

    expect(component.text()).toContain('common URL')
    expect(component.text()).toContain('pdata URL')
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
      },
    })

    await component.get('.difficulty-item').trigger('click')

    const emitted = component.emitted('selectDifficulty')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]?.[0]?.row.musicId).toBe('m1')
    expect(emitted?.[0]?.[0]?.difficulty.key).toBe('easy')
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
})
