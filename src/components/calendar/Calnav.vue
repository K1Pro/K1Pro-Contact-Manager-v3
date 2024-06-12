<template>
  <div class="navigation">
    <div class="navigation-grid-container">
      <div class="navigation-grid-item1"></div>
      <div class="navigation-grid-item2">
        <i
          v-if="userSettings.calendar.filters.days == 0"
          class="fa fa-backward-fast"
          @click="getTime('-1 week', '-1 week', '1 day filter and 1 week ago')"
        ></i>
        <i
          v-if="userSettings.calendar.filters.days == 1"
          class="fa fa-backward-fast"
          @click="getTime('-1 week', '-' + (dayIndex + 7) + ' days', '3 days filter and 1 week ago + days')"
        ></i>
        <i
          v-if="userSettings.calendar.filters.days > 1"
          class="fa fa-backward-fast"
          @click="
            getTime(
              '-4 weeks',
              '-' + (calRow + 3) + ' weeks',
              '+1 week filter and 4 weeks - N weeks ago',
              (calRow + 3) * -7
            )
          "
        ></i>
        <i
          v-if="userSettings.calendar.filters.days == 0"
          class="fa fa-backward-step"
          @click="getTime('-1 day', '-1 day', '1 day filter and 1 day ago')"
        ></i>
        <i
          v-if="userSettings.calendar.filters.days == 1"
          class="fa fa-backward-step"
          @click="getTime('-3 days', '-' + (dayIndex + 3) + ' days', '3 days filter and N day ago')"
        ></i>
        <i
          v-if="userSettings.calendar.filters.days > 1"
          class="fa fa-backward-step"
          @click="getTime('-1 week', '-' + calRow + ' weeks', '+1 week filter and N weeks ago')"
        ></i>
      </div>
      <div class="navigation-grid-item3">
        <input type="date" v-model="times.Y_m_d" @change="changeDate" />
      </div>
      <div class="navigation-grid-item4">
        <i
          v-if="userSettings.calendar.filters.days == 0"
          class="fa fa-forward-step"
          @click="getTime('+1 day', '+1 day')"
        ></i>
        <i
          v-if="userSettings.calendar.filters.days == 1"
          class="fa fa-forward-step"
          @click="getTime('+3 days', '+' + (dayIndex - 3) + ' days')"
        ></i>
        <i
          v-if="userSettings.calendar.filters.days > 1"
          class="fa fa-forward-step"
          @click="getTime('+1 week', '-' + (calRow - 2) + ' weeks')"
        ></i>
        <i
          v-if="userSettings.calendar.filters.days == 0"
          class="fa fa-forward-fast"
          @click="getTime('+1 week', '+1 week')"
        ></i>
        <i
          v-if="userSettings.calendar.filters.days == 1"
          class="fa fa-forward-fast"
          @click="getTime('+1 week', '+' + (dayIndex - 7) + ' days')"
        ></i>
        <i
          v-if="userSettings.calendar.filters.days > 1"
          class="fa fa-forward-fast"
          @click="getTime('+4 weeks', '-' + (calRow - 5) + ' weeks')"
        ></i>
      </div>
      <div class="navigation-grid-item5"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navigation',

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

  data() {
    return {};
  },

  methods: {
    changeDate(event) {
      if (!this.days.includes(event.target.value)) this.getFirstCalDate();
    },
    getTime(dateTimeDesc, firstCalDateTimeDesc, extra, newValue) {
      console.log(dateTimeDesc);
      console.log(firstCalDateTimeDesc);
      console.log(extra);
      console.log(
        new Date(
          new Date(this.times.Y_m_d + 'T12:00:00').setDate(
            new Date(this.times.Y_m_d + 'T12:00:00').getDate() + newValue
          )
        )
      );
      firstCalDateTimeDesc =
        this.dayOfTheWeek != 1 && this.userSettings.calendar.filters.days > 1
          ? firstCalDateTimeDesc.replace('--', '+') + ' previous Monday'
          : firstCalDateTimeDesc.replace('--', '+');
      this.time('POST', null, `${this.times.Y_m_d} ${dateTimeDesc}`, 'time');
      // prettier-ignore
      this.time('POST', null, `${this.times.Y_m_d} ${firstCalDateTimeDesc}`, 'firstCalDate');
    },
  },
};
</script>

<style>
.navigation-grid-container {
  display: grid;
  grid-template-columns: auto auto 175px auto auto;
}
.navigation i {
  cursor: pointer;
}
.navigation i:hover {
  cursor: pointer;
  color: Gray;
}
.navigation-grid-item1,
.navigation-grid-item2,
.navigation-grid-item4,
.navigation-grid-item5 {
  padding-top: 4px;
  font-size: 20px;
  color: #505050;
}
.navigation-grid-item2 {
  text-align: right;
}
.navigation-grid-item2 i {
  padding-right: 10px;
}
.navigation-grid-item4 {
  text-align: left;
}
.navigation-grid-item4 i {
  padding-left: 10px;
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
  width: 175px;
}

@media only screen and (min-width: 768px) {
  .navigation-grid-container {
    grid-template-columns: auto auto 175px auto auto;
  }
}
</style>
