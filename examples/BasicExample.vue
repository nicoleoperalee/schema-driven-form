<template>
  <div style="max-width: 600px; padding: 24px;">
    <h2>Basic Example</h2>

    <AutoForm
      ref="form"
      :formObj="formObj"
      :editForm="editForm"
      label-width="140px"
      @change="onFormChange"
      @checkForm="onValidated"
    />

    <el-button type="primary" @click="submit">Submit</el-button>
    <el-button @click="reset">Reset</el-button>

    <pre style="margin-top: 16px; background: #f5f5f5; padding: 12px;">{{ editForm }}</pre>
  </div>
</template>

<script>
import AutoForm from '@/components/AutoForm.vue'

export default {
  components: { AutoForm },

  data() {
    return {
      // --- Form data ---
      editForm: {
        name: '',
        age: 18,
        gender: 'male',
        role: '',
        active: 1,
        notify: false,
        tags: [],
      },

      // --- Schema ---
      formObj: {
        name: {
          html: 'input',
          label: 'Name',
          placeholder: 'Enter your name',
          tip: 'Your display name',
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
          tip: 'Receive email notifications',
        },

        tags: {
          html: 'checkboxButton',
          label: 'Tags',
          defaultData: [
            { label: 'Vue',       value: 'vue' },
            { label: 'Laravel',   value: 'laravel' },
            { label: 'TypeScript', value: 'ts' },
          ],
        },
      },
    }
  },

  methods: {
    submit() {
      this.$refs.form.checkForm()
    },
    onValidated(isValid) {
      if (isValid) {
        console.log('✅ Form data:', this.editForm)
        this.$message.success('Submitted!')
      }
    },
    onFormChange() {
      console.log('Form changed:', this.editForm)
    },
    reset() {
      this.editForm = {
        name: '',
        age: 18,
        gender: 'male',
        role: '',
        active: 1,
        notify: false,
        tags: [],
      }
    },
  },
}
</script>
