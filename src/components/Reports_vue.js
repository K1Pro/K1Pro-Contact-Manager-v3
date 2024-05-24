// import example from './components/example_vue.js';

export default {
  name: 'Reports',

  template: /*html*/ `
      <div class='reports'>
        <template v-if="reports == 'Contacts with expanded info'">
            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Contact</th>
                        <th>Address</th>
                        <th>Assets</th>
                        <th>Connections</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="contact, contactIndex in contacts" :class="'cell' + contactIndex % 2">
                        <td class="cellHover" @click="selectContact(contactIndex)">{{contact.id}}</td>
                        <td><div v-for="contactInfo in contact.Members">{{contactInfo.First}} {{contactInfo.Name}}</div></td>
                        <td>
                          <template v-for="contactInfo in contact.Properties">
                            <div>{{contactInfo.Address_1}} {{contactInfo.Address_2}}</div>
                            <div>{{contactInfo.City}} {{contactInfo.State}} {{contactInfo.Zip}}</div>
                          </template>
                        </td>
                        <td>
                          <template v-for="contactInfo in contact.Assets">
                            <div v-for="infoItem in contactInfo">
                              {{infoItem}}
                            </div>
                          </template>
                        </td>
                        <td>
                          <template v-for="contactInfo in contact.Connections">
                            <div v-for="infoItem in contactInfo">
                              {{infoItem}}
                            </div>
                          </template>
                        </td>
                        <td>
                          <div>
                            {{contact.Categ}}
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
                      <th>id</th>
                      <th>Contact</th>
                      <th>Address</th>
                      <th>Assets</th>
                      <th>Connections</th>
                      <th>Category</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="contact, contactIndex in contacts" :class="'cell' + contactIndex % 2">
                      <td class="cellHover" @click="selectContact(contactIndex)">{{contact.id}}</td>
                      <td>{{Object.values(contact.Members)[0].Name}}</td>
                      <td>{{Object.values(contact.Properties)?.[0]?.Address_1}}</td>
                      <td>{{Object.values(contact.Assets)[0] ? Object.values(Object.values(contact.Assets)[0])[0] : ''}}</td>
                      <td>{{Object.values(contact.Connections)[0] ? Object.values(Object.values(contact.Connections)[0])[0] : ''}}</td>
                      <td>{{contact.Categ}}</td>
                  </tr>
              </tbody>
          </table>
        </template>
        <template v-if="reports == 'Contacts Policy info'">
          <table>
              <thead>
                  <tr>
                    <th>id</th>
                    <th>Contact</th>
                    <th>Carriers</th>
                    <th>Policy Types</th>
                    <th>Policy Numbers</th>
                    <th>Effective Dates</th>
                    <th>Category</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="contact, contactIndex in contacts" :class="'cell' + contactIndex % 2">
                      <td class="cellHover" @click="selectContact(contactIndex)">{{contact.id}}</td>
                      <td>{{Object.values(contact.Members)[0].Name}}</td>
                      <td>
                        <div v-for="custom1Info in contact.Custom1">
                          {{custom1Info.Carrier}}
                        </div>
                      </td>
                      <td>
                        <div v-for="custom1Info in contact.Custom1">
                          {{custom1Info.Policy_Type}}
                        </div>
                      </td>
                      <td>
                        <div v-for="custom1Info in contact.Custom1">
                          {{custom1Info.Policy_No}}
                        </div>
                      </td>
                      <td>
                        <div v-for="custom1Info in contact.Custom1">
                          {{custom1Info.Date}}
                        </div>
                      </td>
                      <td>{{contact.Categ}}</td>
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
                  <tr v-for="log, logIndex in slctdCntct.Log" :class="'cell' + logIndex % 2">
                    <td>{{slctdCntct.Members[0].Name}}</td>
                    <td>{{slctdCntct.Categ}}</td>
                    <td>{{log[1]}}</td>
                    <td>{{log[2]}}</td>
                    <td>{{userList[log[0]][0]}}</td>
                  </tr>
              </tbody>
          </table>
        </template>
      </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'activeTab',
      'activeWindow',
      'userSettings',
      'reports',
      'contacts',
      'userList',
      'slctdCntct',
    ]),
    reportType() {},
  },

  //   components: {
  //     example,
  //   },

  //   props: [''],

  //   emits: [''],

  //   data() {
  //     return {};
  //   },

  methods: {
    selectContact(contactIndex) {
      this.activeWindow = 'calendar';
      this.activeTab = 'house-chimney-user';
      this.userSettings.selectedContactIndex = contactIndex;
      this.patchUserSettings();
    },
  },

  mounted() {
    style(
      'reports',
      /*css*/ `
  .reports{
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
    width: 100%
  }
  .reports th{
    position: sticky;
    top: 0;
    background-color: #6c757d;
    padding: 5px;
    margin: 0px;
    color: white;
  }
  .reports td{
    padding: 5px;
  }
  .cell0 {
    background-color: white;
  }
  .cell1 {
    background-color: lightgray;
  }
  .cellHover{
    cursor: pointer
  }
  `
    );
  },
};
