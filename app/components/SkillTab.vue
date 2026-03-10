<script setup lang="ts">
import type { PDataUserProfile } from '../types/pdata'
import type { ScoreSongRow, SkillChartRow } from '../types/view-model'
import { buildSkillChartList, calculatePaSkillAverage } from '../utils/build-skill-chart-list'
import { calculateSkillGrade } from '../utils/pa-skill-grade'

interface Props {
  /** 楽曲行データ配列 */
  rows: ScoreSongRow[]
  /** ユーザープロフィール（サーバー値PA SKILL表示用） */
  profile: PDataUserProfile | null
}

const props = defineProps<Props>()

/** ページネーション用の現在ページ */
const currentPage = ref(1)
/** 1ページあたりの表示件数 */
const pageSize = ref<'20' | '50' | '100'>('50')
/** PA SKILL対象のみ表示するか */
const filterPaSkillOnly = ref(false)

// 全プレイ済み譜面のSKILL行リスト（降順済み）
const allSkillRows = computed<SkillChartRow[]>(() => buildSkillChartList(props.rows))

// PA SKILLフィルタを適用した行リスト
const filteredSkillRows = computed<SkillChartRow[]>(() => {
  if (!filterPaSkillOnly.value) {
    return allSkillRows.value
  }

  return allSkillRows.value.filter((row) => row.isPaSkillTarget)
})

// 表示件数を数値として解決する
const resolvedPageSize = computed<number>(() => Number(pageSize.value))

// 現在の総ページ数
const totalPages = computed<number>(() => {
  if (filteredSkillRows.value.length === 0) {
    return 1
  }

  return Math.max(1, Math.ceil(filteredSkillRows.value.length / resolvedPageSize.value))
})

// 現在ページに表示する行リスト
const pagedSkillRows = computed<SkillChartRow[]>(() => {
  const start = (currentPage.value - 1) * resolvedPageSize.value
  const end = start + resolvedPageSize.value
  return filteredSkillRows.value.slice(start, end)
})

// PA SKILL対象譜面の上位30件平均（ローカル計算値）
const computedPaSkill = computed<number | null>(() =>
  calculatePaSkillAverage(allSkillRows.value),
)

// ローカル計算SKILL値のグレード
const computedSkillGrade = computed(() => {
  if (computedPaSkill.value === null) return '-'
  return calculateSkillGrade(computedPaSkill.value.toFixed(2))
})

// フィルタ変更時はページ1に戻る
watch([filterPaSkillOnly, pageSize], () => {
  currentPage.value = 1
})

watch(totalPages, (value) => {
  if (currentPage.value > value) {
    currentPage.value = value
  }
})

/**
 * スキルグレードに対応する装飾クラスを返す
 */
function skillGradeClass(grade: string): string {
  if (grade === '-') {
    return 'skill-tab__grade--unknown'
  }

  const base = grade.replace(/\+{1,4}$/, '').toLowerCase()
  return `skill-tab__grade--${base}`
}

/**
 * PA SKILL値を小数点2桁で表示する
 */
function formatSkillValue(value: number | null): string {
  if (value === null) return '-'
  return value.toFixed(2)
}
</script>

