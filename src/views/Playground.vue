<template>
  <div class="pg">

    <div class="pg-header">
      <h1>{{ t.title }}</h1>
      <p>{{ t.subtitle }}</p>
    </div>

    <div class="pg-layout">

      <!-- ── Left: Component Picker ── -->
      <aside class="pg-picker">
        <div class="panel-title">{{ t.picker }}</div>

        <div
          v-for="comp in components"
          :key="comp.id"
          class="comp-card"
          :class="{ active: comp.enabled }"
        >
          <!-- Card header: toggle + name + expand -->
          <div class="comp-header" @click="toggleExpand(comp)">
            <el-switch
              v-model="comp.enabled"
              size="small"
              @click.stop
            />
            <span class="comp-icon">{{ comp.icon }}</span>
            <span class="comp-name">{{ t.components[comp.id] }}</span>
            <el-icon class="expand-icon" :class="{ rotated: comp.expanded }">
              <ArrowDown />
            </el-icon>
          </div>

          <!-- Config panel -->
          <div v-show="comp.expanded" class="comp-config" @click.stop>

            <!-- Common: label -->
            <div class="cfg-row">
              <label>{{ t.config.label }}</label>
              <el-input v-model="comp.config.label" size="small" />
            </div>

            <!-- ── input ── -->
            <template v-if="comp.html === 'input'">
              <div class="cfg-row">
                <label>{{ t.config.inputType }}</label>
                <el-radio-group v-model="comp.config.type" size="small">
                  <el-radio-button
                    v-for="(name, val) in t.inputTypes"
                    :key="val"
                    :value="val"
                  >{{ name }}</el-radio-button>
                </el-radio-group>
              </div>
              <div class="cfg-row">
                <label>{{ t.config.placeholder }}</label>
                <el-input v-model="comp.config.placeholder" size="small" />
              </div>
              <div class="cfg-row">
                <label>{{ t.config.tip }}</label>
                <el-input v-model="comp.config.tip" size="small" />
              </div>
              <div class="cfg-row">
                <label>{{ t.config.maxlength }}</label>
                <el-input-number
                  v-model="comp.config.maxlength"
                  size="small"
                  :min="0"
                  :max="9999"
                  style="width: 100%"
                />
              </div>
              <div class="cfg-checks">
                <el-checkbox v-model="comp.config.required">{{ t.config.required }}</el-checkbox>
                <el-checkbox v-model="comp.config.disabled">{{ t.config.disabled }}</el-checkbox>
              </div>
            </template>

            <!-- ── number ── -->
            <template v-if="comp.html === 'number'">
              <div class="cfg-row">
                <label>{{ t.config.min }}</label>
                <el-input-number v-model="comp.config.min" size="small" style="width: 100%" />
              </div>
              <div class="cfg-row">
                <label>{{ t.config.max }}</label>
                <el-input-number v-model="comp.config.max" size="small" style="width: 100%" />
              </div>
              <div class="cfg-row">
                <label>{{ t.config.step }}</label>
                <el-input-number v-model="comp.config.step" size="small" :min="1" style="width: 100%" />
              </div>
              <div class="cfg-row">
                <label>{{ t.config.suffix }}</label>
                <el-input v-model="comp.config.suffix" size="small" />
              </div>
              <div class="cfg-checks">
                <el-checkbox v-model="comp.config.disabled">{{ t.config.disabled }}</el-checkbox>
              </div>
            </template>

            <!-- ── select ── -->
            <template v-if="comp.html === 'select'">
              <div class="cfg-checks">
                <el-checkbox v-model="comp.config.multiple">{{ t.config.multiple }}</el-checkbox>
                <el-checkbox v-model="comp.config.required">{{ t.config.required }}</el-checkbox>
                <el-checkbox v-model="comp.config.disabled">{{ t.config.disabled }}</el-checkbox>
              </div>
              <div class="cfg-row">
                <label>{{ t.config.options }}</label>
                <el-input
                  type="textarea"
                  v-model="comp.config.optionsText"
                  :rows="4"
                  size="small"
                />
              </div>
            </template>

            <!-- ── radioSwitch / radio ── -->
            <template v-if="comp.html === 'radioSwitch' || comp.html === 'radio'">
              <div class="cfg-checks">
                <el-checkbox v-model="comp.config.disabled">{{ t.config.disabled }}</el-checkbox>
              </div>
              <div class="cfg-row">
                <label>{{ t.config.options }}</label>
                <el-input
                  type="textarea"
                  v-model="comp.config.optionsText"
                  :rows="4"
                  size="small"
                />
              </div>
            </template>

            <!-- ── switch ── -->
            <template v-if="comp.html === 'switch'">
              <div class="cfg-row">
                <label>{{ t.config.tip }}</label>
                <el-input v-model="comp.config.tip" size="small" />
              </div>
              <div class="cfg-checks">
                <el-checkbox v-model="comp.config.disabled">{{ t.config.disabled }}</el-checkbox>
              </div>
            </template>

            <!-- ── state ── -->
            <template v-if="comp.html === 'state'">
              <div class="cfg-checks">
                <el-checkbox v-model="comp.config.disabled">{{ t.config.disabled }}</el-checkbox>
              </div>
            </template>

            <!-- ── checkboxButton / checkbox ── -->
            <template v-if="comp.html === 'checkboxButton' || comp.html === 'checkbox'">
              <template v-if="comp.html === 'checkbox'">
                <div class="cfg-checks">
                  <el-checkbox v-model="comp.config.showCheckAll">{{ t.config.showCheckAll }}</el-checkbox>
                </div>
              </template>
              <div class="cfg-row">
                <label>{{ t.config.options }}</label>
                <el-input
                  type="textarea"
                  v-model="comp.config.optionsText"
                  :rows="4"
                  size="small"
                />
              </div>
            </template>

            <!-- ── singleCheckBox ── -->
            <template v-if="comp.html === 'singleCheckBox'">
              <div class="cfg-row">
                <label>{{ t.config.boxLabel }}</label>
                <el-input v-model="comp.config.boxLabel" size="small" />
              </div>
              <div class="cfg-checks">
                <el-checkbox v-model="comp.config.required">{{ t.config.required }}</el-checkbox>
              </div>
            </template>

          </div>
        </div>
      </aside>

      <!-- ── Center: Live Preview ── -->
      <section class="pg-preview">
        <div class="panel-title">{{ t.preview }}</div>

        <div v-if="enabledComponents.length === 0" class="empty-state">
          {{ t.empty }}
        </div>

        <template v-else>
          <div class="form-wrap">
            <AutoForm
              ref="pgForm"
              :formObj="formObj"
              :editForm="formValues"
              label-width="130px"
              @checkForm="onValidated"
            />
            <div class="form-actions">
              <el-button type="primary" @click="submit">{{ t.submit }}</el-button>
              <el-button @click="resetForm">{{ t.reset }}</el-button>
            </div>
          </div>

          <div class="json-section">
            <div class="json-label">{{ t.liveData }}</div>
            <pre class="json-out">{{ liveJson }}</pre>
          </div>
        </template>
      </section>

      <!-- ── Right: Generated Code ── -->
      <aside class="pg-code">
        <div class="code-title-row">
          <span class="panel-title">{{ t.code }}</span>
          <el-button size="small" type="primary" plain @click="copyCode">
            {{ copied ? t.copied : t.copy }}
          </el-button>
        </div>
        <pre class="code-out">{{ generatedCode }}</pre>
      </aside>

    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { lang, messages } from '@/i18n'
