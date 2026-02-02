<template>
  <div class="nav">
    <button class="fast-rewind" @click="day > 1 ? getTime(-28) : getTime(-7)">
      <i class="fa fa-caret-left"></i>
      <i class="fa fa-caret-left"></i>
    </button>
    <button @click="day == 0 ? getTime(-1) : day == 1 ? getTime(-3) : getTime(-7)">
      <i class="fa fa-caret-left"></i>
    </button>
    <input
      type="date"
      :title="updt.updtngY_m_d_H_i_s_z.slice(10, 16).replace('T', ' ')"
      :value="slctdY_m_d"
      @change="changeDate"
    />
    <button @click="day == 0 ? getTime(1) : day == 1 ? getTime(3) : getTime(7)">
      <i class="fa fa-caret-right"></i>
    </button>
    <button class="fast-forward" @click="day > 1 ? getTime(28) : getTime(7)">
      <i class="fa fa-caret-right"></i>
      <i class="fa fa-caret-right"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'Nav',

  inject: ['days', 'slctd', 'slctdY_m_d', 'updt', 'tmpSttngs'],

  computed: {
    day() {
      return this.tmpSttngs?.user?.calendar?.filters?.days;
    },
  },

  methods: {
    changeDate(event) {
      if (event.target.value != this.slctdY_m_d && event.target.value != '') {
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
.nav {
  gap: 10px;
  height: 40px;
  display: flex;
  overflow: hidden;
  min-width: 100%;
  justify-content: center;
}
.nav button {
  margin: 0px;
  border: 0px;
  padding: 0px;
  font-size: 28px;
  background-color: transparent;
}
.nav i:hover,
.nav button:hover {
  color: Gray;
  cursor: pointer;
}
.fast-rewind i:first-child {
  margin-right: -3px;
}
.fast-forward i:first-child {
  margin-right: -4px;
}
.nav input[type='date'] {
  border: 0;
  width: 175px;
  font-size: 25px;
  background-color: #999999;
  font-family: 'Helvetica', sans-serif;
}
</style>
