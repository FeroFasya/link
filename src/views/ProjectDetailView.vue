<template>
  <div class="project-detail-page">
    <div class="bg-ambient"></div>

    <!-- Top Navigation Bar -->
    <nav class="detail-nav">
      <RouterLink to="/" class="btn-nav-pill back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>balik</span>
      </RouterLink>

      <RouterLink :to="projectData.switchTarget" class="btn-nav-pill switch">
        <span>{{ projectData.switchLabel }}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </RouterLink>
    </nav>

    <!-- Main Project Detail Card -->
    <main class="project-card">
      <header class="project-header">
        <div class="project-category-badge" :class="{ 'badge-gold': projectData.isGold }">
          <span class="badge-dot"></span>
          <span>{{ projectData.category }}</span>
        </div>
        <h1 class="project-title">{{ projectData.title }}</h1>
        <p class="project-description">
          {{ projectData.description }}
        </p>
      </header>

      <!-- Tech Stack Tags -->
      <div class="project-tags">
        <span
          v-for="tag in projectData.tags"
          :key="tag"
          class="tag-pill"
        >
          {{ tag }}
        </span>
      </div>

      <!-- CTA Button -->
      <div class="cta-wrapper">
        <a
          :href="projectData.ctaUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-cta"
        >
          <span>{{ projectData.ctaLabel }}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>

      <!-- Media Gallery Showcase -->
      <MediaGallery
        :video-label="projectData.videoLabel"
        :video-title="projectData.videoTitle"
        :images="projectData.images"
      />
    </main>

    <!-- Footer Tipis -->
    <GlobalFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MediaGallery from '@/components/MediaGallery.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'

const route = useRoute()

const PROJECTS = {
  aika: {
    category: 'AI Companion',
    isGold: false,
    title: 'AIKA',
    description:
      'AIKA merupakan sistem asisten virtual berbasis 3D avatar (VRM). Aplikasi ini menggunakan Large Language Model untuk menghasilkan respon natural, Text-to-Speech untuk suara, dan Lip Sync otomatis agar avatar tampak hidup saat berbicara.',
    tags: ['#VRM', '#TTS', '#LLM', '#3D-Avatar', '#LipSync'],
    ctaLabel: 'wanna try?',
    ctaUrl: 'https://mbg-aika.vercel.app/',
    switchTarget: '/project/kira',
    switchLabel: 'kira trainer',
    videoLabel: 'Video Preview: 3D VRM & Lip Sync Demo',
    videoTitle: 'Video Demo Placeholder',
    images: [
      { title: 'Screenshot UI Companion', label: 'UI Companion & Chat Window' },
      { title: 'Screenshot Realtime Blendshapes', label: 'Realtime Blendshapes & Emotion' }
    ]
  },
  kira: {
    category: '#juaravibecoding',
    isGold: true,
    title: 'KIRA AI Trainer',
    description:
      'KIRA adalah karakter AI yang bertindak sebagai pelatih kebugaran. Disajikan dalam format visual novel, ia memberikan panduan olahraga interaktif dan motivasi harian. Ini adalah project untuk event #juaravibecoding by googledeveloperid.',
    tags: ['#Visual Novel', '#LLM', '#FitnessAI', '#GoogleDeveloperID', '#Gamification'],
    ctaLabel: 'wanna see?',
    ctaUrl: 'https://kira-ai-trainer.vercel.app/',
    switchTarget: '/project/aika',
    switchLabel: 'aika companion',
    videoLabel: 'Video Gameplay: Visual Novel & Sesi Workout KIRA',
    videoTitle: 'Video Gameplay Placeholder',
    images: [
      { title: 'Screenshot Scene Dialog', label: 'Scene Percakapan & Motivasi KIRA' },
      { title: 'Screenshot UI Tracker', label: 'Tracker Target Olahraga Harian' }
    ]
  }
}

