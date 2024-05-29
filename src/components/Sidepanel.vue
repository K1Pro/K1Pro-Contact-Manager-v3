<template>
  <div class="side-panel">
    <div class="tab-title-container">
      <div class="tab-title"></div>
    </div>

    <div v-if="windowWidth > 768" class="side-panel-toggle">
      <i
        :class="{
          'fa-solid fa-chevron-left': sidePanelOpen,
          'fa-solid fa-chevron-right': !sidePanelOpen,
        }"
        :style="{ left: sidePanelOpen ? '189px' : '39px' }"
        @click="toggleSidepanel"
      >
      </i>
    </div>

    <div class="tab-body-container">
      <div
        class="tab"
        :style="{
          position: windowWidth > 768 ? 'absolute' : 'relative',
          width: sidePanelOpen ? '200px' : '50px',
        }"
      >
        <button
          title="Contact info"
          :class="{ 'tab-active': activeTab == 'house-chimney-user' }"
          @click="openTab($event)"
        >
          <i class="fa fa-house-chimney-user"></i>
          <span v-if="sidePanelOpen">Contact info</span>
        </button>

        <button
          title="Tasks"
          :class="{ 'tab-active': activeTab == 'list-check' }"
          @click="openTab($event)"
        >
          <i class="fa fa-list-check"></i>
          <span v-if="sidePanelOpen">Tasks</span>
        </button>

        <button
          title="Recurring tasks"
          :class="{ 'tab-active': activeTab == 'repeat' }"
          @click="openTab($event)"
        >
          <i class="fa fa-repeat"></i>
          <span v-if="sidePanelOpen">Recurring tasks</span>
        </button>

        <button
          title="Notes"
          :class="{ 'tab-active': activeTab == 'file-pen' }"
          @click="openTab($event)"
        >
          <i class="fa fa-file-pen"></i>
          <span v-if="sidePanelOpen">Notes</span>
        </button>

        <template
          v-for="(accountParam, accountParamIndex) in accountSettings?.tabs"
        >
          <button
            v-for="([paramKey, paramValue], paramIndex) in Object.entries(
              accountParam
            )"
            :title="paramKey"
            :class="{ 'tab-active': activeTab == paramValue }"
            @click="openTab($event, accountParamIndex)"
          >
            <i :class="'fa fa-' + paramValue"></i>
            <span v-if="sidePanelOpen">{{ paramKey }}</span>
          </button>
        </template>

        <button
          title="Reports"
          :class="{ 'tab-active': activeTab == 'chart-pie' }"
          @click="openTab($event)"
        >
          <i class="fa fa-chart-pie"></i>
          <span v-if="sidePanelOpen">Reports</span>
        </button>

        <button
          title="Settings"
          :class="{ 'tab-active': activeTab == 'user-gear' }"
          @click="openTab($event)"
        >
          <i class="fa fa-user-gear"></i>
          <span v-if="sidePanelOpen">Settings</span>
        </button>
      </div>

      <div class="tab-content">
        <div v-if="activeTab == 'house-chimney-user'">
          <contactinfo></contactinfo>
        </div>

        <div v-else-if="activeTab == 'list-check'">
          <tasks></tasks>
        </div>

        <div v-else-if="activeTab == 'repeat'">
          <recurtasks></recurtasks>
        </div>

        <div v-else-if="activeTab == 'file-pen'">
          <notes></notes>
        </div>

        <div v-else-if="activeTab == 'chart-pie'">
          <reportspanel></reportspanel>
        </div>

        <div v-else-if="activeTab == 'user-gear'">
          <settings></settings>
        </div>

        <div v-else>
          <custom1 v-if="customTab === 0"></custom1>
          <template v-else>{{ activeTab }}</template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidepanel',

  components: {
    Contactinfo,
    Tasks,
    Recurtasks,
    Notes,
    Settings,
    Custom1,
    Reportspanel,
  },

  data() {
    return {
      active: false,
      sidePanelOpen: false,
      pageClicks: 0,
      customTab: null,
    };
  },

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'accessToken',
      'msg',
      'windowWidth',
      'activeTab',
      'activeWindow',
      'eventIndex',
      'userData',
      'accountSettings',
      'endPts',
      'appName',
    ]),
  },

  methods: {
    openTab(event, customTab) {
      this.eventIndex = null;
      const selectedTab =
        event.srcElement.localName == 'button'
          ? event.srcElement.firstChild.className.split('fa-')[1].trim()
          : event.srcElement.localName == 'i'
          ? event.target.className.split('fa-')[1].trim()
          : event.srcElement.previousSibling.className.split('fa-')[1].trim();
      if (selectedTab != this.activeTab) {
        this.sidePanelOpen = false;
        this.activeTab = selectedTab;
        this.activeTab == 'chart-pie'
          ? (this.activeWindow = 'reports')
          : (this.activeWindow = 'calendar');
      }
      if (customTab !== null) {
        this.customTab = customTab;
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
  },
};
</script>

<style>
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
</style>
