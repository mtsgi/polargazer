import { describe, expect, it } from 'vitest'
import { buildConstsMap } from '../../app/utils/normalize-consts'

describe('buildConstsMap', () => {
  it('定数値と楽曲名・難易度キーのペアからマップを構築できる', () => {
    const map = buildConstsMap({
      '14.4': [['Song Alpha', 'influence']],
      '13.9': [['Song Beta', 'influence'], ['Song Gamma', 'influence']],
    })

    expect(map.get('Song Alpha::influence')).toBe(14.4)
    expect(map.get('Song Beta::influence')).toBe(13.9)
    expect(map.get('Song Gamma::influence')).toBe(13.9)
  })

  it('不正な定数値キーはスキップする', () => {
    const map = buildConstsMap({
      'invalid': [['Song A', 'hard']],
      '12.5': [['Song B', 'hard']],
    })

    expect(map.has('Song A::hard')).toBe(false)
    expect(map.get('Song B::hard')).toBe(12.5)
  })

  it('整数値のキーも正しく扱う', () => {
    const map = buildConstsMap({
      '10.0': [['Easy Song', 'easy']],
    })

    expect(map.get('Easy Song::easy')).toBe(10.0)
  })

  it('空の定数表では空のマップを返す', () => {
    const map = buildConstsMap({})

    expect(map.size).toBe(0)
  })

  it('エントリが空配列の定数値はスキップする', () => {
    const map = buildConstsMap({
      '12.5': [],
      '13.0': [['Song C', 'polar']],
    })

    expect(map.size).toBe(1)
    expect(map.get('Song C::polar')).toBe(13.0)
  })
})
