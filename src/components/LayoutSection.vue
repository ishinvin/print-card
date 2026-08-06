<script setup>
import { computed, inject } from "vue";
import { useI18n } from "vue-i18n";
import SegmentedControl from "./SegmentedControl.vue";

const settings = inject("cardSettings");
const { t } = useI18n();

const arrangementOptions = computed(() => [
  { value: "row", label: t("layout.row") },
  { value: "column", label: t("layout.column") },
]);

const alignOptions = computed(() => [
  { value: "top", label: t("layout.top") },
  { value: "center", label: t("layout.center") },
  { value: "bottom", label: t("layout.bottom") },
]);
</script>

<template>
  <section class="group">
    <h2>{{ $t("layout.heading") }}</h2>
    <div class="field-group">
      <span class="field-label">{{ $t("layout.arrangement") }}</span>
      <SegmentedControl v-model="settings.pairArrangement" :options="arrangementOptions" />
    </div>
    <div class="field-group">
      <span class="field-label">{{ $t("layout.alignment") }}</span>
      <SegmentedControl v-model="settings.pairAlign" :options="alignOptions" />
    </div>
  </section>
</template>
