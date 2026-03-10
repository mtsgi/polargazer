import type { CommonMusic } from './common'
import type { PDataChart, PDataUserProfile } from './pdata'

/**
 * Polargazer内で扱う難易度キー
 */
export type DifficultyKey = 'easy' | 'normal' | 'hard' | 'influence' | 'polar'

/**
 * 譜面のクリアランク
 */
export type ClearRank = 'D' | 'C' | 'B' | 'A' | 'AA' | 'AAA' | 'S' | 'SS' | 'SSS' | 'SSS+' | '-'

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
  /** その難易度のクリアランク */
  clearRank: ClearRank
  /** その難易度の累計プレイ回数 */
  totalPlayCount: number
  /** その難易度の最大コンボ */
  maxCombo: number
  /** その難易度の最高コンボランク */
  comboRank: number
  /** その難易度の最高スコアランク */
  scoreRank: number
  /** その難易度の最高クリア状況 */
  clearStatus: number
  /** その難易度の累計クリア回数 */
  clearCount: number
  /** その難易度の累計ALL PERFECT回数 */
  allPerfectCount: number
  /** その難易度の累計FULL COMBO回数 */
  fullComboCount: number
  /** その難易度の最新更新日時 */
  latestUpdatedAt: string | null
  /** その難易度の最高PA SKILL対象曲ランク */
  nicePlayRank: number
  /** pdata由来の譜面レベル */
  chartLevelFromPdata: number
  /** その難易度でALL PERFECT達成履歴があるか */
  isAllPerfect: boolean
  /** その難易度でFULL COMBO達成履歴があるか */
  isFullCombo: boolean
  /** 定数表由来の定数値 定数表に登録されている楽曲のみセットされる */
  constValue?: number
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
 * クリア状況フィルタで判定する条件キー
 */
export type ClearConditionKey = 'ap' | 'fc' | 'clear' | 'play'

/**
 * フィルタの評価方法
 */
export type FilterConditionMode = 'only' | 'exclude'

/**
 * レベル範囲で絞り込む条件
 */
export interface LevelFilterCondition {
  /** 条件種別 */
  type: 'level'
  /** 対象難易度 */
  difficultyKey: DifficultyKey
  /** 許容する最小レベル 未指定時は下限なし */
  minLevel: number | null
  /** 許容する最大レベル 未指定時は上限なし */
  maxLevel: number | null
}

/**
 * クリア状況で絞り込む条件
 */
export interface ClearStatusFilterCondition {
  /** 条件種別 */
  type: 'clearStatus'
  /** 対象難易度 */
  difficultyKey: DifficultyKey
  /** 判定対象 */
  target: ClearConditionKey
  /** 一致のみ or 除外 */
  mode: FilterConditionMode
}

/**
 * 楽曲一覧で利用する絞り込み条件
 */
export type SongFilterCondition = LevelFilterCondition | ClearStatusFilterCondition

/**
 * 楽曲一覧の表示オプション
 */
export interface ScoreDisplayOptions {
  /** プレイ記録がない難易度を非表示にするか */
  hideUnplayedDifficulties: boolean
}

/**
 * データ取得元URLの入力値
 */
export interface DataSourceUrls {
  /** commonデータURL */
  commonUrl: string
  /** pdataデータURL */
  pdataUrl: string
  /** 定数表データURL 空文字の場合は読み込まない */
  constsUrl: string
}

/**
 * 定数表JSONのレスポンス形式
 * キーが定数値文字列、値が [楽曲名, 難易度キー] の配列
 */
export type ConstsData = Record<string, string[][]>

/**
 * SKILLタブで表示する1譜面分のSKILL行データ
 */
export interface SkillChartRow {
  /** 楽曲ID */
  musicId: string
  /** 楽曲名 */
  songName: string
  /** 作曲者名 */
  composer: string
  /** 難易度キー */
  difficultyKey: DifficultyKey
  /** 画面表示用の難易度ラベル */
  difficultyLabel: string
  /** 整数レベル（マスター値） */
  level: number
  /** SKILL計算に使用した定数値（定数表値 or 整数レベル） */
  constValue: number
  /** 定数表に登録されていない（参考値）か否か */
  isEstimatedConst: boolean
  /** 最高達成率（内部値: 100倍） */
  bestAchievementRate: number
  /** 単曲SKILL値 */
  skillValue: number
  /** PA SKILL 対象譜面か（nicePlayRank > 0） */
  isPaSkillTarget: boolean
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
