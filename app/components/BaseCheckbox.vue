<script setup lang="ts">
interface Props {
  /** チェック状態 */
  modelValue: boolean
  /** input要素のid */
  id?: string
  /** 無効化フラグ */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<template>
  <label class="ui-checkbox" :for="props.id">
    <input
      :id="props.id"
      class="ui-checkbox__input"
      type="checkbox"
      :checked="props.modelValue"
      :disabled="props.disabled"
      @change="onChange"
    >
    <span class="ui-checkbox__box" aria-hidden="true" />
    <span class="ui-checkbox__label">
      <slot />
    </span>
  </label>
</template>

<style scoped lang="scss">
.ui-checkbox {
  display: inline-grid;
  grid-template-columns: 18px auto;
  align-items: center;
  gap: 8px;
  color: var(--pg-color-text-main);
  cursor: pointer;
}

.ui-checkbox__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.ui-checkbox__box {
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  border: 2px solid var(--pg-color-border);
  border-radius: 5px;
  background: var(--pg-color-white);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
}

.ui-checkbox__box::after {
  content: '';
  width: 8px;
  height: 4px;
  border-left: 2px solid var(--pg-color-white);
  border-bottom: 2px solid var(--pg-color-white);
  transform: rotate(-45deg) scale(0);
  transition: transform 0.15s ease;
}

.ui-checkbox__input:checked + .ui-checkbox__box {
  background: var(--pg-difficulty-polar);
  border-color: var(--pg-difficulty-polar);
}

.ui-checkbox__input:checked + .ui-checkbox__box::after {
  transform: rotate(-45deg) scale(1);
}

.ui-checkbox__input:focus-visible + .ui-checkbox__box {
  outline: 2px solid color-mix(in srgb, var(--pg-difficulty-polar) 55%, white);
  outline-offset: 1px;
}

.ui-checkbox__input:disabled + .ui-checkbox__box {
  opacity: 0.65;
}

.ui-checkbox__label {
  color: var(--pg-color-text-sub);
}

.ui-checkbox__input:disabled ~ .ui-checkbox__label {
  opacity: 0.65;
}
</style>
