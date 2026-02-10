<template>
  <div class="chat-box">
    <div class="chat-box-title">
      {{ chatBoxTitle }}
      <span><input type="date" v-model="strtTime" /> - <input type="date" v-model="endTime" /></span>
    </div>
    <div class="chat-box-body">
      <template
        v-if="slctdChatAmount"
        v-for="(chat, chatIndx) in slctdChats?.sort((a, b) => a?.dat.localeCompare(b?.dat))"
      >
        <div
          v-if="
            (Date.parse(strtTime).toString().slice(0, 5) <= Date.parse(chat.dat.slice(0, 10)).toString().slice(0, 5) &&
              Date.parse(chat.dat.slice(0, 10)).toString().slice(0, 5) <= Date.parse(endTime).toString().slice(0, 5)) ||
            (Date.parse(strtTime).toString().slice(0, 5) >= Date.parse(chat.dat.slice(0, 10)).toString().slice(0, 5) &&
              Date.parse(chat.dat.slice(0, 10)).toString().slice(0, 5) >= Date.parse(endTime).toString().slice(0, 5))
          "
        >
          <div v-if="chat.dat.slice(5, 10) != slctdChats?.[chatIndx - 1]?.dat?.slice(5, 10)" class="chat-box-body-time">
            <div class="chat-box-body-timedate">{{ this.usaDateFrmt(chat.dat).slice(0, 10) }}</div>
          </div>

          <div
            class="chat-box-msg"
            :title="
              (sttngs.entity.activeUserList[chat.frm]
                ? sttngs.entity.activeUserList[chat.frm].FirstName
                : contacts[slctdCntctIndex].Members[0].Name) +
              ' sent this on ' +
              this.usaDateFrmt(chat.dat) +
              ' ' +
              chat.dat.slice(11, 16)
            "
            :style="{
              justifyContent: chat.frm == userData.id ? 'flex-end' : 'flex-start',
            }"
          >
            <div
              :style="{
                backgroundColor: sttngs?.entity?.msgColors?.[chat?.frm]
                  ? sttngs.entity.msgColors[chat.frm]
                  : chat?.frm == userData.id
                    ? '#F08784'
                    : '#A1FB8E',
              }"
              :class="chat.frm == userData.id ? 'chat-box-right' : 'chat-box-left'"
              class="chat-box-msg-cntnr"
            >
              <a
                v-if="chat.tp.includes('image')"
                :href="'src/assets/images/' + userData.Entity + '/' + secDir + chatFldr + chat.msg"
                target="_blank"
              >
                <img :src="'src/assets/images/' + userData.Entity + '/' + secDir + chatFldr + chat.msg" alt="pic" />
              </a>
              <template v-if="!chat.tp.includes('image')">
                <i v-if="chat.err || chat?.err == ''" class="fa-solid fa-circle-exclamation" :title="chat.err"></i>
                <template v-if="chat.tp == 'msg'">
                  <template v-if="chat.msg.includes('https://bundle-insurance.com/secure-link/')">
                    <a :href="chat.msg.split(' - ')[0]" target="_blank">{{ chat.msg.split(' - ')[0] }}</a> -
                    {{ chat.msg.split(' - ')[1] }}
                  </template>
                  <div v-else style="word-break: break-word" v-html="chat.msg"></div>
                </template>
                <a
                  v-else
                  :href="'src/assets/images/' + userData.Entity + '/' + secDir + chatFldr + chat.msg"
                  target="_blank"
                  >{{ chat.msg.split('/')[chat.msg.split('/').length - 1] }}</a
                >
              </template>
              <div class="chat-box-msg-date">
                {{
                  sttngs.entity.activeUserList?.[chat.frm]?.FirstName
                    ? sttngs.entity.activeUserList?.[chat.frm]?.FirstName
                    : contacts[slctdCntctIndex].Members[0].First
                      ? contacts[slctdCntctIndex].Members[0].First + ' ' + contacts[slctdCntctIndex].Members[0].Name
                      : contacts[slctdCntctIndex].Members[0].Name
                }}
                - {{ chat.dat.slice(11, 16) }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <table v-else>
        <tbody>
          <tr>
            <td><div class="chat-box-no-msg">No messages</div></td>
          </tr>
        </tbody>
      </table>

      <div ref="bottomChatEl"></div>
    </div>

    <div class="chat-box-new-message">
      <div v-if="uploadedFiles.length > 0" class="chat-box-uploaded-files" style="height: 100%">
        <template v-for="(uploadedFile, uploadedFileIndx) in uploadedFiles">
          <i
            class="fa-solid fa-trash"
            style="cursor: pointer"
            @click="this.uploadedFiles.splice(uploadedFileIndx, 1)"
          ></i
          >&nbsp;
          <a :href="uploadedFile.path + uploadedFile.filename" target="_blank">{{ uploadedFile.filename }}</a>
          <br />
        </template>
      </div>

      <textarea
        v-else
        :disabled="dsbld || spinLogin || uploadingFiles"
        :placeholder="'Enter ' + slctd.chatType + ' here'"
        :style="{
          height: slctd.chatType == 'SMS' ? 'calc(100% - 20px)' : '100%',
          borderBottomWidth: slctd.chatType == 'SMS' ? '0px' : '1px',
        }"
        v-model="chatBoxMsg"
        v-on:keyup.enter="sendChat()"
      ></textarea>

      <select
        v-if="slctd.chatType == 'SMS' && sttngs.entity.smss && uploadedFiles.length === 0"
        :disabled="dsbld || spinLogin || uploadingFiles"
        @change="changeSMSTemplate"
      >
        <option disabled selected>Choose SMS template</option>
        <option v-for="(smsTemplate, smsTemplateIndx) in sttngs.entity.smss" :value="smsTemplateIndx">
          {{ smsTemplate.placeholder }}
        </option>
      </select>

      <div v-if="slctd.chatType == 'SMS' && uploadedFiles.length === 0" class="chat-msg-len">
        {{ Math.ceil(chatBoxMsg.length / 160) }} / {{ chatBoxMsg.length }}
      </div>

      <button v-if="uploadingFiles" disabled><i class="spin fa-sharp fa-solid fa-circle-notch"></i></button>
      <template v-else>
        <label for="chat-upload-btn"><i class="fa-solid fa-paperclip"></i></label>
        <input type="file" id="chat-upload-btn" hidden @change="uploadFile($event)" multiple />
      </template>

      <button
        :disabled="uploadedFiles.length === 0 && (spinLogin || !chatBoxMsg || dsbld || uploadingFiles)"
        @click="sendChat()"
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
    'sttngsDBReq',
    'showMsg',
    'slctdCntctIndex',
    'sttngs',
    'slctd',
    'updt',
    'userData',
    'usaDateFrmt',
    'wndw',
  ],

  data() {
    return {
      chatMounted: false,
      chatBoxMsg: '',
      spinLogin: false,
      uploadingFiles: false,
      uploadedFiles: [],
      secDir: sec_dir,
      strtTime:
        new Date(this.updt.initialUsrTmstmp - 30 * 86400000)?.getFullYear() +
        '-' +
        (new Date(this.updt?.initialUsrTmstmp - 30 * 86400000)?.getMonth() + 1)?.toString()?.padStart(2, '0') +
        '-' +
        new Date(this.updt?.initialUsrTmstmp - 30 * 86400000)?.getDate()?.toString()?.padStart(2, '0'),
      endTime: this.updt.updtngY_m_d_H_i_s_z.slice(0, 10),
    };
  },

  computed: {
    chatFldr() {
      return this.sttngs.entity.sms.enabled === true && this.slctd.chatType == 'SMS' ? '/msg/' : '/chat/';
    },
    slctdChats() {
      return this.sttngs.entity.sms.enabled === true && this.slctd.chatType == 'SMS'
        ? this.contacts[this.slctdCntctIndex].Msg?.filter((msgInfo) => {
            return (
              (msgInfo.frm &&
                msgInfo?.frm?.replace(/[^0-9]/g, '')?.includes(this.slctd.smsGroup.replace(/[^0-9]/g, ''))) ||
              (msgInfo.tow &&
                msgInfo?.tow?.replace(/[^0-9]/g, '')?.includes(this.slctd.smsGroup.replace(/[^0-9]/g, '')))
            );
          })
        : this.chats?.filter(
            (chat) => JSON.stringify(chat.tow) === JSON.stringify(this.sttngs.entity.chats[this.slctd.chatGroup]),
          );
    },

    slctdChatAmount() {
      return this.slctdChats.length;
    },
    chatBoxTitle() {
      let firstName, name;
      if (this.contacts?.length > 0) {
        firstName =
          this.contacts[this.slctdCntctIndex].Members[0].First &&
          this.contacts[this.slctdCntctIndex].Members[0].First != ''
            ? this.contacts[this.slctdCntctIndex].Members[0].First
            : '';
        name =
          this.contacts[this.slctdCntctIndex].Members[0].Name &&
          this.contacts[this.slctdCntctIndex].Members[0].Name != ''
            ? this.contacts[this.slctdCntctIndex].Members[0].Name
            : '';
      }
      return (
        this.slctd.chatType +
        ' with ' +
        (this.slctd.chatType == 'SMS'
          ? firstName +
            (firstName != '' ? ' ' : '') +
            name +
            (firstName != '' || name != '' ? ' (' : '') +
            this.slctd.smsGroup +
            (firstName != '' || name != '' ? ')' : '')
          : this.slctd.chatGroup)
      );
    },
  },

  methods: {
    sendChat() {
      if (this.chatBoxMsg.replaceAll('\n', '') != '' || this.uploadedFiles.length > 0) {
        this.spinLogin = true;
        const dat = this.updt.updtngY_m_d_H_i_s_z.slice(0, 19);
        const frm = this.slctd.chatType == 'SMS' ? this.userData.id.toString() : this.userData.id;
        // prettier-ignore
        const tow = this.slctd.chatType == 'SMS' ? this.slctd.smsGroup.replace(/[^0-9]/g, '') : this.sttngs.entity.chats[this.slctd.chatGroup];
        const chat = this.uploadedFiles.length > 0 ? this.uploadedFiles : [{ filename: this.chatBoxMsg }];

        if (this.slctd.chatType == 'Chat' && this.chats === null) this.chats = [];
        this.chatBoxMsg = '';
        this.uploadedFiles = [];

        chat.forEach((uploadedFile) => {
          const chatBody = {
            frm: frm,
            tow: tow,
            msg: uploadedFile.filename.replaceAll('\n', ''),
            tp: uploadedFile.type ? uploadedFile.type : 'msg',
          };
          if (this.slctd.chatType == 'SMS') chatBody.id = this.sttngs.user.slctdCntctID;
          this.postChat(dat, chatBody, this.slctd.chatType);
        });
      } else {
        this.showMsg('Message cannot be blank');
        this.chatBoxMsg = '';
        this.uploadedFiles = [];
      }
    },
    async postChat(dat, chatBody, chatType) {
      try {
        // prettier-ignore
        const response = await fetch((chatType == 'Chat' ? app_api_url : this.userData.AppPermissions.ContactManager.smsAPIurl) + '/' + dat.slice(0, 19).replace(' ', 'T') + '/' + chatType.toLowerCase(),
          {
            method: 'POST',
            headers: {
              Authorization: access_token,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
            body: JSON.stringify(chatBody),
          }
        );
        const resJSON = await response.json();
        if (resJSON.success && chatType == 'Chat') {
          this.updt.mstRcntChat = dat.slice(0, 19).replace('T', ' ');
          this.sttngs.user.chats[this.slctd.chatGroup] = dat.slice(0, 19).replace('T', ' ');
          this.sttngsDBReq('PATCH', 'user');
          this.chats.push(resJSON.data);
        }
        if (!resJSON.success) {
          this.spinLogin = false;
          this.showMsg('Message not sent');
        }
      } catch (error) {
        this.spinLogin = false;
        this.showMsg('Message not sent');
        console.log(error.toString());
      }
    },

    async uploadFile(event) {
      this.uploadingFiles = true;
      let formData = new FormData();
      Object.values(event.target.files).forEach((file) => {
        formData.append('email_attachment[]', file);
      });
      try {
        const response = await fetch(app_api_url + '/upload', {
          method: 'POST',
          headers: {
            Authorization: access_token,
            'Cache-Control': 'no-store',
          },
          body: formData,
        });
        const resJSON = await response.json();
        if (resJSON.success) {
          this.uploadingFiles = false;
          resJSON.data.files.forEach((file) => {
            this.uploadedFiles.push(file);
          });
        } else {
          this.showMsg('Upload error');
          this.uploadingFiles = false;
          this.uploadedFiles = [];
        }
      } catch (error) {
        this.uploadingFiles = false;
        this.uploadedFiles = [];
        this.showMsg(error.toString());
        console.log(error.toString());
      }
    },
    changeSMSTemplate(event) {
      let chatBoxMsg = this.sttngs.entity.smss[event.target.value].body
        ?.replaceAll('___FirstName___', this.contacts[this.slctdCntctIndex]?.Members?.[0]?.First)
        ?.replaceAll('___UserFirstname___', this.userData.FirstName);
      this.chatBoxMsg = chatBoxMsg.replaceAll('undefined', '');
      event.srcElement.selectedIndex = 0;
    },
    resetChatbox() {
      setTimeout(() => {
        this.$refs.bottomChatEl.scrollIntoView();
      }, 100);
      this.chatBoxMsg = '';
      this.uploadedFiles = [];
      this.spinLogin = false;
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 150);
    },
  },

  watch: {
    slctdChatAmount() {
      if (this.chatMounted) {
        setTimeout(() => {
          this.$refs.bottomChatEl.scrollIntoView();
        }, 100);
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 150);
        this.spinLogin = false;
      }
    },
    'slctd.chatType'() {
      if (this.chatMounted) this.resetChatbox();
    },
    'slctd.smsGroup'() {
      if (this.chatMounted) this.resetChatbox();
    },
    'slctd.chatGroup'() {
      if (this.chatMounted) this.resetChatbox();
    },
  },

  mounted() {
    setTimeout(() => {
      this.$refs.bottomChatEl.scrollIntoView();
    }, 5);
    setTimeout(() => {
      window.scrollTo({ top: this.wndw.hght });
      this.chatMounted = true;
    }, 10);
  },
};
</script>

