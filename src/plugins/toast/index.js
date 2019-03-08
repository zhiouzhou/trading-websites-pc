import Vue from 'vue'
import yjpToast from './toast.vue'

let instance;
let yjpConstructor = Vue.extend(yjpToast);

let initInstance = () => {
    instance = new yjpConstructor({
        el: document.createElement('div')
    });
    document.body.appendChild(instance.$el);
}

let toast = (options) => {
    initInstance();
    options.showToast = true;
    Object.assign(instance.$data, options);
}

export default {
    install(){
        Vue.prototype.$toast = toast;
    }
}