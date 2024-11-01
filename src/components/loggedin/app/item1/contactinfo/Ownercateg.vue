<template>
  <div style="text-align: right; font-size: 14px">
    Owner:
    <select
      style="width: calc(100% - 85px); border: none; background-color: transparent"
      :style="{ 'margin-right': dsbld || userRole < 7 ? '0px' : '5px' }"
      :value="contacts[slctdCntctIndex].Assigned"
      :disabled="dsbld || userRole < 7"
      @change="updateOwnerCateg($event.target.value, 'Assigned')"
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
      style="width: calc(100% - 85px); border: none; background-color: transparent"
      :style="{
        'margin-right':
          dsbld || userRole < 4 || (userRole < 7 && contacts[slctdCntctIndex].Assigned != userData.id) ? '0px' : '5px',
      }"
      :value="contacts[slctdCntctIndex].Categ"
      :disabled="dsbld || userRole < 4 || (userRole < 7 && contacts[slctdCntctIndex].Assigned != userData.id)"
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

  inject: [
    'accountSettings',
    'contacts',
    'dsbld',
    'patchContactInfo',
    'slctdCntctIndex',
    'userData',
    'userList',
    'userRole',
  ],

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
