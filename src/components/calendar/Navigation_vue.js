// import example from './components/example_vue.js';

export default {
  name: 'Navigation',
  template: /*html*/ `
    <div class="navigation">
      <div class="navigation-grid-container">
        <div class="navigation-grid-item1">
          <i v-if="userSettings.calendar.filters.days == 0" class="fa fa-backward-fast" @click="getTime('-1 week', '-1 week')"></i>
          <i v-if="userSettings.calendar.filters.days == 1" class="fa fa-backward-fast" @click="getTime('-1 week', '-'+(dayIndex+7)+' days')"></i>
          <i v-if="userSettings.calendar.filters.days > 1" class="fa fa-backward-fast" @click="getTime('-4 weeks', '-'+(calRow+3)+' weeks')"></i>
        </div>
        <div class="navigation-grid-item2">
          <i v-if="userSettings.calendar.filters.days == 0" class="fa fa-backward-step" @click="getTime('-1 day', '-1 day')"></i>
          <i v-if="userSettings.calendar.filters.days == 1" class="fa fa-backward-step" @click="getTime('-3 days', '-'+(dayIndex+3)+' days')"></i>
          <i v-if="userSettings.calendar.filters.days > 1" class="fa fa-backward-step" @click="getTime('-1 week', '-'+calRow+' weeks')"></i>
        </div>
        <div class="navigation-grid-item3">
          <input type="date" v-model="times.Y_m_d" @change="changeDate"/>
        </div>
        <div class="navigation-grid-item4">
          <i v-if="userSettings.calendar.filters.days == 0" class="fa fa-forward-step" @click="getTime('+1 day', '+1 day')"></i>
          <i v-if="userSettings.calendar.filters.days == 1" class="fa fa-forward-step" @click="getTime('+3 days', '+'+(dayIndex-3)+' days')"></i>
          <i v-if="userSettings.calendar.filters.days > 1" class="fa fa-forward-step" @click="getTime('+1 week', '-'+(calRow-2)+' weeks')"></i>
        </div>
        <div class="navigation-grid-item5">
          <i v-if="userSettings.calendar.filters.days == 0" class="fa fa-forward-fast" @click="getTime('+1 week', '+1 week')"></i>
          <i v-if="userSettings.calendar.filters.days == 1" class="fa fa-forward-fast" @click="getTime('+1 week', '+'+(dayIndex-7)+' days')"></i>
          <i v-if="userSettings.calendar.filters.days > 1" class="fa fa-forward-fast" @click="getTime('+4 weeks', '-'+(calRow-5)+' weeks')"></i>
        </div>
      </div>
    </div>
  `,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'windowWidth',
      'userSettings',
      'times',
      'time',
      'getFirstCalDate',
      'days',
      'dayOfTheWeek',
      'dayIndex',
      'calRow',
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
    changeDate(event) {
      if (!this.days.includes(event.target.value)) this.getFirstCalDate();
    },
    getTime(dateTimeDesc, firstCalDateTimeDesc) {
      firstCalDateTimeDesc =
        this.dayOfTheWeek != 1 && this.userSettings.calendar.filters.days > 1
          ? firstCalDateTimeDesc.replace('--', '+') + ' previous Monday'
          : firstCalDateTimeDesc.replace('--', '+');
      this.time('POST', null, `${this.times.Y_m_d} ${dateTimeDesc}`, 'time');
      // prettier-ignore
      this.time('POST', null, `${this.times.Y_m_d} ${firstCalDateTimeDesc}`, 'firstCalDate');
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
.navigation i {
  cursor: pointer;
}
.navigation-grid-item1,
.navigation-grid-item2,
.navigation-grid-item4,
.navigation-grid-item5 {
  font-size: 30px;
  color: Gray;
}
.navigation-grid-item1,
.navigation-grid-item4 {
  text-align: right;
  padding-right: 5px;
}
.navigation-grid-item2,
.navigation-grid-item5 {
  text-align: left;
}
.navigation-grid-item3 {
  text-align: center;
}
.navigation input[type='date'] {
  font-family: 'Helvetica', sans-serif;
  font-size: 25px;
  background-color: #999999;
  /* color-scheme: dark; */
  border: 0;
}

@media only screen and (min-width: 768px) {
  .navigation-grid-item1,
  .navigation-grid-item4 {
    text-align: right;
    padding-right: 25px;
  }  
}
`
    );
  },
};
