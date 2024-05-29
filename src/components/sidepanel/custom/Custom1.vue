<template>
  <template
    v-if="
      slctdCntct && userData?.AppPermissions[appName][0] == 'bundle_insurance'
    "
  >
    <div class="policy-info">
      <div class="policy-info-title">
        <div class="policy-info-title-grid-container">
          <div class="policy-info-title-grid-item1">
            Policy info for
            {{ slctdCntct.Members[0].First ? slctdCntct.Members[0].First : '' }}
            {{ slctdCntct.Members[0].Name }}
          </div>
          <div class="policy-info-title-grid-item2">
            <button @click="newPolicy">
              <i class="fa-solid fa-square-plus"></i>
            </button>
          </div>
        </div>
      </div>

      <div
        v-for="(policyInfo, policyInfoIndex) in slctdCntct.Custom1"
        class="policy-info-policy"
        :style="{
          'background-color': policyInfoIndex % 2 ? 'lightblue' : 'white',
        }"
      >
        <i
          class="fa-solid fa-trash"
          @click="deleteContactInfo('Custom1', policyInfoIndex)"
        ></i>
        <div v-for="policyInfoInputs in accountSettings.Custom1">
          <span
            class="policy-info-label"
            v-if="
              !(
                policyInfo.Policy_Type != 'Home' &&
                policyInfoInputs.value == 'EHV'
              )
            "
            >{{ policyInfoInputs.placeholder }}:</span
          >
          <template v-if="policyInfoInputs.type == 'select'">
            <select
              @change="
                updatePolicy($event, policyInfoIndex, policyInfoInputs.value)
              "
              :style="{
                'background-color': policyInfoIndex % 2 ? 'lightblue' : 'white',
                border:
                  policyInfoIndex % 2
                    ? '1px solid gray'
                    : '1px solid lightgray',
              }"
            >
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
              @change="
                updatePolicy($event, policyInfoIndex, policyInfoInputs.value)
              "
            />
            {{ policyInfo[policyInfoInputs.value] == 1 ? 'Yes' : 'No' }}
          </template>
          <template
            v-else-if="
              policyInfoInputs.type == 'number' &&
              !(
                policyInfo.Policy_Type != 'Home' &&
                policyInfoInputs.value == 'EHV'
              )
            "
          >
            <input
              :style="{
                'background-color': policyInfoIndex % 2 ? 'lightblue' : 'white',
                border:
                  policyInfoIndex % 2
                    ? '1px solid gray'
                    : '1px solid lightgray',
              }"
              :type="policyInfoInputs.type"
              :value="policyInfo[policyInfoInputs.value]"
              @change="
                updatePolicy($event, policyInfoIndex, policyInfoInputs.value)
              "
            />
          </template>
          <template v-else>
            <input
              v-if="policyInfoInputs.type != 'number'"
              :style="{
                'background-color': policyInfoIndex % 2 ? 'lightblue' : 'white',
                border:
                  policyInfoIndex % 2
                    ? '1px solid gray'
                    : '1px solid lightgray',
              }"
              :type="policyInfoInputs.type"
              :value="policyInfo[policyInfoInputs.value]"
              @change="
                updatePolicy($event, policyInfoIndex, policyInfoInputs.value)
              "
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

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'userData',
      'accountSettings',
      'userSettings',
      'contacts',
      'appName',
      'patchContactInfo',
      'deleteContactInfo',
      'slctdCntct',
    ]),
  },

  methods: {
    newPolicy() {
      const column = 'Custom1';
      this.contacts[this.userSettings.selectedContactIndex][column].push({});
      // prettier-ignore
      this.patchContactInfo('', column, this.slctdCntct.Custom1.length, 'Date');
    },
    updatePolicy(event, columnIndex, key) {
      // console.log(event);
      const column = 'Custom1';
      let custom1Value =
        event.target.type == 'checkbox'
          ? event.target.checked
          : event.target.value;
      // prettier-ignore
      this.contacts[this.userSettings.selectedContactIndex][column][columnIndex][key] = custom1Value;
      this.patchContactInfo(custom1Value, column, columnIndex, key);
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
  grid-template-columns: calc(100% - 30px) 30px;
}
.policy-info-title-grid-item1 {
  height: 20px;
  overflow: hidden;
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
