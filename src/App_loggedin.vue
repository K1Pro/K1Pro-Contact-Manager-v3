<template>
  <snackbar :msg @deleteMsg="msg = null"></snackbar>

  <template v-if="contacts.length > 0">
    <div class="app-grid-container" :style="appGridContainer">
      <div class="app-grid-item1">
        <sidemenu :sideMenuItems @sideMenuSlctdLnk="(el) => (sideMenuSlctdLnk = el)"></sidemenu>
        <component
          class="app-grid-item1-panel"
          :is="sideMenuSlctdLnk[0]"
          @slctdReport="(el) => (reports = el)"
          @sideMenuSlctdLnk="(el) => (sideMenuSlctdLnk = el)"
          @eventIndex="(el) => (eventIndex = el)"
          @tempFiltersDays="(el) => (tempFiltersDays = el)"
          @slctdDayIndex="(el) => (slctdDayIndex = el)"
          @contacts="(el) => (contacts = el)"
        ></component>
      </div>

      <div
        v-if="wndw.wdth > 768"
        class="app-grid-resizer"
        @mousedown="startResizeGrid"
        @mouseup="stopResizeGrid"
        v-on:dblclick="resetGrid"
      ></div>

      <div class="app-grid-item2">
        <component
          :is="sideMenuSlctdLnk[1]"
          @sideMenuSlctdLnk="(el) => (sideMenuSlctdLnk = el)"
          @eventIndex="(el) => (eventIndex = el)"
          @tempFiltersDays="(el) => (tempFiltersDays = el)"
          @slctdDayIndex="(el) => (slctdDayIndex = el)"
          @slctdTmstmp="(el) => (times.slctdTmstmp = el)"
        ></component>
      </div>
    </div>
  </template>
  <template v-else>
    <div id="loader-container">
      <div class="loader"></div>
    </div>
  </template>
</template>

