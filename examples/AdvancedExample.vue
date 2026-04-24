<template>
  <div style="max-width: 600px; padding: 24px;">
    <h2>Advanced Example — Custom Slot + Dynamic Hide</h2>
    <p style="color: #666; font-size: 13px;">
      Toggle "Has Expiry" to reveal the expiry date field (dynamic hide).<br>
      The "Custom Notes" field is rendered via a named slot.
    </p>

    <AutoForm
      ref="form"
      :formObj="formObj"
      :editForm="editForm"
      label-width="140px"
      @change="onFormChange"
      @checkForm="onValidated"
    >
      <!--
        Named slot for custom field: "notes"
        The schema entry sets slot: 'notes' to reserve this spot.
        You have full control over the rendering here.
      -->
      <template slot="notes">
        <el-form-item label="Custom Notes" prop="notes" :rules="formObj.notes.rules">
          <el-input
            type="textarea"
            v-model="editForm.notes"
            :rows="4"
            placeholder="Write anything here..."
          />
          <div style="font-size: 12px; color: #999; margin-top: 4px;">
            {{ editForm.notes.length }} / 200 characters
          </div>
        </el-form-item>
      </template>
    </AutoForm>

    <el-button type="primary" @click="submit">Submit</el-button>

    <pre style="margin-top: 16px; background: #f5f5f5; padding: 12px;">{{ editForm }}</pre>
  </div>
</template>

<script>
import AutoForm from '@/components/AutoForm.vue'

export default {
  components: { AutoForm },

  data() {
    return {
      editForm: {
        title: '',
        hasExpiry: false,
        expiryDate: '',
        notes: '',
      },

      formObj: {
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

        // Dynamic hide: only shown when hasExpiry is checked
        expiryDate: {
          html: 'input',
          label: 'Expiry Date',
          type: 'date',
          get hide() {
            // This getter is evaluated reactively by the parent
            return false // controlled by onFormChange below
          },
        },

        // This field uses a named slot for custom rendering
        notes: {
          slot: 'notes',
          rules: [
            {
              validator: (rule, value, callback) => {
                if (value.length > 200) {
                  callback(new Error('Max 200 characters'))
                } else {
                  callback()
                }
              },
              trigger: 'blur',
            },
          ],
        },
      },
    }
  },

  watch: {
    // Dynamic hide: toggle expiryDate visibility based on hasExpiry
    'editForm.hasExpiry'(val) {
      this.formObj.expiryDate.hide = !val
    },
  },

  created() {
    // Hide expiryDate on init
    this.formObj.expiryDate.hide = true
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
      // triggered on every field change
    },
  },
}
</script>
