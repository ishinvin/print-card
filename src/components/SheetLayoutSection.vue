<script setup>
import { inject } from "vue";
import ToggleSwitch from "./ToggleSwitch.vue";

const settings = inject("cardSettings");
</script>

<template>
  <section class="group">
    <h2>{{ $t("sheetLayout.heading") }}</h2>
    <div class="field-row">
      <label v-if="settings.pairAlign !== 'center'">
        {{ $t("sheetLayout.margin") }}
        <input type="number" step="0.5" min="0" v-model.number="settings.marginMm" />
      </label>
      <label>
        {{ $t("sheetLayout.cardGap") }}
        <input type="number" step="0.5" min="0" v-model.number="settings.gapMm" />
      </label>
    </div>
    <ToggleSwitch v-model="settings.cropMarks">{{ $t("sheetLayout.showMarks") }}</ToggleSwitch>
  </section>
</template>
