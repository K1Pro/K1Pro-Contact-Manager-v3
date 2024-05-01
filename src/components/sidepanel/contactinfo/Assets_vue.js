// import example from './components/example_vue.js';

export default {
  name: 'Assets',

  template: /*html*/ `
        <div class='assets'>
            <div v-for="(asset, assetIndex) in contacts[userSettings.selectedContactIndex]?.Assets">
                <div v-for="(assetInfo, assetType) in asset">
                    <div v-for="assetInputs in accountSettings.contactInfo.keys.Assets[assetType]">
                        <div v-if="assetInputs.icon" class="contact-info-group">
                        <i :class="assetInputs.icon"></i>
                        <input
                            :placeholder="assetInputs.placeholder"
                            :type="assetInputs.type" 
                            v-model="contacts[userSettings.selectedContactIndex].Assets[assetIndex][assetType]" />
                        </div>
                        <input v-else 
                            :placeholder="assetInputs.placeholder"
                            :type="assetInputs.type" 
                            v-model="contacts[userSettings.selectedContactIndex].Assets[assetIndex][assetType]" />
                    </div>
                </div>
                <template v-if="assetIndex === contacts[userSettings.selectedContactIndex]?.Assets.length - 1">
                    <br />
                    <button>Add asset</button>
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
.assets{}`
    );
  },
};
