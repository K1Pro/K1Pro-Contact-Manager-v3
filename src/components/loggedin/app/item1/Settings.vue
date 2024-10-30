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

      <template v-if="roles.findIndex((role) => role === userData.AppPermissions[appName][1]) > 7">
        <hr />
        <div class="settings-body-label">User:</div>
        <select v-model="userSlctd">
          <option value="" selected disabled>Select</option>
          <option v-for="([userNo, userInfo], userIndex) in Object.entries(userList)" :value="userNo">
            {{ userInfo[0] }}
          </option>
        </select>
        <template v-if="userSlctd != ''">
          <div class="settings-body-label">Type:</div>
          <select :disabled="userList[userSlctd][1] == 'inactive'">
            <option value="inactive" :selected="userList[userSlctd][1] == 'inactive'" disabled>inactive</option>
            <option v-for="role in roles" :value="role" :selected="role == userList[userSlctd][1]">
              {{ role }}
            </option>
          </select>

          <div class="settings-body-label">IPs:</div>
          <textarea
            rows="3"
            :disabled="userList[userSlctd][1] == 'inactive'"
            @change="patchUserDataFn"
            :value="IPList ? IPList : userList[userSlctd][1] == 'inactive' ? 'inactive' : 'all'"
          ></textarea>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',

  inject: [
    'accountSettings',
    'appName',
    'daysRangeArr',
    'patchUserSettings',
    'roles',
    'userData',
    'userList',
    'userSettings',
    'wndw',
  ],

  emits: ['slctdDayIndex', 'tempFiltersDays'],

  data() {
    return { userSlctd: '' };
  },

  computed: {
    IPList() {
      return this.roles.findIndex((role) => role === this.userData.AppPermissions[this.appName][1]) > 7 &&
        this.userSlctd != ''
        ? this.userList?.[this.userSlctd]?.[2]?.join(', ')
        : null;
    },
  },

  methods: {
    daysRangeChange(event) {
      const cloneUserSettings = this.userSettings;
      cloneUserSettings.calendar.filters.days = event.target.value;
      this.$emit('tempFiltersDays', event.target.value);
      this.$emit('slctdDayIndex', null);
      this.patchUserSettings(cloneUserSettings);
    },
    ownersChange(event) {
      const cloneUserSettings = this.userSettings;
      cloneUserSettings.calendar.filters.owners = event.target.value;
      this.patchUserSettings(cloneUserSettings);
    },
    statusChange(event) {
      const cloneUserSettings = this.userSettings;
      cloneUserSettings.calendar.filters.status = event.target.value;
      this.patchUserSettings(cloneUserSettings);
    },
    categoryChange(event) {
      const cloneUserSettings = this.userSettings;
      cloneUserSettings.calendar.filters.category = event.target.value;
      this.patchUserSettings(cloneUserSettings);
    },

    patchUserDataFn(event) {
      if (
        event.target.value.replaceAll(' ', '') == '' ||
        event.target.value.toLowerCase().replaceAll(' ', '').includes('all')
      ) {
        this.userList[this.userSlctd][2] = null;
        this.patchUserData(null);
      } else {
        this.patchUserData(event.target.value.replaceAll(' ', '').split(','));
      }
    },

    async patchUserData(IPList) {
      try {
        const response = await fetch(servr_url + 'users', {
          method: 'PATCH',
          headers: {
            Authorization: access_token,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            UserID: this.userSlctd,
            IPList: IPList,
          }),
        });
        const patchUserDataResJSON = await response.json();
        if (patchUserDataResJSON.success) {
          console.log(patchUserDataResJSON);
        }
      } catch (error) {
        console.log(error.toString());
      }
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
.settings-body textarea {
  width: calc(100% - 65px);
  resize: none;
}
/* .settings-body div {
    padding: 5px 0px 5px 0px;
} */
</style>
