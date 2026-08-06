<script setup>
import { inject } from "vue";
import { useExportImage } from "../composables/useExportImage";
import SavePreviewModal from "./SavePreviewModal.vue";
import BaseButton from "./BaseButton.vue";
import PrintIcon from "./icons/PrintIcon.vue";
import SaveIcon from "./icons/SaveIcon.vue";
import ResetIcon from "./icons/ResetIcon.vue";

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
    <button
      type="button"
      class="icon-btn"
      :title="$t('actions.print')"
      :aria-label="$t('actions.print')"
      @click="doPrint"
    >
      <PrintIcon />
    </button>

    <button
      type="button"
      class="icon-btn"
      :title="$t('actions.saveImage')"
      :aria-label="$t('actions.saveImage')"
      :disabled="generating"
      @click="openPreview"
    >
      <SaveIcon />
    </button>

    <button
      type="button"
      class="icon-btn"
      :title="$t('actions.reset')"
      :aria-label="$t('actions.reset')"
      @click="resetAll"
    >
      <ResetIcon />
    </button>
  </div>

  <div v-else class="action-row">
    <BaseButton @click="doPrint">
      <PrintIcon />
      <span>{{ $t("actions.print") }}</span>
    </BaseButton>

    <BaseButton :disabled="generating" @click="openPreview">
      <SaveIcon />
      <span>{{ generating ? $t("actions.preparing") : $t("actions.save") }}</span>
    </BaseButton>

    <BaseButton @click="resetAll">
      <ResetIcon />
      <span>{{ $t("actions.reset") }}</span>
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
