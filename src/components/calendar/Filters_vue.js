// import example from './components/example_vue.js';

export default {
  name: 'Filters',

  template: /*html*/ `
    <div class='filters'>
      <div class="filters-grid-container">
        <div class="navigation-item1">
          <select name="cars">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
        </div>
        <div class="navigation-item2">
          <select name="cars">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
        </div>
        <div class="navigation-item3">
          <select name="cars">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
        </div>
        <div class="navigation-item4">
          <select name="cars">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
        </div>
        <div class="navigation-item5">
          <input type="range" min="1" max="6" value="3">
        </div>
      </div>
    </div>
        `,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, ['msg']),
  },

  //   components: {
  //     example,
  //   },

  //   props: [''],

  //   emits: [''],

  data() {
    return {};
  },

  methods: {},

  mounted() {
    style(
      'Filters',
      /*css*/ `
.filters-grid-container{
  display: grid;
  grid-template-columns: auto auto auto auto auto;
}
`
    );
  },
};
