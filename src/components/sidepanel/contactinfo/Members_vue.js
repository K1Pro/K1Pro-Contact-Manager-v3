// import example from './components/example_vue.js';

export default {
  name: 'Members',

  template: /*html*/ `
        <div class='members'>
            <div v-for="(member, memberIndex) in slctdCntct?.Members">
                <div class="member-title-grid-container">
                  <div class="member-title"><i class="fa-solid fa-user">&nbsp;</i>{{ Object.keys(member)[0] }}</div>
                  <div><button v-if="memberIndex !== 0" class="member-button" @click="deleteMember(memberIndex)"><i class="fa-solid fa-trash"></i></button></div>
                </div>
                <div class="member-grid-container" v-for="(memberInfo, memberType) in member">
                  <div class="member-grid-item" v-for="memberInputs in accountSettings.contactInfo.keys.Members[memberType]">
                      <input 
                          :type="memberInputs.type" 
                          :placeholder="memberInputs.placeholder"
                          :value="memberInfo[memberInputs.value]"
                          @change="patchContact($event, 'Members', memberIndex, Object.keys(member)[0], memberInputs.value)" />
                  </div>
                </div>
                <template v-if="memberIndex === slctdCntct.Members.length - 1">
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
      'patchContact',
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
    deleteMember(memberIndex) {
      this.contacts[this.userSettings.selectedContactIndex].Members.splice(
        memberIndex,
        1
      );
    },
  },

  mounted() {
    style(
      'members',
      /*css*/ `
.members{}
.member-title-grid-container {
  display: grid;
  grid-template-columns: calc(100% - 34px) 34px;
}
.member-title {
  padding: 7px 0px 7px 0px;
}
.member-button{
  padding: 7px 0px 7px 0px;
  width: 32px;
  background-color: transparent;
  border: 0px;
  cursor: pointer;
}
.member-grid-container {
  display: grid;
  grid-template-columns: 33% 33% 33%;
}
.member-grid-item {}
.member-grid-item input[type='text'] {
  border-top: 1px;
  border-right: 0px;
  border-bottom: 1px;
  border-left: 0px;
  padding: 6px;
  width: 100%
}
.member-grid-item input[type='date'] {
  font-family: 'Helvetica', sans-serif;
  border-top: 1px;
  border-right: 0px;
  border-bottom: 1px;
  border-left: 0px;
  padding: 5px;
  width: 100%
}
`
    );
  },
};
