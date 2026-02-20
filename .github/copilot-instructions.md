# Polargazer リポジトリ向け Copilot 指示

- 目的: 楽曲データ `common_getdata` / スコアデータ `pdata_getdata` を読み込み、プロフィールと楽曲自己ベストを表示する
- 変更方針: 既存の責務分離（types/composables/utils/components）を維持する
- UI方針: 既存の共通UIコンポーネント（`BaseInput` `BaseSelect` `BaseButton`）を優先利用する
- コメント: ソースコードには必要に応じて日本語コメントを付ける
- 型方針: TypeScript の `interface` や関数に日本語JSDocを付け、文末の句点「。」は付けない
- データ方針: `chart_list.chart` の配列/単体揺れを前提に安全に正規化する
- 表示方針: 難易度レベル `0` は未実装として表示対象から除外する
- 動作方針: 初期表示では自動fetchせず、`Load Data` 押下時のみ読み込む
- 色実装方針: 色は `app/assets/css/main.scss` のCSSカスタムプロパティで管理する
- 色実装方針: コンポーネント内で16進カラーを直接ハードコードせず、既存トークンを参照する
- 品質確認: 変更後は `npm run test -- --run` で unit/nuxt テストを通す
