<script setup lang="ts">
import type { DifficultyBest, DifficultyKey, ScoreSongRow, SongFilterCondition } from '../types/view-model'
import type { PageSizeOption, SortField, SortOrder } from './ScoreFilterSort.vue'
import { filterRowsByConditions } from '../utils/filter-score-rows'

type DifficultyMetrics = Record<DifficultyKey, { rate: number, playCount: number }>

interface SelectedDifficultyDetail {
  /** 表示対象の楽曲行 */
  row: ScoreSongRow
  /** 表示対象の難易度データ */
  difficulty: DifficultyBest
}

interface Props {
  /** 表示対象の楽曲行データ配列 */
  rows: ScoreSongRow[]
}

const props = defineProps<Props>()

const DIFFICULTY_KEYS: DifficultyKey[] = ['easy', 'normal', 'hard', 'influence', 'polar']

// 一覧の検索キーワード入力値
const searchWordInput = ref('')
// 検索負荷を下げるため、表示側では少し遅延した値を使う
const debouncedSearchWord = ref('')
// 一覧の並び替え項目
const sortField = ref<SortField>('default')
// 一覧の並び順
const sortOrder = ref<SortOrder>('asc')
// 一覧の表示件数
const pageSize = ref<PageSizeOption>('50')
// 一覧の追加絞り込み条件
const filterConditions = ref<SongFilterCondition[]>([])
// 未プレイ難易度を非表示にするかどうか
const hideUnplayedDifficulties = ref(false)
// 一覧の現在ページ
const currentPage = ref(1)
// 難易度詳細モーダル表示状態
const isDifficultyModalOpen = ref(false)
// 難易度詳細モーダルの表示対象
const selectedDifficultyDetail = ref<SelectedDifficultyDetail | null>(null)

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

watch([debouncedSearchWord, sortField, sortOrder, pageSize, filterConditions], () => {
  currentPage.value = 1
})

// ロード済みデータから検索を適用した配列を作る
const searchedRows = computed<ScoreSongRow[]>(() => {
  const keyword = debouncedSearchWord.value.trim().toLowerCase()

  return keyword
    ? props.rows.filter((row) =>
      row.name.toLowerCase().includes(keyword) || row.composer.toLowerCase().includes(keyword),
    )
    : props.rows
})

// 検索結果に絞り込み条件を適用した配列を作る
const filteredRows = computed<ScoreSongRow[]>(() => {
  return filterRowsByConditions(searchedRows.value, filterConditions.value)
})

// 絞り込み結果に並び替えを適用した配列を作る
const sortedRows = computed<ScoreSongRow[]>(() => {
  const rows = [...filteredRows.value]
  const orderFactor = sortOrder.value === 'asc' ? 1 : -1

  if (rows.length <= 1) {
    return rows
  }

  const metricsCache = buildDifficultyMetricsCache(rows)
  const indexMap = buildRowIndexMap(rows)

  rows.sort((left, right) => {
    const comparison = compareRows(left, right, {
      sortField: sortField.value,
      sortOrder: sortOrder.value,
      metricsCache,
      indexMap,
    })

    if (comparison !== 0) {
      return comparison
    }

    return left.name.localeCompare(right.name) * orderFactor
  })

  return rows
})

// 表示件数設定を数値として解決する
const resolvedPageSize = computed<number>(() => {
  if (pageSize.value === 'all') {
    return Math.max(sortedRows.value.length, 1)
  }

  return Number(pageSize.value)
})

// 現在の総ページ数
const totalPages = computed<number>(() => {
  if (sortedRows.value.length === 0) {
    return 1
  }

  return Math.max(1, Math.ceil(sortedRows.value.length / resolvedPageSize.value))
})

watch(totalPages, (value) => {
  if (currentPage.value > value) {
    currentPage.value = value
  }
})

// 現在ページに表示する配列を作る
const pagedRows = computed<ScoreSongRow[]>(() => {
  if (sortedRows.value.length === 0) {
    return []
  }

  const start = (currentPage.value - 1) * resolvedPageSize.value
  const end = start + resolvedPageSize.value
  return sortedRows.value.slice(start, end)
})