import { ElMessage } from 'element-plus'
import AutoForm from '@/components/AutoForm.vue'

export default {
  components: { AutoForm },

  setup() {
    const t = computed(() => messages[lang.value].playground)
    return { t }
  },

  data() {
    return {
      formObj: {},
      formValues: {},
      copied: false,

      components: [
        {
          id: 'input', html: 'input', key: 'inputField',
          icon: '✏️', enabled: true, expanded: true,
          config: {
            label: 'Text Input', type: 'text',
            placeholder: '', tip: '', maxlength: null,
            required: false, disabled: false,
          },
        },
        {
          id: 'number', html: 'number', key: 'numberField',
          icon: '🔢', enabled: false, expanded: false,
          config: { label: 'Number', min: 0, max: 100, step: 1, suffix: '', disabled: false },
        },
        {
          id: 'select', html: 'select', key: 'selectField',
          icon: '📋', enabled: false, expanded: false,
          config: {
            label: 'Select',
            multiple: false, required: false, disabled: false,
            optionsText: 'Option A,a\nOption B,b\nOption C,c',
          },
        },
        {
          id: 'radioSwitch', html: 'radioSwitch', key: 'radioSwitchField',
          icon: '🔘', enabled: false, expanded: false,
          config: {
            label: 'Radio Switch', disabled: false,
            optionsText: 'Option A,a\nOption B,b\nOption C,c',
          },
        },
        {
          id: 'radio', html: 'radio', key: 'radioField',
          icon: '⭕', enabled: false, expanded: false,
          config: {
            label: 'Radio', disabled: false,
            optionsText: 'Yes,yes\nNo,no',
          },
        },
        {
          id: 'switch', html: 'switch', key: 'switchField',
          icon: '🔀', enabled: false, expanded: false,
          config: { label: 'Switch', tip: '', disabled: false },
        },
        {
          id: 'state', html: 'state', key: 'stateField',
          icon: '🟢', enabled: false, expanded: false,
          config: { label: 'Status', disabled: false },
        },
        {
          id: 'checkboxButton', html: 'checkboxButton', key: 'checkboxButtonField',
          icon: '🔲', enabled: false, expanded: false,
          config: {
            label: 'Checkbox Button',
            optionsText: 'Vue,vue\nLaravel,laravel\nVite,vite',
          },
        },
        {
          id: 'checkbox', html: 'checkbox', key: 'checkboxField',
          icon: '☑️', enabled: false, expanded: false,
          config: {
            label: 'Checkbox Group', showCheckAll: true,
            checkAll: false, isIndeterminate: false,
            optionsText: 'Option A,a\nOption B,b\nOption C,c',
          },
        },
        {
          id: 'singleCheckBox', html: 'singleCheckBox', key: 'singleCheckField',
          icon: '✅', enabled: false, expanded: false,
          config: {
            label: 'Agreement',
            boxLabel: 'I agree to the terms',
            required: false,
          },
        },
      ],
    }
  },

  computed: {
    enabledComponents() {
      return this.components.filter((c) => c.enabled)
    },

    liveJson() {
      const result = {}
      for (const comp of this.enabledComponents) {
        result[comp.key] = this.formValues[comp.key] ?? null
      }
      return JSON.stringify(result, null, 2)
    },

    generatedCode() {
      if (this.enabledComponents.length === 0) return '// No components selected'

      let code = '// ── Schema (formObj) ──\nconst formObj = {\n'
      for (const comp of this.enabledComponents) {
        const schema = this.buildSchema(comp)
        const str = JSON.stringify(schema, null, 2).replace(/\n/g, '\n  ')
        code += `  ${comp.key}: ${str},\n`
      }
      code += '}\n\n'

      code += '// ── Initial data (editForm) ──\nconst editForm = {\n'
      for (const comp of this.enabledComponents) {
        code += `  ${comp.key}: ${JSON.stringify(this.formValues[comp.key] ?? null)},\n`
      }
      code += '}\n\n'

      code += '// ── Template usage ──\n'
      code += '<AutoForm\n'
      code += '  ref="form"\n'
      code += '  :formObj="formObj"\n'
      code += '  :editForm="editForm"\n'
      code += '  label-width="130px"\n'
      code += '  @checkForm="onValidated"\n'
      code += '/>'

      return code
    },
  },

  watch: {
    components: {
      deep: true,
      immediate: true,
      handler() {
        this.rebuildForm()
      },
    },
  },

  methods: {
    rebuildForm() {
      const obj = {}
      for (const comp of this.enabledComponents) {
        obj[comp.key] = this.buildSchema(comp)
        if (!(comp.key in this.formValues)) {
          this.formValues[comp.key] = this.getDefaultValue(comp)
        }
      }
      this.formObj = obj
    },

    buildSchema(comp) {
      const { html, config } = comp
      const schema = { html, label: config.label }

      if (html === 'input') {
        if (config.type && config.type !== 'text') schema.type = config.type
        if (config.placeholder) schema.placeholder = config.placeholder
        if (config.tip) schema.tip = config.tip
        if (config.maxlength) schema.maxlength = config.maxlength
        if (config.disabled) schema.disabled = true
        if (config.required) {
          schema.rules = [{ required: true, message: `${config.label} is required`, trigger: 'blur' }]
        }
      } else if (html === 'number') {
        schema.min = config.min ?? 0
        schema.max = config.max ?? 100
        if (config.step && config.step !== 1) schema.step = config.step
        if (config.suffix) schema.suffix = config.suffix
        if (config.disabled) schema.disabled = true
      } else if (html === 'select') {
        schema.defaultData = this.parseOptions(config.optionsText)
        if (config.multiple) schema.multiple = true
        if (config.disabled) schema.disabled = true
        if (config.required) {
          schema.rules = [{ required: true, message: 'Please select an option', trigger: 'change' }]
        }
      } else if (html === 'radioSwitch' || html === 'radio') {
        schema.defaultData = this.parseOptions(config.optionsText)
        if (config.disabled) schema.disabled = true
      } else if (html === 'switch') {
        if (config.tip) schema.tip = config.tip
        if (config.disabled) schema.disabled = true
      } else if (html === 'state') {
        if (config.disabled) schema.disabled = true
      } else if (html === 'checkboxButton') {
        schema.defaultData = this.parseOptions(config.optionsText)
      } else if (html === 'checkbox') {
        schema.defaultData = this.parseOptions(config.optionsText)
        schema.checkAll = config.checkAll || false
        schema.isIndeterminate = config.isIndeterminate || false
        if (!config.showCheckAll) delete schema.checkAll
      } else if (html === 'singleCheckBox') {
        schema.boxLabel = config.boxLabel
        if (config.required) {
          schema.rules = [{ required: true, message: 'This field is required', trigger: 'change' }]
        }
      }

      return schema
    },

    getDefaultValue(comp) {
      const { html, config } = comp
      if (html === 'input') return ''
      if (html === 'number') return config.min ?? 0
      if (html === 'select') return config.multiple ? [] : ''
      if (html === 'radioSwitch' || html === 'radio') {
        return this.parseOptions(config.optionsText)[0]?.value ?? ''
      }
      if (html === 'switch') return false
      if (html === 'state') return 1
      if (html === 'checkboxButton' || html === 'checkbox') return []
      if (html === 'singleCheckBox') return false
      return ''
    },

    parseOptions(text) {
      return (text || '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const [label, value] = l.split(',').map((s) => s.trim())
          return { label, value: value ?? label }
        })
    },

    toggleExpand(comp) {
      comp.expanded = !comp.expanded
    },

    submit() {
      this.$refs.pgForm?.checkForm()
    },

    onValidated(valid) {
      if (valid) {
        ElMessage.success('Form is valid!')
        console.log('Form data:', { ...this.formValues })
      } else {
        ElMessage.error('Please fix the validation errors.')
      }
    },

    resetForm() {
      for (const comp of this.enabledComponents) {
        this.formValues[comp.key] = this.getDefaultValue(comp)
      }
    },

    async copyCode() {
      try {
        await navigator.clipboard.writeText(this.generatedCode)
        this.copied = true
        setTimeout(() => (this.copied = false), 2000)
      } catch {
        ElMessage.error('Copy failed — please select and copy manually.')
      }
    },
  },
}
</script>

