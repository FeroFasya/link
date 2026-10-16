<template>
  <div class="about-detail-page">
    <div class="bg-ambient"></div>

    <!-- Top Navigation Bar -->
    <nav class="detail-nav">
      <RouterLink to="/" class="btn-nav-pill back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>linktree</span>
      </RouterLink>
    </nav>

    <!-- Main About Detail Card -->
    <main class="about-card">
      <!-- Decorative Watermark Star -->
      <svg class="about-watermark-star" viewBox="0 0 120 120" fill="none" stroke="currentColor" aria-hidden="true">
        <g transform="rotate(8 60 60)" stroke-linecap="round" stroke-linejoin="round">
          <path d="M 60 12 C 60 36 84 60 108 60 C 84 60 60 84 60 108 C 60 84 36 60 12 60 C 36 60 60 36 60 12 Z" stroke-width="6.5" />
          <line x1="102" y1="18" x2="102" y2="34" stroke-width="6" />
          <line x1="94" y1="26" x2="110" y2="26" stroke-width="6" />
          <circle cx="20" cy="94" r="8" stroke-width="5.5" />
        </g>
      </svg>

      <header class="about-header">
        <div class="about-category-badge">
          <span class="badge-dot"></span>
          <span>Setitik Debu Galaxy</span>
        </div>
        <h1 class="about-title">tentang ku</h1>
        <div class="about-description">
          <p>
            Fero cuma manusia biasa kok, cuma setitik debu kecil di tengah alam semesta yang luas ini. Meski kecil, Fero punya mimpi besar: keliling dunia dan menginjakkan kaki di kota-kota impiannya seperti Tokyo, New York, Shanghai, hingga Riyadh.
          </p>
          <p>
            Bagiku... hidup ini cuma sekali sebelum semuanya kembali menjadi <em>void</em>, karena itu aku menganggap setiap orang yang aku temui itu berharga. Soo... makasih sudah mampir dan menjadi bagian dari perjalanan hidupku, si setitik debu galaksi ini.
          </p>
        </div>
      </header>

      <!-- Dream Cities Tags -->
      <div class="about-tags">
        <span class="tag-pill">#Tokyo 🗼</span>
        <span class="tag-pill">#NewYork 🗽</span>
        <span class="tag-pill">#Shanghai 🏙️</span>
        <span class="tag-pill">#Riyadh 🕌</span>
      </div>

      <!-- CTA Action to Portfolio Web -->
      <div class="cta-wrapper">
        <a
          href="https://ferofasya.github.io/Portogamegweh/"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-cta"
        >
          <span>wanna see more?</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    </main>

    <!-- Footer Tipis -->
    <GlobalFooter />
  </div>
</template>

<script setup>
import GlobalFooter from '@/components/GlobalFooter.vue'
</script>

<style scoped>
.about-detail-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
    radial-gradient(1px 1px at 30px 40px, rgba(255, 255, 255, 0.45), transparent),
    radial-gradient(1.5px 1.5px at 180px 220px, rgba(255, 255, 255, 0.35), transparent),
    radial-gradient(1px 1px at 320px 120px, rgba(255, 255, 255, 0.5), transparent),
    radial-gradient(2px 2px at 460px 300px, rgba(255, 255, 255, 0.3), transparent);
  background-repeat: repeat;
  background-size: 400px 400px;
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
}

.detail-nav {
  width: 100%;
  max-width: 540px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 24px;
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

.about-card {
  width: 100%;
  max-width: 540px;
  background: #202227;
  border-radius: 32px;
  box-shadow: 14px 14px 32px var(--shadow-dark, #121316), -14px -14px 32px var(--shadow-light, #2c2e35);
  padding: 38px 34px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.about-watermark-star {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 130px;
  height: 130px;
  color: var(--text-primary);
  opacity: 0.04;
  pointer-events: none;
}

.about-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  z-index: 2;
}

.about-category-badge {
  align-self: flex-start;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #a78bfa;
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
  background: #a78bfa;
  box-shadow: 0 0 8px #a78bfa;
}

.about-title {
  font-family: 'Pixelify Sans', cursive, sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  line-height: 1.15;
  color: var(--text-primary);
}

.about-description {
  font-size: 0.96rem;
  line-height: 1.75;
  color: #b8bccb;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.about-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  position: relative;
  z-index: 2;
}

.tag-pill {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  font-weight: 500;
  color: #8c909e;
  background: #1b1c20;
  padding: 5px 12px;
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
  margin-top: 4px;
  position: relative;
  z-index: 2;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 13px 26px;
  border-radius: 999px;
  background: #23252b;
  color: #ffffff;
  text-decoration: none;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 0.92rem;
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
  .about-detail-page {
    padding: 18px 16px 74px;
  }
  .about-card {
    padding: 28px 22px;
    border-radius: 26px;
    gap: 20px;
  }
  .about-title {
    font-size: 2.1rem;
  }
}
</style>
