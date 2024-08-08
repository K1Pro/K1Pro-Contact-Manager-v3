<template>
  <snackbar> </snackbar>

  <template v-if="contacts.length > 0">
    <div class="app-grid-container" :style="appGridContainer">
      <div class="app-grid-item1">
        <sidemenu
          :sideMenuItems="sideMenuItems"
          :sideMenuSlctdLnk="sideMenuSlctdLnk"
          @sideMenuSlctdLnk="(lnk) => (sideMenuSlctdLnk = lnk)"
        ></sidemenu>
        <component
          class="app-grid-item1-panel"
          :is="sideMenuSlctdLnk[0]"
          @sideMenuSlctdLnk="(lnk) => (sideMenuSlctdLnk = lnk)"
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
        <component :is="sideMenuSlctdLnk[1]" @sideMenuSlctdLnk="(lnk) => (sideMenuSlctdLnk = lnk)"></component>
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

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'userData',
      'activeUserList',
      'accountSettings',
      'userSettings',
      'tempFiltersDays',
      'contacts',
      'emails',
      'times',
      'updating',
      'dsbld',
      'patchUserSettings',
      'slctdCntctIndex',
    ]),

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
        ['fa fa-list-check', this.contacts[this.slctdCntctIndex]?.Tasks.length, 'Tasks', 'Calendar'],
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
  },

  data() {
    return {
      currentUpdate: null,
      sideMenuSlctdLnk: ['Contactinfo', 'Calendar'],
      wndw: {
        wdth: 0,
        hght: 0,
      },
    };
  },

  provide() {
    return {
      wndw: Vue.computed(() => this.wndw),
      tbCntntWdth: Vue.computed(() => this.tbCntntWdth),
    };
  },

  methods: {
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
            // this.msg.snackBar = 'Internet restored';
          }
          if (this.currentUpdate != getCurrentupdateResJSON.data.datetime && this.currentUpdate != null) {
            this.getContacts(getCurrentupdateResJSON.data.datetime);
          } else if (this.currentUpdate == null) {
            this.currentUpdate = getCurrentupdateResJSON.data.datetime;
          }
        }
      } catch (error) {
        this.dsbld = true;
        // this.msg.snackBar = 'Internet problem';
        // console.log(error.toString());
      }
    },

    async getUserData() {
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
        // this.msg.snackBar = 'Internet problem';
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
        // this.msg.snackBar = 'Internet problem';
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
        // this.msg.snackBar = 'Internet problem';
        console.log(error.toString());
      }
    },

    // destroyed() {
    //  Check this
    //   clearInterval(this.updateTime());
    // },

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
      this.patchUserSettings();
      document.removeEventListener('mousemove', this.resizeGrid, true);
      document.removeEventListener('mouseup', this.stopResizeGrid, true);
      document.querySelector('body').classList.remove('prevent-select');
    },

    resetGrid() {
      this.userSettings.layout['grid-size'] = 50;
      this.patchUserSettings();
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
