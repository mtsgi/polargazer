<script setup lang="ts">
import type { DifficultyBest, ScoreSongRow } from '../types/view-model'

interface Props {
  /** 一覧表示する楽曲行データ */
  rows: ScoreSongRow[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectDifficulty: [payload: { row: ScoreSongRow, difficulty: DifficultyBest }]
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
    <p v-if="props.rows.length === 0" class="song-list__empty">
      表示対象の楽曲がありません。
    </p>

    <template v-else>
      <ScoreSongCard
        v-for="row in props.rows"
        :key="row.musicId"
        :row="row"
        @select-difficulty="handleSelectDifficulty"
      />
    </template>
  </section>
</template>

<style scoped lang="scss">
.song-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
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
