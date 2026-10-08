<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="neu-modal-backdrop active"
      role="dialog"
      aria-modal="true"
      @click.self="handleClose"
    >
      <div class="neu-modal-card">
        <button
          class="modal-close-btn"
          aria-label="Tutup"
          type="button"
          @click="handleClose"
        >
          &times;
        </button>

        <h3 class="modal-title">nama kamu siapa?</h3>
        <p class="modal-desc">Biar Fero tahu siapa yang ninggalin jejak waktu ini</p>

        <input
          ref="nameInputRef"
          v-model="visitorName"
          type="text"
          class="neu-input"
          placeholder="Ketik namamu..."
          maxlength="30"
          autocomplete="off"
          @keydown.enter.prevent="handleConfirm"
          @keydown.esc="handleClose"
        />

        <div class="modal-actions">
          <button
            type="button"
            class="neu-modal-btn btn-secondary"
            @click="handleAnonymous"
          >
            anonimus aja 🕵️
          </button>
          <button
            type="button"
            class="neu-modal-btn btn-primary"
            @click="handleConfirm"
          >
            kirim jejak ✨
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'confirm'])

const visitorName = ref('')
const nameInputRef = ref(null)

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      visitorName.value = ''
      nextTick(() => {
        nameInputRef.value?.focus()
      })
    }
  }
)

const handleClose = () => {
  emit('close')
}

const handleAnonymous = () => {
  emit('confirm', 'Anonim 🕵️')
}

const handleConfirm = () => {
  const name = visitorName.value.trim() || 'Anonim 🕵️'
  emit('confirm', name)
}
</script>

<style scoped>
.neu-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(14, 15, 18, 0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 999;
  opacity: 1;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.neu-modal-card {
  width: 100%;
  max-width: 340px;
  background: #1e1f23;
  border-radius: 28px;
  box-shadow: 14px 14px 32px #101114, -14px -14px 32px #2c2e34;
  padding: 28px 24px 22px;
  position: relative;
  text-align: center;
  transform: scale(1) translateY(0);
  animation: modalEnter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalEnter {
  from {
    transform: scale(0.9) translateY(12px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.modal-close-btn {
  position: absolute;
  top: 14px;
  right: 18px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
}

.modal-close-btn:hover {
  color: #ffffff;
  transform: scale(1.15);
}

.modal-title {
  font-family: 'Pixelify Sans', cursive, sans-serif;
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
  letter-spacing: 0.3px;
}

.modal-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 20px;
  line-height: 1.4;
}

.neu-input {
  width: 100%;
  background: #1e1f23;
  border: none;
  outline: none;
  border-radius: 999px;
  box-shadow: var(--neu-pressed-md);
  padding: 13px 20px;
  color: var(--text-primary);
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 20px;
  transition: box-shadow 0.25s ease;
}

.neu-input::placeholder {
  color: #5d616c;
}

.neu-input:focus {
  box-shadow: inset 4px 4px 8px #101114, inset -4px -4px 8px #303138;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.neu-modal-btn {
  flex: 1;
  padding: 12px 14px;
  border-radius: 999px;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  white-space: nowrap;
}

.neu-modal-btn.btn-secondary {
  background: #1e1f23;
  color: var(--text-secondary);
  box-shadow: var(--neu-flat-sm);
}

.neu-modal-btn.btn-secondary:hover {
  color: var(--text-hover);
  transform: translateY(-2px);
  box-shadow: var(--neu-hover-md);
}

.neu-modal-btn.btn-primary {
  background: #1e1f23;
  color: #ffffff;
  box-shadow: var(--neu-flat-sm);
}

.neu-modal-btn.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--neu-hover-md);
  color: #ffffff;
}

.neu-modal-btn:active {
  transform: translateY(1px);
  box-shadow: var(--neu-pressed-sm);
}
</style>
