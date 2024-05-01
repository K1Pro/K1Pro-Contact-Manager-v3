import Searchbar from './contactinfo/Searchbar_vue.js';
import Members from './contactinfo/Members_vue.js';
import Properties from './contactinfo/Properties_vue.js';
import Assets from './contactinfo/Assets_vue.js';
import Communications from './contactinfo/Communications_vue.js';

export default {
  name: 'Contact Info',

  template: /*html*/ `
    <div class='contact-info'>
      <searchbar></searchbar>
      <br/>
      <members></members>
      <properties></properties>
      <assets></assets>
      <communications></communications>
      <br/>
    </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'accountSettings',
      'userSettings',
      'endPts',
      'contacts',
      'membersSlctdCntctArr',
    ]),
  },

  components: {
    Searchbar,
    Members,
    Properties,
    Assets,
    Communications,
  },

  //   props: [''],

  //   emits: [''],

  // data() {
  //   return {};
  // },

  // methods: {},

  mounted() {
    // console.log(this.accountSettings.contactInfo.keys);
    style(
      'Contact-Info',
      /*css*/ `
.contact-info {
  text-align: center;
  font-family: 'Helvetica', sans-serif;
}
.contact-info input[type='text'] {
  background: white;
  width: 100%;
  padding: 6px;
  border: 0px;
}
.contact-info input[type='text']:focus {
  outline: none;
}
.contact-info input[type='date'] {
  width: 100%;
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
}
`
    );
  },
};
