<template>
  <div class="reports">
    <table>
      <template
        v-if="
          reports.includes('All contacts with min. info') ||
          reports.includes('All contacts with more info') ||
          reports.includes('Activity log for contact:')
        "
      >
        <thead>
          <tr>
            <th v-for="tableTitle in srtdCntcts[1][0]">{{ tableTitle }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(srtdCntct, srtdCntctIndex) in srtdCntcts[1]" :class="'cell' + ((srtdCntctIndex + 1) % 2)">
            <template v-if="srtdCntctIndex > 0 && srtdCntcts[0]">
              <template v-for="(tableContent, tableContentIndex) in srtdCntct">
                <td
                  v-if="tableContentIndex == 0"
                  class="cellHover"
                  @click="selectContact(srtdCntcts[0][srtdCntctIndex - 1])"
                >
                  {{ tableContent }}
                </td>
                <td v-if="tableContentIndex > 0">{{ tableContent }}</td>
              </template>
            </template>
            <template v-if="srtdCntctIndex > 0 && !srtdCntcts[0]">
              <td v-for="tableContent in srtdCntct">{{ tableContent }}</td>
            </template>
          </tr>
        </tbody>
      </template>

      <template v-if="reports.includes('All contact tasks')">
        <thead>
          <tr>
            <th>#</th>
            <th>Contact</th>
            <th>Date</th>
            <th>Owner</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(contact, contactIndex) in srtdCntcts[1]" :class="'taskCell' + (contactIndex % 2) + contact[1]">
            <td class="cellHover" @click="selectContact(contact[0])">{{ srtdCntcts[1].length - contactIndex }}</td>
            <td>{{ contact[2] }}</td>
            <td style="width: 125px">{{ usaDateFrmt(contact[3]) }}</td>
            <td>{{ contact[4] }}</td>
            <td>{{ contact[5] }}</td>
          </tr>
        </tbody>
      </template>

      <template v-if="reports.includes('Activity log for user:')">
        <thead>
          <tr>
            <th style="width: 15%">Date</th>
            <th style="width: 15%">Stats</th>
            <th style="width: 70%">Graph</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(contact, contactIndex) in srtdCntcts[1]" :class="'cell' + (contactIndex % 2)">
            <td>{{ contact[0] }}</td>
            <td>
              <div style="white-space: nowrap">{{ contact[1] }} {{ contact[1] != 1 ? 'emails' : 'email' }}</div>
              <div style="white-space: nowrap">{{ contact[2] }} {{ contact[2] != 1 ? 'calls' : 'call' }}</div>
              <div style="white-space: nowrap">{{ contact[3] }} {{ contact[3] != 1 ? 'tasks' : 'task' }}</div>
            </td>
            <td>
              <div
                style="height: 15px; background-color: lightskyblue"
                :style="{
                  width: srtdCntcts[1][srtdCntcts[1].length - 1][4]
                    ? (contact[1] / srtdCntcts[1][srtdCntcts[1].length - 1][4]) * 100 + '%'
                    : '0%',
                }"
              ></div>
              <div
                style="height: 15px; background-color: lightcoral"
                :style="{
                  width: srtdCntcts[1][srtdCntcts[1].length - 1][4]
                    ? (contact[2] / srtdCntcts[1][srtdCntcts[1].length - 1][4]) * 100 + '%'
                    : '0%',
                }"
              ></div>
              <div
                style="height: 15px; background-color: lightgreen"
                :style="{
                  width: srtdCntcts[1][srtdCntcts[1].length - 1][4]
                    ? (contact[3] / srtdCntcts[1][srtdCntcts[1].length - 1][4]) * 100 + '%'
                    : '0%',
                }"
              ></div>
            </td>
          </tr>
        </tbody>
      </template>

      <dynamic_component_name_reports></dynamic_component_name_reports>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Reports',

  components: {
    dynamic_component_name_reports,
  },

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'windowWidth',
      'activeTab',
      'activeWindow',
      'userSettings',
      'reports',
      'times',
      'contacts',
      'patchUserSettings',
      'usaDateFrmt',
      'userList',
      'slctdCntctIndex',
    ]),
    srtdCntcts() {
      let clonedCntcts = this.contacts;
      let newSrtdCntcts = [];
      let numberColumn = [];
      if (this.reports.includes('All contacts with min. info')) {
        // 'All contacts with min. info'
        clonedCntcts.forEach((contact) => {
          newSrtdCntcts.push([
            contact.id,
            contact.Members[0].Name ? contact.Members[0].Name : '',
            contact.Addresses[0].Address_1 ? contact.Addresses[0].Address_1 : '',
            contact.Assets[0] ? Object.values(contact.Assets[0])[0] : '',
            contact.Connections[0] ? Object.values(contact.Connections[0])[0] : '',
            contact.Categ ? contact.Categ : '',
          ]);
        });
        newSrtdCntcts
          .sort((a, b) => a[1].localeCompare(b[1]))
          .map((cntct, cntctIndex) => {
            numberColumn.push(cntct[0]);
            cntct[0] = cntctIndex + 1;
          });
        newSrtdCntcts.unshift(['#', 'Contact', 'Address', 'Assets', 'Connections', 'Category']);
      } else if (this.reports.includes('All contacts with more info')) {
        // 'All contacts with more info'
        clonedCntcts.forEach((contact) => {
          const addressArray = Object.entries(contact.Addresses[0]).map(([addressKey, addressValue]) => {
            return addressKey != 'Type' ? addressValue : null;
          });
          const assetsArray = contact.Assets.map((asset) => {
            return Object.values(asset);
          });
          newSrtdCntcts.push([
            contact.id,
            contact.Members[0].Name ? contact.Members[0].Name : '',
            Object.keys(contact?.Members?.[0])?.length > 2
              ? contact?.Members?.[0]?.First + ' ' + contact?.Members?.[0]?.Name
              : contact?.Members?.[0]?.Name,
            addressArray.join(' '),
            assetsArray.join(', '),
            contact.Connections[0] ? Object.values(contact.Connections[0])[0] : '',
            contact.Categ ? contact.Categ : '',
          ]);
        });
        newSrtdCntcts
          .sort((a, b) => a[1].localeCompare(b[1]))
          .map((cntct, cntctIndex) => {
            cntct.splice(1, 1);
            numberColumn.push(cntct[0]);
            cntct[0] = cntctIndex + 1;
          });
        newSrtdCntcts.unshift(['#', 'Contact', 'Address', 'Assets', 'Connections', 'Category']);
      } else if (this.reports == 'All contact tasks') {
        // 'All contact tasks'
        numberColumn = null;
        clonedCntcts.forEach((contact) => {
          contact.Tasks.forEach((task) => {
            if (task.Date)
              newSrtdCntcts.push([
                contact?.id,
                task?.Status == '1' ? 1 : 0,
                contact?.Members?.[0]?.Name,
                task?.Date,
                this.userList[task?.Update]?.[0],
                task?.Desc,
              ]);
          });
        });
        newSrtdCntcts.sort((a, b) => b[3].localeCompare(a[3]));
      } else if (this.reports.includes('Activity log for contact:')) {
        // 'Activity log for contact:'
        numberColumn = null;
        this.contacts[this.slctdCntctIndex].Log.forEach((log, logIndex) => {
          newSrtdCntcts.push([
            this.contacts[this.slctdCntctIndex].Log.length - logIndex,
            this.contacts[this.slctdCntctIndex].Members?.[0]?.Name,
            this.contacts[this.slctdCntctIndex].Categ,
            this.usaDateFrmt(log[1]),
            log[2],
            this.userList[log[0]][0],
          ]);
        });
        newSrtdCntcts.unshift(['#', 'Contact', 'Category', 'Date', 'Activity', 'Owner']);
      } else if (this.reports.includes('Activity log for user:')) {
        // 'Activity log for user:'
        numberColumn = null;
        let userID = this.reports.split(':')[1];
        let currentDate = new Date(this.times.initialUsrTmstmp);
        let decreasingDate;
        let emailCount, callCount, taskCount;
        let emailCallCountArray = [];
        for (let i = 0; i <= 30; i++) {
          // prettier-ignore
          decreasingDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + currentDate.getDate().toString().padStart(2, '0');
          emailCount = 0;
          callCount = 0;
          taskCount = 0;
          clonedCntcts.forEach((contact) => {
            contact.Log.forEach((log) => {
              if (log[0] == userID && log[1].includes(decreasingDate) && log[2].includes('Emailed')) {
                emailCount += 1;
              }
              if (log[0] == userID && log[1].includes(decreasingDate) && log[2].includes('Called')) {
                callCount += 1;
              }
            });
            contact.Tasks.forEach((task) => {
              if (task?.Date.includes(decreasingDate) && task?.Update == userID && task?.Status == 1) {
                taskCount += 1;
              }
            });
          });
          emailCallCountArray.push(emailCount);
          emailCallCountArray.push(callCount);
          emailCallCountArray.push(taskCount);
          newSrtdCntcts.push([
            this.usaDateFrmt(decreasingDate),
            emailCount,
            callCount,
            taskCount,
            Math.max(...emailCallCountArray),
          ]);
          currentDate.setDate(currentDate.getDate() - 1);
        }
      } else {
        clonedCntcts = this.contacts;
        newSrtdCntcts = clonedCntcts
          .map((contact) => {
            if (!contact.Members[0].Name) contact.Members[0].Name = null;
            return contact;
          })
          .sort((a, b) => a.Members[0].Name.localeCompare(b.Members[0].Name));
      }
      return [numberColumn, newSrtdCntcts];
    },
  },
  methods: {
    selectContact(contactID) {
      this.activeWindow = 'calendar';
      this.activeTab = 'house-chimney-user';
      this.userSettings.selectedContactIndex = contactID;
      this.patchUserSettings();
      if (this.windowWidth < 768) {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      }
    },
  },
};
</script>

<style>
.reports {
  text-align: left;
  background-color: white;
  width: calc(100% - 10px);
  height: calc(100vh - 20px);
  margin: 10px 0px 0px 10px;
  font-size: 12px;
  padding: 0px;
  overflow: scroll scroll;
}
.reports table {
  border: 0px;
  border-collapse: collapse;
  width: 100%;
}
.reports thead {
  height: 30px;
}
.reports th {
  position: sticky;
  top: 0;
  background-color: #6c757d;
  padding: 5px;
  margin: 0px;
  color: white;
}
.reports td {
  padding: 5px;
}
.cell0 {
  background-color: white;
}
.cell1 {
  background-color: lightgray;
}
.taskCell00 {
  background-color: rgb(255, 230, 230);
}
.taskCell10 {
  background-color: rgb(255, 205, 205);
}
.taskCell11 {
  background-color: rgb(230, 255, 230);
}
.taskCell01 {
  background-color: rgb(205, 255, 205);
}
.cellHover {
  cursor: pointer;
}
.cellHover:hover {
  text-decoration: underline;
}
@media only screen and (min-width: 768px) {
  .reports {
    margin: 10px 0px 0px 0px;
  }
}
</style>
