<!--
  AutoForm.vue — Schema-Driven Form Component (Vue 3 + Element Plus)

  Props:
    :formObj        - Form schema object (required)
    :editForm       - Form data object   (required)
    :labelPosition  - 'right' | 'left' | 'top' (default: 'right')
    :labelWidth     - e.g. '150px' (default: '150px')

  Supported html types:
    'index'          Display-only, shows raw value
    'str'            Display-only, resolves label from defaultData map
    'text'           Display-only, shows raw value
    'html'           Renders item.label as raw HTML (dividers / hints)
    'input'          el-input (text, textarea, password...)
    'number'         el-input-number
    'radioSwitch'    el-radio-group with button style
    'switch'         el-switch (boolean toggle)
    'select'         el-select (single or multiple)
    'radio'          el-radio-group with button style
    'state'          Preset radio: 1 = Enabled / 0 = Disabled
    'checkbox'       el-checkbox-group with select-all support
    'checkboxButton' el-checkbox-group with button style
    'singleCheckBox' Single el-checkbox

  Events:
    @change      — emitted on any field value change
    @checkForm   — emitted with validation result (Boolean)

  Methods (via ref):
    checkForm()  — triggers Element Plus form validation
-->
<template>
  <div>
    <el-form
      :model="editForm"
      ref="editFormRef"
      :label-position="labelPosition"
      :label-width="labelWidth"
      @submit.prevent
    >
      <template v-for="(item, index) in formObj" :key="index">
        <div>

          <!-- index: display-only, raw value -->
          <template v-if="item.html === 'index'">
            <el-form-item :label="item.label" :prop="index" :rules="item.rules">
              {{ editForm[index] }}
            </el-form-item>
          </template>

          <!-- str: display-only, resolve label from defaultData map -->
          <template v-if="item.html === 'str'">
            <el-form-item :label="item.label">
              {{ item.defaultData ? item.defaultData[editForm[index]].label : editForm[index] }}
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
            <el-form-item label="" style="margin-bottom: 5px">
              <div v-html="item.label"></div>
            </el-form-item>
          </template>

          <!-- input: el-input, supports text / textarea / password -->
          <template v-if="item.html === 'input'">
            <el-form-item v-show="!item.hide" :prop="index" :rules="item.rules">
              <template #label>
                <el-tooltip
                  v-if="item.tip"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                >
                  <el-icon style="float: right; margin-top: 4px; cursor: pointer">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </template>
              <el-input
                v-model="editForm[index]"
                :type="item.type"
                :size="item.size"
                :disabled="item.disabled"
                :maxlength="item.maxlength"
                :rows="item.rows"
                :placeholder="item.placeholder"
                :style="item.width ? `width:${item.width}px` : ''"
                @change="valueChange"
                clearable
              >
                <template v-if="item.append" #append>{{ item.append }}</template>
                <template v-if="item.prepend" #prepend>{{ item.prepend }}</template>
              </el-input>
            </el-form-item>
          </template>

          <!-- number: el-input-number -->
          <template v-if="item.html === 'number'">
            <el-form-item v-show="!item.hide" :prop="index" :rules="item.rules">
              <template #label>
                <el-tooltip
                  v-if="item.tip"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                >
                  <el-icon style="float: right; margin-top: 4px; cursor: pointer">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </template>
              <el-input-number
                v-model="editForm[index]"
                :min="item.min"
                :max="item.max"
                :step="item.step"
                :step-strictly="item.stepStrictly"
                :size="item.size || 'default'"
                :disabled="item.disabled"
                @change="valueChange"
              />
              <span v-if="item.suffix" style="margin-left: 8px; color: #666">
                {{ item.suffix }}
              </span>
            </el-form-item>
          </template>

          <!-- radioSwitch: radio group rendered as buttons -->
          <template v-if="item.html === 'radioSwitch'">
            <el-form-item v-show="!item.hide" :prop="index" :rules="item.rules">
              <template #label>
                <el-tooltip
                  v-if="item.tip"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                >
                  <el-icon style="float: right; margin-top: 4px; cursor: pointer">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </template>
              <el-radio-group
                v-model="editForm[index]"
                :disabled="item.disabled"
                @change="valueChange"
              >
                <el-radio-button
                  v-for="(opt, key) in item.defaultData"
                  :key="key"
                  :value="opt.value"
                  :disabled="opt.disabled"
                >{{ opt.label }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </template>

          <!-- switch: boolean toggle -->
          <template v-if="item.html === 'switch'">
            <el-form-item v-show="!item.hide" :prop="index" :rules="item.rules">
              <template #label>
                <el-tooltip
                  v-if="item.tip"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                >
                  <el-icon style="float: right; margin-top: 4px; cursor: pointer">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </template>
              <el-switch
                v-model="editForm[index]"
                active-text="Enabled"
                inactive-text="Disabled"
                :disabled="item.disabled"
                @change="valueChange"
              />
            </el-form-item>
          </template>

          <!-- select: single or multiple select -->
          <template v-if="item.html === 'select'">
            <el-form-item v-show="!item.hide" :prop="index" :rules="item.rules">
              <template #label>
                <el-tooltip
                  v-if="item.tip"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                >
                  <el-icon style="float: right; margin-top: 4px; cursor: pointer">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </template>
              <el-select
                v-model="editForm[index]"
                clearable
                filterable
                :size="item.size || 'default'"
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
            <el-form-item v-show="!item.hide" :prop="index" :rules="item.rules">
              <template #label>
                <el-tooltip
                  v-if="item.tip"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                >
                  <el-icon style="float: right; margin-top: 4px; cursor: pointer">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </template>
              <el-radio-group v-model="editForm[index]" @change="valueChange">
                <el-radio-button
                  v-for="(opt, key) in item.defaultData"
                  :key="key"
                  :value="opt.value"
                  :disabled="opt.disabled"
                >{{ opt.label }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </template>

          <!-- state: preset Enabled(1) / Disabled(0) radio -->
          <template v-if="item.html === 'state'">
            <el-form-item v-show="!item.hide" :prop="index" :rules="item.rules">
              <template #label>
                <el-tooltip
                  v-if="item.tip"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                >
                  <el-icon style="float: right; margin-top: 4px; cursor: pointer">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </template>
              <el-radio-group
                v-model="editForm[index]"
                :disabled="item.disabled"
                @change="valueChange"
              >
                <el-radio :value="1">Enabled</el-radio>
                <el-radio :value="0">Disabled</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>

          <!-- checkbox: checkbox group with select-all support -->
          <template v-if="item.html === 'checkbox'">
            <el-form-item v-show="!item.hide" :prop="index" :rules="item.rules">
              <template #label>
                <el-tooltip
                  v-if="item.tip"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                >
                  <el-icon style="float: right; margin-top: 4px; cursor: pointer">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </template>
              <el-checkbox
                :indeterminate="item.isIndeterminate"
                v-model="item.checkAll"
                @change="(e) => handleCheckAllChange(e, item, index)"
              >Select All</el-checkbox>
              <div style="margin: 12px 0"></div>
              <el-checkbox-group
                v-model="editForm[index]"
                size="small"
                @change="valueChange"
              >
                <el-checkbox
                  v-for="(opt, key) in item.defaultData"
                  :key="key"
                  :value="opt.value"
                  :disabled="opt.disabled"
                  @change="(e) => mulitFunction(e, item, index)"
                >{{ opt.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </template>

          <!-- checkboxButton: checkbox group with button style -->
          <template v-if="item.html === 'checkboxButton'">
            <el-form-item v-show="!item.hide" :prop="index" :rules="item.rules">
              <template #label>
                <el-tooltip
                  v-if="item.tip"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                >
                  <el-icon style="float: right; margin-top: 4px; cursor: pointer">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </template>
              <el-checkbox-group
                v-model="editForm[index]"
                size="small"
                @change="valueChange"
              >
                <el-checkbox-button
                  v-for="(opt, key) in item.defaultData"
                  :key="key"
                  :value="opt.value"
                  :disabled="opt.disabled"
                >{{ opt.label }}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </template>

          <!-- singleCheckBox: single checkbox -->
          <template v-if="item.html === 'singleCheckBox'">
            <el-form-item v-show="!item.hide" :prop="index" :rules="item.rules">
              <template #label>
                <el-tooltip
                  v-if="item.tip"
                  effect="dark"
                  :content="item.tip"
                  placement="bottom-start"
                >
                  <el-icon style="float: right; margin-top: 4px; cursor: pointer">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
                <span>{{ item.label }}</span>
              </template>
              <el-checkbox v-model="editForm[index]" @change="valueChange">
                {{ item.boxLabel }}
              </el-checkbox>
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
import { InfoFilled } from '@element-plus/icons-vue'

export default {
  name: 'AutoForm',
  components: { InfoFilled },

  props: {
    formObj: { type: Object, required: true },
    editForm: { type: Object, required: true },
    labelPosition: { type: String, default: 'right' },
    labelWidth: { type: String, default: '150px' },
  },

  emits: ['change', 'checkForm'],

  methods: {
    valueChange() {
      this.$emit('change')
    },

    checkForm() {
      this.$refs.editFormRef.validate((valid) => {
        this.$emit('checkForm', valid)
      })
    },

    handleCheckAllChange(val, item, key) {
      const options = item.defaultData.map((opt) => opt.value)
      this.editForm[key] = val ? options : []
      this.formObj[key].isIndeterminate = false
    },

    handleCheckedChange(value, item, key) {
      const total = item.defaultData.length
      const checkedCount = this.editForm[key].length
      this.formObj[key].checkAll = checkedCount === total
      this.formObj[key].isIndeterminate = checkedCount > 0 && checkedCount < total
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
</style>
