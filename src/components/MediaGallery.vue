<template>
  <section class="gallery-section">
    <!-- Header with Title & Navigation Controls -->
    <div class="gallery-header">
      <div class="gallery-title-box">
        <span class="gallery-title">Media Showcase</span>
        <span class="media-counter">{{ activeIndex + 1 }} / {{ mediaItems.length }}</span>
      </div>

      <!-- Arrow Controls -->
      <div class="gallery-nav-btns">
        <button
          type="button"
          class="nav-arrow-btn"
          aria-label="Sebelumnya"
          :disabled="activeIndex === 0"
          @click="scrollPrev"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          type="button"
          class="nav-arrow-btn"
          aria-label="Berikutnya"
          :disabled="activeIndex === mediaItems.length - 1"
          @click="scrollNext"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- Horizontal Scroll Carousel Track (Natural Aspect Ratio, No Cut) -->
    <div
      ref="carouselTrack"
      class="media-carousel-track"
      @scroll.passive="handleScroll"
    >
      <div
        v-for="(item, idx) in mediaItems"
        :key="idx"
        class="media-carousel-item"
        :class="{ 'is-video-item': item.type === 'video', 'is-image-item': item.type === 'image' }"
        @click="item.type === 'image' && openLightbox(item)"
      >
        <!-- 1. Real Video Player with Reliable Autoplay -->
        <template v-if="item.type === 'video'">
          <div class="media-video-wrapper">
            <video
              :ref="el => { if (el) videoElements[idx] = el }"
              :src="item.src"
              class="media-natural-video"
              autoplay
              muted
              loop
              playsinline
              webkit-playsinline
              controls
              preload="auto"
              @loadedmetadata="onVideoLoaded(idx)"
            ></video>
            <div class="video-top-badge">
              <span class="dot"></span>
              <span>AUTOPLAY</span>
            </div>
          </div>
          <div class="media-item-caption">
            <span class="media-caption-tag">VIDEO</span>
            <span class="media-caption-text">{{ item.label }}</span>
          </div>
        </template>

        <!-- 2. Real Image with Natural Aspect Ratio (No Cut) -->
        <template v-else-if="item.type === 'image'">
          <div class="media-img-wrapper">
            <img
              :src="item.src"
              :alt="item.label"
              class="media-natural-img"
              loading="lazy"
            />
            <div class="img-zoom-hint" title="Klik untuk memperbesar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </div>
          </div>
          <div class="media-item-caption">
            <span class="media-caption-tag">IMAGE</span>
            <span class="media-caption-text">{{ item.label }}</span>
          </div>
        </template>
      </div>
    </div>

    <!-- Lightbox Zoom Modal -->
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
import { ref, computed, onMounted, nextTick } from 'vue'

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
    default: 'Video Preview'
  },
  images: {
    type: Array,
    default: () => []
  }
})

const carouselTrack = ref(null)
const activeIndex = ref(0)
const lightboxImg = ref(null)
const videoElements = ref({})

// Flatten all media (videos and images) into one uniform array
const mediaItems = computed(() => {
  const items = []

  // Add multiple videos if videoList provided
  if (props.videoList && props.videoList.length > 0) {
    props.videoList.forEach((v) => {
      items.push({
        type: 'video',
        src: v.src || v,
        label: v.label || props.videoLabel
      })
    })
  } else if (props.videoSrc) {
    items.push({
      type: 'video',
      src: props.videoSrc,
      label: props.videoLabel
    })
  }

  // Add images
  if (props.images && props.images.length > 0) {
    props.images.forEach((img) => {
      items.push({
        type: 'image',
        src: img.src,
        label: img.label || img.title || 'Screenshot'
      })
    })
  }

  return items
})

const handleScroll = () => {
  if (!carouselTrack.value) return
  const track = carouselTrack.value
  const children = Array.from(track.children)
  if (children.length === 0) return

  const trackCenter = track.scrollLeft + track.clientWidth / 2
  let closestIndex = 0
  let closestDist = Infinity

  children.forEach((child, i) => {
    const childCenter = child.offsetLeft + child.clientWidth / 2
    const dist = Math.abs(trackCenter - childCenter)
    if (dist < closestDist) {
      closestDist = dist
      closestIndex = i
    }
  })

  activeIndex.value = closestIndex
}

const scrollToIndex = (index) => {
  if (!carouselTrack.value) return
  const children = Array.from(carouselTrack.value.children)
  if (children[index]) {
    children[index].scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    })
    activeIndex.value = index
  }
}

