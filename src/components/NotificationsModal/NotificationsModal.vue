<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import NotificationIcon from './NotificationIcon.vue'
import NotificationFeedItem from './NotificationFeedItem.vue'
import NotificationsEmptyState from './NotificationsEmptyState.vue'
import type { NotificationItem, NotificationsTab } from './types'
import './tokens.css'

const props = withDefaults(
  defineProps<{
    /** Controls visibility (v-model:open) */
    open?: boolean
    notifications: NotificationItem[]
    /** Count shown in the Transfers tab badge; hidden when 0 */
    transfersCount?: number
    title?: string
    subtitle?: string
    /** Close when clicking the backdrop */
    closeOnBackdrop?: boolean
  }>(),
  {
    open: true,
    transfersCount: 0,
    title: 'Notifications',
    subtitle: 'All your important alerts in one place.',
    closeOnBackdrop: true,
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  close: []
  'mark-all-read': []
  'clear-all': []
  'link-click': [item: NotificationItem]
  'read-more': [item: NotificationItem]
  'attachment-click': [item: NotificationItem]
  delete: [item: NotificationItem]
}>()

const activeTab = defineModel<NotificationsTab>('tab', { default: 'activity' })

const tabs = computed(() => [
  { id: 'activity' as const, label: 'Activity', count: 0 },
  { id: 'transfers' as const, label: 'Transfers', count: props.transfersCount },
])

const hasUnread = computed(() => props.notifications.some((n) => n.unread))

// Footer actions only apply to the Activity list
const canMarkAllRead = computed(() => activeTab.value === 'activity' && hasUnread.value)
const canClearAll = computed(() => activeTab.value === 'activity' && props.notifications.length > 0)

const dialogRef = ref<HTMLElement | null>(null)
const closeBtnRef = ref<HTMLButtonElement | null>(null)
let previouslyFocused: HTMLElement | null = null

const close = () => {
  emit('update:open', false)
  emit('close')
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    e.stopPropagation()
    close()
    return
  }
  // Simple focus trap
  if (e.key === 'Tab' && dialogRef.value) {
    const focusables = dialogRef.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    )
    if (!focusables.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

const onTabKeydown = (e: KeyboardEvent, index: number) => {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
  e.preventDefault()
  const next = (index + (e.key === 'ArrowRight' ? 1 : -1) + tabs.value.length) % tabs.value.length
  activeTab.value = tabs.value[next].id
  nextTick(() => document.getElementById(`notif-tab-${tabs.value[next].id}`)?.focus())
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      previouslyFocused = document.activeElement as HTMLElement | null
      await nextTick()
      closeBtnRef.value?.focus()
    } else {
      previouslyFocused?.focus?.()
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => previouslyFocused?.focus?.())
</script>

<template>
  <Teleport to="body">
    <Transition name="notif-fade">
      <div
        v-if="open"
        class="notif-backdrop"
        @click.self="closeOnBackdrop && close()"
      >
        <section
          ref="dialogRef"
          class="notif-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="notif-title"
          aria-describedby="notif-subtitle"
          @keydown="onKeydown"
        >
          <!-- Header -->
          <header class="notif-header">
            <div class="notif-heading">
              <span class="notif-featured-icon">
                <NotificationIcon name="bell-01" :size="20" />
              </span>
              <div class="notif-heading__text">
                <h2 id="notif-title" class="notif-title">{{ title }}</h2>
                <p id="notif-subtitle" class="notif-subtitle">{{ subtitle }}</p>
              </div>
            </div>

            <div class="notif-tabs" role="tablist" aria-label="Notification categories">
              <button
                v-for="(tab, i) in tabs"
                :id="`notif-tab-${tab.id}`"
                :key="tab.id"
                type="button"
                role="tab"
                class="notif-tab"
                :class="{ 'notif-tab--active': activeTab === tab.id }"
                :aria-selected="activeTab === tab.id"
                :aria-controls="`notif-panel-${tab.id}`"
                :tabindex="activeTab === tab.id ? 0 : -1"
                @click="activeTab = tab.id"
                @keydown="onTabKeydown($event, i)"
              >
                {{ tab.label }}
                <span v-if="tab.count" class="notif-badge">{{ tab.count }}</span>
              </button>
            </div>

            <button
              ref="closeBtnRef"
              type="button"
              class="notif-close"
              aria-label="Close notifications"
              @click="close"
            >
              <NotificationIcon name="x-close" :size="20" />
            </button>
          </header>

          <!-- Body -->
          <div
            :id="`notif-panel-${activeTab}`"
            class="notif-body"
            role="tabpanel"
            :aria-labelledby="`notif-tab-${activeTab}`"
            tabindex="0"
          >
            <template v-if="activeTab === 'activity'">
              <TransitionGroup v-if="notifications.length" tag="ul" name="notif-item" class="notif-list">
                <NotificationFeedItem
                  v-for="item in notifications"
                  :key="item.id"
                  :item="item"
                  @link-click="emit('link-click', $event)"
                  @read-more="emit('read-more', $event)"
                  @attachment-click="emit('attachment-click', $event)"
                  @delete="emit('delete', $event)"
                />
              </TransitionGroup>
              <slot v-else name="empty">
                <NotificationsEmptyState />
              </slot>
            </template>

            <slot v-else name="transfers">
              <NotificationsEmptyState
                title="No transfers"
                description="Your uploads and downloads will appear here."
              />
            </slot>
          </div>

          <!-- Footer -->
          <footer class="notif-footer">
            <button
              type="button"
              class="notif-action notif-action--secondary"
              :disabled="!canMarkAllRead"
              @click="emit('mark-all-read')"
            >
              <NotificationIcon name="check-circle-broken" :size="20" />
              Mark all as read
            </button>
            <button
              type="button"
              class="notif-action notif-action--destructive"
              :disabled="!canClearAll"
              @click="emit('clear-all')"
            >
              <NotificationIcon name="trash-01" :size="20" />
              Clear all
            </button>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.notif-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: var(--spacing-xl);
  background: rgba(10, 13, 18, 0.7);
}

.notif-modal {
  display: flex;
  flex-direction: column;
  width: 480px;
  max-width: 100%;
  /* Fixed height so switching tabs (or clearing the list) never resizes the modal */
  height: min(800px, calc(100vh - 32px));
  overflow: hidden;
  border-radius: var(--radius-2xl);
  background: var(--colors-bg-primary);
  box-shadow: var(--shadow-xl);
  font-family: var(--font-family-body);
}

/* Header */
.notif-header {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3xl);
  flex-shrink: 0;
  padding: var(--spacing-3xl) var(--spacing-lg) var(--spacing-xl) var(--spacing-3xl);
  border-bottom: 1px solid var(--colors-border-secondary-alt);
}
.notif-heading {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-xl);
  padding-right: var(--spacing-6xl);
}
.notif-featured-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--colors-bg-tertiary);
  color: var(--colors-fg-tertiary);
}
.notif-heading__text {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  gap: var(--spacing-xxs);
  min-width: 0;
}
.notif-title {
  margin: 0;
  font: 600 18px/28px var(--font-family-body);
  color: var(--colors-text-primary);
}
.notif-subtitle {
  margin: 0;
  font: 400 14px/20px var(--font-family-body);
  color: var(--colors-text-tertiary);
}

