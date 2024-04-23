// import example from './components/example_vue.js';

export default {
  name: 'Contact Info',
  //<input type="text" v-model="contacts[userSettings.selectedContactIndex].Members[0].First_Name"/>

  template: /*html*/ `
    <div class='contact-info'>
        <input type="search" placeholder="Search for customer" />
        <br/>
        <br/>
        <div>{{ contacts[userSettings.selectedContactIndex]?.Members[0].First_Name }}</div>
        <br/>
          <div v-for="(member, memberIndex) in contacts[userSettings.selectedContactIndex].Members">
            <input 
              type="text" 
              v-if="contacts[userSettings.selectedContactIndex].Members[memberIndex].First_Name"
              v-model="contacts[userSettings.selectedContactIndex].Members[memberIndex].First_Name" 
              @change="patchMember($event, 'Members', memberIndex, 'First_Name' )" />
            <input 
              type="text" 
              v-else />
            <input 
              type="text" 
              v-if="contacts[userSettings.selectedContactIndex].Members[memberIndex].Last_Name" 
              v-model="contacts[userSettings.selectedContactIndex].Members[memberIndex].Last_Name" 
              @change="patchMember($event, 'Members', memberIndex, 'Last_Name' )" />
            <input 
              type="text" 
              v-else />
            <input 
              type="date" 
              v-if="contacts[userSettings.selectedContactIndex].Members[memberIndex].DoB" 
              v-model="contacts[userSettings.selectedContactIndex].Members[memberIndex].DoB" 
              @change="patchMember($event, 'Members', memberIndex, 'DoB' )" />
            <input 
              type="date" 
              v-else />
          </div>

        


         
    </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'accessToken',
      'msg',
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
  },

  mounted() {
    style(
      'Contact-Info',
      /*css*/ `
.contact-info{}
.contact-info input[type='search'] {
    width: 100%;
    padding: 10px 5px 10px 45px;
    /* margin-bottom: 10px; */
    }
`
    );
  },
};
