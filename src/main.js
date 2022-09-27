import {
  createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/css/popcss.css'
import mitt from 'mitt';

const bus = mitt();
const app = createApp(App)

app.config.globalProperties.$bus = bus

app.use(router).use(ElementPlus).mount('#app')