<style>
.chat-box {
  font-size: 12px;
  position: relative;
  z-index: 3;
  height: 100%;
}
.chat-box a {
  text-decoration: none;
}
.chat-box-title {
  position: relative;
  background-color: lightblue;
  font-weight: bold;
  padding: 5px;
  color: black;
  height: 30px;
  overflow: hidden;
  white-space: nowrap;
  font-size: 16px;
}
.chat-box-title span {
  position: absolute;
  right: 5px;
  background-color: lightblue;
  /* height: 30px; */
  padding-left: 7.5px;
}
.chat-box-title input[type='date'] {
  font-family: 'Helvetica', sans-serif;
  width: 95px;
}
.chat-box-body {
  height: calc(100% - 105px);
  background-color: white;
  width: 100%;
  font-family: 'Helvetica', sans-serif;
  padding: 5px;
  border: none;
  overflow: hidden scroll;
}
.chat-box table {
  height: 100%;
  width: 100%;
}
.chat-box td {
  text-align: center;
  vertical-align: middle;
}
.chat-box-no-msg {
  padding: 5px;
  border: 1px solid rgb(176, 176, 176);
  background-color: rgb(176, 176, 176);
  color: white;
  border-radius: 10px;
  margin-left: calc(50% - 50px);
  margin-right: calc(50% - 50px);
}
.chat-box-body-time {
  text-align: center;
}
.chat-box-body-timedate {
  margin: 10px auto;
  padding: 5px;
  border: 1px solid rgb(110, 110, 110);
  background-color: rgb(110, 110, 110);
  color: white;
  border-radius: 10px;
  width: 75px;
}
.chat-box-msg {
  display: flex;
  font-size: 20px;
}
.chat-box-msg-cntnr {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid gray;
  max-width: 75%;
}
.chat-box-msg-cntnr img {
  width: 100%;
  border-radius: 5px;
}
.chat-msg-len {
  position: absolute;
  margin-top: 32px;
  text-align: right;
  right: 120px;
  background-color: white;
}
.chat-box-left {
  border-radius: 10px 10px 10px 0px;
  text-align: left;
}
.chat-box-right {
  border-radius: 10px 10px 0px 10px;
  text-align: right;
}
.chat-box-msg-date {
  font-size: 11px;
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
.chat-box-uploaded-files {
  border-radius: 2px;
  border: 1px solid black;
  font-size: 13px;
}
.chat-box-uploaded-files,
.chat-box textarea {
  float: left;
  resize: none;
  width: calc(100% - 95px);
  padding: 5px;
  overflow-y: auto;
  outline: none;
}
.chat-box select {
  float: left;
  width: calc(100% - 95px);
  background-color: white;
  height: 20px;
  border-top-width: 0px;
  outline: none;
}
.chat-box label {
  display: inline-block;
  background-color: #eeeeee;
  border-radius: 2px;
  border: 1px solid black;
  height: 100%;
  width: 45px;
  padding: 23.5px 17px;
  color: black;
  font-size: 13px;
}
.chat-box button {
  display: inline-block;
  height: 100%;
  width: 45px;
}
@media only screen and (min-width: 768px) {
  .chat-msg-len {
    right: 200px;
  }
  .chat-box-uploaded-files,
  .chat-box textarea,
  .chat-box select {
    width: calc(100% - 170px);
  }
  .chat-box button {
    width: 75px;
  }
  .chat-box label {
    width: 75px;
    padding: 23.5px 32px;
  }
}
</style>
