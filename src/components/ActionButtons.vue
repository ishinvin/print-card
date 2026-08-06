<script setup>
import { inject } from "vue";
import { useExportImage } from "../composables/useExportImage";
import SavePreviewModal from "./SavePreviewModal.vue";
import BaseButton from "./BaseButton.vue";

defineProps({
  compact: { type: Boolean, default: false },
});

const settings = inject("cardSettings");
const images = inject("cardImages");
const { generating, previewUrl, openPreview, confirmDownload, closePreview } = useExportImage(
  settings,
  images,
);

function doPrint() {
  window.print();
}

function resetAll() {
  settings.reset();
  images.reset();
}
</script>

<template>
  <div v-if="compact" class="action-icons">
    <button type="button" class="icon-btn" title="Print" aria-label="Print" @click="doPrint">
      <svg viewBox="0 0 16 16" fill="none">
        <path
          d="M5 5.5V2.5h6v3"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <rect
          x="2"
          y="5.5"
          width="12"
          height="5.5"
          rx="1.5"
          stroke="currentColor"
          stroke-width="1.4"
        />
        <rect
          x="5"
          y="8.5"
          width="6"
          height="5"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <button
      type="button"
      class="icon-btn"
      title="Save image"
      aria-label="Save image"
      :disabled="generating"
      @click="openPreview"
    >
      <svg viewBox="0 0 16 16" fill="none">
        <path
          d="M8 2v7m0 0 3-3m-3 3L5 6M3 11v1.5A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5V11"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <button type="button" class="icon-btn" title="Reset" aria-label="Reset" @click="resetAll">
      <svg viewBox="0 0 16 16" fill="none">
        <path
          d="M13.5 8a5.5 5.5 0 1 1-1.6-3.89M13.5 2v3.5H10"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>

  <div v-else class="action-row">
    <BaseButton @click="doPrint">
      <svg viewBox="0 0 16 16" fill="none">
        <path
          d="M5 5.5V2.5h6v3"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <rect
          x="2"
          y="5.5"
          width="12"
          height="5.5"
          rx="1.5"
          stroke="currentColor"
          stroke-width="1.4"
        />
        <rect
          x="5"
          y="8.5"
          width="6"
          height="5"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linejoin="round"
        />
      </svg>
      <span>Print</span>
    </BaseButton>

    <BaseButton :disabled="generating" @click="openPreview">
      <svg viewBox="0 0 16 16" fill="none">
        <path
          d="M8 2v7m0 0 3-3m-3 3L5 6M3 11v1.5A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5V11"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span>{{ generating ? "Preparing…" : "Save" }}</span>
    </BaseButton>

    <BaseButton @click="resetAll">
      <svg viewBox="0 0 16 16" fill="none">
        <path
          d="M13.5 8a5.5 5.5 0 1 1-1.6-3.89M13.5 2v3.5H10"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span>Reset</span>
    </BaseButton>
  </div>

  <SavePreviewModal
    v-if="previewUrl"
    :src="previewUrl"
    @confirm="confirmDownload"
    @cancel="closePreview"
  />
</template>

<style scoped>
.action-row {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.action-row :deep(.base-btn) {
  flex: 1;
}

.action-icons {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
  flex-shrink: 0;
}

.icon-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  transition: background 0.15s ease;
}

.icon-btn svg {
  width: 16px;
  height: 16px;
}

.icon-btn:hover:not(:disabled),
.icon-btn:active:not(:disabled) {
  background: rgba(0, 0, 0, 0.06);
}

.icon-btn:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
