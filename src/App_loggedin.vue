<template>
  <snackbar :msg @deleteMsg="msg = null"></snackbar>
  <template v-if="contacts != null && sttngs.user != null && sttngs.entity != null && initialTimes">
    <div class="app-grid-container" :style="appGridContainer">
      <div class="app-grid-item1">
        <sidemenu
          :sideMenuItems
          :sideMenuSlctdLnk="slctd.sideMenuLnk"
          :wndw
          @sideMenuSlctdLnk="(el) => ((slctd.eventIndx = null), (slctd.sideMenuLnk = el))"
        ></sidemenu>
        <component
          class="app-grid-item1-panel"
          :is="slctd.sideMenuLnk[0]"
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
        <component :is="slctd.sideMenuLnk[1]"></component>
      </div>
    </div>
  </template>
  <template v-else>
    <div id="loader-container">
      <div id="loader"></div>
    </div>
  </template>
  <form action="" method="POST" sytle="display: none" ref="deleteLogin">
    <input type="hidden" name="loginMessage" ref="loginMessage" value="Logged out" />
    <input type="hidden" name="_a_t" value="" />
    <input type="hidden" name="_s_i" value="" />
  </form>
</template>

<script>
export default {
  name: 'App',

  mixins: [appGridResizerMixin, snackbarMixin, settingsMixin, wndwWdthHghtMixin],

  data() {
    return {
      appName: app_name,
      chats: [],
      contacts: null,
      daysRangeArr: [1, 3, 7, 14, 21, 28],
      dsbld: false,
      entity: entity,
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
      slctd: {
        chatGroup: null,
        dayIndex: null,
        eventIndx: null,
        report: 'user_Contact report:' + user_data.id,
        sideMenuLnk: ['Contactinfo', 'Calendar'],
        tmstmp: '',
      },
      times: {
        initialUsrTmstmp: null,
        initialBrwsrTmstmp: null,
        updtngY_m_d_H_i_s_z: '1970-01-01T00:00:00',
        mstRcntChat: '1970-01-01T00:00:00',
        mstRcntCntctUpdt: '1970-01-01T00:00:00',
      },
      updating: 0,
      userData: user_data,
    };
  },

  provide() {
    return {
      // computed
      chats: Vue.computed(() => this.chats),
      contacts: Vue.computed(() => this.contacts),
      days: Vue.computed(() => this.days),
      dsbld: Vue.computed(() => this.dsbld),
      firstDayTmstmp: Vue.computed(() => this.firstDayTmstmp),
      newChats: Vue.computed(() => this.newChats),
      slctd: Vue.computed(() => this.slctd),
      slctdCntctIndex: Vue.computed(() => this.slctdCntctIndex),
      slctdY_m_d: Vue.computed(() => this.slctdY_m_d),
      tbCntntWdth: Vue.computed(() => this.tbCntntWdth),
      times: Vue.computed(() => this.times),
      tmpSttngs: Vue.computed(() => this.tmpSttngs),
      userData: Vue.computed(() => this.userData),
      userList: Vue.computed(() => this.userList),
      userRole: Vue.computed(() => this.userRole),
      // static
      appName: this.appName,
      entity: this.entity,
      daysRangeArr: this.daysRangeArr,
      roles: this.roles,
      // methods
      deleteContactInfo: this.deleteContactInfo,
      patchContactInfo: this.patchContactInfo,
      usaDateFrmt: this.usaDateFrmt,
    };
  },

  computed: {
    initialTimes() {
      if (this.times.initialBrwsrTmstmp === null && this.sttngs.entity.date_Y_m_d_H_i_s_z) {
        this.getChats();
        this.times.initialBrwsrTmstmp = new Date().getTime();
        this.times.initialUsrTmstmp = new Date(this.sttngs.entity.date_Y_m_d_H_i_s_z).getTime();
        this.times.updtngY_m_d_H_i_s_z = this.sttngs.entity.date_Y_m_d_H_i_s_z;
        this.slctd.chatGroup = Object.keys(this.sttngs.entity.chats)[0];
        this.slctd.tmstmp = new Date(this.times.updtngY_m_d_H_i_s_z).getTime();
        setInterval(() => {
          const timeDifference = new Date().getTime() - this.times.initialBrwsrTmstmp;
          this.times.updtngY_m_d_H_i_s_z = new Date(this.times.initialUsrTmstmp + timeDifference).toISOString();
          this.updateTime();
        }, 6000);
      }
      return this.times.initialBrwsrTmstmp === null && this.sttngs.entity.date_Y_m_d_H_i_s_z ? false : true;
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
        ['fa fa-user-gear', 'post-' + url_path.login, 'Account', '_a_t', access_token, '_s_i', session_id],
        ['fa fa-sign-out', null, 'Log out'],
      ];
      if (this.sttngs.entity.sidemenu) {
        this.sttngs.entity.sidemenu.forEach((sidemenu) => {
          const sidemenuCustomItemsArray = [];
          sidemenu.forEach((sidemenuItem, sidemenuItemIndex) => {
            if (sidemenuItemIndex == 1 && sidemenuItem.includes('Custom')) {
              sidemenuItem =
                this.contacts !== null &&
                this.contacts.length > 0 &&
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
    newChats() {
      let newChats = {};
      if (this.sttngs.user?.chats && this.chats) {
        Object.entries(this.sttngs.user.chats).forEach(([chatGroupName, mstRcntChatTime], chatIndex) => {
          this.chats.forEach((chat) => {
            if (
              JSON.stringify(chat.chatgroup) === JSON.stringify(this.sttngs.entity.chats[chatGroupName]) &&
              chat.chattime > mstRcntChatTime
            ) {
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
      return { ...this.sttngs.entity.activeUserList, ...this.sttngs.entity.userList };
    },
    userRole() {
      return this.roles.findIndex((role) => role === this.userData.AppPermissions[this.appName][entity].role);
    },
    tbCntntWdth() {
      return this.wndw.wdth > 768
        ? Math.round((this.wndw.wdth * (this.sttngs.user?.layout?.['grid-size'] / 100) - 75.02) * 100) / 100
        : Math.round((this.wndw.wdth - 75.02) * 100) / 100;
    },
    firstDayTmstmp() {
      const cmptdDayNumber = this.slctd.dayIndex != null ? this.slctd.dayIndex : 1;
      const cmptdDayOfTheWeek = this.dayOfTheWeek == 0 ? 6 : this.dayOfTheWeek - 1;
      const cmptdNoOfWeeks = this.slctd.dayIndex != null ? Math.floor(this.slctd.dayIndex / 7) : 1;
      return this.tmpSttngs.user.calendar.filters.days == 0
        ? this.slctd.tmstmp
        : this.tmpSttngs.user.calendar.filters.days == 1
        ? this.slctd.tmstmp - cmptdDayNumber * 86400000
        : this.tmpSttngs.user.calendar.filters.days == 2
        ? this.slctd.tmstmp - cmptdDayOfTheWeek * 86400000
        : this.slctd.tmstmp - cmptdNoOfWeeks * 604800000 - cmptdDayOfTheWeek * 86400000;
    },
    slctdY_m_d() {
      // prettier-ignore
      return (new Date(this.slctd.tmstmp).getFullYear() + '-' + (new Date(this.slctd.tmstmp).getMonth() + 1).toString().padStart(2, '0') + '-' + new Date(this.slctd.tmstmp).getDate().toString().padStart(2, '0'));
    },
    slctdCntctIndex() {
      const selectdContactIndex = this.contacts.findIndex((contact) => contact.id == this.sttngs.user.slctdCntctID);
      if (selectdContactIndex === -1) {
        this.sttngs.user.slctdCntctID = this.contacts[this.contacts.length - 1].id;
        this.userSttngsReq('PATCH', this.sttngs.user);
      }
      return selectdContactIndex;
    },
    dayOfTheWeek() {
      return new Date(this.slctd.tmstmp).getDay(); // 0 is Sunday, 1 is Monday, 2 is Tuesday, ...,
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
      while (dateRangeStart <= this.daysRangeArr[this.tmpSttngs.user.calendar.filters.days]) {
        // prettier-ignore
        dateArray.push(currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + currentDate.getDate().toString().padStart(2, '0'));
        currentDate.setDate(currentDate.getDate() + 1);
        dateRangeStart++;
      }
      return dateArray;
    },
    tmpSttngs() {
      return {
        user: {
          calendar: {
            filters: {
              days:
                this.wndw?.wdth < 768 &&
                this.sttngs?.user?.calendar?.filters?.days &&
                this.sttngs?.user?.calendar?.filters?.days > 1
                  ? 1
                  : this.sttngs.user.calendar.filters.days,
            },
          },
        },
      };
    },
  },

  methods: {
    async updateTime() {
      try {
        const response = await fetch(app_api_url + '/currentupdate', {
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
          if (this.times.mstRcntCntctUpdt != resJSON.data.datetime) this.getContacts();
          if (this.times.mstRcntChat != resJSON.data.chatsdatetime) this.getChats();
        } else {
          this.$refs.loginMessage.value = resJSON?.messages?.[0] ? resJSON.messages[0] : 'Logged out with an error';
          this.deleteLogin();
          // this.showMsg(resJSON?.messages[0]);
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
        const resJSON = await response.json();
        this.$refs.loginMessage.value =
          this.$refs.loginMessage.value && resJSON.success ? this.$refs.loginMessage.value : 'Logged out with an error';
        this.$refs.deleteLogin.submit();
      } catch (error) {
        this.$refs.loginMessage.value = 'Logged out with an error';
        this.$refs.deleteLogin.submit();
      }
    },

    async getContacts() {
      try {
        const response = await fetch(
          app_api_url + '/' + this.times.mstRcntCntctUpdt.slice(0, 19).replace(' ', 'T') + '/contacts',
          {
            headers: {
              Authorization: access_token,
              'Cache-Control': 'no-store',
            },
          }
        );
        const resJSON = await response.json();
        // if (resJSON.success && document.activeElement.tagName == 'BODY' && !this.updating) {
        if (resJSON.success) {
          if (this.times.mstRcntCntctUpdt == '1970-01-01T00:00:00') {
            this.contacts = resJSON.data.contacts ? resJSON.data.contacts : [];
          } else {
            if (resJSON.data.contacts.length > 0) {
              resJSON.data.contacts.forEach((contact) => {
                // if (contact.id == this.sttngs.user.slctdCntctID) console.log('editing the selected contact');
                // if (Object.keys(contact.Updated)[0] == this.userData.id) console.log('editing the same contact');
                // if (contact.id == this.sttngs.user.slctdCntctID && Object.keys(contact.Updated)[0] != this.userData.id)
                //   console.log('this could cause errors');
                if (contact.id != this.sttngs.user.slctdCntctID) {
                  const slctdCntctIndx = this.contacts.findIndex((slctdCntct) => slctdCntct.id == contact.id);
                  // console.log(slctdCntctIndx);
                  this.contacts[slctdCntctIndx] = contact;
                }
              });
              // const slctdCntctIndx = resJSON.data.contacts.findIndex(
              //   (contact) => contact.id == this.sttngs.user.slctdCntctID
              // );
              // if (slctdCntctIndx != null && slctdCntctIndx != undefined) {
              //   // if (Object.keys(resJSON.data.contacts[slctdCntctIndx].Updated) != this.userData.id) {
              //   this.showMsg(Object.keys(resJSON.data.contacts[slctdCntctIndx]));
              //   // }

              //   // resJSON.data.contacts[slctdCntctIndx] = this.contacts[this.slctdCntctIndex];
              //   // this.contacts = resJSON.data.contacts;
              // } else {
              //   // this.contacts = resJSON.data.contacts;
              // }
            } else {
              // this.showMsg('No contact updates');
            }
          }
          this.times.mstRcntCntctUpdt = resJSON.data.datetime;
        }
      } catch (error) {
        this.dsbld = true;
        this.showMsg('Internet connection issue');
        console.log(error.toString());
      }
    },

    async getChats() {
      try {
        const response = await fetch(
          app_api_url + '/' + this.times.mstRcntChat.slice(0, 19).replace(' ', 'T') + '/chats',
          {
            headers: {
              Authorization: access_token,
              'Cache-Control': 'no-store',
            },
          }
        );
        const resJSON = await response.json();
        if (resJSON.success) {
          if (this.times.mstRcntChat == '1970-01-01T00:00:00') {
            this.chats = resJSON?.data?.chats ? resJSON.data.chats : [];
          } else {
            resJSON.data.chats.forEach((chat) => {
              this.chats.push(chat);
              const newChat = new Notification(
                this.sttngs.entity.activeUserList[chat.userid].FirstName + ': ' + chat.chatmessage // this is not loading fast enough
              );
            });
          }
          this.times.mstRcntChat = resJSON.data.date_Y_m_d_H_i_s;
        } else {
          this.times.mstRcntChat = this.times?.updtngY_m_d_H_i_s_z.slice(0, 19).replace('T', ' ');
        }
      } catch (error) {
        this.showMsg(error.toString());
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
      this.updating++;
      try {
        const response = await fetch(
          app_api_url + '/' + this.times.updtngY_m_d_H_i_s_z.replace(' ', 'T').trim() + '/contacts',
          {
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
          }
        );
        const resJSON = await response.json();
        if (resJSON.success) {
          this.updating--;
        } else {
          this.showMsg('Update error');
          this.updating--;
        }
      } catch (error) {
        this.showMsg('Update error');
        this.updating--;
        this.showMsg(error.toString());
      }
    },

    async deleteContactInfo(column, columnIndex, prevConfirm) {
      this.updating++;
      if (prevConfirm || confirm('Are you sure you would like to delete this?') == true) {
        this.contacts[this.slctdCntctIndex][column].splice(columnIndex, 1);
        try {
          const response = await fetch(
            app_api_url + '/' + this.times.updtngY_m_d_H_i_s_z.replace(' ', 'T').trim() + '/contacts',
            {
              method: 'PATCH',
              headers: {
                Authorization: access_token,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
              },
              body: JSON.stringify({
                ID: this.sttngs.user.slctdCntctID,
                Column: column,
                ColumnIndex: columnIndex,
              }),
            }
          );
          const resJSON = await response.json();
          if (resJSON.success) {
            this.updating--;
          } else {
            this.showMsg('Delete error');
            this.updating--;
          }
        } catch (error) {
          this.showMsg('Delete error');
          this.updating--;
          this.showMsg(error.toString());
        }
      }
    },
  },

  created() {
    this.userSttngsReq('GET');
    this.entitySttngsReq('GET');
    this.getContacts();
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
