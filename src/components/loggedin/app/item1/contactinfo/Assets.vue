<template>
  <div class="assets">
    <div v-for="(asset, assetIndex) in contacts[slctdCntctIndex]?.Assets">
      <div v-for="(assetInfo, assetType) in asset">
        <div v-for="assetInputs in sttngs.entity.contactInfo.keys.Assets[assetType]">
          <div v-if="assetInputs.icon" style="position: relative">
            <i class="asset-icon" :class="assetInputs.icon"></i>
            <input
              :placeholder="assetInputs.placeholder"
              :type="assetInputs.type"
              :value="assetInfo"
              :disabled="dsbld || userRole < 4 || (userRole < 7 && contacts[slctdCntctIndex].Assigned != userData.id)"
              :readonly="dsbld || userRole < 4 || (userRole < 7 && contacts[slctdCntctIndex].Assigned != userData.id)"
              @change="updateAsset($event.target.value, assetIndex, assetType)"
              :style="{
                'border-bottom':
                  assetIndex !== contacts[slctdCntctIndex].Assets.length - 1 ? '2px solid lightgray' : '0',
                width:
                  !dsbld && (userRole > 5 || contacts[slctdCntctIndex].Assigned == userData.id)
                    ? 'calc(100% - 30px)'
                    : '100%',
              }"
              style="background-color: #ffffff; opacity: 1"
            />
            <button
              v-if="!dsbld && (userRole > 5 || contacts[slctdCntctIndex].Assigned == userData.id)"
              class="asset-button"
              :disabled="dsbld"
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
              :disabled="dsbld || userRole < 4 || (userRole < 7 && contacts[slctdCntctIndex].Assigned != userData.id)"
              :readonly="dsbld || userRole < 4 || (userRole < 7 && contacts[slctdCntctIndex].Assigned != userData.id)"
              @change="updateAsset($event.target.value, assetIndex, assetType)"
              :style="{
                width:
                  !dsbld && (userRole > 5 || contacts[slctdCntctIndex].Assigned == userData.id)
                    ? 'calc(100% - 30px)'
                    : '100%',
              }"
              style="background-color: #ffffff; opacity: 1"
            />
            <button
              v-if="!dsbld && (userRole > 5 || contacts[slctdCntctIndex].Assigned == userData.id)"
              class="asset-button"
              :disabled="dsbld"
              @click="deleteContactInfo('Assets', assetIndex)"
            >
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

  inject: [
    'contacts',
    'deleteContactInfo',
    'dsbld',
    'patchContactInfo',
    'sttngs',
    'slctdCntctIndex',
    'userData',
    'userRole',
  ],

  data() {
    return { clmn: 'Assets' };
  },

  methods: {
    updateAsset(event, clmnIndex, key) {
      const oldCntct = JSON.parse(JSON.stringify(this.contacts[this.slctdCntctIndex]));
      event = typeof event === 'boolean' ? event : event.trim();
      this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key] = event;
      this.patchContactInfo({ [key]: event }, this.clmn, clmnIndex, oldCntct, this.slctdCntctIndex);
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
