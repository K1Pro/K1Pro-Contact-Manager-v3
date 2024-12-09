<template>
  <div class="reports-table">
    <i
      v-if="userRole > 5"
      :style="{ left: tbCntntWdth + 30 + 'px' }"
      class="fa-solid fa-download"
      @click="downloadTable"
    ></i>
    <table>
      <template
        v-if="
          slctd.report.includes('(min. info)') ||
          slctd.report.includes('(more info)') ||
          slctd.report.includes('cntct_Task report:') ||
          slctd.report.includes('user_Contact report:')
        "
      >
        <thead v-if="tblCntnt[2].length > 0">
          <tr>
            <th v-for="tblTtl in tblCntnt[0]">{{ tblTtl }}</th>
          </tr>
        </thead>
        <tbody v-if="tblCntnt[2].length > 0">
          <tr
            v-for="(tblRow, tblRowIndx) in tblCntnt[2]"
            :class="
              slctd.report.includes('cntct_Task report:')
                ? 'taskCell' + (tblRowIndx % 2) + '1'
                : 'cell' + (tblRowIndx % 2)
            "
          >
            <td v-if="tblCntnt[1]" class="cellHover" @click="selectContact(tblCntnt[1][tblRowIndx][1])">
              {{ tblCntnt[1][tblRowIndx][0] }}
            </td>
            <td v-for="tblCell in tblRow" class="cellHover" @click="selectContact(tblCntnt[1][tblRowIndx][1])">
              {{ tblCell }}
            </td>
          </tr>
        </tbody>
        <p v-else>Empty</p>
      </template>

      <template v-if="slctd.report.includes('Task report: All') || slctd.report.includes('user_Task report:')">
        <thead>
          <tr>
            <th v-for="tblTtl in tblCntnt[0]">{{ tblTtl }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(contact, contactIndex) in tblCntnt[2]" :class="'taskCell' + (contactIndex % 2) + contact[1]">
            <td class="cellHover" @click="selectContact(contact[0])">{{ tblCntnt[2].length - contactIndex }}</td>
            <td class="cellHover" @click="selectContact(contact[0])">{{ contact[2] }}</td>
            <td class="cellHover" @click="selectContact(contact[0])" style="width: 125px">
              {{ usaDateFrmt(contact[3]) }}
            </td>
            <td class="cellHover" @click="selectContact(contact[0])">{{ contact[4] }}</td>
            <td class="cellHover" @click="selectContact(contact[0])">{{ contact[5] }}</td>
          </tr>
        </tbody>
      </template>

      <template v-if="slctd.report == 'Contact categories'">
        <thead>
          <tr>
            <th style="width: 15%">Date</th>
            <th style="width: 15%">Stats</th>
            <th style="width: 70%">Graph</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="([contactKey, contactValue], contactIndex) in Object.entries(tblCntnt[2][0])"
            :class="'cell' + (contactIndex % 2)"
          >
            <td>{{ contactKey }}</td>
            <td>{{ contactValue }}</td>
            <td>
              <div
                style="height: 15px"
                :style="{
                  width: (contactValue / contacts.length) * 100 + '%',
                  'background-color': '#' + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, '0'),
                }"
              ></div>
            </td>
          </tr>
        </tbody>
      </template>

      <template v-if="slctd.report.includes('Task stats:')">
        <thead>
          <tr>
            <th style="width: 15%">Date</th>
            <th style="width: 15%">Stats</th>
            <th style="width: 70%">Graph</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(contact, contactIndex) in tblCntnt[2]" :class="'cell' + (contactIndex % 2)">
            <td>{{ contact[0] }}</td>
            <td class="reports-table-usr-actvty-log">
              <div>{{ contact[1] }} {{ contact[1] != 1 ? 'emails' : 'email' }}</div>
              <div>{{ contact[2] }} {{ contact[2] != 1 ? 'calls' : 'call' }}</div>
              <div>{{ contact[3] }} {{ contact[3] != 1 ? 'tasks' : 'task' }}</div>
            </td>
            <td>
              <div
                style="height: 15px; background-color: lightskyblue"
                :style="{
                  width: tblCntnt[2][tblCntnt[2].length - 1][4]
                    ? (contact[1] / tblCntnt[2][tblCntnt[2].length - 1][4]) * 100 + '%'
                    : '0%',
                }"
              ></div>
              <div
                style="height: 15px; background-color: lightcoral"
                :style="{
                  width: tblCntnt[2][tblCntnt[2].length - 1][4]
                    ? (contact[2] / tblCntnt[2][tblCntnt[2].length - 1][4]) * 100 + '%'
                    : '0%',
                }"
              ></div>
              <div
                style="height: 15px; background-color: lightgreen"
                :style="{
                  width: tblCntnt[2][tblCntnt[2].length - 1][4]
                    ? (contact[3] / tblCntnt[2][tblCntnt[2].length - 1][4]) * 100 + '%'
                    : '0%',
                }"
              ></div>
            </td>
          </tr>
        </tbody>
      </template>

      <custom_reports></custom_reports>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Reports table',

  inject: [
    'contacts',
    'userSttngsReq',
    'slctd',
    'slctdCntctIndex',
    'sttngs',
    'tbCntntWdth',
    'times',
    'userData',
    'usaDateFrmt',
    'userList',
    'userRole',
    'wndw',
  ],

  computed: {
    tblCntnt() {
      let cloneCntcts = this.contacts;
      let tblHdrs = [];
      let nmbrClmn = [];
      let tblClmns = [];
      if (this.slctd.report.includes('(min. info)')) {
        // Contact report: (min. info)
        cloneCntcts.forEach((contact) => {
          tblClmns.push([
            contact.id,
            contact.Members[0].Name ? contact.Members[0].Name : '',
            contact.Addresses[0]?.Address_1 ? contact.Addresses[0].Address_1 : '',
            contact.Assets[0] ? Object.values(contact.Assets[0])[0] : '',
            contact.Connections[0] ? Object.values(contact.Connections[0])[0] : '',
            contact.Categ ? contact.Categ : '',
          ]);
        });
        tblClmns
          .sort((a, b) => a[1].localeCompare(b[1]))
          .map((cntct, cntctIndx) => {
            const nmbrClmnArray = [];
            nmbrClmnArray.push(cntctIndx + 1);
            nmbrClmnArray.push(cntct[0]);
            nmbrClmn.push(nmbrClmnArray);
            cntct.splice(0, 1);
          });
        tblHdrs = ['#', 'Contact', 'Address', 'Assets', 'Connections', 'Category'];
      } else if (this.slctd.report.includes('(more info)')) {
        // (more info)
        cloneCntcts.forEach((contact) => {
          const addressArray = contact.Addresses[0]
            ? Object.entries(contact.Addresses[0]).map(([addressKey, addressValue]) => {
                return addressKey != 'Type' ? addressValue : null;
              })
            : [];
          const assetsArray = contact.Assets.map((asset) => {
            return Object.values(asset);
          });
          tblClmns.push([
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
        tblClmns
          .sort((a, b) => a[1].localeCompare(b[1]))
          .map((cntct, cntctIndx) => {
            const nmbrClmnArray = [];
            nmbrClmnArray.push(cntctIndx + 1);
            nmbrClmnArray.push(cntct[0]);
            nmbrClmn.push(nmbrClmnArray);
            cntct.splice(0, 2);
          });

        tblHdrs = ['#', 'Contact', 'Address', 'Assets', 'Connections', 'Category'];
      } else if (this.slctd.report.includes('user_Contact report:')) {
        // user_Contact report:
        cloneCntcts.forEach((contact) => {
          if (contact.Assigned == this.slctd.report.split(':')[1]) {
            tblClmns.push([
              contact.id,
              contact.Members[0].Name ? contact.Members[0].Name : '',
              contact.Addresses[0]?.Address_1 ? contact.Addresses[0].Address_1 : '',
              contact.Assets[0] ? Object.values(contact.Assets[0])[0] : '',
              contact.Connections[0] ? Object.values(contact.Connections[0])[0] : '',
              contact.Categ ? contact.Categ : '',
            ]);
          }
        });
        tblClmns
          .sort((a, b) => a[1].localeCompare(b[1]))
          .map((cntct, cntctIndx) => {
            const nmbrClmnArray = [];
            nmbrClmnArray.push(cntctIndx + 1);
            nmbrClmnArray.push(cntct[0]);
            nmbrClmn.push(nmbrClmnArray);
            cntct.splice(0, 1);
          });
        tblHdrs = ['#', 'Contact', 'Address', 'Assets', 'Connections', 'Category'];
      } else if (this.slctd.report == 'Task report: All') {
        // Task report: All
        nmbrClmn = null;
        cloneCntcts.forEach((contact) => {
          contact.Tasks.forEach((task) => {
            if (task.Date)
              tblClmns.push([
                contact?.id,
                task?.Status == '1' ? 1 : 0,
                contact?.Members?.[0]?.Name,
                task?.Date,
                this.userList[task?.Assign]?.FirstName,
                task?.Desc,
              ]);
          });
        });
        tblHdrs = ['#', 'Contact', 'Date', 'Owner', 'Description'];
        tblClmns.sort((a, b) => b[3].localeCompare(a[3]));
      } else if (this.slctd.report.includes('user_Task report:')) {
        // 'user_Task report: '
        nmbrClmn = null;
        cloneCntcts.forEach((contact) => {
          contact.Tasks.forEach((task) => {
            if (task.Date && this.slctd.report.split(':')[1] == task?.Assign)
              tblClmns.push([
                contact?.id,
                task?.Status == '1' ? 1 : 0,
                contact?.Members?.[0]?.Name,
                task?.Date,
                this.userList[task?.Assign]?.FirstName,
                task?.Desc,
              ]);
          });
        });
        tblHdrs = ['#', 'Contact', 'Date', 'Owner', 'Description'];
        tblClmns.sort((a, b) => b[3].localeCompare(a[3]));
      } else if (this.slctd.report == 'Contact categories') {
        nmbrClmn = null;
        const cntctCategArray = {};
        cloneCntcts.forEach((contact) => {
          contact.Categ = contact.Categ || contact.Categ != '' ? contact.Categ : 'No category';
          if (!Object.keys(cntctCategArray).includes(contact.Categ)) {
            cntctCategArray[contact.Categ] = 1;
          } else {
            cntctCategArray[contact.Categ]++;
          }
        });
        tblClmns.push(cntctCategArray);
      } else if (this.slctd.report.includes('cntct_Task report:')) {
        // 'cntct_Task report'
        nmbrClmn = null;
        this.contacts[this.slctdCntctIndex].Log.forEach((log, logIndex) => {
          tblClmns.push([
            this.contacts[this.slctdCntctIndex].Log.length - logIndex,
            this.contacts[this.slctdCntctIndex].Members?.[0]?.Name,
            this.contacts[this.slctdCntctIndex].Categ,
            this.usaDateFrmt(log[1]),
            log[2],
            this.userList[log[0]].FirstName,
          ]);
        });
        tblHdrs = ['#', 'Contact', 'Category', 'Date', 'Activity', 'Owner'];
      } else if (this.slctd.report.includes('Task stats:')) {
        // 'Task stats:'
        nmbrClmn = null;
        let userID = this.slctd.report.split(':')[1];
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
          cloneCntcts.forEach((contact) => {
            contact.Log.forEach((log) => {
              if (log[0] == userID && log[1].includes(decreasingDate) && log[2].includes('Emailed')) {
                emailCount += 1;
              }
              if (log[0] == userID && log[1].includes(decreasingDate) && log[2].includes('Called')) {
                callCount += 1;
              }
            });
            contact.Tasks.forEach((task) => {
              if (task?.Date.includes(decreasingDate) && task?.Assign == userID && task?.Status == 1) {
                taskCount += 1;
              }
            });
          });
          emailCallCountArray.push(emailCount);
          emailCallCountArray.push(callCount);
          emailCallCountArray.push(taskCount);
          tblClmns.push([
            this.usaDateFrmt(decreasingDate),
            emailCount,
            callCount,
            taskCount,
            Math.max(...emailCallCountArray),
          ]);
          currentDate.setDate(currentDate.getDate() - 1);
        }
      } else {
        cloneCntcts = this.contacts;
        tblClmns = cloneCntcts
          .map((contact) => {
            if (!contact.Members[0].Name) contact.Members[0].Name = null;
            return contact;
          })
          .sort((a, b) => a.Members[0].Name.localeCompare(b.Members[0].Name));
      }
      return [tblHdrs, nmbrClmn, tblClmns];
    },
  },
  methods: {
    selectContact(contactID) {
      this.slctd.sideMenuLnk = ['Contactinfo', 'Calendar'];
      const cloneSttngs = this.sttngs.user;
      cloneSttngs.selectedContactIndex = contactID;
      this.userSttngsReq('PATCH', cloneSttngs);
      if (this.wndw.wdth < 768) {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      }
    },
    downloadTable() {
      const csv = [];
      document.querySelectorAll('tr').forEach((tr) => {
        const row = [];
        for (let i of tr.children) {
          // row.push('"' + i.innerHTML.replaceAll(/<.*>/, '').replace(/,\s*$/, '') + '"');
          row.push('"' + i.innerHTML.replaceAll('<div>', '').replaceAll('</div>', ', ').replace(/,\s*$/, '') + '"');
        }
        csv.push(row.join(','));
      });
      const csv_string = csv.join('\n');
      const filename = new Date().toLocaleDateString() + '_' + this.slctd.report + '.csv';
      const link = document.createElement('a');
      link.style.display = 'none';
      link.setAttribute('target', '_blank');
      link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>

<style>
.reports-table {
  text-align: left;
  background-color: white;
  width: calc(100% - 10px);
  height: calc(100vh - 20px);
  margin: 10px 0px 0px 10px;
  font-size: 12px;
  padding: 0px;
  overflow: scroll scroll;
  user-select: none;
}
.reports-table i {
  z-index: 1;
  color: #417cd9;
  position: absolute;
  top: calc(100vh + 20px);
  height: 30px;
  padding: 10px 5px 0px 5px;
  cursor: pointer;
}
.reports-table table {
  border: 0px;
  border-collapse: collapse;
  width: 100%;
}
.reports-table thead {
  height: 30px;
}
.reports-table th {
  position: sticky;
  top: 0;
  background-color: #6c757d;
  padding: 5px;
  margin: 0px;
  color: white;
}
.reports-table td {
  padding: 5px;
}
.reports-table-usr-actvty-log div {
  overflow: hidden;
  white-space: nowrap;
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
tr:hover {
  background: lightblue;
}
.cellHover {
  cursor: pointer;
}
/* .cellHover:hover {
  text-decoration: underline;
} */
@media only screen and (min-width: 768px) {
  .reports-table {
    margin: 10px 0px 0px 0px;
  }
  .reports-table i {
    top: 10px;
    padding: 10px 5px 0px 20px;
  }
}
</style>
