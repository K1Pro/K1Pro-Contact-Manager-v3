import Searchbar from './contactinfo/Searchbar_vue.js';
import Members from './contactinfo/Members_vue.js';
import Properties from './contactinfo/Properties_vue.js';
import Assets from './contactinfo/Assets_vue.js';
import Connections from './contactinfo/Connections_vue.js';
import Credentials from './contactinfo/Credentials_vue.js';

export default {
  name: 'Contact Info',

  template: /*html*/ `
    <div class='contact-info'>
      <searchbar></searchbar>
      <members></members>
      <properties></properties>
      <assets></assets>
      <connections></connections>
      <credentials></credentials>
      <template  v-if="slctdCntct">
        <div style="text-align: right; font-size: 14px">Owner: 
          <select style="margin-right: 5px; width: calc(100% - 85px); border: none; background-color:transparent" v-model="contacts[userSettings.selectedContactIndex].Assigned" @change="patchContactInfo($event.target.value, 'Assigned')">
            <option v-for="([userNo, userInfo], userIndex) in Object.entries(userList)" :value="userNo">{{userInfo[0]}}</option>
            <option disabled>Updated by {{userList[Object.keys(contacts[userSettings.selectedContactIndex].Updated)][0]}} on {{Object.values(contacts[userSettings.selectedContactIndex].Updated)[0].slice(5,10).replace('-', '/')}}/{{Object.values(contacts[userSettings.selectedContactIndex].Updated)[0].slice(0,4)}} {{Object.values(contacts[userSettings.selectedContactIndex].Updated)[0].slice(11,16)}}</option>
            <option disabled>Created by {{userList[Object.keys(contacts[userSettings.selectedContactIndex].Created)][0]}} on {{Object.values(contacts[userSettings.selectedContactIndex].Created)[0].slice(5,10).replace('-', '/')}}/{{Object.values(contacts[userSettings.selectedContactIndex].Created)[0].slice(0,4)}} {{Object.values(contacts[userSettings.selectedContactIndex].Created)[0].slice(11,16)}}</option>
          </select>
        </div>
        <div style="text-align: right; font-size: 14px">Category: 
          <select style="margin-right: 5px; width: calc(100% - 85px); border: none; background-color:transparent" v-model="contacts[userSettings.selectedContactIndex].Categ" @change="patchContactInfo($event.target.value, 'Categ')">
            <option v-for="category in accountSettings.Categ">{{ category }}</option>
          </select>
        </div>
      </template>
    </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'accountSettings',
      'userSettings',
      'contacts',
      'patchContactInfo',
      'slctdCntct',
      'userList',
    ]),
  },

  components: {
    Searchbar,
    Members,
    Properties,
    Assets,
    Connections,
    Credentials,
  },

  //   props: [''],

  //   emits: [''],

  // data() {
  //   return {};
  // },

  methods: {},

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
