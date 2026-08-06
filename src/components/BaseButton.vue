<script setup>
defineProps({
  variant: { type: String, default: "outline" }, // 'outline' | 'solid'
});
</script>

<template>
  <button class="base-btn" :class="variant">
    <slot />
  </button>
</template>

<style scoped>
.base-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
}

.base-btn :deep(svg) {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.base-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.base-btn.outline {
  background: #fff;
  color: var(--text);
  border-color: var(--panel-border);
}

.base-btn.outline:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}

.base-btn.solid {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.base-btn.solid:hover:not(:disabled) {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}
</style>
