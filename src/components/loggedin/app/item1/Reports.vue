<template>
  <div class="reports">
    <div class="reports-title">
      Select report:
      <select v-if="userRole > 5" v-model="slctdUser">
        <option
          v-for="([activeUserKey, activeUserVal], activeUserIndex) in Object.entries(activeUserList)"
          :value="activeUserKey"
        >
          {{ activeUserVal[0] }}
        </option>
      </select>
    </div>
    <div class="reports-body">
      <div
        class="reports-report"
        :class="[reports.includes('user_Contact report:' + slctdUser) ? 'reports-active' : 'reports0']"
        @click="selectReport('user_Contact report:' + slctdUser)"
      >
        Contact report: {{ activeUserList[slctdUser][0] }}
      </div>

      <div
        v-if="slctdUser == userData.id"
        v-for="(report, reportIndex) in includedReports"
        class="reports-report"
        :class="[reports.includes(report) ? 'reports-active' : 'reports' + ((cntctReportAmnt + reportIndex) % 2)]"
        @click="selectReport(report)"
      >
        {{ report.includes('_') ? report.split('_')[1] : report }}
      </div>

      <div
        class="reports-report"
        :class="[
          reports.includes('user_Task report:' + slctdUser)
            ? 'reports-active'
            : slctdUser == userData.id
            ? 'reports0'
            : 'reports1',
        ]"
        @click="selectReport('user_Task report:' + slctdUser)"
      >
        Task report: {{ activeUserList[slctdUser][0] }}
      </div>

      <div
        class="reports-report"
        :class="[
          reports.includes('Task stats:' + slctdUser)
            ? 'reports-active'
            : slctdUser == userData.id
            ? 'reports1'
            : 'reports0',
        ]"
        @click="selectReport('Task stats:' + slctdUser)"
      >
        Task stats: {{ activeUserList[slctdUser][0] }}
      </div>

      <template v-if="slctdUser == userData.id" v-for="(report, reportIndex) in accountSettings.reports">
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
      slctdUser: this.userData.id,
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
.reports-title select {
  font-size: 16px;
  font-weight: bold;
  border: none;
  background-color: transparent;
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
