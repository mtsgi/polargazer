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
    v-if="props.difficulty.isAllPerfect"
    class="difficulty-achievement-badge difficulty-achievement-badge--ap"
  >
    AP
  </span>
  <span
    v-else-if="props.difficulty.isFullCombo"
    class="difficulty-achievement-badge difficulty-achievement-badge--fc"
  >
    FC
  </span>
</template>

<style scoped lang="scss">
.difficulty-achievement-badge {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--pg-color-border);
  border-radius: 999px;
  padding: 0 6px;
  font-size: 0.75rem;
  font-weight: 900;
  line-height: 1.4;
}

.difficulty-achievement-badge--ap {
  background: var(--pg-badge-ap);
}

.difficulty-achievement-badge--fc {
  background: var(--pg-badge-fc);
}
</style>