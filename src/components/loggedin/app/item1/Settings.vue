<template>
  <div class="settings">
    <div class="settings-title">Settings for {{ userData.FirstName }}</div>
    <div class="settings-body">
      <div class="settings-body-label">Days:</div>
      <select :value="sttngs.user.calendar.filters.days" @change="daysRangeChange">
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
      <select :value="sttngs.user.calendar.filters.owners" @change="ownersChange">
        <option value="">All</option>
        <option v-for="([userNo, userInfo], userIndex) in Object.entries(userList)" :value="userNo">
          {{ userInfo[0] }}
        </option>
      </select>
      <div class="settings-body-label">Status:</div>
      <select :value="sttngs.user.calendar.filters.status" @change="statusChange">
        <option value="">All</option>
        <option value="compltd">Completed</option>
        <option value="not-compltd">Not completed</option>
        <option value="renewal">Recurring</option>
      </select>
      <div class="settings-body-label">Category:</div>
      <select :value="sttngs.user.calendar.filters.category" @change="categoryChange">
        <option value="">All</option>
        <option v-for="category in sttngs.accnt.Categ" :value="category">
          {{ category }}
        </option>
      </select>
      <div class="settings-body-label">Clock:</div>
      <select :value="sttngs.user.clock" @change="clockChange">
        <option value="12">12-hour</option>
        <option value="24">24-hour</option>
      </select>
      <button @click="notificationsChange">Enable notifications</button>

      <template v-if="userRole > 7">
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
          <select
            :disabled="userList[userSlctd][1] == 'inactive'"
            v-model="userList[userSlctd][1]"
            @change="patchAuthorization"
          >
            <template v-for="role in roles">
              <option v-if="role != 'demo' && role != 'guest'" :disabled="role == 'inactive'" :value="role">
                {{ role }}
              </option>
            </template>
          </select>

          <div class="settings-body-label">IPs:</div>
          <textarea
            rows="3"
            :disabled="userList[userSlctd][1] == 'inactive'"
            @change="patchIPList"
            :value="IPList ? IPList : userList[userSlctd][1] == 'inactive' ? 'inactive' : 'all'"
          ></textarea>
          <div class="settings-body-label">Timezone:</div>
          <select>
            <option selected>GMT-5 (Central)</option>
          </select>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',

  inject: [
    'appName',
    'daysRangeArr',
    'patchUserSettings',
    'roles',
    'showMsg',
    'sttngs',
    'slctd',
    'userData',
    'userList',
    'userRole',
    'wndw',
  ],

  data() {
    return { userSlctd: this.userData.id };
  },

  computed: {
    IPList() {
      return this.userRole > 7 && this.userSlctd != '' ? this.userList?.[this.userSlctd]?.[2]?.join(', ') : null;
    },
  },

  methods: {
    daysRangeChange(event) {
      const cloneSttngs = this.sttngs.user;
      cloneSttngs.calendar.filters.days = event.target.value;
      this.sttngs.temp.calendar.filters.days = event.target.value;
      this.slctd.dayIndex = null;
      this.patchUserSettings(cloneSttngs);
    },
    ownersChange(event) {
      const cloneSttngs = this.sttngs.user;
      cloneSttngs.calendar.filters.owners = event.target.value;
      this.patchUserSettings(cloneSttngs);
    },
    statusChange(event) {
      const cloneSttngs = this.sttngs.user;
      cloneSttngs.calendar.filters.status = event.target.value;
      this.patchUserSettings(cloneSttngs);
    },
    categoryChange(event) {
      const cloneSttngs = this.sttngs.user;
      cloneSttngs.calendar.filters.category = event.target.value;
      this.patchUserSettings(cloneSttngs);
    },
    clockChange(event) {
      const cloneSttngs = this.sttngs.user;
      cloneSttngs.clock = event.target.value;
      this.patchUserSettings(cloneSttngs);
    },
    notificationsChange() {
      Notification.requestPermission().then((result) => {
        if (result == 'denied') {
          this.showMsg('Notifications are turned off. Enable them in the browser');
        } else if (result == 'granted') {
          this.showMsg('Notifications are on');
        } else {
          this.showMsg('Enable notifications in the browser');
        }
      });
    },
    patchAuthorization(event) {
      if (this.userSlctd == this.userData.id) {
        this.userData.AppPermissions[this.appName][1] = event.target.value;
      }
      this.patchUserData(event.target.value, null);
    },

    patchIPList(event) {
      if (
        event.target.value.replaceAll(' ', '') == '' ||
        event.target.value.toLowerCase().replaceAll(' ', '').includes('all')
      ) {
        this.userList[this.userSlctd][2] = null;
        this.patchUserData(null, null);
      } else {
        this.userList[this.userSlctd][2] = event.target.value.replaceAll(' ', '').split(',');
        this.patchUserData(null, event.target.value.replaceAll(' ', '').split(','));
      }
    },

    async patchUserData(authorization, IPList) {
      try {
        const response = await fetch(app_api_url + '/users', {
          method: 'PATCH',
          headers: {
            Authorization: access_token,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            UserID: this.userSlctd,
            IPList: IPList,
            Authorization: authorization,
          }),
        });
        const patchUserDataResJSON = await response.json();
        console.log(patchUserDataResJSON);
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
.settings-body textarea {
  width: calc(100% - 65px);
  resize: none;
}
.settings-body button {
  margin-left: 65px;
  width: calc(100% - 65px);
}
/* .settings-body div {
    padding: 5px 0px 5px 0px;
} */
</style>
