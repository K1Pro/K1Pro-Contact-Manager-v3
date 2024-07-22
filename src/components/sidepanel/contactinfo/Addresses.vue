<template>
  <div class="addresses">
    <div v-for="(address, addressIndex) in contacts[slctdCntctIndex]?.Addresses">
      <div class="address-title-grid-container">
        <div class="address-title">
          <i class="fa-solid fa-house"></i>
          <select
            style="border: none; background-color: transparent"
            :value="address.Type"
            @change="updateAddress($event, addressIndex, 'Type')"
          >
            <option v-for="address in Object.keys(accountSettings.contactInfo.keys.Addresses)" :value="address">
              {{ address }}
            </option>
          </select>
        </div>
        <button class="address-button" @click="deleteContactInfo('Addresses', addressIndex)">
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
            :value="address[addressInputs.value]"
            @change="updateAddress($event, addressIndex, addressInputs.value)"
          >
            <option value="" disabled selected>State</option>
            <option value="AL">AL</option>
            <option value="AK">AK</option>
            <option value="AZ">AZ</option>
            <option value="AR">AR</option>
            <option value="CA">CA</option>
            <option value="CO">CO</option>
            <option value="CT">CT</option>
            <option value="DE">DE</option>
            <option value="DC">DC</option>
            <option value="FL">FL</option>
            <option value="GA">GA</option>
            <option value="HI">HI</option>
            <option value="ID">ID</option>
            <option value="IL">IL</option>
            <option value="IN">IN</option>
            <option value="IA">IO</option>
            <option value="KS">KS</option>
            <option value="KY">KY</option>
            <option value="LA">LA</option>
            <option value="ME">ME</option>
            <option value="MD">MD</option>
            <option value="MA">MA</option>
            <option value="MI">MI</option>
            <option value="MN">MN</option>
            <option value="MS">MI</option>
            <option value="MO">MO</option>
            <option value="MT">MT</option>
            <option value="NE">NE</option>
            <option value="NV">NV</option>
            <option value="NH">NH</option>
            <option value="NJ">NJ</option>
            <option value="NM">NM</option>
            <option value="NY">NY</option>
            <option value="NC">NC</option>
            <option value="ND">ND</option>
            <option value="OH">OH</option>
            <option value="OK">OK</option>
            <option value="OR">OR</option>
            <option value="PA">PA</option>
            <option value="RI">RI</option>
            <option value="SC">SC</option>
            <option value="SD">SD</option>
            <option value="TN">TN</option>
            <option value="TX">TX</option>
            <option value="UT">UT</option>
            <option value="VT">VT</option>
            <option value="VA">VA</option>
            <option value="WA">WA</option>
            <option value="WV">WV</option>
            <option value="WI">WI</option>
            <option value="WY">WY</option>
          </select>
          <input
            v-else
            :type="addressInputs.type"
            :placeholder="addressInputs.placeholder"
            :value="address[addressInputs.value]"
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

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'accountSettings',
      'userSettings',
      'contacts',
      'patchContactInfo',
      'deleteContactInfo',
      'slctdCntctIndex',
      'tabContentWidth',
    ]),
    addressInputsWidth() {
      return this.tabContentWidth > 120 ? 120 : this.tabContentWidth;
    },
  },

  data() {
    return { clmn: 'Addresses' };
  },

  methods: {
    updateAddress(event, clmnIndex, key) {
      if (event.target.value != this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key]) {
        this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key] = event.target.value;
        this.patchContactInfo(event.target.value, this.clmn, clmnIndex, key);
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
