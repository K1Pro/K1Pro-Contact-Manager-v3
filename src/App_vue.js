import Snackbar from './components/Snackbar_vue.js';
import Login from './components/Login_vue.js';
import Sidepanel from './components/Sidepanel_vue.js';
import Calendar from './components/calendar/Container_vue.js';

export default {
  name: 'App',

  template: /*html*/ `
    <snackbar> </snackbar>

    <template v-if="loggedIn === true">
      <div class="app-grid-container" :style="appGridContainer" >
        <div class="app-grid-item1">
          ${/* <sidepanel></sidepanel> */ ''}
          <sidepanel></sidepanel>
        </div>

        <div 
          v-if="windowWidth > 768" 
          class="app-grid-resizer" 
          @mousedown="startResizeGrid" 
          @mouseup="stopResizeGrid" 
          v-on:dblclick="resetGrid">
        </div>

        <div class="app-grid-item2">
        ${/* <calendar></calendar> */ ''}
          <calendar></calendar>
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
    Sidepanel,
    Calendar,
  },

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'accessToken',
      'sessionID',
      'loggedIn',
      'msg',
      'windowWidth',
      'userData',
      'accountParams',
      'endPts',
    ]),

    appGridContainer() {
      return this.windowWidth > 768
        ? {
            'grid-template-columns': `calc(${this.appGridItem1Width}% - 5px) 10px calc(${this.appGridItem2Width}% - 5px)`,
          }
        : false;
    },
  },

  data() {
    return {
      appGridItem1Width: 50,
      appGridItem2Width: 50,
    };
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
        const response = await fetch(servrURL + this.endPts.userData, {
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
          this.accountParams = userDataResJSON.data.accountParams;
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

    resizeGrid(event) {
      const newGridSize = Math.round((event.clientX / window.innerWidth) * 100);
      if (newGridSize > 25 && newGridSize < 65) {
        this.appGridItem1Width = newGridSize;
        this.appGridItem2Width = 100 - this.appGridItem1Width;
      }
    },

    startResizeGrid() {
      document.addEventListener('mousemove', this.resizeGrid, true);
      document.addEventListener('mouseup', this.stopResizeGrid, true);
    },

    stopResizeGrid() {
      document.removeEventListener('mousemove', this.resizeGrid, true);
      document.removeEventListener('mouseup', this.stopResizeGrid, true);
    },

    resetGrid() {
      this.appGridItem1Width = 50;
      this.appGridItem2Width = 50;
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

  .app-grid-resizer{
    order: 2;
    cursor: col-resize;
    background-color: #999999;
  }

  .app-grid-item2 {
    order: 3;
  }
}
      `
    );
  },
};
