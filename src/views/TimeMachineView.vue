<template>
  <div class="time-machine-view">
    <div class="space-bg"></div>

    <!-- Header Nav -->
    <header class="time-header">
      <RouterLink to="/" class="btn-back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>balik?</span>
      </RouterLink>

      <div class="header-center">
        <h1 class="header-title">mesin waktu ⏳</h1>
        <p class="header-desc">jejak pesan & waktu yang pernah dikirim untuk fero</p>
      </div>

      <!-- Mode Switcher -->
      <div class="view-switcher" role="tablist">
        <button
          class="view-btn"
          :class="{ active: currentView === 'bounce' }"
          type="button"
          @click="switchView('bounce')"
        >
          ⚽ bounce
        </button>
        <button
          class="view-btn"
          :class="{ active: currentView === 'drift' }"
          type="button"
          @click="switchView('drift')"
        >
          🌌 floating
        </button>
        <button
          class="view-btn"
          :class="{ active: currentView === 'ticker' }"
          type="button"
          @click="switchView('ticker')"
        >
          📜 ticker
        </button>
        <button
          class="view-btn"
          :class="{ active: currentView === 'grid' }"
          type="button"
          @click="switchView('grid')"
        >
          📋 grid
        </button>
      </div>
    </header>

    <!-- Main View Stage -->
    <main ref="mainStageRef" class="main-stage">
      <!-- Empty State -->
      <div v-if="comments.length === 0" class="empty-state">
        <div class="empty-icon">⏳</div>
        <p class="empty-title">Mesin Waktu Masih Sunyi</p>
        <p class="empty-desc">Belum ada jejak pesan yang dikirim. Coba kembali ke linktree dan kirim pesan pertamamu!</p>
      </div>

      <!-- 1. Floating Drift View -->
      <div v-show="currentView === 'drift'" class="drift-container">
        <div
          v-for="(c, idx) in driftItems"
          :key="c.id || idx"
          class="msg-card drift-bubble"
          :style="{
            left: `${c.x}px`,
            top: `${c.y}px`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`
          }"
        >
          <div class="msg-author">
            <span>✨</span>
            <span>{{ c.author || 'Anonim 🕵️' }}</span>
          </div>
          <div class="msg-text">{{ c.text }}</div>
          <div class="msg-date">{{ c.displayDate }}</div>
        </div>
      </div>

      <!-- 2. Bouncing Screensaver View -->
      <div v-show="currentView === 'bounce'" ref="bounceContainerRef" class="bounce-container">
        <div
          v-for="(item, idx) in bounceBalls"
          :key="item.id || idx"
          :ref="el => { if (el) bounceElements[idx] = el }"
          class="msg-card bounce-item"
          :style="{
            transform: `translate3d(${item.x}px, ${item.y}px, 0)`
          }"
        >
          <div class="msg-author">
            <span>✨</span>
            <span>{{ item.author || 'Anonim 🕵️' }}</span>
          </div>
          <div class="msg-text">{{ item.text }}</div>
          <div class="msg-date">{{ item.displayDate }}</div>
        </div>
      </div>

      <!-- 3. Ticker Tape / Marquee Spanduk -->
      <div v-show="currentView === 'ticker'" class="ticker-container">
        <div class="marquee-track">
          <div
            v-for="(c, idx) in tickerRow1"
            :key="'row1-' + (c.id || idx) + '-' + idx"
            class="msg-card marquee-card"
          >
            <div class="msg-author">
              <span>✨</span>
              <span>{{ c.author || 'Anonim 🕵️' }}</span>
            </div>
            <div class="msg-text">{{ c.text }}</div>
            <div class="msg-date">{{ c.displayDate }}</div>
          </div>
        </div>
        <div class="marquee-track reverse">
          <div
            v-for="(c, idx) in tickerRow2"
            :key="'row2-' + (c.id || idx) + '-' + idx"
            class="msg-card marquee-card"
          >
            <div class="msg-author">
              <span>✨</span>
              <span>{{ c.author || 'Anonim 🕵️' }}</span>
            </div>
            <div class="msg-text">{{ c.text }}</div>
            <div class="msg-date">{{ c.displayDate }}</div>
          </div>
        </div>
      </div>

      <!-- 4. Grid Timeline View -->
      <div v-show="currentView === 'grid'" class="grid-container">
        <div
          v-for="(c, idx) in comments"
          :key="c.id || idx"
          class="msg-card"
        >
          <div class="msg-author">
            <span>✨</span>
            <span>{{ c.author || 'Anonim 🕵️' }}</span>
          </div>
          <div class="msg-text">{{ c.text }}</div>
          <div class="msg-date">{{ c.displayDate }}</div>
        </div>
      </div>
    </main>

    <footer class="time-footer">
      <span>mesin waktu fero • ferooooooooooo :3</span>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { timeCapsuleService } from '@/services/firebase'

const comments = ref([])
const currentView = ref('drift') // 'drift' | 'bounce' | 'ticker' | 'grid'
const mainStageRef = ref(null)
const bounceContainerRef = ref(null)

// View 1: Drift
const driftItems = ref([])

// View 2: Bounce
const bounceBalls = ref([])
const bounceElements = ref([])
let bounceAnimId = null

// View 3: Ticker
const tickerRow1 = ref([])
const tickerRow2 = ref([])

const setupDrift = () => {
  const stageW = window.innerWidth
  const stageH = window.innerHeight - 140

  driftItems.value = comments.value.map((c, i) => {
    const x = 20 + Math.random() * Math.max(stageW - 340, 40)
    const y = 30 + (i * Math.max((stageH - 140) / (comments.value.length || 1), 30)) + (Math.random() * 25)
    return {
      ...c,
      x: Math.floor(x),
      y: Math.floor(y),
      delay: ((i * 1.5) % 6).toFixed(1),
      duration: (16 + (i * 3))
    }
  })
}

const setupBounce = () => {
  stopBounce()
  const stageW = window.innerWidth
  const stageH = window.innerHeight - 140

  bounceBalls.value = comments.value.slice(0, 10).map((c) => {
    const speed = 1.2 + Math.random() * 0.8
    const angle = Math.random() * Math.PI * 2
    return {
      ...c,
      x: 20 + Math.random() * Math.max(stageW - 300, 20),
      y: 20 + Math.random() * Math.max(stageH - 140, 20),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      w: 260,
      h: 100
    }
  })

  nextTick(() => {
    startBounceLoop()
  })
}

const startBounceLoop = () => {
  const loop = () => {
    const curW = window.innerWidth
    const curH = window.innerHeight - 140

    bounceBalls.value.forEach((b, idx) => {
      b.x += b.vx
      b.y += b.vy

      const el = bounceElements.value[idx]
      const w = el ? el.offsetWidth : b.w
      const h = el ? el.offsetHeight : b.h

      if (b.x <= 8) {
        b.x = 8
        b.vx = Math.abs(b.vx)
      } else if (b.x + w >= curW - 8) {
        b.x = curW - w - 8
        b.vx = -Math.abs(b.vx)
      }

      if (b.y <= 8) {
        b.y = 8
        b.vy = Math.abs(b.vy)
      } else if (b.y + h >= curH - 8) {
        b.y = curH - h - 8
        b.vy = -Math.abs(b.vy)
      }
    })

    bounceAnimId = requestAnimationFrame(loop)
  }

  bounceAnimId = requestAnimationFrame(loop)
}

const stopBounce = () => {
  if (bounceAnimId) {
    cancelAnimationFrame(bounceAnimId)
    bounceAnimId = null
  }
}

const setupTicker = () => {
  const duplicated = comments.value.concat(comments.value)
  const r1 = []
  const r2 = []
  duplicated.forEach((c, idx) => {
    if (idx % 2 === 0) {
      r1.push(c)
    } else {
      r2.push(c)
    }
  })
  tickerRow1.value = r1
  tickerRow2.value = r2
}

const switchView = (mode) => {
  currentView.value = mode
  stopBounce()

  if (mode === 'drift') {
    setupDrift()
  } else if (mode === 'bounce') {
    setupBounce()
  } else if (mode === 'ticker') {
    setupTicker()
  }
}

const onResize = () => {
  if (currentView.value === 'drift') {
    setupDrift()
  }
}

let unsubscribe = null

onMounted(async () => {
  try {
    comments.value = await timeCapsuleService.getComments()
  } catch (err) {
    console.error('Failed to load comments:', err)
  }

  setupDrift()
  window.addEventListener('resize', onResize)

  // Realtime subscription if available
  unsubscribe = timeCapsuleService.subscribeComments((newComment) => {
    comments.value.unshift(newComment)
    if (currentView.value === 'drift') setupDrift()
    if (currentView.value === 'ticker') setupTicker()
  })
})

onBeforeUnmount(() => {
  stopBounce()
  window.removeEventListener('resize', onResize)
  if (unsubscribe) unsubscribe()
})
</script>

<style scoped>
.time-machine-view {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
  background-color: var(--bg-color);
  color: var(--text-primary);
}

.space-bg {
  position: fixed;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0, 0, 0, 0)),
    radial-gradient(1.5px 1.5px at 150px 180px, rgba(255, 255, 255, 0.6), rgba(0, 0, 0, 0)),
    radial-gradient(1px 1px at 280px 90px, rgba(255, 255, 255, 0.4), rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 400px 320px, rgba(255, 255, 255, 0.7), rgba(0, 0, 0, 0)),
    radial-gradient(1px 1px at 520px 240px, rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0));
  background-repeat: repeat;
  background-size: 550px 550px;
  opacity: 0.28;
  pointer-events: none;
  z-index: 0;
}

.time-header {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: rgba(30, 31, 35, 0.88);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 999px;
  background: var(--bg-color);
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: var(--neu-flat-sm);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.btn-back:hover {
  color: #ffffff;
  transform: translateX(-3px);
  box-shadow: var(--neu-flat-md);
}

.btn-back:active {
  transform: translateY(1px);
  box-shadow: var(--neu-pressed-sm);
}

.header-center {
  text-align: center;
}

.header-title {
  font-family: 'Pixelify Sans', cursive, sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.header-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

.view-switcher {
  display: inline-flex;
  background: #191a1d;
  padding: 4px;
  border-radius: 999px;
  box-shadow: inset 2px 2px 6px #101114, inset -2px -2px 6px #292a30;
  gap: 4px;
}

.view-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 7px 14px;
  border-radius: 999px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  white-space: nowrap;
}

.view-btn:hover {
  color: #ffffff;
}

.view-btn.active {
  background: #24262c;
  color: #ffffff;
  box-shadow: 2px 2px 6px #121316, -2px -2px 6px #2e3037;
}

.main-stage {
  flex: 1;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: calc(100vh - 140px);
}

.msg-card {
  background: #212328;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 14px 18px;
  box-shadow: 6px 6px 16px #121316, -6px -6px 16px #292b32;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: default;
  user-select: none;
}

.msg-card:hover {
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 8px 8px 20px #0f1013, -8px -8px 20px #30333b, 0 0 14px rgba(255, 255, 255, 0.06);
}

.msg-author {
  font-weight: 700;
  font-size: 0.85rem;
  color: #61b5ff;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.msg-text {
  font-size: 0.92rem;
  line-height: 1.45;
  color: var(--text-primary);
  word-break: break-word;
}

.msg-date {
  font-size: 0.7rem;
  color: #636773;
  margin-top: 6px;
  font-family: 'JetBrains Mono', monospace;
}

/* 1. Drift View */
.drift-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.drift-bubble {
  position: absolute;
  max-width: 320px;
  animation: gentleDrift 20s ease-in-out infinite alternate;
}

@keyframes gentleDrift {
  0% { transform: translateY(0px) rotate(-1deg); }
  50% { transform: translateY(-24px) rotate(1.5deg); }
  100% { transform: translateY(12px) rotate(-0.5deg); }
}

/* 2. Bounce View */
.bounce-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.bounce-item {
  position: absolute;
  max-width: 300px;
  will-change: transform;
}

/* 3. Ticker View */
.ticker-container {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
  overflow: hidden;
  padding: 40px 0;
}

.marquee-track {
  display: flex;
  gap: 24px;
  width: max-content;
  animation: marqueeScroll 32s linear infinite;
}

.marquee-track.reverse {
  animation: marqueeScrollReverse 36s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

.marquee-card {
  max-width: 320px;
  flex-shrink: 0;
}

@keyframes marqueeScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes marqueeScrollReverse {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

/* 4. Grid View */
.grid-container {
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 24px 60px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

/* Empty State */
.empty-state {
  margin: auto;
  text-align: center;
  max-width: 320px;
  color: var(--text-secondary);
  padding: 40px 20px;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 12px;
  opacity: 0.6;
}

.empty-title {
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--text-primary);
}

.empty-desc {
  font-size: 0.82rem;
}

.time-footer {
  text-align: center;
  padding: 18px;
  font-size: 0.8rem;
  color: #555964;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  z-index: 10;
}

@media (max-width: 640px) {
  .time-header {
    justify-content: center;
  }
  .view-switcher {
    width: 100%;
    justify-content: center;
  }
  .view-btn {
    padding: 6px 10px;
    font-size: 0.72rem;
  }
}
</style>
