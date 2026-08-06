<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
});
defineEmits(["update:modelValue"]);
</script>

<template>
  <label class="switch">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="track">
      <span class="thumb"></span>
    </span>
    <span class="switch-label"><slot /></span>
  </label>
</template>

<style scoped>
.switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text);
}

.switch input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.track {
  width: 34px;
  height: 20px;
  background: var(--panel-border);
  border-radius: 999px;
  position: relative;
  flex-shrink: 0;
  transition: background 0.15s ease;
}

.thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s ease;
}

.switch input:checked + .track {
  background: var(--accent);
}

.switch input:checked + .track .thumb {
  transform: translateX(14px);
}
</style>
