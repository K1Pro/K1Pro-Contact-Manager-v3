<template>
  <div class="connections">
    <div v-for="(conn, connIndex) in connections">
      <div v-for="(connInfo, connType) in conn">
        <div v-for="connInputs in sttngs.entity.contactInfo.keys.Connections[connType]">
          <button
            class="conn-icon"
            :style="{
              'border-right': '2px solid lightgray',
              'border-bottom':
                connIndex !== contacts[slctdCntctIndex].Connections.length - 1 ? '2px solid lightgray' : '0',
            }"
            @click="connect(conn.RealIndex, connType)"
            :disabled="dsbld || userRole < 4"
          >
            <i :class="connInputs.icon"></i>
          </button>
          <button
            class="conn-icon"
            v-if="connInputs.sms"
            :style="{
              'border-right': '2px solid lightgray',
              'border-bottom':
                connIndex !== contacts[slctdCntctIndex].Connections.length - 1 ? '2px solid lightgray' : '0',
            }"
            @click="
              slctd.sideMenuLnk = ['Chat', 'Chatbox'];
              slctd.smsGroup = connInfo;
              slctd.chatType = 'SMS';
            "
          >
            <i class="fa-solid fa-comment-sms"></i>
          </button>
          <input
            :type="connInputs.type"
            :placeholder="connInputs.placeholder"
            :style="{
              'border-bottom':
                connIndex !== contacts[slctdCntctIndex].Connections.length - 1 ? '2px solid lightgray' : '0',
              width:
                !dsbld && (userRole > 5 || contacts[slctdCntctIndex].Assigned == userData.id)
                  ? 'calc(100% - ' + (connInputs.sms ? '90px' : '60px') + ')'
                  : 'calc(100% - ' + (connInputs.sms ? '60px' : '30px') + ')',
            }"
            style="background-color: #ffffff; opacity: 1"
            :value="connInfo"
            :readonly="dsbld || userRole < 4 || (userRole < 7 && contacts[slctdCntctIndex].Assigned != userData.id)"
            :disabled="dsbld || userRole < 4 || (userRole < 7 && contacts[slctdCntctIndex].Assigned != userData.id)"
            @change="updateConnection($event.target.value, conn.RealIndex, connType)"
          />
          <button
            v-if="!dsbld && (userRole > 5 || contacts[slctdCntctIndex].Assigned == userData.id)"
            class="conn-delete-icon"
            @click="deleteContactInfo('Connections', conn.RealIndex)"
            :disabled="dsbld"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
      <template v-if="connIndex === contacts[slctdCntctIndex].Connections.length - 1">
        <input
          type="checkbox"
          v-model="contacts[slctdCntctIndex].DNC"
          :disabled="dsbld || (userRole < 6 && contacts[slctdCntctIndex].Assigned != userData.id)"
          @change="updateDNC($event.target.checked, 'DNC')"
        />
        Do not contact
        <hr />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Connections',

  inject: [
    'appName',
    'contacts',
    'deleteContactInfo',
    'dsbld',
    'patchContactInfo',
    'sttngs',
    'slctd',
    'slctdCntctIndex',
    'times',
    'userData',
    'userRole',
  ],

  computed: {
    connections() {
      if (this.contacts === null || this.contacts.length === 0) {
        return [];
      } else {
        return this.contacts[this.slctdCntctIndex].Connections.map((val, index) => {
          return { ...val, RealIndex: index };
        }).sort((a, b) => Object.keys(b)[0].localeCompare(Object.keys(a)[0]));
      }
    },
  },

  data() {
    return { clmn: 'Connections' };
  },

  methods: {
    async connect(connIndex, connType) {
      let checkDNC = true;
      if (this.contacts[this.slctdCntctIndex].DNC === true) {
        checkDNC = confirm('Contact is listed as "Do not contact", proceed?') ? true : false;
      }
      if (checkDNC) {
        if (connType == 'Phone') {
          window.location.href =
            'tel:' + this.contacts[this.slctdCntctIndex].Connections[connIndex][connType].replace(/\D/g, '');
          const newConn = {
            frm: this.userData.id,
            dat: this.times.updtngY_m_d_H_i_s_z.slice(0, 16),
            tow: this.contacts[this.slctdCntctIndex].Connections[connIndex][connType].replace(/\D/g, ''),
          };
          const cloneCntct = this.contacts[this.slctdCntctIndex];
          cloneCntct.Tel.unshift(newConn);
          this.patchContactInfo(newConn, 'Tel', this.contacts[this.slctdCntctIndex].Tel.length - 1, cloneCntct);
        }
        if (connType == 'Email') {
          this.slctd.sideMenuLnk = ['Contactinfo', 'Emails'];
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    },
    updateConnection(event, clmnIndex, key) {
      event = typeof event === 'boolean' ? event : event.trim();
      if (
        (event != this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key] && event != '') ||
        (event == '' && this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key])
      ) {
        const cloneCntct = this.contacts[this.slctdCntctIndex];
        cloneCntct[this.clmn][clmnIndex][key] = event;
        this.patchContactInfo({ [key]: event }, this.clmn, clmnIndex, cloneCntct);
      }
    },
    updateDNC(event, clmn) {
      event = typeof event === 'boolean' ? event : event.trim();
      const cloneCntct = this.contacts[this.slctdCntctIndex];
      cloneCntct[clmn] = event;
      this.patchContactInfo(event, clmn, null, cloneCntct);
    },
  },
};
</script>

<style>
.connections input {
  border: none;
  border-radius: 0px;
}
.conn-icon {
  padding: 5px;
  width: 30px;
  border: none;
  border-radius: 0px;
  cursor: pointer;
}
.conn-icon:hover {
  color: DimGrey;
}
.conn-delete-icon {
  padding: 5px;
  width: 30px;
  background-color: transparent;
  border: 0px;
  cursor: pointer;
}
.conn-delete-icon:hover {
  color: DimGrey;
}
.connections input[type='text'] {
  padding: 5px;
}
.connections input[type='text']:focus {
  outline: none;
}
.connections input[type='checkbox'] {
  margin: 0px;
  margin-top: 5px;
  margin-right: 0px;
  width: 30px;
}
</style>
