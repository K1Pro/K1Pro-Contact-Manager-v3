<template>
  <div class="navigation">
    <div class="navigation-grid-container">
      <div class="navigation-grid-item1"></div>
      <div class="navigation-grid-item2">
        <button v-if="tmpSttngs.user.calendar.filters.days <= 1" @click="getTime(-7)">
          <i class="fa fa-caret-left"></i>
          <i class="fa fa-caret-left"></i>
        </button>
        <button v-if="tmpSttngs.user.calendar.filters.days > 1" @click="getTime(-28)">
          <i class="fa fa-caret-left"></i>
          <i class="fa fa-caret-left"></i>
        </button>
      </div>
      <div class="navigation-grid-item3">
        <i v-if="tmpSttngs.user.calendar.filters.days == 0" class="fa fa-caret-left" @click="getTime(-1)"></i>
        <i v-if="tmpSttngs.user.calendar.filters.days == 1" class="fa fa-caret-left" @click="getTime(-3)"></i>
        <i v-if="tmpSttngs.user.calendar.filters.days > 1" class="fa fa-caret-left" @click="getTime(-7)"></i>
      </div>
      <div class="navigation-grid-item4">
        <input
          type="date"
          :title="times.updtngY_m_d_H_i_s_z.slice(10, 16).replace('T', ' ')"
          :value="slctdY_m_d"
          @change="changeDate"
        />
      </div>
      <div class="navigation-grid-item5">
        <i v-if="tmpSttngs.user.calendar.filters.days == 0" class="fa fa-caret-right" @click="getTime(1)"></i>
        <i v-if="tmpSttngs.user.calendar.filters.days == 1" class="fa fa-caret-right" @click="getTime(3)"></i>
        <i v-if="tmpSttngs.user.calendar.filters.days > 1" class="fa fa-caret-right" @click="getTime(7)"></i>
      </div>
      <div class="navigation-grid-item6">
        <button v-if="tmpSttngs.user.calendar.filters.days > 1" @click="getTime(28)">
          <i class="fa fa-caret-right"></i>
          <i class="fa fa-caret-right"></i>
        </button>
        <button v-if="tmpSttngs.user.calendar.filters.days <= 1" @click="getTime(7)">
          <i class="fa fa-caret-right"></i>
          <i class="fa fa-caret-right"></i>
        </button>
      </div>
      <div class="navigation-grid-item7"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navigation',

  inject: ['days', 'slctd', 'slctdY_m_d', 'times', 'tmpSttngs'],

  methods: {
    changeDate(event) {
      if (event.target.value != this.slctdY_m_d) {
        this.slctd.dayIndex = this.days.includes(event.target.value)
          ? this.days.findIndex((day) => day == event.target.value)
          : null;
        this.slctd.tmstmp = new Date(event.target.value + 'T00:00:00').getTime();
      }
    },
    getTime(newDate) {
      this.slctd.tmstmp = this.slctd.tmstmp + newDate * 86400000;
    },
  },
};
</script>

<style>
.navigation-grid-container {
  display: grid;
  grid-template-columns: auto 30px 30px 175px 30px 30px auto;
}
.navigation i {
  cursor: pointer;
}
.navigation button {
  background-color: transparent;
  border: 0px;
  padding: 0px;
  margin: 0px;
  font-size: 28px;
  color: black;
}
.navigation button:hover,
.navigation i:hover {
  color: Gray;
}
.navigation-grid-item1,
.navigation-grid-item3,
.navigation-grid-item5,
.navigation-grid-item6,
.navigation-grid-item7 {
  /* padding-top: 4px; */
  font-size: 28px;
  color: black;
}
.navigation-grid-item2 i:first-child {
  margin-right: -3px;
}
.navigation-grid-item6 i:first-child {
  margin-right: -4px;
}
.navigation-grid-item3,
.navigation-grid-item4,
.navigation-grid-item5 {
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
</style>
