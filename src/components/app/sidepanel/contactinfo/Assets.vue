<template>
  <div class="assets">
    <div v-for="(asset, assetIndex) in contacts[slctdCntctIndex]?.Assets">
      <div v-for="(assetInfo, assetType) in asset">
        <div v-for="assetInputs in accountSettings.contactInfo.keys.Assets[assetType]">
          <div v-if="assetInputs.icon" style="position: relative">
            <i class="asset-icon" :class="assetInputs.icon"></i>
            <input
              :style="{
                'border-bottom':
                  assetIndex !== contacts[slctdCntctIndex].Assets.length - 1 ? '2px solid lightgray' : '0',
              }"
              :placeholder="assetInputs.placeholder"
              :type="assetInputs.type"
              :value="assetInfo"
              :disabled="dsbld"
              @change="updateAsset($event, assetIndex, assetType)"
            />
            <button class="asset-button" @click="deleteContactInfo('Assets', assetIndex)" :disabled="dsbld">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
          <div v-else>
            <input
              :placeholder="assetInputs.placeholder"
              :type="assetInputs.type"
              :value="assetInfo"
              :disabled="dsbld"
              @change="updateAsset($event, assetIndex, assetType)"
            />
            <button class="asset-button" @click="deleteContactInfo('Assets', assetIndex)" :disabled="dsbld">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
      <template v-if="assetIndex === contacts[slctdCntctIndex].Assets.length - 1">
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
      'dsbld',
      'patchContactInfo',
      'deleteContactInfo',
      'slctdCntctIndex',
    ]),
  },

  data() {
    return { clmn: 'Assets' };
  },

  methods: {
    updateAsset(event, clmnIndex, key) {
      if (
        (event.target.value != this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key] &&
          event.target.value != '') ||
        (event.target.value == '' && this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key])
      ) {
        this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key] = event.target.value;
        this.patchContactInfo(event.target.value, this.clmn, clmnIndex, key);
      }
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
