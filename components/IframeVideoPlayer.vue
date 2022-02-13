<template>
  <v-row id="main" class="ma-0 pa-0">
    <v-col
      id="media-container"
      style="position: relative"
      class="mx-auto pa-0 mb-2"
      cols="12"
    >
      <v-overlay v-if="displayWaitingOverlay" :absolute="true" opacity="0.1">
        <v-progress-circular
          indeterminate
          color="grey lighten-5"
        />
      </v-overlay>
      <transition name="fade">
        <v-img
          v-if="displayThumbnail"
          id="media-image"
          :src="imgSrc"
          aspect-ratio="1.7778"
          contain
          @mouseover=" imgSrc = animatedPosterSrc"
          @mouseout=" imgSrc = posterSrc"
          @click="() => {displayWaitingOverlay = true; displayPlayer = true}"
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
      </transition>
      <transition name="fade">
        <iframe
          v-if="displayPlayer"
          v-show="showPlayer"
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
      </transition>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

interface IFrameMessage {
  type: string
  width: number
  height: number
  ratio: number
}

@Component
export default class IframeVideoPlayer extends Vue {
  // Props
  // source of the iframe video
  @Prop({ required: true }) src!: string
  // title of the iframe video
  @Prop({ required: true }) readonly title!: string

  // Data
  private displayPlayer = false
  private displayThumbnail = true
  private displayWaitingOverlay = false
  private showPlayer = false
  private imgSrc = ''

  // methods
  mounted () {
    // this.src = 'http://localhost:3001'
    this.imgSrc = this.posterSrc
    window.addEventListener('message', this.handleMessage)
    window.addEventListener('resize', this.iframeLoaded)
  }

  beforeDestroy () {
    window.removeEventListener('message', this.handleMessage)
  }

  private getIframe = () => {
    return document.getElementById('iframe-player') as HTMLIFrameElement
  }

  private resizeIframe = (playerSize: IFrameMessage) => {
    const mediaContainer = document.getElementById('media-container') as HTMLDivElement
    console.log(playerSize)
    const { ratio } = playerSize
    console.log(ratio)
    mediaContainer.style.aspectRatio = ratio.toString()
    const iframe = document.getElementById('iframe-player') as HTMLIFrameElement
    iframe.style.aspectRatio = ratio.toString()
  }

  private iframeLoaded = () => {
    console.log('iframe loaded LOADED')
    /* const iframe = document.getElementById('iframe-player') as HTMLIFrameElement
    const mediaContainer = document.getElementById('media-container') as HTMLDivElement
    iframe.style.height = `${mediaContainer.clientHeight}px` */
  }

  private static playVideo () {
    const iframe = document.getElementById('iframe-player') as HTMLIFrameElement
    if (iframe) {
      iframe.contentWindow!.postMessage('att-video-play', '*')
    }
  }

  private handleMessage (evt: any) {
    if (evt.data === 'att-video-loaded') {
      console.log('att-video-loaded')
      this.displayWaitingOverlay = false
      IframeVideoPlayer.playVideo()
      this.getIframe().contentWindow!.postMessage('att-controls-hide', '*')
      setTimeout(() => {
        this.displayThumbnail = false
        this.showPlayer = true
        this.getIframe().contentWindow!.postMessage('att-controls-hide', '*')
      }, 100)
    }
    if (evt.data.type === 'player-size') {
      const playerSize: IFrameMessage = evt.data
      console.log(evt.data)
      this.resizeIframe(playerSize)
    }
  }

  private handleError = (e: Error) => {
    this.$emit('error', e)
  }

  // computed
  get iframeSrc (): string {
    return `${this.src}/embed-dyn.html`
  }

  get posterSrc (): string {
    return `${this.src}/thumbnail.jpg`
  }

  get animatedPosterSrc (): string {
    return `${this.src}/thumbnail.webp`
  }
}
</script>

<style scoped>

#main {
  width: 100%;
  aspect-ratio: 16/9 !important;
}

#media-container {
  cursor: pointer;
  max-width: 600px;
  aspect-ratio: inherit;
}

#iframe-player {
  border: 0;
  width: 100%;
  aspect-ratio: 16/9;
}

.fade-enter-active, .fade-leave-active {
  position: absolute;
  transition: opacity 1s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  position: absolute;
  opacity: 0;
}

</style>
