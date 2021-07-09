<template>
  <v-row class="d-flex mt-3 ml-2 mr-2">
    <v-col
      v-for="n in 9"
      :key="n"
      class="child-flex"
      cols="12"
      md="3"
      sm="6"
    >
      <VideoThumb />
    </v-col>
  </v-row>
</template>

<script lang="ts">

export default {
  name: 'Index'
}
</script>

<style scoped>

</style>
