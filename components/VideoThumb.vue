<template>
  <div class="pr-2 pl-2 ">
    <v-row class="d-flex pointer">
      <v-img
        :src="imgSrc || thumbSrc"
        :lazy-src="imgLazySrc"
        aspect-ratio="16/9"
        class="grey lighten-2"
        @mouseover="handleImgHover"
        @mouseout="handleImgOut"
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
        <h4>Torreilles - mai 2021</h4>
        <a class="subtitle" spellcheck="false" href="/c/toorop" dir="auto">Toorop</a>
        <p class="subtitle">
          10K vues &#8226; Il y à 16 heures
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class VideoThumb extends Vue {
  // Data
  readonly imgLazySrc: string = '/dev/toreilles.png'

  imgSrc: string = ''

  // Props
  @Prop({ required: true }) readonly thumbSrc!: string
  @Prop({ required: true }) readonly animThumbSrc!: string

  // methods
  handleImgHover (): void {
    this.imgSrc = this.animThumbSrc
  }

  handleImgOut (): void {
    this.imgSrc = this.thumbSrc
  }
}
</script>

<style scoped>
.subtitle {
  font-size: 14px;
  color: #aaa !important;
  text-decoration: none;
  line-height: 1em;
}

.pointer {
  cursor: pointer;
}

</style>
