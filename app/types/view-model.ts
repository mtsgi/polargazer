import type { CommonMusic } from './common'
import type { PDataChart, PDataUserProfile } from './pdata'

/**
 * Polargazer内で扱う難易度キー
 */
export type DifficultyKey = 'easy' | 'normal' | 'hard' | 'influence' | 'polar'

/**
 * 楽曲マスターに定義されている難易度レベル群
 */
export interface DifficultyLevels {
  /** EASYの譜面レベル 0は未実装 */
  easy: number
  /** NORMALの譜面レベル 0は未実装 */
  normal: number
  /** HARDの譜面レベル 0は未実装 */
  hard: number
  /** INFLUENCEの譜面レベル 0は未実装 */
  influence: number
  /** POLARの譜面レベル 0は未実装 */
  polar: number
}

/**
 * pdataを扱いやすく正規化した楽曲単位データ
 */
export interface NormalizedPDataMusic {
  /** 楽曲ID common側のmusic_idと結合する */
  musicId: string
  /** 譜面別の自己ベスト情報配列 */
  charts: PDataChart[]
}

/**
 * 難易度ごとの自己ベスト表示用データ
 */
export interface DifficultyBest {
  /** 難易度キー */
  key: DifficultyKey
  /** 画面表示用の難易度ラベル */
  label: string
  /** その難易度のレベル値 */
  level: number
  /** その難易度の自己ベストスコア */
  bestHighscore: number
  /** その難易度の最高達成率（内部値: 100倍） */
  bestAchievementRate: number
  /** その難易度の累計プレイ回数 */
  totalPlayCount: number
}

/**
 * 楽曲一覧テーブルの1行分データ
 */
export interface ScoreSongRow {
  /** 楽曲ID */
  musicId: string
  /** 楽曲名 */
  name: string
  /** 作曲者名 */
  composer: string
  /** ジャンルID */
  genre: number
  /** マスター上の難易度レベル */
  levels: DifficultyLevels
  /** 全難易度の中で最大のハイスコア */
  bestHighscore: number
  /** 全難易度の中で最大の達成率（内部値: 100倍） */
  bestAchievementRate: number
  /** 全難易度の累計プレイ回数 */
  totalPlayCount: number
  /** スコアが存在する譜面数 */
  chartCount: number
  /** 実装済み難易度(レベル>0)のみを対象にした自己ベスト一覧 */
  difficultyBests: DifficultyBest[]
}

/**
 * データ取得元URLの入力値
 */
export interface DataSourceUrls {
  /** commonデータURL */
  commonUrl: string
  /** pdataデータURL */
  pdataUrl: string
}

/**
 * common/pdata読込後にUIで利用する統合データ
 */
export interface LoadedScoreData {
  /** common由来の楽曲マスター配列 */
  commonList: CommonMusic[]
  /** pdata由来の正規化スコア配列 */
  pdataList: NormalizedPDataMusic[]
  /** ユーザープロフィール */
  profile: PDataUserProfile | null
  /** 一覧表示用に加工済みの行データ */
  rows: ScoreSongRow[]
}
