import './assets/main.css'

import {createApp} from 'vue';
import 'node-waves/dist/waves.min.css'

const app = createApp(App)
import App from './Home.vue'


import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

// 引入具体图标
import {faUser, faEnvelope, faCloudArrowUp, faCaretRight} from '@fortawesome/free-solid-svg-icons'
import {faGithub} from '@fortawesome/free-brands-svg-icons'

// 将图标添加到库
library.add(faUser, faEnvelope, faGithub, faCloudArrowUp, faCaretRight)
app.component('FontAwesomeIcon', FontAwesomeIcon)


import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'


const vuetify = createVuetify({
    components,
    directives
})

app.use(vuetify)
import {Buffer} from 'buffer';
// @ts-ignore
window.Buffer = Buffer;

import router from './router'; // 引入路由配置文件
app.use(router); // 使用路由配置

// app.use(vuetify)
app.mount('#app')
