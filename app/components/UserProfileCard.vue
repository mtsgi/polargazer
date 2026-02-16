<script setup lang="ts">
import type { PDataUserProfile } from '../types/pdata'

interface Props {
  /** 表示対象のプロフィール情報 */
  profile: PDataUserProfile
}

const props = defineProps<Props>()
</script>

<template>
  <section class="profile-card">
    <h2 class="profile-card__title">
      Player
    </h2>

    <dl class="profile-card__grid">
      <div class="profile-card__item">
        <dt>ユーザー名</dt>
        <dd>{{ props.profile.usr_name }}</dd>
      </div>
      <div class="profile-card__item">
        <dt>スキル</dt>
        <dd>{{ props.profile.pa_skill }}</dd>
      </div>
      <div class="profile-card__item">
        <dt>クラス</dt>
        <dd>{{ props.profile.pa_class }}</dd>
      </div>
      <div class="profile-card__item">
        <dt>経験値</dt>
        <dd>{{ props.profile.exp }}</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped lang="scss">
.profile-card {
  border: 1px solid #d6d6d6;
  border-radius: 10px;
  padding: 12px;
}

.profile-card__title {
  margin: 0 0 10px;
  font-size: 1rem;
}

.profile-card__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin: 0;
}

.profile-card__item {
  display: grid;
  grid-template-columns: 110px 1fr;
  align-items: center;
  gap: 8px;
}

.profile-card__item dt,
.profile-card__item dd {
  margin: 0;
}

@media (min-width: 720px) {
  .profile-card__grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