const scrollPrev = () => {
  if (activeIndex.value > 0) {
    scrollToIndex(activeIndex.value - 1)
  }
}

const scrollNext = () => {
  if (activeIndex.value < mediaItems.value.length - 1) {
    scrollToIndex(activeIndex.value + 1)
  }
}

const openLightbox = (item) => {
  lightboxImg.value = item
}

// Make sure video plays reliably on mobile
const onVideoLoaded = (idx) => {
  const el = videoElements.value[idx]
  if (el) {
    el.muted = true
    el.play().catch(() => {
      // Browser prevented autoplay before user interaction
    })
  }
}

onMounted(() => {
  nextTick(() => {
    Object.values(videoElements.value).forEach((el) => {
      if (el) {
        el.muted = true
        el.play().catch(() => {})
      }
    })
  })
})
</script>

<style scoped>
.gallery-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 6px;
  width: 100%;
}

.gallery-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.gallery-title-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.gallery-title {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted, #5b5f6d);
}

.media-counter {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  font-weight: 600;
  color: #5bb2ff;
  background: #191b1f;
  padding: 2px 8px;
  border-radius: 999px;
  box-shadow: inset 1px 1px 3px #111215, inset -1px -1px 3px #272930;
}

.gallery-nav-btns {
  display: flex;
  gap: 6px;
}

.nav-arrow-btn {
  background: var(--bg-color, #1e1f23);
  border: none;
  color: var(--text-secondary, #8c909e);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 3px 3px 8px var(--shadow-dark, #121316), -3px -3px 8px var(--shadow-light, #2c2e35);
  transition: all 0.2s ease;
}

.nav-arrow-btn:hover:not(:disabled) {
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 4px 4px 10px var(--shadow-dark, #121316), -4px -4px 10px var(--shadow-light, #2c2e35);
}

.nav-arrow-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  box-shadow: none;
}

.nav-arrow-btn svg {
  width: 16px;
  height: 16px;
}

/* Horizontal Scroll Track */
.media-carousel-track {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 6px 2px 14px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #2e313a transparent;
}

.media-carousel-track::-webkit-scrollbar {
  height: 6px;
}

.media-carousel-track::-webkit-scrollbar-track {
  background: transparent;
}

.media-carousel-track::-webkit-scrollbar-thumb {
  background: #2b2e37;
  border-radius: 999px;
}

/* Individual Carousel Item Card */
.media-carousel-item {
  scroll-snap-align: center;
  flex-shrink: 0;
  height: 360px;
  background: #18191e;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 6px 6px 18px var(--shadow-dark, #121316), -6px -6px 18px var(--shadow-light, #2c2e35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.media-carousel-item.is-image-item {
  cursor: pointer;
}

.media-carousel-item:hover {
  border-color: rgba(255, 255, 255, 0.16);
  transform: translateY(-2px);
}

/* Video Wrapper & Player */
.media-video-wrapper {
  flex: 1;
  position: relative;
  background: #0d0e11;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.media-natural-video {
  height: 100%;
  width: auto;
  max-width: 82vw;
  object-fit: contain;
  display: block;
  background: #000;
}

.video-top-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 600;
  color: #5bb2ff;
  background: rgba(18, 19, 24, 0.85);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  padding: 3px 8px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  pointer-events: none;
  z-index: 5;
}

.video-top-badge .dot {
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

/* Image Wrapper & Natural View */
.media-img-wrapper {
  flex: 1;
  position: relative;
  background: #121316;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.media-natural-img {
  height: 100%;
  width: auto;
  max-width: 82vw;
  object-fit: contain;
  display: block;
  transition: transform 0.35s ease;
}

.media-carousel-item:hover .media-natural-img {
  transform: scale(1.02);
}

.img-zoom-hint {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(18, 19, 24, 0.8);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #adb0be;
  border: 1px solid rgba(255, 255, 255, 0.08);
  pointer-events: none;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.media-carousel-item:hover .img-zoom-hint {
  opacity: 1;
  color: #ffffff;
}

.img-zoom-hint svg {
  width: 14px;
  height: 14px;
}

/* Caption Footer of Item */
.media-item-caption {
  padding: 10px 14px;
  background: #17181c;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  gap: 8px;
}

.media-caption-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  color: #797d8c;
  background: #121315;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.media-caption-text {
  font-size: 0.8rem;
  font-weight: 600;
  color: #d1d5e3;
  letter-spacing: 0.2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  .media-carousel-item {
    height: 310px;
  }
}
</style>
