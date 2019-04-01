<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <v-card-title class="headline">О конвертере</v-card-title>
        <v-card-text>
          <p><strong>Конвертер валют онлайн</strong> — инструмент, который позволит вам рассчитать соотношения актуальных курсов денежных средств всего мира на сегодня.
          <p>Данные о котировках международных валют обновляются каждую минуту.</p>
          <p>Наш калькулятор позволит вам быстро и точно сделать перевод курса таких валют, как: 
            <ul>
              <li>российские рубли</li>
              <li>украинские гривны</li>
              <li>доллары США</li>
              <li>евро и др.</li>
            </ul>
          </p>
          <div class="text-xs-right">
            <em><small>&mdash; Блудов Игорь</small></em>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" flat nuxt to="/">перейти к конвертеру</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>





<script>
  export default {
    data () {
      return {
        pageTitle: '',
        tst: '',
        tst1: '1',
        tst2: '2'
      }
    },
    head: {
      title: 'О конвертере валют',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'О конвертере валют: Nuxt.js + Vuetify.js' }
      ]
    },
    mounted () {
      this.pageTitle = document.title
    }
  }
</script>