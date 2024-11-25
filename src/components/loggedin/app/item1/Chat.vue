<template>
  <div class="chat">
    <div class="chat-title">Chat</div>
    <div class="chat-body">
      <div
        v-for="([chatGroup, chatGroupMembers], chatGroupIndx) in Object.entries(chatGroups).filter(([key, value]) =>
          value.includes(userData.id)
        )"
        class="chat-groups"
        :class="[slctd.chatGroup == chatGroup ? 'chat-groups-active' : 'chat' + (chatGroupIndx % 2)]"
        @click="slctChatGroup(chatGroup)"
      >
        {{ chatGroup }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chat',

  inject: ['chatGroups', 'slctd', 'userData'],

  methods: {
    slctChatGroup(chatGroup) {
      this.slctd.chatGroup = chatGroup;
    },
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
</style>
