<template>
  <v-row class="ma-0 pa-0">
    <v-col
      id="iframe-container"
      class="mx-auto pa-0"
      cols="12"
    >
      <iframe
        id="iframe-player"
        src="http://localhost:3001/"
        title="Sad Woman"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        scrolling="no"
        style="overflow:hidden;"
        @load="iframeLoaded"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class IframeVideoPlayer extends Vue {
  // Props
  @Prop({ required: true }) readonly manifestUrl!: string

  // mounted
  // iframe 100% en largeur du container
  // video 100% aussi

  // methods
  mounted () {
    console.log('IframeVideoPlayer mounted')
    window.addEventListener('message', this.videoLoaded, { once: true })
  }

  beforeDestroy () {
    window.removeEventListener('message', this.videoLoaded)
  }

  private iframeLoaded = () => {
    console.log('iframe loaded')
  }

  private videoLoaded = (evt: Event) => {
    console.log('video loaded')
    // console.log(evt)
  }

  private handleError = (e: Error) => {
    this.$emit('error', e)
  }
}
</script>

<style>
#iframe-player {
  border: 0;
  width: 100%;
  aspect-ratio: 16 / 9;
}
</style>
