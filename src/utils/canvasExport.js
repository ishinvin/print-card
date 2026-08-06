export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export function drawCover(ctx, img, x, y, w, h) {
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

export function drawCropMarks(ctx, x, y, w, h, gapPx, lenPx, thicknessPx) {
  ctx.fillStyle = "#000";
  const t = thicknessPx;
  // top-left
  ctx.fillRect(x - gapPx - lenPx, y - t / 2, lenPx, t);
  ctx.fillRect(x - t / 2, y - gapPx - lenPx, t, lenPx);
  // top-right
  ctx.fillRect(x + w + gapPx, y - t / 2, lenPx, t);
  ctx.fillRect(x + w - t / 2, y - gapPx - lenPx, t, lenPx);
  // bottom-left
  ctx.fillRect(x - gapPx - lenPx, y + h - t / 2, lenPx, t);
  ctx.fillRect(x - t / 2, y + h + gapPx, t, lenPx);
  // bottom-right
  ctx.fillRect(x + w + gapPx, y + h - t / 2, lenPx, t);
  ctx.fillRect(x + w - t / 2, y + h + gapPx, t, lenPx);
}
