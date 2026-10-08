<template>
  <section class="comment-section">
    <div class="terminal-comment-box" :class="{ shake: isShaking }">
      <span class="terminal-prompt">$</span>
      <input
        v-model="commentText"
        type="text"
        class="terminal-input"
        placeholder="mau bilang apa ke fero....."
        maxlength="280"
        autocomplete="off"
        @keydown.enter.prevent="handleSend"
      />
      <button
        class="terminal-send-btn"
        aria-label="Kirim Pesan"
        title="Kirim"
        type="button"
        @click="handleSend"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit-comment'])

const commentText = ref('')
const isShaking = ref(false)

const handleSend = () => {
  const text = commentText.value.trim()
  if (!text) {
    isShaking.value = true
    setTimeout(() => {
      isShaking.value = false
    }, 400)
    return
  }

  emit('submit-comment', text)
}

const clearInput = () => {
  commentText.value = ''
}

defineExpose({
  clearInput
})
</script>

<style scoped>
.comment-section {
  width: 100%;
  margin-top: 14px;
  padding: 0 4px;
}

.terminal-comment-box {
  display: flex;
  align-items: center;
  position: relative;
  background: transparent;
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.2);
  padding: 8px 4px 10px 4px;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.terminal-comment-box:focus-within {
  border-bottom-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
}

.terminal-prompt {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 0.95rem;
  font-weight: 600;
  color: #616674;
  margin-right: 10px;
  user-select: none;
  transition: color 0.25s ease;
}

.terminal-comment-box:focus-within .terminal-prompt {
  color: #ffffff;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 0.88rem;
  letter-spacing: 0.2px;
}

.terminal-input::placeholder {
  color: #555964;
  font-weight: 400;
}

.terminal-send-btn {
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  color: #636875;
  padding: 4px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.terminal-send-btn svg {
  width: 18px;
  height: 18px;
  transition: transform 0.2s ease, stroke 0.2s ease;
}

.terminal-send-btn:hover {
  color: #ffffff;
}

.terminal-send-btn:hover svg {
  transform: translateX(4px);
  stroke: #ffffff;
}

.terminal-send-btn:active svg {
  transform: translateX(2px) scale(0.95);
}

.shake {
  animation: shakeBox 0.35s ease-in-out;
}

@keyframes shakeBox {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}
</style>
