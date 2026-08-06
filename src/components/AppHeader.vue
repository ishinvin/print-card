<template>
  <div>
    <h1>Print Card A4</h1>
    <p class="sub">Tap a card to browse for an image.</p>
  </div>
</template>

<style scoped>
h1 {
  font-size: 20px;
  margin: 0 0 6px;
}

.sub {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 20px;
  line-height: 1.4;
}

@media (max-width: 880px) {
  h1 {
    font-size: 16px;
    margin: 0;
  }

  .sub {
    font-size: 11px;
    margin: 0;
  }
}
</style>