.notif-close {
  position: absolute;
  top: 12px;
  right: 12px;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: var(--spacing-md);
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--colors-fg-quaternary);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.notif-close:hover {
  background: var(--colors-bg-primary-hover);
  color: var(--colors-fg-tertiary);
}

/* Tabs */
.notif-tabs {
  display: flex;
  align-items: center;
  gap: var(--spacing-xxs);
  border: 1px solid var(--colors-border-secondary);
  border-radius: var(--radius-md);
  background: var(--colors-bg-secondary-alt);
}
.notif-tab {
  display: flex;
  flex: 1 0 0;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  height: 36px;
  min-width: 0;
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  background: transparent;
  font: 600 14px/20px var(--font-family-body);
  color: var(--colors-text-quaternary);
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s;
}
.notif-tab:hover {
  color: var(--colors-text-secondary);
}
.notif-tab--active {
  border-color: var(--colors-border-primary);
  background: var(--colors-bg-primary-alt);
  color: var(--colors-text-secondary);
  box-shadow: var(--shadow-xs);
}
.notif-badge {
  padding: var(--spacing-xxs) var(--spacing-md);
  border: 1px solid var(--utility-gray-200);
  border-radius: var(--radius-full);
  background: var(--utility-gray-50);
  font: 500 12px/18px var(--font-family-body);
  color: var(--utility-gray-700);
}

/* Body */
.notif-body {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: var(--spacing-3xl);
}
.notif-body:focus-visible {
  outline: none;
}
.notif-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3xl);
  margin: 0;
  padding: 0;
}


/* Footer */
.notif-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xl);
  flex-shrink: 0;
  padding: var(--spacing-xl) var(--spacing-3xl);
  border-top: 1px solid var(--colors-border-secondary);
  background: var(--colors-bg-primary);
  box-shadow: 0 -1px 1px rgba(10, 13, 18, 0.05);
}
.notif-action {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 0;
  border: 0;
  background: none;
  font: 600 14px/20px var(--font-family-body);
  cursor: pointer;
  transition: color 0.15s;
}

.notif-action--secondary {
  color: var(--colors-text-tertiary);
}
.notif-action--secondary svg {
  color: var(--colors-fg-quaternary);
}
.notif-action--secondary:not(:disabled):hover {
  color: var(--colors-text-secondary);
}
.notif-action--destructive {
  color: var(--colors-text-error-primary);
}
.notif-action--destructive:not(:disabled):hover {
  color: #b42318;
}
/* Disabled: text and icon both go to the disabled grey (after the variants so it wins) */
.notif-action:disabled,
.notif-action:disabled svg {
  color: var(--colors-fg-disabled);
  cursor: not-allowed;
}

.notif-tab:focus-visible,
.notif-close:focus-visible,
.notif-action:focus-visible {
  outline: 2px solid var(--colors-fg-brand);
  outline-offset: 2px;
}

/* Item removal */
.notif-list {
  position: relative;
}
.notif-item-move,
.notif-item-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.notif-item-leave-active {
  position: absolute;
  left: 0;
  right: 0;
}
.notif-item-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

/* Transition */
.notif-fade-enter-active,
.notif-fade-leave-active {
  transition: opacity 0.2s ease;
}
.notif-fade-enter-active .notif-modal,
.notif-fade-leave-active .notif-modal {
  transition: transform 0.2s ease;
}
.notif-fade-enter-from,
.notif-fade-leave-to {
  opacity: 0;
}
.notif-fade-enter-from .notif-modal,
.notif-fade-leave-to .notif-modal {
  transform: translateY(8px) scale(0.98);
}

@media (prefers-reduced-motion: reduce) {
  .notif-fade-enter-active,
  .notif-fade-leave-active,
  .notif-fade-enter-active .notif-modal,
  .notif-fade-leave-active .notif-modal,
  .notif-item-move,
  .notif-item-leave-active {
    transition: none;
  }
}
</style>
