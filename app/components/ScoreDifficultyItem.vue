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
      <div class="difficulty-item__meta">
        <span
          v-if="props.difficulty.isAllPerfect"
          class="difficulty-item__badge"
        >
          AP
        </span>
        <span
          v-else-if="props.difficulty.isFullCombo"
          class="difficulty-item__badge"
        >
          FC
        </span>
        <span class="difficulty-item__level">Lv{{ props.difficulty.level }}</span>
      </div>
    </header>

    <dl class="difficulty-item__stats">
      <div>
        <dt>Score</dt>
        <dd>{{ props.difficulty.bestHighscore || '-' }}</dd>
      </div>
      <div>
        <dt>ACHIEVEMENT RATE</dt>
        <dd>{{ formatAchievementRate(props.difficulty.bestAchievementRate) }}</dd>
      </div>
      <div>
        <dt>CLEAR RANK</dt>
        <dd>{{ props.difficulty.clearRank }}</dd>
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

.difficulty-item__meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.difficulty-item__name {
  font-weight: 600;
}

.difficulty-item__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
}

.difficulty-item__badge {
  display: inline-flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 999px;
  padding: 0 6px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.4;
}

.difficulty-item__stats dt,
.difficulty-item__stats dd {
  margin: 0;
}
</style>
