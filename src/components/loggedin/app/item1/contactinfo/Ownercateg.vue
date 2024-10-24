<template>
  <div style="text-align: right; font-size: 14px">
    Owner:
    <select
      style="margin-right: 5px; width: calc(100% - 85px); border: none; background-color: transparent"
      :value="contacts[slctdCntctIndex].Assigned"
      @change="updateOwnerCateg($event.target.value, 'Assigned')"
    >
      <option
        v-for="([userNo, userInfo], userIndex) in Object.entries(userList)"
        :value="userNo"
        :disabled="userData.AppPermissions[appName][1] != 'admin'"
      >
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
      :value="contacts[slctdCntctIndex].Categ"
      @change="updateOwnerCateg($event.target.value, 'Categ')"
    >
      <option v-for="category in accountSettings.Categ">
        {{ category }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'Owner and category',

  inject: ['accountSettings', 'appName', 'contacts', 'patchContactInfo', 'slctdCntctIndex', 'userData', 'userList'],

  methods: {
    updateOwnerCateg(event, clmn) {
      if (event != this.contacts[this.slctdCntctIndex][clmn] && event != '') {
        const cloneCntct = this.contacts[this.slctdCntctIndex];
        cloneCntct[clmn] = event;
        this.patchContactInfo(event, clmn, null, null, cloneCntct);
      }
    },
  },
};
</script>

<style>
.owner-categ {
}
</style>
