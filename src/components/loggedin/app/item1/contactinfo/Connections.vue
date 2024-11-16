<template>
  <div class="connections">
    <div v-for="(conn, connIndex) in connections">
      <div v-for="(connInfo, connType) in conn">
        <div v-for="connInputs in accountSettings.contactInfo.keys.Connections[connType]">
          <button
            class="conn-icon"
            :style="{
              'border-bottom':
                connIndex !== contacts[slctdCntctIndex].Connections.length - 1 ? '2px solid lightgray' : '0',
            }"
            @click="connect(conn.RealIndex, connType)"
            :disabled="dsbld || userRole < 4"
          >
            <i :class="connInputs.icon"></i>
          </button>
          <input
            :type="connInputs.type"
            :placeholder="connInputs.placeholder"
            :style="{
              'border-bottom':
                connIndex !== contacts[slctdCntctIndex].Connections.length - 1 ? '2px solid lightgray' : '0',
              width:
                !dsbld && (userRole > 5 || contacts[slctdCntctIndex].Assigned == userData.id)
                  ? 'calc(100% - 60px)'
                  : 'calc(100% - 30px)',
            }"
            style="background-color: #ffffff; opacity: 1"
            :value="connInfo"
            :readonly="dsbld || userRole < 4 || (userRole < 7 && contacts[slctdCntctIndex].Assigned != userData.id)"
            :disabled="dsbld || userRole < 4 || (userRole < 7 && contacts[slctdCntctIndex].Assigned != userData.id)"
            @change="updateConnection($event, conn.RealIndex, connType)"
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

  emits: ['sideMenuSlctdLnk'],

  inject: [
    'accountSettings',
    'appName',
    'contacts',
    'deleteContactInfo',
    'dsbld',
    'patchContactInfo',
    'slctdCntctIndex',
    'times',
    'userData',
    'userRole',
    'userSettings',
  ],

  computed: {
    connections() {
      return this.contacts[this.slctdCntctIndex].Connections.map((val, index) => {
        return { ...val, RealIndex: index };
      }).sort((a, b) => Object.keys(b)[0].localeCompare(Object.keys(a)[0]));
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
          const clmnIndex = this.slctdCntctIndex;
          try {
            const response = await fetch(app_api_url + '/calls', {
              method: 'POST',
              headers: {
                Authorization: access_token,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
              },
              body: JSON.stringify({
                ID: this.userSettings.selectedContactIndex,
                Datetime: this.times.updtngY_m_d_H_i_s_z.slice(0, 16),
                Phone: this.contacts[this.slctdCntctIndex].Connections[connIndex][connType],
              }),
            });
            const postConnectResJSON = await response.json();
            if (postConnectResJSON.success) {
              // this.msg.snackBar = 'Updated ';
              this.contacts[clmnIndex].Log.unshift([
                this.userData.id,
                this.times.updtngY_m_d_H_i_s_z.slice(0, 16),
                'Called ' + this.contacts[clmnIndex].Connections[connIndex][connType],
              ]);
            } else {
            }
          } catch (error) {
            // this.msg.snackBar = error.toString();
            console.log(error.toString());
          }
        }
        if (connType == 'Email') {
          this.$emit('sideMenuSlctdLnk', ['Contactinfo', 'Emails']);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    },
    updateConnection(event, clmnIndex, key) {
      if (
        (event.target.value != this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key] &&
          event.target.value != '') ||
        (event.target.value == '' && this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key])
      ) {
        const cloneCntct = this.contacts[this.slctdCntctIndex];
        cloneCntct[this.clmn][clmnIndex][key] = event.target.value;
        this.patchContactInfo(event.target.value, this.clmn, clmnIndex, key, cloneCntct);
      }
    },
    updateDNC(event, clmn) {
      const cloneCntct = this.contacts[this.slctdCntctIndex];
      cloneCntct[clmn] = event;
      this.patchContactInfo(event, clmn, null, null, cloneCntct);
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
