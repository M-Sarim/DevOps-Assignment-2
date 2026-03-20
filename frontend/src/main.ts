import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import Newsletter from "./components/Newsletter.vue";
import Subscribers from "./components/Subscribers.vue";

import "./style.css";

const PERSON_NAME = import.meta.env.VITE_PERSON_NAME || "Ricky";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "newsletter",
      component: Newsletter,
      props: { person: PERSON_NAME },
    },
    {
      path: "/subscribers",
      name: "subscribers",
      component: Subscribers,
    },
  ],
});

const app = createApp(App);
app.use(router);
app.mount("#app");
