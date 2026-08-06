import { ref, reactive, computed, watch } from "vue";

const DEFAULT_MARGIN_MM = 25.4; // Office document convention (1 inch)

export function useCardSettings() {
  const cardWidthMm = ref(85.6);
  const cardHeightMm = ref(53.98);
  const marginMm = ref(DEFAULT_MARGIN_MM);
  const gapMm = ref(8);
  const radiusMm = ref(3.18);
  const cropMarks = ref(false);
  const pairArrangement = ref("row"); // 'row' | 'column'
  const pairAlign = ref("top"); // 'top' | 'center' | 'bottom'

  watch(pairAlign, () => {
    marginMm.value = pairAlign.value === "center" ? 0 : DEFAULT_MARGIN_MM;
  });

  const cropAspectRatio = computed(() => cardWidthMm.value / cardHeightMm.value);

  const pairAlignItems = computed(
    () => ({ top: "flex-start", center: "center", bottom: "flex-end" })[pairAlign.value],
  );

  // marginMm is reset to 0 for center alignment (see watch above), so it
  // already carries the right value for both edges here.
  const pairPadding = computed(() => ({
    paddingTop: marginMm.value + "mm",
    paddingBottom: marginMm.value + "mm",
  }));

  function reset() {
    cardWidthMm.value = 85.6;
    cardHeightMm.value = 53.98;
    gapMm.value = 8;
    radiusMm.value = 3.18;
    cropMarks.value = false;
    pairArrangement.value = "row";
    pairAlign.value = "top";
    marginMm.value = DEFAULT_MARGIN_MM;
  }

  return reactive({
    cardWidthMm,
    cardHeightMm,
    marginMm,
    gapMm,
    radiusMm,
    cropMarks,
    pairArrangement,
    pairAlign,
    cropAspectRatio,
    pairAlignItems,
    pairPadding,
    reset,
  });
}
