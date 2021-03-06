<template>
  <v-row>
    <v-col
      class="mx-auto"
      cols="12"
      md="6"
    >
      <h2 class="mb-4">
        Create an account
      </h2>
      <!-- step 1 registration form -->
      <div v-if="step===1">
        <p class="mb-1">
          Just enter your email address and click "Next" button.
        </p>
        <p class="mt-0">
          You will received an email with the rest of the procedure to create your account.
        </p>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-text-field
            v-model="email"
            type="email"
            autocomplete="email"
            :rules="emailRules"
            label="Enter your e-mail"
            required
          />

          <!--
          <v-text-field
            v-if="show"
            v-model="password"
            type="password"
            autocomplete="current-password"
            :rules="passwordRules"
            label="Choose a password"
            required
          />
          <v-checkbox
            v-if="show"
            v-model="subscribe2nl"
            label="Get last Autotube news, subscribe to our newsletter."
          />
          -->
          <v-checkbox
            v-model="tos"
            class="mt-0"
            :rules="tosRules"
          >
            <template #label>
              <div>
                I agree to
                <nuxt-link to="tos">
                  terms and conditions
                </nuxt-link>
                .
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
      </div>
      <div v-if="step===2">
        <p>An email has been sent to {{ email }} containing instructions to activate your Autotube account.</p>
        <p>Thanks you for joining us !</p>
      </div>
      <!-- step 2 thanks -->
    </v-col>
  </v-row>
</template>

<script lang="ts">

import { Component, namespace, Vue } from 'nuxt-property-decorator'

const NsSnackbarStore = namespace('snackbarStore')

@Component({
  middleware: 'auth',
  auth: 'guest',
  head: {
    title: 'Create an account',
    meta: [
      {
        name: 'description',
        content: 'Create a new Autotube account'
      }
    ]
  }
})
export default class CreateAccount extends Vue {
  private step: number = 1
  private valid: boolean = false

  private email: string = 'toorop@gmail.com'
  emailRules: ((v: string) => string | boolean)[] = [
    (v: string) => !!v || 'E-mail is required',
    (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
  ]

  private tos: boolean = true
  // public subscribe2nl: boolean = false

  private tosRules: ((v: boolean) => string | boolean)[] = [
    (v: boolean) => v || 'You must agree to terms and conditions'
  ]

  // store
  @NsSnackbarStore.Action
  public showSnackbar!: (payload: { text: string, color?: string }) => void

  @NsSnackbarStore.Action
  public hideSnackbar!: () => void

  // methods
  public async handleForm (): Promise<void> {
    const isValid = (this.$refs.form as Vue & { validate: () => boolean }).validate()
    if (!isValid) {
      return
    }

    try {
      await this.$axios.post('/api/user', {
        email: this.email.trim()
      })
      // change display
      this.step = 2
    } catch (e:any) {
      this.showSnackbar({
        text: e.response?.data?.message || 'Oops something went wrong',
        color: 'error'
      })
    }
  }
}
</script>
