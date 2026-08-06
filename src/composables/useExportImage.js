import { ref } from "vue";
import { loadImage, roundRectPath, drawCover, drawCropMarks } from "../utils/canvasExport";
import { computeCardPositions } from "../utils/cardLayout";

const EXPORT_DPI = 300;
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;

// Renders the A4 page as a JPEG for preview and download, mirroring the
// print CSS layout math in useCardSettings with plain Canvas 2D drawing.
export function useExportImage(settings, images) {
  const generating = ref(false);
  const previewUrl = ref("");

  async function renderPageCanvas() {
    const mm = (v) => (v * EXPORT_DPI) / 25.4;
    const pageW = mm(PAGE_WIDTH_MM);
    const pageH = mm(PAGE_HEIGHT_MM);

    const canvas = document.createElement("canvas");
    canvas.width = pageW;
    canvas.height = pageH;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pageW, pageH);

    const cardW = mm(settings.cardWidthMm);
    const cardH = mm(settings.cardHeightMm);
    const radius = mm(settings.radiusMm);

    const positions = computeCardPositions(settings, PAGE_WIDTH_MM, PAGE_HEIGHT_MM).map((p) => ({
      x: mm(p.x),
      y: mm(p.y),
    }));

    const sources = [images.frontImage, images.backImage];

    for (let i = 0; i < 2; i++) {
      const { x, y } = positions[i];
      if (sources[i]) {
        const img = await loadImage(sources[i]);
        ctx.save();
        roundRectPath(ctx, x, y, cardW, cardH, radius);
        ctx.clip();
        drawCover(ctx, img, x, y, cardW, cardH);
        ctx.restore();
      }
      if (settings.cropMarks) {
        drawCropMarks(ctx, x, y, cardW, cardH, mm(1), mm(2.5), mm(0.15));
      }
    }

    return canvas;
  }

  async function openPreview() {
    if (generating.value) return;
    generating.value = true;
    try {
      const canvas = await renderPageCanvas();
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
      // Revoke the previous blob (if any) only now, not on close — closing
      // triggers the modal's leave transition, and revoking immediately
      // would break the <img> mid-fade.
      if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
      previewUrl.value = URL.createObjectURL(blob);
    } finally {
      generating.value = false;
    }
  }

  function confirmDownload() {
    if (!previewUrl.value) return;
    const link = document.createElement("a");
    link.href = previewUrl.value;
    link.download = "id-card-a4.jpg";
    link.click();
    previewUrl.value = "";
  }

  function closePreview() {
    previewUrl.value = "";
  }

  return { generating, previewUrl, openPreview, confirmDownload, closePreview };
}
