// import example from './components/example_vue.js';

export default {
  name: 'Navigation',

  template: /*html*/ `
    <div class="navigation">
      <div class="navigation-grid-container">
        <div class="navigation-grid-item1">
          <i v-if="userSettings.calendar.filters.days == 5" class="fa fa-backward-fast" @click="getTime('-4 weeks', '-6 weeks previous Monday')">
          </i>
        </div>
        <div class="navigation-grid-item2">
          <i class="fa fa-backward-step" @click="getTime('-1 week', '-3 weeks previous Monday')"></i>
        </div>
        <div class="navigation-grid-item3">
          <input v-model="times.Y_m_d" type="date" />
        </div>
        <div class="navigation-grid-item4">
          <i class="fa fa-forward-step" @click="getTime('+1 week', '-1 week previous Monday')"></i>
        </div>
        <div class="navigation-grid-item5">
          <i class="fa fa-forward-fast" @click="getTime('+4 weeks', '+2 weeks previous Monday')"></i>
        </div>
      </div>
    </div>
  `,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'userSettings',
      'times',
      'time',
    ]),
  },

  // components: {
  //     example,
  // },

  // props: [''],

  // emits: [''],

  data() {
    return {};
  },

  methods: {
    getTime(dateTimeDesc, firstCalDateTimeDesc) {
      this.time('POST', null, `${this.times.Y_m_d} ${dateTimeDesc}`, 'time');
      // prettier-ignore
      this.time('POST', null, `${this.times.Y_m_d} ${firstCalDateTimeDesc}`, 'firstCalDate');
    },
  },

  mounted() {
    console.log(this.userSettings.calendar.filters.days);
    style(
      'Navigation',
      /*css*/ `
.navigation-grid-container{
  display: grid;
  grid-template-columns: auto auto auto auto auto;
}
.navigation-grid-item1,
.navigation-grid-item2,
.navigation-grid-item4,
.navigation-grid-item5 {
  font-size: 30px;
  color: white;
  cursor: pointer;
}
.navigation-grid-item1,
.navigation-grid-item4 {
  text-align: right;
  padding-right: 25px;
}
.navigation-grid-item2,
.navigation-grid-item5 {
  text-align: left;
}
.navigation-grid-item3 {
  text-align: center;
}
.navigation input[type='date'] {
  font-family: arial;
  font-size: 25px;
  background-color: #999999;
  color-scheme: dark;
  border: 0;
}
`
    );
  },
};
