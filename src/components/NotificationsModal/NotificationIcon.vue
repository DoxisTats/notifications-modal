<script setup lang="ts">
/*
 * Untitled UI line icons used by the modal (24×24 grid, stroke = currentColor).
 * Swap for your icon library's components if you have one.
 */
export type IconName =
  | 'bell-01'
  | 'bell-off-02'
  | 'x-close'
  | 'check-circle'
  | 'alert-circle'
  | 'check-circle-broken'
  | 'trash-01'

withDefaults(defineProps<{ name: IconName; size?: number }>(), { size: 20 })

const paths: Record<IconName, string> = {
  'bell-01':
    'M9.354 21c.705.622 1.632 1 2.646 1s1.94-.378 2.646-1M18 8A6 6 0 1 0 6 8c0 3.09-.78 5.206-1.65 6.605-.735 1.18-1.102 1.771-1.089 1.936.015.182.054.252.2.36.133.099.732.099 1.928.099H18.61c1.196 0 1.795 0 1.927-.098.147-.11.186-.179.2-.361.014-.165-.353-.755-1.088-1.936C18.78 13.206 18 11.09 18 8Z',
  'bell-off-02':
    'M8.627 3.042A6 6 0 0 1 18 8c0 2.344.448 4.13 1.042 5.468M6.268 6.255A6 6 0 0 0 6 8c0 3.09-.78 5.206-1.65 6.605-.735 1.18-1.102 1.771-1.089 1.936.015.182.054.252.2.36.133.099.732.099 1.928.099H17M9.354 21c.705.622 1.632 1 2.646 1s1.94-.378 2.646-1M21 21 3 3',
  'x-close': 'M18 6 6 18M6 6l12 12',
  'check-circle':
    'm7.5 12 3 3 6-6m5.5 3c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z',
  'alert-circle':
    'M12 8v4m0 4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z',
  'check-circle-broken': 'M22 11.086v.92a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
  'trash-01':
    'M16 6v-.8c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C14.48 2 13.92 2 12.8 2h-1.6c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C8 3.52 8 4.08 8 5.2V6m2 5.5v5m4-5v5M3 6h18m-2 0v11.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C16.72 22 15.88 22 14.2 22H9.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C5 19.72 5 18.88 5 17.2V6',
}
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      :d="paths[name]"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
