// import example from './components/example_vue.js';

export default {
  name: 'Contact Info',

  template: /*html*/ `
    <div class='contact-info'>
      <div class="search-group">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="search" placeholder="Search for customer" v-model="search" @keyup="findSearchedContact"/>
        <select name="Contact Search" ref="searchDropdown" v-if="search.length > 2" @change="selectSearchedContact" :style="{overflow: membersArray.length < 10 ? 'hidden' : 'auto'}">
          <option disabled selected="true">Found {{membersArray.length}} {{ membersArray.length != 1 ? 'contacts' : 'contact' }}</option>
          <option v-for="(member, index) in membersArray" :value="member.split('_')[1]" >{{ member.split('_')[0] }}</option>
        </select>
      </div>
      <br/>
      <div v-for="(member, memberIndex) in contacts[userSettings.selectedContactIndex]?.Members">
        <div class="member" v-for="(memberInfo, memberType) in member">
          <div>{{ memberType }}</div>
          <div v-for="memberInputs in accountSettings.contactInfo.keys.Members[memberType]">
              <input 
                :type="memberInputs.type" 
                :placeholder="memberInputs.placeholder"
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
          <div>{{ propertyType }}</div>
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
            <div v-if="assetInputs.icon" class="contact-info-group">
              <i :class="assetInputs.icon"></i>
              <input
                :placeholder="assetInputs.placeholder"
                :type="assetInputs.type" 
                v-model="contacts[userSettings.selectedContactIndex].Assets[assetIndex][assetType]" />
            </div>
            <input v-else 
              :placeholder="assetInputs.placeholder"
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
    membersArray() {
      let memberArray = [];
      if (this.search.length > 2) {
        this.contacts.forEach((contact, contactIndex) => {
          contact.Members.forEach((member) => {
            Object.entries(member).forEach(([key, val]) => {
              let fullName;
              if (val.First && !val.Name) fullName = val.First;
              if (val.Name && !val.First) fullName = val.Name;
              if (val.First && val.Name) fullName = val.First + ' ' + val.Name;
              if (
                fullName?.toLowerCase().includes(this.search.toLowerCase()) &&
                !memberArray.includes(`${fullName}_${contactIndex}`)
              )
                memberArray.push(`${fullName}_${contactIndex}`);
            });
          });
        });
      }
      return memberArray.sort();
    },
  },

  //   components: {
  //     example,
  //   },

  //   props: [''],

  //   emits: [''],

  data() {
    return { search: '', pageClicks: 0 };
  },

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

    findSearchedContact() {
      if (this.search.length > 2) {
        this.$refs.searchDropdown.size =
          this.membersArray.length < 10 ? this.membersArray.length + 1 : 10;
      }
    },

    selectSearchedContact(event) {
      this.userSettings.selectedContactIndex = event.target.value;
      this.search = '';
      this.$refs.searchDropdown.size = 0;
    },

    onWindowClick() {
      if (this.pageClicks > 0) {
        this.search = '';
        this.$refs.searchDropdown.size = 0;
      }
      this.pageClicks++;
    },
  },

  beforeDestroy() {
    document.removeEventListener('click', this.onWindowClick);
  },

  mounted() {
    document.addEventListener('click', this.onWindowClick);
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
.contact-info span{
  padding: 6px;
}
.search-group {
  position: relative;
}

.search-group button {
  position: absolute;
  width: 40px;
  height: 40px;
  top: 0px;
  right: 0px;
  padding: 0px;
}


.search-group i {
  position: absolute;
  top: 11px;
  left: 22.5px;
  color: grey;
  z-index: 1;
}

.contact-info input[type='search'] {
  position: relative;
  width: 100%;
  padding: 11px 10px 11px 45px;
  border-left: 12px solid black;
  border-top: 1px solid grey;
  border-right: 1px solid grey;
  border-bottom: 1px solid grey;
  /* margin-right: calc(-1 * (100% - 20px)); */
}
.contact-info input[type='search']:focus {
  outline: none;
}
.search-group select {
  appearance: none;
  color-scheme: dark;
  position: absolute;
  left: 0;
  top: 40px;
  width: 100%;
  padding: 10px;
  border-left: 1px solid grey;
  border-top: 1px solid grey;
  border-right: 1px solid grey;
  border-bottom: 1px solid grey;
}
.search-group select:focus {
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
.contact-info input[type='date'] {
  width: 100%;
  border-width: 0px;
  font-family: 'Helvetica', sans-serif;
  padding: 6px
  /* border-style: solid;
  border-width: 0px 0px 1px 0px;
  border-color: #000000; */
  }
.contact-info input[type='date']:focus {
  outline: none;
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
