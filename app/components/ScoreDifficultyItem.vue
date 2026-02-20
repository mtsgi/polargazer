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
  return (rate / 100).toFixed(2) + '%'
}
</script>

<template>
  <article
    class="difficulty-item"
    :class="`difficulty-item--${props.difficulty.key}`"
  >
    <!-- 楽曲レベル -->
    <header class="difficulty-item__header">
      <span class="difficulty-item__level">
        {{ props.difficulty.level }}
        <span class="difficulty-item__difficulty">
          {{ props.difficulty.label.toUpperCase() }}
        </span>
      </span>
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

    <!-- AP/FCバッジ -->
    <span
      v-if="props.difficulty.isAllPerfect"
      class="difficulty-item__badge difficulty-item__badge--ap"
    >
      AP
    </span>
    <span
      v-else-if="props.difficulty.isFullCombo"
      class="difficulty-item__badge difficulty-item__badge--fc"
    >
      FC
    </span>
  </article>
</template>

<style scoped lang="scss">
.difficulty-item {
  position: relative;
  border: 3px solid var(--pg-color-border);
  border-radius: 12px;
  padding: 8px;
  min-width: 0;
  display: flex;
  align-items: center;
}

.difficulty-item__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
}

.difficulty-item__level {
  width: 48px;
  height: 48px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid var(--pg-color-border);
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--pg-color-white);
  background: var(--difficulty-color, var(--pg-color-surface-soft));
  -webkit-text-stroke: 2px var(--difficulty-color, var(--pg-color-text-main));
  paint-order: stroke fill;
}

.difficulty-item__difficulty {
  font-size: 0.5rem;
  font-weight: 900;
  -webkit-text-stroke: 2px var(--difficulty-color, var(--pg-color-text-main));
  paint-order: stroke fill;
}

.difficulty-item__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
}

.difficulty-item__badge {
  position: absolute;
  top: -9px;
  right: 8px;
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--pg-color-border);
  border-radius: 999px;
  padding: 0 6px;
  font-size: 0.75rem;
  font-weight: 900;
  line-height: 1.4;
}

.difficulty-item__badge--ap {
  background: var(--pg-badge-ap);
}

.difficulty-item__badge--fc {
  background: var(--pg-badge-fc);
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

.difficulty-item--easy {
  --difficulty-color: var(--pg-difficulty-easy);
}

.difficulty-item--normal {
  --difficulty-color: var(--pg-difficulty-normal);
}

.difficulty-item--hard {
  --difficulty-color: var(--pg-difficulty-hard);
}

.difficulty-item--influence {
  --difficulty-color: var(--pg-difficulty-influence);
}

.difficulty-item--polar {
  --difficulty-color: var(--pg-difficulty-polar);
}
</style>
