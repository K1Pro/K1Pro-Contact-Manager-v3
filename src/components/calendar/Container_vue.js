import Navigation from './Navigation_vue.js';
import Calendarbody from './Body_vue.js';
import Filters from './Filters_vue.js';

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
            <div class="calendar-container-item3">
                <filters></filters>
            </div> 
        </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, ['msg']),
  },

  components: {
    Navigation,
    Calendarbody,
    Filters,
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
  height: calc( 100vh - 100px);
}
.calendar-container-item3 {
  /* background-color: blue; */
  height: 40px;
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
