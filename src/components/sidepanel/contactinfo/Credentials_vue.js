// import example from './components/example_vue.js';

export default {
  name: 'Credentials',

  template: /*html*/ `
      <div class='credentials'>
          <div v-for="(cred, credIndex) in slctdCntct?.Credentials">
              <div v-for="(credInfo, credType) in cred">
                  <div v-for="credInputs in accountSettings.contactInfo.keys.Credentials[credType]">
                      <div style="position: relative">
                        <div class="credentials-group">
                            <i class="cred-icon" :class="credInputs.icon"></i>
                            <input
                                :placeholder="credInputs.placeholder"
                                :type="credInputType"
                                :value="credInfo"
                                :ref="'cred' + credIndex"
                                @change="updateCred($event, credIndex, credType)" />
                            <button class="cred-reveal" style="color: grey" @click="revealCred(credIndex)">
                                <span
                                v-if="credInputType == 'password'"
                                class="fa-solid fa-eye"
                                ></span>
                                <span
                                v-if="credInputType == 'text'"
                                class="fa-solid fa-eye-slash"
                                ></span>
                            </button>
                            <button class="cred-button" @click="deleteContactInfo('Credentials', credIndex)"><i class="fa-solid fa-trash"></i></button>
                        </div>
                      </div>
                  </div>
              </div>
              <template v-if="credIndex === slctdCntct.Credentials.length - 1">
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

  data() {
    return { credInputType: 'password' };
  },

  methods: {
    updateCred(event, columnIndex, key) {
      const column = 'Credentials';
      // prettier-ignore
      this.contacts[this.userSettings.selectedContactIndex][column][columnIndex][key] = event.target.value;
      this.patchContactInfo(event.target.value, column, columnIndex, key);
    },
    revealCred(credIndex) {
      this.$refs['cred' + credIndex][0].type == 'password'
        ? (this.$refs['cred' + credIndex][0].type = 'text')
        : (this.$refs['cred' + credIndex][0].type = 'password');
      //   this.credInputType == 'password'
      //     ? (this.credInputType = 'text')
      //     : (this.credInputType = 'password');
    },
  },

  mounted() {
    style(
      'credentials',
      /*css*/ `
  .credentials{}
  .cred-icon {
    position: absolute;
    top: 6px;
    left: 6px;
    color: grey;
    z-index: 1;
  }
  .credentials-group {
    position: relative;
  }
  .credentials input[type='text'], .credentials input[type='password'] {
    width: calc(100% - 32px);
    padding: 6px 6px 6px 30px;
  }
  .cred-reveal {
    width: 30px;
    position: absolute;
    top: 7px;
    right: 42px;
    background: none;
    border: none;
    cursor: pointer;
  }
  .cred-button{
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
