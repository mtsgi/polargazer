<script setup lang="ts">
import type { DifficultyBest, ScoreSongRow } from '../types/view-model'
import ScorePagination from './ScorePagination.vue'

interface Props {
  /** 一覧表示する楽曲行データ */
  rows: ScoreSongRow[]
  /** 現在ページ */
  currentPage: number
  /** 全件数 */
  totalItems: number
  /** 1ページあたりの表示件数 */
  pageSize: number
  /** 未プレイ難易度を非表示にするか */
  hideUnplayedDifficulties: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectDifficulty: [payload: { row: ScoreSongRow, difficulty: DifficultyBest }]
  'update:currentPage': [value: number]
}>()

/**
 * 子コンポーネントからの難易度選択イベントを親へ中継する
 */
function handleSelectDifficulty(payload: { row: ScoreSongRow, difficulty: DifficultyBest }) {
  emit('selectDifficulty', payload)
}
</script>

<template>
  <section class="song-list">
    <ScorePagination
      :current-page="props.currentPage"
      :total-items="props.totalItems"
      :page-size="props.pageSize"
      @update:current-page="emit('update:currentPage', $event)"
    />

    <p v-if="props.rows.length === 0" class="song-list__empty">
      表示対象の楽曲がありません。
    </p>

    <template v-else>
      <ScoreSongCard
        v-for="row in props.rows"
        :key="row.musicId"
        :row="row"
        :hide-unplayed-difficulties="props.hideUnplayedDifficulties"
        @select-difficulty="handleSelectDifficulty"
      />
    </template>

    <ScorePagination
      class="song-list__pagination--bottom"
      :current-page="props.currentPage"
      :total-items="props.totalItems"
      :page-size="props.pageSize"
      @update:current-page="emit('update:currentPage', $event)"
    />
  </section>
</template>

<style scoped lang="scss">
.song-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.song-list__pagination--bottom {
  margin-top: 4px;
}

.song-list__empty {
  margin: 0;
  border: 1px dashed var(--pg-color-border);
  border-radius: 8px;
  padding: 12px;
  color: var(--pg-color-text-sub);
  background: color-mix(in srgb, var(--pg-color-surface-soft) 35%, white);
}
</style>
