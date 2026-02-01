<template>
  <div class="cal-grid">
    <template v-for="(day, dayIndex) in days">
      <div
        v-if="(dayIndex + 1) % 7 && (dayIndex + 2) % 7"
        class="day"
        :class="{ activeDay: days[dayIndex] == slctdY_m_d }"
        :style="calItem"
        @click="changeDate(days[dayIndex], dayIndex)"
      >
        <calcontent :dayIndex="dayIndex"></calcontent>
      </div>

      <div v-if="(dayIndex + 1) % 7 === 0" :style="calItem">
        <div
          class="day saturday"
          :class="{ activeDay: days[dayIndex - 1] == slctdY_m_d }"
          @click="changeDate(days[dayIndex - 1], dayIndex - 1)"
        >
          <calcontent :dayIndex="dayIndex - 1"></calcontent>
        </div>
        <div
          class="day sunday"
          :class="{ activeDay: days[dayIndex] == slctdY_m_d }"
          @click="changeDate(days[dayIndex], dayIndex)"
        >
          <calcontent :dayIndex="dayIndex"></calcontent>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Grid',

  inject: ['days', 'slctd', 'slctdY_m_d'],

  methods: {
    changeDate(slctdY_m_d, slctdDayIndex) {
      this.slctd.tmstmp = new Date(slctdY_m_d + 'T00:00:00').getTime();
      this.slctd.dayIndex = slctdDayIndex;
    },
  },

  computed: {
    calItem() {
      return {
        height: this.days.length > 7 ? 100 / (this.days.length / 7) + '%' : '100%',
        flex: this.days.length >= 7 ? '0 0 16.6666%' : '0 0 ' + 100 / this.days.length + '%',
      };
    },
  },
};
</script>

<style>
.cal-grid {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}
.day {
  display: flex;
  cursor: pointer;
  flex-direction: column;
  border: 2px solid #999999;
  background-image: linear-gradient(125deg, #ffffff 0 25%, #cccccc 95% 100%);
}
.day:hover:not(.activeDay) {
  background-color: #ebccff;
  background-image: linear-gradient(125deg, #ebccff 0 25%, #bca3cc 95% 100%);
}
.saturday {
  height: 50%;
  border-bottom: 1px solid black;
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
