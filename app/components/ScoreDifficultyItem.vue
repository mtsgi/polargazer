<script setup lang="ts">
import type { DifficultyBest } from '../types/view-model'
import DifficultyAchievementBadge from './DifficultyAchievementBadge.vue'
import DifficultyLevelCircle from './DifficultyLevelCircle.vue'

interface Props {
  /** 表示対象の難易度別自己ベスト */
  difficulty: DifficultyBest
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [difficulty: DifficultyBest]
}>()

/**
 * 内部値(100倍)の達成率を表示文字列へ変換する
 */
function formatAchievementRate(rate: number): string {
  if (!rate) {
    return '-'
  }
  return (rate / 100).toFixed(2) + '%'
}
</script>

<template>
  <button
    class="difficulty-item"
    type="button"
    :class="`difficulty-item--${props.difficulty.key}`"
    @click="emit('select', props.difficulty)"
  >
    <!-- 楽曲レベル -->
    <header class="difficulty-item__header">
      <div class="difficulty-item__badge-wrap">
        <DifficultyLevelCircle :difficulty="props.difficulty" />
        <DifficultyAchievementBadge
          :difficulty="props.difficulty"
          class="difficulty-item__badge"
        />
      </div>
    </header>

    <!-- 自己ベストスコア -->
    <dl class="difficulty-item__stats">
      <div>
        <dt>CLEAR RANK</dt>
        <dd>{{ props.difficulty.clearRank }}</dd>
      </div>
      <div>
        <dt>ACHIEVEMENT RATE</dt>
        <dd>{{ formatAchievementRate(props.difficulty.bestAchievementRate) }}</dd>
      </div>
    </dl>
  </button>
</template>

<style scoped lang="scss">
.difficulty-item {
  width: 100%;
  appearance: none;
  cursor: pointer;
  text-align: left;
  position: relative;
  border: 3px solid var(--pg-color-border);
  border-radius: 12px;
  padding: 8px;
  min-width: 0;
  display: flex;
  align-items: center;
  background: var(--pg-color-white);
  color: inherit;
  font: inherit;
}

.difficulty-item:hover {
  background: color-mix(in srgb, var(--pg-color-accent-soft) 12%, var(--pg-color-white));
}

.difficulty-item__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
}

.difficulty-item__badge-wrap {
  display: inline-flex;
}

.difficulty-item__badge {
  position: absolute;
  top: -9px;
  right: 8px;
}

.difficulty-item__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
}

.difficulty-item__stats dt {
  margin: 0;
  font-size: 0.75rem;
  color: var(--pg-color-text-sub);
}

.difficulty-item__stats dd {
  font-weight: 900;
  margin: 0;
}

</style>
