<script setup>
import LanguageSwitch from "./LanguageSwitch.vue";
import HeartIcon from "./icons/HeartIcon.vue";
import GitHubIcon from "./icons/GitHubIcon.vue";
</script>

<template>
  <footer class="app-footer">
    <LanguageSwitch />
    <p class="credit">
      {{ $t("footer.developedBy") }}
      <a href="https://github.com/ishinvin" target="_blank" rel="noopener noreferrer">Ishin Vin</a>
    </p>
    <div class="footer-links">
      <a
        class="sponsor-btn"
        href="https://github.com/sponsors/ishinvin"
        target="_blank"
        rel="noopener noreferrer"
      >
        <HeartIcon />
        {{ $t("footer.sponsor") }}
      </a>
      <a
        class="sponsor-btn"
        href="https://github.com/ishinvin/print-card"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHubIcon />
        {{ $t("footer.github") }}
      </a>
    </div>
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

.footer-links {
  display: flex;
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