<template>
  <section class="skill-tab">
    <h2 class="skill-tab__title">
      SKILL
    </h2>

    <!-- PA SKILL サマリーカード -->
    <div class="skill-tab__summary">
      <div class="skill-tab__summary-item">
        <span class="skill-tab__summary-label">PA SKILL（サーバー値）</span>
        <span class="skill-tab__summary-value">{{ props.profile?.pa_skill ?? '-' }}</span>
      </div>
      <div class="skill-tab__summary-item">
        <span class="skill-tab__summary-label">PA SKILL（ローカル計算）</span>
        <span class="skill-tab__summary-value">{{ formatSkillValue(computedPaSkill) }}</span>
        <span
          v-if="computedSkillGrade !== '-'"
          class="skill-tab__grade"
          :class="skillGradeClass(computedSkillGrade)"
        >
          {{ computedSkillGrade }}
        </span>
      </div>
      <p class="skill-tab__summary-note">
        ※ PA SKILL上位30譜面の単曲SKILL平均値
      </p>
    </div>

    <!-- フィルタ・ページサイズ操作 -->
    <div class="skill-tab__controls">
      <BaseCheckbox v-model="filterPaSkillOnly">
        PA SKILL対象のみ表示
      </BaseCheckbox>
      <div class="skill-tab__page-size">
        <label for="skill-page-size" class="skill-tab__page-size-label">表示件数</label>
        <BaseSelect
          id="skill-page-size"
          v-model="pageSize"
        >
          <option value="20">20件</option>
          <option value="50">50件</option>
          <option value="100">100件</option>
        </BaseSelect>
      </div>
    </div>

    <p class="skill-tab__count">
      表示件数: {{ pagedSkillRows.length }} / {{ filteredSkillRows.length }}
    </p>

    <!-- SKILL行リスト -->
    <ol class="skill-tab__list">
      <li
        v-for="(row, index) in pagedSkillRows"
        :key="`${row.musicId}-${row.difficultyKey}`"
        class="skill-tab__list-item"
      >
        <!-- 全体順位 -->
        <span class="skill-tab__rank">
          {{ (currentPage - 1) * resolvedPageSize + index + 1 }}
        </span>
        <SkillChartItem :row="row" />
      </li>
    </ol>

    <!-- ページネーション -->
    <ScorePagination
      v-model:current-page="currentPage"
      :total-items="filteredSkillRows.length"
      :page-size="resolvedPageSize"
    />
  </section>
</template>

<style scoped lang="scss">
.skill-tab {
  display: grid;
  gap: 12px;
}

.skill-tab__title {
  margin: 0;
}

.skill-tab__summary {
  display: grid;
  gap: 8px;
  border: 3px solid var(--pg-color-border);
  border-radius: 12px;
  padding: 12px;
  background: var(--pg-color-white);
}

.skill-tab__summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.skill-tab__summary-label {
  font-size: 0.85rem;
  color: var(--pg-color-text-sub);
  min-width: 180px;
}

.skill-tab__summary-value {
  font-size: 1.4rem;
  font-weight: 900;
}

.skill-tab__summary-note {
  margin: 0;
  font-size: 0.75rem;
  color: var(--pg-color-text-sub);
}

.skill-tab__grade {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  padding: 2px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--skill-grade-default-fg);
}

.skill-tab__grade--unknown,
.skill-tab__grade--gray {
  background-color: var(--skill-grade-unknown-bg);
  color: var(--skill-grade-unknown-fg);
}

.skill-tab__grade--green {
  background-color: var(--skill-grade-green-bg);
}

.skill-tab__grade--lime {
  background-color: var(--skill-grade-lime-bg);
}

.skill-tab__grade--blue {
  background-color: var(--skill-grade-blue-bg);
}

.skill-tab__grade--cyan {
  background-color: var(--skill-grade-cyan-bg);
}

.skill-tab__grade--lemon {
  background-color: var(--skill-grade-lemon-bg);
}

.skill-tab__grade--orange {
  background-color: var(--skill-grade-orange-bg);
}

.skill-tab__grade--coral {
  background-color: var(--skill-grade-coral-bg);
}

.skill-tab__grade--red {
  background-color: var(--skill-grade-red-bg);
}

.skill-tab__grade--purple {
  background-color: var(--skill-grade-purple-bg);
  color: var(--skill-grade-purple-fg);
}

.skill-tab__grade--navy {
  background-color: var(--skill-grade-navy-bg);
  color: var(--skill-grade-navy-fg);
}

.skill-tab__grade--rainbow {
  color: var(--skill-grade-rainbow-fg);
  background: var(--skill-grade-rainbow-bg);
}

.skill-tab__controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.skill-tab__page-size {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skill-tab__page-size-label {
  font-size: 0.85rem;
  color: var(--pg-color-text-sub);
}

.skill-tab__count {
  margin: 0;
  color: var(--pg-color-text-sub);
}

.skill-tab__list {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.skill-tab__list-item {
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: center;
  gap: 8px;
}

.skill-tab__rank {
  font-size: 0.85rem;
  font-weight: 700;
  text-align: right;
  color: var(--pg-color-text-sub);
  flex-shrink: 0;
}
</style>
