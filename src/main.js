import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/store'
import './registerServiceWorker'

import VueLazyload from 'vue-lazyload'
import './assets/stylus/index.styl'
import './plugins/element.js'
import '@/api/index'
import '@/common/appConfig.js'
import mixin from 'common/rootMixin'
import SparkMD5 from 'common/spark-md5-3.0.0.min'

Vue.config.productionTip = false

Vue.use(VueLazyload, {
  error: require('assets/images/propic_default.gif'),
  loading: require('assets/images/propic_default.gif')
})

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0)
  let $el = document.getElementsByClassName('yjp-dialog')
  if ($el.length) {
    const parentNode = $el[0].parentNode;
    for (var i = $el.length - 1; i >= 0; i--) {
      parentNode.removeChild($el[i]);
    }
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
Vue.mixin(mixin)