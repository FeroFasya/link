<template>
  <component
    :is="isRouterLink ? 'RouterLink' : 'a'"
    :[linkProp]="linkTarget"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    class="neu-link-btn"
    :class="{
      'has-crescent-thumb': variant === 'crescent',
      'pressed': isPressed
    }"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
    @touchstart.passive="handleMouseDown"
    @touchend.passive="handleMouseUp"
  >
    <!-- Laser Left Watermark (Google Developers Chevrons < > Ramping & Glossy Bergantian) -->
    <svg
      v-if="variant === 'laser'"
      class="btn-watermark-left"
      viewBox="0 0 100 52"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <!-- Kiri: Red (atas) -> Blue (bawah) -->
        <linearGradient id="gdevLeftGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stop-color="#EA4335" />
          <stop offset="100%" stop-color="#4285F4" />
        </linearGradient>

        <!-- Kanan: Green (atas) -> Yellow (bawah) -->
        <linearGradient id="gdevRightGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stop-color="#34A853" />
          <stop offset="100%" stop-color="#FBBC05" />
        </linearGradient>
      </defs>

      <!-- LEFT CHEVRON < -->
      <path class="gdev-base" d="M 42 11 L 10 26 L 42 41" stroke="url(#gdevLeftGrad)" />
      <path class="gdev-laser-left" d="M 42 11 L 10 26 L 42 41" stroke="url(#gdevLeftGrad)" />

      <!-- RIGHT CHEVRON > -->
      <path class="gdev-base" d="M 58 11 L 90 26 L 58 41" stroke="url(#gdevRightGrad)" />
      <path class="gdev-laser-right" d="M 58 11 L 90 26 L 58 41" stroke="url(#gdevRightGrad)" />
    </svg>

    <!-- Button Title -->
    <span class="btn-title">{{ title }}</span>

    <!-- Star Watermark Icon KANAN (Web Karya - Clean Monochrome MyWebu Star) -->
    <svg
      v-if="variant === 'star'"
      class="btn-watermark-icon"
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <g transform="rotate(8 60 60)" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 60 12 C 60 36 84 60 108 60 C 84 60 60 84 60 108 C 60 84 36 60 12 60 C 36 60 60 36 60 12 Z" stroke-width="7.5" />
        <line x1="102" y1="18" x2="102" y2="34" stroke-width="7" />
        <line x1="94" y1="26" x2="110" y2="26" stroke-width="7" />
        <circle cx="20" cy="94" r="8" stroke-width="6" />
      </g>
    </svg>

    <!-- Crescent Moon Thumbnail (70% Text, 30% Thumbnail) -->
    <template v-if="variant === 'crescent'">
      <div class="crescent-thumb" title="Thumbnail Placeholder">
        <svg class="thumb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      <svg class="crescent-divider-svg" viewBox="0 0 90 64" fill="none" preserveAspectRatio="none" aria-hidden="true">
        <path d="M 0 0 Q 38 32 0 64" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />
      </svg>
    </template>
  </component>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  to: {
    type: String,
    default: null
  },
  href: {
    type: String,
    default: null
  },
  variant: {
    type: String,
    default: 'default', // 'default' | 'star' | 'laser' | 'crescent'
    validator: (val) => ['default', 'star', 'laser', 'crescent'].includes(val)
  }
})

const isPressed = ref(false)

const isRouterLink = computed(() => !!props.to)
const linkProp = computed(() => isRouterLink.value ? 'to' : 'href')
const linkTarget = computed(() => props.to || props.href || '#')
const isExternal = computed(() => !isRouterLink.value && props.href && props.href.startsWith('http'))

const handleMouseDown = () => {
  isPressed.value = true
}

const handleMouseUp = () => {
  setTimeout(() => {
    isPressed.value = false
  }, 150)
}
</script>

<style scoped>
.neu-link-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 22px 24px;
  background: var(--bg-color);
  border-radius: 999px;
  text-decoration: none;
  box-shadow: var(--neu-flat-md);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  text-align: center;
}

.neu-link-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--neu-hover-md);
}

