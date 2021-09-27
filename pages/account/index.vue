<template>
  <v-row>
    <v-col>Account Todo</v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  middleware: 'auth'
})
export default class Account extends Vue {
}

</script>

<style scoped>

</style>
