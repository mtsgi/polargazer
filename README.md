# Polargazer

`common_getdata` / `pdata_getdata` を読み込み、プロフィールと楽曲別自己ベストを表示する Nuxt アプリです。

## 動作環境

- Node: v24.13.1
- npm: v11.8.0
- Nuxt: v4

## セットアップ

```bash
npm install
```

## 開発

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開き、URL入力後に `Load Data` を押すと読込します。

## 主な機能

- `common URL` / `pdata URL` を入力して手動読込
- URLの前回値を `localStorage` に保存
- プロフィール表示
- PA SKILL値から算出したスキルグレード表示
- 楽曲一覧表示
- 難易度別自己ベスト表示
- 検索と並び替え

## テスト

```bash
# 全テスト
npm run test -- --run

# 単体テストのみ
npm run test:unit -- --run

# Nuxtコンポーネントテストのみ
npm run test:nuxt -- --run
```

## 実装構成（抜粋）

- `app/composables/useScoreDataLoader.ts`: データ取得/正規化/結合
- `app/composables/useDataSourceStorage.ts`: URL保存/復元
- `app/utils/*`: fetch, normalize, view-model構築
- `app/components/*`: 画面表示コンポーネント
- `app/types/*`: API/表示用型定義

## データ仕様メモ

- `public/common_getdata.html` / `public/pdata_getdata.html` は開発用のJSON実体
- `pdata.score_data.usr_music_highscore.music[].chart_list.chart` は配列または単体オブジェクトの揺れを吸収して扱う
