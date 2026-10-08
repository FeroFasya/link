<template>
  <div
    ref="floatingEl"
    class="floating-time-machine"
    :class="{ dragging: isDragging }"
    :style="buttonStyle"
    role="button"
    aria-label="Buka Mesin Waktu"
    title="Mesin Waktu (Klik untuk buka / Tahan untuk geser)"
    @mousedown="onPointerDown"
    @touchstart="onPointerDown"
  >
    <div class="time-machine-pulse"></div>
    <svg class="time-machine-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="13" r="8"></circle>
      <polyline points="12 9 12 13 15 14"></polyline>
      <line x1="12" y1="5" x2="12" y2="2"></line>
      <line x1="10" y1="2" x2="14" y2="2"></line>
      <circle cx="12" cy="13" r="1" fill="currentColor"></circle>
    </svg>
    <span v-if="badgeCount > 0" class="time-badge-counter">
      {{ badgeCount > 99 ? '99+' : badgeCount }}
    </span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  badgeCount: {
    type: Number,
    default: 0
  }
})

const router = useRouter()
const floatingEl = ref(null)
const isDragging = ref(false)

const position = ref({
  x: null,
  y: null
})

const buttonStyle = computed(() => {
  if (position.value.x !== null && position.value.y !== null) {
    return {
      left: `${position.value.x}px`,
      top: `${position.value.y}px`,
      right: 'auto',
      bottom: 'auto'
    }
  }
  return {}
})

const onPointerDown = (e) => {
  if (e.button && e.button !== 0) return

  let dragDistance = 0
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY

  const startX = clientX
  const startY = clientY

  const rect = floatingEl.value.getBoundingClientRect()
  const initialLeft = rect.left
  const initialTop = rect.top

  isDragging.value = true

  const onPointerMove = (moveEvent) => {
    const curX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX
    const curY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY
    const dx = curX - startX
    const dy = curY - startY
    dragDistance = Math.hypot(dx, dy)

    if (dragDistance > 4) {
      if (moveEvent.cancelable) moveEvent.preventDefault()
      let newX = initialLeft + dx
      let newY = initialTop + dy
      const maxX = window.innerWidth - rect.width - 10
      const maxY = window.innerHeight - rect.height - 10
      newX = Math.max(10, Math.min(newX, maxX))
      newY = Math.max(10, Math.min(newY, maxY))

      position.value = { x: newX, y: newY }
    }
  }

  const onPointerUp = () => {
    window.removeEventListener('mousemove', onPointerMove)
    window.removeEventListener('mouseup', onPointerUp)
    window.removeEventListener('touchmove', onPointerMove)
    window.removeEventListener('touchend', onPointerUp)

    isDragging.value = false

    if (dragDistance <= 6) {
      router.push('/mesin-waktu')
    }
  }

  window.addEventListener('mousemove', onPointerMove, { passive: false })
  window.addEventListener('mouseup', onPointerUp)
  window.addEventListener('touchmove', onPointerMove, { passive: false })
  window.addEventListener('touchend', onPointerUp)
}
</script>

<style scoped>
.floating-time-machine {
  position: fixed;
  right: 24px;
  bottom: 34px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #212328;
  box-shadow: 6px 6px 14px #111215, -6px -6px 14px #2b2e35;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a4a9b8;
  cursor: grab;
  z-index: 95;
  touch-action: none;
  user-select: none;
  transition: transform 0.15s ease, box-shadow 0.2s ease, color 0.2s ease;
}

.floating-time-machine:hover {
  color: #ffffff;
  box-shadow: 8px 8px 18px #0f1013, -8px -8px 18px #32353c, 0 0 16px rgba(255, 255, 255, 0.08);
}

.floating-time-machine.dragging {
  cursor: grabbing;
  transform: scale(1.08);
  box-shadow: 12px 12px 24px #0d0e10, -12px -12px 24px #353842;
  transition: none;
}

.floating-time-machine svg {
  width: 24px;
  height: 24px;
  pointer-events: none;
}

.time-machine-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px dashed rgba(255, 255, 255, 0.15);
  animation: rotatePortalRing 14s linear infinite;
  pointer-events: none;
}

@keyframes rotatePortalRing {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.time-badge-counter {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 999px;
  background: #ea4335;
  color: #ffffff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(234, 67, 53, 0.5);
}
</style>
