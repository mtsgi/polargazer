<script setup lang="ts">
import type { PDataUserProfile } from '../types/pdata'
import { calculateSkillGrade } from '../utils/pa-skill-grade'

interface Props {
  /** 表示対象のプロフィール情報 */
  profile: PDataUserProfile
}

const props = defineProps<Props>()

/**
 * PA SKILLから算出したスキルグレード
 */
const skillGrade = computed(() => calculateSkillGrade(props.profile.pa_skill))

/**
 * スキルグレードに対応する装飾クラスを返す
 */
function skillGradeClass(grade: string): string {
  if (grade === '-') {
    return 'profile-card__grade--unknown'
  }

  const base = grade.replace(/\+{1,4}$/, '').toLowerCase()
  return `profile-card__grade--${base}`
}
</script>

<template>
  <section class="profile-card">
    <h2 class="profile-card__title">
      プロフィール
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
        <dt>スキルグレード</dt>
        <dd>
          <span
            class="profile-card__grade"
            :class="skillGradeClass(skillGrade)"
          >
            {{ skillGrade }}
          </span>
        </dd>
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
  border: 3px solid var(--pg-color-border);
  border-radius: 10px;
  padding: 12px;
  background: var(--pg-color-white);
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
  grid-template-columns: 130px 1fr;
  align-items: center;
  gap: 8px;
}

.profile-card__item dt,
.profile-card__item dd {
  margin: 0;
}

.profile-card__item dt {
  color: var(--pg-color-text-sub);
}

.profile-card__item dd {
  font-weight: 900;
}

.profile-card__grade {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  padding: 2px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--skill-grade-default-fg);
}

.profile-card__grade--unknown,
.profile-card__grade--gray {
  background-color: var(--skill-grade-unknown-bg);
  color: var(--skill-grade-unknown-fg);
}

.profile-card__grade--green {
  background-color: var(--skill-grade-green-bg);
}

.profile-card__grade--lime {
  background-color: var(--skill-grade-lime-bg);
}

.profile-card__grade--blue {
  background-color: var(--skill-grade-blue-bg);
}

.profile-card__grade--cyan {
  background-color: var(--skill-grade-cyan-bg);
}

.profile-card__grade--lemon {
  background-color: var(--skill-grade-lemon-bg);
}

.profile-card__grade--orange {
  background-color: var(--skill-grade-orange-bg);
}

.profile-card__grade--coral {
  background-color: var(--skill-grade-coral-bg);
}

.profile-card__grade--red {
  background-color: var(--skill-grade-red-bg);
}

.profile-card__grade--purple {
  background-color: var(--skill-grade-purple-bg);
  color: var(--skill-grade-purple-fg);
}

.profile-card__grade--navy {
  background-color: var(--skill-grade-navy-bg);
  color: var(--skill-grade-navy-fg);
}

.profile-card__grade--rainbow {
  color: var(--skill-grade-rainbow-fg);
  background: var(--skill-grade-rainbow-bg);
}

@media (min-width: 720px) {
  .profile-card__grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
