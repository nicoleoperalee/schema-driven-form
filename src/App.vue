<template>
  <div id="app-root">
    <nav class="navbar">
      <div class="navbar-inner">
        <span class="brand">AutoForm</span>
        <div class="nav-links">
          <router-link to="/">{{ t.nav.home }}</router-link>
          <router-link to="/demo">{{ t.nav.demo }}</router-link>
          <router-link to="/playground">{{ t.nav.playground }}</router-link>
          <a
            href="https://github.com/nicoleoperalee/schema-driven-form"
            target="_blank"
            rel="noopener"
          >{{ t.nav.github }}</a>
          <button class="lang-btn" @click="toggleLang">
            {{ lang === 'zh' ? 'EN' : '中文' }}
          </button>
        </div>
      </div>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { lang, toggleLang, messages } from '@/i18n'

export default {
  setup() {
    const t = computed(() => messages[lang.value])
    return { lang, toggleLang, t }
  },
}
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f8f9fb;
  color: #1a1a2e;
}

#app-root { min-height: 100vh; display: flex; flex-direction: column; }
main { flex: 1; }

.navbar {
  background: #fff;
  border-bottom: 1px solid #e8eaf0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #409eff, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 24px;
  align-items: center;
}

.nav-links a {
  color: #555;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #409eff;
}

.lang-btn {
  background: none;
  border: 1.5px solid #d0d5dd;
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.lang-btn:hover {
  border-color: #409eff;
  color: #409eff;
}
</style>
