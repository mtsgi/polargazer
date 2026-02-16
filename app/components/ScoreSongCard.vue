<script setup lang="ts">
import type { ScoreSongRow } from '../types/view-model'

interface Props {
  /** 表示対象の楽曲行データ */
  row: ScoreSongRow
}

const props = defineProps<Props>()
</script>

<template>
  <article class="song-card">
    <header class="song-card__header">
      <h3 class="song-card__title">
        {{ props.row.name }}
      </h3>
      <p class="song-card__composer">
        {{ props.row.composer }}
      </p>
      <p class="song-card__summary">
        合計Play: {{ props.row.totalPlayCount }} / 最大Score: {{ props.row.bestHighscore || '-' }}
      </p>
    </header>

    <section class="song-card__difficulties">
      <ScoreDifficultyItem
        v-for="difficulty in props.row.difficultyBests"
        :key="`${props.row.musicId}-${difficulty.key}`"
        :difficulty="difficulty"
      />
    </section>
  </article>
</template>

<style scoped lang="scss">
.song-card {
  border: 1px solid #d6d6d6;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 10px;
}

.song-card__header {
  display: grid;
  gap: 4px;
}

.song-card__title {
  margin: 0;
  font-size: 1rem;
}

.song-card__composer,
.song-card__summary {
  margin: 0;
  font-size: 0.92rem;
}

.song-card__difficulties {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

@media (min-width: 720px) {
  .song-card__difficulties {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1080px) {
  .song-card__difficulties {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
