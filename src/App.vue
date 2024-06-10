<template>
  <snackbar> </snackbar>

  <template v-if="loggedIn === true">
    <template v-if="contacts.length > 0">
      <div class="app-grid-container" :style="appGridContainer">
        <div class="app-grid-item1">
          <sidepanel></sidepanel>
        </div>

        <div
          v-if="windowWidth > 768"
          class="app-grid-resizer"
          @mousedown="startResizeGrid"
          @mouseup="stopResizeGrid"
          v-on:dblclick="resetGrid"
        ></div>

        <div class="app-grid-item2">
          <calendar v-if="activeWindow == 'calendar'"></calendar>
          <emails v-if="activeWindow == 'email'"></emails>
          <reports v-if="activeWindow == 'reports'"></reports>
        </div>
      </div>
    </template>
    <template v-else>
      <div id="loader-container">
        <div class="loader"></div>
      </div>
    </template>
  </template>

  <template v-if="loggedIn === false">
    <div id="login-container">
      <login> </login>
    </div>
  </template>

  <template v-else></template>
</template>

<script>
export default {
  name: 'App',

  components: {
    Snackbar,
    Sidepanel,
    Reports,
    Login,
    Emails,
    Calendar,
  },

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'accessToken',
      'sessionID',
      'loggedIn',
      'msg',
      'windowWidth',
      'activeWindow',
      'userData',
      'activeUserList',
      'accountSettings',
      'userSettings',
      'tempFiltersDays',
      'contacts',
      'emails',
      'endPts',
      'times',
      'patchUserSettings',
      'slctdCntct',
    ]),

    appGridItem2Width() {
      return 100 - this.userSettings.layout['grid-size'];
    },

    appGridContainer() {
      return this.windowWidth > 768
        ? {
            'grid-template-columns': `calc(${this.userSettings.layout['grid-size']}% - 5px) 10px calc(${this.appGridItem2Width}% - 5px)`,
          }
        : false;
    },
  },

  data() {
    return { currentUpdate: null };
  },

  methods: {
    getCookie(accessToken, sessionID) {
      this.accessToken = document.cookie.match(new RegExp(`(^| )${accessToken}=([^;]+)`))?.at(2);
      this.sessionID = document.cookie.match(new RegExp(`(^| )${sessionID}=([^;]+)`))?.at(2);
    },
    async updateTime() {
      const timeDifferenece = Math.round((this.times.initialTimestamp - new Date().getTime()) * -1);
      this.times.Y_m_d_H_i_s_z = new Date(this.times.timestamp + timeDifferenece).toISOString();
      try {
        const response = await fetch(servr_url + this.endPts.currentupdate, {
          method: 'GET',
          headers: {
            Authorization: this.accessToken,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        });
        const getCurrentupdateResJSON = await response.json();
        if (getCurrentupdateResJSON.success) {
          if (this.currentUpdate != getCurrentupdateResJSON.data.datetime && this.currentUpdate != null) {
            this.getContacts(getCurrentupdateResJSON.data.datetime);
          } else if (this.currentUpdate == null) {
            this.currentUpdate = getCurrentupdateResJSON.data.datetime;
          }
        }
      } catch (error) {
        this.msg.snackBar = error.toString();
      }
    },

    async getUserData() {
      try {
        const response = await fetch(servr_url + this.endPts.userData, {
          method: 'GET',
          headers: {
            Authorization: this.accessToken,
            'Cache-Control': 'no-store',
          },
        });
        const userDataResJSON = await response.json();
        if (userDataResJSON.success) {
          // console.log(userDataResJSON);
          this.times.Y_m_d = userDataResJSON.data.date_Y_m_d;
          this.times.Y_m_d_H_i_s_z = userDataResJSON.data.date_Y_m_d_H_i_s_z;
          this.times.initialTimestamp = new Date().getTime();
          this.times.timestamp = new Date(this.times.Y_m_d_H_i_s_z).getTime();

          setInterval(() => {
            this.updateTime();
          }, 6000);
          this.loggedIn = true;
          this.userData = userDataResJSON.data.user;
          this.accountSettings = userDataResJSON.data.accountSettings;
          this.tempFiltersDays = userDataResJSON.data.userSettings.calendar.filters.days;
          this.activeUserList = userDataResJSON.data.activeUserList;
          if (
            this.windowWidth < 768 &&
            userDataResJSON.data.userSettings.calendar.filters.days != 0 &&
            userDataResJSON.data.userSettings.calendar.filters.days != 1
          )
            userDataResJSON.data.userSettings.calendar.filters.days = 1;
          this.userSettings = userDataResJSON.data.userSettings;
          this.getContacts(null);
          this.getEmailSettings();
        } else {
          this.loggedIn = false;
          document.cookie = `_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
          document.cookie = `_s_i=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
          this.accessToken = undefined;
          this.sessionID = undefined;
        }
      } catch (error) {
        this.msg.snackBar = error.toString();
      }
    },

    async getContacts(updateTime) {
      try {
        const response = await fetch(servr_url + this.endPts.contacts, {
          method: 'GET',
          headers: {
            Authorization: this.accessToken,
            'Cache-Control': 'no-store',
          },
        });
        const getContactsResJSON = await response.json();
        if (getContactsResJSON.success) {
          // if (getContactsResJSON.success && document.activeElement.tagName == 'BODY' && !this.updatingContactInfo) {
          // console.log(getContactsResJSON);
          if (this.slctdCntct.length == 0) {
            console.log('slctdCntct assigned from contacts');
            this.slctdCntct = getContactsResJSON.data.contacts.filter(
              (contact) => contact.id == this.userSettings.selectedContactIndex
            )[0]
              ? getContactsResJSON.data.contacts.filter(
                  (contact) => contact.id == this.userSettings.selectedContactIndex
                )[0]
              : getContactsResJSON.data.contacts[0];
          }
          this.contacts = getContactsResJSON.data.contacts;
          this.currentUpdate = updateTime;
        }
      } catch (error) {
        this.msg.snackBar = error.toString();
        console.log(error.toString());
      }
    },

    async getEmailSettings() {
      try {
        const response = await fetch(servr_url + this.endPts.emails, {
          method: 'GET',
          headers: {
            Authorization: this.accessToken,
            'Cache-Control': 'no-store',
          },
        });
        const getEmailSettingsResJSON = await response.json();
        if (getEmailSettingsResJSON.success) {
          // console.log(getEmailSettingsResJSON);
          this.emails = getEmailSettingsResJSON.data.emailSettings;
        }
      } catch (error) {
        this.msg.snackBar = error.toString();
        console.log(error.toString());
      }
    },

    // destroyed() {
    //  Check this
    //   clearInterval(this.updateTime());
    // },

    updateScreenWidth() {
      this.windowWidth = window.innerWidth;
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

  watch: {
    accessToken(newToken, oldToken) {
      this.userData = {};
      // this.loggedIn = false;
      if (newToken != undefined) this.getUserData();
    },
  },

  created() {
    this.getCookie('_a_t', '_s_i');
    if (this.accessToken) {
      this.getUserData();
    } else {
      this.loggedIn = false;
    }
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

@media only screen and (min-width: 768px) {
  .app-grid-container {
    /* grid-template-columns: calc(50% - 5px) 10px calc(50% - 5px); this is in computed now*/
    grid-template-rows: 100vh;
  }

  .app-grid-item1 {
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
