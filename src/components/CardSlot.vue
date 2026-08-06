<script setup>
import { ref } from "vue";
import CloseIcon from "./icons/CloseIcon.vue";

defineProps({
  src: { type: String, default: "" },
  widthMm: { type: Number, required: true },
  heightMm: { type: Number, required: true },
  radiusMm: { type: Number, default: 3.18 },
  cropMarks: { type: Boolean, default: true },
  label: { type: String, default: "" },
});
const emit = defineEmits(["update:src", "select-file"]);

const fileInput = ref(null);
const dragging = ref(false);

function pickFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  emit("select-file", file);
}

function onDrop(e) {
  dragging.value = false;
  pickFile(e.dataTransfer?.files?.[0]);
}

function onChange(e) {
  pickFile(e.target.files?.[0]);
  e.target.value = "";
}

function openPicker() {
  fileInput.value?.click();
}

function clear(e) {
  e.stopPropagation();
  emit("update:src", "");
}
</script>

<template>
  <div
    class="slot"
    :style="{
      width: widthMm + 'mm',
      height: heightMm + 'mm',
      '--mark-len': '2.5mm',
      '--mark-gap': '1mm',
    }"
  >
    <div
      class="card"
      :class="{ dragging }"
      :style="{ borderRadius: radiusMm + 'mm' }"
      @click="openPicker"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden-input no-print"
        @change="onChange"
      />

      <img v-if="src" :src="src" />
      <div v-else class="placeholder">
        <span>{{ label }}</span>
        <span class="dz-hint">{{ $t("card.tapToBrowse") }}</span>
      </div>

      <div v-if="dragging" class="drop-overlay">
        <span>{{ src ? $t("card.dropToReplace") : $t("card.dropImageHere") }}</span>
      </div>

      <button
        v-if="src"
        type="button"
        class="clear-btn no-print"
        :title="$t('card.clear')"
        @click="clear"
      >
        <CloseIcon />
      </button>
    </div>

    <template v-if="cropMarks">
      <span class="mark h tl"></span>
      <span class="mark v tl"></span>
      <span class="mark h tr"></span>
      <span class="mark v tr"></span>
      <span class="mark h bl"></span>
      <span class="mark v bl"></span>
      <span class="mark h br"></span>
      <span class="mark v br"></span>
    </template>
  </div>
</template>

<style scoped>
.slot {
  position: relative;
}

.card {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fff;
  border: 0.5mm solid #9aa0ab;
  cursor: pointer;
}

.card.dragging {
  border: 0.4mm dashed var(--accent);
  background: rgba(18, 100, 33, 0.08);
}

.card img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.drop-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3mm;
  background: rgba(18, 100, 33, 0.75);
  color: #fff;
  font-size: 3mm;
  font-weight: 600;
  text-align: center;
  pointer-events: none;
}

.hidden-input {
  display: none;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2mm;
  font-size: 3.2mm;
  font-weight: 700;
  color: #6b7280;
  letter-spacing: 0.3mm;
  text-transform: uppercase;
  text-align: center;
}

.dz-hint {
  font-size: 2.4mm;
  font-weight: 500;
  color: #b7bac2;
  text-transform: none;
  letter-spacing: normal;
}

.clear-btn {
  position: absolute;
  top: 2mm;
  right: 2mm;
  width: 8mm;
  height: 8mm;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: #fff;
  filter: drop-shadow(0 0 1.2px rgba(0, 0, 0, 0.9)) drop-shadow(0 0.3mm 0.4mm rgba(0, 0, 0, 0.5));
  cursor: pointer;
  transition: transform 0.1s ease;
}

.clear-btn svg {
  width: 6.5mm;
  height: 6.5mm;
}

.clear-btn:hover {
  transform: scale(1.15);
}

.mark {
  position: absolute;
  background: #000;
}

.mark.h {
  width: var(--mark-len);
  height: 0.15mm;
}
.mark.v {
  width: 0.15mm;
  height: var(--mark-len);
}

.mark.tl.h {
  top: 0;
  left: calc(-1 * (var(--mark-gap) + var(--mark-len)));
}
.mark.tl.v {
  left: 0;
  top: calc(-1 * (var(--mark-gap) + var(--mark-len)));
}

.mark.tr.h {
  top: 0;
  right: calc(-1 * (var(--mark-gap) + var(--mark-len)));
}
.mark.tr.v {
  right: 0;
  top: calc(-1 * (var(--mark-gap) + var(--mark-len)));
}

.mark.bl.h {
  bottom: 0;
  left: calc(-1 * (var(--mark-gap) + var(--mark-len)));
}
.mark.bl.v {
  left: 0;
  bottom: calc(-1 * (var(--mark-gap) + var(--mark-len)));
}

.mark.br.h {
  bottom: 0;
  right: calc(-1 * (var(--mark-gap) + var(--mark-len)));
}
.mark.br.v {
  right: 0;
  bottom: calc(-1 * (var(--mark-gap) + var(--mark-len)));
}

@media print {
  .placeholder {
    color: #fff;
  }
  .card {
    border-color: #fff;
    cursor: default;
  }
}
</style>
