<script setup lang="ts">
import type { DifficultyBest, ScoreSongRow } from '../types/view-model'
import DifficultyAchievementBadge from './DifficultyAchievementBadge.vue'
import DifficultyLevelCircle from './DifficultyLevelCircle.vue'

interface DifficultyDetailModalData {
  /** 表示対象の楽曲行 */
  row: ScoreSongRow
  /** 表示対象の難易度データ */
  difficulty: DifficultyBest
}

interface Props {
  /** モーダル表示状態 */
  modelValue: boolean
  /** 表示対象データ */
  detail: DifficultyDetailModalData | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

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
 * pdataの更新日時文字列をローカル日時表示へ変換する
 */
function formatLocalDateTime(value: string | null): string {
  if (!value) {
    return '-'
  }

  const parsed = new Date(value.replace(' ', 'T'))
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <BaseModal
    :model-value="props.modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <div v-if="props.detail" class="difficulty-detail__header">
        <div class="difficulty-detail__badge-wrap">
          <DifficultyLevelCircle :difficulty="props.detail.difficulty" />
          <DifficultyAchievementBadge
            :difficulty="props.detail.difficulty"
            class="difficulty-detail__badge"
          />
        </div>

        <div class="difficulty-detail__song">
          <h3 class="difficulty-detail__title">
            {{ props.detail.row.name }}
          </h3>
          <p class="difficulty-detail__composer">
            {{ props.detail.row.composer }}
          </p>
        </div>
      </div>
    </template>

    <section v-if="props.detail" class="difficulty-detail">
      <dl class="difficulty-detail__grid">
        <div>
          <dt>クリアランク</dt>
          <dd>{{ props.detail.difficulty.clearRank }}</dd>
        </div>
        <div>
          <dt>達成率（ACHIEVEMENT RATE）</dt>
          <dd>{{ formatAchievementRate(props.detail.difficulty.bestAchievementRate) }}</dd>
        </div>
        <div>
          <dt>ハイスコア</dt>
          <dd>{{ props.detail.difficulty.bestHighscore || '-' }}</dd>
        </div>
        <div>
          <dt>プレイ回数</dt>
          <dd>{{ props.detail.difficulty.totalPlayCount }}</dd>
        </div>
        <div>
          <dt>最大コンボ</dt>
          <dd>{{ props.detail.difficulty.maxCombo }}</dd>
        </div>
        <div>
          <dt>コンボランク</dt>
          <dd>{{ props.detail.difficulty.comboRank }}</dd>
        </div>
        <div>
          <dt>スコアランク</dt>
          <dd>{{ props.detail.difficulty.scoreRank }}</dd>
        </div>
        <div>
          <dt>クリアステータス</dt>
          <dd>{{ props.detail.difficulty.clearStatus }}</dd>
        </div>
        <div>
          <dt>クリア回数</dt>
          <dd>{{ props.detail.difficulty.clearCount }}</dd>
        </div>
        <div>
          <dt>AP回数</dt>
          <dd>{{ props.detail.difficulty.allPerfectCount }}</dd>
        </div>
        <div>
          <dt>FC回数</dt>
          <dd>{{ props.detail.difficulty.fullComboCount }}</dd>
        </div>
        <div>
          <dt>NICE PLAYランク</dt>
          <dd>{{ props.detail.difficulty.nicePlayRank || '対象外' }}</dd>
        </div>
        <div>
          <dt>譜面レベル</dt>
          <dd>{{ props.detail.difficulty.chartLevelFromPdata || '-' }}</dd>
        </div>
        <div>
          <dt>更新日時</dt>
          <dd>{{ formatLocalDateTime(props.detail.difficulty.latestUpdatedAt) }}</dd>
        </div>
      </dl>
    </section>
  </BaseModal>
</template>

<style scoped lang="scss">
.difficulty-detail__header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.difficulty-detail__song {
  min-width: 0;
}

.difficulty-detail__badge-wrap {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
}

.difficulty-detail__badge {
  position: absolute;
  top: -10px;
  left: 0;
}

.difficulty-detail__composer {
  margin: 0;
  color: var(--pg-color-text-sub);
  font-size: 0.85rem;
}

.difficulty-detail__title {
  margin: 2px 0;
  font-size: 1.1rem;
}

.difficulty-detail {
  display: grid;
  gap: 8px;
}

.difficulty-detail__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
}

.difficulty-detail__grid div {
  border: 1px solid var(--pg-color-border);
  border-radius: 8px;
  padding: 8px;
  background: color-mix(in srgb, var(--pg-color-surface-soft) 24%, var(--pg-color-white));
}

.difficulty-detail__grid dt {
  margin: 0;
  font-size: 0.75rem;
  color: var(--pg-color-text-sub);
}

.difficulty-detail__grid dd {
  margin: 2px 0 0;
  font-weight: 900;
}

@media (min-width: 720px) {
  .difficulty-detail__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

</style>
