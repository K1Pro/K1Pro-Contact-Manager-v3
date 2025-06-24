<template>
  <div class="chat">
    <div class="chat-title">Chat</div>
    <div class="chat-body">
      <div
        v-for="([chatGroup, chatGroupMembers], chatGroupIndx) in Object.entries(sttngs.entity.chats).filter(
          ([key, value]) => value.includes(userData.id)
        )"
        class="chat-groups"
        :class="[
          slctd.chatGroup == chatGroup && slctd.chatType == 'Chat'
            ? 'chat-groups-active'
            : 'chat' + (chatGroupIndx % 2),
        ]"
        @click="slctChatGroup(chatGroup)"
      >
        {{ chatGroup }}
        <span v-if="newChats[chatGroup]">{{ newChats[chatGroup] }}</span>
      </div>
      <template v-if="sttngs.entity.sms.enabled === true">
        <template v-if="somePhone">
          <hr />
          <div class="chat-title">
            SMS ({{ contacts[slctdCntctIndex].Members[0].First }} {{ contacts[slctdCntctIndex].Members[0].Name }})
          </div>

          <div
            v-for="(connection, connectionIndx) in connections.filter((connectionType) => connectionType.Phone)"
            class="chat-groups"
            :class="[
              slctd.smsGroup == connection.Phone && slctd.chatType == 'SMS'
                ? 'chat-groups-active'
                : 'chat' + (connectionIndx % 2),
            ]"
            @click="slctSMSGroup(connection.Phone)"
          >
            {{ connection.Phone }}
            <span v-if="newMsgs?.msgs && newMsgs?.msgs?.[connection.Phone?.replace(/[^0-9]/g, '')]">{{
              newMsgs?.msgs?.[connection.Phone?.replace(/[^0-9]/g, '')].amnt
            }}</span>
          </div>
        </template>

        <template v-if="newMsgsFltr">
          <hr />
          <div class="chat-title">New SMS (Others)</div>
          <div
            v-for="([msgKey, msgVal], msgIndx) in Object.entries(newMsgs?.msgs).filter(
              ([key, value]) => value.id != sttngs.user.slctdCntctID
            )"
            class="chat-groups"
            :class="['chat' + (msgIndx % 2)]"
            @click="selectContact(msgKey, msgVal)"
          >
            {{ msgVal.phone }}
            <span v-if="msgVal.amnt">{{ msgVal.amnt }}</span>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chat',

  inject: ['contacts', 'newChats', 'newMsgs', 'sttngsReq', 'sttngs', 'slctd', 'slctdCntctIndex', 'times', 'userData'],

  methods: {
    slctChatGroup(chatGroup) {
      // console.log('whats going on here?');
      this.slctd.chatGroup = chatGroup;
      this.slctd.chatType = 'Chat';
      this.sttngs.user.chats[chatGroup] = this.times.updtngY_m_d_H_i_s_z.slice(0, 19).replace('T', ' ');
      this.sttngsReq('PATCH', 'user');
    },
    slctSMSGroup(SMSGroup) {
      // console.log(SMSGroup);
      this.deleteMsg(SMSGroup);
      this.slctd.smsGroup = SMSGroup;
      this.slctd.chatType = 'SMS';
    },
    selectContact(msgKey, msgVal) {
      this.deleteMsg(msgKey);
      this.slctd.smsGroup = msgVal.smsGroup;
      this.slctd.chatType = 'SMS';
      this.sttngs.user.slctdCntctID = msgVal.id;
      this.sttngsReq('PATCH', 'user');
    },
    async deleteMsg(msgKey) {
      try {
        const response = await fetch(app_api_url + '/msg', {
          method: 'DELETE',
          headers: {
            Authorization: access_token,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            Phone: msgKey.replace(/[^0-9]/g, ''),
          }),
        });
        const resJSON = await response.json();
      } catch (error) {
        console.log(error.toString());
      }
    },
  },

  computed: {
    connections() {
      return this.contacts[this.slctdCntctIndex].Connections;
    },
    somePhone() {
      return this.connections.some((cnnctns) => cnnctns.Phone);
    },
    phoneMatch() {
      return this.slctd.smsGroup ? this.connections.some((cnnctns) => cnnctns.Phone == this.slctd.smsGroup) : false;
    },
    phoneFltr() {
      return this.connections.filter((connectionType) => connectionType.Phone);
    },
    newMsgsFltr() {
      return (
        JSON.stringify(
          Object.entries(this.newMsgs?.msgs)?.filter(([key, value]) => value.id != this.sttngs.user.slctdCntctID)
        ) != '[]'
      );
    },
  },

  mounted() {
    if (this.slctd.chatType == 'SMS' && this.slctd.smsGroup !== null) {
      if (this.somePhone) {
        if (!this.phoneMatch) this.slctd.smsGroup = Object.values(this.phoneFltr)[0].Phone;
      } else {
        this.slctChatGroup(this.slctd.chatGroup);
      }
    }
    setTimeout(() => {
      if (this.slctd.chatType != 'SMS') this.slctChatGroup(this.slctd.chatGroup);
    }, 2000);
  },
};
</script>

<style>
.chat {
}
.chat-title {
  background-color: lightblue;
  font-weight: bold;
  padding: 5px;
  color: black;
  height: 30px;
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
}
.chat-body {
  background-color: white;
  height: calc(100vh - 50px);
}
.chat-groups {
  font-weight: normal;
  color: black;
  height: 29px;
  padding: 5px;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
}
.chat-groups-active {
  font-weight: bold;
  background-color: #bbbbbb;
}
.chat-groups:hover {
  background-color: #ddd;
}
.chat0 {
  background-color: white;
}
.chat1 {
  background-color: lightblue;
}
.chat span {
  position: absolute;
  margin-top: -7.5px;
  display: inline-block;
  color: white;
  background-color: #417cd9;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  padding-top: 3px;
  font-size: 10px;
  text-align: center;
}
</style>
