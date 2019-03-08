import Vue from 'vue'
import yjpComponent from './main.vue'

let instance;
let showing = false;
let yjpConstructor = Vue.extend(yjpComponent);

let initInstance = () => {
    instance = new yjpConstructor({
        el: document.createElement('div')
    });
    document.body.appendChild(instance.$el);
}

let Toast = (options) => {
    /* 如果当前已经在显示的话, 不响应*/
    if (!showing) {
        showing = true;
        initInstance();
        if (typeof options === 'string') {
            options = {
                content: options,
                showDuration: true,
                noText: null,
                yesText: null
            }
        } else {
            options.showDuration = true;
            options.noText = null;
            options.yesText = null;
        }

        Object.assign(instance.$data, options);
        /* 显示 */
        instance.show = true;
        setTimeout(() => {
            showing = false;
            instance.show = false;
        }, instance.duration * 1000);
    }
}

/**
 *
 * @param {*} options {}
 */

let Alert = (options) => {

    initInstance();
    if (typeof options === 'string') {
        options = {
            content: options,
            noText: null
        }
    } else {
        options.noText = null;
    }
    Object.assign(instance.$data, options);

    return new Promise((resolve, reject) => {
        instance.show = true;
        let success = instance.success;
        instance.success = () => {
            success();
            resolve('success');
        }
    });
}

let Confirm = (options) => {

    initInstance();
    if (typeof options === 'string') {
        options = {
            content: options
        }
    }
    Object.assign(instance.$data, options);
    return new Promise((resolve, reject) => {

        instance.show = true;
        let success = instance.success;
        let fail = instance.fail;

        instance.success = () => {
            success();
            resolve('success');
        }

        instance.fail = () => {
            fail();
            reject('fail');
        }

    });
}
export default {
    install() {
        Vue.prototype.$message = Toast;
        Vue.prototype.$alert = Alert;
        Vue.prototype.$confirm = Confirm;
    }
};
