// Pure positioning math for the front/back card pair on the page, in mm.
// Mirrors the on-screen CSS flex layout driven by useCardSettings'
// pairAlignItems/pairPadding — kept here so Canvas export (which can't use
// CSS layout) has one place to derive the same positions from.
export function computeCardPositions(settings, pageWidthMm, pageHeightMm) {
  const cardW = settings.cardWidthMm;
  const cardH = settings.cardHeightMm;
  const gap = settings.gapMm;
  const isRow = settings.pairArrangement === "row";

  const pairW = isRow ? cardW * 2 + gap : cardW;
  const pairH = isRow ? cardH : cardH * 2 + gap;

  const pairX = (pageWidthMm - pairW) / 2;
  let pairY;
  if (settings.pairAlign === "top") pairY = settings.marginMm;
  else if (settings.pairAlign === "bottom") pairY = pageHeightMm - settings.marginMm - pairH;
  else pairY = (pageHeightMm - pairH) / 2;

  return isRow
    ? [
        { x: pairX, y: pairY },
        { x: pairX + cardW + gap, y: pairY },
      ]
    : [
        { x: pairX, y: pairY },
        { x: pairX, y: pairY + cardH + gap },
      ];
}
