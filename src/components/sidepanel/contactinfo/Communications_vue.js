// import example from './components/example_vue.js';

export default {
  name: 'Communications',

  template: /*html*/ `
        <div class='communications'>
            <div v-for="(comm, commIndex) in contacts[userSettings.selectedContactIndex]?.Communications">
                <div v-for="(commInfo, commType) in comm">
                    <div v-for="commInputs in accountSettings.contactInfo.keys.Communications[commType]">
                        <button><i :class="commInputs.icon"></i></button>
                        <input 
                            :placeholder="commInputs.placeholder"
                            :type="commInputs.type" 
                            v-model="contacts[userSettings.selectedContactIndex].Communications[commIndex][commType]" />
                        <button><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
                <template v-if="commIndex === contacts[userSettings.selectedContactIndex]?.Communications.length - 1">
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
.communications{}
.communications button{
  padding: 6px;
  width: 32px;
}
.communications input[type='text']{
  width: calc(100% - 64px);
  padding: 6px;
}
.communications input[type='text']:focus {
  outline: none;
}
`
    );
  },
};
