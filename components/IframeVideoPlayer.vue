<template>
  <v-row>
    <v-col
      id="iframe-container"
    >
      <iframe
        src="https://v.autotube.app/dc6-first-landing/embed.html"
        title="dc6-first-landing"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
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
    // const iframeContainer = document.getElementById('iframe-container')!
    window.addEventListener('message', this.videoLoaded, false)
  }

  private iframeLoaded = () => {
    console.log('iframe loaded')
  }

  private videoLoaded = (evt: Event) => {
    console.log('video loaded')
    console.log(evt)
  }

  private handleError = (e: Error) => {
    this.$emit('error', e)
  }
}
</script>

<style>
</style>
