<template>
  <v-app dark>
    <v-toolbar fixed app>
      <v-btn
        icon
        to="/"
      >
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        icon
        to="/about"
      >
        <v-icon>info</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container class="layout_wrap">
        <nuxt />
      </v-container>
    </v-content>

    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        clipped: false,
        drawer: true,
        fixed: false,
        items: [
          { icon: 'apps', title: 'Welcome', to: '/' },
          { icon: 'bubble_chart', title: 'Inspire', to: '/inspire' }
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: ''
      }
    },
    beforeUpdate () {
      this.title = document.title
    }
  }
</script>




<style>
a {
    color: #aaa;
    text-decoration: none;
}
.layout_wrap.container {
  max-width:800px;
}
</style>
