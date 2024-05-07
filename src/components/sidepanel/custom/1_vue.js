export default {
  name: 'Custom 1',

  template: /*html*/ `
    <template v-if="slctdCntct && contacts && userSettings && userData?.AppPermissions.ContactManager[0] == 'bundle_insurance'">
      <div class='policy-info'>
        <div class="policy-info-title">
          Policy info for
          {{Object.values(slctdCntct.Members[0])[0].First ? Object.values(slctdCntct.Members[0])[0].First : ''}} 
          {{Object.values(slctdCntct.Members[0])[0].Name}}
        </div>
        <div v-for="policyInfo, policyInfoIndex in slctdCntct.Custom1" class="policy-info-policy" :style="{ 'background-color': policyInfoIndex % 2 ? 'lightblue' : 'white'}">
          <template v-for="policyInfoInputs in accountSettings.contactInfo.keys.Custom1">
            <template v-if="policyInfoInputs.type == 'select'">
              <select>
                <option v-for="option in policyInfoInputs.options" :selected="option == policyInfo[policyInfoInputs.value]">{{option}}</option>
              </select>
            </template>
            <template v-else>
              <input 
              :type="policyInfoInputs.type" 
              :placeholder="policyInfoInputs.placeholder"
              :value="policyInfo[policyInfoInputs.value]" />
            </template>
          </template>
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
    padding: 5px;
  }
  .policy-info-policy input{
    width: 100%;
    font-family: 'Helvetica', sans-serif;
    padding: 5px;
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-width: 1px;
    background: transparent;
  }
  .policy-info-policy select{
    width: 100%;
    font-family: 'Helvetica', sans-serif;
    padding: 5px 0px 5px 0px;
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-width: 1px;
    background: transparent;
  }
        `
    );
  },
};
