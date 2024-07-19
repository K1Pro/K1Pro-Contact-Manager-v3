<template>
  <div class="reports-panel">
    <div class="reports-panel-title">Select a report</div>
    <div class="reports-panel-body">
      <div
        class="reports-panel-report reports-panel-odd"
        :style="{ 'font-weight': reports.includes('All contacts with min. info') ? 'bold' : 'normal' }"
        @click="selectReport($event.target.innerHTML)"
      >
        All contacts with min. info ({{ contacts.length }})
      </div>
      <div
        class="reports-panel-report reports-panel-even"
        :style="{ 'font-weight': reports.includes('All contacts with more info') ? 'bold' : 'normal' }"
        @click="selectReport($event.target.innerHTML)"
      >
        All contacts with more info ({{ contacts.length }})
      </div>
      <div
        class="reports-panel-report reports-panel-odd"
        :style="{ 'font-weight': reports.includes('All contact tasks') ? 'bold' : 'normal' }"
        @click="selectReport($event.target.innerHTML)"
      >
        All contact tasks
      </div>
      <div
        class="reports-panel-report reports-panel-even"
        :style="{ 'font-weight': reports.includes('Activity log for contact:') ? 'bold' : 'normal' }"
        @click="selectReport($event.target.innerHTML)"
      >
        Activity log for contact:
        {{ contacts[slctdCntctIndex].Members[0].First ? contacts[slctdCntctIndex].Members[0].First : '' }}
        {{ contacts[slctdCntctIndex].Members[0]?.Name }}
      </div>
      <div
        class="reports-panel-report reports-panel-odd"
        :style="{ 'font-weight': reports.includes('Activity log for user:') ? 'bold' : 'normal' }"
        @click="selectReport($event.target.innerHTML)"
      >
        Activity log for user: {{ userData.FirstName }}
      </div>
      <div
        v-if="userData?.AppPermissions[appName][0] == 'bundle_insurance'"
        class="reports-panel-report reports-panel-even"
        :style="{ 'font-weight': reports.includes('All policies') ? 'bold' : 'normal' }"
        @click="selectReport($event.target.innerHTML)"
      >
        All policies
      </div>
      <div
        v-if="userData?.AppPermissions[appName][0] == 'bundle_insurance'"
        class="reports-panel-report reports-panel-odd"
        :style="{ 'font-weight': reports.includes('Active policies') ? 'bold' : 'normal' }"
        @click="selectReport($event.target.innerHTML)"
      >
        Active policies
      </div>
      <div
        v-if="userData?.AppPermissions[appName][0] == 'bundle_insurance'"
        class="reports-panel-report reports-panel-even"
        :style="{ 'font-weight': reports.includes('New business') ? 'bold' : 'normal' }"
        @click="selectReport($event.target.innerHTML)"
      >
        New business
      </div>
      <div
        v-if="userData?.AppPermissions[appName][0] == 'bundle_insurance'"
        class="reports-panel-report reports-panel-odd"
        :style="{ 'font-weight': reports.includes('Renewals') ? 'bold' : 'normal' }"
        @click="selectReport($event.target.innerHTML)"
      >
        Renewals
      </div>
      <div
        v-if="userData?.AppPermissions[appName][0] == 'bundle_insurance'"
        class="reports-panel-report reports-panel-even"
        :style="{ 'font-weight': reports.includes('Erie leads') ? 'bold' : 'normal' }"
        @click="selectReport($event.target.innerHTML)"
      >
        Erie leads
      </div>
      <div
        v-if="userData?.AppPermissions[appName][0] == 'bundle_insurance'"
        class="reports-panel-report reports-panel-odd"
        :style="{ 'font-weight': reports.includes('Microsip phone book') ? 'bold' : 'normal' }"
        @click="selectReport($event.target.innerHTML)"
      >
        Microsip phone book
      </div>
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
      'contacts',
      'reports',
      'appName',
      'slctdCntctIndex',
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
