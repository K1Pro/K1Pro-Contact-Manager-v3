<template>
  <div class="settings">
    <div class="settings-title">Settings for {{ userData.FirstName }}</div>
    <div class="settings-body">
      <div class="settings-body-label">Days:</div>
      <select :value="sttngs.user.calendar.filters.days" @change="daysRangeChange">
        <option
          v-for="(daysRange, daysRangeIndex) in daysRangeArr"
          :value="daysRangeIndex"
          :disabled="wndw.wdth < 768 && daysRangeIndex > 1"
        >
          {{ daysRange }}
        </option>
      </select>
      <div class="settings-body-label">Owners:</div>
      <select :value="sttngs.user.calendar.filters.owners" @change="ownersChange">
        <option value="">All</option>
        <option v-for="([userNo, userInfo], userIndex) in Object.entries(userList)" :value="userNo">
          {{ userInfo.FirstName }}
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
        <option v-for="category in sttngs.entity.Categ" :value="category">
          {{ category }}
        </option>
      </select>
      <div class="settings-body-label">Clock:</div>
      <select :value="sttngs.user.clock" @change="clockChange">
        <option value="12">12-hour</option>
        <option value="24">24-hour</option>
      </select>
      <button @click="notificationsChange">Toggle notifications</button>

      <template v-if="userRole > 7">
        <hr />
        <div class="settings-body-label">User:</div>
        <select v-model="userSlctd">
          <option value="" selected disabled>Select</option>
          <option v-for="([userNo, userInfo], userIndex) in Object.entries(userList)" :value="userNo">
            {{ userInfo.FirstName }}
          </option>
        </select>
        <div class="settings-body-label">Online:</div>
        <input
          type="text"
          disabled
          :value="
            userData.id == userSlctd
              ? times.updtngY_m_d_H_i_s_z.replace('T', ' ').slice(0, 16)
              : times.mstRcntUpdates[userSlctd]
              ? times.mstRcntUpdates[userSlctd].slice(0, 16)
              : 'Never'
          "
        />
        <template v-if="userSlctd != ''">
          <div class="settings-body-label">Type:</div>
          <select
            name="role"
            :disabled="userList[userSlctd].role == 'inactive' || userSlctd == userData.id"
            :value="userList[userSlctd].role"
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
            name="ip"
            rows="3"
            :disabled="userList[userSlctd].role == 'inactive' || userSlctd == userData.id"
            :value="IPList ? IPList : userList[userSlctd].role == 'inactive' ? 'inactive' : 'all'"
            @change="patchIPList"
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
    'entity',
    'userSttngsReq',
    'roles',
    'showMsg',
    'sttngs',
    'slctd',
    'times',
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
      return this.userRole > 7 && this.userSlctd != '' ? this.userList?.[this.userSlctd]?.ip?.join(', ') : null;
    },
  },

  methods: {
    daysRangeChange(event) {
      const cloneSttngs = this.sttngs.user;
      cloneSttngs.calendar.filters.days = event.target.value;
      this.slctd.dayIndex = null;
      this.userSttngsReq('PATCH', cloneSttngs);
    },
    ownersChange(event) {
      const cloneSttngs = this.sttngs.user;
      cloneSttngs.calendar.filters.owners = event.target.value;
      this.userSttngsReq('PATCH', cloneSttngs);
    },
    statusChange(event) {
      const cloneSttngs = this.sttngs.user;
      cloneSttngs.calendar.filters.status = event.target.value;
      this.userSttngsReq('PATCH', cloneSttngs);
    },
    categoryChange(event) {
      const cloneSttngs = this.sttngs.user;
      cloneSttngs.calendar.filters.category = event.target.value;
      this.userSttngsReq('PATCH', cloneSttngs);
    },
    clockChange(event) {
      const cloneSttngs = this.sttngs.user;
      cloneSttngs.clock = event.target.value;
      this.userSttngsReq('PATCH', cloneSttngs);
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
      if (this.userSlctd != this.userData.id) {
        this.sttngs.entity.activeUserList[this.userSlctd][event.target.name] = event.target.value;
        this.patchUserData(event.target.value, 'AppPermissions', null, event.target.name, this.userSlctd);
      }
    },

    patchIPList(event) {
      this.sttngs.entity.activeUserList[this.userSlctd].ip =
        event.target.value.trim().toLowerCase() === 'all' ? null : event.target.value.replaceAll(' ', '').split(',');
      this.patchUserData(
        this.sttngs.entity.activeUserList[this.userSlctd].ip,
        'AppPermissions',
        null,
        event.target.name,
        this.userSlctd
      );
    },
    async patchUserData(event, column, columnIndex, key, ID) {
      try {
        const response = await fetch(api_path.login + '/userdata', {
          method: 'PATCH',
          headers: {
            Authorization: access_token,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            ID: ID,
            Column: column,
            ColumnIndex: columnIndex,
            Key: key,
            Value: event,
          }),
        });
        const resJSON = await response.json();
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
.settings-body input[type='text'] {
  width: calc(100% - 65px);
  border: 1px solid lightgrey;
}
/* .settings-body div {
    padding: 5px 0px 5px 0px;
} */
</style>
