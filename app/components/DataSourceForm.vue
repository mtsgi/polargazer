<script setup lang="ts">
interface Props {
  /** commonデータ取得URL */
  commonUrl: string
  /** pdataデータ取得URL */
  pdataUrl: string
  /** 譜面メタデータ取得URL */
  metaUrl: string
  /** 読込中フラグ */
  loading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:commonUrl': [value: string]
  'update:pdataUrl': [value: string]
  'update:metaUrl': [value: string]
  submit: []
}>()

// フィールドごとのファイルモードフラグ（false = URLモード）
const commonUseFile = ref(false)
const pdataUseFile = ref(false)
const metaUseFile = ref(false)

// URLモード時の内部URL値（props の初期値で初期化し、入力のたびに更新する）
const internalCommonUrl = ref(props.commonUrl)
const internalPdataUrl = ref(props.pdataUrl)
const internalMetaUrl = ref(props.metaUrl)

/**
 * URLモードへ切り替えたとき、内部URL値を親へ再 emit して復元する
 */
function switchToUrl(field: 'common' | 'pdata' | 'meta') {
  if (field === 'common') {
    emit('update:commonUrl', internalCommonUrl.value)
  }
  else if (field === 'pdata') {
    emit('update:pdataUrl', internalPdataUrl.value)
  }
  else {
    emit('update:metaUrl', internalMetaUrl.value)
  }
}

/**
 * ファイルが選択されたとき blob URL を生成して親へ emit する
 */
function onFileSelected(file: File, field: 'common' | 'pdata' | 'meta') {
  const blobUrl = URL.createObjectURL(file)
  if (field === 'common') emit('update:commonUrl', blobUrl)
  else if (field === 'pdata') emit('update:pdataUrl', blobUrl)
  else emit('update:metaUrl', blobUrl)
}

// フォーム送信時に親へ読込イベントを通知する
function handleSubmit() {
  emit('submit')
}
</script>

<template>
  <form class="source-form" @submit.prevent="handleSubmit">
    <div class="source-form__field">
      <div class="source-form__label-row">
        <label :for="commonUseFile ? 'common-file' : 'common-url'">common</label>
        <BaseCheckbox
          v-model="commonUseFile"
          @update:model-value="(v) => !v && switchToUrl('common')"
        >
          ファイルを選択
        </BaseCheckbox>
      </div>
      <BaseInput
        v-if="!commonUseFile"
        id="common-url"
        :model-value="internalCommonUrl"
        type="url"
        @update:model-value="(v) => { internalCommonUrl = v; emit('update:commonUrl', v) }"
      />
      <BaseFileInput
        v-else
        id="common-file"
        accept=".json,.html"
        @change="onFileSelected($event, 'common')"
      />
    </div>

    <div class="source-form__field">
      <div class="source-form__label-row">
        <label :for="pdataUseFile ? 'pdata-file' : 'pdata-url'">pdata</label>
        <BaseCheckbox
          v-model="pdataUseFile"
          @update:model-value="(v) => !v && switchToUrl('pdata')"
        >
          ファイルを選択
        </BaseCheckbox>
      </div>
      <BaseInput
        v-if="!pdataUseFile"
        id="pdata-url"
        :model-value="internalPdataUrl"
        type="url"
        @update:model-value="(v) => { internalPdataUrl = v; emit('update:pdataUrl', v) }"
      />
      <BaseFileInput
        v-else
        id="pdata-file"
        accept=".json,.html"
        @change="onFileSelected($event, 'pdata')"
      />
    </div>

    <div class="source-form__field">
      <div class="source-form__label-row">
        <label :for="metaUseFile ? 'meta-file' : 'meta-url'">meta</label>
        <BaseCheckbox
          v-model="metaUseFile"
          @update:model-value="(v) => !v && switchToUrl('meta')"
        >
          ファイルを選択
        </BaseCheckbox>
      </div>
      <BaseInput
        v-if="!metaUseFile"
        id="meta-url"
        :model-value="internalMetaUrl"
        type="url"
        @update:model-value="(v) => { internalMetaUrl = v; emit('update:metaUrl', v) }"
      />
      <BaseFileInput
        v-else
        id="meta-file"
        accept=".json,.html"
        @change="onFileSelected($event, 'meta')"
      />
    </div>

    <BaseButton class="source-form__button" type="submit" :disabled="props.loading">
      {{ props.loading ? 'Loading...' : 'Load Data' }}
    </BaseButton>
  </form>
</template>

<style scoped lang="scss">
.source-form {
  border: 3px solid var(--pg-color-border);
  border-radius: 12px;
  padding: 12px;
  background: var(--pg-color-white);
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.source-form__field {
  display: grid;
  gap: 6px;
}

.source-form__label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--pg-color-text-sub);
}

.source-form__button {
  width: fit-content;
}
</style>