<style scoped>
.pg {
  padding: 32px 24px 60px;
  max-width: 1400px;
  margin: 0 auto;
}

.pg-header {
  margin-bottom: 28px;
}

.pg-header h1 {
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}

.pg-header p {
  color: #64748b;
  font-size: 14px;
}

/* ── 3-column layout ── */
.pg-layout {
  display: grid;
  grid-template-columns: 260px 1fr 320px;
  gap: 20px;
  align-items: start;
}

@media (max-width: 1024px) {
  .pg-layout { grid-template-columns: 1fr; }
}

.panel-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 12px;
}

/* ── Picker ── */
.pg-picker {
  position: sticky;
  top: 72px;
  max-height: calc(100vh - 96px);
  overflow-y: auto;
}

.comp-card {
  background: #fff;
  border: 1.5px solid #e8eaf0;
  border-radius: 10px;
  margin-bottom: 8px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.comp-card.active {
  border-color: #409eff;
}

.comp-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  user-select: none;
}

.comp-header:hover {
  background: #f8f9fb;
}

.comp-icon {
  font-size: 16px;
}

.comp-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: #334155;
}

.expand-icon {
  color: #94a3b8;
  transition: transform 0.2s;
  font-size: 13px;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.comp-config {
  padding: 12px;
  border-top: 1px solid #f1f5f9;
  background: #fafbfc;
}

.cfg-row {
  margin-bottom: 10px;
}

.cfg-row label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.cfg-checks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.cfg-checks :deep(.el-checkbox__label) {
  font-size: 12px;
}

/* ── Preview ── */
.pg-preview {
  background: #fff;
  border: 1px solid #e8eaf0;
  border-radius: 12px;
  padding: 20px;
}

.empty-state {
  color: #94a3b8;
  font-size: 14px;
  padding: 40px 0;
  text-align: center;
}

.form-wrap {
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 16px;
}

.form-actions {
  margin-top: 16px;
  display: flex;
  gap: 10px;
}

.json-section {}

.json-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 8px;
}

.json-out {
  background: #0f172a;
  color: #7dd3fc;
  padding: 14px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.7;
  overflow-x: auto;
  white-space: pre-wrap;
  max-height: 260px;
  overflow-y: auto;
}

/* ── Code ── */
.pg-code {
  position: sticky;
  top: 72px;
}

.code-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.code-title-row .panel-title {
  margin-bottom: 0;
}

.code-out {
  background: #0f172a;
  color: #a5f3fc;
  padding: 16px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.75;
  overflow-x: auto;
  white-space: pre-wrap;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
}
</style>
