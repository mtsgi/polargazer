<script setup lang="ts">
import type { DifficultyBest } from '../types/view-model'

type DifficultyLevelCircleData = Pick<DifficultyBest, 'key' | 'label' | 'level' | 'constValue'>

interface Props {
  /** 表示対象の難易度データ */
  difficulty: DifficultyLevelCircleData
}

const props = defineProps<Props>()

// 定数値の小数部を ".5" 形式で抽出する。定数表にない譜面（constValue が未定義）は null を返す。
const constDecimal = computed<string | null>(() => {
  const v = props.difficulty.constValue
  if (v === undefined) return null
  return (v % 1).toFixed(1).slice(1)
})
</script>

<template>
  <span
    class="difficulty-level-circle"
    :class="`difficulty-level-circle--${props.difficulty.key}`"
  >
    <span class="difficulty-level-circle__level">
      {{ props.difficulty.level }}
      <span
        v-if="constDecimal"
        class="difficulty-level-circle__const"
      >{{ constDecimal }}</span>
    </span>
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
  gap: 2px;
  border-radius: 999px;
  border: 1px solid var(--pg-color-border);
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--pg-color-white);
  background: var(--difficulty-color, var(--pg-color-surface-soft));
  -webkit-text-stroke: 2px var(--difficulty-color, var(--pg-color-text-main));
  paint-order: stroke fill;
}

.difficulty-level-circle__level {
  display: inline-flex;
  align-items: flex-end;
  line-height: 1;
}

.difficulty-level-circle__const {
  font-size: 0.6rem;
  font-weight: 700;
  vertical-align: middle;
  -webkit-text-stroke: 1px var(--difficulty-color, var(--pg-color-text-main));
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