<template>
  <v-row class="d-flex pl-6">
    <v-col
      v-for="n in 9"
      :key="n"
      class="child-flex mb-5 pt-5 pr-1"
      cols="12"
      md="3"
      sm="6"
    >
      <v-row class="d-flex">
        <v-img
          src="/dev/thumbnail.webp"
          lazy-src="/dev/thumbnail.webp"
          aspect-ratio="16/9"
          class="grey lighten-2"
        >
          <template #placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              />
            </v-row>
          </template>
        </v-img>
      </v-row>
      <v-row class="d-flex pt-3">
        <v-col cols="auto" class="ma-0">
          <v-avatar size="36">
            <img
              alt="toorop"
              src="dev/avatar.jpg"
            >
          </v-avatar>
        </v-col>
        <v-col class="pl-0">
          <h4>J'ai acheté un van !!!</h4>
          <a href="" dir="auto">Toorop</a>
          <p>10K vues &#8226; Il y à 16 heures</p>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Index'
}
</script>

<style scoped>

</style>
