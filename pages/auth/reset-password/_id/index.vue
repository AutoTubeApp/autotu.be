<template>
  <v-row>
    <v-col
      v-if="validationIdIsValid"
      class="mx-auto"
      cols="12"
      md="6"
    >
      <h2 class="text-center">
        Reset your password
      </h2>
      <v-form
        v-if="step===1 && validationIdIsValid"
        ref="form"
        v-model="formIsValid"
      >
        <v-text-field
          v-model="password"
          type="password"
          :error-messages="passwordsErrorMessage"
          autocomplete="current-password"
          :rules="passwordRules"
          label="Choose a password"
          required
        />

        <v-text-field
          v-model="rePassword"
          type="password"
          autocomplete="current-password"
          :error-messages="passwordsErrorMessage"
          :rules="passwordRules"
          label="Retype password"
          required
        />

        <v-row class="mt-3 pl-3">
          <v-spacer />
          <v-btn
            :disabled="!formIsValid"
            color="blue darken-1"
            class="mr-4"
            @click="handleForm"
          >
            next
          </v-btn>
        </v-row>
      </v-form>
      <p v-if="step===2" class="text-center mt-3">
        Your password has been updated !<br>
        Click on the 'Sign In' button to authenticate.
      </p>
    </v-col>
    <!-- validationId is invalid -->
    <v-col
      v-if="step=== 1 && !validationIdIsValid"
      class="mx-auto"
      cols="12"
      md="6"
    >
      <v-alert
        dense
        border="left"
        type="error"
      >
        This link is not valid
      </v-alert>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, namespace, Vue, Watch } from 'nuxt-property-decorator'

const NsSnackbarStore = namespace('snackbarStore')

@Component({
  middleware: 'auth',
  auth: 'guest'
})
export default class resetPassword extends Vue {
  // props
  private step: number = 0
  private validationIdIsValid: boolean = false
  private formIsValid: boolean = false
  private password: string = ''
  private rePassword: string = ''
  private passwordsErrorMessage = ''
  private passwordRules: ((v: string) => string | boolean)[] = [
    (v: string) => !!v || 'Password is required',
    (v: string) => (v.length > 8) || 'Password length must be of 8-15',
    (v: string) => v.length <= 15 || 'Password length must be of 8-15'
    // (_v: string) => (this.password !== this.rePassword) || 'Passwords mismatches'
  ]

  // store
  @NsSnackbarStore.Action
  public showSnackbar!: (payload: { text: string, color?: string }) => void

  @NsSnackbarStore.Action
  public hideSnackbar!: () => void

  // hooks
  async beforeMount () {
    await this.validateId()
  }

  // watcher
  @Watch('password')
  passwordHasChanged () {
    this.isPasswordMatch()
  }

  @Watch('rePassword')
  rePasswordHasChanged () {
    this.isPasswordMatch()
  }

  // methods
  // ID validation
  // check ID and get user
  private async validateId (): Promise<void> {
    try {
      this.validationIdIsValid = await this.$axios.put('/api/validate-account', {
        id: this.$route.params.id
      })
    } catch (e) {
      // not found ?
      if (e.response?.status !== 404) {
        this.showSnackbar({
          text: e.response?.data?.message || 'Oops something went wrong',
          color: 'error'
        })
      }
    } finally {
      this.step = 1
    }
  }

  // Check password
  private isPasswordMatch (): void {
    this.passwordsErrorMessage = ''
    if (this.password.length === 0 || this.rePassword.length === 0) {
      return
    }
    if (this.password !== this.rePassword) {
      this.passwordsErrorMessage = 'Passwords do not match'
    }
  }

  private async handleForm (): Promise<void> {
    const isValid = (this.$refs.form as Vue & { validate: () => boolean }).validate()
    if (!isValid) {
      return
    }

    // update user password
    try {
      await this.$axios.put('/api/update-password-vid', {
        id: this.$route.params.id,
        password: this.password
      })
      this.step = 2
    } catch (e) {
      this.showSnackbar({
        text: e.response?.data?.message || 'Oops something went wrong',
        color: 'error'
      })
    }
  }
}
</script>
