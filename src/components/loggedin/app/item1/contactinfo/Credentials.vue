<template>
  <div class="credentials">
    <div v-for="(cred, credIndex) in contacts[slctdCntctIndex]?.Credentials">
      <div v-for="(credInfo, credType) in cred">
        <div v-for="credInputs in sttngs.entity.contactInfo.keys.Credentials[credType]">
          <div style="position: relative">
            <div class="credentials-group">
              <i class="cred-icon" :class="credInputs.icon"></i>
              <input
                autocomplete="new-password"
                :placeholder="credInputs.placeholder"
                :type="credInputType"
                :value="credInfo"
                :ref="'credInput' + credIndex"
                :disabled="dsbld || userRole < 4 || (userRole < 7 && contacts[slctdCntctIndex].Assigned != userData.id)"
                :readonly="dsbld || userRole < 4 || (userRole < 7 && contacts[slctdCntctIndex].Assigned != userData.id)"
                @change="updateCred($event.target.value, credIndex, credType)"
                @focusin="revealCred(credIndex)"
                :style="{
                  'border-bottom':
                    credIndex !== contacts[slctdCntctIndex].Credentials.length - 1 ? '1px solid black' : '0',
                  width:
                    !dsbld && (userRole > 5 || contacts[slctdCntctIndex].Assigned == userData.id)
                      ? 'calc(100% - 30px)'
                      : '100%',
                }"
                style="background-color: #ffffff; opacity: 1"
              />
              <button
                class="cred-reveal"
                @click="toggleCred(credIndex)"
                :style="{
                  right: !dsbld && (userRole > 5 || contacts[slctdCntctIndex].Assigned == userData.id) ? '35px' : '0px',
                }"
                style="color: grey"
              >
                <span :ref="'credIcon' + credIndex" class="fa-solid fa-eye"></span>
              </button>
              <button
                class="cred-button"
                :disabled="dsbld"
                v-if="!dsbld && (userRole > 5 || contacts[slctdCntctIndex].Assigned == userData.id)"
                @click="deleteContactInfo('Credentials', credIndex)"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <template v-if="credIndex === contacts[slctdCntctIndex].Credentials.length - 1">
        <hr />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Credentials',

  inject: [
    'appName',
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
    return { clmn: 'Credentials', credInputType: 'password' };
  },

  methods: {
    updateCred(event, clmnIndex, key) {
      event = typeof event === 'boolean' ? event : event.trim();
      if (
        (event != this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key] && event != '') ||
        (event == '' && this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key])
      ) {
        const cloneCntct = this.contacts[this.slctdCntctIndex];
        cloneCntct[this.clmn][clmnIndex][key] = event;
        this.patchContactInfo(event, this.clmn, clmnIndex, key, cloneCntct);
      }
    },
    toggleCred(credIndex) {
      if (this.$refs['credInput' + credIndex][0].type == 'password') {
        this.$refs['credInput' + credIndex][0].type = 'text';
        this.$refs['credIcon' + credIndex][0].classList.remove('fa-eye');
        this.$refs['credIcon' + credIndex][0].classList.add('fa-eye-slash');
      } else {
        this.$refs['credInput' + credIndex][0].type = 'password';
        this.$refs['credIcon' + credIndex][0].classList.remove('fa-eye-slash');
        this.$refs['credIcon' + credIndex][0].classList.add('fa-eye');
      }
    },
    revealCred(credIndex) {
      this.$refs['credInput' + credIndex][0].type = 'text';
      this.$refs['credIcon' + credIndex][0].classList.remove('fa-eye');
      this.$refs['credIcon' + credIndex][0].classList.add('fa-eye-slash');
    },
  },
};
</script>

<style>
.credentials {
}
.cred-icon {
  position: absolute;
  top: 5px;
  left: 10px;
  color: grey;
  z-index: 1;
}
.credentials-group {
  position: relative;
}
.credentials input[type='text'],
.credentials input[type='password'] {
  padding: 5px 35px 5px 30px;
  border: none;
  border-radius: 0px;
}
.cred-reveal {
  width: 30px;
  position: absolute;
  top: 5px;
  background: none;
  border: none;
  cursor: pointer;
}
.cred-button {
  padding: 5px;
  width: 30px;
  background-color: transparent;
  border: 0px;
  cursor: pointer;
}
.cred-button:hover {
  color: DimGrey;
}
</style>
