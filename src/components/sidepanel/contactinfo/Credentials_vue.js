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
                                :ref="'credInput' + credIndex"
                                :style="{'border-bottom': credIndex !== slctdCntct.Credentials.length - 1 ? '1px solid black' : '0'}"
                                @change="updateCred($event, credIndex, credType)"
                                @focusin="revealCred(credIndex)" />
                            <button class="cred-reveal" style="color: grey" @click="toggleCred(credIndex)">
                                <span :ref="'credIcon' + credIndex" class="fa-solid fa-eye"></span>
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

  mounted() {
    style(
      'credentials',
      /*css*/ `
  .credentials{}
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
  .credentials input[type='text'], .credentials input[type='password'] {
    width: calc(100% - 30px);
    padding: 5px 35px 5px 30px;
    border: none;
    border-radius: 0px;
  }
  .cred-reveal {
    width: 30px;
    position: absolute;
    top: 5px;
    right: 35px;
    background: none;
    border: none;
    cursor: pointer;
  }
  .cred-button{
    padding: 5px;
    width: 30px;
    background-color: transparent;
    border: 0px;
    cursor: pointer;
  }
  .cred-button:hover{
    color: DimGrey;
  }
  `
    );
  },
};
