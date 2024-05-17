// import example from './components/example_vue.js';

export default {
  name: 'Assets',

  template: /*html*/ `
    <div class='assets'>
        <div v-for="(asset, assetIndex) in slctdCntct?.Assets">
            <div v-for="(assetInfo, assetType) in asset">
                <div v-for="assetInputs in accountSettings.contactInfo.keys.Assets[assetType]">
                    <div v-if="assetInputs.icon" style="position: relative">
                      <i class="asset-icon" :class="assetInputs.icon"></i>
                      <input
                          :placeholder="assetInputs.placeholder"
                          :type="assetInputs.type" 
                          :value="assetInfo"
                          @change="updateAsset($event, assetIndex, assetType)" />
                      <button class="asset-button" @click="deleteContactInfo('Assets', assetIndex)"><i class="fa-solid fa-trash"></i></button>
                    </div>
                    <div v-else >
                      <input 
                        :placeholder="assetInputs.placeholder"
                        :type="assetInputs.type" 
                        :value="assetInfo"
                        @change="updateAsset($event, assetIndex, assetType)" />
                      <button class="asset-button" @click="deleteContactInfo('Assets', assetIndex)"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>
            <template v-if="assetIndex === slctdCntct.Assets.length - 1">
                <hr>
            </template>
        </div>
    </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'accountSettings',
      'userSettings',
      'contacts',
      'patchContactInfo',
      'deleteContactInfo',
      'slctdCntct',
    ]),
  },

  //   components: {
  //     example,
  //   },

  //   props: [''],

  //   emits: [''],

  //   data() {
  //     return {};
  //   },

  methods: {
    updateAsset(event, columnIndex, key) {
      const column = 'Assets';
      // prettier-ignore
      this.contacts[this.userSettings.selectedContactIndex][column][columnIndex][key] = event.target.value;
      this.patchContactInfo(event.target.value, column, columnIndex, key);
    },
  },

  mounted() {
    style(
      'assets',
      /*css*/ `
.assets{}
.asset-icon {
  position: absolute;
  top: 6px;
  left: 6px;
  color: grey;
  z-index: 1;
}
.assets input[type='text'] {
  width: calc(100% - 32px);
  padding: 6px 6px 6px 30px;
}
.asset-button{
  padding: 6px;
  width: 32px;
  background-color: transparent;
  border: 0px;
  cursor: pointer;
}
`
    );
  },
};
