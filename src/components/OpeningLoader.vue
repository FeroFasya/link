<script setup>
import { ref, onMounted } from 'vue'

const isVisible = ref(false)
const isFading = ref(false)

onMounted(() => {
  const hasVisited = sessionStorage.getItem('fero_visited_session')
  if (!hasVisited) {
    isVisible.value = true
    sessionStorage.setItem('fero_visited_session', 'true')
    
    // Snappy 750ms opening duration
    setTimeout(() => {
      isFading.value = true
      setTimeout(() => {
        isVisible.value = false
      }, 400)
    }, 750)
  }
})
</script>

<template>
  <div v-if="isVisible" :class="['opening-loader', { 'hidden': isFading }]">
    <div class="loader-content">
      <img src="/opening.gif" alt="loading..." class="loader-gif" />
      <div class="loader-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.opening-loader {
  position: fixed;
  inset: 0;
  background-color: var(--bg-color, #1e1f23);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s ease;
  pointer-events: auto;
}

.opening-loader.hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transform: scale(1);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.opening-loader.hidden .loader-content {
  transform: scale(0.9);
}

.loader-gif {
  width: 140px;
  height: auto;
  user-select: none;
  pointer-events: none;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.35));
}

.loader-dots {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
}

.loader-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #626674;
  animation: dotBlink 1.2s infinite ease-in-out both;
}

.loader-dots span:nth-child(1) { animation-delay: -0.32s; }
.loader-dots span:nth-child(2) { animation-delay: -0.16s; }
.loader-dots span:nth-child(3) { animation-delay: 0s; }

@keyframes dotBlink {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.3;
  }
  40% {
    transform: scale(1.15);
    opacity: 1;
    background: #ffffff;
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  }
}
</style>
