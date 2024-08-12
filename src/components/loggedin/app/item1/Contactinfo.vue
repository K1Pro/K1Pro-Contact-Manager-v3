<template>
  <div class="contact-info">
    <searchbar></searchbar>
    <members @contacts="(el) => $emit('contacts', el)"></members>
    <addresses></addresses>
    <connections @sideMenuSlctdLnk="(el) => $emit('sideMenuSlctdLnk', el)"></connections>
    <assets></assets>
    <credentials></credentials>
    <template v-if="contacts[slctdCntctIndex]">
      <div style="text-align: right; font-size: 14px">
        Owner:
        <select
          style="margin-right: 5px; width: calc(100% - 85px); border: none; background-color: transparent"
          v-model="contacts[slctdCntctIndex].Assigned"
          @change="patchContactInfo($event.target.value, 'Assigned')"
        >
          <option v-for="([userNo, userInfo], userIndex) in Object.entries(userList)" :value="userNo">
            {{ userInfo[0] }}
          </option>
          <option disabled>
            Updated by
            {{ userList[Object.keys(contacts[slctdCntctIndex].Updated)][0] }}
            on
            {{ Object.values(contacts[slctdCntctIndex].Updated)[0].slice(5, 10).replace('-', '/') }}/{{
              Object.values(contacts[slctdCntctIndex].Updated)[0].slice(0, 4)
            }}
            {{ Object.values(contacts[slctdCntctIndex].Updated)[0].slice(11, 16) }}
          </option>
          <option disabled>
            Created by
            {{ userList[Object.keys(contacts[slctdCntctIndex].Created)][0] }}
            on
            {{ Object.values(contacts[slctdCntctIndex].Created)[0].slice(5, 10).replace('-', '/') }}/{{
              Object.values(contacts[slctdCntctIndex].Created)[0].slice(0, 4)
            }}
            {{ Object.values(contacts[slctdCntctIndex].Created)[0].slice(11, 16) }}
          </option>
        </select>
      </div>
      <div style="text-align: right; font-size: 14px">
        Category:
        <select
          style="margin-right: 5px; width: calc(100% - 85px); border: none; background-color: transparent"
          v-model="contacts[slctdCntctIndex].Categ"
          @change="patchContactInfo($event.target.value, 'Categ')"
        >
          <option v-for="category in accountSettings.Categ">
            {{ category }}
          </option>
        </select>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Contact Info',

  emits: ['contacts', 'sideMenuSlctdLnk'],

  inject: ['accountSettings', 'contacts', 'patchContactInfo', 'slctdCntctIndex', 'userList'],
};
</script>

<style>
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
</style>
