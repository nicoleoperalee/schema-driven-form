<template>
  <div class="home">

    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <div class="badge">Vue 3 + Element Plus</div>
        <h1>Schema-Driven Forms,<br />Zero Repetition</h1>
        <p class="hero-sub">
          Define your form once as a plain JavaScript object.
          AutoForm renders every field, handles validation, and reacts to
          dynamic visibility — no template boilerplate needed.
        </p>
        <div class="hero-actions">
          <router-link to="/demo" class="btn-primary">Try Live Demo →</router-link>
          <a
            href="https://github.com/nicoleoperalee/schema-driven-form"
            target="_blank"
            rel="noopener"
            class="btn-ghost"
          >View on GitHub</a>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">What makes it interesting</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">📋</div>
            <h3>Schema-first</h3>
            <p>
              Pass a plain object — AutoForm maps each key to the right
              Element Plus component automatically.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>13 field types</h3>
            <p>
              input, number, select, radio, radioSwitch, switch,
              checkbox, checkboxButton, singleCheckBox, state, and more.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">✅</div>
            <h3>Built-in validation</h3>
            <p>
              Pass Element Plus rules directly in the schema.
              Call <code>checkForm()</code> via ref to trigger validation programmatically.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">👁️</div>
            <h3>Dynamic visibility</h3>
            <p>
              Set <code>hide: true</code> on any field at runtime.
              Vue's reactivity handles the rest — no extra wiring needed.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔧</div>
            <h3>Named slots</h3>
            <p>
              Escape-hatch for fully custom rendering.
              Set <code>slot: 'mySlot'</code> in the schema and write whatever
              template you need.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💡</div>
            <h3>Tooltip support</h3>
            <p>
              Add <code>tip: '...'</code> to any field schema entry to get an
              auto-rendered info tooltip next to the label.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Code snippet -->
    <section class="code-section">
      <div class="container">
        <h2 class="section-title">From schema to form in seconds</h2>
        <div class="code-compare">
          <div class="code-block">
            <div class="code-header">Schema (formObj)</div>
            <pre><code>{{ schemaSnippet }}</code></pre>
          </div>
          <div class="code-arrow">→</div>
          <div class="preview-block">
            <div class="code-header">Rendered form</div>
            <div class="mini-demo">
              <AutoForm
                :formObj="previewSchema"
                :editForm="previewData"
                label-width="100px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <h2>See it in action</h2>
      <p>Switch between Basic and Advanced examples, edit the form, and watch the JSON update live.</p>
      <router-link to="/demo" class="btn-primary">Open the Demo →</router-link>
    </section>

  </div>
</template>

<script>
import AutoForm from '@/components/AutoForm.vue'

export default {
  components: { AutoForm },

  data() {
    return {
      schemaSnippet: `{
  username: {
    html: 'input',
    label: 'Username',
    tip: 'Your public display name',
    rules: [{ required: true }],
  },
  role: {
    html: 'select',
    label: 'Role',
    defaultData: [
      { label: 'Admin',  value: 'admin' },
      { label: 'Editor', value: 'editor' },
    ],
  },
  active: {
    html: 'switch',
    label: 'Active',
  },
}`,

      previewSchema: {
        username: {
          html: 'input',
          label: 'Username',
          tip: 'Your public display name',
          placeholder: 'e.g. mia_dev',
          rules: [{ required: true, message: 'Required', trigger: 'blur' }],
        },
        role: {
          html: 'select',
          label: 'Role',
          defaultData: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
          ],
        },
        active: {
          html: 'switch',
          label: 'Active',
        },
      },

      previewData: {
        username: '',
        role: 'editor',
        active: true,
      },
    }
  },
}
</script>

<style scoped>
.home {
  padding-bottom: 60px;
}

/* Hero */
.hero {
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f4fd 100%);
  padding: 80px 24px 72px;
  text-align: center;
}

.hero-inner {
  max-width: 700px;
  margin: 0 auto;
}

.badge {
  display: inline-block;
  background: #e0eaff;
  color: #3b5bdb;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 4px 12px;
  border-radius: 99px;
  margin-bottom: 20px;
}

.hero h1 {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 800;
  line-height: 1.18;
  margin-bottom: 20px;
  color: #0f172a;
}

.hero-sub {
  font-size: 18px;
  color: #475569;
  line-height: 1.65;
  margin-bottom: 36px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Buttons */
.btn-primary {
  display: inline-block;
  background: #409eff;
  color: #fff;
  text-decoration: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  transition: background 0.2s, transform 0.1s;
}

.btn-primary:hover {
  background: #2b85e4;
  transform: translateY(-1px);
}

.btn-ghost {
  display: inline-block;
  color: #409eff;
  text-decoration: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  border: 1.5px solid #409eff;
  transition: background 0.2s;
}

.btn-ghost:hover {
  background: #e8f4ff;
}

/* Features */
.features {
  padding: 72px 24px;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 48px;
  color: #0f172a;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.feature-card {
  background: #fff;
  border: 1px solid #e8eaf0;
  border-radius: 12px;
  padding: 28px 24px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.feature-card:hover {
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.1);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 28px;
  margin-bottom: 12px;
}

.feature-card h3 {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1a1a2e;
}

.feature-card p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
}

.feature-card code {
  background: #f1f5f9;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 13px;
  color: #3b5bdb;
}

/* Code section */
.code-section {
  background: #fff;
  padding: 72px 24px;
  border-top: 1px solid #e8eaf0;
  border-bottom: 1px solid #e8eaf0;
}

.code-compare {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.code-block {
  flex: 1;
  min-width: 280px;
}

.code-arrow {
  font-size: 28px;
  color: #409eff;
  align-self: center;
  flex-shrink: 0;
}

.preview-block {
  flex: 1;
  min-width: 280px;
}

.code-header {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 10px;
}

pre {
  background: #0f172a;
  color: #e2e8f0;
  padding: 20px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
}

.mini-demo {
  background: #f8f9fb;
  border: 1px solid #e8eaf0;
  border-radius: 10px;
  padding: 20px;
}

/* CTA */
.cta {
  padding: 72px 24px;
  text-align: center;
}

.cta h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #0f172a;
}

.cta p {
  color: #475569;
  font-size: 16px;
  margin-bottom: 28px;
}
</style>
