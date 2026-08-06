import { ref, reactive } from "vue";

export function useCardImages() {
  const frontImage = ref("");
  const backImage = ref("");
  const cropTarget = ref(null); // 'front' | 'back' | null
  const cropSrc = ref("");

  function onSelectFile(target, file) {
    const reader = new FileReader();
    reader.onload = () => {
      cropSrc.value = String(reader.result);
      cropTarget.value = target;
    };
    reader.readAsDataURL(file);
  }

  function onCropConfirm(dataUrl) {
    if (cropTarget.value === "front") frontImage.value = dataUrl;
    else if (cropTarget.value === "back") backImage.value = dataUrl;
    cropTarget.value = null;
    cropSrc.value = "";
  }

  function onCropCancel() {
    cropTarget.value = null;
    cropSrc.value = "";
  }

  function reset() {
    frontImage.value = "";
    backImage.value = "";
  }

  return reactive({
    frontImage,
    backImage,
    cropTarget,
    cropSrc,
    onSelectFile,
    onCropConfirm,
    onCropCancel,
    reset,
  });
}
