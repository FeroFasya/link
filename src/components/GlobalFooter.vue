<template>
  <footer class="footer">
    <p class="footer-text">ferooooooooooo :3</p>
  </footer>
</template>

<style scoped>
.footer {
  position: fixed;
  bottom: 14px;
  left: 0;
  width: 100%;
  text-align: center;
  z-index: 50;
  pointer-events: none;
}

.footer-text {
  display: inline-block;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 0.8rem;
  font-weight: 400;
  color: var(--text-secondary);
  opacity: 0.45;
  letter-spacing: 0.6px;
  transition: opacity 0.25s ease, color 0.25s ease;
  user-select: none;
  pointer-events: auto;
}

.footer-text:hover {
  opacity: 0.85;
  color: var(--text-primary);
}
</style>
