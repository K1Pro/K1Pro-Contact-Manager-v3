// import example from './components/example_vue.js';

export default {
  name: 'Reports',

  template: /*html*/ `
      <div class='reports'>
        <template v-if="reports == 'All contacts'">
            <table class="table table-striped">
                <thead>
                    <tr id="contactListHeaders">
                        <th>id</th>
                        <th>Members</th>
                        <th>Properties</th>
                        <th>Assets</th>
                        <th>Connections</th>
                    </tr>
                </thead>
                <tbody id="contactList">
                    <tr v-for="contact in contacts">
                        <td>{{contact.id}}</td>
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
    ...Pinia.mapWritableState(useDefaultStore, ['msg', 'reports', 'contacts']),
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

  methods: {},

  mounted() {
    style(
      'reports',
      /*css*/ `
  .reports{
    background-color: white;
    width: calc(100% - 10px);
    height: calc(100vh - 20px);
    margin: 10px 0px 0px 0px;
    font-size: 12px;
    padding: 10px;
    overflow: hidden scroll;
  }
  `
    );
  },
};
