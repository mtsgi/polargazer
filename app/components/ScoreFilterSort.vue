<script setup lang="ts">
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

interface Props {
  /** 検索キーワード */
  searchWord: string
  /** 現在の並び替え項目 */
  sortField: SortField
  /** 現在の並び順 */
  sortOrder: SortOrder
  /** 現在の表示件数 */
  pageSize: PageSizeOption
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:searchWord': [value: string]
  'update:sortField': [value: SortField]
  'update:sortOrder': [value: SortOrder]
  'update:pageSize': [value: PageSizeOption]
}>()
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

@media (min-width: 720px) {
  .sort-filter {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1100px) {
  .sort-filter {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
