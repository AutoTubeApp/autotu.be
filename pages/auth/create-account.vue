<template>
  <v-row>
    <v-col
      class="mx-auto"
      cols="12"
      md="6"
    >
      <h2>Create an account</h2>
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
          label="Enter your e-mail"
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

        <v-checkbox
          v-model="tos"
          :rules="tosRules"
        >
          <template #label>
            <div>
              I agree to
              <nuxt-link to="tos">
                terms and conditions
              </nuxt-link>
            </div>
          </template>
        </v-checkbox>
        <v-row class="mt-3 pl-3">
          <v-spacer />
          <v-btn
            :disabled="!valid"
            color="blue darken-1"
            class="mr-4"
            @click="handleForm"
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
export default class CreateAccount extends Vue {
  public valid: boolean = false
  public email: string = ''
  emailRules: ((v: string) => string | boolean)[] = [
    (v: string) => !!v || 'E-mail is required',
    (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
  ]

  public password: string = ''
  public passwordRules: ((v: string) => string | boolean)[] = [
    (v: string) => !!v || 'Password is required',
    (v: string) => (v.length > 8) || 'Password length must be of 8-15',
    (v: string) => v.length <= 15 || 'Password length must be of 8-15'
  ]

  public tos: boolean = false

  public tosRules: ((v: boolean) => string | boolean)[] = [
    (v: boolean) => v || 'You must agree to terms and conditions'
  ]

  // methods
  public handleForm (): void {
    const isValid = (this.$refs.form as Vue & { validate: () => boolean }).validate()
    if (!isValid) {
      return
    }
    console.log('is valid')
  }
}
</script>

<style scoped>

</style>
