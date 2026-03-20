# Polargazer

`common_getdata` / `pdata_getdata` / `meta.json` を読み込み、プロフィールと楽曲別自己ベストを表示する Nuxt アプリです。

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

- `common URL` / `pdata URL` / `meta URL` を入力して手動読込
- URLの前回値を `localStorage` に保存
- プロフィール表示
- PA SKILL値から算出したスキルグレード表示
- 楽曲一覧表示（楽曲リストタブ）
- 難易度別自己ベスト表示
- 譜面メタデータ読み込み（任意）
- 譜面メタデータにタスクディレクターが登録されている場合、難易度詳細モーダルに表示
- 検索と並び替え
- SKILL計算・ランキング表示（SKILLタブ）

## SKILL計算機能

楽曲リストタブとSKILLタブの2タブ構成になっています。

### SKILL計算式

達成率(AR)と難易度定数から単曲SKILLを計算します。

| AR(内部値) | スコアボーナス |
|---|---|
| 10000（100%） | +2.3 |
| 9950〜9999 | 2.0 + (ar/100 - 99.5) × 0.6 |
| 9800〜9949 | 0.5 + (ar/100 - 98) × 1.0 |
| 9500〜9799 | (ar/100 - 95) / 6 |
| 8500〜9499 | -1 + (ar/100 - 85) × 0.1 |
| 8000〜8499 | -(定数+3)/4 + (ar/100 - 80) × (定数-1)/20 |
| 5000〜7999 | -定数 + (ar/100 - 50) × (定数-1)/40 |
| 5000未満 | -定数 |

単曲SKILL = 譜面定数 + スコアボーナス

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
- `app/utils/calculate-chart-skill.ts`: 単曲SKILL値の計算ロジック
- `app/utils/build-skill-chart-list.ts`: SkillChartRow[] の構築・PA SKILL平均算出
- `app/utils/*`: fetch, normalize, view-model構築
- `app/components/SongListTab.vue`: 楽曲リストタブ（検索・フィルタ・ページング）
- `app/components/SkillTab.vue`: SKILLタブ（ランキング・PA SKILL集計）
- `app/components/SkillChartItem.vue`: 単曲SKILL表示コンポーネント
- `app/components/*`: 画面表示コンポーネント
- `app/types/*`: API/表示用型定義

## データ仕様メモ

- `public/common_getdata.html` / `public/pdata_getdata.html` は開発用のJSON
- `public/meta.json` は開発用の譜面メタデータJSON
	- top-levelに `charts` を持ち、`charts > 曲名 > 難易度キー > 譜面メタデータ` の構造
	- 例: `{ "charts": { "神威": { "influence": { "constValue": 13.9 } } } }`
	- 値は譜面メタデータオブジェクト（`constValue` / `taskDirector` など、すべて任意）
- `pdata.score_data.usr_music_highscore.music[].chart_list.chart` は配列または単体オブジェクトの揺れを吸収して扱う
