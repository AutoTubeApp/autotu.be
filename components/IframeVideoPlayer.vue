<template>
  <v-row class="ma-0 pa-0">
    <v-col
      id="iframe-container"
      class="mx-auto pa-0"
      cols="12"
    >
      <v-img
        v-if="!displayPlayer"
        :aspect-ratio="16/9"
        :src="posterSrc"
        @click="() => {displayPlayer = true}"
      />
      <iframe
        v-if="displayPlayer"
        id="iframe-player"
        :src="iframeSrc"
        :title="title"
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
  // source of the iframe video
  @Prop({ required: true }) src!: string
  // title of the iframe video
  @Prop({ required: true }) readonly title!: string

  // Data
  private displayPlayer: boolean = false

  // methods
  mounted () {
    window.addEventListener('message', this.videoLoaded)
  }

  beforeDestroy () {
    window.removeEventListener('message', this.videoLoaded)
  }

  private static playVideo () {
    const iframe = document.getElementById('iframe-player') as HTMLIFrameElement
    if (iframe) {
      iframe.contentWindow!.postMessage('play', '*')
    }
  }

  private iframeLoaded = () => {
    // console.log('iframe loaded')
  }

  private videoLoaded = (evt:any) => {
    if (evt.data === 'video_loaded') {
      IframeVideoPlayer.playVideo()
    }
  }

  private handleError = (e: Error) => {
    this.$emit('error', e)
  }

  // computed
  get iframeSrc (): string {
    return `${this.src}/embed.html`
  }

  get posterSrc (): string {
    return `${this.src}/thumbnail-play.jpg`
  }
}
</script>

<style>
#iframe-container {
  cursor: pointer;
}
#iframe-player {
  border: 0;
  width: 100%;
  aspect-ratio: 16 / 9;
}
</style>
