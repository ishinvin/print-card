<script setup>
import { inject } from "vue";
import SegmentedControl from "./SegmentedControl.vue";

const settings = inject("cardSettings");

const arrangementOptions = [
  { value: "row", label: "Row" },
  { value: "column", label: "Column" },
];

const alignOptions = [
  { value: "top", label: "Top" },
  { value: "center", label: "Center" },
  { value: "bottom", label: "Bottom" },
];
</script>

<template>
  <section class="group">
    <h2>Layout</h2>
    <div class="field-group">
      <span class="field-label">Arrangement</span>
      <SegmentedControl v-model="settings.pairArrangement" :options="arrangementOptions" />
    </div>
    <div class="field-group">
      <span class="field-label">Alignment</span>
      <SegmentedControl v-model="settings.pairAlign" :options="alignOptions" />
    </div>
  </section>
</template>
