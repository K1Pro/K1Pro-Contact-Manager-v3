<template>
  <div class="assets">
    <div v-for="(asset, assetIndex) in slctdCntct?.Assets">
      <div v-for="(assetInfo, assetType) in asset">
        <div
          v-for="assetInputs in accountSettings.contactInfo.keys.Assets[
            assetType
          ]"
        >
          <div v-if="assetInputs.icon" style="position: relative">
            <i class="asset-icon" :class="assetInputs.icon"></i>
            <input
              :style="{
                'border-bottom':
                  assetIndex !== slctdCntct.Assets.length - 1
                    ? '1px solid black'
                    : '0',
              }"
              :placeholder="assetInputs.placeholder"
              :type="assetInputs.type"
              :value="assetInfo"
              @change="updateAsset($event, assetIndex, assetType)"
            />
            <button
              class="asset-button"
              @click="deleteContactInfo('Assets', assetIndex)"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
          <div v-else>
            <input
              :placeholder="assetInputs.placeholder"
              :type="assetInputs.type"
              :value="assetInfo"
              @change="updateAsset($event, assetIndex, assetType)"
            />
            <button
              class="asset-button"
              @click="deleteContactInfo('Assets', assetIndex)"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
      <template v-if="assetIndex === slctdCntct.Assets.length - 1">
        <hr />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Assets',

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

  methods: {
    updateAsset(event, columnIndex, key) {
      const column = 'Assets';
      // prettier-ignore
      this.contacts[this.userSettings.selectedContactIndex][column][columnIndex][key] = event.target.value;
      this.patchContactInfo(event.target.value, column, columnIndex, key);
    },
  },
};
</script>

<style>
.assets {
}
.asset-icon {
  position: absolute;
  top: 5px;
  left: 5px;
  color: grey;
  z-index: 1;
}
.assets input[type='text'] {
  width: calc(100% - 30px);
  padding: 5px 5px 5px 30px;
  border: none;
}
.asset-button {
  padding: 5px;
  width: 30px;
  background-color: transparent;
  border: 0px;
  cursor: pointer;
}
.asset-button:hover {
  color: DimGrey;
}
</style>
