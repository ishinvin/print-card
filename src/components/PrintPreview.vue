<script setup>
import { ref, computed, inject, onMounted, onBeforeUnmount, watch } from "vue";
import CardSlot from "./CardSlot.vue";
import { useIsMobile } from "../composables/useIsMobile";

const settings = inject("cardSettings");
const images = inject("cardImages");

// CSS's defined mm-to-px ratio (96px/inch), used to shrink the page to fit
// narrow viewports — the page itself stays true-size (mm) when printed.
const MM_TO_PX = 96 / 25.4;
const PAGE_W_PX = 210 * MM_TO_PX;
const PAGE_H_PX = 297 * MM_TO_PX;

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;

const previewEl = ref(null);
const containerWidth = ref(0);
// null = auto-fit to container width; once the user zooms manually, this
// takes over and stops reacting to container resizes until reset.
const manualZoom = ref(null);
const isMobile = useIsMobile();
let observer;

// Zoom controls are desktop-only — drop any manual zoom once the viewport
// crosses into mobile so the page always falls back to auto-fit there.
watch(isMobile, (mobile) => {
  if (mobile) manualZoom.value = null;
});

function clampZoom(z) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
}

function zoomIn() {
  manualZoom.value = clampZoom(scale.value + ZOOM_STEP);
}

function zoomOut() {
  manualZoom.value = clampZoom(scale.value - ZOOM_STEP);
}

function resetZoom() {
  manualZoom.value = null;
}

function onWheel(e) {
  if (!(e.ctrlKey || e.metaKey)) return;
  e.preventDefault();
  manualZoom.value = clampZoom(scale.value + (e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP));
}

onMounted(() => {
  observer = new ResizeObserver((entries) => {
    const width = entries[0].contentRect.width;
    // Ignore sub-pixel deltas — layout rounding can report fractional
    // changes that don't affect anything visually; skip the needless re-render.
    if (Math.abs(width - containerWidth.value) > 0.5) {
      containerWidth.value = width;
    }
  });
  observer.observe(previewEl.value);
  previewEl.value.addEventListener("wheel", onWheel, { passive: false });
});

onBeforeUnmount(() => {
  observer?.disconnect();
  previewEl.value?.removeEventListener("wheel", onWheel);
});

const fitScale = computed(() => {
  if (containerWidth.value <= 0) return 1;
  return Math.min(1, containerWidth.value / PAGE_W_PX);
});

const scale = computed(() => manualZoom.value ?? fitScale.value);

const scaledWidth = computed(() => Math.round(PAGE_W_PX * scale.value));
const scaledHeight = computed(() => Math.round(PAGE_H_PX * scale.value));
</script>

<template>
  <main class="preview" ref="previewEl">
    <div class="page-scale-box" :style="{ width: scaledWidth + 'px', height: scaledHeight + 'px' }">
      <div
        class="a4-page"
        :style="{
          transform: `scale(${scale})`,
          alignItems: settings.pairAlignItems,
          ...settings.pairPadding,
        }"
      >
        <div class="pair" :class="settings.pairArrangement" :style="{ gap: settings.gapMm + 'mm' }">
          <CardSlot
            v-model:src="images.frontImage"
            :width-mm="settings.cardWidthMm"
            :height-mm="settings.cardHeightMm"
            :radius-mm="settings.radiusMm"
            :crop-marks="settings.cropMarks"
            :label="$t('card.front')"
            @select-file="images.onSelectFile('front', $event)"
          />
          <CardSlot
            v-model:src="images.backImage"
            :width-mm="settings.cardWidthMm"
            :height-mm="settings.cardHeightMm"
            :radius-mm="settings.radiusMm"
            :crop-marks="settings.cropMarks"
            :label="$t('card.back')"
            @select-file="images.onSelectFile('back', $event)"
          />
        </div>
      </div>
    </div>

    <div class="zoom-controls no-print">
      <button
        type="button"
        :disabled="scale <= MIN_ZOOM"
        :title="$t('preview.zoomOut')"
        @click="zoomOut"
      >
        −
      </button>
      <button type="button" class="zoom-level" :title="$t('preview.resetZoom')" @click="resetZoom">
        {{ Math.round(scale * 100) }}%
      </button>
      <button
        type="button"
        :disabled="scale >= MAX_ZOOM"
        :title="$t('preview.zoomIn')"
        @click="zoomIn"
      >
        +
      </button>
    </div>
  </main>
</template>

<style scoped>
.preview {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px 16px 80px;
  overflow-x: auto;
}

.page-scale-box {
  position: relative;
  flex: 0 0 auto;
}

.a4-page {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: top left;
  width: 210mm;
  height: 297mm;
  background: #fff;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pair {
  display: flex;
}

.pair.row {
  flex-direction: row;
}

.pair.column {
  flex-direction: column;
}

.zoom-controls {
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: flex;
  align-items: center;
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 50;
}

.zoom-controls button {
  border: none;
  background: none;
  color: var(--text);
  font-size: 15px;
  line-height: 1;
  cursor: pointer;
  padding: 8px 12px;
  transition: background 0.15s ease;
}

.zoom-controls button:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.06);
}

.zoom-controls button:disabled {
  opacity: 0.4;
  cursor: default;
}

.zoom-controls .zoom-level {
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  border-left: 1px solid var(--panel-border);
  border-right: 1px solid var(--panel-border);
  min-width: 44px;
}

@media (max-width: 880px) {
  .preview {
    flex: none;
    padding-bottom: 32px;
  }

  .zoom-controls {
    display: none;
  }
}

@media print {
  .preview {
    padding: 0;
    gap: 0;
    overflow: visible;
  }

  .page-scale-box {
    width: 210mm !important;
    height: 297mm !important;
  }

  .a4-page {
    position: static !important;
    transform: none !important;
    box-shadow: none;
    width: 210mm;
    height: 297mm;
    page-break-after: always;
  }

  .a4-page:last-child {
    page-break-after: auto;
  }
}
</style>
