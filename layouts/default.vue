<template>
  <v-app dark>
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
      <v-icon>
        mdi-movie-plus
      </v-icon>
      <v-icon class="ml-5">
        mdi-bell
      </v-icon>
      <v-avatar size="34" class="ml-5">
        <img
          alt="toorop"
          src="dev/avatar.jpg"
        >
      </v-avatar>
    </v-app-bar>
    <v-main class="pa-8 mt-15">
      <Nuxt />
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

<script>
export default {
  data () {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-home',
          title: 'Accueil',
          to: '/'
        },
        {
          icon: 'mdi-compass',
          title: 'Explorer',
          to: '/explore'
        },
        {
          icon: 'mdi-youtube-subscription',
          title: 'Abonnements',
          to: '/feed/sub'
        },
        {
          icon: 'mdi-filmstrip-box-multiple',
          title: 'Bibliothèque',
          to: '/feed/sub'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
