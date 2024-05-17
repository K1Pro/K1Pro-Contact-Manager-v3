// import example from './components/example_vue.js';

export default {
  name: 'Connections',

  template: /*html*/ `
        <div class='connections'>
            <div v-for="(conn, connIndex) in slctdCntct?.Connections">
                <div v-for="(connInfo, connType) in conn">
                    <div v-for="connInputs in accountSettings.contactInfo.keys.Connections[connType]">
                        <button class="conn-icon" @click="connect(connIndex, connType)" >
                          <i :class="connInputs.icon"></i>
                        </button>
                        <input 
                            :type="connInputs.type" 
                            :placeholder="connInputs.placeholder"
                            :value="connInfo"
                            @change="updateConnection($event, connIndex, connType)" />
                        <button class="conn-delete-icon" @click="deleteContactInfo('Connections', connIndex)"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
                <template v-if="connIndex === slctdCntct.Connections.length - 1">
                    <input type="checkbox" :checked="slctdCntct.DNC == 1" /> Do not contact
                    <hr>
                </template>
            </div>
        </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'activeTab',
      'accountSettings',
      'userSettings',
      'contacts',
      'patchContactInfo',
      'deleteContactInfo',
      'slctdCntct',
    ]),
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
    connect(connIndex, connType) {
      let checkDNC = true;
      if (this.slctdCntct.DNC == 1) {
        checkDNC = confirm('Contact is listed as "Do not contact", proceed?')
          ? true
          : false;
      }
      if (checkDNC) {
        if (connType == 'Phone') {
          window.location.href =
            'tel:' + this.slctdCntct.Connections[connIndex][connType];
        }
        if (connType == 'Email') {
          this.activeTab = 'envelope';
        }
      }
    },
    updateConnection(event, columnIndex, key) {
      const column = 'Connections';
      // prettier-ignore
      this.contacts[this.userSettings.selectedContactIndex][column][columnIndex][key] = event.target.value;
      this.patchContactInfo(event.target.value, column, columnIndex, key);
    },
  },

  mounted() {
    style(
      'connections',
      /*css*/ `
.connections{

}
.conn-icon{
  padding: 6px;
  width: 32px;
}
.conn-delete-icon{
  padding: 6px;
  width: 32px;
  background-color: transparent;
  border: 0px;
  cursor: pointer;
}
.connections input[type='text']{
  width: calc(100% - 64px);
  padding: 6px;
}
.connections input[type='text']:focus {
  outline: none;
}
.connections input[type='checkbox']{
  margin: 0px;
  margin-top: 5px;
  margin-right: 5px;
  width: 32px;
}
`
    );
  },
};
