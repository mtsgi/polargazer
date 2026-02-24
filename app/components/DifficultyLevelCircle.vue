<script setup lang="ts">
import type { DifficultyBest } from '../types/view-model'

interface Props {
  /** 表示対象の難易度データ */
  difficulty: DifficultyBest
}

const props = defineProps<Props>()
</script>

<template>
  <span
    class="difficulty-level-circle"
    :class="`difficulty-level-circle--${props.difficulty.key}`"
  >
    {{ props.difficulty.level }}
    <span class="difficulty-level-circle__label">
      {{ props.difficulty.label.toUpperCase() }}
    </span>
  </span>
</template>

<style scoped lang="scss">
.difficulty-level-circle {
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

.difficulty-level-circle__label {
  font-size: 0.5rem;
  font-weight: 900;
  -webkit-text-stroke: 2px var(--difficulty-color, var(--pg-color-text-main));
  paint-order: stroke fill;
}

.difficulty-level-circle--easy {
  --difficulty-color: var(--pg-difficulty-easy);
}

.difficulty-level-circle--normal {
  --difficulty-color: var(--pg-difficulty-normal);
}

.difficulty-level-circle--hard {
  --difficulty-color: var(--pg-difficulty-hard);
}

.difficulty-level-circle--influence {
  --difficulty-color: var(--pg-difficulty-influence);
}

.difficulty-level-circle--polar {
  --difficulty-color: var(--pg-difficulty-polar);
}
</style>