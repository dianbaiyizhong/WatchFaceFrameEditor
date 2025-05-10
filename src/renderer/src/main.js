import './assets/main.css'

import {createApp} from 'vue';
import 'node-waves/dist/waves.min.css'
const app = createApp(App)
import App from './App.vue'


import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

// 引入具体图标
import {faUser, faEnvelope, faCloudArrowUp, faCaretRight} from '@fortawesome/free-solid-svg-icons'
import {faGithub} from '@fortawesome/free-brands-svg-icons'

// 将图标添加到库
library.add(faUser, faEnvelope, faGithub, faCloudArrowUp, faCaretRight)
app.component('FontAwesomeIcon', FontAwesomeIcon)


// import 'vuetify/styles'
// import {createVuetify} from 'vuetify'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'


// main.js 或单独指令文件

// const vuetify = createVuetify({
//     components,
//
//
// })


// app.use(vuetify)
app.mount('#app')
