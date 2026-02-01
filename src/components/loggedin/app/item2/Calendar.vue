<template>
  <div class="cal-cntnr">
    <div class="cal-cntnr-item1">
      <calnav></calnav>
    </div>
    <div class="cal-cntnr-item2">
      <calgrid></calgrid>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calendar',
};
</script>

<style>
.cal-cntnr {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.cal-cntnr-item1 {
  height: 40px;
}
.cal-cntnr-item2 {
  height: calc(100% - 40px);
  background-color: white;
}
</style>
