<template>
  <v-row class="ma-0 pa-0">
    <v-col
      ref="videoContainer"
      class="mx-auto pa-0"
      cols="12"
    >
      <video
        id="video"
        ref="videoPlayer"
        crossorigin="anonymous"
        style="width:100%"
        :poster="posterUrl"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class VideoPlayer extends Vue {
  // Props
  @Prop({ required: true }) readonly manifestUrl!: string
  @Prop({ required: true }) readonly posterUrl!: string

  async mounted () {
    const shaka = require('shaka-player/dist/shaka-player.ui.js')
    const player = new shaka.Player(this.$refs.videoPlayer)
    try {
      const ui = new shaka.ui.Overlay(
        player,
        this.$refs.videoContainer,
        this.$refs.videoPlayer
      )
      ui.getControls()
      // console.log(Object.keys(shaka.ui))
      await player.load(this.manifestUrl)
      this.$emit('loaded')
    } catch (e) {
      this.$emit('error', e)
    }
  }
}
</script>

<style>
@import './../node_modules/shaka-player/dist/controls.css';

</style>
