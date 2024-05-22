// import example from './components/example_vue.js';

export default {
  name: 'Reports',

  template: /*html*/ `
      <div class='reports'>
        <template v-if="reports == 'All contacts'">
            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Members</th>
                        <th>Properties</th>
                        <th>Assets</th>
                        <th>Connections</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="contact, contactIndex in contacts" :class="'cell' + contactIndex % 2">
                        <td class="cellHover" @click="selectContact(contactIndex)">{{contact.id}}</td>
                        <td><div v-for="contactInfo in contact.Members">{{contactInfo.First}} {{contactInfo.Name}}</div></td>
                        <td>{{Object.values(contact.Properties)?.[0]?.Address_1}}</td>
                        <td>{{Object.values(contact.Assets)[0] ? Object.values(Object.values(contact.Assets)[0])[0] : ''}}</td>
                        <td>{{Object.values(contact.Connections)[0] ? Object.values(Object.values(contact.Connections)[0])[0] : ''}}</td>
                    </tr>
                </tbody>
            </table>
        </template>
        <template v-if="reports == 'Contacts with minimum information'">
          <table>
              <thead>
                  <tr>
                      <th>id</th>
                      <th>Members</th>
                      <th>Properties</th>
                      <th>Assets</th>
                      <th>Connections</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="contact, contactIndex in contacts" :class="'cell' + contactIndex % 2">
                      <td class="cellHover" @click="selectContact(contactIndex)">{{contact.id}}</td>
                      <td>{{Object.values(contact.Members)[0].Name}}</td>
                      <td>{{Object.values(contact.Properties)?.[0]?.Address_1}}</td>
                      <td>{{Object.values(contact.Assets)[0] ? Object.values(Object.values(contact.Assets)[0])[0] : ''}}</td>
                      <td>{{Object.values(contact.Connections)[0] ? Object.values(Object.values(contact.Connections)[0])[0] : ''}}</td>
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
