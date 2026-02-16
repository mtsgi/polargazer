<script setup lang="ts">
import type { DifficultyBest } from '../types/view-model'

interface Props {
  /** 表示対象の難易度別自己ベスト */
  difficulty: DifficultyBest
}

const props = defineProps<Props>()

/**
 * 内部値(100倍)の達成率を表示文字列へ変換する
 */
function formatAchievementRate(rate: number): string {
  if (!rate) {
    return '-'
  }
  return (rate / 100).toFixed(2)
}
</script>

<template>
  <article class="difficulty-item">
    <header class="difficulty-item__header">
      <span class="difficulty-item__name">{{ props.difficulty.label.toUpperCase() }}</span>
      <span class="difficulty-item__level">Lv{{ props.difficulty.level }}</span>
    </header>

    <dl class="difficulty-item__stats">
      <div>
        <dt>Score</dt>
        <dd>{{ props.difficulty.bestHighscore || '-' }}</dd>
      </div>
      <div>
        <dt>Rate</dt>
        <dd>{{ formatAchievementRate(props.difficulty.bestAchievementRate) }}</dd>
      </div>
      <div>
        <dt>Play</dt>
        <dd>{{ props.difficulty.totalPlayCount }}</dd>
      </div>
    </dl>
  </article>
</template>

<style scoped lang="scss">
.difficulty-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px;
  min-width: 0;
}

.difficulty-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.difficulty-item__name {
  font-weight: 600;
}

.difficulty-item__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
}

.difficulty-item__stats dt,
.difficulty-item__stats dd {
  margin: 0;
}
</style>
