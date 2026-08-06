<script setup>
import { ref, watch } from "vue";
import AppHeader from "./AppHeader.vue";
import LayoutSection from "./LayoutSection.vue";
import CardSizeSection from "./CardSizeSection.vue";
import SheetLayoutSection from "./SheetLayoutSection.vue";
import ActionButtons from "./ActionButtons.vue";
import AppFooter from "./AppFooter.vue";
import { useIsMobile } from "../composables/useIsMobile";

const isMobile = useIsMobile();
const menuOpen = ref(false);

watch(isMobile, (mobile) => {
  if (!mobile) menuOpen.value = false;
});

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function closeMenu() {
  menuOpen.value = false;
}
</script>

<template>
  <aside class="toolbar no-print">
    <div class="toolbar-top">
      <button
        v-if="isMobile"
        type="button"
        class="menu-trigger"
        :aria-label="$t('toolbar.settings')"
        :title="$t('toolbar.settings')"
        @click="toggleMenu"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linecap="round"
        >
          <line x1="3" y1="5" x2="17" y2="5" />
          <line x1="3" y1="10" x2="17" y2="10" />
          <line x1="3" y1="15" x2="17" y2="15" />
        </svg>
      </button>
      <AppHeader />
      <ActionButtons v-if="isMobile" compact />
    </div>

    <div v-if="!isMobile" class="sections">
      <LayoutSection />
      <CardSizeSection />
      <SheetLayoutSection />
    </div>

    <ActionButtons v-if="!isMobile" />
    <AppFooter v-if="!isMobile" />

    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="menuOpen" class="drawer-overlay no-print" @click.self="closeMenu">
          <div class="drawer">
            <div class="drawer-header">
              <p class="drawer-title">{{ $t("toolbar.settings") }}</p>
              <button
                type="button"
                class="drawer-close"
                :aria-label="$t('toolbar.close')"
                @click="closeMenu"
              >
                <svg viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 4l8 8m0-8l-8 8"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
            <div class="drawer-body">
              <LayoutSection />
              <CardSizeSection />
              <SheetLayoutSection />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </aside>
</template>

<style scoped>
.toolbar {
  width: 320px;
  flex: 0 0 320px;
  background: var(--panel-bg);
  border-right: 1px solid var(--panel-border);
  padding: 24px 20px 40px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.toolbar-top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.menu-trigger {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
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

.menu-trigger svg {
  width: 20px;
  height: 20px;
}

.menu-trigger:hover,
.menu-trigger:active {
  background: rgba(0, 0, 0, 0.06);
}

@media (max-width: 880px) {
  .toolbar-top {
    align-items: center;
  }

  .toolbar {
    width: 100%;
    flex: 0 0 auto;
    padding: 10px 16px;
    position: static;
    height: auto;
    overflow-y: visible;
    border-right: none;
    border-bottom: 1px solid var(--panel-border);
  }
}

.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  z-index: 1000;
}

.drawer {
  width: min(85vw, 320px);
  height: 100%;
  background: var(--panel-bg);
  padding: 20px;
  overflow-y: auto;
  box-shadow: 4px 0 18px rgba(0, 0, 0, 0.2);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--panel-border);
}

.drawer-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
}

.drawer-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: none;
  color: var(--text-muted);
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.drawer-close svg {
  width: 16px;
  height: 16px;
}

.drawer-close:hover,
.drawer-close:active {
  background: rgba(0, 0, 0, 0.06);
  color: var(--text);
}

.drawer-body {
  display: flex;
  flex-direction: column;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s ease;
}

.drawer-enter-active .drawer,
.drawer-leave-active .drawer {
  transition: transform 0.2s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .drawer,
.drawer-leave-to .drawer {
  transform: translateX(-100%);
}
</style>
