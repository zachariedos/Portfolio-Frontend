import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { SetupCalendar, Calendar, DatePicker } from "v-calendar";
import "v-calendar/dist/style.css";
import titleMixin from "./mixins/titleMixin";

createApp(App)
  .use(store)
  .use(SetupCalendar)
  .mixin(titleMixin)
  .component("Calendar", Calendar)
  .component("DatePicker", DatePicker)
  .use(router)
  .mount("#app");
