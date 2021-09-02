<template>
  <v-row>
    <v-col
      class="mx-auto"
      cols="12"
      md="6"
    >
      <h2>Sign in</h2>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-text-field
          v-model="email"
          type="email"
          autocomplete="email"
          :rules="emailRules"
          label="E-mail"
          required
        />

        <v-text-field
          v-model="password"
          type="password"
          autocomplete="current-password"
          :rules="passwordRules"
          label="Password"
          required
        />
        <v-row class="mt-3 pl-3">
          <nuxt-link class="mr-4" to="/auth/create-account">
            Create account
          </nuxt-link>
          <nuxt-link to="/auth/password-lost">
            Password lost
          </nuxt-link>
          <v-spacer />
          <v-btn
            :disabled="!valid"
            color="blue darken-1"
            class="mr-4"
            @click="checkForm"
          >
            next
          </v-btn>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
// import { HTTPResponse } from '@nuxtjs/auth-next'

const NsSnackbarStore = namespace('snackbarStore')

@Component
export default class Auth extends Vue {
  // store
  @NsSnackbarStore.Action
  public showSnackbar!: (payload: { text: string, color?: string }) => void

  @NsSnackbarStore.Action
  public hideSnackbar!: () => void

  // data & validators
  valid: boolean = false
  email: string = ''
  emailRules: ((v: string) => string | boolean)[] = [
    (v: string) => !!v || 'E-mail is required',
    (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
  ]

  password: string = ''
  passwordRules: ((v: string) => string | boolean)[] = [
    (v: string) => !!v || 'Password is required'
  ]

  // methods
  async checkForm (): Promise<void> {
    const isValid = (this.$refs.form as Vue & { validate: () => boolean }).validate()
    if (!isValid) {
      return
    }
    // auth request
    // const response: void | HTTPResponse =
    await this.$auth.loginWith('local', {
      data: {
        email: this.email,
        password: this.password
      }
    })
      .catch((err: any) => {
        // eslint-disable-next-line no-console
        let message: string
        switch (err.response.status) {
          case 401:
            message = 'Authentification failed !'
            break
          case 500:
            message = 'Internal server error - try again later'
            break
          default:
            message = 'Ooops something went wrong: ' + err.response.status
        }
        this.showSnackbar({
          text: message,
          color: 'error'
        })
      })
  }
}
</script>

<style scoped>

a {
  text-decoration: none;
}

</style>
