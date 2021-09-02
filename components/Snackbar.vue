<template>
  <v-snackbar
    v-model="sbProps.visible"
    absolute
    class="snackbar"
    :color="sbProps.color"
    top
    timeout="-1"
    transition="scale-transition"
    elevation="24"
  >
    {{ sbProps.text }}

    <template #action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        @click="close"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'

export interface SnackbarProps {
  visible?: boolean
  text?: string
  color?: string
}

const NsSnackbarStore = namespace('snackbarStore')

@Component
export default class Snackbar extends Vue {
  // store
  @NsSnackbarStore.State
  public sbProps!: SnackbarProps

  @NsSnackbarStore.Mutation
  public updateSnackbar!: (newProps: SnackbarProps) => void

  // methods
  public close (): void {
    this.updateSnackbar({ visible: false })
  }
}
</script>

<style scoped>
.snackbar {
  z-index: 10000000;
}

</style>