const projectId = computed(() => {
  const id = String(route.params.id || 'aika').toLowerCase()
  return PROJECTS[id] ? id : 'aika'
})

const projectData = computed(() => PROJECTS[projectId.value])
</script>

<style scoped>
.project-detail-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px 80px;
  position: relative;
  overflow-x: hidden;
  background-color: var(--bg-color);
  color: var(--text-primary);
}

.bg-ambient {
  position: fixed;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 30px 40px, rgba(255, 255, 255, 0.4), transparent),
    radial-gradient(1.5px 1.5px at 180px 220px, rgba(255, 255, 255, 0.3), transparent),
    radial-gradient(1px 1px at 320px 120px, rgba(255, 255, 255, 0.5), transparent);
  background-repeat: repeat;
  background-size: 400px 400px;
  opacity: 0.25;
  pointer-events: none;
  z-index: 0;
}

.detail-nav {
  width: 100%;
  max-width: 640px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  z-index: 10;
}

.btn-nav-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 999px;
  background: var(--bg-color);
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.84rem;
  font-weight: 600;
  box-shadow: var(--neu-flat-sm);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.btn-nav-pill:hover {
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: var(--neu-flat-md);
}

.btn-nav-pill:active {
  transform: translateY(1px);
  box-shadow: var(--neu-pressed-sm);
}

.btn-nav-pill svg {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.btn-nav-pill.back:hover svg {
  transform: translateX(-3px);
}

.btn-nav-pill.switch:hover svg {
  transform: translateX(3px);
}

.project-card {
  width: 100%;
  max-width: 640px;
  background: #202227;
  border-radius: 32px;
  box-shadow: 14px 14px 32px var(--shadow-dark, #121316), -14px -14px 32px var(--shadow-light, #2c2e35);
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  gap: 26px;
  position: relative;
  z-index: 1;
}

.project-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.project-category-badge {
  align-self: flex-start;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #5bb2ff;
  background: #191b1f;
  padding: 5px 12px;
  border-radius: 999px;
  box-shadow: inset 2px 2px 5px #111215, inset -2px -2px 5px #272930;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #5bb2ff;
  box-shadow: 0 0 8px #5bb2ff;
}

.badge-gold {
  color: #fbbc05;
}

.badge-gold .badge-dot {
  background: #fbbc05;
  box-shadow: 0 0 8px #fbbc05;
}

.project-title {
  font-family: 'Pixelify Sans', cursive, sans-serif;
  font-size: 2.6rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  line-height: 1.15;
  color: var(--text-primary);
}

.project-description {
  font-size: 0.95rem;
  line-height: 1.65;
  color: #b0b4c3;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-pill {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  font-weight: 500;
  color: #8c909e;
  background: #1b1c20;
  padding: 4px 12px;
  border-radius: 999px;
  box-shadow: inset 2px 2px 4px #121316, inset -2px -2px 4px #26272e;
  transition: color 0.2s ease;
}

.tag-pill:hover {
  color: #ffffff;
}

.cta-wrapper {
  display: flex;
  align-items: center;
  gap: 14px;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: 999px;
  background: #23252b;
  color: #ffffff;
  text-decoration: none;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 0.94rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  box-shadow: var(--neu-flat-md);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.btn-cta:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 10px 10px 22px var(--shadow-dark, #121316), -10px -10px 22px var(--shadow-light, #2c2e35), 0 0 16px rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-cta:active {
  transform: translateY(1px) scale(0.98);
  box-shadow: var(--neu-pressed-sm);
}

.btn-cta svg {
  width: 18px;
  height: 18px;
  transition: transform 0.25s ease;
}

.btn-cta:hover svg {
  transform: translateX(4px);
}

@media (max-width: 540px) {
  .project-detail-page {
    padding: 18px 14px 74px;
  }
  .project-card {
    padding: 26px 20px;
    border-radius: 26px;
    gap: 20px;
  }
  .project-title {
    font-size: 2.1rem;
  }
}
</style>
