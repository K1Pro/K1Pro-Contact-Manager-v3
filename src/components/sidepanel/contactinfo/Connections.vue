<template>
  <div class="connections">
    <div v-for="(conn, connIndex) in connections">
      <div v-for="(connInfo, connType) in conn">
        <div v-for="connInputs in accountSettings.contactInfo.keys.Connections[connType]">
          <button
            class="conn-icon"
            :style="{
              'border-bottom': connIndex !== contacts[slctdCntctIndex].Connections.length - 1 ? '1px solid black' : '0',
            }"
            @click="connect(conn.RealIndex, connType)"
          >
            <i :class="connInputs.icon"></i>
          </button>
          <input
            :type="connInputs.type"
            :placeholder="connInputs.placeholder"
            :style="{
              'border-bottom': connIndex !== contacts[slctdCntctIndex].Connections.length - 1 ? '1px solid black' : '0',
            }"
            :value="connInfo"
            @change="updateConnection($event, conn.RealIndex, connType)"
          />
          <button class="conn-delete-icon" @click="deleteContactInfo('Connections', conn.RealIndex)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
      <template v-if="connIndex === contacts[slctdCntctIndex].Connections.length - 1">
        <input
          type="checkbox"
          v-model="contacts[slctdCntctIndex].DNC"
          @change="patchContactInfo($event.target.checked, 'DNC')"
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

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'accessToken',
      'activeWindow',
      'userData',
      'accountSettings',
      'userSettings',
      'contacts',
      'endPts',
      'times',
      'patchContactInfo',
      'deleteContactInfo',
      'slctdCntctIndex',
    ]),
    connections() {
      return this.contacts[this.slctdCntctIndex].Connections.map((val, index) => {
        return { ...val, RealIndex: index };
      }).sort((a, b) => Object.keys(b)[0].localeCompare(Object.keys(a)[0]));
    },
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
          const columnIndex = this.slctdCntctIndex;
          try {
            const response = await fetch(servr_url + this.endPts.calls, {
              method: 'POST',
              headers: {
                Authorization: this.accessToken,
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
              this.contacts[columnIndex].Log.unshift([
                this.userData.id,
                this.times.updtngY_m_d_H_i_s_z.slice(0, 16),
                'Called ' + this.contacts[this.slctdCntctIndex].Connections[connIndex][connType],
              ]);
            } else {
            }
          } catch (error) {
            this.msg.snackBar = error.toString();
            console.log(error.toString());
          }
        }
        if (connType == 'Email') {
          this.activeWindow = 'email';
        }
      }
    },
    updateConnection(event, columnIndex, key) {
      const column = 'Connections';
      this.contacts[this.slctdCntctIndex][column][columnIndex][key] = event.target.value;
      this.patchContactInfo(event.target.value, column, columnIndex, key);
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
  width: calc(100% - 60px);
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
