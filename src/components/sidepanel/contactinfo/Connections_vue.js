// import example from './components/example_vue.js';

export default {
  name: 'Connections',

  template: /*html*/ `
        <div class='connections'>
            <div v-for="(conn, connIndex) in slctdCntct?.Connections">
                <div v-for="(connInfo, connType) in conn">
                    <div v-for="connInputs in accountSettings.contactInfo.keys.Connections[connType]">
                        <button class="conn-icon"><i :class="connInputs.icon"></i></button>
                        <input 
                            :placeholder="connInputs.placeholder"
                            :type="connInputs.type" 
                            v-model="contacts[userSettings.selectedContactIndex].Connections[connIndex][connType]" 
                            @change="patchConn($event, connIndex, connType, null)" />
                        <button class="conn-delete-icon" @click="deleteConn(connIndex)"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
                <template v-if="connIndex === slctdCntct.Connections.length - 1">
                    <hr>
                </template>
            </div>
        </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'accessToken',
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

  methods: {
    async patchConn(event, columnIndex, key, property) {
      try {
        const response = await fetch(servr_url + this.endPts.contactinfo, {
          method: 'PATCH',
          headers: {
            Authorization: this.accessToken,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            ID: this.contacts[this.userSettings.selectedContactIndex].id,
            Column: 'Connections',
            ColumnIndex: columnIndex,
            Key: key,
            Property: property,
            Value: event.target.value,
          }),
        });
        const patchConnResJSON = await response.json();
        if (patchConnResJSON.success) {
          console.log(patchConnResJSON);
        }
      } catch (error) {
        this.msg.snackBar = error.toString();
      }
    },
    deleteConn(connIndex) {
      this.contacts[this.userSettings.selectedContactIndex].Connections.splice(
        connIndex,
        1
      );
    },
  },

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
  cursor: pointer;
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
