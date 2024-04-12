import Logoutbtn from './LogOutBtn_vue.js';

export default {
  name: 'Side Panel',

  template: /*html*/ `
    <div class="side-panel">
      <div class="tab-title-container">
        <div class="tab-title"></div>
      </div>

      <div class="side-panel-toggle">
        <i v-if="windowWidth > 768" 
          :class="{ 'fa-solid fa-chevron-left': sidePanelOpen, 'fa-solid fa-chevron-right': !sidePanelOpen }" 
          :style="{ left: sidePanelOpen ? '189px' : '39px',}"
          @click="toggleSidepanel">
        </i>
      </div>

      <div class="tab-body-container">
        <div class="tab" 
          :style="{
            position: windowWidth > 768 ? 'absolute' : 'relative',
            width: sidePanelOpen ? '200px' : '50px', 
          }">

          <button
            title="Contact info"
            :class="{ 'tab-active': activeTab == 'house-chimney-user' }"
            @click="openTab">
            <i class="fa fa-house-chimney-user"></i>
            <span v-if="sidePanelOpen">Contact info</span>
          </button>
    
          <button
            title="Tasks"
            :class="{ 'tab-active': activeTab == 'list-check' }"
            @click="openTab">
            <i class="fa fa-list-check"></i>
            <span v-if="sidePanelOpen">Tasks</span>
          </button>
    
          <button
            title="Recurring events"
            :class="{ 'tab-active': activeTab == 'repeat' }"
            @click="openTab">
            <i class="fa fa-repeat"></i>
            <span v-if="sidePanelOpen">Recurring events</span>
          </button>

          <template v-for="(accountParam, accountParamIndex) in accountParams.tabs">
            <button 
              v-for="([paramKey, paramValue], paramIndex) in Object.entries(accountParam)"
              :title="paramKey"
              :class="{ 'tab-active': activeTab == paramValue }"
              @click="openTab">
              <i :class="'fa fa-' + paramValue"></i>
              <span v-if="sidePanelOpen">{{paramKey}}</span>
            </button>
          </template>

          ${
            /*
          <form :action="endPts.accountLoginURL" method="post" ref="accountLoginForm" >
            <input type="hidden" name="appName" :value="appName" />
            <input type="hidden" name="referer" :value="endPts.url" />
            <button title="Account login" @click.prevent="goToURL('accountLoginForm')" >
              <i class="fa fa-user-gear"></i>
              <span v-if="sidePanelOpen">Account login</span>
            </button>
          </form>*/ ''
          }

          <button
            title="Email"
            :class="{ 'tab-active': activeTab == 'envelope' }"
            @click="openTab">
            <i class="fa fa-envelope"></i>
            <span v-if="sidePanelOpen">Emails</span>
          </button>
    
          <button
            title="Reports"
            :class="{ 'tab-active': activeTab == 'chart-pie' }"
            @click="openTab">
            <i class="fa fa-chart-pie"></i>
            <span v-if="sidePanelOpen">Reports</span>
          </button>

          <button
            title="E-sign"
            :class="{ 'tab-active': activeTab == 'pen-to-square' }"
            @click="openTab">
            <i class="fa fa-pen-to-square"></i>
            <span v-if="sidePanelOpen">E-sign</span>
          </button>

          <button
            title="Upload"
            :class="{ 'tab-active': activeTab == 'file-arrow-up' }"
            @click="openTab">
            <i class="fa fa-file-arrow-up"></i>
            <span v-if="sidePanelOpen">Upload</span>
          </button>

          <logoutbtn :sidePanelOpen="sidePanelOpen" ></logoutbtn>
        </div>

        <div class="tab-content" v-if="activeTab == 'house-chimney-user'">
          Contact Info        
        </div>

        <div class="tab-content" v-if="activeTab == 'list-check'">
          Tasks
        </div>

        <div class="tab-content" v-if="activeTab == 'repeat'">
          Recurring events
        </div>

        <div class="tab-content" v-if="activeTab == 'chart-pie'">
          Analytics
        </div>

      </div>
    </div>
  `,

  components: { Logoutbtn },

  data() {
    return {
      activeTab: 'house-chimney-user',
      active: false,
      sidePanelOpen: false,
      pageClicks: 0,
    };
  },

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'accessToken',
      'msg',
      'windowWidth',
      'accountParams',
      'endPts',
      'appName',
    ]),
  },

  methods: {
    openTab(event) {
      const selectedTab =
        event.srcElement.localName == 'button'
          ? event.srcElement.firstChild.className.split('fa-')[1].trim()
          : event.srcElement.localName == 'i'
          ? event.target.className.split('fa-')[1].trim()
          : event.srcElement.previousSibling.className.split('fa-')[1].trim();
      if (selectedTab != this.activeTab) {
        this.sidePanelOpen = false;
        this.activeTab = selectedTab;
      }
    },

    goToURL(link) {
      if (confirm('Are you sure you want to leave this page?') == true) {
        link.slice(-4) == 'Form'
          ? this.$refs[link].submit()
          : (window.location.href = link);
      }
    },

    toggleSidepanel() {
      this.pageClicks = 0;
      this.sidePanelOpen = !this.sidePanelOpen;
    },

    onWindowClick() {
      if (this.pageClicks > 0) this.sidePanelOpen = false;
      this.pageClicks++;
    },
  },

  watch: {
    windowWidth() {
      this.sidePanelOpen = false;
    },
  },

  beforeDestroy() {
    document.removeEventListener('click', this.onWindowClick);
  },

  mounted() {
    console.log(this.accountParams.tabs);
    document.addEventListener('click', this.onWindowClick);

    style(
      'SocialMedia',
      /*css*/ `
.side-panel-toggle i {
  position: absolute;
  z-index: 4;
  top: 54px;
  font-size: 10px;
  padding: 6px 8px 6px 8px;
  border-radius: 50%;
  color: white;
  background-color: black;
  cursor: pointer;
  z-index: 4;
  transition: all 0.3s ease;
}
.side-panel input[type='text'] {
  background: white;
  width: 100%;
  padding: 6px;
  border: 0px;
}
.side-panel input[type='datetime-local'] {
  background: white;
  width: 100%;
  border: 0px;
  padding: 6px;
}
.side-panel input[type='checkbox'] {
  border: 0px;
  width: 16px;
  height: 16px;
}
.tab-title-container {
}
.tab-title {
}
.tab-body-container {
  height: 100%;
}
.tab {
  z-index: 3;
  float: left;
  height: 100%;
  background-color: #f1f1f1;
  border-right: 1px solid darkgrey;
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
}
.tab button {
  width: 100%;
  display: block;
  color: black;
  padding: 22px 13px;
  border: none;
  outline: none;
  text-align: left;
  cursor: default;
  transition: 0.3s;
  font-size: 20px;
}
.tab i {
  width: 40px;
}
.tab span {
  font-size: 16px;
  font-weight: normal;
  font-family: 'Helvetica', sans-serif;
}
.tab button:hover:not(.tab-active) {
  background-color: #ddd;
  cursor: pointer;
}
.tab-active {
  background-color: #bbbbbb;
}
.tab-content {
  position: relative;
  float: left;
  height: 100vh;
  width: calc(100% - 50px);
  padding: 10px 10px 10px 10px;
  background-color: green;
  background-clip: content-box;
}
@media only screen and (min-width: 768px) {
  .tab-content {
    padding: 10px 0px 10px 60px;
    width: 100%;
  }
  .tab {
    height: 100vh;
  }
}
      `
    );
  },
};
