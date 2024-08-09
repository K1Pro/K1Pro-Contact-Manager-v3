<template>
  <div class="settings">
    <div class="settings-title">Settings for {{ userData.FirstName }}</div>
    <div class="settings-body">
      <div class="settings-body-label">Days:</div>
      <select :value="userSettings.calendar.filters.days" @change="daysRangeChange">
        <template v-if="wndw.wdth > 768">
          <option v-for="(daysRange, daysRangeIndex) in daysRangeArr" :value="daysRangeIndex">
            {{ daysRange }}
          </option>
        </template>
        <template v-else>
          <option value="0">1</option>
          <option value="1">3</option>
        </template>
      </select>
      <div class="settings-body-label">Owners:</div>
      <select :value="userSettings.calendar.filters.owners" @change="ownersChange">
        <option value="">All</option>
        <option v-for="([userNo, userInfo], userIndex) in Object.entries(userList)" :value="userNo">
          {{ userInfo[0] }}
        </option>
      </select>
      <div class="settings-body-label">Status:</div>
      <select :value="userSettings.calendar.filters.status" @change="statusChange">
        <option value="">All</option>
        <option value="compltd">Completed</option>
        <option value="not-compltd">Not completed</option>
        <option value="renewal">Recurring</option>
      </select>
      <div class="settings-body-label">Category:</div>
      <select :value="userSettings.calendar.filters.category" @change="categoryChange">
        <option value="">All</option>
        <option v-for="category in accountSettings.Categ" :value="category">
          {{ category }}
        </option>
      </select>
      <div>
        <logout></logout>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',

  inject: ['accountSettings', 'daysRangeArr', 'patchUserSettings', 'userData', 'userList', 'userSettings', 'wndw'],

  emits: ['slctdDayIndex', 'tempFiltersDays', 'userSettings'],

  methods: {
    daysRangeChange(event) {
      this.userSettings.calendar.filters.days = event.target.value;
      this.$emit('tempFiltersDays', event.target.value);
      this.$emit('slctdDayIndex', null);
      this.$emit('userSettings', this.userSettings);
      this.patchUserSettings();
    },
    ownersChange(event) {
      this.userSettings.calendar.filters.owners = event.target.value;
      this.$emit('userSettings', this.userSettings);
      this.patchUserSettings();
    },
    statusChange(event) {
      this.userSettings.calendar.filters.status = event.target.value;
      this.$emit('userSettings', this.userSettings);
      this.patchUserSettings();
    },
    categoryChange(event) {
      this.userSettings.calendar.filters.category = event.target.value;
      this.$emit('userSettings', this.userSettings);
      this.patchUserSettings();
    },
  },
};
</script>

<style>
.settings-title {
  background-color: lightblue;
  font-weight: bold;
  padding: 5px;
  color: black;
  height: 30px;
  overflow: hidden;
  white-space: nowrap;
}
.settings-body {
  padding: 5px;
  background-color: white;
  height: calc(100vh - 50px);
}
.settings-body-label {
  padding-bottom: 10px;
  font-size: 14px;
  display: inline-block;
  width: 65px;
  text-align: right;
}
.settings-body select {
  width: calc(100% - 65px);
  height: 20px;
  font-family: 'Helvetica', sans-serif;
  font-size: 14px;
  overflow: hidden;
}
.settings-body input[type='range'] {
  width: calc(100% - 90px);
  height: 20px;
  overflow: hidden;
}
/* .settings-body div {
    padding: 5px 0px 5px 0px;
} */
</style>
