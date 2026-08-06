<script setup>
import { inject } from "vue";
import ToggleSwitch from "./ToggleSwitch.vue";

const settings = inject("cardSettings");
</script>

<template>
  <section class="group">
    <h2>Sheet layout</h2>
    <div class="field-row">
      <label v-if="settings.pairAlign !== 'center'">
        Margin
        <input type="number" step="0.5" min="0" v-model.number="settings.marginMm" />
      </label>
      <label>
        Card Gap
        <input type="number" step="0.5" min="0" v-model.number="settings.gapMm" />
      </label>
    </div>
    <ToggleSwitch v-model="settings.cropMarks">Show Marks</ToggleSwitch>
  </section>
</template>
