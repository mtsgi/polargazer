<script setup lang="ts">
interface Props {
  /** commonデータ取得URL */
  commonUrl: string
  /** pdataデータ取得URL */
  pdataUrl: string
  /** 読込中フラグ */
  loading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:commonUrl': [value: string]
  'update:pdataUrl': [value: string]
  submit: []
}>()

// フォーム送信時に親へ読込イベントを通知する
function handleSubmit() {
  emit('submit')
}
</script>

<template>
  <form class="source-form" @submit.prevent="handleSubmit">
    <div class="source-form__field">
      <label for="common-url">common URL</label>
      <BaseInput
        id="common-url"
        :model-value="props.commonUrl"
        type="url"
        @update:model-value="emit('update:commonUrl', $event)"
      />
    </div>

    <div class="source-form__field">
      <label for="pdata-url">pdata URL</label>
      <BaseInput
        id="pdata-url"
        :model-value="props.pdataUrl"
        type="url"
        @update:model-value="emit('update:pdataUrl', $event)"
      />
    </div>

    <BaseButton class="source-form__button" type="submit" :disabled="props.loading">
      {{ props.loading ? 'Loading...' : 'Load Data' }}
    </BaseButton>
  </form>
</template>

<style scoped lang="scss">
.source-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.source-form__field {
  display: grid;
  gap: 6px;
}

.source-form__button {
  width: fit-content;
}

@media (min-width: 860px) {
  .source-form {
    grid-template-columns: 1fr 1fr auto;
    align-items: end;
  }
}
</style>
