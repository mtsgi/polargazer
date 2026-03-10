<script setup lang="ts">
interface Props {
  /** input要素のid */
  id?: string
  /** 受け付けるファイル拡張子（例: ".json,.html"） */
  accept?: string
  /** 無効化フラグ */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  accept: undefined,
  disabled: false,
})

const emit = defineEmits<{
  /** ファイルが選択されたとき File オブジェクトを emit する */
  change: [file: File]
}>()

function onChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) emit('change', file)
}
</script>

<template>
  <input
    :id="props.id"
    class="ui-file-input"
    type="file"
    :accept="props.accept"
    :disabled="props.disabled"
    @change="onChange"
  >
</template>

<style scoped lang="scss">
.ui-file-input {
  width: 100%;
  min-height: 38px;
  box-sizing: border-box;
  padding: 6px 10px;
  border: 2px solid var(--pg-color-border);
  border-radius: 8px;
  background: var(--pg-color-white);
  color: var(--pg-color-text-main);
  font: inherit;
  cursor: pointer;

  &::file-selector-button {
    background: var(--pg-color-accent-soft);
    border: none;
    border-radius: 6px;
    padding: 4px 10px;
    color: var(--pg-color-text-main);
    cursor: pointer;
    font: inherit;
    font-size: 0.85rem;
    margin-right: 8px;
  }

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--pg-difficulty-polar) 55%, white);
    outline-offset: 1px;
  }
}
</style>
