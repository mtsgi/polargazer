<script setup lang="ts">
import type { ScoreSongRow } from '../types/view-model'

interface Props {
  /** 一覧表示する楽曲行データ */
  rows: ScoreSongRow[]
}

const props = defineProps<Props>()
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
  border: 1px dashed #bfbfbf;
  border-radius: 8px;
  padding: 12px;
}
</style>
