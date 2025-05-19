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
        <hr />
        <div class="chat-title">
          SMS ({{ contacts[slctdCntctIndex].Members[0].First }} {{ contacts[slctdCntctIndex].Members[0].Name }})
        </div>
        <template
          v-for="(connection, connectionIndx) in contacts[slctdCntctIndex].Connections.filter(
            (connectionType) => connectionType.Phone
          )"
        >
          <div
            class="chat-groups"
            :class="[
              slctd.smsGroup == connection.Phone && slctd.chatType == 'SMS'
                ? 'chat-groups-active'
                : 'chat' + (connectionIndx % 2),
            ]"
            @click="slctSMSGroup(connection.Phone)"
          >
            {{ connection.Phone }}
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chat',

  inject: ['contacts', 'newChats', 'sttngsReq', 'sttngs', 'slctd', 'slctdCntctIndex', 'times', 'userData'],

  methods: {
    slctChatGroup(chatGroup) {
      this.slctd.chatGroup = chatGroup;
      this.slctd.chatType = 'Chat';
      this.sttngs.user.chats[chatGroup] = this.times.updtngY_m_d_H_i_s_z.slice(0, 19).replace('T', ' ');
      this.sttngsReq('PATCH', 'user');
    },
    slctSMSGroup(SMSGroup) {
      console.log(SMSGroup);
      this.slctd.smsGroup = SMSGroup;
      this.slctd.chatType = 'SMS';
    },
  },

  mounted() {
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
