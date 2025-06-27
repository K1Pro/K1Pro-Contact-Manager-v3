<template>
  <div class="reports">
    <div class="reports-title">
      <select v-if="userRole > 5" v-model="slctdUser" @change="updateSlctdReport">
        <option
          v-for="([activeUserKey, activeUserVal], activeUserIndex) in Object.entries(sttngs.entity.activeUserList)"
          :value="activeUserKey"
        >
          {{ activeUserVal.FirstName }}'s reports
        </option>
      </select>
      <template v-else>{{ sttngs.entity.activeUserList[slctdUser].FirstName }}'s reports</template>
    </div>

    <div class="reports-body">
      <div
        v-for="(report, reportIndex) in includedReports[0].filter((el) => el.role < slctdUserRole)"
        class="reports-report"
        :class="[slctd.report.id === report.id ? 'reports-active' : 'reports' + (reportIndex % 2)]"
        @click="selectReport(report)"
      >
        {{ report.name }}
      </div>

      <hr />
      <div class="reports-title">{{ cntctName }}'s reports</div>
      <div
        v-for="(report, reportIndex) in includedReports[1].filter((el) => el.role < slctdUserRole)"
        class="reports-report"
        :class="[slctd.report.id === report.id ? 'reports-active' : 'reports' + (reportIndex % 2)]"
        @click="selectReport(report)"
      >
        {{ report.name }}
      </div>

      <hr />
      <div class="reports-title">
        {{ userData.Entity.charAt(0).toUpperCase() + userData.Entity.slice(1).replace('-', ' ') }}'s reports
      </div>

      <div
        v-for="(report, reportIndex) in [
          ...includedReports[2].filter((el) => el.role < slctdUserRole),
          ...sttngs.entity.reports.filter((el) => el.role < slctdUserRole),
        ]"
        class="reports-report"
        :class="[slctd.report.id === report.id ? 'reports-active' : 'reports' + (reportIndex % 2)]"
        @click="selectReport(report)"
      >
        {{ report.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Reports',

  inject: ['contacts', 'roles', 'sttngs', 'slctd', 'slctdCntctIndex', 'userData', 'userRole', 'wndw'],

  data() {
    return {
      slctdUser: this.userData.id,
    };
  },

  methods: {
    selectReport(report) {
      this.slctd.report = report;
      if (this.wndw.wdth < 768) window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    updateSlctdReport() {
      if (this.slctd.report.type == 'user' && this.slctd.report.user) this.slctd.report.user = this.slctdUser;
    },
  },

  computed: {
    includedReports() {
      return [
        [
          { id: 1, role: 3, name: 'Contacts', type: 'user', user: this.slctdUser },
          { id: 2, role: 3, name: 'Tasks', type: 'user', user: this.slctdUser },
          { id: 3, role: 3, name: 'Task stats', type: 'user', user: this.slctdUser },
        ],
        [
          { id: 4, role: 3, name: 'Emails', type: 'cntct', user: this },
          { id: 5, role: 3, name: 'Calls', type: 'cntct', user: this },
          { id: 6, role: 3, name: 'SMS', type: 'cntct', user: this },
          { id: 7, role: 3, name: 'Faxes', type: 'cntct', user: this },
          { id: 8, role: 3, name: 'Tasks', type: 'cntct', user: this },
        ],
        [
          { id: 9, role: 8, name: 'Contacts (min. info)' },
          { id: 10, role: 8, name: 'Contacts (more info)' },
          { id: 11, role: 8, name: 'Contact categories' },
          { id: 12, role: 8, name: 'Tasks' },
        ],
      ];
    },
    cntctName() {
      return this.contacts?.[this.slctdCntctIndex]?.Members?.[0]?.First ||
        this.contacts?.[this.slctdCntctIndex]?.Members?.[0]?.Name
        ? (this.contacts?.[this.slctdCntctIndex]?.Members?.[0]?.First
            ? this.contacts[this.slctdCntctIndex].Members[0].First + ' '
            : '') + this.contacts?.[this.slctdCntctIndex]?.Members?.[0]?.Name
        : 'Contact';
    },
    slctdUserRole() {
      return this.roles.findIndex((role) => role === this.sttngs.entity.activeUserList[this.slctdUser].role);
    },
  },

  created() {
    this.slctd.report = this.includedReports[0][0];
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
