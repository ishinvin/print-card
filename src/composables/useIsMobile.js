import { ref, onMounted, onBeforeUnmount } from "vue";

export const MOBILE_BREAKPOINT = 880;

export function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const isMobile = ref(window.innerWidth <= breakpoint);

  function update() {
    isMobile.value = window.innerWidth <= breakpoint;
  }

  onMounted(() => window.addEventListener("resize", update));
  onBeforeUnmount(() => window.removeEventListener("resize", update));

  return isMobile;
}
