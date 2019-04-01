<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm12 md12 class="page_content">
      <v-card>
        <v-card-title class="headline">{{pageTitle}}</v-card-title>
        <v-card-text>
          <currency-converter></currency-converter>
        </v-card-text>
        <v-card-actions>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<style>
  .page_content {
    min-width: 100%;
  }
</style>

<script>
  import currencyConverter from '~/components/currencyConverter/view'

  export default {
    components: {
      currencyConverter
    },
    data () {
      return {
        pageTitle: '',
        tst: '',
        tst1: '1',
        tst2: '2'
      }
    },
    head: {
      title: 'Конвертер валют',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Конвертер валют: Nuxt.js + Vuetify.js' }
      ]
    },
    mounted () {
      this.pageTitle = document.title
    }
  }
</script>


