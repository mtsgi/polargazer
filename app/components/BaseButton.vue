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
  border: 2px solid var(--pg-color-border);
  border-radius: 8px;
  background: color-mix(in srgb, var(--pg-color-accent-soft) 28%, var(--pg-color-white));
  color: var(--pg-color-text-main);
  font: inherit;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:enabled {
    background: var(--pg-color-accent-soft);
  }

  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
}
</style>
