<template>
  <div class="reports-panel">
    <div class="reports-panel-title">Select a report:</div>
    <div class="reports-panel-body">
      <div
        v-for="(report, reportIndex) in includedReports"
        class="reports-panel-report"
        :class="[reports.includes(report.slice(0, 22)) ? 'reports-panel-active' : 'reports-panel' + (reportIndex % 2)]"
        @click="selectReport(report)"
      >
        {{ report }}
      </div>
      <div
        v-for="(activeUser, activeUserIndex) in Object.entries(activeUserList)"
        class="reports-panel-report"
        :class="[
          reports.includes('Activity log for user:' + activeUser[0])
            ? 'reports-panel-active'
            : 'reports-panel' + ((includedReports.length + activeUserIndex) % 2),
        ]"
        @click="selectReport('Activity log for user:' + activeUser[0])"
      >
        Activity log for user: {{ activeUser[1][0] }}
      </div>
      <div
        v-for="(report, reportIndex) in accountSettings.reports"
        class="reports-panel-report"
        :class="[
          reports.includes(report)
            ? 'reports-panel-active'
            : 'reports-panel' + ((includedReports.length + Object.entries(activeUserList).length + reportIndex) % 2),
        ]"
        @click="selectReport(report)"
      >
        {{ report }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Reports Panel',

  inject: ['wndw'],

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'userData',
      'activeUserList',
      'accountSettings',
      'contacts',
      'reports',
      'slctdCntctIndex',
    ]),
  },

  data() {
    return {
      includedReports: [],
    };
  },

  methods: {
    selectReport(event) {
      this.reports = event.trim();
      if (this.wndw.wdth < 768) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
  },
  mounted() {
    this.includedReports = [
      'All contacts with min. info (' + this.contacts?.length + ')',
      'All contacts with more info (' + this.contacts?.length + ')',
      'All contact tasks',
      'Contact categories',
      'Activity log for contact: ' +
        (this.contacts?.[this.slctdCntctIndex]?.Members?.[0]?.First
          ? this.contacts[this.slctdCntctIndex].Members[0].First + ' '
          : '') +
        this.contacts?.[this.slctdCntctIndex]?.Members?.[0]?.Name,
    ];
  },
};
</script>

<style>
.reports-panel-title {
  background-color: lightblue;
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
  font-weight: normal;
  color: black;
  height: 29px;
  padding: 5px;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
}
.reports-panel-active {
  font-weight: bold;
  background-color: #bbbbbb;
}
.reports-panel-report:hover {
  background-color: #ddd;
}
.reports-panel0 {
  background-color: white;
}
.reports-panel1 {
  background-color: lightblue;
}
</style>
