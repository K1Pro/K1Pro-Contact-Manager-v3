// import example from './components/example_vue.js';

export default {
  name: 'Contact Info',
  //<input type="text" v-model="contacts[userSettings.selectedContactIndex].Members[0].First_Name"/>

  // <div v-for="(member, memberIndex) in contacts[userSettings.selectedContactIndex]?.Members">
  //           <input
  //             type="text"
  //             v-if="contacts[userSettings.selectedContactIndex]?.Members[memberIndex].First_Name"
  //             v-model="contacts[userSettings.selectedContactIndex].Members[memberIndex].First_Name"
  //             @change="patchMember($event, 'Members', memberIndex, 'First_Name' )" />
  //           <input
  //             type="text"
  //             v-else />
  //           <input
  //             type="text"
  //             v-if="contacts[userSettings.selectedContactIndex]?.Members[memberIndex].Last_Name"
  //             v-model="contacts[userSettings.selectedContactIndex].Members[memberIndex].Last_Name"
  //             @change="patchMember($event, 'Members', memberIndex, 'Last_Name' )" />
  //           <input
  //             type="text"
  //             v-else />
  //           <input
  //             type="date"
  //             v-if="contacts[userSettings.selectedContactIndex]?.Members[memberIndex].DoB"
  //             v-model="contacts[userSettings.selectedContactIndex].Members[memberIndex].DoB"
  //             @change="patchMember($event, 'Members', memberIndex, 'DoB' )" />
  //           <input
  //             type="date"
  //             v-else />
  //         </div>

  //         <div v-for="(property, propertyIndex) in contacts[userSettings.selectedContactIndex]?.Properties">
  //           <input
  //             v-if="contacts[userSettings.selectedContactIndex]?.Properties[propertyIndex].Address_1"
  //             type="text"
  //             v-model="contacts[userSettings.selectedContactIndex].Properties[propertyIndex].Address_1"
  //             @change="patchProperty($event, 'Properties', propertyIndex, 'Address_1' )" />
  //           <input
  //             type="text"
  //             v-if="'Address_1' in contacts[userSettings.selectedContactIndex]?.Properties[propertyIndex]"
  //             placeholder="Address_1" />
  //           <input
  //             v-if="contacts[userSettings.selectedContactIndex]?.Properties[propertyIndex].Address_2"
  //             type="text"
  //             v-model="contacts[userSettings.selectedContactIndex].Properties[propertyIndex].Address_2"
  //             @change="patchProperty($event, 'Properties', propertyIndex, 'Address_2' )" />
  //           <input
  //             type="text"
  //             v-if="'Address_2' in contacts[userSettings.selectedContactIndex]?.Properties[propertyIndex]"
  //             placeholder="Address_2" />
  //         </div>        <div>{{ Object.values(contacts[userSettings.selectedContactIndex]?.Members[0]) }}</div>

  template: /*html*/ `
    <div class='contact-info'>
        <input type="search" placeholder="Search for customer" />
        <br/>
        <br/>
        <div>
        </div>
        <div v-for="(member, memberIndex) in contacts[userSettings.selectedContactIndex]?.Members">
          <div v-for="(memberInfo, memberType) in member">
            {{ memberType }}
            <div v-for="memberInputs in accountSettings.contactInfo.keys.Members[memberType]">
                <input :type="memberInputs.type" :value="memberInfo[memberInputs.value]" :placeholder="memberInfo[memberInputs.placeholder]" />
            </div>
          </div>
        </div>
        <div v-for="(property, propertyIndex) in contacts[userSettings.selectedContactIndex]?.Properties">
          <div v-for="(propertyInfo, propertyType) in property">
            {{ propertyType }}
            <div v-for="propertyInputs in accountSettings.contactInfo.keys.Properties[propertyType]">
              <input :type="propertyInputs.type" :value="propertyInfo[propertyInputs.value]" :placeholder="propertyInfo[propertyInputs.placeholder]" />
            </div>
          </div>
        </div>
        <div v-for="(asset, assetIndex) in contacts[userSettings.selectedContactIndex]?.Assets">
          <div v-for="(assetInfo, assetType) in asset">
            {{ assetType }}
            <div v-for="assetInputs in accountSettings.contactInfo.keys.Assets[assetType]">
              <input :type="assetInputs.type" :value="assetInfo" :placeholder="assetInfo[assetInputs.placeholder]" />
          </div>
          </div>
        </div>

        <br/>
          

    </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'accessToken',
      'msg',
      'accountSettings',
      'userSettings',
      'endPts',
      'contacts',
      'membersSlctdCntctArr',
    ]),
    selectedContact() {
      let firstMember = false;
      if (this.contacts && this.userSettings) {
        if (this.contacts[this.userSettings.selectedContactIndex]?.Members[0]) {
          firstMember = Object.values(
            this.contacts[this.userSettings.selectedContactIndex]?.Members[0]
          )[0];
        }
      }
      return firstMember;
    },
    Addresses() {
      // add indexes here and this should work, make this easier to read too.
      const addressesArray = [];
      // this.contacts[this.userSettings.selectedContactIndex]?.Properties.forEach(
      //   (property) => {
      //     if (
      //       this.accountSettings.contactInfo.keys.Properties.Address.some(
      //         (item) => Object.keys(property).includes(item)
      //       )
      //     )
      //       addressesArray.push(property);
      //   }
      // );
      return addressesArray;
    },
    Assets() {
      const assetsArray = [];
      // this.contacts[this.userSettings.selectedContactIndex]?.Properties.forEach(
      //   (property) => {
      //     if (
      //       this.accountSettings.contactInfo.keys.Properties.Car.some((item) =>
      //         Object.keys(property).includes(item)
      //       )
      //     )
      //       assetsArray.push(property);
      //   }
      // );
      return assetsArray;
    },
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
    // console.log(this.accountSettings.contactInfo.keys);
    style(
      'Contact-Info',
      /*css*/ `
.contact-info{}
.contact-info input[type='search'] {
    width: 100%;
    padding: 10px 5px 10px 45px;
    /* margin-bottom: 10px; */
    }
.contact-info input[type='text'] {
  margin-bottom: -2px;
  }
.contact-info input[type='date'] {
  width: 100%;
  border-style: solid;
  border-width: 0px 0px 1px 0px;
  border-color: #000000;
  }
`
    );
  },
};
