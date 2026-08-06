<script setup>
import { provide } from "vue";
import { useCardSettings } from "./composables/useCardSettings";
import { useCardImages } from "./composables/useCardImages";
import { useIsMobile } from "./composables/useIsMobile";
import Toolbar from "./components/Toolbar.vue";
import PrintPreview from "./components/PrintPreview.vue";
import AppFooter from "./components/AppFooter.vue";
import CropModal from "./components/CropModal.vue";

const settings = useCardSettings();
const images = useCardImages();
const isMobile = useIsMobile();

provide("cardSettings", settings);
provide("cardImages", images);
</script>

<template>
  <div class="app">
    <Toolbar />
    <PrintPreview />
    <AppFooter v-if="isMobile" class="no-print" />

    <CropModal
      v-if="images.cropTarget"
      :src="images.cropSrc"
      :aspect-ratio="settings.cropAspectRatio"
      @confirm="images.onCropConfirm"
      @cancel="images.onCropCancel"
    />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  align-items: flex-start;
  min-height: 100vh;
}

@media print {
  .app {
    display: block;
    min-height: 0;
  }
}

@media (max-width: 880px) {
  .app {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
