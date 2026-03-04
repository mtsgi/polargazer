/**
 * レベル入力値をフィルタ用の数値へ変換する
 */
export function parseLevelValue(value: string): number | null {
  if (!value.trim()) {
    return null
  }

  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return null
  }

  const floor = Math.floor(parsed)
  return floor < 1 ? 1 : floor
}
