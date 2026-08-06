<script setup>
import { inject } from "vue";

const settings = inject("cardSettings");
</script>

<template>
  <section class="group">
    <h2>Card size (mm)</h2>
    <div class="field-row">
      <label>
        Width
        <input type="number" step="0.1" min="10" v-model.number="settings.cardWidthMm" />
      </label>
      <label>
        Height
        <input type="number" step="0.1" min="10" v-model.number="settings.cardHeightMm" />
      </label>
    </div>
    <div class="field-row">
      <label>
        Corner Radius
        <input type="number" step="0.1" min="0" v-model.number="settings.radiusMm" />
      </label>
    </div>
  </section>
</template>
