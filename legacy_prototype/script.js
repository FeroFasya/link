// Interaksi tactile neumorphism
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.neu-link-btn');

  buttons.forEach(btn => {
    // Memberikan efek sentuhan / klik yang responsif
    btn.addEventListener('mousedown', () => {
      btn.classList.add('pressed');
    });

    btn.addEventListener('mouseup', () => {
      setTimeout(() => {
        btn.classList.remove('pressed');
      }, 150);
    });

    btn.addEventListener('mouseleave', () => {
      btn.classList.remove('pressed');
    });

    // Touch event untuk mobile/smartphone
    btn.addEventListener('touchstart', () => {
      btn.classList.add('pressed');
    }, { passive: true });

    btn.addEventListener('touchend', () => {
      setTimeout(() => {
        btn.classList.remove('pressed');
      }, 150);
    }, { passive: true });
  });

  // ==========================================================
  // LOGIKA MESIN WAKTU & KOMENTAR (SIMULASI LOCALSTORAGE)
  // ==========================================================

  const commentInput = document.getElementById('commentInput');
  const btnSendComment = document.getElementById('btnSendComment');
  const nameModal = document.getElementById('nameModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const visitorNameInput = document.getElementById('visitorNameInput');
  const btnAnonymous = document.getElementById('btnAnonymous');
  const btnConfirmSend = document.getElementById('btnConfirmSend');
  const toastSuccess = document.getElementById('toastSuccess');
  const floatingTimeMachine = document.getElementById('floatingTimeMachine');
  const floatingBadgeCount = document.getElementById('floatingBadgeCount');

  let pendingComment = '';
  const STORAGE_KEY = 'fero_time_capsule_comments';

  // Update badge count
  function updateBadge() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (floatingBadgeCount) {
        if (stored.length > 0) {
          floatingBadgeCount.textContent = stored.length > 99 ? '99+' : stored.length;
          floatingBadgeCount.style.display = 'flex';
        } else {
          floatingBadgeCount.style.display = 'none';
        }
      }
    } catch (e) {
      if (floatingBadgeCount) floatingBadgeCount.style.display = 'none';
    }
  }

  updateBadge();

  // Buka Modal Identitas saat tombol kirim ditekan
  function triggerCommentModal() {
    const text = commentInput.value.trim();
    if (!text) {
      commentInput.focus();
      commentInput.classList.add('shake');
      setTimeout(() => commentInput.classList.remove('shake'), 400);
      return;
    }

    pendingComment = text;
    nameModal.classList.add('active');
    nameModal.setAttribute('aria-hidden', 'false');
    visitorNameInput.value = '';
    setTimeout(() => visitorNameInput.focus(), 150);
  }

  // Tutup Modal
  function closeModal() {
    nameModal.classList.remove('active');
    nameModal.setAttribute('aria-hidden', 'true');
    pendingComment = '';
    visitorNameInput.value = '';
  }

  // Tampilkan Toast Notifikasi
  function showToast(message) {
    if (!toastSuccess) return;
    if (message) {
      toastSuccess.querySelector('span').textContent = message;
    }
    toastSuccess.classList.add('show');
    toastSuccess.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      toastSuccess.classList.remove('show');
      toastSuccess.setAttribute('aria-hidden', 'true');
    }, 3200);
  }

  // Simpan komentar ke LocalStorage
  function saveComment(authorName) {
    if (!pendingComment) return;

    const author = authorName ? authorName.trim() : 'Anonim 🕵️';
    const newEntry = {
      id: Date.now(),
      author: author,
      text: pendingComment,
      timestamp: new Date().toISOString(),
      displayDate: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      existing.unshift(newEntry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch (e) {
      console.warn('Gagal menyimpan ke localStorage:', e);
    }

    commentInput.value = '';
    closeModal();
    updateBadge();
    showToast(`Pesan dari "${author}" berhasil dikirim ke Mesin Waktu! ✨`);
  }

  // Event Listeners Comment Input
  if (btnSendComment) {
    btnSendComment.addEventListener('click', triggerCommentModal);
  }

  if (commentInput) {
    commentInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerCommentModal();
      }
    });
  }

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', closeModal);
  }

  if (nameModal) {
    nameModal.addEventListener('click', (e) => {
      if (e.target === nameModal) closeModal();
    });
  }

  // Tombol Anonim
  if (btnAnonymous) {
    btnAnonymous.addEventListener('click', () => {
      saveComment('Anonim 🕵️');
    });
  }

  // Tombol Konfirmasi Nama
  if (btnConfirmSend) {
    btnConfirmSend.addEventListener('click', () => {
      const name = visitorNameInput.value.trim() || 'Anonim 🕵️';
      saveComment(name);
    });
  }

  if (visitorNameInput) {
    visitorNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const name = visitorNameInput.value.trim() || 'Anonim 🕵️';
        saveComment(name);
      } else if (e.key === 'Escape') {
        closeModal();
      }
    });
  }

  // ==========================================================
  // DRAGGABLE LOGIC FLOATING MESIN WAKTU (DRAG & CLICK SEPARATION)
  // ==========================================================
  if (floatingTimeMachine) {
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;
    let dragDistance = 0;

    const onPointerDown = (e) => {
      if (e.button && e.button !== 0) return;

      dragDistance = 0;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      startX = clientX;
      startY = clientY;

      const rect = floatingTimeMachine.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      floatingTimeMachine.classList.add('dragging');

      const onPointerMove = (moveEvent) => {
        const curX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX;
        const curY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY;
        const dx = curX - startX;
        const dy = curY - startY;
        dragDistance = Math.hypot(dx, dy);

        if (dragDistance > 4) {
          if (moveEvent.cancelable) moveEvent.preventDefault();
          let newX = initialLeft + dx;
          let newY = initialTop + dy;
          const maxX = window.innerWidth - rect.width - 10;
          const maxY = window.innerHeight - rect.height - 10;
          newX = Math.max(10, Math.min(newX, maxX));
          newY = Math.max(10, Math.min(newY, maxY));

          floatingTimeMachine.style.left = `${newX}px`;
          floatingTimeMachine.style.top = `${newY}px`;
          floatingTimeMachine.style.right = 'auto';
          floatingTimeMachine.style.bottom = 'auto';
        }
      };

      const onPointerUp = () => {
        window.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('mouseup', onPointerUp);
        window.removeEventListener('touchmove', onPointerMove);
        window.removeEventListener('touchend', onPointerUp);

        floatingTimeMachine.classList.remove('dragging');

        // Jika tidak di-drag (atau digeser < 6px), anggap sebagai klik/tap buka halaman
        if (dragDistance < 6) {
          document.body.classList.add('page-exiting');
          document.body.classList.add('is-exiting');
          setTimeout(() => {
            window.location.href = 'mesin-waktu.html';
          }, 260);
        }
      };

      window.addEventListener('mousemove', onPointerMove, { passive: false });
      window.addEventListener('mouseup', onPointerUp);
      window.addEventListener('touchmove', onPointerMove, { passive: false });
      window.addEventListener('touchend', onPointerUp);
    };

    floatingTimeMachine.addEventListener('mousedown', onPointerDown);
    floatingTimeMachine.addEventListener('touchstart', onPointerDown, { passive: false });
  }

  // ==========================================================
  // OPENING / LOADING SCREEN WITH OPENING.GIF (~0.7 detik)
  // Hanya muncul jika pengunjung pertama kali masuk di sesi browser
  // ==========================================================
  const openingLoader = document.getElementById('openingLoader');
  if (openingLoader) {
    if (sessionStorage.getItem('fero_visited_session')) {
      openingLoader.remove();
    } else {
      sessionStorage.setItem('fero_visited_session', 'true');
      const minLoadTime = 2000; // 0.75 detik (nol koma sekian detik)
      setTimeout(() => {
        openingLoader.classList.add('hidden');
        setTimeout(() => {
          openingLoader.remove();
        }, 450);
      }, minLoadTime);
    }
  }

  // ==========================================================
  // SMOOTH PAGE TRANSITION (GLIDE & FADE EXIT ANIMATION)
  // ==========================================================
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
      link.addEventListener('click', (e) => {
        if (link.target === '_blank' || e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        document.body.classList.add('page-exiting');
        document.body.classList.add('is-exiting');
        setTimeout(() => {
          window.location.href = href;
        }, 260);
      });
    }
  });

  window.addEventListener('pageshow', (event) => {
    document.body.classList.remove('page-exiting');
    document.body.classList.remove('is-exiting');
  });

  console.log('Neumorphism Linktree & Mesin Waktu Prototype Loaded.');
});
