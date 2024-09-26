import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import './assets/main.css'  // Import our main.css file after PrimeVue styles

const app = createApp(App)
app.use(PrimeVue)
app.mount('#app')