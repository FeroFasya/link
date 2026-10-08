<template>
  <section class="gallery-section">
    <div class="gallery-header">
      <span class="gallery-title">Media Showcase</span>
    </div>

    <!-- Video Placeholder (Autoplay Simulation) -->
    <div class="media-video-box" :title="videoTitle">
      <div class="video-badge-autoplay">
        <span class="dot"></span>
        <span>AUTOPLAY DEMO</span>
      </div>
      <div class="video-pulse-ring">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </div>
      <span class="video-label">{{ videoLabel }}</span>
    </div>

    <!-- Image Grid Placeholder -->
    <div class="media-img-grid">
      <div
        v-for="(img, idx) in images"
        :key="idx"
        class="media-img-box"
        :title="img.title"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span class="media-img-label">{{ img.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  videoLabel: {
    type: String,
    default: 'Video Preview Demo'
  },
  videoTitle: {
    type: String,
    default: 'Video Placeholder'
  },
  images: {
    type: Array,
    default: () => [
      { title: 'Screenshot 1', label: 'Preview Interface 1' },
      { title: 'Screenshot 2', label: 'Preview Interface 2' }
    ]
  }
})
</script>

<style scoped>
.gallery-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 6px;
}

.gallery-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.gallery-title {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted, #5b5f6d);
}

.media-video-box {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #17181c;
  border-radius: 20px;
  box-shadow: inset 5px 5px 12px var(--shadow-dark, #121316), inset -5px -5px 12px var(--shadow-light, #2c2e35);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.04);
  cursor: pointer;
  transition: border-color 0.25s ease;
}

.media-video-box:hover {
  border-color: rgba(255, 255, 255, 0.12);
}

.video-pulse-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #24262c;
  box-shadow: 4px 4px 10px var(--shadow-dark, #121316), -4px -4px 10px var(--shadow-light, #2c2e35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #adb2c2;
  margin-bottom: 12px;
  transition: all 0.25s ease;
}

.media-video-box:hover .video-pulse-ring {
  transform: scale(1.1);
  color: #ffffff;
  box-shadow: 6px 6px 14px #0f1013, -6px -6px 14px #2f323a, 0 0 16px rgba(255, 255, 255, 0.1);
}

.video-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #8c909e;
  letter-spacing: 0.3px;
}

.video-badge-autoplay {
  position: absolute;
  top: 14px;
  right: 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  font-weight: 600;
  color: #5bb2ff;
  background: rgba(30, 31, 35, 0.8);
  backdrop-filter: blur(4px);
  padding: 4px 10px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.video-badge-autoplay .dot {
  width: 5px;
  height: 5px;
  background: #5bb2ff;
  border-radius: 50%;
  animation: blinkDot 1.5s infinite;
}

@keyframes blinkDot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.media-img-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.media-img-box {
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #191a1e;
  border-radius: 16px;
  box-shadow: inset 3px 3px 6px var(--shadow-dark, #121316), inset -3px -3px 6px var(--shadow-light, #2c2e35);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  transition: border-color 0.25s ease, transform 0.2s ease;
  cursor: pointer;
}

.media-img-box:hover {
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.media-img-box svg {
  width: 26px;
  height: 26px;
  color: #5e6270;
  transition: color 0.2s ease;
}

.media-img-box:hover svg {
  color: #adb1c2;
}

.media-img-label {
  font-size: 0.74rem;
  font-weight: 500;
  color: #6c707f;
}

@media (max-width: 540px) {
  .media-img-grid {
    grid-template-columns: 1fr;
  }
}
</style>
