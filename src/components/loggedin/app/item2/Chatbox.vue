<template>
  <div class="chat-box">
    <div class="chat-box-title">
      {{ slctd.chatType }} with
      {{
        slctd.chatType == 'SMS'
          ? contacts[slctdCntctIndex].Members[0].First +
            ' ' +
            contacts[slctdCntctIndex].Members[0].Name +
            ' (' +
            slctd.smsGroup +
            ')'
          : slctd.chatGroup
      }}
    </div>
    <div class="chat-box-body">
      <div
        v-if="slctd.chatType == 'SMS'"
        v-for="(log, logIndx) in contacts[slctdCntctIndex].Log?.sort((a, b) => a[1].localeCompare(b[1]))?.filter(
          (logInfo) =>
            (logInfo[2].includes('SMS received:') && logInfo[0] == slctd.smsGroup.replace(/[^0-9]/g, '')) ||
            (logInfo[2]?.split(':')?.[0]?.includes('SMS sent') &&
              logInfo[2]
                ?.split(':')[0]
                ?.replace(/[^0-9]/g, '')
                ?.includes(slctd.smsGroup.replace(/[^0-9]/g, '')))
        )"
      >
        <div
          class="chat-box-body-msg"
          :title="contacts[slctdCntctIndex].Members[0].Name + ' sent this SMS on ' + log[1]"
          :class="log[0] == userData.id ? 'chat-box-right' : 'chat-box-left'"
        >
          {{ log[2].includes('SMS sent') ? log[2].split(':')[1] : log[2].replace('SMS received:', '') }}
          <div class="chat-box-body-date">
            {{
              sttngs.entity.activeUserList?.[log[0]]?.FirstName
                ? sttngs.entity.activeUserList?.[log[0]]?.FirstName
                : contacts[slctdCntctIndex].Members[0].First
                ? contacts[slctdCntctIndex].Members[0].First + ' ' + contacts[slctdCntctIndex].Members[0].Name
                : contacts[slctdCntctIndex].Members[0].Name
            }}
            - {{ this.usaDateFrmt(log[1]) }}
          </div>
        </div>
      </div>

      <div v-else v-for="(chat, chatIndx) in slctdChats">
        <div
          v-if="chat.chattime.slice(5, 10) != slctdChats?.[chatIndx - 1]?.chattime?.slice(5, 10)"
          class="chat-box-body-time"
        >
          <div class="chat-box-body-timedate">
            {{ this.usaDateFrmt(chat.chattime) }}
          </div>
        </div>

        <div
          class="chat-box-body-msg"
          :title="
            sttngs.entity.activeUserList[chat.userid].FirstName +
            ' sent this message on ' +
            this.usaDateFrmt(chat.chattime) +
            ' ' +
            chat.chattime.slice(11, 16)
          "
          :class="chat.userid === userData.id ? 'chat-box-right' : 'chat-box-left'"
        >
          {{ chat.chatmessage }}
          <div class="chat-box-body-date">
            {{ sttngs.entity.activeUserList[chat.userid].FirstName }} - {{ chat.chattime.slice(11, 16) }}
          </div>
        </div>
      </div>
      <div ref="bottomChatEl"></div>
    </div>
    <div class="chat-box-new-message">
      <textarea
        v-model="chatBoxMsg"
        v-on:keyup.enter="sttngs.entity.sms.enabled === true && slctd.chatType == 'SMS' ? sendSMS() : sendChat()"
        :disabled="dsbld"
      ></textarea>
      <button
        :disabled="!chatBoxMsg || dsbld"
        @click="sttngs.entity.sms.enabled === true && slctd.chatType == 'SMS' ? sendSMS() : sendChat()"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chat box',

  inject: [
    'chats',
    'contacts',
    'dsbld',
    'sttngsReq',
    'showMsg',
    'slctdCntctIndex',
    'sttngs',
    'slctd',
    'times',
    'userData',
    'usaDateFrmt',
  ],

  data() {
    return {
      chatBoxMsg: '',
    };
  },

  computed: {
    slctdChats() {
      return this.chats?.filter(
        (chat) => JSON.stringify(chat.chatgroup) === JSON.stringify(this.sttngs.entity.chats[this.slctd.chatGroup])
      );
    },

    slctdChatAmount() {
      return this.slctdChats.length;
    },
  },

  methods: {
    async sendChat() {
      const chatBoxMsg = this.chatBoxMsg;
      this.chatBoxMsg = '';
      const mstRcntChatTime = this.times.updtngY_m_d_H_i_s_z;
      this.times.mstRcntChat = mstRcntChatTime.slice(0, 19).replace('T', ' ');
      if (this.chats === null) this.chats = [];
      this.sttngs.user.chats[this.slctd.chatGroup] = mstRcntChatTime.slice(0, 19).replace('T', ' ');
      this.sttngsReq('PATCH', 'user');

      try {
        this.chats.push({
          chattime: mstRcntChatTime.slice(0, 19).replace('T', ' '),
          userid: this.userData.id,
          chatgroup: this.sttngs.entity.chats[this.slctd.chatGroup],
          chatmessage: chatBoxMsg,
        });
        const response = await fetch(app_api_url + '/' + mstRcntChatTime.slice(0, 19) + '/chats', {
          method: 'POST',
          headers: {
            Authorization: access_token,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            UserID: this.userData.id,
            ChatGroup: this.sttngs.entity.chats[this.slctd.chatGroup],
            ChatMessage: chatBoxMsg,
          }),
        });
        const sendChatResJSON = await response.json();
        if (!sendChatResJSON.success) {
          this.showMsg('Chat was not sent');
        }
      } catch (error) {
        this.showMsg('Chat was not sent');
        console.log(error.toString());
      }
    },
    async sendSMS() {
      console.log('sending sms');
      console.log(this.contacts[this.slctdCntctIndex]);
      const chatBoxMsg = this.chatBoxMsg;
      this.chatBoxMsg = '';
      const contactLog = JSON.parse(JSON.stringify(this.contacts[this.slctdCntctIndex].Log));
      contactLog.unshift([
        this.userData.id.toString(),
        this.times.updtngY_m_d_H_i_s_z.slice(0, 16),
        'SMS sent to ' + this.slctd.smsGroup + ': ' + chatBoxMsg,
      ]);
      this.contacts[this.slctdCntctIndex].Log = contactLog;
      console.log(this.contacts[this.slctdCntctIndex].Log);

      try {
        const response = await fetch(this.userData.AppPermissions.ContactManager.smsAPIurl, {
          method: 'POST',
          headers: {
            Authorization: access_token,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            ID: this.sttngs.user.slctdCntctID,
            To: this.slctd.smsGroup.replace(/[^0-9]/g, ''),
            ChatMessage: chatBoxMsg,
          }),
        });
        const sendChatResJSON = await response.json();
        console.log(sendChatResJSON);
        if (!sendChatResJSON.success) {
          this.showMsg('SMS was not sent');
        }
      } catch (error) {
        this.showMsg('SMS was not sent');
        console.log(error.toString());
      }
    },
  },

  watch: {
    slctdChatAmount() {
      setTimeout(() => {
        this.$refs.bottomChatEl.scrollIntoView();
      }, 1);
    },
    'slctd.chatType'() {
      setTimeout(() => {
        this.$refs.bottomChatEl.scrollIntoView();
      }, 1);
    },
    'slctd.smsGroup'() {
      setTimeout(() => {
        this.$refs.bottomChatEl.scrollIntoView();
      }, 1);
    },
    'slctd.chatGroup'() {
      setTimeout(() => {
        this.$refs.bottomChatEl.scrollIntoView();
      }, 1);
    },
  },

  mounted() {
    setTimeout(() => {
      console.log('test');
      this.$refs.bottomChatEl.scrollIntoView();
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
.chat-box-body-timedate {
  margin: 10px auto;
  padding: 5px;
  border: 1px solid rgb(176, 176, 176);
  background-color: rgb(176, 176, 176);
  color: white;
  border-radius: 10px;
  width: 75px;
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
