<script setup lang="ts">
import { ref } from 'vue'
import { NotificationsModal, type NotificationItem } from './components/NotificationsModal'

const open = ref(true)
const tab = ref<'activity' | 'transfers'>('activity')

const notifications = ref<NotificationItem[]>([
  { id: '1', status: 'success', title: 'Changes to XPTO saved', time: '2 mins ago', prefix: 'Saved by', link: { label: 'Lana Steiner' }, unread: true },
  { id: '2', status: 'error', title: 'Error uploading PDF', time: '5 mins ago', description: 'This is the short error message.', attachment: { name: 'Tech requirements.pdf', size: '720 KB', type: 'PDF' }, unread: true },
  { id: '3', status: 'error', title: 'Specific error', time: '10 mins ago', prefix: 'in', link: { label: 'Fips jobs' }, message: 'This is a longer error message lorem ipsum dolor sit amet, consectetur adipiscing elit.', unread: true },
  { id: '4', status: 'success', title: 'Changes to XPTO saved', time: '55 mins ago', prefix: 'Saved by', link: { label: 'Lana Steiner' }, unread: true },
  { id: '5', status: 'error', title: 'Specific error', time: '2 days ago', prefix: 'in', link: { label: 'Fips jobs' }, message: 'This a longer error message lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  { id: '6', status: 'success', title: 'Changes to XPTO saved', time: '1 week ago', prefix: 'Saved by', link: { label: 'Lana Steiner' } },
])

const markAllRead = () => notifications.value.forEach((n) => (n.unread = false))
const remove = (item: NotificationItem) =>
  (notifications.value = notifications.value.filter((n) => n.id !== item.id))
const clearAll = () => (notifications.value = [])
</script>

<template>
  <button class="trigger" @click="open = true">Open notifications</button>

  <NotificationsModal
    v-model:open="open"
    v-model:tab="tab"
    :notifications="notifications"
    :transfers-count="2"
    @mark-all-read="markAllRead"
    @clear-all="clearAll"
    @delete="remove"
    @link-click="(item) => console.log('link', item)"
    @read-more="(item) => console.log('read more', item)"
  />
</template>

<style>
body { margin: 0; min-height: 100vh; background: #1f1f1f; font-family: Inter, system-ui, sans-serif; }
.trigger { margin: 24px; }
</style>