<script>
export default {
  name: 'App',

  data() {
    return {
      accountSettings: {},
      activeUserList: {},
      contacts: [],
      currentUpdate: null,
      daysRangeArr: [1, 3, 7, 14, 21, 28],
      dsbld: false,
      emails: [],
      eventIndex: null,
      msg: null,
      reports: 'All contacts with min. info',
      slctdDayIndex: null,
      sideMenuSlctdLnk: ['Contactinfo', 'Calendar'],
      tempFiltersDays: null,
      times: {
        initialUsrTmstmp: '',
        initialBrwsrTmstmp: '',
        updtngY_m_d_H_i_s_z: null,
        slctdTmstmp: '',
      },
      updating: 0,
      userData: {},
      userSettings: {},
      wndw: {
        wdth: 0,
        hght: 0,
      },
    };
  },

  provide() {
    return {
      // computed
      accountSettings: Vue.computed(() => this.accountSettings),
      activeUserList: Vue.computed(() => this.activeUserList),
      contacts: Vue.computed(() => this.contacts),
      days: Vue.computed(() => this.days),
      dsbld: Vue.computed(() => this.dsbld),
      emails: Vue.computed(() => this.emails),
      eventIndex: Vue.computed(() => this.eventIndex),
      firstDayTmstmp: Vue.computed(() => this.firstDayTmstmp),
      reports: Vue.computed(() => this.reports),
      sideMenuSlctdLnk: Vue.computed(() => this.sideMenuSlctdLnk),
      slctdCntctIndex: Vue.computed(() => this.slctdCntctIndex),
      slctdY_m_d: Vue.computed(() => this.slctdY_m_d),
      tbCntntWdth: Vue.computed(() => this.tbCntntWdth),
      times: Vue.computed(() => this.times),
      tempFiltersDays: Vue.computed(() => this.tempFiltersDays),
      userData: Vue.computed(() => this.userData),
      userList: Vue.computed(() => this.userList),
      userSettings: Vue.computed(() => this.userSettings),
      wndw: Vue.computed(() => this.wndw),
      // static
      daysRangeArr: this.daysRangeArr,
      // methods
      deleteContactInfo: this.deleteContactInfo,
      patchContactInfo: this.patchContactInfo,
      patchUserSettings: this.patchUserSettings,
      showMsg: this.showMsg,
      usaDateFrmt: this.usaDateFrmt,
    };
  },

  computed: {
    userList() {
      return { ...this.activeUserList, ...this.accountSettings.userList };
    },
    appGridItem2Width() {
      return 100 - this.userSettings.layout['grid-size'];
    },
    appGridContainer() {
      return this.wndw.wdth > 768
        ? {
            'grid-template-columns': `calc(${this.userSettings.layout['grid-size']}% - 5px) 10px calc(${this.appGridItem2Width}% - 5px)`,
          }
        : false;
    },
    sideMenuItems() {
      return [
        ['fa fa-house-chimney-user', null, 'Contact info', 'Calendar'],
        ['fa fa-calendar-check', this.contacts[this.slctdCntctIndex]?.Tasks.length, 'Tasks', 'Calendar'],
        ['fa fa-repeat', this.contacts[this.slctdCntctIndex]?.RecurTasks.length, 'Recurring tasks', 'Calendar'],
        ['fa fa-file-pen', this.contacts[this.slctdCntctIndex]?.Notes.length, 'Notes', 'Calendar'],
        ['fa fa-chart-pie', null, 'Reports', 'Reportstable'],
        ['fa fa-user-gear', null, 'Settings', 'Calendar'],
      ];
    },
    tbCntntWdth() {
      return this.wndw.wdth > 768
        ? Math.round((this.wndw.wdth * (this.userSettings?.layout?.['grid-size'] / 100) - 75.02) * 100) / 100
        : Math.round((this.wndw.wdth - 75.02) * 100) / 100;
    },
    firstDayTmstmp() {
      const cmptdDayNumber = this.slctdDayIndex != null ? this.slctdDayIndex : 1;
      const cmptdDayOfTheWeek = this.dayOfTheWeek == 0 ? 6 : this.dayOfTheWeek - 1;
      const cmptdNoOfWeeks = this.slctdDayIndex != null ? Math.floor(this.slctdDayIndex / 7) : 1;
      return this.userSettings.calendar.filters.days == 0
        ? this.times.slctdTmstmp
        : this.userSettings.calendar.filters.days == 1
        ? this.times.slctdTmstmp - cmptdDayNumber * 86400000
        : this.userSettings.calendar.filters.days == 2
        ? this.times.slctdTmstmp - cmptdDayOfTheWeek * 86400000
        : this.times.slctdTmstmp - cmptdNoOfWeeks * 604800000 - cmptdDayOfTheWeek * 86400000;
    },
    slctdY_m_d() {
      // prettier-ignore
      return (new Date(this.times.slctdTmstmp).getFullYear() + '-' + (new Date(this.times.slctdTmstmp).getMonth() + 1).toString().padStart(2, '0') + '-' + new Date(this.times.slctdTmstmp).getDate().toString().padStart(2, '0'));
    },
    slctdCntctIndex() {
      return this.contacts.findIndex((contact) => contact.id == this.userSettings.selectedContactIndex);
    },
    dayOfTheWeek() {
      return new Date(this.times.slctdTmstmp).getDay(); // 0 is Sunday, 1 is Monday, 2 is Tuesday, ...,
    },
    dayIndex() {
      return this.days.findIndex((day) => day == this.slctdY_m_d);
    },
    calRow() {
      return Math.ceil((this.days.findIndex((day) => day == this.slctdY_m_d) + 1) / 7);
    },
    days() {
      let dateRangeStart = 1;
      let dateArray = [];
      let currentDate = new Date(this.firstDayTmstmp);
      while (dateRangeStart <= this.daysRangeArr[this.userSettings.calendar.filters.days]) {
        // prettier-ignore
        dateArray.push(currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + currentDate.getDate().toString().padStart(2, '0'));
        currentDate.setDate(currentDate.getDate() + 1);
        dateRangeStart++;
      }
      return dateArray;
    },
  },

  methods: {
    showMsg(newMsg) {
      this.msg = newMsg;
    },
    async updateTime() {
      const timeDifference = Math.round((this.times.initialBrwsrTmstmp - new Date().getTime()) * -1);
      this.times.updtngY_m_d_H_i_s_z = new Date(this.times.initialUsrTmstmp + timeDifference).toISOString();
      try {
        const response = await fetch(servr_url + 'currentupdate', {
          method: 'GET',
          headers: {
            Authorization: access_token,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        });
        const getCurrentupdateResJSON = await response.json();
        if (getCurrentupdateResJSON.success) {
          if (this.dsbld == true) {
            this.dsbld = false;
            this.showMsg('Internet restored');
          }
          if (this.currentUpdate != getCurrentupdateResJSON.data.datetime && this.currentUpdate != null) {
            this.getContacts(getCurrentupdateResJSON.data.datetime);
          } else if (this.currentUpdate == null) {
            this.currentUpdate = getCurrentupdateResJSON.data.datetime;
          }
        }
      } catch (error) {
        this.dsbld = true;
        this.showMsg('Internet problem');
        console.log(error.toString());
      }
    },

    async getUserData() {
      console.log(servr_url);
      try {
        const response = await fetch(servr_url + 'users', {
          method: 'GET',
          headers: {
            Authorization: access_token,
            'Cache-Control': 'no-store',
          },
        });
        const userDataResJSON = await response.json();
        if (userDataResJSON.success) {
          console.log(userDataResJSON);
          this.times.initialBrwsrTmstmp = new Date().getTime();
          this.times.initialUsrTmstmp = new Date(userDataResJSON.data.date_Y_m_d_H_i_s_z).getTime();
          this.times.updtngY_m_d_H_i_s_z = userDataResJSON.data.date_Y_m_d_H_i_s_z;
          this.times.slctdTmstmp = new Date(this.times.updtngY_m_d_H_i_s_z).getTime();

          setInterval(() => {
            this.updateTime();
          }, 6000);

          this.userData = userDataResJSON.data.user;
          this.accountSettings = userDataResJSON.data.accountSettings;
          this.tempFiltersDays = userDataResJSON.data.userSettings.calendar.filters.days;
          this.activeUserList = userDataResJSON.data.activeUserList;
          if (
            this.wndw.wdth < 768 &&
            userDataResJSON.data.userSettings.calendar.filters.days != 0 &&
            userDataResJSON.data.userSettings.calendar.filters.days != 1
          )
            userDataResJSON.data.userSettings.calendar.filters.days = 1;
          this.userSettings = userDataResJSON.data.userSettings;

          this.getContacts(null);
          this.getEmailSettings();
        } else {
          document.cookie = `_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
          document.cookie = `_s_i=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
          location.reload();
        }
      } catch (error) {
        this.showMsg('Internet problem');
        console.log(error.toString());
      }
    },

    async getContacts(updateTime) {
      try {
        const response = await fetch(servr_url + 'contacts', {
          method: 'GET',
          headers: {
            Authorization: access_token,
            'Cache-Control': 'no-store',
          },
        });
        const getContactsResJSON = await response.json();
        if (getContactsResJSON.success && document.activeElement.tagName == 'BODY' && !this.updating) {
          if (this.contacts.length == 0) {
            this.contacts = getContactsResJSON.data.contacts;
          } else {
            const slctdCntctIndx = getContactsResJSON.data.contacts.findIndex(
              (contact) => contact.id == this.userSettings.selectedContactIndex
            );
            if (slctdCntctIndx != null && slctdCntctIndx != undefined) {
              getContactsResJSON.data.contacts[slctdCntctIndx] = this.contacts[this.slctdCntctIndex];
              this.contacts = getContactsResJSON.data.contacts;
            } else {
              this.contacts = getContactsResJSON.data.contacts;
            }
          }
          this.currentUpdate = updateTime;
        }
      } catch (error) {
        this.showMsg('Internet problem');
        console.log(error.toString());
      }
    },

    async getEmailSettings() {
      try {
        const response = await fetch(servr_url + 'emails', {
          method: 'GET',
          headers: {
            Authorization: access_token,
            'Cache-Control': 'no-store',
          },
        });
        const getEmailSettingsResJSON = await response.json();
        if (getEmailSettingsResJSON.success) {
          // console.log(getEmailSettingsResJSON);
          this.emails = getEmailSettingsResJSON.data.emailSettings;
        }
      } catch (error) {
        this.showMsg('Internet problem');
        console.log(error.toString());
      }
    },

    usaDateFrmt(dateString) {
      let newDateString = dateString;
      if (dateString != null && dateString != undefined) {
        // prettier-ignore
        newDateString = dateString.includes('T')
          ? dateString.slice(5, 7) + '/' + dateString.slice(8, 10) + '/' + dateString.slice(0, 4) + ' ' + dateString.slice(11,16)
          : dateString.slice(5, 7) + '/' + dateString.slice(8, 10) + '/' + dateString.slice(0, 4)
      }
      return newDateString;
    },

    async patchContactInfo(event, column, columnIndex, key, newCntctInfo) {
      this.contacts[this.slctdCntctIndex] = newCntctInfo;
      this.contacts[this.slctdCntctIndex].Updated = {
        [this.userData.id]: this.times.updtngY_m_d_H_i_s_z,
      };
      let cloneUpdating = this.updating;
      this.updating = cloneUpdating + 1;
      try {
        const response = await fetch(servr_url + 'contacts', {
          method: 'PATCH',
          headers: {
            Authorization: access_token,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            ID: this.userSettings.selectedContactIndex,
            Column: column,
            ColumnIndex: columnIndex,
            Key: key,
            Value: event,
          }),
        });
        const patchContactInfoResJSON = await response.json();
        if (patchContactInfoResJSON.success) {
          // console.log(patchContactInfoResJSON.data);
          cloneUpdating = this.updating;
          this.updating = cloneUpdating - 1;
        } else {
          this.showMsg('Update error');
          cloneUpdating = this.updating;
          this.updating = cloneUpdating - 1;
        }
      } catch (error) {
        this.showMsg('Update error');
        cloneUpdating = this.updating;
        this.updating = cloneUpdating - 1;
        this.showMsg(error.toString());
      }
    },

    async deleteContactInfo(column, columnIndex, prevConfirm) {
      let cloneUpdating = this.updating;
      this.updating = cloneUpdating + 1;
      if (prevConfirm || confirm('Are you sure you would like to delete this?') == true) {
        this.contacts[this.slctdCntctIndex][column].splice(columnIndex, 1);
        try {
          const response = await fetch(servr_url + 'contacts', {
            method: 'DELETE',
            headers: {
              Authorization: access_token,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
            body: JSON.stringify({
              ID: this.userSettings.selectedContactIndex,
              Column: column,
              ColumnIndex: columnIndex,
            }),
          });
          const deleteContactInfoResJSON = await response.json();
          if (deleteContactInfoResJSON.success) {
            cloneUpdating = this.updating;
            this.updating = cloneUpdating - 1;
          } else {
            this.showMsg('Delete error');
            cloneUpdating = this.updating;
            this.updating = cloneUpdating - 1;
          }
        } catch (error) {
          this.showMsg('Delete error');
          cloneUpdating = this.updating;
          this.updating = cloneUpdating - 1;
          this.showMsg(error.toString());
        }
      }
    },

    async patchUserSettings(newUserSettings) {
      this.userSettings = newUserSettings;
      try {
        const response = await fetch(servr_url + 'settings', {
          method: 'PATCH',
          headers: {
            Authorization: access_token,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            Settings: this.userSettings,
          }),
        });
        const patchUserSettingsResJSON = await response.json();
        if (!patchUserSettingsResJSON.success) {
          this.showMsg('Settings update error');
        }
      } catch (error) {
        console.log(error.toString());
        this.showMsg('Settings update error');
      }
    },

    updateScreenWidth() {
      this.wndw.wdth = window.innerWidth;
      this.wndw.hght = window.innerHeight;
    },
    onScreenResize() {
      window.addEventListener('resize', () => {
        this.updateScreenWidth();
      });
    },

    resizeGrid(event) {
      const newGridSize = Math.round((event.clientX / window.innerWidth) * 100);
      if (newGridSize > 25 && newGridSize < 65) this.userSettings.layout['grid-size'] = newGridSize;
    },

    startResizeGrid() {
      document.querySelector('body').classList.add('prevent-select');
      document.addEventListener('mousemove', this.resizeGrid, true);
      document.addEventListener('mouseup', this.stopResizeGrid, true);
    },

    stopResizeGrid() {
      this.patchUserSettings(this.userSettings);
      document.removeEventListener('mousemove', this.resizeGrid, true);
      document.removeEventListener('mouseup', this.stopResizeGrid, true);
      document.querySelector('body').classList.remove('prevent-select');
    },

    resetGrid() {
      this.userSettings.layout['grid-size'] = 50;
      this.patchUserSettings(this.userSettings);
    },
  },

  created() {
    this.getUserData();
  },

  mounted() {
    this.updateScreenWidth();
    this.onScreenResize();
  },
};
</script>

