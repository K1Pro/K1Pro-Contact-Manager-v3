// import example from './components/example_vue.js';

export default {
  name: 'Members',

  template: /*html*/ `
        <div class='members'>
            <div v-for="(member, memberIndex) in contacts[userSettings.selectedContactIndex]?.Members">
                <div>{{ Object.keys(member)[0] }}</div>
                <div class="member-grid-container" v-for="(memberInfo, memberType) in member">
                  <div class="member-grid-item" v-for="memberInputs in accountSettings.contactInfo.keys.Members[memberType]">
                      <input 
                          :type="memberInputs.type" 
                          :placeholder="memberInputs.placeholder"
                          v-model="contacts[userSettings.selectedContactIndex].Members[memberIndex][memberType][memberInputs.value]" />
                  </div>
                </div>
                <template v-if="memberIndex === contacts[userSettings.selectedContactIndex]?.Members.length - 1">
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
    async patchMember(event, column, columnIndex, property) {
      console.log(this.userSettings.selectedContactIndex + 1);
      console.log(column);
      console.log(columnIndex);
      console.log(property);
      console.log(event.target.value);
      try {
        const response = await fetch(servr_url + this.endPts.contacts, {
          method: 'PATCH',
          headers: {
            Authorization: this.accessToken,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            ID: this.userSettings.selectedContactIndex + 1,
            Column: column,
            ColumnIndex: columnIndex,
            Property: property,
            Value: event.target.value,
          }),
        });
        const patchMemberResJSON = await response.json();
        if (patchMemberResJSON.success) {
          console.log(patchMemberResJSON);
        }
      } catch (error) {
        this.msg.snackBar = error.toString();
      }
    },
    async patchProperty(event, column, columnIndex, property) {},
  },

  mounted() {
    style(
      'members',
      /*css*/ `
.members{}
.member-grid-container {
  display: grid;
  grid-template-columns: 33% 33% 33%;
}
.member-grid-item {

}
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
