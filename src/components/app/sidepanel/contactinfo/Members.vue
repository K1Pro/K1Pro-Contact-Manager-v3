<template>
  <div class="members">
    <div v-for="(member, memberIndex) in contacts[slctdCntctIndex]?.Members">
      <div class="member-title-grid-container">
        <div class="member-title">
          <i class="fa-solid fa-user"></i>
          <select
            style="border: none; background-color: transparent"
            :value="member.Type"
            @change="updateMember($event, memberIndex, 'Type')"
          >
            <option v-for="member in Object.keys(accountSettings.contactInfo.keys.Members)" :value="member">
              {{ member }}
            </option>
          </select>
        </div>
        <template v-if="memberIndex === 0">
          <i
            v-if="spinLogin"
            class="spin fa-sharp fa-solid fa-circle-notch"
            style="position: absolute; right: 10px; margin-top: 5px; width: 17px; height: 17px"
          ></i>
          <i v-else class="fa-solid fa-square-plus" style="position: absolute; right: 10px; margin-top: 5px"></i>
        </template>

        <select
          v-if="memberIndex === 0"
          @change="addContactInfo"
          style="
            position: absolute;
            cursor: pointer;
            outline: none;
            right: 10px;
            width: 120px;
            border: none;
            background-color: transparent;
            appearance: none;
          "
        >
          <option selected disabled></option>
          <option v-for="cntctInfo in addCntctInfoDropDown" :value="cntctInfo.InfoGroup + '_' + cntctInfo.InfoKey">
            {{ cntctInfo.InfoKey + cntctInfo.InfoPlaceholder }}
          </option>
          <option value="newContact">New contact</option>
          <option value="deleteContact">Delete contact</option>
        </select>

        <button v-else class="member-button" @click="deleteContactInfo('Members', memberIndex)">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
      <div class="member-grid-container">
        <div
          v-for="memberInputs in accountSettings.contactInfo.keys.Members[
            member.Type ? member.Type : Object.keys(this.accountSettings.contactInfo.keys.Members)[0]
          ]"
          :style="{ flex: '1 0 ' + memberInputsWidth + 'px' }"
        >
          <input
            :type="memberInputs.type"
            :placeholder="memberInputs.placeholder"
            :value="member[memberInputs.value]"
            v-on:blur="updateMember($event, memberIndex, memberInputs.value)"
          />
        </div>
      </div>

      <template v-if="memberIndex === contacts[slctdCntctIndex].Members.length - 1">
        <hr />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Members',

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'accessToken',
      'msg',
      'userData',
      'accountSettings',
      'userSettings',
      'endPts',
      'contacts',
      'times',
      'patchContactInfo',
      'deleteContactInfo',
      'patchUserSettings',
      'slctdCntctIndex',
      'tabContentWidth',
    ]),
    addCntctInfoDropDown() {
      const cntctInfoDropDown = [];
      Object.entries(this.accountSettings.contactInfo.keys).forEach(([contactInfoGroup, contactInfoKeys]) => {
        Object.keys(contactInfoKeys).forEach((contactInfoKey) => {
          const cntctInfoDropDownOpt = {
            InfoGroup: contactInfoGroup,
            InfoKey: contactInfoKey,
            InfoPlaceholder: contactInfoGroup == 'Addresses' ? ' address' : '',
          };
          cntctInfoDropDown.push(cntctInfoDropDownOpt);
        });
      });
      return cntctInfoDropDown;
    },
    memberInputsWidth() {
      return this.tabContentWidth > 120 ? 120 : this.tabContentWidth;
    },
  },

  data() {
    return { clmn: 'Members', spinLogin: false };
  },

  methods: {
    async addContactInfo(event) {
      if (event.srcElement.selectedIndex != 0) {
        const InfoGroup = event.target.value.split('_')[0];
        if (InfoGroup != 'newContact') {
          const InfoKey = event.target.value.split('_')[1];
          event.srcElement.selectedIndex = 0;
          const clmnIndex = this.contacts[this.slctdCntctIndex][InfoGroup].length;
          if (InfoGroup == 'Members' || InfoGroup == 'Addresses') {
            let cloneContacts = [...this.contacts[this.slctdCntctIndex][InfoGroup], { Type: InfoKey }];
            this.contacts[this.slctdCntctIndex][InfoGroup] = cloneContacts;
            this.patchContactInfo(InfoKey, InfoGroup, clmnIndex, 'Type');
          } else {
            let cloneContacts = [...this.contacts[this.slctdCntctIndex][InfoGroup], { [InfoKey]: '' }];
            this.contacts[this.slctdCntctIndex][InfoGroup] = cloneContacts;
            this.patchContactInfo('', InfoGroup, clmnIndex, InfoKey);
          }
        } else {
          event.srcElement.selectedIndex = 0;
          this.spinLogin = true;
          console.log(Object.keys(this.accountSettings.contactInfo.keys.Members)[0]);
          try {
            const response = await fetch(servr_url + this.endPts.contacts, {
              method: 'POST',
              headers: {
                Authorization: this.accessToken,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
              },
              body: JSON.stringify({
                Datetime: this.times.updtngY_m_d_H_i_s_z.slice(0, 16),
                Member: Object.keys(this.accountSettings.contactInfo.keys.Members)[0],
              }),
            });
            const postContactInfoResJSON = await response.json();
            if (postContactInfoResJSON.success) {
              console.log(postContactInfoResJSON);
              const newContactIndex = postContactInfoResJSON.data.contact_id;
              const newMember = {
                id: newContactIndex,
                Members: [
                  {
                    Type: Object.keys(this.accountSettings.contactInfo.keys.Members)[0],
                    Name: '',
                  },
                ],
                Addresses: [],
                Assets: [],
                Connections: [],
                Credentials: [],
                Tasks: [],
                RecurTasks: [],
                Notes: '',
                Categ: '',
                DNC: 0,
                Created: {
                  [this.userData.id]: this.times.updtngY_m_d_H_i_s_z.slice(0, 16),
                },
                Updated: {
                  [this.userData.id]: this.times.updtngY_m_d_H_i_s_z.slice(0, 16),
                },
                Assigned: this.userData.id,
                Log: [],
                Custom1: [],
                Custom2: '',
                Custom3: '',
                Custom4: '',
                Custom5: '',
              };
              let clonedCntcts = this.contacts;
              this.contacts = [...clonedCntcts, newMember];
              this.userSettings.selectedContactIndex = newContactIndex;
              this.patchUserSettings();
              this.spinLogin = false;
            } else {
              this.spinLogin = false;
              this.msg.snackBar = 'Failed to create new contact';
            }
          } catch (error) {
            this.spinLogin = false;
            this.msg.snackBar = 'Failed to create new contact';
            console.log(error.toString());
          }
        }
      }
    },
    updateMember(event, clmnIndex, key) {
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
.members {
}
.member-title-grid-container {
  display: grid;
  grid-template-columns: calc(100% - 34px) 34px;
}
.member-title {
  padding: 5px 0px 5px 0px;
}
.member-button {
  padding: 5px 0px 5px 0px;
  width: 32px;
  background-color: transparent;
  border: 0px;
  cursor: pointer;
}
.member-button:hover {
  color: DimGrey;
}
.member-grid-container {
  display: flex;
  flex-wrap: wrap;
}
.member-grid-container input {
  font-family: 'Helvetica', sans-serif;
  border: 1px solid lightgray;
  border-radius: 0px;
  padding: 5px;
  width: 100%;
  height: 100%;
}
</style>
