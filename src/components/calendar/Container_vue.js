import Navigation from './Navigation_vue.js';
import Calendarbody from './Body_vue.js';

export default {
  name: 'Calendar',

  template: /*html*/ `
        <div class='calendar-container'>
            <div class="calendar-container-item1">
                <navigation></navigation>
            </div>
            <div class="calendar-container-item2">
                <calendarbody></calendarbody>
            </div>
        </div>`,

  // <div class="calendar-container-item3">
  //     <filters></filters>
  // </div>

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, ['msg']),
  },

  components: {
    Navigation,
    Calendarbody,
  },

  //   props: [''],

  //   emits: [''],

  data() {
    return {};
  },

  methods: {},

  mounted() {
    style(
      'Calendar',
      /*css*/ `
.calendar-container { 
  padding: 10px 10px 10px 10px;
}
.calendar-container-item1 {
  /* background-color: red; */
  height: 40px;
}
.calendar-container-item2 {
  background-color: white;
  height: calc(100vh - 60px);
}
.calendar-container-item3 {
  /* background-color: blue; */
  padding-top: 10px;
  height: 50px;
}
@media only screen and (min-width: 768px) {
  .calendar-container { 
  padding: 10px 10px 10px 0px;
  }
}
`
    );
  },
};
