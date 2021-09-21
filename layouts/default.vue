<template>
  <v-app dark>
    <Snackbar />
    <v-navigation-drawer
      v-model="drawer"
      clipped
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      clipped-left
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <nuxtLink to="/" exact class="d-flex" style="text-decoration: none">
        <v-toolbar-items>
          <v-icon
            class="mr-2"
            large
            color="blue darken-1"
          >
            mdi-youtube
          </v-icon>
        </v-toolbar-items>
      </nuxtLink>
      <v-toolbar-title>AutoTube</v-toolbar-title>
      <v-spacer />
      <v-text-field solo dense hide-details label="Rechercher" />
      <v-btn dense>
        <v-icon>
          mdi-magnify
        </v-icon>
      </v-btn>
      <v-spacer />

      <v-icon v-if="$auth.loggedIn">
        mdi-movie-plus
      </v-icon>
      <v-icon v-if="$auth.loggedIn" class="ml-5">
        mdi-bell
      </v-icon>
      <v-menu v-if="$auth.loggedIn" offset-y>
        <template #activator="{ on, attrs }">
          <v-avatar
            size="34"
            class="ml-3"
            v-bind="attrs"
            v-on="on"
          >
            <img
              v-if="$auth.user.avatar"
              :alt="$auth.user.username"
              :src="$auth.user.avatar"
            >
            <v-icon v-else dark>
              mdi-account-circle
            </v-icon>
          </v-avatar>
        </template>
        <v-list>
          <v-list-item
            @click="logout"
          >
            <v-list-item-icon>
              <v-icon>mdi-exit-to-app</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn
        v-if="!$auth.loggedIn"
        class="ml-5"
        color="blue darken-1"
        outlined
        to="/auth/sign-in"
      >
        <v-icon left>
          mdi-account-circle-outline
        </v-icon>
        Sign in
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      absolute
      app
      class="justify-center"
    >
      <span>&copy; {{ new Date().getFullYear() }} <a href="https://dpp.st">dpp.st</a> </span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">

import { Component, Vue } from 'nuxt-property-decorator'
import Snackbar from '~/components/Snackbar.vue'

@Component({
  components: {
    Snackbar
  }
})
export default class Default extends Vue {
  public drawer: boolean = false
  public items: any[] = [
    {
      icon: 'mdi-home',
      title: 'Home',
      to: '/'
    },
    {
      icon: 'mdi-compass',
      title: 'Explore',
      to: '/explore'
    },
    {
      icon: 'mdi-youtube-subscription',
      title: 'Subscriptions',
      to: '/feed/sub'
    },
    {
      icon: 'mdi-filmstrip-box-multiple',
      title: 'Library',
      to: '/feed/library'
    }
  ]

  public logout (): void {
    this.$auth.logout()
  }
}
</script>

<style scoped>

</style>
