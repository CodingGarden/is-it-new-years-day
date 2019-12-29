import '@formatjs/intl-relativetimeformat/polyfill-locales';
import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;

Vue.use(VueCompositionApi);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
