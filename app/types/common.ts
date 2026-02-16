/**
 * common_getdataの楽曲1件分
 */
export interface CommonMusic {
  /** 楽曲を一意に識別するID */
  music_id: string
  /** 楽曲ジャンルID */
  genre: number
  /** 楽曲名 */
  name: string
  /** 作曲者名 */
  composer: string
  /** 権利表記 */
  license: string
  /** EASYの難易度レベル 0は未実装 */
  easy: number
  /** NORMALの難易度レベル 0は未実装 */
  normal: number
  /** HARDの難易度レベル 0は未実装 */
  hard: number
  /** INFLUENCEの難易度レベル 0は未実装 */
  influence: number
  /** POLARの難易度レベル 0は未実装 */
  polar: number
  /** 将来追加される未定義フィールド */
  [key: string]: unknown
}

/**
 * commonデータ内のmusiclistブロック
 */
export interface CommonMusicList {
  /** 楽曲配列 */
  music: CommonMusic[]
  /** 将来追加される未定義フィールド */
  [key: string]: unknown
}

/**
 * commonレスポンスのdata本体
 */
export interface CommonDataBody {
  /** data内のステータス */
  status: number
  /** エラーコード */
  fail_code: number
  /** 楽曲マスター本体 */
  musiclist: CommonMusicList
  /** 将来追加される未定義フィールド */
  [key: string]: unknown
}

/**
 * common_getdata全体レスポンス
 */
export interface CommonResponse {
  /** ルートのステータス */
  status: number
  /** レスポンス本体 */
  data: CommonDataBody
  /** 将来追加される未定義フィールド */
  [key: string]: unknown
}
