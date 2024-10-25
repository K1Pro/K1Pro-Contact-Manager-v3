<template>
  <div class="reports">
    <div class="reports-title">Select a report:</div>
    <div class="reports-body">
      <div
        v-for="(report, reportIndex) in includedReports"
        class="reports-report"
        :class="[reports.includes(report.slice(0, 22)) ? 'reports-active' : 'reports' + (reportIndex % 2)]"
        @click="selectReport(report)"
      >
        {{ report }}
      </div>

      <template v-for="(activeUser, activeUserIndex) in Object.entries(activeUserList)">
        <div
          v-if="activeUser[0] == userData.id || userData.AppPermissions[appName][1] == 'admin'"
          class="reports-report"
          :class="[
            reports.includes('Task list:' + activeUser[0])
              ? 'reports-active'
              : 'reports' + ((includedReports.length + activeUserIndex) % 2),
          ]"
          @click="selectReport('Task list:' + activeUser[0])"
        >
          Task list: {{ activeUser[1][0] }}
        </div>
        <div
          v-if="activeUser[0] == userData.id || userData.AppPermissions[appName][1] == 'admin'"
          class="reports-report"
          :class="[
            reports.includes('Task statistics:' + activeUser[0])
              ? 'reports-active'
              : 'reports' + ((includedReports.length + activeUserIndex) % 2),
          ]"
          @click="selectReport('Task statistics:' + activeUser[0])"
        >
          Task statistics: {{ activeUser[1][0] }}
        </div></template
      >

      <div
        v-for="(report, reportIndex) in accountSettings.reports"
        class="reports-report"
        :class="[
          reports.includes(report)
            ? 'reports-active'
            : 'reports' + ((includedReports.length + Object.entries(activeUserList).length + reportIndex) % 2),
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
  name: 'Reports',

  emits: ['slctdReport'],

  inject: [
    'accountSettings',
    'activeUserList',
    'appName',
    'contacts',
    'reports',
    'slctdCntctIndex',
    'userData',
    'wndw',
  ],

  data() {
    return {
      includedReports: [],
    };
  },

  methods: {
    selectReport(event) {
      this.$emit('slctdReport', event.trim());
      if (this.wndw.wdth < 768) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
  },
  mounted() {
    console.log(this.userData.FirstName);
    if (this.userData.AppPermissions[this.appName][1] == 'admin') {
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
    } else {
      this.includedReports = [
        'Activity log for contact: ' +
          (this.contacts?.[this.slctdCntctIndex]?.Members?.[0]?.First
            ? this.contacts[this.slctdCntctIndex].Members[0].First + ' '
            : '') +
          this.contacts?.[this.slctdCntctIndex]?.Members?.[0]?.Name,
      ];
    }
  },
};
</script>

<style>
.reports-title {
  background-color: lightblue;
  font-weight: bold;
  padding: 5px;
  color: black;
  height: 30px;
  overflow: hidden;
  white-space: nowrap;
}
.reports-body {
  background-color: white;
  height: calc(100vh - 50px);
}
.reports-report {
  font-weight: normal;
  color: black;
  height: 29px;
  padding: 5px;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
}
.reports-active {
  font-weight: bold;
  background-color: #bbbbbb;
}
.reports-report:hover {
  background-color: #ddd;
}
.reports0 {
  background-color: white;
}
.reports1 {
  background-color: lightblue;
}
</style>
