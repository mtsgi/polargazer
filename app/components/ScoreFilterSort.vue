<script setup lang="ts">
/**
 * 一覧の並び替えキー。
 */
export type SortKey =
  | 'nameAsc'
  | 'bestScoreDesc'
  | 'bestRateDesc'
  | 'playCountDesc'
  | 'easyRateDesc'
  | 'normalRateDesc'
  | 'hardRateDesc'
  | 'influenceRateDesc'
  | 'polarRateDesc'
  | 'easyPlayCountDesc'
  | 'normalPlayCountDesc'
  | 'hardPlayCountDesc'
  | 'influencePlayCountDesc'
  | 'polarPlayCountDesc'

interface Props {
  /** 検索キーワード */
  searchWord: string
  /** 現在の並び替えキー */
  sortKey: SortKey
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:searchWord': [value: string]
  'update:sortKey': [value: SortKey]
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
      <label for="sort-key">Sort</label>
      <BaseSelect
        id="sort-key"
        :model-value="props.sortKey"
        @update:model-value="emit('update:sortKey', $event as SortKey)"
      >
        <option value="nameAsc">曲名昇順</option>
        <option value="bestScoreDesc">総合ハイスコア降順</option>
        <option value="bestRateDesc">総合達成率降順</option>
        <option value="playCountDesc">総合プレイ回数降順</option>

        <option value="easyRateDesc">EASY 達成率降順</option>
        <option value="normalRateDesc">NORMAL 達成率降順</option>
        <option value="hardRateDesc">HARD 達成率降順</option>
        <option value="influenceRateDesc">INFLUENCE 達成率降順</option>
        <option value="polarRateDesc">POLAR 達成率降順</option>

        <option value="easyPlayCountDesc">EASY プレイ回数降順</option>
        <option value="normalPlayCountDesc">NORMAL プレイ回数降順</option>
        <option value="hardPlayCountDesc">HARD プレイ回数降順</option>
        <option value="influencePlayCountDesc">INFLUENCE プレイ回数降順</option>
        <option value="polarPlayCountDesc">POLAR プレイ回数降順</option>
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
</style>
