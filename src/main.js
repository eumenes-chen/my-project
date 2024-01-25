import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "@/style/index.scss"
// 注册icon插件
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon/index.vue'


import App from './App.vue'
import router from './router'

const app = createApp(App)

app.component('SvgIcon',SvgIcon)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
