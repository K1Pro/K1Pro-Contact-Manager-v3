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
      <br/>
      <select v-if="slctdCntct">
      <option disabled selected>Add contact info</option>
        <option v-for="cntctInfo in addCntctInfoDropDown">Add {{cntctInfo.toLowerCase()}}</option>
        <option>Add new contact</option>
      </select>
    </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'accountSettings',
      'slctdCntct',
    ]),
    addCntctInfoDropDown() {
      const cntctInfoDropDown = [];
      Object.values(this.accountSettings.contactInfo.keys).forEach(
        (contactInfoKeys) => {
          Object.keys(contactInfoKeys).forEach((contactInfoKey) => {
            cntctInfoDropDown.push(contactInfoKey);
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

  // methods: {},

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
