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
      <VideoThumb
        thumb-src="/dev/thumbnail.webp"
        anim-thumb-src="/dev/toreilles.webp"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import VideoThumb from '~/components/VideoThumb.vue'

@Component({
  components: {
    VideoThumb
  },
  head: {
    title: 'Decentralized video sharing',
    meta: [
      {
        name: 'description',
        content: 'Autotube is a decentralized video sharing platform'
      }
    ]
  }
})
export default class Index extends Vue {
}

</script>

<style scoped>

</style>
