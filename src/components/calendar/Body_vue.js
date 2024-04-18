// import example from './components/example_vue.js';

export default {
  name: 'Calendar body',
  template: /*html*/ `
        <div class='calendar-body'>
          <div :class="'calendar-body-grid-container' + userSettings.calendar.filters.days">
            <template v-for="(day, dayIndex) in daysRangeArr[userSettings.calendar.filters.days]">
              <div v-if="(day + 1) % 7 && day % 7" 
                class="calendar-body-grid-item day" 
                :class="{ activeDay: dayIndex == calDayIndex }" 
                @click="changeDate(rangeYYYY_MM_DD[day-1], dayIndex)">
                {{ firstCalDate ? rangeYYYY_MM_DD[day-1].slice(-5) : '' }}
              </div>

              <div v-if="(Number(day) + 1) % 7 === 0" 
                class="calendar-body-grid-item">
                  <div 
                    class="day saturday" 
                    :class="{ activeDay: dayIndex == calDayIndex }"
                    @click="changeDate(rangeYYYY_MM_DD[day-1], dayIndex)">
                    {{ firstCalDate ? rangeYYYY_MM_DD[day-1].slice(-5) : '' }}
                  </div>
                  <div 
                    class="day sunday" 
                    :class="{ activeDay: dayIndex+1 == calDayIndex }"
                    @click="changeDate(rangeYYYY_MM_DD[day], dayIndex+1)">
                    {{ firstCalDate ? rangeYYYY_MM_DD[day].slice(-5) : '' }}
                  </div>
              </div>

            </template>
          </div>
        </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'userSettings',
      'times',
      'firstCalDate',
      'daysRangeArr',
      'changeCalDaysOrder',
      'rangeYYYY_MM_DD',
      'calDayIndex',
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
    changeDate(selectedY_m_d) {
      this.times.Y_m_d = selectedY_m_d;
    },
  },

  mounted() {
    this.changeCalDaysOrder();
    style(
      'Calendar-body',
      /*css*/ `
.Calendar body{}
.calendar-body-grid-container0 {
  display: grid;
  grid-template-columns: auto;
}
.calendar-body-grid-container1 {
  display: grid;
  grid-template-columns: auto auto auto;
}
.calendar-body-grid-container2,
.calendar-body-grid-container3,
.calendar-body-grid-container4,
.calendar-body-grid-container5 {
  display: grid;
  grid-template-columns: auto auto auto auto auto auto;
}
.calendar-body-grid-container0,
.calendar-body-grid-container1,
.calendar-body-grid-container2 {
  grid-template-rows: calc( 100vh - 100px);
}
.calendar-body-grid-container3 {
  grid-template-rows: calc( 50vh - 50px) calc( 50vh - 50px);
}
.calendar-body-grid-container4 {
  grid-template-rows: calc( 33.33vh - 33.33px) calc( 33.33vh - 33.33px) calc( 33.33vh - 33.33px);
}
.calendar-body-grid-container5 {
  grid-template-rows: calc( 25vh - 25px) calc( 25vh - 25px) calc( 25vh - 25px) calc( 25vh - 25px);
}
.day {
  border: solid black 1px;
  cursor: pointer;
}
.day:hover:not(.activeDay) {
  background-color: #EBCCFF;
}
.saturday {
  height: 50%;
  border-bottom: solid black 1px;
}
.sunday {
  height: 50%;
}
.activeDay {
  background-color: #ccffff;
  cursor: default;
}
`
    );
  },
};
