<template>
  <div class="chat-box">
    <div class="chat-box-title">{{ chatBoxTitle }}</div>
    <div class="chat-box-body">
      <div v-if="slctdChatAmount" v-for="(chat, chatIndx) in slctdChats?.sort((a, b) => a?.dat.localeCompare(b?.dat))">
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
          :class="chat.frm == userData.id ? 'chat-box-right' : 'chat-box-left'"
          :style="{
            backgroundColor: sttngs?.entity?.msgColors?.[chat?.frm]
              ? sttngs.entity.msgColors[chat.frm]
              : chat?.frm == userData.id
              ? '#F08784'
              : '#A1FB8E',
          }"
        >
          <div
            v-if="chat.tp.includes('image')"
            class="chat-box-img-grid-container"
            :style="{
              gridTemplateColumns: chat?.frm == userData.id ? '60% 40%' : '40% 60%',
            }"
          >
            <div v-if="chat?.frm == userData.id"></div>
            <div>
              <a :href="'src/assets/images/' + userData.Entity + '/' + secDir + chatFldr + chat.msg" target="_blank">
                <img :src="'src/assets/images/' + userData.Entity + '/' + secDir + chatFldr + chat.msg" alt="pic" />
              </a>
            </div>
            <div v-if="chat?.frm != userData.id"></div>
          </div>

          <div v-if="!chat.tp.includes('image')" style="word-break: break-word">
            <i v-if="chat.err || chat?.err == ''" class="fa-solid fa-circle-exclamation" :title="chat.err"></i>
            <template v-if="chat.tp == 'msg'">
              <template v-if="chat.msg.includes('https://bundle-insurance.com/secure-link/')">
                <a :href="chat.msg.split(' - ')[0]" target="_blank">{{ chat.msg.split(' - ')[0] }}</a> -
                {{ chat.msg.split(' - ')[1] }}
              </template>
              <template v-else>{{ chat.msg }}</template>
            </template>
            <a
              v-else
              :href="'src/assets/images/' + userData.Entity + '/' + secDir + chatFldr + chat.msg"
              target="_blank"
              >{{ chat.msg.split('/')[chat.msg.split('/').length - 1] }}</a
            >
          </div>

          <div class="chat-box-msg-date">
            {{
              sttngs.entity.activeUserList?.[chat.frm]?.FirstName
                ? sttngs.entity.activeUserList?.[chat.frm]?.FirstName
                : contacts[slctdCntctIndex].Members[0].First
                ? contacts[slctdCntctIndex].Members[0].First + ' ' + contacts[slctdCntctIndex].Members[0].Name
                : contacts[slctdCntctIndex].Members[0].Name
            }}
            - {{ this.usaDateFrmt(chat.dat) }}
          </div>
        </div>
      </div>
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
        :style="{ height: slctd.chatType == 'SMS' ? 'calc(100% - 20px)' : '100%' }"
        v-model="chatBoxMsg"
        v-on:keyup.enter="sendChat()"
      ></textarea>

      <select
        v-if="slctd.chatType == 'SMS' && sttngs.entity.smss && uploadedFiles.length === 0"
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
      uploadingFiles: false,
      uploadedFiles: [],
      secDir: sec_dir,
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
            (chat) => JSON.stringify(chat.tow) === JSON.stringify(this.sttngs.entity.chats[this.slctd.chatGroup])
          );
    },

    slctdChatAmount() {
      return this.slctdChats.length;
    },
    chatBoxTitle() {
      const firstName =
        this.contacts[this.slctdCntctIndex].Members[0].First &&
        this.contacts[this.slctdCntctIndex].Members[0].First != ''
          ? this.contacts[this.slctdCntctIndex].Members[0].First
          : '';
      const name =
        this.contacts[this.slctdCntctIndex].Members[0].Name && this.contacts[this.slctdCntctIndex].Members[0].Name != ''
          ? this.contacts[this.slctdCntctIndex].Members[0].Name
          : '';
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
        const dat = this.times.updtngY_m_d_H_i_s_z.slice(0, 19);
        const frm = this.slctd.chatType == 'SMS' ? this.userData.id.toString() : this.userData.id;
        // prettier-ignore
        const tow = this.slctd.chatType == 'SMS' ? this.slctd.smsGroup.replace(/[^0-9]/g, '') : this.sttngs.entity.chats[this.slctd.chatGroup];
        const chat = this.uploadedFiles.length > 0 ? this.uploadedFiles : [{ filename: this.chatBoxMsg }];

        if (this.slctd.chatType == 'Chat') {
          this.times.mstRcntChat = dat.slice(0, 19).replace('T', ' ');
          if (this.chats === null) this.chats = [];
          this.sttngs.user.chats[this.slctd.chatGroup] = dat.slice(0, 19).replace('T', ' ');
          this.sttngsReq('PATCH', 'user');
        }
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
        if (resJSON.success && chatType == 'Chat') this.chats.push(resJSON.data); // Msg success is handled at syncing logs after getContacts()
        if (!resJSON.success) this.showMsg('Message not sent');
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
      // prettier-ignore
      let chatBoxMsg = this.sttngs.entity.smss[event.target.value].body?.replaceAll('___FirstName___', this.contacts[this.slctdCntctIndex]?.Members?.[0]?.First);
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
    },
  },

  watch: {
    slctdChatAmount() {
      this.resetChatbox();
    },
    'slctd.chatType'() {
      this.resetChatbox();
    },
    'slctd.smsGroup'() {
      this.resetChatbox();
    },
    'slctd.chatGroup'() {
      this.resetChatbox();
    },
  },

  mounted() {
    this.resetChatbox();
  },
};
</script>

<style>
.chat-box {
  padding: 10px 10px 10px 10px;
  font-size: 12px;
}
.chat-box a {
  text-decoration: none;
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
  border: 1px solid rgb(176, 176, 176);
  background-color: rgb(176, 176, 176);
  color: white;
  border-radius: 10px;
  width: 75px;
}
.chat-box-msg {
  font-size: 20px;
}
.chat-box-img-grid-container {
  display: grid;
}
.chat-box-img-grid-container img {
  width: 100%;
  border-radius: 5px;
}
.chat-msg-len {
  position: absolute;
  margin-top: 25px;
  text-align: right;
  right: 200px;
}
.chat-box-left {
  border-radius: 10px 10px 10px 0px;
  margin-right: 25%;
  margin-bottom: 10px;
  padding: 5px;
  text-align: left;
}
.chat-box-right {
  border-radius: 10px 10px 0px 10px;
  margin-left: 25%;
  margin-bottom: 10px;
  padding: 5px;
  text-align: right;
}
.chat-box-msg-date {
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
.chat-box-uploaded-files {
  border-radius: 2px;
  border: 1px solid black;
  font-size: 13px;
}
.chat-box-uploaded-files,
.chat-box textarea {
  float: left;
  resize: none;
  width: calc(100% - 170px);
  padding: 5px;
  overflow-y: scroll;
}
.chat-box select {
  float: left;
  width: calc(100% - 170px);
  height: 20px;
}
.chat-box label {
  display: inline-block;
  background-color: #eeeeee;
  border-radius: 2px;
  border: 1px solid black;
  height: 100%;
  width: 75px;
  padding: 23.5px 32px;
  color: black;
  font-size: 13px;
}
.chat-box button {
  display: inline-block;
  height: 100%;
  width: 75px;
}
@media only screen and (min-width: 768px) {
  .chat-box {
    padding: 10px 10px 10px 0px;
  }
}
</style>
