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
        v-for="(msg, msgIndx) in contacts[slctdCntctIndex].Msg?.sort((a, b) => a.dat.localeCompare(b.dat))?.filter(
          (msgInfo) =>
            msgInfo?.frm?.includes(slctd.smsGroup.replace(/[^0-9]/g, '')) ||
            msgInfo?.to?.includes(slctd.smsGroup.replace(/[^0-9]/g, ''))
        )"
      >
        <div
          class="chat-box-body-msg"
          :title="contacts[slctdCntctIndex].Members[0].Name + ' sent this SMS on ' + msg.dat"
          :class="msg.frm == userData.id ? 'chat-box-right' : 'chat-box-left'"
        >
          <template v-if="msg.tp == 'mms'">
            <a :href="msg.msg" target="_blank"><img :src="msg.msg" alt="pic" style="width: 50%" /></a>
          </template>
          <template v-else>
            <i v-if="msg.err" class="fa-solid fa-circle-exclamation" :title="msg.err"></i> {{ msg.msg }}
          </template>

          <div class="chat-box-body-date">
            {{
              sttngs.entity.activeUserList?.[msg.frm]?.FirstName
                ? sttngs.entity.activeUserList?.[msg.frm]?.FirstName
                : contacts[slctdCntctIndex].Members[0].First
                ? contacts[slctdCntctIndex].Members[0].First + ' ' + contacts[slctdCntctIndex].Members[0].Name
                : contacts[slctdCntctIndex].Members[0].Name
            }}
            - {{ this.usaDateFrmt(msg.dat) }}
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
        :placeholder="'Enter ' + slctd.chatType + ' here'"
        v-model="chatBoxMsg"
        v-on:keyup.enter="sttngs.entity.sms.enabled === true && slctd.chatType == 'SMS' ? sendSMS() : sendChat()"
        :disabled="dsbld || spinLogin"
      ></textarea>
      <div class="chat-msg-len">{{ Math.ceil(chatBoxMsg.length / 160) }} / {{ chatBoxMsg.length }}</div>
      <button :disabled="dsbld || spinLogin"><i class="fa-solid fa-paperclip"></i></button>
      <button
        :disabled="spinLogin || !chatBoxMsg || dsbld"
        @click="sttngs.entity.sms.enabled === true && slctd.chatType == 'SMS' ? sendSMS() : sendChat()"
      >
        <i v-if="spinLogin" class="spin fa-sharp fa-solid fa-circle-notch"></i>
        <template v-else>Send</template>
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
      spinLogin: false,
    };
  },

  computed: {
    slctdChats() {
      return this.chats?.filter(
        (chat) => JSON.stringify(chat.chatgroup) === JSON.stringify(this.sttngs.entity.chats[this.slctd.chatGroup])
      );
    },

    slctdChatAmount() {
      return this.sttngs.entity.sms.enabled === true && this.slctd.chatType == 'SMS'
        ? this.contacts[this.slctdCntctIndex].Msg?.filter(
            (msg) =>
              msg?.frm?.includes(this.slctd.smsGroup.replace(/[^0-9]/g, '')) ||
              msg?.to?.includes(this.slctd.smsGroup.replace(/[^0-9]/g, ''))
          )?.length
        : this.slctdChats.length;
    },
  },

  methods: {
    async sendChat() {
      if (this.chatBoxMsg.replaceAll('\n', '') != '') {
        this.spinLogin = true;
        const chatBoxMsg = this.chatBoxMsg.replaceAll('\n', '');
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
          const resJSON = await response.json();
          if (!resJSON.success) {
            this.spinLogin = false;
            this.showMsg('Chat was not sent');
          } else {
            this.spinLogin = false;
          }
        } catch (error) {
          this.spinLogin = false;
          this.showMsg('Chat was not sent');
          console.log(error.toString());
        }
      } else {
        this.showMsg('Message cannot be blank');
        this.chatBoxMsg = '';
      }
    },
    async sendSMS() {
      if (this.chatBoxMsg.replaceAll('\n', '') != '') {
        this.spinLogin = true;
        const frm = this.userData.id.toString();
        const dat = this.times.updtngY_m_d_H_i_s_z.slice(0, 19);
        const tp = 'sms';
        const to = this.slctd.smsGroup.replace(/[^0-9]/g, '');
        const msg = this.chatBoxMsg.replaceAll('\n', '');
        const contactMsg = JSON.parse(JSON.stringify(this.contacts[this.slctdCntctIndex].Msg));
        this.chatBoxMsg = '';

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
              To: to,
              ChatMessage: msg,
            }),
          });
          const resJSON = await response.json();
          console.log(resJSON);
          if (resJSON.success) {
            this.spinLogin = false;
            contactMsg.unshift({ frm: frm, dat: dat, tp: tp, to: to, msg: msg });
          } else {
            this.spinLogin = false;
            contactMsg.unshift({ frm: frm, dat: dat, tp: tp, to: to, msg: msg, err: true });
            if (resJSON?.data?.errors?.[0]?.title) {
              this.showMsg(resJSON?.data?.errors?.[0]?.title);
            } else {
              this.showMsg('SMS was not sent');
            }
          }
          this.contacts[this.slctdCntctIndex].Msg = contactMsg;
        } catch (error) {
          this.spinLogin = false;
          this.showMsg('SMS was not sent');
          console.log(error.toString());
        }
      } else {
        this.showMsg('Message cannot be blank');
        this.chatBoxMsg = '';
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
  height: calc(100vh - 125px);
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
.chat-msg-len {
  position: absolute;
  margin-top: 45px;
  text-align: right;
  right: 200px;
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
  height: 75px;
  font-family: 'Helvetica', sans-serif;
  padding: 5px;
  border: none;
  overflow: hidden;
}
.chat-box textarea {
  float: left;
  resize: none;
  width: calc(100% - 170px);
  height: 100%;
}
.chat-box button {
  /* float: right; */
  height: 100%;
  width: 75px;
}
@media only screen and (min-width: 768px) {
  .chat-box {
    padding: 10px 10px 10px 0px;
  }
}
</style>
