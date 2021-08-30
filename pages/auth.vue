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

@Component
export default class Auth extends Vue {
  valid: boolean = false
  email: string = ''
  emailRules: any = [
    (v: string) => !!v || 'E-mail is required',
    (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
  ]

  password: string = ''
  passwordRules: any = [
    (v: string) => !!v || 'Password is required'
  ]

  // methods
  checkForm (): void {
    const isValid = (this.$refs.form as Vue & { validate: () => boolean }).validate()
    if (!isValid) {
      return
    }
    console.log('auth in progress')
  }
}
</script>

<style scoped>

a {
  text-decoration: none;
}

</style>
