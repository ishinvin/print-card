<script setup>
defineProps({
  modelValue: { type: String, required: true },
  options: { type: Array, required: true }, // [{ value, label }]
});
defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="segmented" role="radiogroup">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="segment"
      :class="{ active: modelValue === opt.value }"
      role="radio"
      :aria-checked="modelValue === opt.value"
      @click="$emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped>
.segmented {
  display: flex;
  background: var(--bg);
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
}

.segment {
  flex: 1;
  padding: 6px 10px;
  border: none;
  background: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease;
}

.segment.active {
  background: #fff;
  color: var(--text);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}
</style>
