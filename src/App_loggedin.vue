<template>
  <snackbar :msg @deleteMsg="msg = null"></snackbar>

  <template v-if="contacts.length > 0">
    <div class="app-grid-container" :style="appGridContainer">
      <div class="app-grid-item1">
        <sidemenu
          :sideMenuItems
          :wndw
          @sideMenuSlctdLnk="(el) => ((eventIndex = null), (sideMenuSlctdLnk = el))"
        ></sidemenu>
        <component
          class="app-grid-item1-panel"
          :is="sideMenuSlctdLnk[0]"
          @slctdReport="(el) => (reports = el)"
          @slctdChatGroup="(el) => (chatGroup = el)"
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
      <div id="loader"></div>
    </div>
  </template>
</template>

<script>
export default {
  name: 'App',

  mixins: [snackbarMixin, wndwWdthHghtMixin, appGridResizerMixin],

  data() {
    return {
      accountSettings: {},
      activeUserList: {},
      chats: [],
      slctd: { chatGroup: null },
      contacts: [],
      currentUpdate: null,
      daysRangeArr: [1, 3, 7, 14, 21, 28],
      dsbld: false,
      emails: [],
      eventIndex: null,
      reports: null,
      slctdDayIndex: null,
      sideMenuSlctdLnk: ['Contactinfo', 'Calendar'],
      tempFiltersDays: null,
      times: {
        initialUsrTmstmp: '',
        initialBrwsrTmstmp: '',
        updtngY_m_d_H_i_s_z: null,
        slctdTmstmp: '',
        mstRcntChat: null,
      },
      roles: [
        'inactive',
        'guest',
        'subscriber',
        'viewer',
        'contributor',
        'author',
        'editor',
        'publisher',
        'demo',
        'manager',
        'admin',
      ],
      updating: 0,
      userData: {},
      userSettings: {},
      appName: app_name,
    };
  },

  provide() {
    return {
      // computed
      accountSettings: Vue.computed(() => this.accountSettings),
      activeUserList: Vue.computed(() => this.activeUserList),
      chats: Vue.computed(() => this.chats),
      slctd: Vue.computed(() => this.slctd),
      contacts: Vue.computed(() => this.contacts),
      days: Vue.computed(() => this.days),
      dsbld: Vue.computed(() => this.dsbld),
      emails: Vue.computed(() => this.emails),
      eventIndex: Vue.computed(() => this.eventIndex),
      firstDayTmstmp: Vue.computed(() => this.firstDayTmstmp),
      newChats: Vue.computed(() => this.newChats),
      reports: Vue.computed(() => this.reports),
      sideMenuSlctdLnk: Vue.computed(() => this.sideMenuSlctdLnk),
      slctdCntctIndex: Vue.computed(() => this.slctdCntctIndex),
      slctdY_m_d: Vue.computed(() => this.slctdY_m_d),
      tbCntntWdth: Vue.computed(() => this.tbCntntWdth),
      times: Vue.computed(() => this.times),
      tempFiltersDays: Vue.computed(() => this.tempFiltersDays),
      userData: Vue.computed(() => this.userData),
      userList: Vue.computed(() => this.userList),
      userRole: Vue.computed(() => this.userRole),
      userSettings: Vue.computed(() => this.userSettings),
      // static
      daysRangeArr: this.daysRangeArr,
      appName: this.appName,
      roles: this.roles,
      // methods
      deleteContactInfo: this.deleteContactInfo,
      patchContactInfo: this.patchContactInfo,
      patchUserSettings: this.patchUserSettings,
      usaDateFrmt: this.usaDateFrmt,
    };
  },

  computed: {
    newChats() {
      let newChats = {};
      if (this.userSettings?.chats && this.chats) {
        // console.log(this.chats);
        Object.entries(this.userSettings.chats).forEach(([chatGroupName, mstRcntChatTime], chatIndex) => {
          // console.log(chatIndex);
          // console.log(this.accountSettings.chats[chatGroupName]);
          // console.log(mstRcntChatTime);
          this.chats.forEach((chat) => {
            if (
              JSON.stringify(chat.chatgroup) === JSON.stringify(this.accountSettings.chats[chatGroupName]) &&
              chat.chattime > mstRcntChatTime
            ) {
              // console.log('-----------');
              // console.log(mstRcntChatTime);
              // console.log(chat.chattime);
              // console.log(chat.chattime > mstRcntChatTime);
              if (!newChats[chatGroupName]) {
                newChats[chatGroupName] = 1;
              } else {
                newChats[chatGroupName]++;
              }
            }
          });
        });
      }
      return newChats;
    },
    allNewChats() {
      return Object.values(this.newChats).reduce((a, b) => a + b, 0);
    },
    userList() {
      return { ...this.activeUserList, ...this.accountSettings.userList };
    },
    userRole() {
      return this.roles.findIndex((role) => role === this.userData.AppPermissions[this.appName][1]);
    },
    sideMenuItems() {
      const sideMenuItemsArray = [
        ['fa fa-house-chimney-user', null, 'Contact info', 'Calendar'],
        ['fa fa-calendar-check', this.contacts[this.slctdCntctIndex]?.Tasks.length, 'Tasks', 'Calendar'],
        ['fa fa-repeat', this.contacts[this.slctdCntctIndex]?.RecurTasks.length, 'Recurring tasks', 'Calendar'],
        ['fa fa-file-pen', this.contacts[this.slctdCntctIndex]?.Notes.length > 0 ? '1' : null, 'Notes', 'Calendar'],
        ['fa fa-comment', this.allNewChats, 'Chat', 'Chatbox'],
        ['fa fa-chart-pie', null, 'Reports', 'Reportstable'],
        ['fa fa-sliders', null, 'Settings', 'Calendar'],
        ['fa fa-user-gear', 'post-' + accountlogin_url, 'Account', '_a_t', access_token, '_s_i', session_id],
        ['fa fa-sign-out', null, 'Log out'],
      ];
      if (this.accountSettings.sidemenu) {
        this.accountSettings.sidemenu.forEach((sidemenu) => {
          const sidemenuCustomItemsArray = [];
          sidemenu.forEach((sidemenuItem, sidemenuItemIndex) => {
            if (sidemenuItemIndex == 1 && sidemenuItem.includes('Custom')) {
              sidemenuItem =
                this.contacts[this.slctdCntctIndex][sidemenuItem].length > 0
                  ? this.contacts[this.slctdCntctIndex][sidemenuItem].length.toString()
                  : null;
              sidemenuCustomItemsArray.push(sidemenuItem);
            } else {
              sidemenuCustomItemsArray.push(sidemenuItem);
            }
          });
          sideMenuItemsArray.splice(4, 0, sidemenuCustomItemsArray);
        });
      }
      return sideMenuItemsArray;
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
    async updateTime() {
      const timeDifference = Math.round((this.times.initialBrwsrTmstmp - new Date().getTime()) * -1);
      this.times.updtngY_m_d_H_i_s_z = new Date(this.times.initialUsrTmstmp + timeDifference).toISOString();
      try {
        const response = await fetch(app_api_url + '/currentupdate', {
          method: 'GET',
          headers: {
            Authorization: access_token,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        });
        const resJSON = await response.json();
        if (resJSON.success) {
          if (this.dsbld == true) {
            this.dsbld = false;
            this.showMsg('Internet restored');
          }
          if (this.currentUpdate != resJSON.data.datetime && this.currentUpdate != null) {
            this.getContacts(resJSON.data.datetime);
          } else if (this.currentUpdate == null) {
            this.currentUpdate = resJSON.data.datetime;
          }
          if (this.times.mstRcntChat < resJSON.data.chatsdatetime) this.getChats(this.times.mstRcntChat);
        } else {
          this.deleteLogin();
        }
      } catch (error) {
        this.dsbld = true;
        this.showMsg('Internet connection issue');
        console.log(error.toString());
      }
    },

    async getUserData() {
      try {
        const response = await fetch(app_api_url + '/users', {
          method: 'GET',
          headers: {
            Authorization: access_token,
            'Cache-Control': 'no-store',
          },
        });
        const userDataResJSON = await response.json();
        // console.log(userDataResJSON);
        if (userDataResJSON.success) {
          this.times.initialBrwsrTmstmp = new Date().getTime();
          this.times.initialUsrTmstmp = new Date(userDataResJSON.data.date_Y_m_d_H_i_s_z).getTime();
          this.times.updtngY_m_d_H_i_s_z = userDataResJSON.data.date_Y_m_d_H_i_s_z;
          this.times.slctdTmstmp = new Date(this.times.updtngY_m_d_H_i_s_z).getTime();

          setInterval(() => {
            this.updateTime();
          }, 6000);

          this.userData = userDataResJSON.data.user;
          this.reports = 'user_Contact report:' + this.userData.id;
          // this.roles.findIndex((role) => role === this.userData.AppPermissions[this.appName][1]) > 5
          //   ? 'Contact list with min. info'
          //   : this.userData.FirstName + '\'s tasks';
          this.accountSettings = userDataResJSON.data.accountSettings;
          this.activeUserList = userDataResJSON.data.activeUserList;
          this.slctd.chatGroup = Object.keys(userDataResJSON.data.accountSettings.chats)[0];
          this.tempFiltersDays = userDataResJSON.data.userSettings.calendar.filters.days;
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
          this.deleteLogin();
        }
      } catch (error) {
        this.dsbld = true;
        this.showMsg('Internet connection issue');
        console.log(error.toString());
      }
    },

    async deleteLogin() {
      try {
        const response = await fetch(login_api_url + '/sessions/' + session_id, {
          method: 'DELETE',
          headers: {
            Authorization: access_token,
            'Cache-Control': 'no-store',
          },
        });
        location.reload();
      } catch (error) {
        location.reload();
      }
    },

    async getContacts(updateTime) {
      try {
        const response = await fetch(app_api_url + '/contacts', {
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
        this.dsbld = true;
        this.showMsg('Internet connection issue');
        console.log(error.toString());
      }
    },

    async getChats(updtngY_m_d_H_i_s_z) {
      try {
        const response = await fetch(app_api_url + '/chats/' + updtngY_m_d_H_i_s_z.slice(0, 19).replace(' ', 'T'), {
          headers: {
            Authorization: access_token,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        });
        const getChatsResJSON = await response.json();
        if (getChatsResJSON.success) {
          this.times.mstRcntChat = getChatsResJSON.data.date_Y_m_d_H_i_s;
          if (updtngY_m_d_H_i_s_z == '1970-01-01T00:00:00') {
            this.chats = getChatsResJSON.data.chats ? getChatsResJSON.data.chats : [];
          } else {
            getChatsResJSON.data.chats.forEach((chat) => {
              this.chats.push(chat);
              const newChat = new Notification(this.activeUserList[chat.userid][0] + ': ' + chat.chatmessage);
            });
          }
        }
      } catch (error) {
        this.showMsg(error.toString());
        console.log(error.toString());
      }
    },

    async getEmailSettings() {
      try {
        const response = await fetch(app_api_url + '/emails', {
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
        this.dsbld = true;
        this.showMsg('Internet connection issue');
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
      const slctdCntctIndex = this.contacts.findIndex((contact) => contact.id == newCntctInfo.id);
      this.contacts[slctdCntctIndex] = newCntctInfo;
      this.contacts[slctdCntctIndex].Updated = {
        [this.userData.id]: this.times.updtngY_m_d_H_i_s_z,
      };
      let cloneUpdating = this.updating;
      this.updating = cloneUpdating + 1;
      try {
        const response = await fetch(app_api_url + '/contacts', {
          method: 'PATCH',
          headers: {
            Authorization: access_token,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            ID: newCntctInfo.id,
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
          const response = await fetch(app_api_url + '/contacts', {
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
      const oldUserSettings = this.userSettings;
      this.userSettings = newUserSettings;
      try {
        const response = await fetch(app_api_url + '/settings', {
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
          this.userSettings = oldUserSettings;
          this.showMsg('User settings not updated');
        }
      } catch (error) {
        console.log(error.toString());
        this.showMsg('User settings not updated');
      }
    },
  },

  created() {
    this.getUserData();
    this.getChats('1970-01-01T00:00:00');
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
.app-grid-item1-panel {
  padding: 0px 10px 0px 65px;
  height: 100%;
  overflow-y: auto;
  border-style: solid;
  border-width: 10px 0px 10px 0px;
  border-color: #00000000;
}
.app-grid-item2 {
  order: 1;
  background-color: #999999;
  overflow-y: hidden;
}
input:not([type='checkbox']):disabled {
  color: black;
  appearance: none;
}
select:disabled {
  color: black;
  appearance: none;
  padding-left: 5px;
}
button:disabled {
  color: black;
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
  .app-grid-item1-panel {
    padding: 0px 0px 0px 65px;
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
