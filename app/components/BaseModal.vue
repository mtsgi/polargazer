<script setup lang="ts">
interface Props {
  /** モーダル表示状態 */
  modelValue: boolean
  /** aria-labelledby に指定するタイトル要素のID */
  titleId?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

/** モーダルパネルへの参照 */
const panelRef = ref<HTMLElement | null>(null)

/**
 * モーダルを閉じる
 */
function closeModal() {
  emit('update:modelValue', false)
}

/**
 * キーボード操作を処理する（ESCで閉じる、Tabでフォーカストラップ）
 */
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeModal()
    return
  }
  if (event.key === 'Tab') {
    const panel = panelRef.value
    if (!panel) return
    const focusable = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey) {
      if (document.activeElement === first) {
        last.focus()
        event.preventDefault()
      }
    }
    else {
      if (document.activeElement === last) {
        first.focus()
        event.preventDefault()
      }
    }
  }
}

// モーダルが開いたらパネルにフォーカスを移動する
watch(() => props.modelValue, async (newVal) => {
  if (newVal) {
    await nextTick()
    panelRef.value?.focus()
  }
})
</script>

<template>
  <div
    v-if="props.modelValue"
    class="ui-modal"
    @click.self="closeModal"
  >
    <div class="ui-modal__outside-close">
      <BaseButton type="button" @click="closeModal">
        閉じる
      </BaseButton>
    </div>

    <section
      ref="panelRef"
      class="ui-modal__panel"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      :aria-labelledby="props.titleId"
      @keydown="handleKeydown"
    >
      <header class="ui-modal__header">
        <slot name="header" />
      </header>

      <div class="ui-modal__body">
        <slot />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.ui-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 12px;
  background: color-mix(in srgb, var(--pg-color-text-main) 35%, transparent);
}

.ui-modal__outside-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
}

.ui-modal__panel {
  width: min(920px, 100%);
  max-height: 90dvh;
  overflow: auto;
  border: 3px solid var(--pg-color-border);
  border-radius: 12px;
  background: var(--pg-color-white);
  color: var(--pg-color-text-main);
}

.ui-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border-bottom: 2px solid var(--pg-color-border);
}

.ui-modal__body {
  padding: 12px;
}
</style>
