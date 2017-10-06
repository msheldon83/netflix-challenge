import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './app.vue'
import AppService from './appService.js'

Vue.use(VueResource);
let svc = new AppService(Vue.http);
new Vue({
    el: '#app',
    data: svc.data,
    components: { App },
    methods: {
        
    }

})