<script setup lang="ts">
/** 40×40 file type icon: page with folded corner + coloured type label (e.g. PDF). */
withDefaults(defineProps<{ type?: string }>(), { type: 'PDF' })
</script>

<template>
  <div class="file-icon" aria-hidden="true">
    <svg class="file-icon__page" width="32" height="40" viewBox="0 0 32 40" fill="none">
      <path
        d="M4 .75h16L31.25 12v24A3.25 3.25 0 0 1 28 39.25H4A3.25 3.25 0 0 1 .75 36V4A3.25 3.25 0 0 1 4 .75Z"
        fill="#fff"
        stroke="var(--colors-border-primary)"
        stroke-width="1.5"
      />
      <path
        d="M20 .5V8a4 4 0 0 0 4 4h7.5"
        stroke="var(--colors-border-primary)"
        stroke-width="1.5"
      />
    </svg>
    <span class="file-icon__label">{{ type }}</span>
  </div>
</template>

<style scoped>
.file-icon {
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}
.file-icon__page {
  position: absolute;
  top: 0;
  left: 7px; /* inset 0 2.5% 0 17.5% */
}
.file-icon__label {
  position: absolute;
  top: 18px; /* inset 45% 32.5% 15% 2.5% */
  left: 1px;
  padding: var(--spacing-xxs) 3px;
  border-radius: var(--spacing-xxs);
  background: var(--colors-fg-error-primary);
  color: var(--colors-fg-white);
  font: 700 10px/12px var(--font-family-body);
  text-align: center;
  white-space: nowrap;
}
</style>
