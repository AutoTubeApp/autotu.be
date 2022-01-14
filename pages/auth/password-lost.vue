<template>
  <v-row>
    <v-col
      class="mx-auto"
      cols="12"
      md="6"
    >
      <h2 class="text-center mb-3">
        Reset your password
      </h2>
      <div v-if="step===0">
        <p>
          Enter your email address and click the Next button.<br>
          An email will be sent to your email address with the procedure to reset your password.
        </p>
        <v-form
          ref="form"
          v-model="formIsValid"
        >
          <v-text-field
            v-model="email"
            type="text"
            autocomplete="true"
            :rules="emailRules"
            label="Enter your email address"
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
      </div>
      <div v-if="step===1">
        <p>
          Check your mailbox !<br>
          An email has been sent to {{ email }} containing the procedure to reset your password.
        </p>
      </div>
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
    title: 'Recover your password',
    meta: [
      {
        name: 'description',
        content: 'Recover your password'
      }
    ]
  }
})
export default class PasswordLost extends Vue {
  private step: number = 0
  private formIsValid: boolean = false
  private email: string = ''
  private emailRules: ((v: string) => string | boolean)[] = [
    (v: string) => !!v || 'Email is required',
    (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid...'
  ]

  // store
  @NsSnackbarStore.Action
  public showSnackbar!: (payload: { text: string, color?: string }) => void

  @NsSnackbarStore.Action
  public hideSnackbar!: () => void

  // Methods
  private async handleForm (): Promise<void> {
    try {
      await this.$axios.post('/api/reset-password', { email: this.email })
      this.step = 1
    } catch (e:any) {
      this.showSnackbar({
        text: e.response?.data?.message || 'Oops something went wrong',
        color: 'error'
      })
    }
  }
}
</script>
