/**
 * pdata内の譜面別スコア情報
 */
export interface PDataChart {
  /** 譜面難易度種別（0:easy, 1:normal, 2:hard, 3:influence, 4:polar） */
  chart_difficulty_type: number
  /** 譜面レベル */
  difficult: number
  /** 達成率（100倍値） */
  achievement_rate: number
  /** 自己ベストスコア */
  highscore: number
  /** 最大コンボ */
  maxcombo: number
  /** コンボランク */
  combo_rank: number
  /** スコアランク */
  score_rank: number
  /** クリア状況 */
  clear_status: number
  /** プレイ回数 */
  play_count: number
  /** クリア回数 */
  clear_count: number
  /** パーフェクトクリア回数 */
  perfect_clear_count: number
  /** フルコンボ回数 */
  full_combo_count: number
  /** 更新日時 */
  updated_at: string
  /** ナイスプレイランク */
  nice_play_rank: number
  /** 将来追加される未定義フィールド */
  [key: string]: unknown
}

/**
 * 譜面配列ブロック
 */
export interface PDataChartList {
  /** 譜面 配列または単体オブジェクトで返る場合がある */
  chart: PDataChart | PDataChart[]
  /** 将来追加される未定義フィールド */
  [key: string]: unknown
}

/**
 * pdata内の楽曲単位スコア情報
 */
export interface PDataMusic {
  /** 楽曲ID */
  music_id: string
  /** 楽曲名 */
  name: string
  /** 作曲者名 */
  composer: string
  /** 権利表記 */
  license: string
  /** ジャンルID */
  genre: number
  /** 譜面別スコア情報 */
  chart_list: PDataChartList
  /** 将来追加される未定義フィールド */
  [key: string]: unknown
}

/**
 * ユーザーの楽曲ハイスコア一覧
 */
export interface PDataUserMusicHighscore {
  /** 楽曲スコア配列 */
  music: PDataMusic[]
  /** 将来追加される未定義フィールド */
  [key: string]: unknown
}

/**
 * スコア情報ブロック
 */
export interface PDataScoreData {
  /** 楽曲ハイスコア一覧 */
  usr_music_highscore: PDataUserMusicHighscore
  /** 将来追加される未定義フィールド */
  [key: string]: unknown
}

/**
 * ユーザープロフィール情報
 */
export interface PDataUserProfile {
  /** ユーザー名 */
  usr_name: string
  /** ユーザーランク */
  usr_rank: number
  /** コメント */
  comment: string
  /** チュートリアル完了フラグ */
  is_tutorial_cleared: boolean
  /** 経験値 */
  exp: number
  /** クラス値 */
  pa_class: number
  /** スキル値 */
  pa_skill: string
  /** 将来追加される未定義フィールド */
  [key: string]: unknown
}

/**
 * プレイ関連情報ブロック
 */
export interface PDataPlayData {
  /** 結果コード */
  result: number
  /** ユーザープロフィール */
  usr_profile: PDataUserProfile
  /** クルーID */
  crew_id: string
  /** 将来追加される未定義フィールド */
  [key: string]: unknown
}

/**
 * pdataレスポンスのdata本体
 */
export interface PDataBody {
  /** data内ステータス */
  status: number
  /** エラーコード */
  fail_code: number
  /** スコア情報 */
  score_data: PDataScoreData
  /** プレイ情報 */
  play_data: PDataPlayData
  /** 将来追加される未定義フィールド */
  [key: string]: unknown
}

/**
 * pdata_getdata全体レスポンス
 */
export interface PDataResponse {
  /** ルートステータス */
  status: number
  /** レスポンス本体 */
  data: PDataBody
  /** 将来追加される未定義フィールド */
  [key: string]: unknown
}
