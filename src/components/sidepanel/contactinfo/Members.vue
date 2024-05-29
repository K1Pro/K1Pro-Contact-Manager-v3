<template>
  <div class="members">
    <div v-for="(member, memberIndex) in slctdCntct?.Members">
      <div class="member-title-grid-container">
        <div class="member-title">
          <i class="fa-solid fa-user">&nbsp;</i>{{ member.Type }}
        </div>
        <i
          v-if="memberIndex === 0"
          class="fa-solid fa-square-plus"
          style="position: absolute; right: 10px; margin-top: 5px"
        ></i>
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
          <option
            v-for="cntctInfo in addCntctInfoDropDown"
            :value="cntctInfo.InfoGroup + '_' + cntctInfo.InfoKey"
          >
            {{ cntctInfo.InfoKey + cntctInfo.InfoPlaceholder }}
          </option>
          <option value="newContact">New contact</option>
          <option value="deleteContact">Delete contact</option>
        </select>

        <button
          v-else
          class="member-button"
          @click="deleteContactInfo('Members', memberIndex)"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
      <div
        :class="
          'member-grid-container' +
          Object.values(accountSettings.contactInfo.keys.Members[member.Type])
            .length
        "
      >
        <div
          class="member-grid-item"
          v-for="memberInputs in accountSettings.contactInfo.keys.Members[
            member.Type
          ]"
        >
          <input
            :type="memberInputs.type"
            :placeholder="memberInputs.placeholder"
            :value="member[memberInputs.value]"
            @change="updateMember($event, memberIndex, memberInputs.value)"
          />
        </div>
      </div>
      <template v-if="memberIndex === slctdCntct.Members.length - 1">
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
      'slctdCntct',
      'updatingContactInfo',
    ]),
    addCntctInfoDropDown() {
      const cntctInfoDropDown = [];
      Object.entries(this.accountSettings.contactInfo.keys).forEach(
        ([contactInfoGroup, contactInfoKeys]) => {
          Object.keys(contactInfoKeys).forEach((contactInfoKey) => {
            const test = {
              InfoGroup: contactInfoGroup,
              InfoKey: contactInfoKey,
              InfoPlaceholder:
                contactInfoGroup == 'Properties' ? ' address' : '',
            };
            cntctInfoDropDown.push(test);
          });
        }
      );
      return cntctInfoDropDown;
    },
  },

  methods: {
    async addContactInfo(event) {
      this.updatingContactInfo = true;
      const InfoGroup = event.target.value.split('_')[0];
      if (InfoGroup != 'newContact') {
        const InfoKey = event.target.value.split('_')[1];
        // prettier-ignore
        const columnIndex = this.contacts[this.userSettings.selectedContactIndex][InfoGroup].length;
        if (InfoGroup == 'Members' || InfoGroup == 'Properties') {
          // prettier-ignore
          this.contacts[this.userSettings.selectedContactIndex][InfoGroup].push({ ['Type']: InfoKey });
          this.patchContactInfo(InfoKey, InfoGroup, columnIndex, 'Type');
        } else {
          // prettier-ignore
          this.contacts[this.userSettings.selectedContactIndex][InfoGroup].push({ [InfoKey]: '' });
          this.patchContactInfo('', InfoGroup, columnIndex, InfoKey);
        }
      } else {
        const newMember = {
          Assets: [],
          Assigned: this.userData.id,
          Categ: '',
          Connections: [],
          Created: {
            [this.userData.id]: this.times.Y_m_d_H_i_s_z.slice(0, 16),
          },
          Custom1: [],
          Custom2: '',
          Custom3: '',
          Custom4: '',
          Custom5: '',
          DNC: 0,
          id: '',
          Log: [],
          Members: [
            {
              Type: Object.keys(
                this.accountSettings.contactInfo.keys.Members
              )[0],
              Name: '',
            },
          ],
          Notes: '',
          Properties: [],
          RecurTasks: [],
          Tasks: [],
          Updated: {
            [this.userData.id]: this.times.Y_m_d_H_i_s_z.slice(0, 16),
          },
        };
        this.contacts.push(newMember);
        const newContactIndex = this.contacts.length - 1;
        this.userSettings.selectedContactIndex = newContactIndex;
        this.patchUserSettings();

        try {
          const response = await fetch(servr_url + this.endPts.contacts, {
            method: 'POST',
            headers: {
              Authorization: this.accessToken,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
            body: JSON.stringify({
              Datetime: this.times.Y_m_d_H_i_s_z.slice(0, 16),
              Member: Object.keys(
                this.accountSettings.contactInfo.keys.Members
              )[0],
            }),
          });
          const postContactInfoResJSON = await response.json();
          if (postContactInfoResJSON.success) {
            this.contacts[newContactIndex].id =
              postContactInfoResJSON.data.contact_id;
            this.updatingContactInfo = false;
          } else {
            this.updatingContactInfo = false;
          }
        } catch (error) {
          this.updatingContactInfo = false;
          this.msg.snackBar = error.toString();
          console.log(error.toString());
        }
      }
      event.srcElement.selectedIndex = 0;
    },
    updateMember(event, columnIndex, key) {
      const column = 'Members';
      // prettier-ignore
      this.contacts[this.userSettings.selectedContactIndex][column][columnIndex][key] = event.target.value;
      this.patchContactInfo(event.target.value, column, columnIndex, key);
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
.member-grid-container1 {
  display: grid;
  grid-template-columns: 100%;
}
.member-grid-container2 {
  display: grid;
  grid-template-columns: 50% 50%;
}
.member-grid-container3 {
  display: grid;
  grid-template-columns: 33% 33% 33%;
}
.member-grid-item {
}
.member-grid-item input[type='text'] {
  border-top: 1px;
  border-right: 0px;
  border-bottom: 1px;
  border-left: 0px;
  padding: 5px;
  width: 100%;
  height: 100%;
}
.member-grid-item input[type='date'] {
  font-family: 'Helvetica', sans-serif;
  border-top: 1px;
  border-right: 0px;
  border-bottom: 1px;
  border-left: 0px;
  padding: 5px;
  width: 100%;
  height: 100%;
}
</style>
