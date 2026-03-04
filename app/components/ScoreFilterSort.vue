<script setup lang="ts">
import type {
  ClearConditionKey,
  ClearStatusFilterCondition,
  DifficultyKey,
  FilterConditionMode,
  LevelFilterCondition,
  SongFilterCondition,
} from '../types/view-model'
import { parseLevelValue } from '../utils/parse-level-value'
import BaseCheckbox from './BaseCheckbox.vue'

/**
 * 一覧の並び替え項目。
 */
export type SortField =
  | 'default'
  | 'name'
  | 'bestScore'
  | 'bestRate'
  | 'playCount'
  | 'easyRate'
  | 'normalRate'
  | 'hardRate'
  | 'influenceRate'
  | 'polarRate'
  | 'easyPlayCount'
  | 'normalPlayCount'
  | 'hardPlayCount'
  | 'influencePlayCount'
  | 'polarPlayCount'
  | 'easyLevel'
  | 'normalLevel'
  | 'hardLevel'
  | 'influenceLevel'
  | 'polarLevel'

/**
 * 一覧の並び順。
 */
export type SortOrder = 'asc' | 'desc'

/**
 * 一覧の表示件数オプション。
 */
export type PageSizeOption = '20' | '50' | '100' | 'all'

type FilterConditionType = SongFilterCondition['type']

interface Props {
  /** 検索キーワード */
  searchWord: string
  /** 現在の並び替え項目 */
  sortField: SortField
  /** 現在の並び順 */
  sortOrder: SortOrder
  /** 現在の表示件数 */
  pageSize: PageSizeOption
  /** 現在の絞り込み条件 */
  filterConditions: SongFilterCondition[]
  /** 未プレイ難易度非表示フラグ */
  hideUnplayedDifficulties: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:searchWord': [value: string]
  'update:sortField': [value: SortField]
  'update:sortOrder': [value: SortOrder]
  'update:pageSize': [value: PageSizeOption]
  'update:filterConditions': [value: SongFilterCondition[]]
  'update:hideUnplayedDifficulties': [value: boolean]
}>()

const DIFFICULTY_OPTIONS: Array<{ value: DifficultyKey, label: string }> = [
  { value: 'easy', label: 'EASY' },
  { value: 'normal', label: 'NORMAL' },
  { value: 'hard', label: 'HARD' },
  { value: 'influence', label: 'INFLUENCE' },
  { value: 'polar', label: 'POLAR' },
]

const CLEAR_TARGET_OPTIONS: Array<{ value: ClearConditionKey, label: string }> = [
  { value: 'ap', label: 'AP' },
  { value: 'fc', label: 'FC' },
  { value: 'clear', label: 'クリア' },
  { value: 'play', label: 'プレイ' },
]

const MODE_OPTIONS: Array<{ value: FilterConditionMode, label: string }> = [
  { value: 'only', label: 'のみ' },
  { value: 'exclude', label: '除外' },
]

function createDefaultLevelCondition(): LevelFilterCondition {
  return {
    type: 'level',
    difficultyKey: 'hard',
    minLevel: null,
    maxLevel: null,
  }
}

function createDefaultClearStatusCondition(): ClearStatusFilterCondition {
  return {
    type: 'clearStatus',
    difficultyKey: 'hard',
    target: 'ap',
    mode: 'only',
  }
}

function addFilterCondition() {
  emit('update:filterConditions', [...props.filterConditions, createDefaultLevelCondition()])
}

function removeFilterCondition(index: number) {
  const next = [...props.filterConditions]
  next.splice(index, 1)
  emit('update:filterConditions', next)
}

function updateFilterConditionType(index: number, value: FilterConditionType) {
  const next = [...props.filterConditions]
  next[index] = value === 'level' ? createDefaultLevelCondition() : createDefaultClearStatusCondition()
  emit('update:filterConditions', next)
}

function updateLevelDifficulty(index: number, value: DifficultyKey) {
  const current = props.filterConditions[index]
  if (!current || current.type !== 'level') {
    return
  }

  const next = [...props.filterConditions]
  next[index] = { ...current, difficultyKey: value }
  emit('update:filterConditions', next)
}

function updateLevelMin(index: number, value: string) {
  const current = props.filterConditions[index]
  if (!current || current.type !== 'level') {
    return
  }

  const next = [...props.filterConditions]
  next[index] = { ...current, minLevel: parseLevelValue(value) }
  emit('update:filterConditions', next)
}

