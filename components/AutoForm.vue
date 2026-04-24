<!--
  AutoForm.vue - Schema-Driven Form Component (Vue 2 + Element UI)

  Props:
    :formObj   - Form schema object (required)
    :editForm  - Form data object   (required)
    :labelPosition - 'right' | 'left' | 'top' (default: 'right')
    :labelWidth    - e.g. '150px' (default: '150px')

  Schema Field Structure:
    {
      [fieldKey]: {
        label: String,          // Field label
        html: String,           // Field type (see supported types below)
        defaultData: Array,     // Options for select / checkbox / radio / radioSwitch
                                //   [{ label, value, disabled? }]
        rules: Array,           // Element UI validation rules
        tip: String,            // Tooltip content (shows ℹ icon)
        hide: Boolean,          // Dynamically hide the field
        disabled: Boolean,      // Disable the input
        size: String,           // Element UI size: 'small' | 'medium' | 'large'
        placeholder: String,
        // --- input / number specific ---
        type: String,           // e.g. 'textarea', 'password'
        min: Number,
        max: Number,
        step: Number,
        stepStrictly: Boolean,
        maxlength: Number,
        rows: Number,
        cols: Number,
        resize: String,
        width: Number,          // px
        append: String,         // Input slot append text
        prepend: String,        // Input slot prepend text
        suffix: String,         // Text shown after number input
        // --- select specific ---
        multiple: Boolean,
        limit: Number,
        allowCreate: Boolean,
        style: Object,
        // --- checkbox specific ---
        checkAll: Boolean,
        isIndeterminate: Boolean,
        // --- singleCheckBox specific ---
        boxLabel: String,
        // --- slot ---
        slot: String,           // Named slot for fully custom field rendering
      }
    }

  Supported html types:
    'index'         - Display-only, shows editForm[key]
    'str'           - Display-only, resolves value from defaultData map
    'text'          - Display-only, shows raw editForm[key]
    'html'          - Renders item.label as raw HTML (for dividers / hints)
    'input'         - el-input (text, textarea, password...)
    'number'        - el-input-number
    'radioSwitch'   - el-radio-group with el-radio-button style
    'switch'        - el-switch (boolean toggle)
    'select'        - el-select (single or multiple)
    'radio'         - el-radio-group with el-radio-button style
    'state'         - Preset radio: 1 = Enabled / 0 = Disabled
    'checkbox'      - el-checkbox-group with select-all support
    'checkboxButton'- el-checkbox-group with button style
    'singleCheckBox'- Single el-checkbox

  Events:
    @change       - Emitted on any field value change
    @checkForm    - Emitted with validation result (Boolean) when checkForm() is called
    @returnData   - Emitted from number input with { [key]: value }

  Methods (via ref):
    checkForm()   - Triggers Element UI form validation
