import Logoutbtn from './LogOutBtn_vue.js';
import Contactinfo from './sidepanel/Contactinfo_vue.js';
import Tasks from './sidepanel/Tasks_vue.js';

export default {
  name: 'Side Panel',

  template: /*html*/ `
    <div class="side-panel">
      <div class="tab-title-container">
        <div class="tab-title"></div>
      </div>

      <div v-if="windowWidth > 768" class="side-panel-toggle">
        <i  
          :class="{ 'fa-solid fa-chevron-left': sidePanelOpen, 'fa-solid fa-chevron-right': !sidePanelOpen }" 
          :style="{ left: sidePanelOpen ? '189px' : '39px'}"
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
            title="Recurring tasks"
            :class="{ 'tab-active': activeTab == 'repeat' }"
            @click="openTab">
            <i class="fa fa-repeat"></i>
            <span v-if="sidePanelOpen">Recurring tasks</span>
          </button>

          <template v-for="(accountParam, accountParamIndex) in accountSettings?.tabs">
            <button 
              v-for="([paramKey, paramValue], paramIndex) in Object.entries(accountParam)"
              :title="paramKey"
              :class="{ 'tab-active': activeTab == paramValue }"
              @click="openTab">
              <i :class="'fa fa-' + paramValue"></i>
              <span v-if="sidePanelOpen">{{paramKey}}</span>
            </button>
          </template>

          <button
            title="User Info"
            :class="{ 'tab-active': activeTab == 'user-tie' }"
            @click="openTab">
            <i class="fa fa-user-tie"></i>
            <span v-if="sidePanelOpen">User Info</span>
          </button>

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
            title="Emails"
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

          <logoutbtn :sidePanelOpen="sidePanelOpen" ></logoutbtn>
        </div>

        <div class="tab-content">
        
          <div v-if="activeTab == 'house-chimney-user'">
            <contactinfo></contactinfo>
          </div>

          <div v-else-if="activeTab == 'list-check'">
            <tasks></tasks>
          </div>

          <div v-else-if="activeTab == 'repeat'">
            Recurring tasks
          </div>
          
          <div v-else-if="activeTab == 'user-tie'">
            User Info
          </div>

          <div v-else-if="activeTab == 'envelope'">
            Emails
          </div>
          
          <div v-else-if="activeTab == 'chart-pie'">
            Reports
            </div>
          
          <div v-else>
            {{ activeTab }}
          </div>

        </div>

      </div>
    </div>
  `,

  components: { Logoutbtn, Contactinfo, Tasks },

  data() {
    return {
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
      'activeTab',
      'accountSettings',
      'endPts',
      'appName',
      'membersSlctdCntctArr',
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
    // console.log(this.settings.tabs);
    document.addEventListener('click', this.onWindowClick);

    style(
      'SocialMedia',
      /*css*/ `
.side-panel-toggle i {
  position: absolute;
  z-index: 4;
  top: 58px;
  font-size: 8px;
  padding: 6px 7.5px 6px 7.5px;
  border-radius: 50%;
  color: white;
  background-color: black;
  cursor: pointer;
  z-index: 4;
  transition: all 0.3s ease;
}
.tab-title-container {
}
.tab-title {
}
.tab-body-container {
}
.tab {
  z-index: 3;
  float: left;
  height: 100%;
  background-color: #f1f1f1;
  border-right: 1px solid darkgrey;
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: auto;
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
  height: auto;
  width: calc(100% - 50px);
  border-style: solid;
  border-width: 10px 10px 10px 10px;
  border-color: #00000000;
  /* background-color: green; */
  background-clip: content-box;
}
@media only screen and (min-width: 768px) {
  .tab-content {
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    border-style: solid;
    border-width: 10px 0px 10px 60px;
    border-color: #00000000;
  }
}
      `
    );
  },
};
