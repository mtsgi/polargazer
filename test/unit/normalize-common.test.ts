import { describe, expect, it } from 'vitest'
import { normalizeCommon } from '../../app/utils/normalize-common'

describe('normalizeCommon', () => {
  it('commonレスポンスから楽曲配列を取り出せる', () => {
    const result = normalizeCommon({
      status: 0,
      data: {
        status: 0,
        fail_code: 0,
        musiclist: {
          music: [
            {
              music_id: 'm1',
              genre: 1,
              name: 'Song 1',
              composer: 'Comp',
              license: '',
              easy: 1,
              normal: 2,
              hard: 3,
              influence: 4,
              polar: 5,
            },
          ],
        },
      },
    })

    expect(result).toHaveLength(1)
    expect(result[0]?.music_id).toBe('m1')
  })

  it('楽曲配列が無い場合は空配列を返す', () => {
    const result = normalizeCommon({
      status: 0,
      data: {
        status: 0,
        fail_code: 0,
        musiclist: {
          music: [] as never[],
        },
      },
    })

    expect(result).toEqual([])
  })
})
