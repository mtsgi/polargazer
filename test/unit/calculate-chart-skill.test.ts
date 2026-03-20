import { describe, expect, it } from 'vitest'
import { calculateChartSkill, calculateScoreBonus } from '../../app/utils/calculate-chart-skill'

describe('calculateScoreBonus', () => {
  describe('セグメント境界値での補正値', () => {
    it('AR 100% (10000) = 2.3', () => {
      expect(calculateScoreBonus(10000, 13)).toBeCloseTo(2.3)
    })

    it('AR 99.5% (9950) = 2.0', () => {
      expect(calculateScoreBonus(9950, 13)).toBeCloseTo(2.0)
    })

    it('AR 98% (9800) = 0.5', () => {
      expect(calculateScoreBonus(9800, 13)).toBeCloseTo(0.5)
    })

    it('AR 95% (9500) = 0', () => {
      expect(calculateScoreBonus(9500, 13)).toBeCloseTo(0)
    })

    it('AR 85% (8500) = -1', () => {
      expect(calculateScoreBonus(8500, 13)).toBeCloseTo(-1)
    })

    it('AR 80% (8000) = -(難易度+3)/4 (難易度 = 13 のとき -4)', () => {
      expect(calculateScoreBonus(8000, 13)).toBeCloseTo(-(13 + 3) / 4)
    })

    it('AR 50% (5000) = -難易度 (難易度 = 13 のとき -13)', () => {
      expect(calculateScoreBonus(5000, 13)).toBeCloseTo(-13)
    })

    it('AR 0% (0) = -難易度 (難易度 = 13 のとき -13)', () => {
      expect(calculateScoreBonus(0, 13)).toBeCloseTo(-13)
    })
  })

  describe('各セグメントの線形補間', () => {
    it('99.5% → 100% の中間点 (9975) = 2.15', () => {
      // ar = 99.75, 2.0 + (99.75 - 99.5) * 0.6 = 2.0 + 0.25 * 0.6 = 2.15
      expect(calculateScoreBonus(9975, 13)).toBeCloseTo(2.15)
    })

    it('98% → 99.5% の中間点 (9875) = 1.25', () => {
      // ar = 98.75, 0.5 + (98.75 - 98) * 1.0 = 0.5 + 0.75 = 1.25
      expect(calculateScoreBonus(9875, 13)).toBeCloseTo(1.25)
    })

    it('95% → 98% の中間点 (9650) = 0.25', () => {
      // ar = 96.5, (96.5 - 95) / 6 = 1.5 / 6 = 0.25
      expect(calculateScoreBonus(9650, 13)).toBeCloseTo(0.25)
    })

    it('85% → 95% の中間点 (9000) = -0.5', () => {
      // ar = 90, -1 + (90 - 85) * 0.1 = -1 + 0.5 = -0.5
      expect(calculateScoreBonus(9000, 13)).toBeCloseTo(-0.5)
    })

    it('80% → 85% の中間点 (8250): 難易度13のとき', () => {
      // ar = 82.5, -(13+3)/4 + (82.5 - 80) * (13-1)/20 = -4 + 2.5 * 0.6 = -4 + 1.5 = -2.5
      expect(calculateScoreBonus(8250, 13)).toBeCloseTo(-2.5)
    })

    it('50% → 80% の中間点 (6500): 難易度13のとき', () => {
      // ar = 65, -13 + (65 - 50) * (13-1)/40 = -13 + 15 * 0.3 = -13 + 4.5 = -8.5
      expect(calculateScoreBonus(6500, 13)).toBeCloseTo(-8.5)
    })
  })

  describe('難易度定数の違い', () => {
    it('難易度1.0 のとき AR80%の補正値は -(1+3)/4 = -1', () => {
      expect(calculateScoreBonus(8000, 1)).toBeCloseTo(-1)
    })

    it('難易度14.0 のとき AR80%の補正値は -(14+3)/4 = -4.25', () => {
      expect(calculateScoreBonus(8000, 14)).toBeCloseTo(-4.25)
    })

    it('AR 85%以上では難易度に依存しない', () => {
      expect(calculateScoreBonus(9000, 1)).toBeCloseTo(calculateScoreBonus(9000, 15))
      expect(calculateScoreBonus(9500, 8)).toBeCloseTo(calculateScoreBonus(9500, 13))
    })
  })

  describe('AR 100% 超え', () => {
    it('AR > 100% は 2.3 を返す', () => {
      expect(calculateScoreBonus(10001, 13)).toBeCloseTo(2.3)
    })
  })
})

describe('calculateChartSkill', () => {
  it('AR 100% のとき SKILL = 定数 + 2.3', () => {
    expect(calculateChartSkill(10000, 13)).toBeCloseTo(13 + 2.3)
    expect(calculateChartSkill(10000, 13.5)).toBeCloseTo(13.5 + 2.3)
  })

  it('AR 95% のとき SKILL = 定数 + 0 = 定数', () => {
    expect(calculateChartSkill(9500, 12)).toBeCloseTo(12)
    expect(calculateChartSkill(9500, 13.5)).toBeCloseTo(13.5)
  })

  it('AR 50% のとき SKILL = 定数 - 定数 = 0', () => {
    expect(calculateChartSkill(5000, 10)).toBeCloseTo(0)
    expect(calculateChartSkill(5000, 13.5)).toBeCloseTo(0)
  })

  it('AR 80% 難易度13のとき SKILL = 13 - (13+3)/4 = 13 - 4 = 9', () => {
    expect(calculateChartSkill(8000, 13)).toBeCloseTo(9)
  })

  it('AR 0 のとき SKILL = 定数 - 定数 = 0', () => {
    expect(calculateChartSkill(0, 13)).toBeCloseTo(0)
  })

  it('プレイ未実施(AR=0) と 難易度定数の積み合わせ', () => {
    expect(calculateChartSkill(0, 0)).toBeCloseTo(0)
    expect(calculateChartSkill(0, 15)).toBeCloseTo(0)
  })
})
