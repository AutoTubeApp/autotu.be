<template>
  <v-row>
    <v-col
      v-if="step===1 && validationIdIsValid"
      class="mx-auto"
      cols="12"
      md="6"
    >
      <h2 class="text-center">
        Complete your profile
      </h2>
      <v-form
        ref="form"
        v-model="formIsValid"
        lazy-validation
      >
        <v-text-field
          v-model="username"
          type="text"
          :rules="usernameRules"
          label="Username"
          required
        />

        <v-text-field
          v-model="password"
          type="password"
          autocomplete="current-password"
          :rules="passwordRules"
          label="Choose a password"
          required
        />

        <v-text-field
          v-model="rePassword"
          type="password"
          autocomplete="current-password"
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
import { Component, namespace, Vue } from 'nuxt-property-decorator'

const NsSnackbarStore = namespace('snackbarStore')

@Component({
  middleware: 'auth',
  auth: 'guest'
})
export default class ValidateAccount extends Vue {
  // props
  private step: number = 0
  private formIsValid: boolean = false
  private validationIdIsValid: boolean = false

  private username: string = ''
  private usernameRules: ((v: string) => string | boolean)[] = [
    (v: string) => !!v || 'Username is required',
    (v: string) => (v.length > 4) || 'Username length must be of 4-20',
    (v: string) => v.length <= 20 || 'Username length must be of 4-20'
  ]

  private password: string = ''
  private rePassword: string = ''
  public passwordRules: ((v: string) => string | boolean)[] = [
    (v: string) => !!v || 'Password is required',
    (v: string) => (v.length > 8) || 'Password length must be of 8-15',
    (v: string) => v.length <= 15 || 'Password length must be of 8-15'
  ]

  // hooks
  async beforeMount () {
    await this.validateId()

    // this.$auth.setUser()
  }

  // store
  @NsSnackbarStore.Action
  public showSnackbar!: (payload: { text: string, color?: string }) => void

  @NsSnackbarStore.Action
  public hideSnackbar!: () => void

  // methods
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

  private handleForm (): void {

  }
}
</script>

<style scoped>

</style>
