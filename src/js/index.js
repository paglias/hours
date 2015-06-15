// TODO import babel polyfill
// TODO touch events
import Vue from 'vue';

// TODO we need this App component? Or render hours directly?
import HoursComponent from './components/hours';

let App = new Vue({
  components: {
    hours: HoursComponent
  },

  template: `
    <hours v-cloak></hours>
  `,
  // TODO use replace?
  el: '#app'
});