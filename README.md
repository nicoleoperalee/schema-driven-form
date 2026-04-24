# schema-driven-form

A schema-driven form component built with Vue 2 + Element UI.

透過 Schema 設定驅動表單渲染的 Vue 2 元件。

---

## Background 背景

Every time I built a new form, I had to look up the Element UI docs, copy the component tags, and manually adjust them — just to get the basic layout ready. That process took at least 30 minutes per form, before any business logic was written.

每次建立新表單，都需要查閱 Element UI 文件、複製標籤再手動調整，光是把外觀刻出來就要花至少 30 分鐘，還沒開始寫任何業務邏輯。

I built AutoForm to solve this: define what you need in a schema object, and the form renders itself. Building a new form — including deciding which fields to use — now takes 5–10 minutes.

我做了 AutoForm 來解決這個問題：用一個 schema 物件定義需要哪些欄位，元件自動渲染。現在建立一個新表單，包含分析要用哪些元件，只需要 5～10 分鐘。

The component has been in production at my company for 4+ years. Colleagues were able to learn it from the documentation alone, without needing hands-on guidance.

這個元件在公司已穩定使用超過 4 年，同事只需看文件就能自己上手，不需要額外教學。

---

## How it works 使用方式

Pass in two objects — `formObj` defines the fields, `editForm` holds the values.

傳入兩個物件：`formObj` 定義欄位，`editForm` 儲存值。

```vue
<AutoForm
  :formObj="formObj"
  :editForm="editForm"
  label-width="140px"
  @checkForm="onValidated"
/>
```

```js
formObj: {
  name: {
    html: 'input',
    label: 'Name',
    rules: [{ required: true, message: 'Required', trigger: 'blur' }],
  },
  status: {
    html: 'state',
    label: 'Status',
  },
},

editForm: {
  name: '',
  status: 1,
}
```

---

## Supported field types 支援的欄位類型

| type | description |
|------|-------------|
| `input` | text / textarea / password |
| `number` | numeric input with min / max / step |
| `select` | single or multiple select |
| `radioSwitch` | radio group rendered as buttons |
| `radio` | standard radio group |
| `switch` | boolean toggle |
| `state` | preset Enabled(1) / Disabled(0) radio |
| `checkbox` | checkbox group with select-all support |
| `checkboxButton` | checkbox group rendered as buttons |
| `singleCheckBox` | single checkbox |
| `str` / `text` / `index` | display-only fields |

---

## Schema field options Schema 欄位選項

```js
{
  html: 'input',        // 欄位類型（必填）
  label: 'Title',       // 欄位標籤（必填）
  rules: [...],         // Element UI 驗證規則
  tip: 'Hint text',     // Tooltip 提示（顯示 ℹ 圖示）
  hide: false,          // 動態隱藏欄位（保留 DOM）
  disabled: false,      // 禁用輸入
  size: 'small',        // Element UI size
  placeholder: '...',
  // input / number
  type: 'textarea',
  min: 0,
  max: 100,
  step: 1,
  maxlength: 50,
  append: 'USD',        // 輸入框後綴文字
  prepend: '$',         // 輸入框前綴文字
  suffix: 'days',       // number 後方說明文字
  // select
  multiple: true,
  allowCreate: true,
  // checkbox
  checkAll: false,
  isIndeterminate: false,
  // slot
  slot: 'customField',  // 使用具名 slot 自訂渲染
}
```

---

## Slot — custom fields 自訂欄位

For one-off fields that don't fit the standard types, use named slots.

遇到特殊需求、不值得擴充元件本身時，用具名 slot 自訂渲染。

```vue
<AutoForm :formObj="formObj" :editForm="editForm">
  <template slot="customField">
    <!-- 完全自訂的欄位內容 -->
  </template>
</AutoForm>
```

```js
formObj: {
  customField: {
    slot: 'customField',  // 對應 slot name
    rules: [...],         // 驗證規則仍然有效
  }
}
```

---

## Dynamic hide 動態隱藏

Use `v-show` internally, so hidden fields retain their values.

元件內部使用 `v-show`，隱藏時 DOM 和值都保留。

```js
// 根據另一個欄位的值動態控制顯示
watch: {
  'editForm.hasExpiry'(val) {
    this.formObj.expiryDate.hide = !val
  }
}
```

---

## Events 事件

| event | description |
|-------|-------------|
| `@change` | 任何欄位值變更時觸發 |
| `@checkForm` | 呼叫 `checkForm()` 後回傳驗證結果 `(Boolean)` |

## Methods 方法

| method | description |
|--------|-------------|
| `checkForm()` | 觸發 Element UI 表單驗證 |

---

## Tech Stack

- Vue 2
- Element UI