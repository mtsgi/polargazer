<script setup lang="ts">
import type { ScoreSongRow } from './types/view-model'
import type { SortKey } from './components/ScoreFilterSort.vue'
import { loadDataSourceUrls, saveDataSourceUrls } from './composables/useDataSourceStorage'
import { useScoreDataLoader } from './composables/useScoreDataLoader'

type DifficultyKey = 'easy' | 'normal' | 'hard' | 'influence' | 'polar'
type DifficultyMetrics = Record<DifficultyKey, { rate: number, playCount: number }>

const DIFFICULTY_KEYS: DifficultyKey[] = ['easy', 'normal', 'hard', 'influence', 'polar']

// 入力URLは前回値を復元する。
const sourceUrls = ref(loadDataSourceUrls())
// 一覧の検索キーワード入力値。
const searchWordInput = ref('')
// 検索負荷を下げるため、表示側では少し遅延した値を使う。
const debouncedSearchWord = ref('')
// 一覧の並び替えキー。
const sortKey = ref<SortKey>('nameAsc')
// 初回ロード実行前かどうかを判定する。
const hasRequestedLoad = ref(false)

const {
  isLoading,
  errorMessage,
  loadedData,
  load,
} = useScoreDataLoader()

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

watch(searchWordInput, (value) => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }

  searchDebounceTimer = setTimeout(() => {
    debouncedSearchWord.value = value
  }, 120)
}, { immediate: true })

onUnmounted(() => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }
})

// ロード済みデータから、検索・並び替えを適用した表示用配列を作る。
const filteredRows = computed<ScoreSongRow[]>(() => {
  const baseRows = loadedData.value?.rows ?? []
  const keyword = debouncedSearchWord.value.trim().toLowerCase()

  const searched = keyword
    ? baseRows.filter((row) =>
      row.name.toLowerCase().includes(keyword) || row.composer.toLowerCase().includes(keyword),
    )
    : baseRows

  const rows = [...searched]
  const metricsCache = buildDifficultyMetricsCache(rows)

  switch (sortKey.value) {
    case 'bestScoreDesc':
      rows.sort((left, right) => right.bestHighscore - left.bestHighscore)
      break
    case 'bestRateDesc':
      rows.sort((left, right) => right.bestAchievementRate - left.bestAchievementRate)
      break
    case 'playCountDesc':
      rows.sort((left, right) => right.totalPlayCount - left.totalPlayCount)
      break
    case 'easyRateDesc':
      rows.sort((left, right) => getDifficultyRate(metricsCache, right, 'easy') - getDifficultyRate(metricsCache, left, 'easy'))
      break
    case 'normalRateDesc':
      rows.sort((left, right) => getDifficultyRate(metricsCache, right, 'normal') - getDifficultyRate(metricsCache, left, 'normal'))
      break
    case 'hardRateDesc':
      rows.sort((left, right) => getDifficultyRate(metricsCache, right, 'hard') - getDifficultyRate(metricsCache, left, 'hard'))
      break
    case 'influenceRateDesc':
      rows.sort((left, right) => getDifficultyRate(metricsCache, right, 'influence') - getDifficultyRate(metricsCache, left, 'influence'))
      break
    case 'polarRateDesc':
      rows.sort((left, right) => getDifficultyRate(metricsCache, right, 'polar') - getDifficultyRate(metricsCache, left, 'polar'))
      break
    case 'easyPlayCountDesc':
      rows.sort((left, right) => getDifficultyPlayCount(metricsCache, right, 'easy') - getDifficultyPlayCount(metricsCache, left, 'easy'))
      break
    case 'normalPlayCountDesc':
      rows.sort((left, right) => getDifficultyPlayCount(metricsCache, right, 'normal') - getDifficultyPlayCount(metricsCache, left, 'normal'))
      break
    case 'hardPlayCountDesc':
      rows.sort((left, right) => getDifficultyPlayCount(metricsCache, right, 'hard') - getDifficultyPlayCount(metricsCache, left, 'hard'))
      break
    case 'influencePlayCountDesc':
      rows.sort((left, right) => getDifficultyPlayCount(metricsCache, right, 'influence') - getDifficultyPlayCount(metricsCache, left, 'influence'))
      break
    case 'polarPlayCountDesc':
      rows.sort((left, right) => getDifficultyPlayCount(metricsCache, right, 'polar') - getDifficultyPlayCount(metricsCache, left, 'polar'))
      break
    default:
      rows.sort((left, right) => left.name.localeCompare(right.name))
      break
  }

  return rows
})

