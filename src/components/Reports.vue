<template>
  <div class="reports">
    <template v-if="reports == 'Contacts with expanded info'">
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
    <template v-if="reports == 'Contacts with minimum info'">
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
    <template v-if="reports == 'Policy info for Contacts with active policies'">
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
      'contacts',
      'patchUserSettings',
      'userList',
      'slctdCntctIndex',
    ]),
    srtdCntcts() {
      let clonedCntcts = this.contacts;
      let newSrtdCntcts;
      if (this.reports == 'Policy info for all Contacts') {
        newSrtdCntcts = clonedCntcts
          .filter((cntct) => cntct.Custom1.length > 0)
          .sort((a, b) => a.Members[0].Name.localeCompare(b.Members[0].Name));
      } else if (this.reports == 'Policy info for Contacts with active policies') {
        newSrtdCntcts = clonedCntcts
          .filter((cntct) => cntct.Categ == 'Customer')
          .sort((a, b) => a.Members[0].Name.localeCompare(b.Members[0].Name));
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
.cellHover {
  cursor: pointer;
}
</style>
