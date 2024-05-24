import Logoutbtn from './LogOutBtn_vue.js';

export default {
  name: 'Settings',

  template: /*html*/ `
    <div class="settings">
        <div class="settings-title">
            Settings for {{userData.FirstName}}
        </div>
        <div class="settings-body">
            <div class="settings-body-label">Days:</div>
            <input v-if="windowWidth > 768" type="range" min="0" max="5" v-model="userSettings.calendar.filters.days" @change="daysRangeChange" @input="getFirstCalDate">
            <input v-if="windowWidth < 768" type="range" min="0" max="1" v-model="userSettings.calendar.filters.days" @change="daysRangeChange" @input="getFirstCalDate">
            <span>{{ daysRangeArr[userSettings.calendar.filters.days] }}</span>
            <div class="settings-body-label">Owners:</div>
            <select v-model="userSettings.calendar.filters.owners" @change="ownersChange">
                <option value="">All</option>
                <option v-for="([userNo, userInfo], userIndex) in Object.entries(userList)" :value="userNo">{{userInfo[0]}}</option>
            </select>
            <div class="settings-body-label">Status:</div>
            <select v-model="userSettings.calendar.filters.status" @change="statusChange">
                <option value="">All</option>
                <option value="compltd">Completed</option>
                <option value="not-compltd">Not completed</option>
                <option value="renewal">Recurring</option>
            </select>
            <div class="settings-body-label">Category:</div>
            <select v-model="userSettings.calendar.filters.category" @change="categoryChange">
                <option value="">All</option>
                <option v-for="category in accountSettings.Categ" :value="category">{{category}}</option>
            </select>
            <div>
                <logoutbtn></logoutbtn>
            </div>
        </div>
    </div>
    
    `,

  components: {
    Logoutbtn,
  },

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'windowWidth',
      'userData',
      'accountSettings',
      'userSettings',
      'tempFiltersDays',
      'daysRangeArr',
      'patchUserSettings',
      'getFirstCalDate',
      'dayIndex',
      'calRow',
      'userList',
    ]),
  },

  methods: {
    daysRangeChange(event) {
      this.userSettings.calendar.filters.days = event.target.value;
      this.tempFiltersDays = event.target.value;
      this.patchUserSettings();
    },
    ownersChange() {
      this.patchUserSettings();
    },
    statusChange() {
      this.patchUserSettings();
    },
    categoryChange() {
      this.patchUserSettings();
    },
  },

  mounted() {
    style(
      'settings',
      /*css*/ `
.settings {
  background-color: lightblue;
}
.settings-title{
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
        `
    );
  },
};
