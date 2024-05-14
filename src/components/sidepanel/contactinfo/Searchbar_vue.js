// import example from './components/example_vue.js';

export default {
  name: 'Search Bar',

  template: /*html*/ `
        <div class='search-bar'>
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="search" placeholder="Search for contact" v-model="search" @keyup="findSearchedContact"/>
            <select name="Contact Search" ref="searchDropdown" v-if="search.length > 2" @change="selectSearchedContact" :style="{overflow: searchArray.length < 10 ? 'hidden' : 'auto'}">
                <option disabled selected="true">Found {{searchArray.length}} {{ searchArray.length != 1 ? 'contacts' : 'contact' }}</option>
                <option v-for="(searchResult, index) in searchArray" :value="searchResult.split('_')[1]" >{{ searchResult.split('_')[0] }}</option>
            </select>
        </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'userSettings',
      'contacts',
      'patchUserSettings',
    ]),
    searchArray() {
      let searchResultArray = [];
      if (this.search.length > 2) {
        this.contacts.forEach((contact, contactIndex) => {
          contact.Members.forEach((member) => {
            let fullName;
            if (member.First && !member.Name) fullName = member.First;
            if (member.Name && !member.First) fullName = member.Name;
            if (member.First && member.Name)
              fullName = member.First + ' ' + member.Name;
            if (
              fullName?.toLowerCase().includes(this.search.toLowerCase()) &&
              !searchResultArray.includes(`${fullName}_${contactIndex}`)
            )
              searchResultArray.push(`${fullName}_${contactIndex}`);
          });
        });
      }
      return searchResultArray.sort();
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
    findSearchedContact() {
      if (this.search.length > 2) {
        this.$refs.searchDropdown.size =
          this.searchArray.length < 10 ? this.searchArray.length + 1 : 10;
      }
    },

    selectSearchedContact(event) {
      this.userSettings.selectedContactIndex = event.target.value;
      this.search = '';
      this.$refs.searchDropdown.size = 0;
      this.patchUserSettings();
    },

    onWindowClick() {
      if (this.pageClicks > 0 && this.search.length > 2) {
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
    style(
      'search-bar',
      /*css*/ `
.search-bar {
    position: relative;
}
.search-bar i {
    position: absolute;
    top: 12px;
    left: 22.5px;
    color: grey;
    z-index: 1;
}
.search-bar select {
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
.search-bar select:focus {
    outline: none;
}
.search-bar input[type='search'] {
    position: relative;
    width: 100%;
    padding: 12px 10px 12px 45px;
    border-left: 12px solid black;
    border-top: 1px solid grey;
    border-right: 1px solid grey;
    border-bottom: 1px solid grey;
}
.search-bar input[type='search']:focus {
    outline: none;
}
`
    );
  },
};
