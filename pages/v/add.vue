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
      <v-container v-if="step===0" fluid>
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
      <v-container v-if="step===2" fluid>
        <!--title-->
        <v-form>
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
            value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
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
              Save
            </v-btn>
          </v-col>
        </v-form>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import validator from 'validator'

const NsSnackbarStore = namespace('snackbarStore')

@Component({
  middleware: 'auth'
})
export default class AddVideo extends Vue {
  step: number = 0

  // manifest
  manifest: string = ''
  private manifestRules: ((v: string) => string | boolean)[] = [
    (v: string) => !!v || 'Manifest is required',
    (v: string) => validator.isURL(v) || 'URL is not valid',
    (v: string) => v.split('.')?.pop()?.toLowerCase() === 'mpd' || 'dash manifest must have .mpd extension'
  ]

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
    // validate URL

    try {
      const r = await this.$axios.post('/api/v/load-manifest', {
        manifest: this.manifest
      })
      console.log(r)

      // this.step = 2
    } catch (e) {
      this.showSnackbar({
        text: e.response?.data?.message || 'Oops something went wrong',
        color: 'error'
      })
    }
  }

  // add playlist to available list
  // todo check unique
  // todo check max playlists
  private addPlaylist (): void {
    if (this.playlistToAdd.length !== 0) {
      this.playlistToAdd = this.playlistToAdd.charAt(0).toUpperCase() + this.playlistToAdd.slice(1)
      this.availablePlaylists.push(this.playlistToAdd)
      this.playlists.push(this.playlistToAdd)
      this.playlistToAdd = ''
    }
  }

  // add channel
  // todo check unique
  // todo check max channel
  private addChannel (): void {
    if (this.channelToAdd.length !== 0) {
      this.channelToAdd = this.channelToAdd.charAt(0).toUpperCase() + this.channelToAdd.slice(1)
      this.availableChannels.push(this.channelToAdd)
      this.channels.push(this.channelToAdd)
      this.channelToAdd = ''
    }
  }

  private checkForm (): void {
    this.formIsValid = false
    console.log('click')
  }
}

</script>

<style scoped>

</style>
enTAtInt1
