<template>
  <div class="chat-box">
    <div class="chat-box-title">Chat with {{ slctd.chatGroup }}</div>
    <div class="chat-box-body">
      <template v-for="(chat, chatIndx) in chats">
        <div v-if="JSON.stringify(chat.chatgroup) === JSON.stringify(chatGroups[slctd.chatGroup])">
          <div
            v-if="chats?.[chatIndx]?.chattime?.slice(5, 10) != chats?.[chatIndx - 1]?.chattime?.slice(5, 10)"
            class="chat-box-body-time"
          >
            {{ this.usaDateFrmt(chat.chattime) }}
          </div>

          <div
            class="chat-box-body-msg"
            :title="activeUserList[chat.userid][0] + ' sent this message on ' + chat.chattime.slice(11, 16)"
            :class="chat.userid === userData.id ? 'chat-box-right' : 'chat-box-left'"
          >
            {{ chat.chatmessage }}
            <div class="chat-box-body-date">{{ chat.chattime.slice(11, 16) }}</div>
          </div>
        </div>
      </template>
      <div ref="bottomEl"></div>
    </div>
    <div class="chat-box-new-message">
      <textarea v-model="chatBoxMsg"></textarea>
      <button :disabled="!chatBoxMsg" @click="sendChat">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chat box',

  inject: ['activeUserList', 'chats', 'chatGroups', 'mstRcnt', 'showMsg', 'slctd', 'times', 'userData', 'usaDateFrmt'],

  data() {
    return {
      chatBoxMsg: '',
      spinChat: false,
    };
  },

  computed: {
    slctdChatAmount() {
      return this.chats.filter(
        (chat) => JSON.stringify(chat.chatgroup) === JSON.stringify(this.chatGroups[this.slctd.chatGroup])
      ).length;
    },
  },

  methods: {
    async sendChat() {
      const mstRcntChat = this.times.updtngY_m_d_H_i_s_z;
      this.mstRcnt.chat = mstRcntChat.slice(0, 19).replace('T', ' ');
      if (this.chats === null) this.chats = [];
      try {
        this.chats.push({
          userid: this.userData.id,
          chatgroup: this.chatGroups[this.slctd.chatGroup],
          chattime: mstRcntChat.slice(0, 19).replace('T', ' '),
          chatmessage: this.chatBoxMsg,
        });
        // console.log(this.chatBoxMsg);
        // console.log(this.userData.id);
        // console.log(this.chatGroups[this.slctd.chatGroup]);
        const response = await fetch(app_api_url + '/chats/' + mstRcntChat.slice(0, 19), {
          method: 'POST',
          headers: {
            Authorization: access_token,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            UserID: this.userData.id,
            ChatName: this.slctd.chatGroup,
            ChatGroup: this.chatGroups[this.slctd.chatGroup],
            // ChatTime: mstRcntChat.slice(0, 19).replace('T', ' '),
            ChatMessage: this.chatBoxMsg,
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

  watch: {
    slctdChatAmount() {
      setTimeout(() => {
        this.$refs.bottomEl.scrollIntoView();
      }, 1);
    },
  },

  mounted() {
    setTimeout(() => {
      this.$refs.bottomEl.scrollIntoView();
    }, 1);
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
.chat-box-body-time {
  text-align: center;
}
.chat-box-body-msg {
  font-size: 20px;
}
.chat-box-left {
  border: 1px solid rgb(255, 205, 205);
  border-radius: 10px;
  margin-right: 50px;
  margin-bottom: 10px;
  padding: 5px;
  text-align: left;
  background-color: rgb(255, 205, 205);
}
.chat-box-right {
  border: 1px solid rgb(205, 255, 205);
  border-radius: 10px;
  margin-left: 50px;
  margin-bottom: 10px;
  padding: 5px;
  text-align: right;
  background-color: rgb(205, 255, 205);
}
.chat-box-body-date {
  color: grey;
  font-size: 12px;
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
