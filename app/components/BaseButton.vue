<script setup lang="ts">
interface Props {
  /** buttonタイプ */
  type?: 'button' | 'submit' | 'reset'
  /** 無効化フラグ */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false,
})
</script>

<template>
  <button
    class="ui-button"
    :type="props.type"
    :disabled="props.disabled"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.ui-button {
  min-height: 38px;
  padding: 8px 14px;
  border: 1px solid #9a9a9a;
  border-radius: 8px;
  background: #fff;
  font: inherit;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
}
</style>
