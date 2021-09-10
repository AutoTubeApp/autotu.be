<template>
  <v-row>
    <v-col><h1>Password Lost</h1></v-col>
  </v-row>
</template>

<script lang="ts">

import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  middleware: 'auth',
  auth: 'guest'
})
export default class PasswordLost extends Vue {
}
</script>

<style scoped>

</style>
