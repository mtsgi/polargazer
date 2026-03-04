<script setup lang="ts">
interface Props {
  /** 現在ページ */
  currentPage: number
  /** 全件数 */
  totalItems: number
  /** 1ページあたりの表示件数 */
  pageSize: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:currentPage': [value: number]
}>()

const totalPages = computed(() => {
  if (props.totalItems === 0) {
    return 1
  }

  return Math.max(1, Math.ceil(props.totalItems / props.pageSize))
})

const startItemIndex = computed(() => {
  if (props.totalItems === 0) {
    return 0
  }

  return (props.currentPage - 1) * props.pageSize + 1
})

const endItemIndex = computed(() => {
  if (props.totalItems === 0) {
    return 0
  }

  return Math.min(props.currentPage * props.pageSize, props.totalItems)
})

const canMovePrev = computed(() => props.currentPage > 1)
const canMoveNext = computed(() => props.currentPage < totalPages.value)

/**
 * 前のページへ移動する
 */
function movePrevPage() {
  if (!canMovePrev.value) {
    return
  }

  emit('update:currentPage', props.currentPage - 1)
}

/**
 * 次のページへ移動する
 */
function moveNextPage() {
  if (!canMoveNext.value) {
    return
  }

  emit('update:currentPage', props.currentPage + 1)
}
</script>

<template>
  <div v-if="props.totalItems > 0" class="score-pagination">
    <p class="score-pagination__summary">
      <span class="score-pagination__summary-label">表示範囲</span>
      <span class="score-pagination__summary-value">{{ startItemIndex }} - {{ endItemIndex }} / {{ props.totalItems }}</span>
    </p>

    <div v-if="totalPages > 1" class="score-pagination__actions">
      <BaseButton class="song-list__page-prev score-pagination__prev" :disabled="!canMovePrev" @click="movePrevPage">
        前へ
      </BaseButton>
      <p class="score-pagination__position">
        ページ {{ props.currentPage }} / {{ totalPages }}
      </p>
      <BaseButton class="song-list__page-next score-pagination__next" :disabled="!canMoveNext" @click="moveNextPage">
        次へ
      </BaseButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.score-pagination {
  display: grid;
  gap: 8px;
  border: 1px solid var(--pg-color-border);
  border-radius: 8px;
  padding: 10px;
  background: color-mix(in srgb, var(--pg-color-surface-soft) 24%, white);
}

.score-pagination__summary,
.score-pagination__position {
  margin: 0;
  color: var(--pg-color-text-sub);
}

.score-pagination__summary {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.score-pagination__summary-label {
  font-size: 0.86rem;
}

.score-pagination__summary-value {
  color: var(--pg-color-text-main);
  font-weight: 700;
}

.score-pagination__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-pagination__position {
  min-width: 110px;
  text-align: center;
  border: 1px solid var(--pg-color-border);
  border-radius: 999px;
  padding: 6px 10px;
  background: var(--pg-color-white);
}

.score-pagination__prev,
.score-pagination__next {
  min-width: 78px;
}

@media (min-width: 720px) {
  .score-pagination {
    grid-template-columns: 1fr auto;
    align-items: center;
  }
}
</style>
