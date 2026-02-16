import type { CommonMusic } from '../types/common'
import type { DifficultyBest, DifficultyKey, DifficultyLevels, NormalizedPDataMusic, ScoreSongRow } from '../types/view-model'

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
        totalPlayCount: 0,
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
