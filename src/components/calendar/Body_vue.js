// import example from './components/example_vue.js';

export default {
  name: 'Calendar body',

  template: /*html*/ `
        <div class='calendar-body'>
          <div class="calendar-body-grid-container" :style="calBodyGridContainer">
            <div v-for="day in daysRangeArr[userSettings.calendar.filters.days]" class="calendar-body-grid-item">
              {{day}}
            </div>
          </div>
        </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, ['msg', 'userSettings']),

    calBodyGridContainer() {
      let colAmount, rowAmount;

      if (this.daysRangeArr[this.userSettings.calendar.filters.days] >= 7) {
        colAmount = 'auto auto auto auto auto auto auto';
      } else if (
        this.daysRangeArr[this.userSettings.calendar.filters.days] == 3
      ) {
        colAmount = 'auto auto auto';
      } else {
        colAmount = 'auto';
      }

      if (this.daysRangeArr[this.userSettings.calendar.filters.days] <= 7) {
        rowAmount = 'calc( 100vh - 100px)';
      } else if (
        this.daysRangeArr[this.userSettings.calendar.filters.days] == 14
      ) {
        rowAmount = 'calc( 50vh - 50px) calc( 50vh - 50px)';
      } else if (
        this.daysRangeArr[this.userSettings.calendar.filters.days] == 21
      ) {
        rowAmount =
          'calc( 33.33vh - 33.33px) calc( 33.33vh - 33.33px) calc( 33.33vh - 33.33px)';
      } else {
        rowAmount =
          'calc( 25vh - 25px) calc( 25vh - 25px) calc( 25vh - 25px) calc( 25vh - 25px)';
      }
      return {
        'grid-template-columns': colAmount,
        'grid-template-rows': rowAmount,
      };
    },
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

  methods: {},

  mounted() {
    style(
      'Calendar-body',
      /*css*/ `
.Calendar body{}
.calendar-body-grid-container{
  display: grid;
}
.calendar-body-grid-item{
  border: solid black 1px;
}
`
    );
  },
};
