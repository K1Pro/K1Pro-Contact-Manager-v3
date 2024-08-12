<template>
  <div class="calendar-container">
    <div class="calendar-container-item1">
      <calnav></calnav>
    </div>
    <div class="calendar-container-item2">
      <calgrid
        @eventIndex="(el) => $emit('eventIndex', el)"
        @sideMenuSlctdLnk="(el) => $emit('sideMenuSlctdLnk', el)"
        @tempFiltersDays="(el) => $emit('tempFiltersDays', el)"
        @slctdDayIndex="(el) => $emit('slctdDayIndex', el)"
      ></calgrid>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calendar',

  emits: ['eventIndex', 'sideMenuSlctdLnk', 'slctdDayIndex', 'tempFiltersDays'],
};
</script>

<style>
.calendar-container {
  padding: 10px 10px 10px 10px;
}
.calendar-container-item1 {
  /* background-color: red; */
  height: 40px;
}
.calendar-container-item2 {
  background-color: white;
  height: calc(100vh - 60px);
}
.calendar-container-item3 {
  /* background-color: blue; */
  padding-top: 10px;
  height: 50px;
}
@media only screen and (min-width: 768px) {
  .calendar-container {
    padding: 10px 10px 10px 0px;
  }
}
</style>
