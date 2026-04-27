<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>Live Demo</h1>
      <p>Interact with the form — the JSON output updates in real time.</p>
    </div>

    <div class="demo-container">

      <!-- Tab switcher -->
      <el-tabs v-model="activeTab" class="demo-tabs">

        <!-- ─── Basic Example ─── -->
        <el-tab-pane label="Basic Example" name="basic">
          <div class="tab-desc">
            All core field types: input, number, radioSwitch, select, state, switch, checkboxButton.
            Click <strong>Submit</strong> to trigger validation.
          </div>
          <div class="demo-layout">
            <div class="form-panel">
              <AutoForm
                ref="basicForm"
                :formObj="basicSchema"
                :editForm="basicData"
                label-width="130px"
                @change="onBasicChange"
                @checkForm="onBasicValidated"
              />
              <div class="form-actions">
                <el-button type="primary" @click="submitBasic">Submit</el-button>
                <el-button @click="resetBasic">Reset</el-button>
              </div>
            </div>
            <div class="json-panel">
              <div class="json-label">Live form data</div>
              <pre class="json-output">{{ JSON.stringify(basicData, null, 2) }}</pre>
            </div>
          </div>
        </el-tab-pane>

        <!-- ─── Advanced Example ─── -->
        <el-tab-pane label="Advanced Example" name="advanced">
          <div class="tab-desc">
            Dynamic field visibility (<strong>hide</strong>) and a fully custom
            <strong>named slot</strong>. Toggle "Has Expiry" to reveal the date field.
          </div>
          <div class="demo-layout">
            <div class="form-panel">
              <AutoForm
                ref="advancedForm"
                :formObj="advancedSchema"
                :editForm="advancedData"
                label-width="130px"
                @change="onAdvancedChange"
                @checkForm="onAdvancedValidated"
              >
                <!-- Named slot: fully custom textarea with character counter -->
                <template #notes>
                  <el-form-item label="Custom Notes">
                    <el-input
                      type="textarea"
                      v-model="advancedData.notes"
                      :rows="4"
                      :maxlength="200"
                      placeholder="Write anything here..."
                      show-word-limit
                    />
                  </el-form-item>
                </template>
              </AutoForm>
              <div class="form-actions">
                <el-button type="primary" @click="submitAdvanced">Submit</el-button>
              </div>
            </div>
            <div class="json-panel">
              <div class="json-label">Live form data</div>
              <pre class="json-output">{{ JSON.stringify(advancedData, null, 2) }}</pre>
            </div>
          </div>
        </el-tab-pane>

      </el-tabs>
    </div>
  </div>
</template>

<script>
import AutoForm from '@/components/AutoForm.vue'
import { ElMessage } from 'element-plus'

export default {
  components: { AutoForm },

  data() {
    return {
      activeTab: 'basic',

      // ── Basic ──
      basicData: {
        name: '',
        age: 18,
        gender: 'male',
        role: '',
        active: 1,
        notify: false,
        tags: [],
      },

      basicSchema: {
        name: {
          html: 'input',
          label: 'Name',
          placeholder: 'Enter your name',
          tip: 'Your public display name',
          rules: [
            { required: true, message: 'Name is required', trigger: 'blur' },
            { min: 2, max: 20, message: '2–20 characters', trigger: 'blur' },
          ],
        },
        age: {
          html: 'number',
          label: 'Age',
          min: 1,
          max: 120,
          suffix: 'years old',
        },
        gender: {
          html: 'radioSwitch',
          label: 'Gender',
          defaultData: [
            { label: 'Male',   value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other',  value: 'other' },
          ],
        },
        role: {
          html: 'select',
          label: 'Role',
          rules: [{ required: true, message: 'Please select a role', trigger: 'change' }],
          defaultData: [
            { label: 'Admin',  value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'Viewer', value: 'viewer' },
          ],
        },
        active: {
          html: 'state',
          label: 'Status',
        },
        notify: {
          html: 'switch',
          label: 'Notifications',
          tip: 'Receive email notifications when changes occur',
        },
        tags: {
          html: 'checkboxButton',
          label: 'Tech Tags',
          defaultData: [
            { label: 'Vue',        value: 'vue' },
            { label: 'Laravel',    value: 'laravel' },
            { label: 'TypeScript', value: 'ts' },
            { label: 'Vite',       value: 'vite' },
          ],
        },
      },

      // ── Advanced ──
      advancedData: {
        title: '',
        hasExpiry: false,
        expiryDate: '',
        notes: '',
      },

      advancedSchema: {
        title: {
          html: 'input',
          label: 'Title',
          rules: [{ required: true, message: 'Title is required', trigger: 'blur' }],
        },
        hasExpiry: {
          html: 'singleCheckBox',
          label: 'Has Expiry',
          boxLabel: 'This item has an expiry date',
        },
        expiryDate: {
          html: 'input',
          label: 'Expiry Date',
          type: 'date',
          hide: true,
          rules: [{ required: true, message: 'Please pick a date', trigger: 'change' }],
        },
        notes: {
          slot: 'notes',
        },
      },
    }
  },

  watch: {
    'advancedData.hasExpiry'(val) {
      this.advancedSchema.expiryDate.hide = !val
      if (!val) this.advancedData.expiryDate = ''
    },
  },

  methods: {
    // Basic
    submitBasic() {
      this.$refs.basicForm.checkForm()
    },
    onBasicValidated(isValid) {
      if (isValid) {
        ElMessage.success('Form is valid! Check the console for submitted data.')
        console.log('Basic form data:', this.basicData)
      } else {
        ElMessage.error('Please fix the validation errors.')
      }
    },
    onBasicChange() {},
    resetBasic() {
      this.basicData = {
        name: '',
        age: 18,
        gender: 'male',
        role: '',
        active: 1,
        notify: false,
        tags: [],
      }
    },

    // Advanced
    submitAdvanced() {
      this.$refs.advancedForm.checkForm()
    },
    onAdvancedValidated(isValid) {
      if (isValid) {
        ElMessage.success('Form is valid!')
        console.log('Advanced form data:', this.advancedData)
      } else {
        ElMessage.error('Please fix the validation errors.')
      }
    },
    onAdvancedChange() {},
  },
}
</script>

<style scoped>
.demo-page {
  min-height: calc(100vh - 56px);
  padding: 40px 24px 60px;
}

.demo-header {
  max-width: 1100px;
  margin: 0 auto 32px;
}

.demo-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}

.demo-header p {
  color: #64748b;
  font-size: 15px;
}

.demo-container {
  max-width: 1100px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8eaf0;
  padding: 0 24px 32px;
}

.demo-tabs {
  padding-top: 8px;
}

.tab-desc {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: #f8f9fb;
  border-radius: 8px;
  line-height: 1.6;
}

.demo-layout {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.form-panel {
  flex: 1;
  min-width: 300px;
}

.form-actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}

.json-panel {
  flex: 0 0 280px;
  position: sticky;
  top: 72px;
}

.json-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 8px;
}

.json-output {
  background: #0f172a;
  color: #7dd3fc;
  padding: 16px;
  border-radius: 10px;
  font-size: 12.5px;
  line-height: 1.7;
  overflow-x: auto;
  min-height: 200px;
  white-space: pre-wrap;
}
</style>
