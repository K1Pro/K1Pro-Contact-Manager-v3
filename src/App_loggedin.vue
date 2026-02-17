<template>
  <snackbar :msg @deleteMsg="msg = null"></snackbar>
  <template v-if="contacts !== null && sttngs.user !== null && sttngs.entity !== null">
    <div
      class="app-grid-container"
      :style="[appGridContainer, { gridTemplateRows: wndw.wdth >= 768 ? '100vh' : wndw.hght + 'px auto' }]"
    >
      <div class="app-grid-item1">
        <sidemenu
          :sideMenuItems
          :sideMenuSlctdLnk="slctd.sideMenuLnk"
          :wndw
          @sideMenuSlctdLnk="(el) => ((slctd.eventIndx = null), (slctd.sideMenuLnk = el))"
        ></sidemenu>
        <component class="app-grid-item1-panel" :is="slctd.sideMenuLnk[0]"></component>
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
    <div class="scroll-btns" v-if="wndw.wdth < 768">
      <i class="fa-solid fa-circle-arrow-up" @click="scrollTop"></i
      ><i class="fa-solid fa-circle-arrow-down" @click="scrollBottom"></i>
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

  mixins: [appGridResizerMixin, settingsMixin, snackbarMixin, wndwWdthHghtMixin],

  data() {
    return {
      chats: null,
      contacts: null,
      curEl: { Txt: '', Tp: null },
      daysRangeArr: [1, 3, 7, 14, 21, 28],
      deletedIDs: [],
      dsbld: false,
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
        chatType: 'Chat',
        dayIndex: null,
        eventIndx: null,
        report: null,
        sideMenuLnk: ['Contactinfo', 'Calendar'],
        smsGroup: null,
        tmstmp: new Date(date_Y_m_d_H_i_s_z).getTime(),
        IDs: {},
      },
      updt: {
        initialUsrTmstmp: date_tmstmp,
        initialBrwsrTmstmp: new Date().getTime(),
        mstRcntChat: unixEpoch,
        mstRcntMsg: null,
        mstRcntCntctUpdt: unixEpoch,
        mstRcntUpdates: {},
        updtngY_m_d_H_i_s_z: date_Y_m_d_H_i_s_z,
      },
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
      newMsgs: Vue.computed(() => this.newMsgs),
      slctd: Vue.computed(() => this.slctd),
      slctdCntctIndex: Vue.computed(() => this.slctdCntctIndex),
      slctdY_m_d: Vue.computed(() => this.slctdY_m_d),
      tbCntntWdth: Vue.computed(() => this.tbCntntWdth),
      updt: Vue.computed(() => this.updt),
      tmpSttngs: Vue.computed(() => this.tmpSttngs),
      userData: Vue.computed(() => this.userData),
      userList: Vue.computed(() => this.userList),
      userRole: Vue.computed(() => this.userRole),
      // static
      daysRangeArr: this.daysRangeArr,
      roles: this.roles,
      // methods
      deleteContactInfo: this.deleteContactInfo,
      patchContactInfo: this.patchContactInfo,
      usaDateFrmt: this.usaDateFrmt,
    };
  },

  computed: {
    sideMenuItems() {
      const sideMenuItemsArray = [
        ['fa fa-house-chimney-user', null, 'Contact info', 'Calendar'],
        this.contacts?.length > 0
          ? ['fa fa-calendar-check', this.contacts[this.slctdCntctIndex]?.Tasks.length, 'Tasks', 'Calendar']
          : false,
        this.contacts?.length > 0
          ? ['fa fa-repeat', this.contacts[this.slctdCntctIndex]?.RecurTasks.length, 'Recurring tasks', 'Calendar']
          : false,
        this.contacts?.length > 0
          ? ['fa fa-file-pen', this.contacts[this.slctdCntctIndex]?.Notes.length > 0 ? '1' : null, 'Notes', 'Calendar']
          : false,
        ['fa fa-comment', this.allNewChats, 'Chat', 'Chatbox'],
        ['fa fa-chart-pie', null, 'Reports', 'Reportstable'],
        ['fa fa-sliders', null, 'Settings', 'Calendar'],
        ['fa fa-user-gear', 'post-' + url_path.login, 'Account', '_a_t', access_token, '_s_i', session_id],
        ['fa fa-sign-out', null, 'Log out'],
      ];
      if (this.sttngs.entity?.sidemenu && this.contacts?.length > 0) {
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
      if (this.sttngs.user?.chats && this.chats !== null) {
        Object.entries(this.sttngs.user?.chats).forEach(([chatGroupName, mstRcntChatTime], chatIndex) => {
          this.chats.forEach((chat) => {
            if (
              JSON.stringify(chat.tow) === JSON.stringify(this.sttngs.entity?.chats?.[chatGroupName]) &&
              chat.dat > mstRcntChatTime
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
    newMsgs() {
      let newChats = {};
      let newChatsTotal = 0;
      if (this.updt.mstRcntMsg !== null)
        this.updt.mstRcntMsg.forEach((msg) => {
          this.contacts?.forEach((contact, contactIndx) => {
            contact.Connections.forEach((conn) => {
              if (conn.Phone && conn.Phone.replace(/[^0-9]/g, '') == msg) {
                newChatsTotal++;
                newChats[msg] = {
                  id: contact.id,
                  name:
                    contact.Members[0]?.First && contact.Members[0]?.Name
                      ? contact.Members[0]?.First + ' ' + contact.Members[0]?.Name
                      : contact.Members[0]?.Name
                        ? contact.Members[0]?.Name
                        : contact.Members[0]?.First
                          ? contact.Members[0]?.First
                          : '',
                  phone: msg.slice(0, 3) + '-' + msg.slice(3, 6) + '-' + msg.slice(6, 10),
                  smsGroup: conn.Phone,
                  amnt: this.updt.mstRcntMsg.filter((x) => x == msg).length,
                };
              }
            });
          });
        });
      return { total: newChatsTotal, msgs: newChats };
    },
    allNewChats() {
      return (
        Object.values(this.newChats).reduce((a, b) => a + b, 0) +
        (this.sttngs.entity?.sms?.enabled === true && this.updt.mstRcntMsg !== null ? this.newMsgs.total : 0)
      );
    },
    todaysEvents() {
      let contactArray = {};
      const todaysDate =
        new Date(this.updt?.initialUsrTmstmp)?.getFullYear() +
        '-' +
        (new Date(this.updt?.initialUsrTmstmp)?.getMonth() + 1)?.toString()?.padStart(2, '0') +
        '-' +
        new Date(this.updt?.initialUsrTmstmp)?.getDate()?.toString()?.padStart(2, '0');
      this.contacts.forEach((contact, contactIndex) => {
        contact.Tasks.forEach((task) => {
          calDay = task?.Date?.split('T')[0];
          if (todaysDate == calDay && task?.Assign.includes(this.userData.id.toString()) && task?.Status != 1)
            contactArray[task.Date.split('T')[1].slice(0, 5)] = contactIndex;
        });
      });
      return contactArray;
    },
    userList() {
      return { ...this.sttngs.entity?.activeUserList, ...this.sttngs.entity?.userList };
    },
    userRole() {
      return this.roles?.findIndex((role) => role === user_data.AppPermissions[app_name].role);
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
      const selectdContactIndex = this.contacts?.findIndex((contact) => contact.id == this.sttngs.user.slctdCntctID);
      if (selectdContactIndex === -1) {
        this.sttngs.user.slctdCntctID = this.contacts?.length > 0 ? this.contacts[this.contacts.length - 1].id : 0;
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
      return Math.ceil((this.days?.findIndex((day) => day == this.slctdY_m_d) + 1) / 7);
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
    async getUpdt() {
      const userSlctdCntctID = this.sttngs?.user?.slctdCntctID ? this.sttngs.user.slctdCntctID : null;
      try {
        // prettier-ignore
        const response = await fetch(app_api_url + '/' + this.updt.updtngY_m_d_H_i_s_z + '/' + userSlctdCntctID + '/update', { headers: { Authorization: access_token, }, }, );
        const resJSON = await response.json();
        if (resJSON.success) {
          if (this.dsbld == true) this.dsbld = false;
          if (
            this.updt.mstRcntCntctUpdt &&
            (this.updt.mstRcntCntctUpdt != resJSON.data.mstRcntCntctUpdt ||
              JSON.stringify(this.updt.mstRcntMsg) != JSON.stringify(resJSON.data.mstRcntMsg))
          )
            this.getContacts(this.updt.mstRcntCntctUpdt);
          if (this.updt.mstRcntChat && this.updt.mstRcntChat != resJSON.data.mstRcntChat)
            this.getChats(this.updt.mstRcntChat);
          this.updt.mstRcntUpdates = resJSON.data.mstRcntUpdate;
          this.slctd.IDs = resJSON.data.selected_IDs;
        } else {
          if (
            [
              'Access token is missing from the header',
              'Access token cannot be blank',
              'Invalid access token',
              'User account not active',
              'User account is currently locked out',
              'Unauthorized',
              'Session expired. Login again',
              'Network error',
            ].includes(resJSON?.messages?.[0])
          )
            this.deleteLogin(resJSON.messages[0]);
          console.log(resJSON?.messages?.[0] ? resJSON.messages[0] : 'Update error');
        }
      } catch (error) {
        console.log(error?.toString());
      }
    },

    async deleteLogin(msg) {
      try {
        const response = await fetch(login_api_url + '/sessions/' + session_id, {
          method: 'DELETE',
          headers: {
            Authorization: access_token,
            'Cache-Control': 'no-store',
          },
        });
        const resJSON = await response.json();
        this.$refs.loginMessage.value = msg ? msg : 'Logged out with an error';
        this.$refs.deleteLogin.submit();
      } catch (error) {
        this.$refs.loginMessage.value = msg ? msg : 'Logged out with an error';
        this.$refs.deleteLogin.submit();
      }
    },

    async getContacts(updtMstRcntCntctUpdt) {
      this.updt.mstRcntCntctUpdt = null;
      try {
        // prettier-ignore
        const response = await fetch( app_api_url + '/' + updtMstRcntCntctUpdt.slice(0, 19).replace(' ', 'T') + '/contacts', { headers: { Authorization: access_token, }, }, );
        const resJSON = await response.json();
        if (resJSON.success) {
          if ([unixEpoch, unixEpoch1].includes(updtMstRcntCntctUpdt)) {
            if (updtMstRcntCntctUpdt == unixEpoch) {
              this.contacts = resJSON?.data?.contacts ? resJSON.data.contacts : [];
              this.getContacts(unixEpoch1);
              setTimeout(() => {
                const newChat = new Notification(
                  'Hi ' +
                    this.userData?.FirstName +
                    ', \n' +
                    (this.userData?.Entity == this.userData?.id
                      ? ''
                      : 'You are logged in under ' +
                        this.userData?.Entity?.slice(0, 1)?.toUpperCase() +
                        this.userData?.Entity?.slice(1) +
                        '.\n') +
                    (Object.keys(this.todaysEvents)?.length > 0
                      ? 'You have ' +
                        Object.keys(this.todaysEvents)?.length +
                        (Object.keys(this.todaysEvents)?.length > 1 ? ' tasks' : ' task') +
                        ' scheduled for today.'
                      : ''),
                );
              }, 1000);
            } else {
              this.updt.mstRcntCntctUpdt = resJSON?.data?.mstRcntCntctUpdt;
              const frstLdCntcts = this.contacts?.map((cntct) => cntct.id);
              const fltrdCntcts = resJSON?.data?.contacts?.filter((cntct) => !frstLdCntcts?.includes(cntct.id));
              this.contacts.push(...fltrdCntcts);
              this.sttngsReq('GET', 'user');
              this.sttngsReq('GET', 'entity');
            }
          } else {
            resJSON?.data?.contacts?.forEach((contact) => {
              if (contact.id == this.sttngs.user?.slctdCntctID) {
                if (this.userData.id != Object.keys(contact.Updated)[0]) {
                  this.contacts.splice(this.slctdCntctIndex, 1, contact);
                  const oldEventIndx = this.slctd.eventIndx !== null ? this.slctd.eventIndx : null;
                  if (['Tasks', 'Recurringtasks']?.includes(this.slctd.sideMenuLnk[0])) {
                    if (oldEventIndx !== null) {
                      this.slctd.eventIndx = null;
                      // prettier-ignore
                      setTimeout(() => { this.slctd.eventIndx = oldEventIndx; }, 1);
                    } else {
                      this.slctd.eventIndx = 0;
                      // prettier-ignore
                      setTimeout(() => { this.slctd.eventIndx = null; }, 1);
                    }
                  }
                  // prettier-ignore
                  if (this.curEl.Tp && !['Chat']?.includes(this.slctd.sideMenuLnk[0]))
                      setTimeout(() => { document.activeElement[this.curEl.Tp] = this.curEl.Txt; }, 2);
                } else {
                  this.contacts[this.slctdCntctIndex].Email = contact.Email;
                  this.contacts[this.slctdCntctIndex].Tel = contact.Tel;
                  this.contacts[this.slctdCntctIndex].Msg = contact.Msg;
                  this.contacts[this.slctdCntctIndex].Fax = contact.Fax;
                  this.contacts[this.slctdCntctIndex].Log = contact.Log;
                }
              } else {
                const slctdCntctIndx = this.contacts?.findIndex((slctdCntct) => slctdCntct.id == contact.id);
                if (slctdCntctIndx !== -1) {
                  this.contacts.splice(slctdCntctIndx, 1, contact);
                  // prettier-ignore
                  if (this.curEl.Tp && !['Contactinfo', 'Tasks', 'Recurringtasks', 'Notes', 'Chat', 'Settings']?.includes(this.slctd.sideMenuLnk[0]))
                      setTimeout(() => { document.activeElement[this.curEl.Tp] = this.curEl.Txt; }, 1);
                } else {
                  this.contacts.push(contact);
                }
              }
            });
            if (JSON.stringify(this.deletedIDs) != JSON.stringify(resJSON.data.deleted_IDs)) {
              resJSON?.data?.deleted_IDs?.forEach((deleted_ID) => {
                const cntctIDtoBeDeleted = this.contacts?.findIndex((slctdCntct) => slctdCntct.id == deleted_ID);
                if (cntctIDtoBeDeleted == this.slctdCntctIndex) this.showMsg('This contact has been deleted');
                if (cntctIDtoBeDeleted !== -1) this.contacts?.splice(cntctIDtoBeDeleted, 1);
              });
              this.deletedIDs = resJSON.data?.deleted_IDs;
            }
            this.updt.mstRcntCntctUpdt = resJSON?.data?.mstRcntCntctUpdt;
          }
          this.updt.mstRcntMsg = resJSON?.data?.mstRcntMsg;
        } else {
          console.log(resJSON);
          this.updt.mstRcntCntctUpdt = updtMstRcntCntctUpdt;
        }
      } catch (error) {
        console.log(error?.toString());
        this.updt.mstRcntCntctUpdt = updtMstRcntCntctUpdt;
      }
    },

    async getChats(updtMstRcntChat) {
      this.updt.mstRcntChat = null;
      try {
        // prettier-ignore
        const response = await fetch(app_api_url + '/' + updtMstRcntChat.slice(0, 19).replace(' ', 'T') + '/chat', { headers: { Authorization: access_token, }, });
        const resJSON = await response.json();
        if (resJSON.success) {
          if ([unixEpoch, unixEpoch1]?.includes(updtMstRcntChat)) {
            if (updtMstRcntChat == unixEpoch) this.getChats(unixEpoch1);
            this.chats = resJSON?.data?.chats ? resJSON.data.chats : [];
          } else {
            resJSON?.data?.chats?.forEach((chat) => {
              if (!this.chats?.find((chatObj) => chatObj.id == chat.id || Number(chatObj.id) == Number(chat.id))) {
                this.chats.push(chat);
                if (this.sttngs.entity?.activeUserList) {
                  const newChat = new Notification(
                    this.sttngs.entity.activeUserList[chat.frm].FirstName + ': ' + chat.msg,
                  );
                }
              }
            });
          }
          this.updt.mstRcntChat = resJSON?.data?.mstRcntChat;
        } else {
          console.log(resJSON);
          this.updt.mstRcntChat = updtMstRcntChat;
        }
      } catch (error) {
        console.log(error.toString());
        this.updt.mstRcntChat = updtMstRcntChat;
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

    async patchContactInfo(event, column, columnIndex, oldCntctInfo, slctdCntctIndex) {
      const updtngY_m_d_H_i_s_z = this.updt.updtngY_m_d_H_i_s_z;
      this.contacts[slctdCntctIndex].Updated = {
        [this.userData.id]: updtngY_m_d_H_i_s_z,
      };
      try {
        const response = await fetch(app_api_url + '/' + updtngY_m_d_H_i_s_z.replace(' ', 'T').trim() + '/contacts', {
          method: 'PATCH',
          headers: {
            Authorization: access_token,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            ID: oldCntctInfo.id,
            Column: column,
            ColumnIndex: columnIndex,
            NewData: event,
          }),
        });
        const resJSON = await response.json();
        if (!resJSON.success) {
          slctdCntctIndex = this.contacts?.findIndex((contact) => contact.id == oldCntctInfo.id);
          // prettier-ignore
          confirm('Error' + (resJSON?.messages?.[0] ? ': ' + resJSON.messages[0] : '') + '. Would you like to try again? If not, your most recent change will be lost.',) == true
            ? this.patchContactInfo(event, column, columnIndex, oldCntctInfo, slctdCntctIndex)
            : (this.contacts[slctdCntctIndex] = oldCntctInfo);
        }
      } catch (error) {
        slctdCntctIndex = this.contacts?.findIndex((contact) => contact.id == oldCntctInfo.id);
        // prettier-ignore
        confirm('Error' + (error?.toString() ? ': ' + error.toString() : '') + '. Would you like to try again? If not, your most recent change will be lost.',) == true
          ? this.patchContactInfo(event, column, columnIndex, oldCntctInfo, slctdCntctIndex)
          : (this.contacts[slctdCntctIndex] = oldCntctInfo);
      }
    },

    async deleteContactInfo(clmn, clmnIndex, prevConfirm) {
      if (prevConfirm || confirm('Are you sure you would like to delete this?') == true) {
        this.contacts[this.slctdCntctIndex][clmn].splice(clmnIndex, 1);
        try {
          const response = await fetch(
            app_api_url + '/' + this.updt.updtngY_m_d_H_i_s_z.replace(' ', 'T').trim() + '/contacts',
            {
              method: 'DELETE',
              headers: {
                Authorization: access_token,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
              },
              body: JSON.stringify({
                ID: this.sttngs.user.slctdCntctID,
                Column: clmn,
                ColumnIndex: clmnIndex,
              }),
            },
          );
          const resJSON = await response.json();
          if (resJSON.success) {
          } else {
            this.showMsg('Delete error');
          }
        } catch (error) {
          this.showMsg(error.toString());
        }
      }
    },
    scrollTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    scrollBottom() {
      window.scrollTo({ top: this.wndw.hght, behavior: 'smooth' });
    },

    getCurEl() {
      const curEl =
        document.activeElement.tagName == 'SPAN'
          ? ['innerHTML', document.activeElement.innerHTML]
          : document.activeElement.tagName == 'TEXTAREA'
            ? ['value', document.activeElement.value]
            : document.activeElement.tagName == 'INPUT'
              ? ['value', document.activeElement.value]
              : [null, ''];
      if (curEl) {
        this.curEl.Txt = curEl[1];
        this.curEl.Tp = curEl[0];
      }
    },
  },

  created() {
    this.getUpdt();
    setInterval(() => {
      const timeDifference = new Date().getTime() - this.updt.initialBrwsrTmstmp;
      this.updt.updtngY_m_d_H_i_s_z = new Date(this.updt.initialUsrTmstmp + timeDifference).toISOString();
      this.getUpdt();
    }, 5000);
    document.body.addEventListener('keyup', this.getCurEl);
    document.body.addEventListener('click', this.getCurEl);

    // This notifies how many chats there are
    setInterval(() => {
      if (this.allNewChats) {
        // prettier-ignore
        const newChat = new Notification(this.allNewChats + ' unread ' + (this.allNewChats > 1 ? 'messages' : 'message') + ' in your chat');
      }
    }, 600000);

    // This is a task reminder
    setInterval(() => {
      const updtingHour = this.updt.updtngY_m_d_H_i_s_z?.split('T')[1].slice(0, 2);
      const updtingMin = this.updt.updtngY_m_d_H_i_s_z?.split('T')[1].slice(3, 5);
      // prettier-ignore
      const updtngH_iLess5Min = new Date(new Date().setHours(updtingHour, updtingMin) - 300000).getHours().toString().padStart(2, '0') + ':' + new Date(new Date().setHours(updtingHour, updtingMin) - 300000).getMinutes().toString().padStart(2, '0');
      const updtngH_i = updtingHour + ':' + updtingMin;
      // prettier-ignore
      const updtngH_iPlus5Min = new Date(new Date().setHours(updtingHour, updtingMin) + 300000).getHours().toString().padStart(2, '0') + ':' + new Date(new Date().setHours(updtingHour, updtingMin) + 300000).getMinutes().toString().padStart(2, '0');
      if (Object.keys(this.todaysEvents).includes(updtngH_iPlus5Min)) {
        // prettier-ignore
        const newChat = new Notification('5 minute task reminder (' + this.contacts[this.todaysEvents[updtngH_iPlus5Min]]?.Members?.[0]?.Name + ')');
      }
      if (Object.keys(this.todaysEvents).includes(updtngH_i)) {
        // prettier-ignore
        const newChat = new Notification('Urgent task reminder (' + this.contacts[this.todaysEvents[updtngH_i]]?.Members?.[0]?.Name + ')');
      }
      if (Object.keys(this.todaysEvents).includes(updtngH_iLess5Min)) {
        // prettier-ignore
        const newChat = new Notification('Task past due (' + this.contacts[this.todaysEvents[updtngH_iLess5Min]]?.Members?.[0]?.Name + ')');
      }
    }, 60000);
  },

  updated() {
    if (this.curEl.Tp && ['SPAN', 'TEXTAREA', 'INPUT'].includes(document.activeElement.tagName))
      document.activeElement[this.curEl.Tp] = this.curEl.Txt;
  },

  watch: {
    allNewChats(newChatAmnt, oldChatAmnt) {
      if (newChatAmnt && newChatAmnt > oldChatAmnt) {
        const newChat = new Notification(
          newChatAmnt + ' unread ' + (newChatAmnt > 1 ? 'messages' : 'message') + ' in your chat',
        );
      }
    },
  },
};
</script>

<style>
.app-grid-container {
  display: grid;
  grid-template-columns: 100%;
  grid-row-gap: 10px;
  background-color: #c6c6c6;
}
.app-grid-item1 {
  min-height: 100vh;
  order: 3;
  overflow-y: hidden;
  background: -webkit-linear-gradient(left, #f1f1f1 49px, lightgray 50px, #999999 50px);
  background: -moz-linear-gradient(left, #f1f1f1 49px, lightgray 50px, #999999 50px);
  background: -ms-linear-gradient(left, #f1f1f1 49px, lightgray 50px, #999999 50px);
  background: linear-gradient(left, #f1f1f1 49px, lightgray 50px, #999999 50px);
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
  overflow: hidden;
  padding: 10px 10px 10px 10px;
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
.scroll-btns {
  position: fixed;
  bottom: 20px;
  right: 30px;
  width: 10px;
  z-index: 2;
}
.scroll-btns i {
  opacity: 0.5;
}
.scroll-btns i:hover {
  opacity: 1;
}
@media only screen and (min-width: 768px) {
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
    padding: 10px 10px 10px 0px;
  }
}
</style>
