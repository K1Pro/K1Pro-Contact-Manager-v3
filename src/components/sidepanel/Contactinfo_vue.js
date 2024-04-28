// import example from './components/example_vue.js';

export default {
  name: 'Contact Info',

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
                <input 
                  :type="memberInputs.type" 
                  :placeholder="memberInfo[memberInputs.placeholder]"
                  v-model="contacts[userSettings.selectedContactIndex].Members[memberIndex][memberType][memberInputs.value]" />
            </div>
          </div>
        </div>
        <div v-for="(property, propertyIndex) in contacts[userSettings.selectedContactIndex]?.Properties">
          <div v-for="(propertyInfo, propertyType) in property">
            {{ propertyType }}
            <div v-for="propertyInputs in accountSettings.contactInfo.keys.Properties[propertyType]">
              <input 
                :type="propertyInputs.type" 
                :placeholder="propertyInfo[propertyInputs.placeholder]"
                v-model="contacts[userSettings.selectedContactIndex].Properties[propertyIndex][propertyType][propertyInputs.value]" />
            </div>
          </div>
        </div>
        <div v-for="(asset, assetIndex) in contacts[userSettings.selectedContactIndex]?.Assets">
          <div v-for="(assetInfo, assetType) in asset">
            {{ assetType }}
            <div v-for="assetInputs in accountSettings.contactInfo.keys.Assets[assetType]">
              <input 
                :placeholder="assetInfo[assetInputs.placeholder]"
                :type="assetInputs.type" 
                v-model="contacts[userSettings.selectedContactIndex].Assets[assetIndex][assetType]" />
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
