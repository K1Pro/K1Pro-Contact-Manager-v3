<template>
  <div class="reports">
    <div class="reports-title">
      Report:
      <select v-if="userRole > 5" v-model="slctdUser" @change="updateSlctdReport">
        <option
          v-for="([activeUserKey, activeUserVal], activeUserIndex) in Object.entries(sttngs.entity.activeUserList)"
          :value="activeUserKey"
        >
          {{ activeUserVal.FirstName }}
        </option>
      </select>
    </div>
    <div class="reports-body">
      <div
        class="reports-report"
        :class="[slctd.report.includes('user_Contact report:' + slctdUser) ? 'reports-active' : 'reports0']"
        @click="selectReport('user_Contact report:' + slctdUser)"
      >
        Contact report: {{ sttngs.entity.activeUserList[slctdUser].FirstName }}
      </div>

      <template
        v-for="(report, reportIndex) in includedReports.filter((el) => Number(el.split('_')[0]) < slctdUserRole)"
      >
        <div
          class="reports-report"
          :class="[
            slctd.report.includes(
              report.split('_')[1] ? report.split('_')[1] + '_' + report.split('_')[2] : report.split('_')[2]
            )
              ? 'reports-active'
              : 'reports' + ((cntctReportAmnt + reportIndex) % 2),
          ]"
          @click="
            selectReport(
              report.split('_')[1] ? report.split('_')[1] + '_' + report.split('_')[2] : report.split('_')[2]
            )
          "
        >
          {{ report.split('_')[2] }}
        </div>
      </template>
      <hr />
      <div
        class="reports-report"
        :class="[slctd.report.includes('user_Task report:' + slctdUser) ? 'reports-active' : 'reports0']"
        @click="selectReport('user_Task report:' + slctdUser)"
      >
        Task report: {{ sttngs.entity.activeUserList[slctdUser].FirstName }}
      </div>

      <div
        class="reports-report"
        :class="[slctd.report.includes('user_Task stats:' + slctdUser) ? 'reports-active' : 'reports1']"
        @click="selectReport('user_Task stats:' + slctdUser)"
      >
        Task stats: {{ sttngs.entity.activeUserList[slctdUser].FirstName }}
      </div>
      <hr />
      <template
        v-for="(report, reportIndex) in sttngs.entity.reports.filter((el) => Number(el.split('_')[0]) < slctdUserRole)"
      >
        <div
          class="reports-report"
          :class="[
            slctd.report.includes(report.split('_')[1])
              ? 'reports-active'
              : 'reports' +
                ((3 + includedReports.filter((el) => Number(el.split('_')[0]) < slctdUserRole).length + reportIndex) %
                  2),
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

  inject: ['contacts', 'roles', 'sttngs', 'slctd', 'slctdCntctIndex', 'userData', 'userRole', 'wndw'],

  data() {
    return {
      // make includedReports into an array of arrays along with entity reports for future
      includedReports: [
        '5__Contact report: All ' + this.contacts?.length + ' (min. info)',
        '5__Contact report: All ' + this.contacts?.length + ' (more info)',
        '5__Contact categories',
        '4_cntct_Calls/Emails: ' +
          (this.contacts?.[this.slctdCntctIndex]?.Members?.[0]?.First
            ? this.contacts[this.slctdCntctIndex].Members[0].First + ' '
            : '') +
          this.contacts?.[this.slctdCntctIndex]?.Members?.[0]?.Name,
        '5__Task report: All',
      ],
      cntctReportAmnt: this.userRole > 5 ? Object.entries(this.sttngs.entity.activeUserList).length : 1,
      slctdUser: this.userData.id,
    };
  },

  methods: {
    selectReport(event) {
      this.slctd.report = event.trim();
      if (this.wndw.wdth < 768) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    updateSlctdReport() {
      if (this.slctd.report.split('_')[0] == 'user') {
        this.slctd.report = this.slctd.report.split(':')[0] + ':' + this.slctdUser;
      }
    },
  },

  computed: {
    slctdUserRole() {
      return this.roles.findIndex((role) => role === this.sttngs.entity.activeUserList[this.slctdUser].role);
    },
  },

  mounted() {
    if (this.slctd.report.split('_')[0] == 'cntct') {
      this.slctd.report =
        this.slctd.report.split(':')[0] +
        ': ' +
        (this.contacts?.[this.slctdCntctIndex]?.Members?.[0]?.First
          ? this.contacts[this.slctdCntctIndex].Members[0].First + ' '
          : '') +
        this.contacts?.[this.slctdCntctIndex]?.Members?.[0]?.Name;
    } else if (this.slctd.report.split('_')[0] == 'user') {
      this.slctd.report = this.slctd.report.split(':')[0] + ':' + this.slctdUser;
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
