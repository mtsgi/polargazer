<script setup lang="ts">
import { loadDataSourceUrls, saveDataSourceUrls } from './composables/useDataSourceStorage'
import { useScoreDataLoader } from './composables/useScoreDataLoader'

// アクティブなタブ
type ActiveTab = 'songs' | 'skill'
const activeTab = ref<ActiveTab>('songs')

// 入力URLは前回値を復元する
const sourceUrls = ref(loadDataSourceUrls())
// 初回ロード実行前かどうかを判定する
const hasRequestedLoad = ref(false)

const {
  isLoading,
  errorMessage,
  loadedData,
  load,
} = useScoreDataLoader()

// フォーム入力URLでcommon/pdataを読み込む
async function loadScoreData() {
  hasRequestedLoad.value = true
  saveDataSourceUrls(sourceUrls.value)
  await load(sourceUrls.value)
}
</script>

<template>
  <main class="app">
    <NuxtRouteAnnouncer />

    <h1 class="app__title">
      Polargazer
    </h1>

    <DataSourceForm
      v-model:common-url="sourceUrls.commonUrl"
      v-model:pdata-url="sourceUrls.pdataUrl"
      v-model:meta-url="sourceUrls.metaUrl"
      :loading="isLoading"
      @submit="loadScoreData"
    />

    <p v-if="!hasRequestedLoad" class="app__notice">
      未読み込みです。URLを確認して「Load Data」を押してください。
    </p>

    <p v-if="hasRequestedLoad && errorMessage" class="app__error">
      {{ errorMessage }}
    </p>

    <UserProfileCard
      v-if="hasRequestedLoad && loadedData?.profile"
      :profile="loadedData.profile"
    />

    <template v-if="hasRequestedLoad && loadedData">
      <!-- タブ切り替えナビ -->
      <nav class="app__tabs" aria-label="コンテンツタブ">
        <button
          type="button"
          class="app__tab"
          :class="{ 'app__tab--active': activeTab === 'songs' }"
          @click="activeTab = 'songs'"
        >
          楽曲リスト
        </button>
        <button
          type="button"
          class="app__tab"
          :class="{ 'app__tab--active': activeTab === 'skill' }"
          @click="activeTab = 'skill'"
        >
          SKILL
        </button>
      </nav>

      <!-- 楽曲リストタブ -->
      <SongListTab
        v-show="activeTab === 'songs'"
        :rows="loadedData.rows"
      />

      <!-- SKILLタブ -->
      <SkillTab
        v-show="activeTab === 'skill'"
        :rows="loadedData.rows"
        :profile="loadedData.profile"
      />
    </template>
  </main>
</template>

<style scoped lang="scss">
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px;
  display: grid;
  gap: 12px;
  color: var(--pg-color-text-main);
}

.app__title {
  margin: 0;
  text-align: center;
  display: inline-block;
  font-size: clamp(2.2rem, 6.2vw, 3.8rem);
  font-weight: 900;
  letter-spacing: 0.08em;
  line-height: 1.05;
  color: var(--pg-color-white);
  -webkit-text-stroke: 1px var(--pg-color-text-main);
  text-shadow:
    -2px -2px 0 var(--pg-color-accent-pink),
    2px -2px 0 var(--pg-color-accent-soft),
    -2px 2px 0 var(--pg-color-accent-soft),
    2px 2px 0 var(--pg-color-accent-pink),
    0 7px 0 var(--pg-color-border);
  margin-bottom: 10px;
}

.app__notice,
.app__error {
  margin: 0;
}

.app__error {
  border: 1px solid var(--pg-color-error);
  border-radius: 8px;
  padding: 8px;
  color: var(--pg-color-error);
  background: color-mix(in srgb, var(--pg-color-error) 10%, white);
}

.app__notice {
  color: var(--pg-color-text-sub);
}

.app__tabs {
  display: flex;
  gap: 6px;
  border-bottom: 2px solid var(--pg-color-border);
}

.app__tab {
  appearance: none;
  cursor: pointer;
  border: 2px solid var(--pg-color-border);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  padding: 8px 20px;
  font: inherit;
  font-weight: 700;
  font-size: 0.9rem;
  background: color-mix(in srgb, var(--pg-color-surface-soft) 30%, var(--pg-color-white));
  color: var(--pg-color-text-sub);
  transition: background 0.15s, color 0.15s;
}

.app__tab:hover {
  background: var(--pg-color-surface-soft);
}

.app__tab--active {
  background: var(--pg-color-white);
  color: var(--pg-color-text-main);
  border-bottom: 2px solid var(--pg-color-white);
  margin-bottom: -2px;
}

@media (min-width: 900px) {
  .app {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }

  .app__title,
  .app__notice,
  .app__error,
  .app__tabs {
    grid-column: 1 / -1;
  }

  /* タブコンテンツは全幅 */
  .app > :deep(.song-list-tab),
  .app > :deep(.skill-tab) {
    grid-column: 1 / -1;
  }
}
</style>
