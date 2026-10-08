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

    <!-- Toast Notification -->
    <Teleport to="body">
      <div
        class="neu-toast"
        :class="{ show: toast.visible }"
        role="status"
        aria-live="polite"
      >
        <span>{{ toast.message }}</span>
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
  message: ''
})

let toastTimeout = null

const showToast = (message) => {
  if (toastTimeout) clearTimeout(toastTimeout)
  toast.value = { visible: true, message }
  toastTimeout = setTimeout(() => {
    toast.value.visible = false
  }, 3200)
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
    showToast(`Pesan dari "${author}" berhasil dikirim ke Mesin Waktu! ✨`)
  } catch (err) {
    console.error('Gagal mengirim pesan:', err)
    showToast('Waduh, gagal mengirim pesan ke mesin waktu.')
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

.neu-toast {
  position: fixed;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%) translateY(40px);
  background: #1e1f23;
  box-shadow: 8px 8px 20px #111215, -8px -8px 20px #2b2d35;
  color: var(--text-primary);
  padding: 12px 24px;
  border-radius: 999px;
  font-size: 0.84rem;
  font-weight: 500;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
}

.neu-toast.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
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
