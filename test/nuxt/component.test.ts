import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DataSourceForm from '../../app/components/DataSourceForm.vue'
import ScoreSongTable from '../../app/components/ScoreSongTable.vue'
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
                totalPlayCount: 10,
              },
              {
                key: 'hard',
                label: 'hard',
                level: 3,
                bestHighscore: 120000,
                bestAchievementRate: 9900,
                totalPlayCount: 4,
              },
            ],
          },
        ],
      },
    })

    expect(component.text()).toContain('Song 1')
    expect(component.text()).toContain('EASY')
    expect(component.text()).toContain('HARD')
  })

  it('app.vueは初期表示で未読み込みメッセージを表示する', async () => {
    const component = await mountSuspended(App)
    expect(component.text()).toContain('未読み込みです。URLを確認して「Load Data」を押してください。')
  })
})
