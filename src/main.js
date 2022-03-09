import Vue from 'vue'
import App from './App.vue'
import ApiService from './services/api.service'

Vue.config.productionTip = false

// API service init
ApiService.init();

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
