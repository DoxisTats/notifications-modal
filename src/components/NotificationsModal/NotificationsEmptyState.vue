<script setup lang="ts">
import NotificationIcon from './NotificationIcon.vue'

withDefaults(defineProps<{ title?: string; description?: string }>(), {
  title: 'No new notifications',
  description: 'You are all caught up.',
})
</script>

<template>
  <div class="empty-state" role="status">
    <span class="empty-state__icon">
      <NotificationIcon name="bell-off-02" :size="24" />
    </span>
    <div class="empty-state__text">
      <p class="empty-state__title">{{ title }}</p>
      <p class="empty-state__description">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
  width: 100%;
  max-width: 350px;
  margin: auto; /* centres in the scroll area */
}
.empty-state__icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: var(--colors-bg-tertiary);
  color: var(--colors-fg-tertiary);
}
.empty-state__text {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  width: 100%;
  text-align: center;
  overflow-wrap: anywhere;
}
.empty-state__title {
  margin: 0;
  font: 600 16px/24px var(--font-family-body);
  color: var(--colors-text-primary);
}
.empty-state__description {
  margin: 0;
  font: 400 14px/20px var(--font-family-body);
  color: var(--colors-text-tertiary);
}
</style>
