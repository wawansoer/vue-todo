import "@/assets/main.css"

import { createApp } from "vue"

import uiPlugin from "@nuxt/ui/vue-plugin"
import { createPinia } from "pinia";
import App from "@/App.vue"

const app = createApp(App)

app.use(uiPlugin)
app.use(createPinia());

app.mount("#app")
