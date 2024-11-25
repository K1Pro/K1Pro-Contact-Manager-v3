<template>
  <div class="chat-box">
    <div class="chat-box-title">Chat with {{ slctd.chatGroup }}</div>
    <div class="chat-box-body"></div>
    <div class="chat-box-new-message">
      <textarea v-model="chatBoxMsg"></textarea>
      <button :disabled="!chatBoxMsg" @click="sendChat">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chat box',

  inject: ['chatGroups', 'showMsg', 'slctd', 'userData'],

  data() {
    return {
      chatBoxMsg: '',
      spinChat: false,
    };
  },

  methods: {
    async sendChat() {
      try {
        console.log(this.chatBoxMsg);
        console.log(this.userData.id);
        console.log(this.chatGroups[this.slctd.chatGroup]);
        const response = await fetch(app_api_url + '/chats', {
          method: 'POST',
          headers: {
            Authorization: access_token,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            ID: this.userData.id,
            Group: this.chatGroups[this.slctd.chatGroup],
            Message: this.chatBoxMsg,
          }),
        });
        const sendChatResJSON = await response.json();
        if (sendChatResJSON.success) {
          this.chatBoxMsg = '';
        }
        console.log(sendChatResJSON);
      } catch (error) {
        this.spinChat = false;
        this.showMsg(error.toString());
        console.log(error.toString());
      }
    },
  },
};
</script>

<style>
.chat-box {
  padding: 10px 10px 10px 10px;
  font-size: 12px;
}
.chat-box-title {
  background-color: lightblue;
  font-weight: bold;
  padding: 5px;
  color: black;
  height: 30px;
  overflow: hidden;
  white-space: nowrap;
  font-size: 16px;
}
.chat-box-body {
  background-color: white;
  width: 100%;
  height: calc(100vh - 100px);
  font-family: 'Helvetica', sans-serif;
  padding: 5px;
  border: none;
  overflow: hidden scroll;
}
.chat-box-new-message {
  background-color: white;
  width: 100%;
  height: 50px;
  font-family: 'Helvetica', sans-serif;
  padding: 5px;
  border: none;
  overflow: hidden;
}
.chat-box textarea {
  float: left;
  resize: none;
  width: calc(100% - 95px);
  height: 100%;
}
.chat-box button {
  /* float: right; */
  height: 100%;
  width: 85px;
}
@media only screen and (min-width: 768px) {
  .chat-box {
    padding: 10px 10px 10px 0px;
  }
}
</style>
