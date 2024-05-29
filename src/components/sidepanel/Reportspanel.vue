<template>
  <div class="reports-panel">
    <div class="reports-panel-title">Select a report</div>
    <div class="reports-panel-body">
      <div
        class="reports-panel-report reports-panel-odd"
        @click="selectReport($event.target.innerHTML)"
      >
        Contacts with minimum info
      </div>
      <div
        class="reports-panel-report reports-panel-even"
        @click="selectReport($event.target.innerHTML)"
      >
        Contacts with expanded info
      </div>
      <div
        v-if="userData?.AppPermissions[appName][0] == 'bundle_insurance'"
        class="reports-panel-report reports-panel-odd"
        @click="selectReport($event.target.innerHTML)"
      >
        Contacts Policy info
      </div>
      <div
        class="reports-panel-report reports-panel-even"
        @click="selectReport($event.target.innerHTML)"
      >
        Activity log for
        {{ slctdCntct.Members[0].First ? slctdCntct.Members[0].First : '' }}
        {{ slctdCntct.Members[0].Name }}
      </div>
      <div class="reports-panel-report reports-panel-odd">All tasks</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Reports Panel',

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'userData',
      'reports',
      'appName',
      'slctdCntct',
    ]),
  },

  methods: {
    selectReport(event) {
      this.reports = event.trim();
    },
  },
};
</script>

<style>
.reports-panel {
  background-color: lightblue;
}
.reports-panel-title {
  font-weight: bold;
  padding: 5px;
  color: black;
  height: 30px;
  overflow: hidden;
  white-space: nowrap;
}
.reports-panel-body {
  background-color: white;
  height: calc(100vh - 50px);
}
.reports-panel-report {
  padding: 5px;
  cursor: pointer;
}
.reports-panel-odd {
  background-color: white;
}
.reports-panel-even {
  background-color: lightblue;
}
</style>
