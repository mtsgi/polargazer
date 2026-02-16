<script setup lang="ts">
interface Props {
  /** 選択値 */
  modelValue: string
  /** select要素のid */
  id?: string
  /** 無効化フラグ */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <select
    :id="props.id"
    class="ui-select"
    :value="props.modelValue"
    :disabled="props.disabled"
    @change="onChange"
  >
    <slot />
  </select>
</template>

<style scoped lang="scss">
.ui-select {
  width: 100%;
  min-height: 38px;
  box-sizing: border-box;
  padding: 8px 10px;
  border: 1px solid #c9c9c9;
  border-radius: 8px;
  background: #fff;
  font: inherit;
}
</style>
