<template>
  <section class="gallery-section">
    <div class="gallery-header">
      <span class="gallery-title">Media Showcase</span>
      <!-- Multi-video switcher if available -->
      <div v-if="videoList && videoList.length > 1" class="video-switcher">
        <button
          v-for="(vid, idx) in videoList"
          :key="idx"
          type="button"
          class="vid-tab-btn"
          :class="{ active: currentVideoIndex === idx }"
          @click="currentVideoIndex = idx"
        >
          {{ vid.label || `Video ${idx + 1}` }}
        </button>
      </div>
    </div>

    <!-- Real Video Player Box -->
    <div v-if="activeVideoSrc" class="media-video-box has-video">
      <video
        ref="videoEl"
        :key="activeVideoSrc"
        :src="activeVideoSrc"
        class="media-video-player"
        autoplay
        muted
        loop
        playsinline
        controls
        preload="metadata"
      ></video>
      <div class="video-badge-autoplay">
        <span class="dot"></span>
        <span>AUTOPLAY</span>
      </div>
    </div>

    <!-- Fallback Video Placeholder Box -->
    <div v-else class="media-video-box" :title="videoTitle">
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

    <!-- Image Grid Showcase -->
    <div class="media-img-grid">
      <div
        v-for="(img, idx) in images"
        :key="idx"
        class="media-img-box"
        :class="{ 'has-img': Boolean(img.src) }"
        :title="img.title"
        @click="openLightbox(img)"
      >
        <!-- Real Image -->
        <template v-if="img.src">
          <img
            :src="img.src"
            :alt="img.label || img.title"
            class="media-real-img"
            loading="lazy"
          />
          <div class="media-img-overlay">
            <span class="media-img-pill">{{ img.label }}</span>
          </div>
        </template>

        <!-- Placeholder Fallback -->
        <template v-else>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span class="media-img-label">{{ img.label }}</span>
        </template>
      </div>
    </div>

    <!-- Image Lightbox Modal -->
    <Teleport to="body">
      <div
        v-if="lightboxImg"
        class="lightbox-backdrop"
        role="dialog"
        aria-modal="true"
        @click="lightboxImg = null"
      >
        <button class="lightbox-close" type="button" aria-label="Tutup" @click="lightboxImg = null">&times;</button>
        <div class="lightbox-card" @click.stop>
          <img :src="lightboxImg.src" :alt="lightboxImg.label" class="lightbox-img" />
          <p v-if="lightboxImg.label" class="lightbox-caption">{{ lightboxImg.label }}</p>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  videoSrc: {
    type: String,
    default: null
  },
  videoList: {
    type: Array,
    default: null
  },
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

const currentVideoIndex = ref(0)
const lightboxImg = ref(null)

const activeVideoSrc = computed(() => {
  if (props.videoList && props.videoList.length > 0) {
    return props.videoList[currentVideoIndex.value]?.src || props.videoList[currentVideoIndex.value]
  }
  return props.videoSrc
})

const openLightbox = (img) => {
  if (img.src) {
    lightboxImg.value = img
  }
}
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
  flex-wrap: wrap;
  gap: 8px;
}

.gallery-title {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted, #5b5f6d);
}

.video-switcher {
  display: inline-flex;
  background: #191b1f;
  padding: 3px;
  border-radius: 999px;
  box-shadow: inset 2px 2px 5px #111215, inset -2px -2px 5px #272930;
  gap: 3px;
}

.vid-tab-btn {
  background: transparent;
  border: none;
  color: #7d8291;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.vid-tab-btn:hover {
  color: #ffffff;
}

.vid-tab-btn.active {
  background: #25272e;
  color: #ffffff;
  box-shadow: 2px 2px 5px #111215, -2px -2px 5px #2c2e35;
}

/* Video Box */
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
  transition: border-color 0.25s ease;
}

.media-video-box.has-video {
  box-shadow: 8px 8px 20px var(--shadow-dark, #121316), -8px -8px 20px var(--shadow-light, #2c2e35);
}

.media-video-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  display: block;
  background: #000;
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
  background: rgba(20, 21, 26, 0.85);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  padding: 4px 10px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  pointer-events: none;
  z-index: 5;
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

/* Image Grid */
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
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.25s ease;
  cursor: pointer;
}

.media-img-box.has-img {
  box-shadow: 6px 6px 16px var(--shadow-dark, #121316), -6px -6px 16px var(--shadow-light, #2c2e35);
}

.media-img-box:hover {
  border-color: rgba(255, 255, 255, 0.18);
  transform: translateY(-3px);
}

.media-real-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;
}

.media-img-box:hover .media-real-img {
  transform: scale(1.06);
}

.media-img-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 10px;
  background: linear-gradient(180deg, transparent 0%, rgba(18, 19, 23, 0.85) 100%);
  display: flex;
  align-items: flex-end;
  pointer-events: none;
}

.media-img-pill {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  color: #e0e3ed;
  background: rgba(25, 26, 32, 0.85);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
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
  margin-top: 6px;
}

/* Lightbox Modal */
.lightbox-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 11, 14, 0.88);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 9999;
  cursor: pointer;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 24px;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 2.2rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.lightbox-close:hover {
  opacity: 1;
  transform: scale(1.1);
}

.lightbox-card {
  max-width: 90vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: default;
}

.lightbox-img {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.lightbox-caption {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.88rem;
  color: #cbd0e0;
  font-weight: 500;
  text-align: center;
}

@media (max-width: 540px) {
  .media-img-grid {
    grid-template-columns: 1fr;
  }
}
</style>
