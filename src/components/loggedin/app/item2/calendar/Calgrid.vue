<template>
  <div class="calendar-body">
    <div :class="'calendar-body-grid-container' + userSettings.calendar.filters.days">
      <template v-for="(day, dayIndex) in days">
        <div
          v-if="(dayIndex + 1) % 7 && (dayIndex + 2) % 7"
          class="calendar-body-grid-item day"
          :class="{ activeDay: days[dayIndex] == slctdY_m_d }"
          @click="changeDate(days[dayIndex], dayIndex)"
        >
          <calcontent :dayIndex="dayIndex" @sideMenuSlctdLnk="(el) => $emit('sideMenuSlctdLnk', el)"></calcontent>
        </div>

        <div v-if="(dayIndex + 1) % 7 === 0" class="calendar-body-grid-item">
          <div
            class="day saturday"
            :class="{ activeDay: days[dayIndex - 1] == slctdY_m_d }"
            @click="changeDate(days[dayIndex - 1], dayIndex - 1)"
          >
            <calcontent :dayIndex="dayIndex - 1" @sideMenuSlctdLnk="(el) => $emit('sideMenuSlctdLnk', el)"></calcontent>
          </div>
          <div
            class="day sunday"
            :class="{ activeDay: days[dayIndex] == slctdY_m_d }"
            @click="changeDate(days[dayIndex], dayIndex)"
          >
            <calcontent :dayIndex="dayIndex" @sideMenuSlctdLnk="(el) => $emit('sideMenuSlctdLnk', el)"></calcontent>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calendar body',

  emits: ['sideMenuSlctdLnk', 'tempFiltersDays'],

  inject: ['days', 'patchUserSettings', 'slctd', 'slctdY_m_d', 'tempFiltersDays', 'times', 'userSettings', 'wndw'],

  methods: {
    changeDate(slctdY_m_d, slctdDayIndex) {
      this.slctd.tmstmp = new Date(slctdY_m_d + 'T00:00:00').getTime();
      this.slctd.dayIndex = slctdDayIndex;
    },
  },

  watch: {
    'wndw.wdth'(newWidth, oldWidth) {
      if (
        newWidth < 768 &&
        oldWidth > 768 &&
        this.userSettings.calendar.filters.days != 0 &&
        this.userSettings.calendar.filters.days != 1
      ) {
        const cloneUserSettings = this.userSettings;
        cloneUserSettings.calendar.filters.days = 1;
        this.patchUserSettings(cloneUserSettings);
      } else if (newWidth > 768 && oldWidth < 768 && this.userSettings.calendar.filters.days != this.tempFiltersDays) {
        const cloneUserSettings = this.userSettings;
        cloneUserSettings.calendar.filters.days = this.tempFiltersDays;
        this.patchUserSettings(cloneUserSettings);
      }
    },
  },

  mounted() {
    this.$emit('tempFiltersDays', this.userSettings.calendar.filters.days);
  },
};
</script>

<style>
.Calendar body {
}
.calendar-body-grid-container0 {
  display: grid;
  grid-template-columns: 100%;
}
.calendar-body-grid-container1 {
  display: grid;
  grid-template-columns: 33.33% 33.34% 33.33%;
}
.calendar-body-grid-container2,
.calendar-body-grid-container3,
.calendar-body-grid-container4,
.calendar-body-grid-container5 {
  display: grid;
  grid-template-columns: 16.67% 16.67% 16.67% 16.67% 16.66% 16.66%;
}
.calendar-body-grid-container0,
.calendar-body-grid-container1,
.calendar-body-grid-container2 {
  grid-template-rows: calc(100vh - 60px);
}
.calendar-body-grid-container3 {
  grid-template-rows: calc(50vh - 30px) calc(50vh - 30px);
}
.calendar-body-grid-container4 {
  grid-template-rows: calc(33.33vh - 20px) calc(33.33vh - 20px) calc(33.33vh - 20px);
}
.calendar-body-grid-container5 {
  grid-template-rows: calc(25vh - 15px) calc(25vh - 15px) calc(25vh - 15px) calc(25vh - 15px);
}
.day {
  border: solid #999999;
  border-width: 2px;
  cursor: pointer;
  overflow: hidden scroll;
  white-space: nowrap;
  background-image: linear-gradient(125deg, #ffffff 0 25%, #cccccc 95% 100%);
}
.day::-webkit-scrollbar {
  width: 5px;
}
.day::-webkit-scrollbar-track {
  background: #888;
}

.day::-webkit-scrollbar-thumb {
  background: #f1f1f1;
}

.day::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.day:hover:not(.activeDay) {
  background-color: #ebccff;
  background-image: linear-gradient(125deg, #ebccff 0 25%, #bca3cc 95% 100%);
}
.saturday {
  height: 50%;
  border-bottom: solid black 1px;
}
.sunday {
  height: 50%;
}
.activeDay {
  cursor: default;
  background-color: lightblue;
  background-image: linear-gradient(125deg, #add8e6 0 25%, #8aacb8 95% 100%);
}
</style>
