<script setup>
import { ref } from "vue";
import BaseButton from "./BaseButton.vue";

const props = defineProps({
  src: { type: String, required: true },
  aspectRatio: { type: Number, required: true },
});
const emit = defineEmits(["confirm", "cancel"]);

const MIN_CROP_PX = 40;
const WARP_GRID = 20; // mesh subdivisions per axis for the perspective warp

const imgEl = ref(null);
const displayW = ref(0);
const displayH = ref(0);
const scale = ref(1);
const mode = ref("rect"); // 'rect' | 'perspective'

const crop = ref({ x: 0, y: 0, w: 0, h: 0 });
// Perspective corner points, in stage (display) pixel coords: [tl, tr, bl, br]
const cornerPoints = ref([
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
]);

function onImgLoad() {
  const naturalW = imgEl.value.naturalWidth;
  const naturalH = imgEl.value.naturalHeight;
  // Cap the stage to whatever actually fits the viewport, not just a fixed
  // desktop size — otherwise the crop stage overflows on narrow phones.
  const maxStageW = Math.min(760, window.innerWidth - 64);
  const maxStageH = Math.min(560, window.innerHeight * 0.55);
  const s = Math.min(maxStageW / naturalW, maxStageH / naturalH, 1);
  scale.value = s;
  displayW.value = naturalW * s;
  displayH.value = naturalH * s;

  // Suggest a starting box shaped like the card — the user is free to
  // reshape it into any rectangle, or switch to Straighten mode.
  const ar = props.aspectRatio;
  let w, h;
  if (displayW.value / displayH.value > ar) {
    h = displayH.value;
    w = h * ar;
  } else {
    w = displayW.value;
    h = w / ar;
  }
  crop.value = {
    x: (displayW.value - w) / 2,
    y: (displayH.value - h) / 2,
    w,
    h,
  };
  syncPointsFromCrop();
}

function syncPointsFromCrop() {
  const { x, y, w, h } = crop.value;
  cornerPoints.value = [
    { x, y },
    { x: x + w, y },
    { x, y: y + h },
    { x: x + w, y: y + h },
  ];
}

