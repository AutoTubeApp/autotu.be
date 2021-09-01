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
          <a class="mr-4" href="#">Create account</a>
          <a href="#">Password lost</a>
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
import { Component, Vue } from 'nuxt-property-decorator'
import { HTTPResponse } from '@nuxtjs/auth-next'

@Component
export default class Auth extends Vue {
  valid: boolean = false
  email: string = 'toorop@gmail.com'
  emailRules: ((v: string) => string | boolean)[] = [
    (v: string) => !!v || 'E-mail is required',
    (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
  ]

  password: string = 'azerty'
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
    // eslint-disable-next-line no-console
    console.log('auth in progress')
    const response: void | HTTPResponse = await this.$auth.loginWith('local', {
      data: {
        email: this.email,
        password: this.password
      }
    })
      .catch((err: any) => {
        // eslint-disable-next-line no-console
        console.error(err)
      })
    // eslint-disable-next-line no-console
    console.log('response')
    // eslint-disable-next-line no-console
    console.log(response)
  }
}
</script>

<style scoped>

a {
  text-decoration: none;
}

</style>
