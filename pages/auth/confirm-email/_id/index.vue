<template>
  <v-row>
    <v-col
      class="mx-auto"
      cols="12"
      md="6"
    >
      <h2 class="text-center">
        Email validation
      </h2>
      <span>{{ isValid }}</span>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'

const NsSnackbarStore = namespace('snackbarStore')

@Component
export default class ConfirmEmail extends Vue {
  // props
  isValid: boolean = false

  // hooks
  async created () {
    console.log(this.$route.params.id)
    await this.validateEmailAddress()

    // this.$auth.setUser()
  }

  // store
  @NsSnackbarStore.Action
  public showSnackbar!: (payload: { text: string, color?: string }) => void

  @NsSnackbarStore.Action
  public hideSnackbar!: () => void

  // methods
  public async validateEmailAddress (): Promise<void> {
    try {
      this.isValid = await this.$axios.put('/api/validate-email', {
        id: this.$route.params.id
      })
      // if is valid reload $auth.user
    } catch (e) {
      this.showSnackbar({
        text: e.response?.data?.message || 'Oops something went wrong',
        color: 'error'
      })
    }
  }
}
</script>

<style scoped>

</style>
