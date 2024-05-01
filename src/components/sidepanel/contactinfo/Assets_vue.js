// import example from './components/example_vue.js';

export default {
  name: 'Assets',

  template: /*html*/ `
    <div class='assets'>
        <div v-for="(asset, assetIndex) in contacts[userSettings.selectedContactIndex]?.Assets">
            <div v-for="(assetInfo, assetType) in asset">
                <div v-for="assetInputs in accountSettings.contactInfo.keys.Assets[assetType]">
                    <div v-if="assetInputs.icon" style="position: relative">
                      <i class="asset-icon" :class="assetInputs.icon"></i>
                      <input
                          :placeholder="assetInputs.placeholder"
                          :type="assetInputs.type" 
                          v-model="contacts[userSettings.selectedContactIndex].Assets[assetIndex][assetType]" />
                      <button class="asset-button"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                    <div v-else >
                      <input 
                        :placeholder="assetInputs.placeholder"
                        :type="assetInputs.type" 
                        v-model="contacts[userSettings.selectedContactIndex].Assets[assetIndex][assetType]" />
                      <button class="asset-button"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            </div>
            <template v-if="assetIndex === contacts[userSettings.selectedContactIndex]?.Assets.length - 1">
                <hr>
            </template>
        </div>
    </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'accountSettings',
      'userSettings',
      'endPts',
      'contacts',
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

  //   methods: {},

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
}
`
    );
  },
};