/**
 * 単曲SKILL値計算ユーティリティ
 * SKILL値 = 譜面定数 + スコア補正値
 * スコア補正値は達成率に応じたpiecewise線形補間で算出する
 */

/**
 * 達成率の内部値（100倍）を実際の%値に変換する定数
 */
const AR_SCALE = 100

/**
 * 達成率（%）に応じたスコア補正値を計算する
 * @param achievementRateInternal - 達成率の内部値（100倍: 10000 = 100%）
 * @param difficultyConst - 譜面定数（譜面メタにない場合はレベル整数値）
 * @returns スコア補正値
 */
export function calculateScoreBonus(achievementRateInternal: number, difficultyConst: number): number {
  // 内部値を%換算に戻す
  const ar = achievementRateInternal / AR_SCALE

  if (ar >= 100) {
    // 100% 固定値
    return 2.3
  }

  if (ar >= 99.5) {
    // 99.5% → 100%: 補正値 2.0 → 2.3 (slope: +0.6/%)
    return 2.0 + (ar - 99.5) * 0.6
  }

  if (ar >= 98) {
    // 98% → 99.5%: 補正値 0.5 → 2.0 (slope: +1/%)
    return 0.5 + (ar - 98) * 1.0
  }

  if (ar >= 95) {
    // 95% → 98%: 補正値 0 → 0.5 (slope: +0.166.../%)
    return (ar - 95) / 6
  }

  if (ar >= 85) {
    // 85% → 95%: 補正値 -1 → 0 (slope: +0.1/%)
    return -1 + (ar - 85) * 0.1
  }

  if (ar >= 80) {
    // 80% → 85%: 補正値 -(難易度+3)/4 → -1 (slope: +(難易度-1)/20/%)
    return -(difficultyConst + 3) / 4 + (ar - 80) * (difficultyConst - 1) / 20
  }

  if (ar >= 50) {
    // 50% → 80%: 補正値 -難易度 → -(難易度+3)/4 (slope: +(難易度-1)/40/%)
    return -difficultyConst + (ar - 50) * (difficultyConst - 1) / 40
  }

  // AR < 50%: 補正値 -難易度 (一定)
  return -difficultyConst
}

/**
 * 単曲SKILL値を計算する
 * @param achievementRateInternal - 達成率の内部値（100倍: 10000 = 100%）
 * @param difficultyConst - 譜面定数（譜面メタにない場合はレベル整数値）
 * @returns 単曲SKILL値（譜面定数 + スコア補正値）
 */
export function calculateChartSkill(achievementRateInternal: number, difficultyConst: number): number {
  return difficultyConst + calculateScoreBonus(achievementRateInternal, difficultyConst)
}
