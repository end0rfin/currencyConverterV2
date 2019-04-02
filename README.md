# currency_converter_v2

> Nuxt.js + Vuetify.js project

## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```


Конвертер валют на NUXTJS + VUETIFY. Использована сетка VUETIFY и пару компонентов.


Форма конвертера вынесена в отдельный компонент.


Данные берутся по бесплатному ключу с FIXER.IO



Все запросы к API выделены в отдельный модуль, т.к. при масштабировании проекта и / или планируется смена технологий, то легко будет заменить один модуль запроса (запросов).

В примере используется  модель MVVM (MVC).
В качестве VIEW код HTML в компоненте view.vue.
ViewModel - JS во view.vue.

В качестве фильтрации вводимых значений используется нативный параметр html5 type=numeric.