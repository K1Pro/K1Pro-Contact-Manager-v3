// import example from './components/example_vue.js';

export default {
  name: 'Contact Info',

  template: /*html*/ `
    <div class='contact-info'>
        <input type="search" placeholder="Search for customer" />
        <br/>
        <br/>
        <div v-for="(member, memberIndex) in contacts[userSettings.selectedContactIndex]?.Members">
          <div class="member" v-for="(memberInfo, memberType) in member">
            {{ memberType }}
            <div v-for="memberInputs in accountSettings.contactInfo.keys.Members[memberType]">
                <input 
                  :type="memberInputs.type" 
                  :placeholder="memberInfo[memberInputs.placeholder]"
                  v-model="contacts[userSettings.selectedContactIndex].Members[memberIndex][memberType][memberInputs.value]" />
            </div>
          </div>
          <template v-if="memberIndex === contacts[userSettings.selectedContactIndex]?.Members.length - 1">
            <br />
            <button>Add member</button>
            <hr>
          </template>
        </div>

        <div v-for="(property, propertyIndex) in contacts[userSettings.selectedContactIndex]?.Properties">
          <div class="property" v-for="(propertyInfo, propertyType) in property">
            {{ propertyType }}
            <div v-for="propertyInputs in accountSettings.contactInfo.keys.Properties[propertyType]">
              <input 
                :type="propertyInputs.type" 
                :placeholder="propertyInfo[propertyInputs.placeholder]"
                v-model="contacts[userSettings.selectedContactIndex].Properties[propertyIndex][propertyType][propertyInputs.value]" />
            </div>
          </div>
          <template v-if="propertyIndex === contacts[userSettings.selectedContactIndex]?.Properties.length - 1">
            <br />
            <button>Add property</button>
            <hr>
          </template>
        </div>

        <div v-for="(asset, assetIndex) in contacts[userSettings.selectedContactIndex]?.Assets">
          <div v-for="(assetInfo, assetType) in asset">
            <div v-for="assetInputs in accountSettings.contactInfo.keys.Assets[assetType]">
              <input 
                :placeholder="assetInfo[assetInputs.placeholder]"
                :type="assetInputs.type" 
                v-model="contacts[userSettings.selectedContactIndex].Assets[assetIndex][assetType]" />
            </div>
          </div>
          <template v-if="assetIndex === contacts[userSettings.selectedContactIndex]?.Assets.length - 1">
            <br />
            <button>Add asset</button>
            <hr>
          </template>
        </div>

        <div v-for="(comm, commIndex) in contacts[userSettings.selectedContactIndex]?.Communications">
          <div v-for="(commInfo, commType) in comm">
            <div v-for="commInputs in accountSettings.contactInfo.keys.Communications[commType]">
              <input 
                :placeholder="commInfo[commInputs.placeholder]"
                :type="commInputs.type" 
                v-model="contacts[userSettings.selectedContactIndex].Communications[commIndex][commType]" />
            </div>
          </div>
          <template v-if="commIndex === contacts[userSettings.selectedContactIndex]?.Communications.length - 1">
            <br />
            <button>Add connection</button>
            <hr>
          </template>
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
.contact-info {
  text-align: center;
  font-family: 'Helvetica', sans-serif;
}
.contact-info input[type='search'] {
    width: 100%;
    padding: 10px 5px 10px 45px;
    border-left: 0px solid black;
    border-left-width: 12px;
    border-top: 1px solid grey;
    border-right: 1px solid grey;
    border-bottom: 1px solid grey;
    }
.contact-info input[type='text'] {

  }
.contact-info input[type='date'] {
  width: 100%;
  border-width: 0px;
  font-family: 'Helvetica', sans-serif;
  padding: 6px
  /* border-style: solid;
  border-width: 0px 0px 1px 0px;
  border-color: #000000; */
  }
.member {
  text-align: left;
}
.property{
  text-align: left;
}
`
    );
  },
};
