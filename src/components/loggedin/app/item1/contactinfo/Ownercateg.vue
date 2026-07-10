<template>
  <div style="text-align: right; font-size: 14px">
    Owner:
    <select
      style="width: calc(100% - 85px); border: none; background-color: transparent"
      :disabled="dsbld || userRole < 7"
      :value="contacts[slctdCntctIndex].Assigned"
      :class="'slctd-cntct-id-' + sttngs.user.slctdCntctID"
      :style="{ 'margin-right': dsbld || userRole < 7 ? '0px' : '5px' }"
      @change="updateOwnerCateg($event.target.value, 'Assigned')"
    >
      <option v-for="([userNo, userInfo], userIndex) in Object.entries(userList)" :value="userNo">
        {{ userInfo.FirstName }}
      </option>
      <option disabled>
        Updated by
        {{ userList[Object.keys(contacts[slctdCntctIndex].Updated)].FirstName }}
        on
        {{ Object.values(contacts[slctdCntctIndex].Updated)[0].slice(5, 10).replace('-', '/') }}/{{
          Object.values(contacts[slctdCntctIndex].Updated)[0].slice(0, 4)
        }}
        {{ Object.values(contacts[slctdCntctIndex].Updated)[0].slice(11, 16) }}
      </option>
      <option disabled>
        Created by
        {{ userList[Object.keys(contacts[slctdCntctIndex].Created)].FirstName }}
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
      :value="contacts[slctdCntctIndex].Categ"
      :class="'slctd-cntct-id-' + sttngs.user.slctdCntctID"
      :disabled="dsbld || userRole < 4 || (userRole < 7 && contacts[slctdCntctIndex].Assigned != userData.id)"
      :style="{
        'margin-right':
          dsbld || userRole < 4 || (userRole < 7 && contacts[slctdCntctIndex].Assigned != userData.id) ? '0px' : '5px',
      }"
      @change="updateOwnerCateg($event.target.value, 'Categ')"
    >
      <option v-for="category in sttngs.entity.Categ">
        {{ category }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'Owner and category',

  inject: ['contacts', 'dsbld', 'patchContactInfo', 'sttngs', 'slctdCntctIndex', 'userData', 'userList', 'userRole'],

  methods: {
    updateOwnerCateg(event, clmn) {
      const oldCntct = JSON.parse(JSON.stringify(this.contacts[this.slctdCntctIndex]));
      event = typeof event === 'boolean' ? event : event.trim();
      if (event != oldCntct[clmn] && event != '') {
        this.contacts[this.slctdCntctIndex][clmn] = event;
        this.patchContactInfo(event, clmn, null, oldCntct, this.slctdCntctIndex);
      }
    },
  },
};
</script>

<style>
.owner-categ {
}
</style>
