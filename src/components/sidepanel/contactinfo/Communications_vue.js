// import example from './components/example_vue.js';

export default {
  name: 'Communications',

  template: /*html*/ `
        <div class='communications'>
            <div v-for="(comm, commIndex) in contacts[userSettings.selectedContactIndex]?.Communications">
                <div v-for="(commInfo, commType) in comm">
                    <div v-for="commInputs in accountSettings.contactInfo.keys.Communications[commType]">
                        <input 
                            :placeholder="commInfo[commInputs.placeholder]"
                            :type="commInputs.type" 
                            v-model="contacts[userSettings.selectedContactIndex].Communications[commIndex][commType]" />
                    </div>
                </div>
                <template v-if="commIndex === contacts[userSettings.selectedContactIndex]?.Communications.length - 1">
                    <br />
                    <button>Add connection</button>
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
      'communications',
      /*css*/ `
.communications{}`
    );
  },
};
