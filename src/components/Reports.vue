<template>
  <div class="reports">
    <template v-if="reports.includes('All contacts with min. info')">
      <table>
        <thead>
          <tr>
            <th>Contact</th>
            <th>Address</th>
            <th>Assets</th>
            <th>Connections</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(contact, contactIndex) in srtdCntcts" :class="'cell' + (contactIndex % 2)">
            <td class="cellHover" @click="selectContact(contact.id)">{{ Object.values(contact.Members)[0].Name }}</td>
            <td>{{ Object.values(contact.Addresses)?.[0]?.Address_1 }}</td>
            <td>
              {{ Object.values(contact.Assets)[0] ? Object.values(Object.values(contact.Assets)[0])[0] : '' }}
            </td>
            <td>
              {{ Object.values(contact.Connections)[0] ? Object.values(Object.values(contact.Connections)[0])[0] : '' }}
            </td>
            <td>{{ contact.Categ }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-if="reports.includes('All contacts with more info')">
      <table>
        <thead>
          <tr>
            <th>Contact</th>
            <th>Address</th>
            <th>Assets</th>
            <th>Connections</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(contact, contactIndex) in srtdCntcts" :class="'cell' + (contactIndex % 2)">
            <td class="cellHover" @click="selectContact(contact.id)">
              <div v-for="contactInfo in contact.Members">{{ contactInfo.First }} {{ contactInfo.Name }}</div>
            </td>
            <td>
              <template v-for="contactInfo in contact.Addresses">
                <div>{{ contactInfo.Address_1 }} {{ contactInfo.Address_2 }}</div>
                <div>
                  {{ contactInfo.City }} {{ contactInfo.State }}
                  {{ contactInfo.Zip }}
                </div>
              </template>
            </td>
            <td>
              <template v-for="contactInfo in contact.Assets">
                <div v-for="infoItem in contactInfo">
                  {{ infoItem }}
                </div>
              </template>
            </td>
            <td>
              <template v-for="contactInfo in contact.Connections">
                <div v-for="infoItem in contactInfo">
                  {{ infoItem }}
                </div>
              </template>
            </td>
            <td>
              <div>
                {{ contact.Categ }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-if="reports.includes('All contact tasks')">
      <table>
        <thead>
          <tr>
            <th>Contact</th>
            <th>Date</th>
            <th>Owner</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(contact, contactIndex) in srtdCntcts" :class="'taskCell' + (contactIndex % 2) + contact[1]">
            <td class="cellHover" @click="selectContact(contact[0])">{{ contact[2] }}</td>
            <td>
              <div style="width: 125px">{{ contact[3] }}</div>
            </td>
            <td>
              <div>{{ contact[4] }}</div>
            </td>
            <td>
              <div>{{ contact[5] }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-if="reports == 'Policy info for all Contacts'">
      <table>
        <thead>
          <tr>
            <th>Contact</th>
            <th>Carriers</th>
            <th>Policy Types</th>
            <th>Policy Numbers</th>
            <th>Effective Dates</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(contact, contactIndex) in srtdCntcts" :class="'cell' + (contactIndex % 2)">
            <td class="cellHover" @click="selectContact(contact.id)">{{ Object.values(contact.Members)[0].Name }}</td>
            <td>
              <div v-for="custom1Info in contact.Custom1">
                {{ custom1Info.Carrier }}
              </div>
            </td>
            <td>
              <div v-for="custom1Info in contact.Custom1">
                {{ custom1Info.Policy_Type }}
              </div>
            </td>
            <td>
              <div v-for="custom1Info in contact.Custom1">
                {{ custom1Info.Policy_No }}
              </div>
            </td>
            <td>
              <div v-for="custom1Info in contact.Custom1">
                {{ custom1Info.Date }}
              </div>
            </td>
            <td>{{ contact.Categ }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-if="reports == 'Active policies'">
      <table>
        <thead>
          <tr>
            <th>Contact</th>
            <th>Carriers</th>
            <th>Policy Types</th>
            <th>Policy Numbers</th>
            <th>Effective Dates</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(contact, contactIndex) in srtdCntcts" :class="'cell' + (contactIndex % 2)">
            <td class="cellHover" @click="selectContact(contact.id)">{{ Object.values(contact.Members)[0].Name }}</td>
            <td>
              <div v-for="custom1Info in contact.Custom1">
                {{ custom1Info.Carrier }}
              </div>
            </td>
            <td>
              <div v-for="custom1Info in contact.Custom1">
                {{ custom1Info.Policy_Type }}
              </div>
            </td>
            <td>
              <div v-for="custom1Info in contact.Custom1">
                {{ custom1Info.Policy_No }}
              </div>
            </td>
            <td>
              <div v-for="custom1Info in contact.Custom1">
                {{ custom1Info.Date }}
              </div>
            </td>
            <td>{{ contact.Categ }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-if="reports == 'Renewals'">
      <table>
        <thead>
          <tr>
            <th>Contact</th>
            <th>Carrier</th>
            <th>Policy Type</th>
            <th>Policy Number</th>
            <th>Effective Date</th>
            <th>Premium</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(contact, contactIndex) in srtdCntcts" :class="'taskCell' + (contactIndex % 2) + contact[7]">
            <td class="cellHover" @click="selectContact(contact[0])">{{ contact[1] }}</td>
            <td>
              <div>
                {{ contact[2] }}
              </div>
            </td>
            <td>
              <div>
                {{ contact[3] }}
              </div>
            </td>
            <td>
              <div>
                {{ contact[4] }}
              </div>
            </td>
            <td>
              <div>
                {{ contact[5] }}
              </div>
            </td>
            <td>
              <div>
                {{ contact[6] }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-if="reports.includes('Activity log for')">
      <table>
        <thead>
          <tr>
            <th>Contact</th>
            <th>Category</th>
            <th>Date</th>
            <th>Activity</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(log, logIndex) in srtdCntcts[slctdCntctIndex].Log" :class="'cell' + (logIndex % 2)">
            <td>{{ contacts[slctdCntctIndex].Members[0].Name }}</td>
            <td>{{ contacts[slctdCntctIndex].Categ }}</td>
            <td>{{ log[1] }}</td>
            <td>{{ log[2] }}</td>
            <td>{{ userList[log[0]][0] }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Reports',

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'activeTab',
      'activeWindow',
      'userSettings',
      'reports',
      'times',
      'contacts',
      'patchUserSettings',
      'userList',
      'slctdCntctIndex',
    ]),
    srtdCntcts() {
      let clonedCntcts = this.contacts;
      let newSrtdCntcts = [];
      if (this.reports == 'Policy info for all Contacts') {
        newSrtdCntcts = clonedCntcts
          .filter((cntct) => cntct.Custom1.length > 0)
          .sort((a, b) => a.Members[0].Name.localeCompare(b.Members[0].Name));
      } else if (this.reports == 'Active policies') {
        newSrtdCntcts = clonedCntcts
          .filter((cntct) => cntct.Categ == 'Customer')
          .sort((a, b) => a.Members[0].Name.localeCompare(b.Members[0].Name));
      } else if (this.reports == 'Renewals') {
        const rnwlStart = new Date(this.times.initialUsrTmstmp - 2592000000);
        const rnwlStop = new Date(this.times.initialUsrTmstmp + 3456000000);
        const rnwlDateHalfYearAgo = new Date(this.times.initialUsrTmstmp - 15724800000);
        // prettier-ignore
        const rnwlStartY_m_d = (rnwlStart.getMonth() + 1).toString().padStart(2, '0') + '-' + rnwlStart.getDate().toString().padStart(2, '0');
        // prettier-ignore
        const rnwlStoptY_m_d = (rnwlStop.getMonth() + 1).toString().padStart(2, '0') + '-' + rnwlStop.getDate().toString().padStart(2, '0');
        // prettier-ignore
        const rnwlDateHalfYearAgoY_m_d = rnwlDateHalfYearAgo.getFullYear() + '-' + (rnwlDateHalfYearAgo.getMonth() + 1).toString().padStart(2, '0') + '-' + rnwlDateHalfYearAgo.getDate().toString().padStart(2, '0');
        clonedCntcts.forEach((contact) => {
          if (contact.Categ == 'Customer' && contact.Custom1 && contact.RecurTasks) {
            contact.Custom1.forEach((custom1) => {
              if (
                custom1?.Active == '1' &&
                custom1?.Date?.slice(5, 10) > rnwlStartY_m_d &&
                custom1?.Date?.slice(5, 10) < rnwlStoptY_m_d &&
                custom1?.Date < rnwlDateHalfYearAgoY_m_d
              ) {
                let custom1Review = 0;
                contact.RecurTasks.forEach((RecurTask) => {
                  if (
                    RecurTask?.Desc?.toLowerCase()?.includes(custom1?.Policy_No?.toLowerCase()) &&
                    RecurTask?.Desc?.toLowerCase()?.includes('renew') &&
                    RecurTask?.Review &&
                    RecurTask?.Start
                  ) {
                    let reviewMMDDCurrentYY =
                      new Date(this.times.initialUsrTmstmp).getFullYear() + '-' + RecurTask?.Start?.slice(5, 10);
                    if (RecurTask?.Review >= reviewMMDDCurrentYY) custom1Review = 1;
                  }
                });
                newSrtdCntcts.push([
                  contact?.id,
                  contact?.Members?.[0]?.Name,
                  custom1?.Carrier ? custom1?.Carrier : '',
                  custom1?.Policy_Type ? custom1?.Policy_Type : '',
                  custom1?.Policy_No ? custom1?.Policy_No : '',
                  custom1?.Date ? custom1?.Date : '',
                  custom1?.Premium ? custom1?.Premium : '',
                  custom1Review,
                ]);
              }
            });
          }
        });
        newSrtdCntcts.sort((a, b) => b[5].localeCompare(a[5]));
      } else if (this.reports == 'All contact tasks') {
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
      } else {
        newSrtdCntcts = clonedCntcts.sort((a, b) => a.Members[0].Name.localeCompare(b.Members[0].Name));
      }
      return newSrtdCntcts;
    },
  },
  methods: {
    selectContact(contactID) {
      this.activeWindow = 'calendar';
      this.activeTab = 'house-chimney-user';
      this.userSettings.selectedContactIndex = contactID;
      this.patchUserSettings();
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
  margin: 10px 0px 0px 0px;
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
</style>
