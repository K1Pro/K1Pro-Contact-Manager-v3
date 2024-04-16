// import example from './components/example_vue.js';

export default {
  name: 'Navigation',

  template: /*html*/ `
    <div class="navigation">
      <div class="navigation-grid-container">
        <div class="navigation-grid-item1">
          <i class="fa fa-backward-fast" @click="getTime('-1 month')"></i>
        </div>
        <div class="navigation-grid-item2">
          <i class="fa fa-backward-step" @click="getTime('-1 day')"></i>
        </div>
        <div class="navigation-grid-item3">
          <input v-model="times.Y_m_d" type="date" />
        </div>
        <div class="navigation-grid-item4">
          <i class="fa fa-forward-step" @click="getTime('+1 day')"></i>
        </div>
        <div class="navigation-grid-item5">
          <i class="fa fa-forward-fast" @click="getTime('+1 month')"></i>
        </div>
      </div>
    </div>
  `,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, ['msg', 'times', 'time']),
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
    getTime(dateTimeDesc) {
      this.time('POST', null, `${this.times.Y_m_d} ${dateTimeDesc}`);
    },
  },

  mounted() {
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
