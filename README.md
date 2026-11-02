# Notifications Modal (Vue 3)

Doxis notifications modal built from the Figma design system handoff
(`Design system - Handoff`, nodes 5549:3297 and 679:7332).

**Live preview:** https://doxistats.github.io/notifications-modal/

## Run the demo

```bash
npm install
npx vite
```

## Use the component

```vue
<NotificationsModal
  v-model:open="open"
  v-model:tab="tab"
  :notifications="notifications"
  :transfers-count="0"
  @mark-all-read="markAllRead"
  @clear-all="clearAll"
  @delete="remove"
/>
```

Code lives in `src/components/NotificationsModal/`:

- `NotificationsModal.vue` - modal shell, tabs, footer actions, focus trap, Esc/backdrop close
- `NotificationFeedItem.vue` - one row (status icon, link, attachment, message bubble, unread dot, hover delete)
- `NotificationsEmptyState.vue` - empty state
- `NotificationIcon.vue`, `FileTypeIcon.vue` - inline SVG icons (Untitled UI)
- `tokens.css` - design tokens; remove if your app already defines them
- `types.ts` - `NotificationItem` and related types

Events: `update:open`, `close`, `mark-all-read`, `clear-all`, `delete`, `link-click`, `read-more`, `attachment-click`.
Slots: `empty`, `transfers`.
