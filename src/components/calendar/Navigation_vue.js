// import example from './components/example_vue.js';

export default {
  name: 'Navigation',

  template: /*html*/ `
    <div class="navigation">
      <div class="navigation-container">
        <div class="navigation-item1">
          <i class="fa fa-backward-fast"></i>
        </div>
        <div class="navigation-item2">
          <i class="fa fa-backward-step"></i>
        </div>
        <div class="navigation-item3">
          <input type="date" />
        </div>
        <div class="navigation-item4">
          <i class="fa fa-forward-step"></i>
        </div>
        <div class="navigation-item5">
          <i class="fa fa-forward-fast"></i>
        </div>
      </div>
    </div>

  `,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, ['msg']),
  },

  // components: {
  //     example,
  // },

  // props: [''],

  // emits: [''],

  data() {
    return {};
  },

  methods: {},

  mounted() {
    style(
      'Navigation',
      /*css*/ `
.navigation-container{
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  text-align: center;

}
.navigation-item1,
.navigation-item2,
.navigation-item4,
.navigation-item5 {
  font-size: 30px;
  color: white;
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
