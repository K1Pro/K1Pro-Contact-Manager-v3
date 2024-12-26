<template>
  <div class="search-bar">
    <i class="fa-solid fa-magnifying-glass"></i>
    <input
      name="Search Input"
      type="search"
      autocomplete="off"
      placeholder="Search for contact"
      v-model.trim="search"
      @keyup="findSearchedContact"
      @click="findSearchedContact"
    />
    <select
      class="search-bar-full"
      v-if="search.length > 2 && appActiveElement == 'Search Input'"
      ref="searchDropdown"
      @change="selectSearchedContact"
      :style="{ overflow: searchArray.length < 10 ? 'hidden' : 'auto' }"
      required
    >
      <option disabled selected="true">
        Found {{ searchArray.length }}
        {{ searchArray.length != 1 ? 'contacts' : 'contact' }}
      </option>
      <option v-for="(searchResult, index) in searchArray" :value="searchResult.split('_')[1]">
        {{ searchResult.split('_')[0] }}
      </option>
    </select>
    <select
      class="search-bar-mobile"
      style="height: 42px"
      @change="selectSearchedContact"
      :style="{ appearance: searchArray.length > 0 ? 'auto' : 'none' }"
      :disabled="search.length <= 2"
    >
      <option disabled selected="true">
        Found {{ searchArray.length }}
        {{ searchArray.length != 1 ? 'contacts' : 'contact' }}
      </option>
      <option v-for="(searchResult, index) in searchArray" :value="searchResult.split('_')[1]">
        {{ searchResult.split('_')[0] }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'Search Bar',

  inject: ['contacts', 'sttngsReq', 'sttngs', 'userData'],

  computed: {
    searchArray() {
      let searchResultArray = [];
      if (this.search.length > 2) {
        this.contactInfoStringArray.forEach((contact, contactIndex) => {
          if (contact.includes(this.search.trim().toLowerCase().replaceAll('-', ''))) {
            this.contacts[contactIndex].Members.forEach((member) => {
              let fullName;
              if (member.First && !member?.Name) fullName = member.First;
              if (member?.Name && !member.First) fullName = member?.Name;
              if (member.First && member?.Name) fullName = member.First + ' ' + member?.Name;
              searchResultArray.push(`${fullName}_${contactIndex}`);
            });
          }
        });
      }
      return searchResultArray.sort();
    },
    contactInfoStringArray() {
      let stringArray = [];

      this.contacts.forEach((contact, contactIndex) => {
        stringArray[contactIndex] = [];
        contact.Members.forEach((member) => {
          let fullName;
          if (member.First && !member?.Name) fullName = member.First;
          if (member?.Name && !member.First) fullName = member?.Name;
          if (member.First && member?.Name) fullName = member.First + ' ' + member?.Name;
          stringArray[contactIndex] += (fullName + ' ').toLowerCase();
        });

        contact.Addresses.forEach((addres) => {
          Object.entries(addres).forEach(([addresKey, addresValue]) => {
            if (addresKey != 'Type') stringArray[contactIndex] += (addresValue + ' ').toLowerCase();
          });
        });

        contact.Connections.forEach((connection) => {
          Object.values(connection).forEach((connectionValue) => {
            stringArray[contactIndex] += (connectionValue + ' ').toLowerCase().replaceAll('-', '');
          });
        });

        contact.Custom1.forEach((custom1) => {
          Object.entries(custom1).forEach(([custom1Key, custom1Value]) => {
            if (custom1Key == 'No' && this.userData.Entity == 'bundle-insurance')
              stringArray[contactIndex] += (custom1Value + ' ').toLowerCase().replaceAll('-', '');
          });
        });
      });
      return stringArray;
    },
  },

  data() {
    return { search: '', pageClicks: 0, appActiveElement: null };
  },

  methods: {
    findSearchedContact() {
      this.appActiveElement = 'Search Input';
      if (this.search.length > 2) {
        this.$refs.searchDropdown.size = this.searchArray.length < 10 ? this.searchArray.length + 1 : 10;
      }
    },
    selectSearchedContact(event) {
      this.search = '';
      this.$refs.searchDropdown.size = 0;
      this.sttngs.user.slctdCntctID = this.contacts[event.target.value].id;
      this.sttngsReq('PATCH', 'user');
    },

    onWindowClick() {
      this.appActiveElement = document.activeElement.name ? document.activeElement.name : null;
    },
  },

  beforeDestroy() {
    document.removeEventListener('click', this.onWindowClick);
  },

  mounted() {
    document.addEventListener('click', this.onWindowClick);
  },
};
</script>

<style>
.search-bar {
  position: relative;
}
.search-bar i {
  position: absolute;
  top: 12px;
  left: 22.5px;
  color: grey;
  z-index: 3;
}
.search-bar input[type='search'] {
  position: relative;
  z-index: 2;
  width: calc(100% - 20px);
  padding: 12px 10px 12px 45px;
  border-left: 12px solid black;
  border-top: 1px solid grey;
  border-right: 1px solid grey;
  border-bottom: 1px solid grey;
}
.search-bar input[type='search']:focus {
  outline: none;
}
.search-bar-full {
  appearance: none;
  color-scheme: dark;
  position: absolute;
  z-index: 1;
  left: 0;
  top: 40px;
  width: 100%;
  padding: 10px;
  border-left: 1px solid grey;
  border-top: 1px solid grey;
  border-right: 1px solid grey;
  border-bottom: 1px solid grey;
}
.search-bar-full:focus {
  outline: none;
}
.search-bar-mobile {
  color-scheme: dark;
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0px;
  width: 100%;
  padding: 10px;
  border-left: 1px solid grey;
  border-top: 1px solid grey;
  border-right: 1px solid grey;
  border-bottom: 1px solid grey;
}
.search-bar-mobile:focus {
  outline: none;
}
.search-bar button {
  height: 40px;
  width: 24px;
  background-color: black;
  border: none;
}
</style>
