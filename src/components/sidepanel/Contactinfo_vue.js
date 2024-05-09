import Searchbar from './contactinfo/Searchbar_vue.js';
import Members from './contactinfo/Members_vue.js';
import Properties from './contactinfo/Properties_vue.js';
import Assets from './contactinfo/Assets_vue.js';
import Connections from './contactinfo/Connections_vue.js';

export default {
  name: 'Contact Info',

  template: /*html*/ `
    <div class='contact-info'>
      <searchbar></searchbar>
      <br/>
      <members></members>
      <properties></properties>
      <assets></assets>
      <connections></connections>
      <template  v-if="slctdCntct">
        Add: 
        <select @change='addContactInfo'>
          <option selected disabled>contact info</option>
          <option v-for="cntctInfo in addCntctInfoDropDown" :value="cntctInfo.InfoGroup + '_' + cntctInfo.InfoKey" >{{cntctInfo.InfoKey.toLowerCase() + cntctInfo.InfoPlaceholder}}</option>
          <option disabled>new contact</option>
        </select>
      </template>
    </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'accountSettings',
      'userSettings',
      'contacts',
      'slctdCntct',
    ]),
    addCntctInfoDropDown() {
      const cntctInfoDropDown = [];
      Object.entries(this.accountSettings.contactInfo.keys).forEach(
        ([contactInfoGroup, contactInfoKeys]) => {
          Object.keys(contactInfoKeys).forEach((contactInfoKey) => {
            const test = {
              InfoGroup: contactInfoGroup,
              InfoKey: contactInfoKey,
              InfoPlaceholder:
                contactInfoGroup == 'Properties' ? ' address' : '',
            };
            cntctInfoDropDown.push(test);
          });
        }
      );
      return cntctInfoDropDown;
    },
  },

  components: {
    Searchbar,
    Members,
    Properties,
    Assets,
    Connections,
  },

  //   props: [''],

  //   emits: [''],

  // data() {
  //   return {};
  // },

  methods: {
    addContactInfo(event) {
      const InfoGroup = event.target.value.split('_')[0];
      const InfoKey = event.target.value.split('_')[1];
      const InfoValue =
        InfoGroup == 'Members' || InfoGroup == 'Properties' ? {} : '';
      const newValue = {
        [InfoKey]: InfoValue,
      };
      this.contacts[this.userSettings.selectedContactIndex][InfoGroup].push(
        newValue
      );
      event.srcElement.selectedIndex = 0;
    },
  },

  mounted() {
    style(
      'Contact-Info',
      /*css*/ `
.contact-info {
  /* text-align: center; */
  font-family: 'Helvetica', sans-serif;
}
.contact-info select {
  padding: 5px;
}
/*.contact-info input[type='text'] {
  background: white;
  padding: 6px;
  border: 0px;
}
.contact-info input[type='text']:focus {
  outline: none;
}
.contact-info input[type='date'] {
  border-width: 0px;
  font-family: 'Helvetica', sans-serif;
  padding: 6px
  }
.contact-info input[type='date']:focus {
  outline: none;
} 
.contact-info-group {
  position: relative;
}
.contact-info-group i {
  position: absolute;
  top: 6px;
  left: 6px;
  color: grey;
  z-index: 1;
}
.contact-info-group input[type='text'] {
  padding-left: 30px;
}*/
`
    );
  },
};
