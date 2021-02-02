import Vue from 'vue'
import App from './App'
import api from '@/service/http.api'
import uView from "uview-ui";
import store from './store'
import filters from '@/filters';

import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
Vue.component('mescroll-body', MescrollBody)


Vue.use(uView);
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$api = api
App.mpType = 'app'

Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));

const app = new Vue({
  store,
  ...App
})
app.$mount()