function updateLevelMax(index: number, value: string) {
  const current = props.filterConditions[index]
  if (!current || current.type !== 'level') {
    return
  }

  const next = [...props.filterConditions]
  next[index] = { ...current, maxLevel: parseLevelValue(value) }
  emit('update:filterConditions', next)
}

function updateClearTarget(index: number, value: ClearConditionKey) {
  const current = props.filterConditions[index]
  if (!current || current.type !== 'clearStatus') {
    return
  }

  const next = [...props.filterConditions]
  next[index] = { ...current, target: value }
  emit('update:filterConditions', next)
}

function updateClearDifficulty(index: number, value: DifficultyKey) {
  const current = props.filterConditions[index]
  if (!current || current.type !== 'clearStatus') {
    return
  }

  const next = [...props.filterConditions]
  next[index] = { ...current, difficultyKey: value }
  emit('update:filterConditions', next)
}

function updateClearMode(index: number, value: FilterConditionMode) {
  const current = props.filterConditions[index]
  if (!current || current.type !== 'clearStatus') {
    return
  }

  const next = [...props.filterConditions]
  next[index] = { ...current, mode: value }
  emit('update:filterConditions', next)
}

function getLevelInputValue(value: number | null): string {
  return value === null ? '' : String(value)
}
</script>

<template>
  <section class="sort-filter">
    <div class="sort-filter__field">
      <label for="search-word">Search</label>
      <BaseInput
        id="search-word"
        :model-value="props.searchWord"
        type="text"
        placeholder="曲名 / 作曲者"
        @update:model-value="emit('update:searchWord', $event)"
      />
    </div>

    <div class="sort-filter__field">
      <label for="sort-field">並び替え項目</label>
      <BaseSelect
        id="sort-field"
        :model-value="props.sortField"
        @update:model-value="emit('update:sortField', $event as SortField)"
      >
        <option value="default">デフォルト順</option>
        <option value="name">曲名</option>
        <option value="bestScore">総合ハイスコア</option>
        <option value="bestRate">総合達成率</option>
        <option value="playCount">総合プレイ回数</option>

        <option value="easyRate">EASY 達成率</option>
        <option value="normalRate">NORMAL 達成率</option>
        <option value="hardRate">HARD 達成率</option>
        <option value="influenceRate">INFLUENCE 達成率</option>
        <option value="polarRate">POLAR 達成率</option>

        <option value="easyPlayCount">EASY プレイ回数</option>
        <option value="normalPlayCount">NORMAL プレイ回数</option>
        <option value="hardPlayCount">HARD プレイ回数</option>
        <option value="influencePlayCount">INFLUENCE プレイ回数</option>
        <option value="polarPlayCount">POLAR プレイ回数</option>

        <option value="easyLevel">EASY レベル</option>
        <option value="normalLevel">NORMAL レベル</option>
        <option value="hardLevel">HARD レベル</option>
        <option value="influenceLevel">INFLUENCE レベル</option>
        <option value="polarLevel">POLAR レベル</option>
      </BaseSelect>
    </div>

    <div class="sort-filter__field">
      <label for="sort-order">並び順</label>
      <BaseSelect
        id="sort-order"
        :model-value="props.sortOrder"
        @update:model-value="emit('update:sortOrder', $event as SortOrder)"
      >
        <option value="asc">昇順</option>
        <option value="desc">降順</option>
      </BaseSelect>
    </div>

    <div class="sort-filter__field">
      <label for="page-size">表示件数</label>
      <BaseSelect
        id="page-size"
        :model-value="props.pageSize"
        @update:model-value="emit('update:pageSize', $event as PageSizeOption)"
      >
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="all">全件</option>
      </BaseSelect>
    </div>

    <div class="sort-filter__field sort-filter__field--full">
      <div class="sort-filter__condition-header">
        <label>絞り込み条件（AND）</label>
        <BaseButton type="button" @click="addFilterCondition">
          条件を追加
        </BaseButton>
      </div>

      <p v-if="props.filterConditions.length === 0" class="sort-filter__condition-empty">
        条件は未設定です
      </p>

      <div v-else class="sort-filter__conditions">
        <article
          v-for="(condition, index) in props.filterConditions"
          :key="`condition-${index}`"
          class="sort-filter__condition-row"
        >
          <BaseSelect
            :model-value="condition.type"
            @update:model-value="updateFilterConditionType(index, $event as FilterConditionType)"
          >
            <option value="level">難易度レベル</option>
            <option value="clearStatus">クリア状況</option>
          </BaseSelect>

          <template v-if="condition.type === 'level'">
            <BaseSelect
              :model-value="condition.difficultyKey"
              @update:model-value="updateLevelDifficulty(index, $event as DifficultyKey)"
            >
              <option
                v-for="difficulty in DIFFICULTY_OPTIONS"
                :key="difficulty.value"
                :value="difficulty.value"
              >
                {{ difficulty.label }}
              </option>
            </BaseSelect>

            <div class="sort-filter__condition-inline">
              <BaseInput
                :model-value="getLevelInputValue(condition.minLevel)"
                type="number"
                placeholder="下限"
                @update:model-value="updateLevelMin(index, $event)"
              />

              <BaseInput
                :model-value="getLevelInputValue(condition.maxLevel)"
                type="number"
                placeholder="上限"
                @update:model-value="updateLevelMax(index, $event)"
              />
            </div>
          </template>

          <template v-else>
            <BaseSelect
              :model-value="condition.difficultyKey"
              @update:model-value="updateClearDifficulty(index, $event as DifficultyKey)"
            >
              <option
                v-for="difficulty in DIFFICULTY_OPTIONS"
                :key="difficulty.value"
                :value="difficulty.value"
              >
                {{ difficulty.label }}
              </option>
            </BaseSelect>

            <div class="sort-filter__condition-inline">
              <BaseSelect
                :model-value="condition.target"
                @update:model-value="updateClearTarget(index, $event as ClearConditionKey)"
              >
                <option
                  v-for="target in CLEAR_TARGET_OPTIONS"
                  :key="target.value"
                  :value="target.value"
                >
                  {{ target.label }}
                </option>
              </BaseSelect>

              <BaseSelect
                :model-value="condition.mode"
                @update:model-value="updateClearMode(index, $event as FilterConditionMode)"
              >
                <option
                  v-for="mode in MODE_OPTIONS"
                  :key="mode.value"
                  :value="mode.value"
                >
                  {{ mode.label }}
                </option>
              </BaseSelect>
            </div>
          </template>

          <BaseButton type="button" @click="removeFilterCondition(index)">
            削除
          </BaseButton>
        </article>
      </div>
    </div>

    <div class="sort-filter__field sort-filter__field--full">
      <label class="sort-filter__option-title">表示オプション</label>
      <BaseCheckbox
        id="hide-unplayed-difficulties"
        :model-value="props.hideUnplayedDifficulties"
        @update:model-value="emit('update:hideUnplayedDifficulties', $event)"
      >
        未プレイ難易度を非表示
      </BaseCheckbox>
    </div>
  </section>
