<template>
  <div class="background-canvas">
    <main class="neumorphic-card">
      <!-- Profile Header (Title + Menhera GIF Mascot + Social Dock) -->
      <ProfileHeader />

      <!-- Links Container -->
      <section class="links-container">
        <!-- 1. Web Karya (Monochrome Star Watermark) -->
        <NeuLinkButton
          title="web karya"
          href="#"
          variant="star"
        />

        <!-- 2. Katalog Bisnis (Google Developers Laser Chevrons < >) -->
        <NeuLinkButton
          title="katalog bisnis"
          href="#"
          variant="laser"
        />

        <!-- 3. Resume -->
        <NeuLinkButton
          title="resume"
          href="#"
          variant="default"
        />

        <!-- 4. Project AIKA (Crescent Thumbnail) -->
        <NeuLinkButton
          title="project aika"
          to="/project/aika"
          variant="crescent"
        />

        <!-- 5. KIRA AI Trainer (Crescent Thumbnail) -->
        <NeuLinkButton
          title="kira ai trainer"
          to="/project/kira"
          variant="crescent"
        />
      </section>

      <!-- Terminal Comment Input -->
      <TerminalCommentInput
        ref="commentInputComp"
        @submit-comment="handleOpenModal"
      />
    </main>

    <!-- Floating Draggable Mesin Waktu -->
    <FloatingTimeMachine :badge-count="commentsCount" />

    <!-- Identity Modal -->
    <IdentityModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @confirm="handleConfirmComment"
    />

    <!-- WhatsApp-Style Dark Neumorphic Push Notification Popup -->
    <Teleport to="body">
      <div
        class="wa-notification"
        :class="{ show: toast.visible }"
        role="status"
        aria-live="polite"
        @click="toast.visible = false"
      >
        <!-- App Header Micro Bar -->
        <div class="wa-header">
          <div class="wa-app-badge">
            <svg class="wa-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.08L2.05 22l5.09-1.33C8.58 21.5 10.25 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2v-2zm1-12c2.76 0 5 2.24 5 5 0 1.63-.8 3.06-2.02 3.94l-.38.27V14h-2v-3h1c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3H7c0-2.76 2.24-5 5-5z"/>
            </svg>
            <span class="wa-app-title">MESIN WAKTU • FERO</span>
          </div>
          <span class="wa-timestamp">sekarang</span>
        </div>

        <!-- Notification Content -->
        <div class="wa-body">
          <div class="wa-avatar-box">
            <img src="/opening.gif" alt="avatar" class="wa-avatar-img" />
          </div>
          <div class="wa-content">
            <div class="wa-title-row">
              <span class="wa-author">{{ toast.author }}</span>
              <span class="wa-double-check" title="Terkirim ke Cloud">✓✓</span>
            </div>
            <p class="wa-message">{{ toast.text }}</p>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Fixed Footer -->
    <GlobalFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProfileHeader from '@/components/ProfileHeader.vue'
import NeuLinkButton from '@/components/NeuLinkButton.vue'
import TerminalCommentInput from '@/components/TerminalCommentInput.vue'
import FloatingTimeMachine from '@/components/FloatingTimeMachine.vue'
import IdentityModal from '@/components/IdentityModal.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'
import { timeCapsuleService } from '@/services/firebase'

const commentInputComp = ref(null)
const isModalOpen = ref(false)
const pendingText = ref('')
const commentsCount = ref(0)

const toast = ref({
  visible: false,
  author: '',
  text: ''
})

let toastTimeout = null

const showNotification = (author, text) => {
  if (toastTimeout) clearTimeout(toastTimeout)
  toast.value = {
    visible: true,
    author: author || 'Anonim 🕵️',
    text: text || 'Pesanmu berhasil terkirim ke mesin waktu! ✨'
  }
  toastTimeout = setTimeout(() => {
    toast.value.visible = false
  }, 4200)
}

const refreshCount = async () => {
  try {
    const list = await timeCapsuleService.getComments()
    commentsCount.value = list.length
  } catch (e) {
    console.error('Error fetching count:', e)
  }
}

onMounted(() => {
  refreshCount()
})

const handleOpenModal = (text) => {
  pendingText.value = text
  isModalOpen.value = true
}

const handleConfirmComment = async (authorName) => {
  isModalOpen.value = false
  const author = authorName ? authorName.trim() : 'Anonim 🕵️'
  const text = pendingText.value

  try {
    await timeCapsuleService.addComment(author, text)
    commentInputComp.value?.clearInput()
    pendingText.value = ''
    await refreshCount()
    showNotification(author, text)
  } catch (err) {
    console.error('Gagal mengirim pesan:', err)
    showNotification('System', 'Waduh, gagal mengirim pesan ke mesin waktu.')
  }
}
</script>

<style scoped>
.background-canvas {
  width: 100%;
  min-height: 100vh;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 24px 84px;
  margin: 0 auto;
}

.neumorphic-card {
  width: 100%;
  max-width: 380px;
  background: transparent;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
}

.links-container {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* WhatsApp-Style Dark Push Notification */
.wa-notification {
  position: fixed;
  top: 18px;
  left: 50%;
  transform: translateX(-50%) translateY(-140px);
  width: calc(100% - 32px);
  max-width: 380px;
  background: #202227;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.65), 6px 6px 18px #121316, -6px -6px 18px #2c2f37;
  padding: 12px 16px;
  z-index: 1000;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  user-select: none;
}

.wa-notification.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
  pointer-events: auto;
}

.wa-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.wa-app-badge {
  display: flex;
  align-items: center;
  gap: 6px;
}

.wa-icon {
  width: 14px;
  height: 14px;
  color: #25D366;
  filter: drop-shadow(0 0 4px rgba(37, 211, 102, 0.4));
}

.wa-app-title {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  color: #7e828d;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.wa-timestamp {
  font-size: 0.68rem;
  color: #5d616c;
}

.wa-body {
  display: flex;
  align-items: center;
  gap: 12px;
}

.wa-avatar-box {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #191a1d;
  box-shadow: inset 2px 2px 5px #111215, inset -2px -2px 5px #272930;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.wa-avatar-img {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.wa-content {
  flex: 1;
  min-width: 0;
}

.wa-title-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.wa-author {
  font-family: 'Pixelify Sans', cursive, sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.4px;
  line-height: 1.15;
}

.wa-double-check {
  font-size: 0.72rem;
  font-weight: 700;
  color: #53bdeb;
}

.wa-message {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 0.84rem;
  color: #b6bac7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 2px;
}

@media (max-width: 480px) {
  .background-canvas {
    padding: 30px 20px 84px;
  }
  .neumorphic-card {
    padding: 6px 0;
    gap: 20px;
  }
}
</style>
