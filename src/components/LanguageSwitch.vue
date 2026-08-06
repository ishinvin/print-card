<script setup>
import { useI18n } from "vue-i18n";
import { setLocale } from "../i18n";

const { locale } = useI18n();

const options = [
  { value: "km", label: "ខ្មែរ" },
  { value: "en", label: "EN" },
];
</script>

<template>
  <div class="lang-switch" role="radiogroup">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="lang-option"
      :class="{ active: locale === opt.value }"
      role="radio"
      :aria-checked="locale === opt.value"
      @click="setLocale(opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped>
.lang-switch {
  display: inline-flex;
  background: var(--bg);
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
  flex-shrink: 0;
}

.lang-option {
  padding: 4px 8px;
  border: none;
  background: none;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    box-shadow 0.15s ease;
}

.lang-option.active {
  background: #fff;
  color: var(--text);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}
</style>
