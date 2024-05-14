export default {
  name: 'Custom 1',

  template: /*html*/ `
    <template v-if="slctdCntct && contacts && userSettings && userData?.AppPermissions.ContactManager[0] == 'bundle_insurance'">
      <div class='policy-info'>
        <div class="policy-info-title">
          Policy info for
          {{slctdCntct.Members[0].First ? slctdCntct.Members[0].First : ''}} 
          {{slctdCntct.Members[0].Name}}
        </div>
        <div v-for="policyInfo, policyInfoIndex in slctdCntct.Custom1" class="policy-info-policy" :style="{ 'background-color': policyInfoIndex % 2 ? 'lightblue' : 'white'}">
          <i class="fa-solid fa-trash"></i>
          <div v-for="policyInfoInputs in accountSettings.Custom1">
            <span class="policy-info-label" v-if="!(policyInfo.Policy_Type != 'Home' && policyInfoInputs.value == 'EHV')">{{ policyInfoInputs.placeholder }}:</span>
            <template v-if="policyInfoInputs.type == 'select'">
              <select :style="{ 'background-color': policyInfoIndex % 2 ? 'lightblue' : 'white', 'border': policyInfoIndex % 2 ? '1px solid gray' : '1px solid lightgray' }">
                <option v-for="option in policyInfoInputs.options" :selected="option == policyInfo[policyInfoInputs.value]">{{option}}</option>
              </select>
            </template>
            <template v-else-if="policyInfoInputs.type == 'checkbox'">
              <input 
                :type="policyInfoInputs.type" 
                :checked="policyInfo[policyInfoInputs.value] == 1" />
            </template>
            <template v-else-if="policyInfoInputs.type == 'number' && !(policyInfo.Policy_Type != 'Home' && policyInfoInputs.value == 'EHV')">
              <input 
                :style="{ 'background-color': policyInfoIndex % 2 ? 'lightblue' : 'white', 'border': policyInfoIndex % 2 ? '1px solid gray' : '1px solid lightgray' }"
                :type="policyInfoInputs.type" 
                :value="policyInfo[policyInfoInputs.value]" />
            </template>
            <template v-else>
              <input 
                v-if="policyInfoInputs.type != 'number'"
                :style="{ 'background-color': policyInfoIndex % 2 ? 'lightblue' : 'white', 'border': policyInfoIndex % 2 ? '1px solid gray' : '1px solid lightgray' }"
                :type="policyInfoInputs.type" 
                :value="policyInfo[policyInfoInputs.value]" />
            </template>
          </div>
        </div>
      </div>
    </template>
    `,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'userData',
      'accountSettings',
      'userSettings',
      'contacts',
      'slctdCntct',
    ]),
  },

  mounted() {
    style(
      'custom-1',
      /*css*/ `
.policy-info {background-color: lightblue;}
.policy-info-title{
  font-weight: bold;
  padding: 5px;
  color: black;
}
.policy-info-policy{
  padding: 10px 10px 0px 10px;
}
.policy-info-policy i {
  float: right;
  font-size: 14px;
}
.policy-info-policy div{}
.policy-info-label {
  padding-bottom: 10px;
  font-size: 14px;
  display: inline-block;
  width: 100px;
  text-align: right;
}
.policy-info-policy input:not([type=checkbox]), .policy-info-policy select{
  width: calc(100% - 140px);
  height: 20px;
  font-family: 'Helvetica', sans-serif;
  border-radius: 1px;
}
`
    );
  },
};