.neu-link-btn:active,
.neu-link-btn.pressed {
  transform: translateY(1px);
  box-shadow: var(--neu-pressed-md);
}

.btn-title {
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  font-size: 0.98rem;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
  transition: color 0.25s ease;
  position: relative;
  z-index: 2;
}

.neu-link-btn:hover .btn-title {
  color: var(--text-hover);
}

/* Star Watermark */
.btn-watermark-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%) rotate(8deg);
  width: 40px;
  height: 40px;
  color: var(--text-primary);
  opacity: 0.09;
  pointer-events: none;
  z-index: 1;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.neu-link-btn:hover .btn-watermark-icon {
  opacity: 0.25;
  transform: translateY(-50%) rotate(16deg) scale(1.08);
}

.neu-link-btn:active .btn-watermark-icon,
.neu-link-btn.pressed .btn-watermark-icon {
  transform: translateY(-50%) rotate(14deg) scale(1.02);
  opacity: 0.18;
}

/* Laser Watermark Left */
.btn-watermark-left {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 26px;
  pointer-events: none;
  z-index: 1;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.gdev-base {
  stroke-width: 9;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.14;
}

.gdev-laser-left {
  stroke-width: 9.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 42 100;
  animation: laserFlowLeft 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  filter: drop-shadow(0 0 4px rgba(234, 67, 53, 0.65));
}

.gdev-laser-right {
  stroke-width: 9.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 42 100;
  animation: laserFlowRight 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  filter: drop-shadow(0 0 4px rgba(52, 168, 83, 0.65));
}

@keyframes laserFlowLeft {
  0% {
    stroke-dashoffset: 42;
    opacity: 0;
  }
  4% {
    opacity: 1;
  }
  40% {
    stroke-dashoffset: -72;
    opacity: 1;
  }
  44%,
  100% {
    stroke-dashoffset: -72;
    opacity: 0;
  }
}

@keyframes laserFlowRight {
  0%,
  48% {
    stroke-dashoffset: 42;
    opacity: 0;
  }
  52% {
    opacity: 1;
  }
  88% {
    stroke-dashoffset: -72;
    opacity: 1;
  }
  92%,
  100% {
    stroke-dashoffset: -72;
    opacity: 0;
  }
}

.neu-link-btn:hover .btn-watermark-left {
  transform: translateY(-50%) scale(1.08);
}

.neu-link-btn:hover .gdev-laser-left {
  filter: drop-shadow(0 0 8px rgba(66, 133, 244, 0.95)) drop-shadow(0 0 3px rgba(234, 67, 53, 0.9));
}

.neu-link-btn:hover .gdev-laser-right {
  filter: drop-shadow(0 0 8px rgba(52, 168, 83, 0.95)) drop-shadow(0 0 3px rgba(251, 188, 5, 0.9));
}

/* Crescent Thumbnail */
.neu-link-btn.has-crescent-thumb {
  padding-right: 86px;
}

.crescent-thumb {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 88px;
  clip-path: url(#crescentClip);
  background: #25262c;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.crescent-thumb .thumb-icon {
  width: 22px;
  height: 22px;
  color: #5c606d;
  margin-left: 10px;
  transition: all 0.25s ease;
}

.neu-link-btn:hover .crescent-thumb {
  background: #2d2f36;
}

.neu-link-btn:hover .crescent-thumb .thumb-icon {
  color: #adb1c0;
  transform: scale(1.12);
}

.crescent-divider-svg {
  position: absolute;
  right: 0;
  top: 0;
  width: 88px;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  transition: opacity 0.3s ease;
}

.neu-link-btn:hover .crescent-divider-svg path {
  stroke: rgba(255, 255, 255, 0.16);
}

@media (max-width: 480px) {
  .neu-link-btn {
    padding: 18px 20px;
  }
  .neu-link-btn.has-crescent-thumb {
    padding-right: 74px;
  }
  .crescent-thumb,
  .crescent-divider-svg {
    width: 76px;
  }
  .btn-title {
    font-size: 0.95rem;
  }
}
</style>
