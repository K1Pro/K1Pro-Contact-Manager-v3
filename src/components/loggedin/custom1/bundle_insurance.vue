<template>
  <template v-if="contacts[slctdCntctIndex].Custom1 && userData?.AppPermissions[app_name][0] == 'bundle_insurance'">
    <div class="policy-info">
      <div class="policy-info-title">
        <div class="policy-info-title-grid-container">
          <div class="policy-info-title-grid-item1">
            Policy info for
            {{ contacts[slctdCntctIndex].Members[0].First ? contacts[slctdCntctIndex].Members[0].First : '' }}
            {{ contacts[slctdCntctIndex].Members[0]?.Name }}
          </div>
          <div class="policy-info-title-grid-item2">
            <button @click="newPolicy">
              <i class="fa-solid fa-square-plus"></i>
            </button>
          </div>
        </div>
      </div>

      <div
        v-for="(policyInfo, policyInfoIndex) in contacts[slctdCntctIndex].Custom1"
        class="policy-info-policy"
        :style="{
          'background-color': policyInfoIndex % 2 ? 'lightblue' : 'white',
        }"
      >
        <i class="fa-solid fa-trash" @click="deleteContactInfo('Custom1', policyInfoIndex)"></i>
        <div v-for="policyInfoInputs in accountSettings.Custom1">
          <span class="policy-info-label" v-if="!(policyInfo.Policy_Type != 'Home' && policyInfoInputs.value == 'EHV')"
            >{{ policyInfoInputs.placeholder }}:</span
          >
          <template v-if="policyInfoInputs.type == 'select'">
            <select
              @change="updatePolicy($event.target.value, policyInfoIndex, policyInfoInputs.value)"
              :style="{
                'background-color': policyInfoIndex % 2 ? 'lightblue' : 'white',
                border: policyInfoIndex % 2 ? '1px solid gray' : '1px solid lightgray',
              }"
            >
              <option></option>
              <option
                v-for="option in policyInfoInputs.options"
                :selected="option == policyInfo[policyInfoInputs.value]"
              >
                {{ option }}
              </option>
            </select>
          </template>
          <template v-else-if="policyInfoInputs.type == 'checkbox'">
            <input
              :type="policyInfoInputs.type"
              :checked="policyInfo[policyInfoInputs.value] == 1"
              @change="updatePolicy($event.target.checked, policyInfoIndex, policyInfoInputs.value)"
            />
            {{ policyInfo[policyInfoInputs.value] == 1 ? 'Yes' : 'No' }}
          </template>
          <template
            v-else-if="
              policyInfoInputs.type == 'number' &&
              !(policyInfo.Policy_Type != 'Home' && policyInfoInputs.value == 'EHV')
            "
          >
            <input
              :style="{
                'background-color': policyInfoIndex % 2 ? 'lightblue' : 'white',
                border: policyInfoIndex % 2 ? '1px solid gray' : '1px solid lightgray',
              }"
              :type="policyInfoInputs.type"
              :value="policyInfo[policyInfoInputs.value]"
              @change="updatePolicy($event.target.value, policyInfoIndex, policyInfoInputs.value)"
            />
          </template>
          <template v-else>
            <input
              v-if="policyInfoInputs.type != 'number'"
              :style="{
                'background-color': policyInfoIndex % 2 ? 'lightblue' : 'white',
                border: policyInfoIndex % 2 ? '1px solid gray' : '1px solid lightgray',
              }"
              :type="policyInfoInputs.type"
              :value="policyInfo[policyInfoInputs.value]"
              v-on:blur="updatePolicy($event.target.value, policyInfoIndex, policyInfoInputs.value)"
            />
          </template>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
export default {
  name: 'Custom 1',
  // test
  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'userData',
      'accountSettings',
      'userSettings',
      'contacts',
      'patchContactInfo',
      'deleteContactInfo',
      'slctdCntctIndex',
    ]),
  },

  data() {
    return { clmn: 'Custom1' };
  },

  methods: {
    newPolicy() {
      const newCustom1 = [...this.contacts[this.slctdCntctIndex][this.clmn], {}];
      this.contacts[this.slctdCntctIndex][this.clmn] = newCustom1;
      this.patchContactInfo('', this.clmn, this.contacts[this.slctdCntctIndex][this.clmn].length, 'Date');
    },
    updatePolicy(inptVal, clmnIndex, key) {
      if (
        (inptVal != this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key] && inptVal != '') ||
        (inptVal == '' && this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key])
      ) {
        this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key] = inptVal;
        this.patchContactInfo(inptVal, this.clmn, clmnIndex, key);
      }
    },
  },
};
</script>

<style>
.policy-info {
  background-color: lightblue;
}
.policy-info-title {
  font-weight: bold;
  padding: 5px;
  color: black;
}
.policy-info-title-grid-container {
  display: grid;
  grid-template-columns: calc(100% - 22.5px) 22.5px;
}
.policy-info-title-grid-item1 {
  height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.policy-info-title-grid-item2 button {
  background-color: transparent;
  border: 0px;
  cursor: pointer;
  color: #417cd9;
}
.policy-info-title-grid-item2 button:hover {
  color: #db66ff;
}
.policy-info-policy {
  padding: 10px 10px 0px 10px;
}
.policy-info-policy i {
  float: right;
  font-size: 14px;
  cursor: pointer;
}
.policy-info-policy div {
}
.policy-info-label {
  padding-bottom: 10px;
  font-size: 14px;
  display: inline-block;
  width: 100px;
  text-align: right;
}
.policy-info-policy input:not([type='checkbox']),
.policy-info-policy select {
  width: calc(100% - 140px);
  height: 20px;
  font-family: 'Helvetica', sans-serif;
  border-radius: 1px;
}
</style>