<style>
.app-grid-container {
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100vh auto; /* auto */
  grid-row-gap: 10px;
  background-color: #c6c6c6;
  /* word-break: break-all; */
}

.app-grid-item1 {
  min-height: 100vh;
  order: 3;
  overflow-y: hidden;
  background: -webkit-linear-gradient(left, #f1f1f1 49px, #999999 49px);
  background: -moz-linear-gradient(left, #f1f1f1 49px, #999999 49px);
  background: -ms-linear-gradient(left, #f1f1f1 49px, #999999 49px);
  background: linear-gradient(left, #f1f1f1 49px, #999999 49px);
}

.app-grid-item2 {
  order: 1;
  background-color: #999999;
  overflow-y: hidden;
}

.app-grid-item1-panel {
  padding: 0px 0px 0px 65px;
  height: 100%;
  overflow-y: auto;
  border-style: solid;
  border-width: 10px 0px 10px 0px;
  border-color: #00000000;
}

@media only screen and (min-width: 768px) {
  .app-grid-container {
    /* grid-template-columns: calc(50% - 5px) 10px calc(50% - 5px); this is in computed now*/
    grid-template-rows: 100vh;
  }

  .app-grid-item1 {
    min-height: auto;
    order: 1;
    background: #999999;
  }

  .app-grid-resizer {
    order: 2;
    cursor: col-resize;
    background-color: #999999;
  }

  .app-grid-item2 {
    order: 3;
  }
}
</style>