-->
<template>
  <div>
    <el-form
      :model="editForm"
      ref="editForm"
      :label-position="labelPosition || 'right'"
      :label-width="labelWidth || '150px'"
      @submit.native.prevent
      onsubmit="return false"
    >
      <template v-for="(item, index) in formObj">
        <div :key="index">

          <!-- index: display-only, raw value -->
          <template v-if="item.html === 'index'">
            <el-form-item :label="item.label" :prop="index" :rules="item.rules">
              {{ editForm[index] }}
            </el-form-item>
          </template>

          <!-- str: display-only, resolve label from defaultData map -->
          <template v-if="item.html === 'str'">
            <el-form-item :label="item.label">
              {{
                item.defaultData
                  ? item.defaultData[editForm[index]].label
                  : editForm[index]
              }}
            </el-form-item>
          </template>

          <!-- text: display-only, raw value -->
          <template v-if="item.html === 'text'">
            <el-form-item :label="item.label">
              {{ editForm[index] }}
            </el-form-item>
          </template>

          <!-- html: renders item.label as raw HTML (dividers, hints) -->
          <template v-if="item.html === 'html'">
            <el-form-item label="" style="margin-bottom: 5px;">
              <div v-html="item.label"></div>
            </el-form-item>
          </template>

          <!-- input: el-input, supports text / textarea / password -->
          <template v-if="item.html === 'input'">
            <el-form-item
              v-show="!item.hide"
              :prop="index"
              :rules="item.rules"
            >
              <span slot="label">
                <el-tooltip
                  v-if="item.tip"
                  class="item"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                  style="float: right"
                >
                  <i class="el-icon-info"></i>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </span>
              <el-input
                v-model="editForm[index]"
                :type="item.type"
                :step="item.step"
                :size="item.size || ''"
                :disabled="item.disabled"
                :maxlength="item.maxlength"
                :min="item.min"
                :max="item.max"
                :rows="item.rows"
                :cols="item.cols"
                :resize="item.resize"
                :placeholder="item.placeholder"
                :style="item.width ? `width:${item.width}px` : false"
                @change="valueChange"
                clearable
              >
                <template v-if="item.append" slot="append">{{ item.append }}</template>
                <template v-if="item.prepend" slot="prepend">{{ item.prepend }}</template>
              </el-input>
            </el-form-item>
          </template>

          <!-- number: el-input-number -->
          <template v-if="item.html === 'number'">
            <el-form-item
              v-show="!item.hide"
              :prop="index"
              :rules="item.rules"
            >
              <span slot="label">
                <el-tooltip
                  v-if="item.tip"
                  class="item"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                  style="float: right"
                >
                  <i class="el-icon-info"></i>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </span>
              <el-input-number
                v-model="editForm[index]"
                :min="item.min"
                :max="item.max"
                :step="item.step"
                :step-strictly="item.stepStrictly"
                :size="item.size || 'medium'"
                :disabled="item.disabled"
                @change="valueChange"
              />
              <span v-if="item.suffix" style="margin-left: 5px">{{ item.suffix }}</span>
            </el-form-item>
          </template>

          <!-- radioSwitch: radio group rendered as buttons -->
          <template v-if="item.html === 'radioSwitch'">
            <el-form-item
              v-show="!item.hide"
              :prop="index"
              :rules="item.rules"
            >
              <span slot="label">
                <el-tooltip
                  v-if="item.tip"
                  class="item"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                  style="float: right"
                >
                  <i class="el-icon-info"></i>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </span>
              <el-radio-group
                v-model="editForm[index]"
                :disabled="item.disabled"
                @change="valueChange"
              >
                <el-radio-button
                  v-for="(opt, key) in item.defaultData"
                  :key="key"
                  :label="opt.value"
                  :disabled="opt.disabled"
                >{{ opt.label }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </template>

          <!-- switch: boolean toggle -->
          <template v-if="item.html === 'switch'">
            <el-form-item
              v-show="!item.hide"
              :prop="index"
              :rules="item.rules"
            >
              <span slot="label">
                <el-tooltip
                  v-if="item.tip"
                  class="item"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                  style="float: right"
                >
                  <i class="el-icon-info"></i>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </span>
              <el-switch
                v-model="editForm[index]"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="Enabled"
                inactive-text="Disabled"
                :disabled="item.disabled"
                :size="item.size || 'small'"
                @change="valueChange"
              />
            </el-form-item>
          </template>

          <!-- select: single or multiple select -->
          <template v-if="item.html === 'select'">
            <el-form-item
              v-show="!item.hide"
              :prop="index"
              :rules="item.rules"
            >
              <span slot="label">
                <el-tooltip
                  v-if="item.tip"
                  class="item"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                  style="float: right"
                >
                  <i class="el-icon-info"></i>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </span>
              <el-select
                v-model="editForm[index]"
                clearable
                filterable
                :size="item.size || 'small'"
                :disabled="item.disabled"
                :multiple="item.multiple"
                :multiple-limit="item.limit > 0 ? item.limit : 0"
                :allow-create="item.allowCreate"
                :style="item.style || { width: '100%' }"
                @change="valueChange"
              >
                <el-option
                  v-for="opt in item.defaultData"
                  :key="opt.value"
                  :label="opt.label"
                  :value="typeof opt.value === 'number' ? opt.value.toString() : opt.value"
                  :disabled="opt.disabled"
                />
              </el-select>
            </el-form-item>
          </template>

          <!-- radio: radio group with button style -->
          <template v-if="item.html === 'radio'">
            <el-form-item
              v-show="!item.hide"
              :prop="index"
              :rules="item.rules"
            >
              <span slot="label">
                <el-tooltip
                  v-if="item.tip"
                  class="item"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                  style="float: right"
                >
                  <i class="el-icon-info"></i>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </span>
              <el-radio-group v-model="editForm[index]" @change="valueChange">
                <el-radio-button
                  v-for="(opt, key) in item.defaultData"
                  :key="key"
                  :label="opt.value"
                  :disabled="opt.disabled"
                >{{ opt.label }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </template>

          <!-- state: preset Enabled(1) / Disabled(0) radio -->
          <template v-if="item.html === 'state'">
            <el-form-item
              v-show="!item.hide"
              :prop="index"
              :rules="item.rules"
            >
              <span slot="label">
                <el-tooltip
                  v-if="item.tip"
                  class="item"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                  style="float: right"
                >
                  <i class="el-icon-info"></i>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </span>
              <el-radio-group
                v-model="editForm[index]"
                :disabled="item.disabled"
                @change="valueChange"
              >
                <el-radio :label="1">Enabled</el-radio>
                <el-radio :label="0">Disabled</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>

          <!-- checkbox: checkbox group with select-all support -->
          <template v-if="item.html === 'checkbox'">
            <el-form-item
              v-show="!item.hide"
              :prop="index"
              :rules="item.rules"
            >
              <span slot="label">
                <el-tooltip
                  v-if="item.tip"
                  class="item"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                  style="float: right"
                >
                  <i class="el-icon-info"></i>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </span>
              <el-checkbox
                :indeterminate="item.isIndeterminate"
                v-model="item.checkAll"
                @change="(e) => handleCheckAllChange(e, item, index)"
              >Select All</el-checkbox>
              <div style="margin: 15px 0"></div>
              <el-checkbox-group
                v-model="editForm[index]"
                size="small"
                @change="valueChange"
              >
                <el-checkbox
                  v-for="(opt, key) in item.defaultData"
                  :key="key"
                  :label="opt.value"
                  :disabled="opt.disabled"
                  @change="(e) => mulitFunction(e, item, index)"
                >{{ opt.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </template>

          <!-- checkboxButton: checkbox group with button style -->
          <template v-if="item.html === 'checkboxButton'">
            <el-form-item
              v-show="!item.hide"
              :prop="index"
              :rules="item.rules"
            >
              <span slot="label">
                <el-tooltip
                  v-if="item.tip"
                  class="item"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                  style="float: right"
                >
                  <i class="el-icon-info"></i>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </span>
              <el-checkbox-group
                v-model="editForm[index]"
                size="small"
                @change="valueChange"
              >
                <el-checkbox-button
                  v-for="(opt, key) in item.defaultData"
                  :key="key"
                  :label="opt.value"
                  :disabled="opt.disabled"
                >{{ opt.label }}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </template>

          <!-- singleCheckBox: single checkbox -->
          <template v-if="item.html === 'singleCheckBox'">
            <el-form-item
              v-show="!item.hide"
              :prop="index"
              :rules="item.rules"
            >
              <span slot="label">
                <el-tooltip
                  v-if="item.tip"
                  class="item"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                  style="float: right"
                >
                  <i class="el-icon-info"></i>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </span>
              <el-checkbox
                v-model="editForm[index]"
                @change="valueChange"
              >{{ item.boxLabel }}</el-checkbox>
            </el-form-item>
          </template>

        </div>

        <!-- Named slot for fully custom field rendering -->
        <slot v-if="item.slot" :name="item.slot" :item="item"></slot>

      </template>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AutoForm',

  props: {
    /** Form schema: defines what fields to render and how */
    formObj: {
      type: Object,
      required: true,
    },
    /** Form data: bound to field values */
    editForm: {
      type: Object,
      required: true,
    },
    /** Element UI label position */
    labelPosition: {
      type: String,
      default: 'right',
    },
    /** Element UI label width */
    labelWidth: {
      type: String,
      default: '150px',
    },
  },

  methods: {
    /** Emit change event when any field value changes */
    valueChange() {
      this.$emit('change')
    },

    /** Trigger Element UI form validation, emit result via @checkForm */
    checkForm() {
      this.$refs['editForm'].validate((valid) => {
        this.$emit('checkForm', valid)
      })
    },

    /** Handle select-all checkbox change */
    handleCheckAllChange(val, item, key) {
      const options = Object.keys(item.defaultData).map((v) => v)
      this.editForm[key] = val ? options : []
      this.formObj[key].isIndeterminate = false
    },

    /** Update indeterminate state when individual checkboxes change */
    handleCheckedChange(value, item, key) {
      const options = Object.keys(item.defaultData).map((v) => v)
      const checkedCount = this.editForm[key].length
      this.formObj[key].checkAll = checkedCount === options.length
      this.formObj[key].isIndeterminate =
        checkedCount > 0 && checkedCount < options.length
    },

    mulitFunction(value, options, key) {
      this.valueChange()
      this.handleCheckedChange(value, options, key)
    },
  },
}
</script>

<style scoped>
.el-form-item {
  text-align: left !important;
}
.el-checkbox {
  margin: 0 10px !important;
}
</style>
