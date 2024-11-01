<template>
  <div class="addresses">
    <div v-for="(address, addressIndex) in contacts[slctdCntctIndex]?.Addresses">
      <div class="address-title-grid-container">
        <div class="address-title">
          <i class="fa-solid fa-house"></i>
          <select
            v-if="userRole > 5 || contacts[slctdCntctIndex].Assigned == userData.id"
            style="border: none; background-color: transparent"
            :value="address.Type"
            :disabled="dsbld"
            @change="updateAddress($event, addressIndex, 'Type')"
          >
            <option v-for="address in Object.keys(accountSettings.contactInfo.keys.Addresses)" :value="address">
              {{ address }}
            </option>
          </select>
          <div v-else style="display: inline-block; padding: 5px">{{ address.Type }}</div>
        </div>
        <button
          v-if="!dsbld && (userRole > 5 || contacts[slctdCntctIndex].Assigned == userData.id)"
          class="address-button"
          @click="deleteContactInfo('Addresses', addressIndex)"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
      <div class="address-grid-container">
        <div
          v-for="addressInputs in accountSettings.contactInfo.keys.Addresses[
            address.Type ? address.Type : Object.keys(this.accountSettings.contactInfo.keys.Addresses)[0]
          ]"
          :style="{ flex: '1 0 ' + addressInputsWidth + 'px' }"
        >
          <select
            v-if="addressInputs.value == 'State'"
            :disabled="dsbld || (userRole < 6 && contacts[slctdCntctIndex].Assigned != userData.id)"
            :value="address[addressInputs.value]"
            style="background-color: #ffffff; opacity: 1"
            @change="updateAddress($event, addressIndex, addressInputs.value)"
          >
            <option value="" disabled selected>State</option>
            <option v-for="state in stateList" :value="state">
              {{ state }}
            </option>
          </select>
          <input
            v-else
            :type="addressInputs.type"
            :placeholder="addressInputs.placeholder"
            :value="address[addressInputs.value]"
            :disabled="dsbld"
            :readonly="dsbld || userRole < 4 || (userRole < 7 && contacts[slctdCntctIndex].Assigned != userData.id)"
            style="background-color: white"
            @change="updateAddress($event, addressIndex, addressInputs.value)"
          />
        </div>
      </div>
      <template v-if="addressIndex === contacts[slctdCntctIndex].Addresses.length - 1">
        <hr />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Addresses',

  inject: [
    'accountSettings',
    'appName',
    'contacts',
    'deleteContactInfo',
    'dsbld',
    'patchContactInfo',
    'slctdCntctIndex',
    'tbCntntWdth',
    'userData',
    'userRole',
  ],

  computed: {
    addressInputsWidth() {
      return this.tbCntntWdth > 120 ? 120 : this.tbCntntWdth;
    },
  },

  data() {
    return {
      clmn: 'Addresses',
      // prettier-ignore
      stateList: ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',],
    };
  },

  methods: {
    updateAddress(event, clmnIndex, key) {
      if (
        (event.target.value != this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key] &&
          event.target.value != '') ||
        (event.target.value == '' && this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key])
      ) {
        const cloneCntct = this.contacts[this.slctdCntctIndex];
        cloneCntct[this.clmn][clmnIndex][key] = event.target.value;
        this.patchContactInfo(event.target.value, this.clmn, clmnIndex, key, cloneCntct);
      }
    },
  },
};
</script>

<style>
.addresses {
}
.address-title-grid-container {
  display: grid;
  grid-template-columns: calc(100% - 34px) 34px;
}
.address-title {
  padding-top: 5px;
}
.address-button {
  padding: 5px;
  width: 32px;
  background-color: transparent;
  border: 0px;
  cursor: pointer;
}
.address-button:hover {
  color: DimGrey;
}
.address-grid-container {
  display: flex;
  flex-wrap: wrap;
}
.address-grid-container input,
.address-grid-container select {
  font-family: 'Helvetica', sans-serif;
  border: 1px solid lightgray;
  border-radius: 0px;
  padding: 5px;
  width: 100%;
  height: 100%;
}
</style>
