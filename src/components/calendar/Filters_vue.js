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
          <input type="range" min="0" max="5" v-model="userSettings.calendar.filters.days" @change="daysRange">
          {{ daysRangeArr[userSettings.calendar.filters.days] }}
        </div>
      </div>
    </div>
        `,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'userSettings',
      'patchUserSettings',
    ]),
  },

  //   components: {
  //     example,
  //   },

  //   props: [''],

  //   emits: [''],

  data() {
    return {
      daysRangeArr: [1, 3, 7, 14, 21, 28],
    };
  },

  methods: {
    daysRange(event) {
      this.userSettings.calendar.filters.days = event.target.value;
      this.patchUserSettings();
    },
  },

  mounted() {
    style(
      'Filters',
      /*css*/ `
.filters-grid-container{
  display: grid;
  grid-template-columns: auto auto auto auto auto;
}
.filters{
  text-align: center
}
.filters select {
  padding: 5px;
}
.filters input[type='range'] {
  padding: 5px;
}
`
    );
  },
};
