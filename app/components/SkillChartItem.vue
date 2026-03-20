<script setup lang="ts">
import type { SkillChartRow, DifficultyBest } from '../types/view-model'
import DifficultyLevelCircle from './DifficultyLevelCircle.vue'

interface Props {
  /** 表示対象のSKILL行データ */
  row: SkillChartRow
}

const props = defineProps<Props>()

// DifficultyLevelCircle に渡すための最小構成の DifficultyBest を生成する
const difficultyForCircle = computed<Pick<DifficultyBest, 'key' | 'label' | 'level' | 'constValue'>>(() => ({
  key: props.row.difficultyKey,
  label: props.row.difficultyLabel,
  level: props.row.level,
  // 参考値（整数レベル扱い）のときは constValue を渡さない（小数部を非表示にする）
  constValue: props.row.isEstimatedConst ? undefined : props.row.constValue,
}))

/**
 * 内部値(100倍)の達成率を表示文字列へ変換する
 */
function formatAchievementRate(rate: number): string {
  if (!rate) {
    return '-'
  }

  return `${(rate / 100).toFixed(2)}%`
}

/**
 * SKILL値を小数点4桁で表示する
 */
function formatSkillValue(value: number): string {
  return value.toFixed(4)
}
</script>

<template>
  <div class="skill-chart-item">
    <!-- 難易度サークル -->
    <div class="skill-chart-item__circle">
      <DifficultyLevelCircle :difficulty="difficultyForCircle" />
    </div>

    <!-- 楽曲情報 -->
    <div class="skill-chart-item__song">
      <p class="skill-chart-item__name">
        {{ props.row.songName }}
      </p>
      <p class="skill-chart-item__composer">
        {{ props.row.composer }}
      </p>
    </div>

    <!-- 達成率 -->
    <div class="skill-chart-item__stat">
      <span class="skill-chart-item__stat-label">AR</span>
      <span class="skill-chart-item__stat-value">{{ formatAchievementRate(props.row.bestAchievementRate) }}</span>
    </div>

    <!-- 単曲SKILL値 -->
    <div class="skill-chart-item__skill">
      <span class="skill-chart-item__skill-value">{{ formatSkillValue(props.row.skillValue) }}</span>
        <!-- 譜面メタにない場合は参考値バッジを表示 -->
      <span v-if="props.row.isEstimatedConst" class="skill-chart-item__estimated-badge">
        参考値
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skill-chart-item {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid var(--pg-color-border);
  border-radius: 10px;
  background: var(--pg-color-white);
}

.skill-chart-item__circle {
  flex-shrink: 0;
}

.skill-chart-item__song {
  min-width: 0;
}

.skill-chart-item__name {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.skill-chart-item__composer {
  margin: 0;
  font-size: 0.75rem;
  color: var(--pg-color-text-sub);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.skill-chart-item__stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.skill-chart-item__stat-label {
  font-size: 0.65rem;
  color: var(--pg-color-text-sub);
}

.skill-chart-item__stat-value {
  font-size: 0.85rem;
  font-weight: 700;
}

.skill-chart-item__skill {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  min-width: 64px;
}

.skill-chart-item__skill-value {
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--pg-color-text-main);
}

.skill-chart-item__estimated-badge {
  font-size: 0.62rem;
  color: var(--pg-color-text-sub);
  border: 1px solid var(--pg-color-border);
  border-radius: 999px;
  padding: 1px 6px;
  background: color-mix(in srgb, var(--pg-color-surface-soft) 30%, var(--pg-color-white));
}
</style>
