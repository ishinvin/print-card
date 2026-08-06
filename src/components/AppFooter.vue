<template>
  <footer class="app-footer">
    <p class="credit">
      Developed by
      <a href="https://github.com/ishinvin" target="_blank" rel="noopener noreferrer">Ishin Vin</a>
    </p>
    <a
      class="sponsor-btn"
      href="https://github.com/sponsors/ishinvin"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path
          d="M8 14.25s-6-3.75-6-8.253A3.5 3.5 0 0 1 8 3.62 3.5 3.5 0 0 1 14 6c0 4.502-6 8.25-6 8.25Z"
        />
      </svg>
      Sponsor
    </a>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--panel-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.sponsor-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border-radius: 999px;
  border: 1px solid var(--accent);
  background: transparent;
  color: var(--accent);
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.sponsor-btn svg {
  width: 13px;
  height: 13px;
}

.sponsor-btn:hover {
  background: var(--accent);
  color: #fff;
}

.credit {
  margin: 0;
  font-size: 11px;
  color: var(--text-muted);
}

.credit a {
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
}

.credit a:hover {
  color: var(--accent-hover);
  text-decoration: underline;
}

@media (max-width: 880px) {
  .app-footer {
    padding: 16px;
    margin-top: 0;
  }
}
</style>
