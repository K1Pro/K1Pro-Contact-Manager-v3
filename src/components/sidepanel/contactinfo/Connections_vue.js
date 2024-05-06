// import example from './components/example_vue.js';

export default {
  name: 'Connections',

  template: /*html*/ `
        <div class='connections'>
            <div v-for="(conn, connIndex) in slctdCntct?.Connections">
                <div v-for="(connInfo, connType) in conn">
                    <div v-for="connInputs in accountSettings.contactInfo.keys.Connections[connType]">
                        <button class="conn-icon" ><i :class="connInputs.icon"></i></button>
                        <input 
                            :placeholder="connInputs.placeholder"
                            :type="connInputs.type" 
                            v-model="contacts[userSettings.selectedContactIndex].Connections[connIndex][connType]" />
                        <button class="conn-delete-icon" ><i class="fa-solid fa-x"></i></button>
                    </div>
                </div>
                <template v-if="connIndex === slctdCntct.Connections.length - 1">
                    <hr>
                </template>
            </div>
        </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'accountSettings',
      'userSettings',
      'endPts',
      'contacts',
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

  //   methods: {},

  mounted() {
    style(
      'connections',
      /*css*/ `
.connections{}
.conn-icon{
  padding: 6px;
  width: 32px;
}
.conn-delete-icon{
  padding: 6px;
  width: 32px;
  background-color: transparent;
  border: 0px;
}
.connections input[type='text']{
  width: calc(100% - 64px);
  padding: 6px;
}
.connections input[type='text']:focus {
  outline: none;
}
`
    );
  },
};
