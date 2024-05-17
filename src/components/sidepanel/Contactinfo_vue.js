import Searchbar from './contactinfo/Searchbar_vue.js';
import Members from './contactinfo/Members_vue.js';
import Properties from './contactinfo/Properties_vue.js';
import Assets from './contactinfo/Assets_vue.js';
import Connections from './contactinfo/Connections_vue.js';

export default {
  name: 'Contact Info',
  // <option disabled>Created by: {{userList[task.Create][0]}}</option>
  // <option disabled>Last updated by: {{userList[Object.keys(contacts[userSettings.selectedContactIndex].Created)]}}</option>
  template: /*html*/ `
    <div class='contact-info'>
      <searchbar></searchbar>
      <members></members>
      <properties></properties>
      <assets></assets>
      <connections></connections>
      <template  v-if="slctdCntct">
        <div style="text-align: right">Add: 
          <select @change='addContactInfo' style="width: calc(100% - 80px)">
            <option selected disabled>contact info</option>
            <option v-for="cntctInfo in addCntctInfoDropDown" :value="cntctInfo.InfoGroup + '_' + cntctInfo.InfoKey" >{{cntctInfo.InfoKey.toLowerCase() + cntctInfo.InfoPlaceholder}}</option>
            <option value="newContact">new contact</option>
            <option value="deleteContact">delete contact</option>
          </select>
        </div>
        <div style="text-align: right">Owner: 
          <select style="width: calc(100% - 80px)" v-model="contacts[userSettings.selectedContactIndex].Assigned" @change="patchContactInfo($event.target.value, 'Assigned')">
            <option v-for="([userNo, userInfo], userIndex) in Object.entries(userList)" :value="userNo">{{userInfo[0]}}</option>
            <option disabled>Last updated by: {{userList[Object.keys(contacts[userSettings.selectedContactIndex].Updated)][0]}} on {{Object.values(contacts[userSettings.selectedContactIndex].Updated)[0].replace('T', ' ')}}</option>
            <option disabled>Created by: {{userList[Object.keys(contacts[userSettings.selectedContactIndex].Created)][0]}} on {{Object.values(contacts[userSettings.selectedContactIndex].Created)[0]}}</option>
          </select>
        </div>
        <div style="text-align: right">Category: 
          <select style="width: calc(100% - 80px)" v-model="contacts[userSettings.selectedContactIndex].Categ" @change="patchContactInfo($event.target.value, 'Categ')">
            <option v-for="category in accountSettings.Categ">{{ category }}</option>
          </select>
        </div>
      </template>
    </div>`,
  // <option>{{contacts[userSettings.selectedContactIndex].Categ}}</option> :selected="userNo == slctdCntct.Assigned"
  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'accessToken',
      'msg',
      'userData',
      'accountSettings',
      'userSettings',
      'endPts',
      'contacts',
      'times',
      'patchContactInfo',
      'slctdCntct',
      'userList',
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
    testSelect(event) {
      console.log(event);
    },
    async addContactInfo(event) {
      const InfoGroup = event.target.value.split('_')[0];
      if (InfoGroup != 'newContact') {
        const InfoKey = event.target.value.split('_')[1];
        // prettier-ignore
        const columnIndex = this.contacts[this.userSettings.selectedContactIndex][InfoGroup].length;
        if (InfoGroup == 'Members' || InfoGroup == 'Properties') {
          // prettier-ignore
          this.contacts[this.userSettings.selectedContactIndex][InfoGroup].push({ ['Type']: InfoKey });
          this.patchContactInfo(InfoKey, InfoGroup, columnIndex, 'Type');
        } else {
          // prettier-ignore
          this.contacts[this.userSettings.selectedContactIndex][InfoGroup].push({ [InfoKey]: '' });
          this.patchContactInfo('', InfoGroup, columnIndex, InfoKey);
        }
      } else {
        const newMember = {
          Assets: [],
          Assigned: this.userData.id,
          Categ: '',
          Connections: [],
          Created: {
            [this.userData.id]: this.times.Y_m_d_H_i_s_z.slice(0, 16),
          },
          Custom1: [],
          Custom2: '',
          Custom3: '',
          Custom4: '',
          Custom5: '',
          DNC: 0,
          id: '',
          Log: [],
          Members: [
            {
              Type: Object.keys(
                this.accountSettings.contactInfo.keys.Members
              )[0],
              Name: '',
            },
          ],
          Notes: '',
          Properties: [],
          RecurTasks: [],
          Tasks: [],
          Updated: {
            [this.userData.id]: this.times.Y_m_d_H_i_s_z.slice(0, 16),
          },
        };
        this.contacts.push(newMember);
        const newContactIndex = this.contacts.length - 1;
        this.userSettings.selectedContactIndex = newContactIndex;

        try {
          const response = await fetch(servr_url + this.endPts.contacts, {
            method: 'POST',
            headers: {
              Authorization: this.accessToken,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
            body: JSON.stringify({
              Date: this.times.Y_m_d_H_i_s_z.slice(0, 16),
              Member: Object.keys(
                this.accountSettings.contactInfo.keys.Members
              )[0],
            }),
          });
          const postContactInfoResJSON = await response.json();
          if (postContactInfoResJSON.success) {
            // this.msg.snackBar = 'Updated ';
            console.log(postContactInfoResJSON);
            console.log(newContactIndex);
            console.log(this.contacts[newContactIndex]);
            console.log(postContactInfoResJSON.data.contact_id);
            this.contacts[newContactIndex].id =
              postContactInfoResJSON.data.contact_id;
          }
        } catch (error) {
          this.msg.snackBar = error.toString();
        }
      }
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
