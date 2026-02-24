import type { CommonMusic } from '../types/common'
import type { ClearRank, DifficultyBest, DifficultyKey, DifficultyLevels, NormalizedPDataMusic, ScoreSongRow } from '../types/view-model'

/**
 * pdataのchart_difficulty_typeをPolargazerの難易度キーに変換するマップ。
 */
const CHART_DIFFICULTY_MAP: Record<number, DifficultyKey> = {
  0: 'easy',
  1: 'normal',
  2: 'hard',
  3: 'influence',
  4: 'polar',
}

/**
 * 難易度キーから表示ラベルへ変換するマップ。
 */
const DIFFICULTY_LABEL_MAP: Record<DifficultyKey, string> = {
  easy: 'easy',
  normal: 'normal',
  hard: 'hard',
  influence: 'influence',
  polar: 'polar',
}

/**
 * ACHIEVEMENT RATE（100倍値）とプレイ有無からクリアランクを算出する
 */
export function calculateClearRank(achievementRate: number, hasPlayed: boolean): ClearRank {
  if (!hasPlayed) {
    return '-'
  }

  if (achievementRate >= 9950) {
    return 'SSS+'
  }
  if (achievementRate >= 9900) {
    return 'SSS'
  }
  if (achievementRate >= 9850) {
    return 'SS'
  }
  if (achievementRate >= 9800) {
    return 'S'
  }
  if (achievementRate >= 9500) {
    return 'AAA'
  }
  if (achievementRate >= 9000) {
    return 'AA'
  }
  if (achievementRate >= 8500) {
    return 'A'
  }
  if (achievementRate >= 8000) {
    return 'B'
  }
  if (achievementRate >= 7000) {
    return 'C'
  }
  return 'D'
}

export function buildScoreList(commonList: CommonMusic[], pdataList: NormalizedPDataMusic[]): ScoreSongRow[] {
  // 結合高速化のため、pdataを楽曲IDでマップ化する。
  const pdataMap = new Map(pdataList.map((item) => [item.musicId, item]))

  return commonList.map((music) => {
    const pdata = pdataMap.get(music.music_id)
    const charts = pdata?.charts ?? []

    // まず「実装済み難易度(level > 0)」のみ表示対象として初期化する。
    const difficultyBestMap = initializeDifficultyBestMap(music)

    // pdataの譜面別記録を、難易度単位の自己ベストへ集約する。
    for (const chart of charts) {
      const difficultyKey = CHART_DIFFICULTY_MAP[chart.chart_difficulty_type]
      if (!difficultyKey) {
        continue
      }

      const best = difficultyBestMap.get(difficultyKey)
      if (!best) {
        continue
      }

      best.bestHighscore = Math.max(best.bestHighscore, chart.highscore)
      best.bestAchievementRate = Math.max(best.bestAchievementRate, chart.achievement_rate)
      best.totalPlayCount += chart.play_count
      best.maxCombo = Math.max(best.maxCombo, chart.maxcombo)
      best.comboRank = Math.max(best.comboRank, chart.combo_rank)
      best.scoreRank = Math.max(best.scoreRank, chart.score_rank)
      best.clearStatus = Math.max(best.clearStatus, chart.clear_status)
      best.clearCount += chart.clear_count
      best.allPerfectCount += chart.perfect_clear_count
      best.fullComboCount += chart.full_combo_count
      best.nicePlayRank = Math.max(best.nicePlayRank, chart.nice_play_rank)
      best.chartLevelFromPdata = Math.max(best.chartLevelFromPdata, chart.difficult)
      best.latestUpdatedAt = pickLatestUpdatedAt(best.latestUpdatedAt, chart.updated_at)
      best.isAllPerfect = best.isAllPerfect || chart.perfect_clear_count > 0
      best.isFullCombo = best.isFullCombo || chart.full_combo_count > 0
    }

    // 集約が完了した後に一度だけクリアランクを算出する。
    for (const best of difficultyBestMap.values()) {
      best.clearRank = calculateClearRank(best.bestAchievementRate, best.totalPlayCount > 0)
    }

    const difficultyBests = Array.from(difficultyBestMap.values())

    const bestHighscore = difficultyBests.reduce((max, item) => Math.max(max, item.bestHighscore), 0)
    const bestAchievementRate = difficultyBests.reduce((max, item) => Math.max(max, item.bestAchievementRate), 0)
    const totalPlayCount = difficultyBests.reduce((sum, item) => sum + item.totalPlayCount, 0)
    const chartCount = charts.length

    return {
      musicId: music.music_id,
      name: music.name,
      composer: music.composer,
      genre: music.genre,
      levels: pickLevels(music),
      bestHighscore,
      bestAchievementRate,
      totalPlayCount,
      chartCount,
      difficultyBests,
    }
  })
}

/**
 * level > 0 の難易度だけを自己ベスト初期値として作成する。
 */
function initializeDifficultyBestMap(music: CommonMusic): Map<DifficultyKey, DifficultyBest> {
  const levels = pickLevels(music)
  const entries: [DifficultyKey, DifficultyBest][] = []

  for (const [key, level] of Object.entries(levels) as [DifficultyKey, number][]) {
    // レベル0は未実装難易度のため表示対象にしない。
    if (level === 0) {
      continue
    }

    entries.push([
      key,
      {
        key,
        label: DIFFICULTY_LABEL_MAP[key],
        level,
        bestHighscore: 0,
        bestAchievementRate: 0,
        clearRank: '-',
        totalPlayCount: 0,
        maxCombo: 0,
        comboRank: 0,
        scoreRank: 0,
        clearStatus: 0,
        clearCount: 0,
        allPerfectCount: 0,
        fullComboCount: 0,
        latestUpdatedAt: null,
        nicePlayRank: 0,
        chartLevelFromPdata: 0,
        isAllPerfect: false,
        isFullCombo: false,
      },
    ])
  }

  return new Map(entries)
}

function pickLevels(music: CommonMusic): DifficultyLevels {
  return {
    easy: music.easy,
    normal: music.normal,
    hard: music.hard,
    influence: music.influence,
    polar: music.polar,
  }
}

/**
 * 2つの更新日時文字列から新しい方を返す
 */
function pickLatestUpdatedAt(current: string | null, next: string): string {
  if (!current) {
    return next
  }

  const currentTime = parsePDataDateString(current)
  const nextTime = parsePDataDateString(next)

  if (currentTime === null || nextTime === null) {
    return current >= next ? current : next
  }

  return nextTime > currentTime ? next : current
}

/**
 * pdataの日時文字列をDate.parse可能な形式へ変換してepochミリ秒を返す
 */
function parsePDataDateString(value: string): number | null {
  const normalized = value.replace(' ', 'T')
  const parsed = Date.parse(normalized)

  return Number.isNaN(parsed) ? null : parsed
}
