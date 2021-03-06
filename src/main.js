// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import fastclick from 'fastclick';
import Axios from 'axios';
import VueLazyLoad from 'vue-lazyload';

import 'common/scss/index.scss';

fastclick.attach(document.body);

Vue.prototype.$axios = Axios;

Vue.use(VueLazyLoad, {
  loading: require('common/images/default.png')
});

console.log('技术栈：vue + vuex + vue-router + axios + express + better-scroll + scss');

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