</template>

<style scoped lang="scss">
.sort-filter {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  border: 3px solid var(--pg-color-border);
  border-radius: 10px;
  padding: 10px;
  background: color-mix(in srgb, var(--pg-color-surface-soft) 34%, white);
}

.sort-filter__field {
  display: grid;
  gap: 6px;
}

.sort-filter__field label {
  color: var(--pg-color-text-sub);
}

.sort-filter__field--full {
  grid-column: 1 / -1;
}

.sort-filter__condition-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.sort-filter__condition-empty {
  margin: 0;
  font-size: 0.85rem;
  color: var(--pg-color-text-sub);
}

.sort-filter__conditions {
  display: grid;
  gap: 8px;
}

.sort-filter__condition-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
  border: 2px solid var(--pg-color-border);
  border-radius: 8px;
  padding: 8px;
  background: var(--pg-color-white);
}

.sort-filter__condition-inline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.sort-filter__option-title {
  color: var(--pg-color-text-sub);
}

@media (min-width: 720px) {
  .sort-filter {
    grid-template-columns: 1fr 1fr;
  }

  .sort-filter__condition-row {
    grid-template-columns: 1fr 1fr 2fr auto;
    align-items: center;
  }
}

@media (min-width: 1100px) {
  .sort-filter {
    grid-template-columns: repeat(4, 1fr);
  }

  .sort-filter__condition-row {
    grid-template-columns: 1.1fr 1fr 2fr auto;
  }
}
</style>
