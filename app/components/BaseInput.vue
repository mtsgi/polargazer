<script setup lang="ts">
interface Props {
  /** 入力値 */
  modelValue: string
  /** 入力タイプ */
  type?: string
  /** input要素のid */
  id?: string
  /** placeholder */
  placeholder?: string
  /** 無効化フラグ */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  id: undefined,
  placeholder: undefined,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input
    :id="props.id"
    class="ui-input"
    :value="props.modelValue"
    :type="props.type"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    @input="onInput"
  >
</template>

<style scoped lang="scss">
.ui-input {
  width: 100%;
  min-height: 38px;
  box-sizing: border-box;
  padding: 8px 10px;
  border: 2px solid var(--pg-color-border);
  border-radius: 8px;
  background: var(--pg-color-white);
  color: var(--pg-color-text-main);
  font: inherit;

  &::placeholder {
    color: var(--pg-color-text-sub);
  }

  &:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--pg-difficulty-polar) 55%, white);
    outline-offset: 1px;
  }
}
</style>
