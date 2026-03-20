import { describe, expect, it } from 'vitest'
import { buildChartMetaMap } from '../../app/utils/normalize-meta'
import type { MetaData } from '../../app/types/view-model'

describe('buildChartMetaMap', () => {
  it('chartsの曲名・難易度階層からメタデータマップを構築できる', () => {
    const map = buildChartMetaMap({
      charts: {
        'Song Alpha': {
          influence: {
            constValue: 14.4,
            taskDirector: 'Alice',
          },
        },
        'Song Beta': {
          hard: {
            constValue: 12.6,
          },
        },
      },
    })

    expect(map.get('Song Alpha::influence')?.constValue).toBe(14.4)
    expect(map.get('Song Alpha::influence')?.taskDirector).toBe('Alice')
    expect(map.get('Song Beta::hard')?.constValue).toBe(12.6)
  })

  it('constValueが文字列でも数値として正規化できる', () => {
    const map = buildChartMetaMap({
      charts: {
        'Song A': {
          easy: {
            constValue: '10.5',
          },
        },
      },
    } as unknown as MetaData)

    expect(map.get('Song A::easy')?.constValue).toBe(10.5)
  })

  it('taskDirectorは前後空白をtrimして保持する', () => {
    const map = buildChartMetaMap({
      charts: {
        'Song C': {
          polar: {
            taskDirector: '  Bob  ',
          },
        },
      },
    })

    expect(map.get('Song C::polar')?.taskDirector).toBe('Bob')
  })

  it('将来拡張用の未知メタ項目を保持できる', () => {
    const map = buildChartMetaMap({
      charts: {
        'Song Future': {
          hard: {
            visualDirector: 'Carol',
            memo: {
              note: 'extended',
            },
          },
        },
      },
    })

    expect(map.get('Song Future::hard')?.visualDirector).toBe('Carol')
    expect(map.get('Song Future::hard')?.memo).toEqual({ note: 'extended' })
  })

  it('不正なエントリはスキップする', () => {
    const map = buildChartMetaMap({
      charts: {
        'Song A': {
          hard: {
            constValue: Number.NaN,
            taskDirector: '',
          },
        },
        'Song B': {
          hard: null,
        },
        'Song C': null,
      },
    } as unknown as MetaData)

    expect(map.size).toBe(0)
  })

  it('chartsがない場合は空のマップを返す', () => {
    const map = buildChartMetaMap({})

    expect(map.size).toBe(0)
  })
})
