<template>
  <div class="reports">
    <div class="reports-title">Select a report:</div>
    <div class="reports-body">
      <div
        class="reports-report"
        :class="[reports.includes('user_Contact report:' + userData.id) ? 'reports-active' : 'reports0']"
        @click="selectReport('user_Contact report:' + userData.id)"
      >
        Contact report: {{ userData.FirstName }}
      </div>

      <template v-if="userRole > 5">
        <template
          v-for="([activeUserKey, activeUserVal], activeUserIndex) in Object.entries(activeUserList).filter(
            (user) => user[0] != userData.id
          )"
        >
          <div
            class="reports-report"
            :class="[
              reports.includes('user_Contact report:' + activeUserKey)
                ? 'reports-active'
                : 'reports' + ((1 + activeUserIndex) % 2),
            ]"
            @click="selectReport('user_Contact report:' + activeUserKey)"
          >
            Contact report: {{ activeUserVal[0] }}
          </div>
        </template>
      </template>

      <div
        v-for="(report, reportIndex) in includedReports"
        class="reports-report"
        :class="[reports.includes(report) ? 'reports-active' : 'reports' + ((cntctReportAmnt + reportIndex) % 2)]"
        @click="selectReport(report)"
      >
        {{ report.includes('_') ? report.split('_')[1] : report }}
      </div>

      <template v-for="activeUserIndex in Object.entries(activeUserList).length * 2">
        <template v-if="activeUserIndex % 2">
          <div
            v-if="Object.entries(activeUserList)[(activeUserIndex - 1) / 2][0] == userData.id || userRole > 5"
            class="reports-report"
            :class="[
              reports.includes('user_Task report:' + Object.entries(activeUserList)[(activeUserIndex - 1) / 2][0])
                ? 'reports-active'
                : 'reports' + ((cntctReportAmnt + includedReports.length + activeUserIndex + 1) % 2),
            ]"
            @click="selectReport('user_Task report:' + Object.entries(activeUserList)[(activeUserIndex - 1) / 2][0])"
          >
            Task report: {{ Object.entries(activeUserList)[(activeUserIndex - 1) / 2][1][0] }}
          </div>
        </template>
        <template v-if="(activeUserIndex + 1) % 2">
          <div
            v-if="Object.entries(activeUserList)[(activeUserIndex - 2) / 2][0] == userData.id || userRole > 5"
            class="reports-report"
            :class="[
              reports.includes('Task stats:' + Object.entries(activeUserList)[(activeUserIndex - 2) / 2][0])
                ? 'reports-active'
                : 'reports' + ((cntctReportAmnt + includedReports.length + activeUserIndex + 1) % 2),
            ]"
            @click="selectReport('Task stats:' + Object.entries(activeUserList)[(activeUserIndex - 2) / 2][0])"
          >
            Task stats: {{ Object.entries(activeUserList)[(activeUserIndex - 2) / 2][1][0] }}
          </div>
        </template>
      </template>

      <template v-for="(report, reportIndex) in accountSettings.reports">
        <div
          v-if="userRole > report.split('_')[0]"
          class="reports-report"
          :class="[
            reports.includes(report.split('_')[1])
              ? 'reports-active'
              : 'reports' + ((includedReports.length + Object.entries(activeUserList).length + reportIndex) % 2),
          ]"
          @click="selectReport(report.split('_')[1])"
        >
          {{ report.split('_')[1] }}
        </div>
      </template>
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
    'userRole',
    'wndw',
  ],

  data() {
    return {
      includedReports: [],
      cntctReportAmnt: this.userRole > 5 ? Object.entries(this.activeUserList).length : 1,
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
    if (this.userRole > 5) {
      this.includedReports = [
        'Contact report: All ' + this.contacts?.length + ' (min. info)',
        'Contact report: All ' + this.contacts?.length + ' (more info)',
        'Contact categories',
        'Task report: All',
        'cntct_Task report: ' +
          (this.contacts?.[this.slctdCntctIndex]?.Members?.[0]?.First
            ? this.contacts[this.slctdCntctIndex].Members[0].First + ' '
            : '') +
          this.contacts?.[this.slctdCntctIndex]?.Members?.[0]?.Name,
      ];
    } else {
      this.includedReports = [
        'cntct_Task report: ' +
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
  user-select: none;
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
  user-select: none;
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
