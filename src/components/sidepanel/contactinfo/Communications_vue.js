// import example from './components/example_vue.js';

export default {
  name: 'Communications',

  template: /*html*/ `
        <div class='communications'>
            <div v-for="(comm, commIndex) in slctdCntct?.Communications">
                <div v-for="(commInfo, commType) in comm">
                    <div v-for="commInputs in accountSettings.contactInfo.keys.Communications[commType]">
                        <button class="comm-icon" ><i :class="commInputs.icon"></i></button>
                        <input 
                            :placeholder="commInputs.placeholder"
                            :type="commInputs.type" 
                            v-model="contacts[userSettings.selectedContactIndex].Communications[commIndex][commType]" />
                        <button class="comm-delete-icon" ><i class="fa-solid fa-x"></i></button>
                    </div>
                </div>
                <template v-if="commIndex === slctdCntct.Communications.length - 1">
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
      'communications',
      /*css*/ `
.communications{}
.comm-icon{
  padding: 6px;
  width: 32px;
}
.comm-delete-icon{
  padding: 6px;
  width: 32px;
  background-color: transparent;
  border: 0px;
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
