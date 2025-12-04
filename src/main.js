import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import piniaPersist from "pinia-plugin-persistedstate";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css"; // ✅ include CSS

const app = createApp(App);

// Register Toast
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 2000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

// Pinia
const pinia = createPinia();
pinia.use(piniaPersist);
app.use(pinia);

// Router
app.use(router);

// Mount app
app.mount("#app");
