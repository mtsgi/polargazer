/**
 * PA SKILLグレード名
 */
export type SkillGrade =
  | 'Gray'
  | 'Green'
  | 'Lime'
  | 'Lime+'
  | 'Blue'
  | 'Blue+'
  | 'Cyan'
  | 'Cyan+'
  | 'Lemon'
  | 'Lemon+'
  | 'Orange'
  | 'Orange+'
  | 'Orange++'
  | 'Orange+++'
  | 'Coral'
  | 'Coral+'
  | 'Coral++'
  | 'Coral+++'
  | 'Red'
  | 'Red+'
  | 'Red++'
  | 'Red+++'
  | 'Red++++'
  | 'Purple'
  | 'Purple+'
  | 'Purple++'
  | 'Purple+++'
  | 'Purple++++'
  | 'Navy'
  | 'Navy+'
  | 'Navy++'
  | 'Navy+++'
  | 'Navy++++'
  | 'Rainbow'

interface SkillThreshold {
  /** グレード名 */
  grade: SkillGrade
  /** このグレードの下限値 */
  min: number
}

const SKILL_THRESHOLDS: SkillThreshold[] = [
  { grade: 'Gray', min: 0.0 },
  { grade: 'Green', min: 1.0 },
  { grade: 'Lime', min: 3.0 },
  { grade: 'Lime+', min: 4.5 },
  { grade: 'Blue', min: 6.0 },
  { grade: 'Blue+', min: 7.5 },
  { grade: 'Cyan', min: 9.0 },
  { grade: 'Cyan+', min: 10.0 },
  { grade: 'Lemon', min: 11.0 },
  { grade: 'Lemon+', min: 11.5 },
  { grade: 'Orange', min: 12.0 },
  { grade: 'Orange+', min: 12.25 },
  { grade: 'Orange++', min: 12.5 },
  { grade: 'Orange+++', min: 12.75 },
  { grade: 'Coral', min: 13.0 },
  { grade: 'Coral+', min: 13.25 },
  { grade: 'Coral++', min: 13.5 },
  { grade: 'Coral+++', min: 13.75 },
  { grade: 'Red', min: 14.0 },
  { grade: 'Red+', min: 14.2 },
  { grade: 'Red++', min: 14.4 },
  { grade: 'Red+++', min: 14.6 },
  { grade: 'Red++++', min: 14.8 },
  { grade: 'Purple', min: 15.0 },
  { grade: 'Purple+', min: 15.1 },
  { grade: 'Purple++', min: 15.2 },
  { grade: 'Purple+++', min: 15.3 },
  { grade: 'Purple++++', min: 15.4 },
  { grade: 'Navy', min: 15.5 },
  { grade: 'Navy+', min: 15.6 },
  { grade: 'Navy++', min: 15.7 },
  { grade: 'Navy+++', min: 15.8 },
  { grade: 'Navy++++', min: 15.9 },
  { grade: 'Rainbow', min: 16.0 },
]

/**
 * PA SKILL文字列を表示用の数値へ変換する
 */
export function parsePaSkillValue(paSkill: string): number | null {
  const value = Number(paSkill)
  if (Number.isNaN(value)) {
    return null
  }
  return value
}

/**
 * PA SKILL値からスキルグレードを算出する
 */
export function calculateSkillGrade(paSkill: string): SkillGrade | '-' {
  const parsed = parsePaSkillValue(paSkill)
  if (parsed === null) {
    return '-'
  }

  if (parsed < 0) {
    return 'Gray'
  }

  if (parsed >= 16) {
    return 'Rainbow'
  }

  for (let index = SKILL_THRESHOLDS.length - 1; index >= 0; index -= 1) {
    const threshold = SKILL_THRESHOLDS[index]
    if (threshold && parsed >= threshold.min) {
      return threshold.grade
    }
  }

  return 'Gray'
}