function syncCropFromPoints() {
  const xs = cornerPoints.value.map((p) => p.x);
  const ys = cornerPoints.value.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  crop.value = { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

function setMode(next) {
  if (next === mode.value) return;
  if (next === "perspective") syncPointsFromCrop();
  else syncCropFromPoints();
  mode.value = next;
}

let dragMode = null; // 'move' | 'tl' | 'tr' | 'bl' | 'br' | 'point0'..'point3'
let startPointer = { x: 0, y: 0 };
let startCrop = { x: 0, y: 0, w: 0, h: 0 };
let startPoints = [];

function beginDrag(m, e) {
  dragMode = m;
  startPointer = { x: e.clientX, y: e.clientY };
  startCrop = { ...crop.value };
  startPoints = cornerPoints.value.map((p) => ({ ...p }));
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
}

function onMovePointerDown(e) {
  beginDrag("move", e);
}

function onHandlePointerDown(corner, e) {
  e.stopPropagation();
  beginDrag(corner, e);
}

function onPointHandlePointerDown(index, e) {
  e.stopPropagation();
  beginDrag("point" + index, e);
}

function onPointerMove(e) {
  const dx = e.clientX - startPointer.x;
  const dy = e.clientY - startPointer.y;

  if (dragMode === "move") {
    const x = Math.min(Math.max(startCrop.x + dx, 0), displayW.value - startCrop.w);
    const y = Math.min(Math.max(startCrop.y + dy, 0), displayH.value - startCrop.h);
    crop.value = { ...crop.value, x, y };
    return;
  }

  if (dragMode.startsWith("point")) {
    const idx = Number(dragMode.slice(5));
    const x = Math.min(Math.max(startPoints[idx].x + dx, 0), displayW.value);
    const y = Math.min(Math.max(startPoints[idx].y + dy, 0), displayH.value);
    const next = cornerPoints.value.slice();
    next[idx] = { x, y };
    cornerPoints.value = next;
    return;
  }

  // Free-form rectangle resize: each corner drags independently, width
  // and height are no longer locked to the card's aspect ratio.
  let { x, y, w, h } = startCrop;
  if (dragMode.includes("l")) {
    const newX = Math.min(Math.max(x + dx, 0), x + w - MIN_CROP_PX);
    w = x + w - newX;
    x = newX;
  } else if (dragMode.includes("r")) {
    w = Math.min(Math.max(w + dx, MIN_CROP_PX), displayW.value - x);
  }
  if (dragMode.includes("t")) {
    const newY = Math.min(Math.max(y + dy, 0), y + h - MIN_CROP_PX);
    h = y + h - newY;
    y = newY;
  } else if (dragMode.includes("b")) {
    h = Math.min(Math.max(h + dy, MIN_CROP_PX), displayH.value - y);
  }
  crop.value = { x, y, w, h };
}

function onPointerUp() {
  dragMode = null;
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Closed-form affine transform mapping 3 source points to 3 destination
// points (exact for a triangle) — used to piecewise-approximate the
// perspective warp, since Canvas 2D only supports affine transforms.
function solveAffine(s0, s1, s2, d0, d1, d2) {
  const denom = s0.x * (s1.y - s2.y) + s1.x * (s2.y - s0.y) + s2.x * (s0.y - s1.y);
  if (!denom) return null;
  const solveFor = (v0, v1, v2) => [
    (v0 * (s1.y - s2.y) + v1 * (s2.y - s0.y) + v2 * (s0.y - s1.y)) / denom,
    (v0 * (s2.x - s1.x) + v1 * (s0.x - s2.x) + v2 * (s1.x - s0.x)) / denom,
    (v0 * (s1.x * s2.y - s2.x * s1.y) +
      v1 * (s2.x * s0.y - s0.x * s2.y) +
      v2 * (s0.x * s1.y - s1.x * s0.y)) /
      denom,
  ];
  const [a, c, e] = solveFor(d0.x, d1.x, d2.x);
  const [b, d, f] = solveFor(d0.y, d1.y, d2.y);
  return { a, b, c, d, e, f };
}

function drawTriangle(ctx, img, s0, s1, s2, d0, d1, d2) {
  const m = solveAffine(s0, s1, s2, d0, d1, d2);
  if (!m) return;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(d0.x, d0.y);
  ctx.lineTo(d1.x, d1.y);
  ctx.lineTo(d2.x, d2.y);
  ctx.closePath();
  ctx.clip();
  ctx.transform(m.a, m.b, m.c, m.d, m.e, m.f);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

function applyRectCrop() {
  const sx = crop.value.x / scale.value;
  const sy = crop.value.y / scale.value;
  const sw = crop.value.w / scale.value;
  const sh = crop.value.h / scale.value;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(sw);
  canvas.height = Math.round(sh);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(imgEl.value, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  emit("confirm", canvas.toDataURL("image/png"));
}

function applyPerspectiveCrop() {
  const [tl, tr, bl, br] = cornerPoints.value.map((p) => ({
    x: p.x / scale.value,
    y: p.y / scale.value,
  }));

  const outW = Math.max(1, Math.round(Math.max(dist(tl, tr), dist(bl, br))));
  const outH = Math.max(1, Math.round(Math.max(dist(tl, bl), dist(tr, br))));

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");

  const srcPoint = (u, v) => ({
    x: (1 - u) * (1 - v) * tl.x + u * (1 - v) * tr.x + (1 - u) * v * bl.x + u * v * br.x,
    y: (1 - u) * (1 - v) * tl.y + u * (1 - v) * tr.y + (1 - u) * v * bl.y + u * v * br.y,
  });

  const cellW = outW / WARP_GRID;
  const cellH = outH / WARP_GRID;

  for (let gy = 0; gy < WARP_GRID; gy++) {
    for (let gx = 0; gx < WARP_GRID; gx++) {
      const u0 = gx / WARP_GRID;
      const u1 = (gx + 1) / WARP_GRID;
      const v0 = gy / WARP_GRID;
      const v1 = (gy + 1) / WARP_GRID;

      const dTL = { x: gx * cellW, y: gy * cellH };
      const dTR = { x: (gx + 1) * cellW, y: gy * cellH };
      const dBL = { x: gx * cellW, y: (gy + 1) * cellH };
      const dBR = { x: (gx + 1) * cellW, y: (gy + 1) * cellH };

      const sTL = srcPoint(u0, v0);
      const sTR = srcPoint(u1, v0);
      const sBL = srcPoint(u0, v1);
      const sBR = srcPoint(u1, v1);

      drawTriangle(ctx, imgEl.value, sTL, sTR, sBL, dTL, dTR, dBL);
      drawTriangle(ctx, imgEl.value, sTR, sBR, sBL, dTR, dBR, dBL);
    }
  }

  emit("confirm", canvas.toDataURL("image/png"));
}

function applyCrop() {
  if (mode.value === "perspective") applyPerspectiveCrop();
  else applyRectCrop();
}

function cancel() {
  emit("cancel");
}
</script>

<template>
  <div class="overlay" @click.self="cancel">
    <div class="modal">
      <div class="header-row">
        <p class="title">{{ $t("crop.title") }}</p>
        <div class="mode-toggle">
          <button type="button" :class="{ active: mode === 'rect' }" @click="setMode('rect')">
            {{ $t("crop.rectangle") }}
          </button>
          <button
            type="button"
            :class="{ active: mode === 'perspective' }"
            @click="setMode('perspective')"
          >
            {{ $t("crop.straighten") }}
          </button>
        </div>
      </div>
      <p v-if="mode === 'rect'" class="hint">
        {{ $t("crop.rectHint") }}
      </p>
      <p v-else class="hint">
        {{ $t("crop.perspectiveHint") }}
      </p>

      <div class="stage" :style="{ width: displayW + 'px', height: displayH + 'px' }">
        <img
          ref="imgEl"
          :src="src"
          class="stage-img"
          :style="{ width: displayW + 'px', height: displayH + 'px' }"
          @load="onImgLoad"
        />

        <template v-if="mode === 'rect' && displayW">
          <svg class="quad-overlay" :width="displayW" :height="displayH">
            <path
              :d="`M0,0 H${displayW} V${displayH} H0 Z
                   M${crop.x},${crop.y} H${crop.x + crop.w} V${crop.y + crop.h} H${crop.x} Z`"
              fill="rgba(0,0,0,0.55)"
              fill-rule="evenodd"
            />
          </svg>
          <div
            class="crop-box"
            :style="{
              left: crop.x + 'px',
              top: crop.y + 'px',
              width: crop.w + 'px',
              height: crop.h + 'px',
            }"
            @pointerdown="onMovePointerDown"
          >
            <div class="handle tl" @pointerdown="onHandlePointerDown('tl', $event)"></div>
            <div class="handle tr" @pointerdown="onHandlePointerDown('tr', $event)"></div>
            <div class="handle bl" @pointerdown="onHandlePointerDown('bl', $event)"></div>
            <div class="handle br" @pointerdown="onHandlePointerDown('br', $event)"></div>
          </div>
        </template>

        <template v-else-if="displayW">
          <svg class="quad-overlay" :width="displayW" :height="displayH">
            <path
              :d="`M0,0 H${displayW} V${displayH} H0 Z
                   M${cornerPoints[0].x},${cornerPoints[0].y}
                   L${cornerPoints[1].x},${cornerPoints[1].y}
                   L${cornerPoints[3].x},${cornerPoints[3].y}
                   L${cornerPoints[2].x},${cornerPoints[2].y} Z`"
              fill="rgba(0,0,0,0.55)"
              fill-rule="evenodd"
            />
            <polygon
              :points="`${cornerPoints[0].x},${cornerPoints[0].y} ${cornerPoints[1].x},${cornerPoints[1].y} ${cornerPoints[3].x},${cornerPoints[3].y} ${cornerPoints[2].x},${cornerPoints[2].y}`"
              fill="none"
              stroke="#fff"
              stroke-width="1"
            />
          </svg>
          <div
            v-for="(p, i) in cornerPoints"
            :key="i"
            class="handle point"
            :style="{ left: p.x + 'px', top: p.y + 'px' }"
            @pointerdown="onPointHandlePointerDown(i, $event)"
          ></div>
        </template>
      </div>

      <div class="actions">
        <BaseButton @click="cancel">{{ $t("crop.cancel") }}</BaseButton>
        <BaseButton @click="applyCrop">{{ $t("crop.apply") }}</BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  max-width: 92vw;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

.title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1c1e21;
}

.mode-toggle {
  display: flex;
  border: 1px solid #e2e4e9;
  border-radius: 6px;
  overflow: hidden;
}

.mode-toggle button {
  padding: 5px 12px;
  font-size: 12px;
  border: none;
  background: #fff;
  color: #1c1e21;
  cursor: pointer;
}

.mode-toggle button.active {
  background: var(--accent);
  color: #fff;
}

.hint {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
  align-self: flex-start;
}

.stage {
  position: relative;
  background: #111;
  touch-action: none;
  user-select: none;
}

.stage-img {
  display: block;
  pointer-events: none;
}

.crop-box {
  position: absolute;
  border: 1px solid #fff;
  cursor: move;
  touch-action: none;
}

.quad-overlay {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.handle {
  position: absolute;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
}

.handle::after {
  content: "";
  width: 14px;
  height: 14px;
  background: var(--accent);
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
}

.handle.point {
  transform: translate(-50%, -50%);
  cursor: grab;
}

.handle.tl {
  left: -14px;
  top: -14px;
  cursor: nwse-resize;
}
.handle.tr {
  right: -14px;
  top: -14px;
  cursor: nesw-resize;
}
.handle.bl {
  left: -14px;
  bottom: -14px;
  cursor: nesw-resize;
}
.handle.br {
  right: -14px;
  bottom: -14px;
  cursor: nwse-resize;
}

@media (pointer: coarse) {
  .handle {
    width: 44px;
    height: 44px;
  }

  .handle::after {
    width: 16px;
    height: 16px;
  }

  .handle.tl {
    left: -22px;
    top: -22px;
  }
  .handle.tr {
    right: -22px;
    top: -22px;
  }
  .handle.bl {
    left: -22px;
    bottom: -22px;
  }
  .handle.br {
    right: -22px;
    bottom: -22px;
  }
}

.actions {
  display: flex;
  gap: 10px;
  align-self: flex-end;
}
</style>
