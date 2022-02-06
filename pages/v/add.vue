<template>
  <v-row>
    <v-col
      class="mx-auto"
      cols="12"
      md="6"
    >
      <h1 class="text-center mb-3">
        Add a new video
      </h1>

      <!--Step 1: enter root URL-->
      <v-container v-if="step===1" fluid>
        <p>
          Lorem ipsum dolor sit amet. Eos voluptas sapiente <strong>Et porro ut voluptate deleniti vel iusto
            odit</strong> At maxime praesentium ut laudantium voluptatem! Vel rerum tenetur a nulla modi aut veritatis
          veniam aut animi obcaecati. Et sunt animi <em>Eum quia ut perferendis temporibus eos voluptate soluta est
            totam
            tempora</em>.
        </p>
        <br>
        <v-form
          ref="form"
          v-model="formIsValid"
        >
          <v-text-field
            v-model="manifest"
            filled
            class="pt-0"
            label="Manifest URL"
            :rules="manifestRules"
          />
          <v-spacer />
          <v-col class="text-right mt-0 pt-0">
            <v-btn
              color="blue darken-1"
              :disabled="!formIsValid"
              @click="loadManifest"
            >
              add video
            </v-btn>
          </v-col>
        </v-form>
      </v-container>

      <!--Step 2: edit info-->
      <v-container
        v-if="step===2"
        :class="step2Visible ? '' : 'd-none'"
        fluid
      >
        <!--video player-->
        <IframeVideoPlayer
          :src="videoPackageSrc"
          :title="title"
          @error="handleVideoPlayerError"
          @loaded="handleVideoLoaded"
        />

        <!--title-->
        <v-form class="mt-6">
          <v-text-field
            v-model="title"
            filled
            type="text"
            label="Title"
            required
          />

          <!--description-->
          <v-textarea
            v-model="description"
            class="mt-2"
            filled
            auto-grow
            counter
            label="Description"
            value=""
          />

          <!--channels-->
          <v-select
            v-model="channels"
            :items="availableChannels"
            class="mt-3"
            filled
            label="Channels"
            multiple
            chips
          >
            <template #append-item>
              <v-divider class="mt-2 mb-0" />
              <v-list-item>
                <v-list-item-content class="pt-0">
                  <v-text-field
                    v-model="channelToAdd"
                    class="mt-2"
                    label="Add channel"
                    value=""
                    append-outer-icon="mdi-plus-circle"
                    @click:append-outer="addChannel"
                  />
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>

          <!--Playlist-->
          <v-select
            v-model="playlists"
            :items="availablePlaylists"
            class="mt-3"
            filled
            label="Playlists"
            multiple
            chips
          >
            <template #append-item>
              <v-divider class="mt-2 mb-0" />
              <v-list-item>
                <v-list-item-content class="pt-0">
                  <v-text-field
                    v-model="playlistToAdd"
                    class="mt-2"
                    label="Add playlist"
                    value=""
                    append-outer-icon="mdi-plus-circle"
                    @click:append-outer="addPlaylist"
                  />
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>

          <!--tags-->
          <v-text-field
            v-model="tags"
            class="mt-2"
            filled
            type="text"
            label="Tags, separated by semicolon"
            required
          />

          <v-col class="text-right mt-0 pt-0">
            <v-btn
              :disabled="!formIsValid"
              color="blue darken-1"
              @click="checkForm"
            >
              Add
            </v-btn>
          </v-col>
        </v-form>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
// todo form validation
// todo form submit
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import validator from 'validator'
// import { encode } from 'js-base64'

import VideoPlayer from '~/components/VideoPlayer.vue'

const NsSnackbarStore = namespace('snackbarStore')

@Component({
  components: {
    VideoPlayer
  },
  middleware: 'auth',
  head: {
    title: 'Add a new video',
    meta: [
      {
        name: 'description',
        content: 'Add a new video to your library'
      }
    ]
  }
})
export default class AddVideo extends Vue {
  private readonly titleMaxLength = 250
  private readonly descriptionMaxLength = 1024
  private readonly maxTags = 10
  // private readonly maxChannels = 10
  // private readonly maxPlaylists = 10

  // process step
  step: number = 1
  // hide step 2
  step2Visible = true

