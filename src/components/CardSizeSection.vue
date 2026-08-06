<script setup>
import { inject } from "vue";

const settings = inject("cardSettings");
</script>

<template>
  <section class="group">
    <h2>{{ $t("cardSize.heading") }}</h2>
    <div class="field-row">
      <label>
        {{ $t("cardSize.width") }}
        <input type="number" step="0.1" min="10" v-model.number="settings.cardWidthMm" />
      </label>
      <label>
        {{ $t("cardSize.height") }}
        <input type="number" step="0.1" min="10" v-model.number="settings.cardHeightMm" />
      </label>
    </div>
    <div class="field-row">
      <label>
        {{ $t("cardSize.cornerRadius") }}
        <input type="number" step="0.1" min="0" v-model.number="settings.radiusMm" />
      </label>
    </div>
  </section>
</template>