// フォーム入力URLでcommon/pdataを読み込む。
async function loadScoreData() {
  hasRequestedLoad.value = true
  saveDataSourceUrls(sourceUrls.value)
  await load(sourceUrls.value)
}

/**
 * 指定難易度の達成率を取得する。
 */
function getDifficultyRate(cache: Map<string, DifficultyMetrics>, row: ScoreSongRow, key: DifficultyKey): number {
  return cache.get(row.musicId)?.[key].rate ?? 0
}

/**
 * 指定難易度のプレイ回数を取得する。
 */
function getDifficultyPlayCount(cache: Map<string, DifficultyMetrics>, row: ScoreSongRow, key: DifficultyKey): number {
  return cache.get(row.musicId)?.[key].playCount ?? 0
}

function buildDifficultyMetricsCache(rows: ScoreSongRow[]): Map<string, DifficultyMetrics> {
  const cache = new Map<string, DifficultyMetrics>()

  for (const row of rows) {
    const initial: DifficultyMetrics = {
      easy: { rate: 0, playCount: 0 },
      normal: { rate: 0, playCount: 0 },
      hard: { rate: 0, playCount: 0 },
      influence: { rate: 0, playCount: 0 },
      polar: { rate: 0, playCount: 0 },
    }

    for (const key of DIFFICULTY_KEYS) {
      const difficulty = row.difficultyBests.find((item) => item.key === key)
      if (!difficulty) {
        continue
      }

      initial[key] = {
        rate: difficulty.bestAchievementRate,
        playCount: difficulty.totalPlayCount,
      }
    }

    cache.set(row.musicId, initial)
  }

  return cache
}
</script>

<template>
  <main class="app">
    <NuxtRouteAnnouncer />

    <h1 class="app__title">
      Polargazer
    </h1>

    <section class="app__panel">
      <DataSourceForm
        v-model:common-url="sourceUrls.commonUrl"
        v-model:pdata-url="sourceUrls.pdataUrl"
        :loading="isLoading"
        @submit="loadScoreData"
      />
    </section>

    <p v-if="!hasRequestedLoad" class="app__notice">
      未読み込みです。URLを確認して「Load Data」を押してください。
    </p>

    <p v-if="hasRequestedLoad && errorMessage" class="app__error">
      {{ errorMessage }}
    </p>

    <UserProfileCard
      v-if="hasRequestedLoad && loadedData?.profile"
      :profile="loadedData.profile"
    />

    <section v-if="hasRequestedLoad && loadedData" class="app__songs">
      <h2 class="app__section-title">
        Songs
      </h2>

      <ScoreFilterSort
        v-model:search-word="searchWordInput"
        v-model:sort-key="sortKey"
      />

      <p class="app__count">
        表示件数: {{ filteredRows.length }}
      </p>

      <ScoreSongTable :rows="filteredRows" />
    </section>
  </main>
</template>

<style scoped lang="scss">
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px;
  display: grid;
  gap: 12px;
}

.app__title,
.app__section-title {
  margin: 0;
}

.app__panel,
.app__songs {
  border: 1px solid #d6d6d6;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 12px;
}

.app__notice,
.app__error,
.app__count {
  margin: 0;
}

.app__error {
  border: 1px solid #d6d6d6;
  border-radius: 8px;
  padding: 8px;
}

@media (min-width: 900px) {
  .app {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }

  .app__title,
  .app__notice,
  .app__error,
  .app__songs {
    grid-column: 1 / -1;
  }
}
</style>
