import { describe, expect, it } from 'vitest'
import { calculateSkillGrade, parsePaSkillValue } from '../../app/utils/pa-skill-grade'

describe('parsePaSkillValue', () => {
  it('数値文字列を数値へ変換できる', () => {
    expect(parsePaSkillValue('12.34')).toBe(12.34)
  })

  it('数値変換できない文字列はnullを返す', () => {
    expect(parsePaSkillValue('not-a-number')).toBeNull()
  })
})

describe('calculateSkillGrade', () => {
  it('境界値で正しいグレードを返す', () => {
    expect(calculateSkillGrade('0.00')).toBe('Gray')
    expect(calculateSkillGrade('1.00')).toBe('Green')
    expect(calculateSkillGrade('3.00')).toBe('Lime')
    expect(calculateSkillGrade('4.50')).toBe('Lime+')
    expect(calculateSkillGrade('6.00')).toBe('Blue')
    expect(calculateSkillGrade('7.50')).toBe('Blue+')
    expect(calculateSkillGrade('9.00')).toBe('Cyan')
    expect(calculateSkillGrade('10.00')).toBe('Cyan+')
    expect(calculateSkillGrade('11.00')).toBe('Lemon')
    expect(calculateSkillGrade('11.50')).toBe('Lemon+')
    expect(calculateSkillGrade('12.00')).toBe('Orange')
    expect(calculateSkillGrade('12.25')).toBe('Orange+')
    expect(calculateSkillGrade('12.50')).toBe('Orange++')
    expect(calculateSkillGrade('12.75')).toBe('Orange+++')
    expect(calculateSkillGrade('13.00')).toBe('Coral')
    expect(calculateSkillGrade('13.25')).toBe('Coral+')
    expect(calculateSkillGrade('13.50')).toBe('Coral++')
    expect(calculateSkillGrade('13.75')).toBe('Coral+++')
    expect(calculateSkillGrade('14.00')).toBe('Red')
    expect(calculateSkillGrade('14.20')).toBe('Red+')
    expect(calculateSkillGrade('14.40')).toBe('Red++')
    expect(calculateSkillGrade('14.60')).toBe('Red+++')
    expect(calculateSkillGrade('14.80')).toBe('Red++++')
    expect(calculateSkillGrade('15.00')).toBe('Purple')
    expect(calculateSkillGrade('15.10')).toBe('Purple+')
    expect(calculateSkillGrade('15.20')).toBe('Purple++')
    expect(calculateSkillGrade('15.30')).toBe('Purple+++')
    expect(calculateSkillGrade('15.40')).toBe('Purple++++')
    expect(calculateSkillGrade('15.50')).toBe('Navy')
    expect(calculateSkillGrade('15.60')).toBe('Navy+')
    expect(calculateSkillGrade('15.70')).toBe('Navy++')
    expect(calculateSkillGrade('15.80')).toBe('Navy+++')
    expect(calculateSkillGrade('15.90')).toBe('Navy++++')
    expect(calculateSkillGrade('16.00')).toBe('Rainbow')
  })

  it('上限直前では1つ下のグレードを返す', () => {
    expect(calculateSkillGrade('0.99')).toBe('Gray')
    expect(calculateSkillGrade('2.99')).toBe('Green')
    expect(calculateSkillGrade('4.49')).toBe('Lime')
    expect(calculateSkillGrade('11.49')).toBe('Lemon')
    expect(calculateSkillGrade('12.24')).toBe('Orange')
    expect(calculateSkillGrade('13.74')).toBe('Coral++')
    expect(calculateSkillGrade('14.79')).toBe('Red+++')
    expect(calculateSkillGrade('15.89')).toBe('Navy+++')
    expect(calculateSkillGrade('15.99')).toBe('Navy++++')
  })

  it('範囲外値と不正値を仕様どおり扱う', () => {
    expect(calculateSkillGrade('-1.00')).toBe('Gray')
    expect(calculateSkillGrade('16.20')).toBe('Rainbow')
    expect(calculateSkillGrade('invalid')).toBe('-')
  })
})
