<script setup>
import BaseButton from "./BaseButton.vue";

defineProps({
  src: { type: String, required: true },
});
const emit = defineEmits(["confirm", "cancel"]);
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade" appear>
      <div class="overlay" @click.self="emit('cancel')">
        <div class="modal">
          <p class="title">Save as Image</p>
          <div class="page-frame">
            <img :src="src" alt="A4 page preview" />
          </div>
          <div class="actions">
            <BaseButton @click="emit('cancel')">Cancel</BaseButton>
            <BaseButton @click="emit('confirm')">Save</BaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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
  gap: 14px;
  max-width: 92vw;
}

.title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1c1e21;
  align-self: flex-start;
}

.page-frame {
  aspect-ratio: 210 / 297;
  width: min(80vw, 440px);
  max-height: 70vh;
  background: #fff;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.15);
}

.page-frame img {
  width: 100%;
  height: 100%;
  display: block;
}

.actions {
  display: flex;
  gap: 10px;
  align-self: flex-end;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.18s ease;
}

.modal-fade-enter-active .modal,
.modal-fade-leave-active .modal {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal,
.modal-fade-leave-to .modal {
  opacity: 0;
  transform: scale(0.96) translateY(6px);
}
</style>
