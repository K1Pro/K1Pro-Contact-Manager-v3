// import example from './components/example_vue.js';

export default {
  name: 'Filters',

  template: /*html*/ `
    <div class='filters'>
      <div class="filters-grid-container">
        <div class="navigation-item1">
          <select name="cars">
            <option value="volvo">Tasks (All)</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
        </div>
        <div class="navigation-item2">
          <select name="cars">
            <option value="volvo">Status (All)</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
        </div>
        <div class="navigation-item3">
          <select name="cars">
            <option value="volvo">Source (All)</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
        </div>
        <div class="navigation-item4">
          <select name="cars">
            <option value="volvo">Agent (All)</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
          </select>
        </div>
        <div class="navigation-item5">
          <input v-if="windowWidth > 768" type="range" min="0" max="5" v-model="userSettings.calendar.filters.days" @change="daysRangeChange" @input="getFirstCalDate">
          <input v-if="windowWidth < 768" type="range" min="0" max="1" v-model="userSettings.calendar.filters.days" @change="daysRangeChange" @input="getFirstCalDate">
          <span>{{ daysRangeArr[userSettings.calendar.filters.days] }}</span>
        </div>
      </div>
    </div>
        `,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'windowWidth',
      'userSettings',
      'tempFiltersDays',
      'daysRangeArr',
      'patchUserSettings',
      'getFirstCalDate',
      'dayIndex',
      'calRow',
    ]),
  },

  //   components: {
  //     example,
  //   },

  //   props: [''],

  //   emits: [''],

  data() {
    return {};
  },

  methods: {
    daysRangeChange(event) {
      this.userSettings.calendar.filters.days = event.target.value;
      this.tempFiltersDays = event.target.value;
      this.patchUserSettings();
    },
  },

  watch: {
    windowWidth(newWidth, oldWidth) {
      if (
        (newWidth < 768 && oldWidth > 768) ||
        (newWidth > 768 && oldWidth < 768)
      ) {
      }
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
  padding: 5px 0px 5px 0px;
  width: calc(75% - 15px);
  
}
.filters span {
  position: absolute;
  margin-top:5px;
  width: 15px;
}
`
    );
  },
};