  // manifest
  // todo empty var
  manifest: string = 'https://dash.s3-website.fr-par.scw.cloud/sad-woman/dash.mpd'
  private manifestRules: ((v: string) => string | boolean)[] = [
    (v: string) => !!v || 'Manifest is required',
    // eslint-disable-next-line import/no-named-as-default-member
    (v: string) => validator.isURL(v) || 'URL is not valid',
    (v: string) => v.split('.')?.pop()?.toLowerCase() === 'mpd' || 'dash manifest must have .mpd extension'
  ]

  private iframeSrc: string = ''
  private posterSrc: string = ''
  private videoPackageSrc: string = ''

  // form step 2
  formIsValid: boolean = false
  title: string = ''
  description: string = ''
  // channels
  channels: string[] = ['Default']
  availableChannels: string[] = ['Default', 'travels', 'ch1', 'ch2']
  // if user wants to add a channel
  channelToAdd: string = ''
  // playlist
  playlists: string [] = []
  availablePlaylists: string[] = []
  playlistToAdd: string = ''
  // tags
  tags: string = ''

  // store
  @NsSnackbarStore.Action
  public showSnackbar!: (payload: { text: string, color?: string }) => void

  @NsSnackbarStore.Action
  public hideSnackbar!: () => void

  // methods

  // load manifest and return meta
  // https://v.autotube.app/DC6FirstLanding/dash.mpd
  private async loadManifest (): Promise<void> {
    try {
      const r = await this.$axios.post('/api/v/get-meta-from-manifest', {
        manifest: this.manifest
      })

      this.videoPackageSrc = this.manifest.split('/').slice(0, -1).join('/')
      /*      this.iframeSrc = `${baseURL}/embed.html`
      this.posterSrc = `${baseURL}` */

      // get meta
      const meta = r.data
      this.title = meta.title?.substr(0, this.titleMaxLength) || ''
      this.description = meta.description?.substr(0, this.descriptionMaxLength) || ''

      if (meta.tags) {
        // fool cast
        meta.tags = meta.tags as string[]
        if (meta.tags.length > 10) {
          meta.tags = meta.tags.slice(0, this.maxTags)
        }
        this.tags = meta.tags?.join(', ') || ''
      }
      // manifest URL for the player (through local proxy to avoid CORS)
      // this.manifestProxifiedUrl = '/api/v/get-proxyfied-manifest?u=' + encode(this.manifest)
      // show step 2 form
      this.step = 2
    } catch (e:any) {
      this.step = 1
      this.showSnackbar({
        text: e.response?.data?.message || 'Oops something went wrong',
        color: 'error'
      })
    }
  }

  // add playlist to available list
  private addPlaylist (): void {
    if (this.playlistToAdd.length !== 0) {
      this.playlistToAdd = this.playlistToAdd.charAt(0).toUpperCase() + this.playlistToAdd.slice(1)
      if (!this.availablePlaylists.includes(this.playlistToAdd)) {
        this.availablePlaylists.push(this.playlistToAdd)
      }
      if (!this.playlists.includes(this.playlistToAdd)) {
        this.playlists.push(this.playlistToAdd)
      }
      this.playlistToAdd = ''
    }
  }

  // add channels
  private addChannel (): void {
    if (this.channelToAdd.length !== 0) {
      this.channelToAdd = this.channelToAdd.charAt(0).toUpperCase() + this.channelToAdd.slice(1)
      if (!this.availableChannels.includes(this.channelToAdd)) {
        this.availableChannels.push(this.channelToAdd)
      }
      if (!this.channels.includes(this.channelToAdd)) {
        this.channels.push(this.channelToAdd)
      }
      this.channelToAdd = ''
    }
  }

  private checkForm (): void {
    this.formIsValid = false
    // console.log('click')
  }

  // handle error event form VideoPlayer
  private handleVideoPlayerError (): void {
    // console.log('ERR FROM PLAYER' + e)
    this.step = 1
    this.showSnackbar({
      text: 'Unable to play your video, check your manifest URL',
      color: 'error'
    })
  }

  // when video is loaded
  private handleVideoLoaded (): void {
    this.step2Visible = true
  }
}

</script>

<style scoped>
</style>
