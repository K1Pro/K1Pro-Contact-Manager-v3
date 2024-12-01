<template>
  <div class="chat">
    <div class="chat-title">Chat</div>
    <div class="chat-body">
      <div
        v-for="([chatGroup, chatGroupMembers], chatGroupIndx) in Object.entries(sttngs.accnt.chats).filter(
          ([key, value]) => value.includes(userData.id)
        )"
        class="chat-groups"
        :class="[slctd.chatGroup == chatGroup ? 'chat-groups-active' : 'chat' + (chatGroupIndx % 2)]"
        @click="slctChatGroup(chatGroup)"
      >
        {{ chatGroup }}
        <span v-if="newChats[chatGroup]">{{ newChats[chatGroup] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chat',

  inject: ['newChats', 'patchUserSettings', 'sttngs', 'slctd', 'times', 'userData'],

  methods: {
    slctChatGroup(chatGroup) {
      this.slctd.chatGroup = chatGroup;
      const cloneSttngs = this.sttngs.user;
      cloneSttngs.chats[chatGroup] = this.times.updtngY_m_d_H_i_s_z.slice(0, 19).replace('T', ' ');
      this.patchUserSettings(cloneSttngs);
    },
  },

  mounted() {
    setTimeout(() => {
      this.slctChatGroup(this.slctd.chatGroup);
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
