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
            <input type="text" v-model="contacts[userSettings.selectedContactIndex].Members[0].First_Name"/>
          </div>

        


         
    </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'contacts',
      'userSettings',
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
