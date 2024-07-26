<template>
  <template v-if="reports == 'All policies'">
    <table>
      <thead>
        <tr>
          <th>#</th>
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
          <td class="cellHover" @click="selectContact(contact.id)">{{ contactIndex + 1 }}</td>
          <td>{{ Object.values(contact.Members)[0]?.Name }}</td>
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
              {{ usaDateFrmt(custom1Info.Date) }}
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
          <th>#</th>
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
          <td class="cellHover" @click="selectContact(contact.id)">{{ contactIndex + 1 }}</td>
          <td>{{ Object.values(contact.Members)[0]?.Name }}</td>
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
              {{ usaDateFrmt(custom1Info.Date) }}
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
          <th>#</th>
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
          <td class="cellHover" @click="selectContact(contact[0])">{{ contactIndex + 1 }}</td>
          <td>{{ contact[1] }}</td>
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
              {{ usaDateFrmt(contact[5]) }}
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
  <template v-if="reports == 'New business'">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Contact</th>
          <th>Carrier</th>
          <th>Policy Type</th>
          <th>Policy Number</th>
          <th>Effective Date</th>
          <th>Premium</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(contact, contactIndex) in srtdCntcts" :class="'cell' + (contactIndex % 2)">
          <td class="cellHover" @click="selectContact(contact[0])">{{ srtdCntcts.length - contactIndex }}</td>
          <td>{{ contact[1] }}</td>
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
              {{ usaDateFrmt(contact[5]) }}
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
  <template v-if="reports == 'Erie leads'">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Contact</th>
          <th>Address</th>
          <th>Assets</th>
          <th>Connections</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(contact, contactIndex) in srtdCntcts" :class="'cell' + (contactIndex % 2)">
          <td class="cellHover" @click="selectContact(contact.id)">{{ srtdCntcts.length - contactIndex }}</td>
          <td>{{ Object.values(contact.Members)[0]?.Name }}</td>
          <td>{{ Object.values(contact.Addresses)?.[0]?.Address_1 }}</td>
          <td>
            {{ Object.values(contact.Assets)[0] ? Object.values(Object.values(contact.Assets)[0])[0] : '' }}
          </td>
          <td>
            {{ Object.values(contact.Connections)[0] ? Object.values(Object.values(contact.Connections)[0])[0] : '' }}
          </td>
          <td>
            {{ Object.values(contact.Created)[0] ? Object.values(contact.Created)[0].replace('T', ' ') : '' }}
          </td>
        </tr>
      </tbody>
    </table>
  </template>
</template>

<script>
export default {
  name: 'Bundle Insurance Custom reports',

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
      if (this.reports == 'All policies') {
        newSrtdCntcts = clonedCntcts
          .filter((cntct) => cntct.Custom1.length > 0)
          .sort((a, b) => a.Members[0]?.Name?.localeCompare(b.Members[0]?.Name));
      } else if (this.reports == 'Active policies') {
        newSrtdCntcts = clonedCntcts
          .filter((cntct) => cntct.Categ == 'Customer')
          .sort((a, b) => a.Members[0]?.Name?.localeCompare(b.Members[0]?.Name));
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
                (custom1?.Date?.slice(5, 10) > rnwlStartY_m_d || custom1?.Date2?.slice(5, 10) > rnwlStartY_m_d) &&
                (custom1?.Date?.slice(5, 10) < rnwlStoptY_m_d || custom1?.Date2?.slice(5, 10) < rnwlStoptY_m_d) &&
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
                  custom1?.Date?.slice(5, 10) > rnwlStartY_m_d && custom1?.Date?.slice(5, 10) < rnwlStoptY_m_d
                    ? custom1?.Date
                    : custom1?.Date2,
                  custom1?.Premium ? custom1?.Premium : '',
                  custom1Review,
                ]);
              }
            });
          }
        });
        newSrtdCntcts.sort((a, b) => b[5].localeCompare(a[5]));
      } else if (this.reports == 'New business') {
        clonedCntcts.forEach((contact) => {
          if (contact.Categ == 'Customer') {
            contact.Custom1.forEach((custom1) => {
              if (custom1?.Active == '1')
                newSrtdCntcts.push([
                  contact?.id,
                  contact?.Members?.[0]?.Name,
                  custom1?.Carrier ? custom1?.Carrier : '',
                  custom1?.Policy_Type ? custom1?.Policy_Type : '',
                  custom1?.Policy_No ? custom1?.Policy_No : '',
                  custom1?.Date ? custom1?.Date : '',
                  custom1?.Premium ? custom1?.Premium : '',
                ]);
            });
          }
        });
        newSrtdCntcts.sort((a, b) => b[5].localeCompare(a[5]));
      } else if (this.reports == 'Erie leads') {
        newSrtdCntcts = clonedCntcts
          .filter((cntct) => cntct.Categ == 'Erie lead')
          .sort((a, b) => Object.values(b.Created)[0].localeCompare(Object.values(a.Created)[0]));
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
      if (this.windowWidth < 768) {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      }
    },
  },
};
</script>

<style></style>
