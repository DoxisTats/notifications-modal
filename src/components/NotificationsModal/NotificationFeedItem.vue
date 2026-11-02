<script setup lang="ts">
import NotificationIcon from './NotificationIcon.vue'
import FileTypeIcon from './FileTypeIcon.vue'
import type { NotificationItem } from './types'

const props = defineProps<{ item: NotificationItem }>()

const emit = defineEmits<{
  'link-click': [item: NotificationItem]
  'read-more': [item: NotificationItem]
  'attachment-click': [item: NotificationItem]
  delete: [item: NotificationItem]
}>()

const onLink = (e: MouseEvent) => {
  if (!props.item.link?.href) e.preventDefault()
  emit('link-click', props.item)
}
</script>

<template>
  <li class="feed-item" :class="{ 'feed-item--unread': item.unread }">
    <span class="feed-item__icon" :class="`feed-item__icon--${item.status}`">
      <NotificationIcon :name="item.status === 'success' ? 'check-circle' : 'alert-circle'" :size="16" />
    </span>

    <div class="feed-item__content">
      <div class="feed-item__text">
        <div class="feed-item__heading">
          <p class="feed-item__title">{{ item.title }}</p>
          <p class="feed-item__time">{{ item.time }}</p>
        </div>

        <p v-if="item.link" class="feed-item__supporting">
          {{ item.prefix }}
          <a class="link" :href="item.link.href ?? '#'" @click="onLink">{{ item.link.label }}</a>.
        </p>
        <p v-else-if="item.description" class="feed-item__supporting">{{ item.description }}</p>
      </div>

      <button
        v-if="item.attachment"
        type="button"
        class="feed-item__attachment"
        @click="emit('attachment-click', item)"
      >
        <FileTypeIcon :type="item.attachment.type" />
        <span class="feed-item__file">
          <span class="feed-item__file-name">{{ item.attachment.name }}</span>
          <span class="feed-item__file-size">{{ item.attachment.size }}</span>
        </span>
      </button>

      <div v-if="item.message" class="feed-item__bubble">
        <p>
          “{{ item.message }}”
          <button type="button" class="link" @click="emit('read-more', item)">Read more</button>
        </p>
      </div>
    </div>

    <span v-if="item.unread" class="feed-item__dot">
      <span class="sr-only">Unread</span>
    </span>

    <button
      type="button"
      class="feed-item__delete"
      :aria-label="`Delete notification: ${item.title}`"
      title="Delete"
      @click="emit('delete', item)"
    >
      <NotificationIcon name="trash-01" :size="16" />
    </button>
  </li>
</template>

<style scoped>
.feed-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  width: 100%;
  list-style: none;
}

/* Hover / focus state: soft background that bleeds outside the item
   so the layout doesn't shift, plus a delete button in place of the dot */
.feed-item::before {
  content: '';
  position: absolute;
  inset: calc(var(--spacing-md) * -1) calc(var(--spacing-lg) * -1);
  border-radius: var(--radius-md);
  background: var(--colors-bg-primary-hover);
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;
  z-index: 0;
}
.feed-item > * {
  position: relative;
  z-index: 1;
}
.feed-item:hover::before,
.feed-item:focus-within::before {
  opacity: 1;
}
.feed-item__dot,
.feed-item__delete {
  position: absolute;
  z-index: 2;
}

.feed-item__delete {
  top: -6px;
  right: -9px;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--colors-fg-quaternary);
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease, background 0.15s ease, color 0.15s ease;
}
.feed-item:hover .feed-item__delete,
.feed-item:focus-within .feed-item__delete {
  opacity: 1;
  visibility: visible;
}
.feed-item__delete:hover {
  background: var(--colors-bg-error-secondary);
  color: var(--colors-fg-error-primary);
}
.feed-item__delete:focus-visible {
  outline: 2px solid var(--colors-fg-brand);
  outline-offset: 2px;
}
.feed-item:hover .feed-item__dot,
.feed-item:focus-within .feed-item__dot {
  opacity: 0;
}
.feed-item__dot {
  transition: opacity 0.15s ease;
}

@media (hover: none) {
  /* Touch devices: keep delete reachable without hover */
  .feed-item__delete {
    opacity: 1;
    visibility: visible;
  }
  .feed-item--unread .feed-item__dot {
    right: 28px;
  }
}

.feed-item__icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
}
.feed-item__icon--success {
  background: var(--colors-bg-success-secondary);
  color: var(--colors-fg-success-primary);
}
.feed-item__icon--error {
  background: var(--colors-bg-error-secondary);
  color: var(--colors-fg-error-primary);
}

.feed-item__content {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  gap: var(--spacing-lg);
  min-width: 0;
}

.feed-item__text {
  display: flex;
  flex-direction: column;
  overflow-wrap: anywhere;
  /* keep text clear of the unread dot / delete button */
  padding-right: var(--spacing-3xl);
}

.feed-item__heading {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}
.feed-item__title {
  margin: 0;
  font: 500 14px/20px var(--font-family-body);
  color: var(--colors-text-secondary);
}
.feed-item__time {
  margin: 0;
  flex-shrink: 0;
  font: 400 12px/18px var(--font-family-body);
  color: var(--colors-text-tertiary);
  white-space: nowrap;
}

.feed-item__supporting {
  margin: 0;
  font: 400 14px/20px var(--font-family-body);
  color: var(--colors-text-tertiary);
}

.link {
  padding: 0;
  border: 0;
  background: none;
  font: 500 14px/20px var(--font-family-body);
  color: var(--colors-text-brand);
  text-decoration: none;
  cursor: pointer;
}
.link:hover {
  text-decoration: underline;
}
.link:focus-visible,
.feed-item__attachment:focus-visible {
  outline: 2px solid var(--colors-fg-brand);
  outline-offset: 2px;
  border-radius: 4px;
}

.feed-item__attachment {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  text-align: left;
  cursor: pointer;
}
.feed-item__file {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  min-width: 0;
  font: 14px/20px var(--font-family-body);
}
.feed-item__file-name {
  font-weight: 500;
  color: var(--colors-text-secondary);
}
.feed-item__file-size {
  font-weight: 400;
  color: var(--colors-text-tertiary);
}

.feed-item__bubble {
  padding: var(--spacing-lg);
  border: 1px solid var(--colors-border-secondary);
  border-radius: 0 var(--radius-md) var(--radius-md) var(--radius-md);
  background: var(--colors-bg-primary-alt);
}
.feed-item__bubble p {
  margin: 0;
  font: 400 14px/20px var(--font-family-body);
  color: var(--colors-text-secondary);
  overflow-wrap: anywhere;
}

.feed-item__dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  display: grid;
  place-items: center;
}
.feed-item__dot::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--colors-fg-brand);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
