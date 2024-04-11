import Snackbar from './components/Snackbar_vue.js';
import Login from './components/Login_vue.js';
import Side_panel from './components/Side_panel_vue.js';

export default {
  name: 'App',

  template: /*html*/ `
    <snackbar> </snackbar>

    <template v-if="loggedIn === true">
      <div class="app-grid-container">
        <div class="app-grid-item1">
          <side_panel></side_panel>
        </div>
        <div class="app-grid-item2">
          Panel 2
        </div>
      </div>
    </template>

    <template v-if="loggedIn === false">
      <div id="login-container">
        <login> </login>
      </div>
    </template>

    <template v-else></template>
  `,

  components: {
    Snackbar,
    Login,
    Side_panel,
  },

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'accessToken',
      'sessionID',
      'loggedIn',
      'msg',
      'windowWidth',
      'userData',
      'endPts',
    ]),
  },

  methods: {
    getCookie(accessToken, sessionID) {
      this.accessToken = document.cookie
        .match(new RegExp(`(^| )${accessToken}=([^;]+)`))
        ?.at(2);
      this.sessionID = document.cookie
        .match(new RegExp(`(^| )${sessionID}=([^;]+)`))
        ?.at(2);
    },

    async getUserData() {
      try {
        const response = await fetch(loginURL + this.endPts.userData, {
          // const response = await fetch(servrURL + this.endPts.userData, {
          method: 'GET',
          headers: {
            Authorization: this.accessToken,
            'Cache-Control': 'no-store',
          },
        });
        const userDataResJSON = await response.json();
        if (userDataResJSON.success) {
          this.loggedIn = true;
          this.userData = userDataResJSON.data.user;
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

    updateScreenWidth() {
      this.windowWidth = window.innerWidth;
    },
    onScreenResize() {
      window.addEventListener('resize', () => {
        this.updateScreenWidth();
      });
    },
  },

  watch: {
    accessToken(newToken, oldToken) {
      this.userData = '';
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

    style(
      'App',
      /*css*/ `
.app-grid-container {
  display: grid;
  grid-template-columns: 100vw;
  grid-template-rows: 100vh 100vh; /* auto */
  grid-row-gap: 10px;
  background-color: #c6c6c6;
  /* word-break: break-all; */
}

.app-grid-item1 {
  order: 2;
  height: 100%;
  border-right: none;
  overflow-y: hidden;
  overflow-x: hidden;
  background: -webkit-linear-gradient(left, #f1f1f1 49px, #999999 49px);
  background: -moz-linear-gradient(left, #f1f1f1 49px, #999999 49px);
  background: -ms-linear-gradient(left, #f1f1f1 49px, #999999 49px);
  background: linear-gradient(left, #f1f1f1 49px, #999999 49px);
}

.app-grid-item2 {
  order: 1;
  border-right: none;
  background-color: #999999;
  overflow-y: hidden;
}

@media only screen and (min-width: 768px) {
  body {
    overflow-y: hidden;
  }

  .app-grid-container {
    grid-template-columns: 50vw 50vw;
    grid-template-rows: 100vh;
  }

  .app-grid-item1 {
    order: 1;
    background: #999999;
  }

  .app-grid-item2 {
    order: 2;
  }

  .app-grid-item1,
  .app-grid-item2{
    overflow-y: scroll;
  }
}
      `
    );
  },
};
