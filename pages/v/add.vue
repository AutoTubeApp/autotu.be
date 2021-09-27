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
      <v-container fluid>
        <p>
          Lorem ipsum dolor sit amet. Eos voluptas sapiente <strong>Et porro ut voluptate deleniti vel iusto
            odit</strong> At maxime praesentium ut laudantium voluptatem! Vel rerum tenetur a nulla modi aut veritatis
          veniam aut animi obcaecati. Et sunt animi <em>Eum quia ut perferendis temporibus eos voluptate soluta est
            totam
            tempora</em>.
        </p>
        <br>
        <v-text-field
          v-model="manifest"
          filled
          class="pt-0"
          label="Manifest URL"
        />
        <v-spacer />
        <v-col class="text-right mt-0 pt-0">
          <v-btn color="blue darken-1">
            add video
          </v-btn>
        </v-col>
      </v-container>

      <!--Step 2: edit info-->
      <v-container fluid>
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
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  middleware: 'auth'
})
export default class AddVideo extends Vue {
  // manifest
  manifest: string = ''

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

  // methods
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
    if (this.playlistToAdd.length !== 0) {
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