function compareRows(
  left: ScoreSongRow,
  right: ScoreSongRow,
  context: {
    sortField: SortField
    sortOrder: SortOrder
    metricsCache: Map<string, DifficultyMetrics>
    indexMap: Map<string, number>
  },
): number {
  const factor = context.sortOrder === 'asc' ? 1 : -1

  switch (context.sortField) {
    case 'default':
      return ((context.indexMap.get(left.musicId) ?? 0) - (context.indexMap.get(right.musicId) ?? 0)) * factor
    case 'name':
      return left.name.localeCompare(right.name) * factor
    case 'bestScore':
      return (left.bestHighscore - right.bestHighscore) * factor
    case 'bestRate':
      return (left.bestAchievementRate - right.bestAchievementRate) * factor
    case 'playCount':
      return (left.totalPlayCount - right.totalPlayCount) * factor
    case 'easyRate':
      return (getDifficultyRate(context.metricsCache, left, 'easy') - getDifficultyRate(context.metricsCache, right, 'easy')) * factor
    case 'normalRate':
      return (getDifficultyRate(context.metricsCache, left, 'normal') - getDifficultyRate(context.metricsCache, right, 'normal')) * factor
    case 'hardRate':
      return (getDifficultyRate(context.metricsCache, left, 'hard') - getDifficultyRate(context.metricsCache, right, 'hard')) * factor
    case 'influenceRate':
      return (getDifficultyRate(context.metricsCache, left, 'influence') - getDifficultyRate(context.metricsCache, right, 'influence')) * factor
    case 'polarRate':
      return (getDifficultyRate(context.metricsCache, left, 'polar') - getDifficultyRate(context.metricsCache, right, 'polar')) * factor
    case 'easyPlayCount':
      return (getDifficultyPlayCount(context.metricsCache, left, 'easy') - getDifficultyPlayCount(context.metricsCache, right, 'easy')) * factor
    case 'normalPlayCount':
      return (getDifficultyPlayCount(context.metricsCache, left, 'normal') - getDifficultyPlayCount(context.metricsCache, right, 'normal')) * factor
    case 'hardPlayCount':
      return (getDifficultyPlayCount(context.metricsCache, left, 'hard') - getDifficultyPlayCount(context.metricsCache, right, 'hard')) * factor
    case 'influencePlayCount':
      return (getDifficultyPlayCount(context.metricsCache, left, 'influence') - getDifficultyPlayCount(context.metricsCache, right, 'influence')) * factor
    case 'polarPlayCount':
      return (getDifficultyPlayCount(context.metricsCache, left, 'polar') - getDifficultyPlayCount(context.metricsCache, right, 'polar')) * factor
    case 'easyLevel':
      return compareDifficultyLevel(left, right, 'easy', context.sortOrder)
    case 'normalLevel':
      return compareDifficultyLevel(left, right, 'normal', context.sortOrder)
    case 'hardLevel':
      return compareDifficultyLevel(left, right, 'hard', context.sortOrder)
    case 'influenceLevel':
      return compareDifficultyLevel(left, right, 'influence', context.sortOrder)
    case 'polarLevel':
      return compareDifficultyLevel(left, right, 'polar', context.sortOrder)
    default:
      return 0
  }
}

/**
 * 難易度レベルの比較結果を返す
 */
function compareDifficultyLevel(left: ScoreSongRow, right: ScoreSongRow, key: DifficultyKey, order: SortOrder): number {
  const leftLevel = left.levels[key]
  const rightLevel = right.levels[key]

  const leftUnimplemented = leftLevel === 0
  const rightUnimplemented = rightLevel === 0

  if (leftUnimplemented && !rightUnimplemented) {
    return 1
  }

  if (!leftUnimplemented && rightUnimplemented) {
    return -1
  }

  if (leftUnimplemented && rightUnimplemented) {
    return 0
  }

  const factor = order === 'asc' ? 1 : -1
  // 譜面メタに定数値がある譜面はその値で比較し、ない譜面は整数レベル（.0扱い）を使う。
  const leftConst = left.difficultyBests.find(b => b.key === key)?.constValue ?? leftLevel
  const rightConst = right.difficultyBests.find(b => b.key === key)?.constValue ?? rightLevel
  return (leftConst - rightConst) * factor
}

function buildRowIndexMap(rows: ScoreSongRow[]): Map<string, number> {
  const map = new Map<string, number>()

  rows.forEach((row, index) => {
    map.set(row.musicId, index)
  })

  return map
}

/**
 * 難易度詳細モーダルを開く
 */
function handleSelectDifficulty(payload: SelectedDifficultyDetail) {
  selectedDifficultyDetail.value = payload
  isDifficultyModalOpen.value = true
}

/**
 * 難易度詳細モーダルの表示状態変更を処理する
 */
function handleDifficultyModalVisibility(value: boolean) {
  if (!value) {
    closeDifficultyModal()
    return
  }

  isDifficultyModalOpen.value = true
}

/**
 * 難易度詳細モーダルを閉じる
 */
function closeDifficultyModal() {
  isDifficultyModalOpen.value = false
  selectedDifficultyDetail.value = null
}

/**
 * 指定難易度の達成率を取得する
 */
function getDifficultyRate(cache: Map<string, DifficultyMetrics>, row: ScoreSongRow, key: DifficultyKey): number {
  return cache.get(row.musicId)?.[key].rate ?? 0
}

/**
 * 指定難易度のプレイ回数を取得する
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
  <section class="song-list-tab">
    <h2 class="song-list-tab__title">
      Songs
    </h2>

    <ScoreFilterSort
      v-model:search-word="searchWordInput"
      v-model:sort-field="sortField"
      v-model:sort-order="sortOrder"
      v-model:page-size="pageSize"
      v-model:filter-conditions="filterConditions"
      v-model:hide-unplayed-difficulties="hideUnplayedDifficulties"
    />

    <p class="song-list-tab__count">
      表示件数: {{ pagedRows.length }} / {{ sortedRows.length }}
    </p>

    <ScoreSongTable
      v-model:current-page="currentPage"
      :rows="pagedRows"
      :total-items="sortedRows.length"
      :page-size="resolvedPageSize"
      :hide-unplayed-difficulties="hideUnplayedDifficulties"
      @select-difficulty="handleSelectDifficulty"
    />

    <DifficultyDetailModal
      :model-value="isDifficultyModalOpen"
      :detail="selectedDifficultyDetail"
      @update:model-value="handleDifficultyModalVisibility"
    />
  </section>
</template>

<style scoped lang="scss">
.song-list-tab {
  display: grid;
  gap: 12px;
}

.song-list-tab__title {
  margin: 0;
}

.song-list-tab__count {
  margin: 0;
  color: var(--pg-color-text-sub);
}
</style>
