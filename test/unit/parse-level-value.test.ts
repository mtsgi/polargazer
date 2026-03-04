import { describe, expect, it } from 'vitest'
import { parseLevelValue } from '../../app/utils/parse-level-value'

describe('parseLevelValue', () => {
  it('空文字または空白のみはnullを返す', () => {
    expect(parseLevelValue('')).toBeNull()
    expect(parseLevelValue('   ')).toBeNull()
  })

  it('非数値はnullを返す', () => {
    expect(parseLevelValue('abc')).toBeNull()
    expect(parseLevelValue('1a')).toBeNull()
  })

  it('小数は切り捨てる', () => {
    expect(parseLevelValue('9.9')).toBe(9)
    expect(parseLevelValue('10.01')).toBe(10)
  })

  it('0以下は1に丸める', () => {
    expect(parseLevelValue('0')).toBe(1)
    expect(parseLevelValue('-5')).toBe(1)
  })

  it('整数はそのまま返す', () => {
    expect(parseLevelValue('1')).toBe(1)
    expect(parseLevelValue('12')).toBe(12)
  })
})
