<template>
  <div class="chat-box">
    <div class="chat-box-title">{{ chatBoxTitle }}</div>
    <div class="chat-box-body">
      <div v-for="(msg, msgIndx) in slctdMsgs">
        <div v-if="msg.dat.slice(5, 10) != slctdMsgs?.[msgIndx - 1]?.dat?.slice(5, 10)" class="chat-box-body-time">
          <div class="chat-box-body-timedate">{{ this.usaDateFrmt(msg.dat).slice(0, 10) }}</div>
        </div>

        <div
          class="chat-box-msg"
          :title="
            (sttngs.entity.activeUserList[msg.frm]
              ? sttngs.entity.activeUserList[msg.frm].FirstName
              : contacts[slctdCntctIndex].Members[0].Name) +
            ' sent this on ' +
            this.usaDateFrmt(msg.dat) +
            ' ' +
            msg.dat.slice(11, 16)
          "
          :class="msg.frm == userData.id ? 'chat-box-right' : 'chat-box-left'"
          :style="{
            backgroundColor: sttngs?.entity?.msgColors?.[msg?.frm]
              ? sttngs.entity.msgColors[msg.frm]
              : msg?.frm == userData.id
              ? '#F08784'
              : '#A1FB8E',
          }"
        >
          <div
            class="chat-box-img-grid-container"
            :style="{
              gridTemplateColumns:
                msg?.frm == userData.id && msg.tp.includes('image')
                  ? '60% 40%'
                  : msg?.frm != userData.id && msg.tp.includes('image')
                  ? '40% 60%'
                  : '100%',
            }"
          >
            <div v-if="msg?.frm == userData.id && msg.tp.includes('image')"></div>
            <div v-if="msg.tp.includes('image')">
              <a :href="'src/assets/images/' + userData.Entity + '/' + secDir + msgLctn + msg.msg" target="_blank">
                <img :src="'src/assets/images/' + userData.Entity + '/' + secDir + msgLctn + msg.msg" alt="pic" />
              </a>
            </div>
            <div v-if="msg?.frm != userData.id && msg.tp.includes('image')"></div>
          </div>

          <div v-if="!msg.tp.includes('image')">
            <i v-if="msg.err || msg?.err == ''" class="fa-solid fa-circle-exclamation" :title="msg.err"></i>
            <template v-if="msg.tp == 'msg'">{{ msg.msg }}</template>
            <a
              v-else
              :href="'src/assets/images/' + userData.Entity + '/' + secDir + msgLctn + msg.msg"
              target="_blank"
              >{{ msg.msg.split('/')[msg.msg.split('/').length - 1] }}</a
            >
          </div>

          <div class="chat-box-msg-date">
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

      <div ref="bottomChatEl"></div>
    </div>

    <div class="chat-box-new-message">
      <div v-if="uploadedFiles.length > 0" class="chat-box-uploaded-files">
        <template v-for="uploadedFile in uploadedFiles">
          <a :href="uploadedFile.path + uploadedFile.filename" target="_blank">{{ uploadedFile.filename }}</a>
          <br />
        </template>
      </div>

      <textarea
        v-else
        :disabled="dsbld || spinLogin || uploadingFiles"
        :placeholder="'Enter ' + slctd.chatType + ' here'"
        v-model="chatBoxMsg"
        v-on:keyup.enter="sendSMS()"
      ></textarea>

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
        @click="sendSMS()"
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
      fileTypeColors: {
        pdf: { body: '#B30B00', text: '#FFFFFF' },
        doc: { body: '#103F91', text: '#FFFFFF' },
        docx: { body: '#185ABD', text: '#FFFFFF' },
        ods: { body: '#185ABD', text: '#FFFFFF' },
        csv: { body: '#107C41', text: '#FFFFFF' },
        xls: { body: '#107C41', text: '#FFFFFF' },
        xlsx: { body: '#107C41', text: '#FFFFFF' },
      },
      secDir: sec_dir,
    };
  },

  computed: {
    msgLctn() {
      return this.sttngs.entity.sms.enabled === true && this.slctd.chatType == 'SMS' ? '/msg/' : '/chat/';
    },
    slctdMsgs() {
      return this.sttngs.entity.sms.enabled === true && this.slctd.chatType == 'SMS'
        ? this.contacts[this.slctdCntctIndex].Msg?.sort((a, b) => a.dat.localeCompare(b.dat))?.filter(
            (msgInfo) =>
              msgInfo?.frm?.includes(this.slctd.smsGroup.replace(/[^0-9]/g, '')) ||
              msgInfo?.tow?.includes(this.slctd.smsGroup.replace(/[^0-9]/g, ''))
          )
        : this.chats?.filter(
            (chat) => JSON.stringify(chat.tow) === JSON.stringify(this.sttngs.entity.chats[this.slctd.chatGroup])
          );
    },

    slctdMsgAmount() {
      return this.sttngs.entity.sms.enabled === true && this.slctd.chatType == 'SMS'
        ? this.contacts[this.slctdCntctIndex].Msg?.filter(
            (msg) =>
              msg?.frm?.includes(this.slctd.smsGroup.replace(/[^0-9]/g, '')) ||
              msg?.tow?.includes(this.slctd.smsGroup.replace(/[^0-9]/g, ''))
          )?.length
        : this.slctdMsgs.length;
    },
    chatBoxTitle() {
      // prettier-ignore
      return (this.slctd.chatType + ' with ' +
        (this.slctd.chatType == 'SMS'
          ? (this.contacts[this.slctdCntctIndex].Members[0].First ? this.contacts[this.slctdCntctIndex].Members[0].First : '') + ' ' + this.contacts[this.slctdCntctIndex].Members[0].Name + ' (' + this.slctd.smsGroup + ')'
          : this.slctd.chatGroup)
      );
    },
  },

  methods: {
    sendSMS() {
      if (this.chatBoxMsg.replaceAll('\n', '') != '' || this.uploadedFiles.length > 0) {
        this.spinLogin = true;
        const dat = this.times.updtngY_m_d_H_i_s_z.slice(0, 19);
        const frm = this.slctd.chatType == 'SMS' ? this.userData.id.toString() : this.userData.id;
        // prettier-ignore
        const tow = this.slctd.chatType == 'SMS' ? this.slctd.smsGroup.replace(/[^0-9]/g, '') : this.sttngs.entity.chats[this.slctd.chatGroup];
        const msg = this.uploadedFiles.length > 0 ? this.uploadedFiles : [{ filename: this.chatBoxMsg }];

        if (this.slctd.chatType == 'Chat') {
          this.times.mstRcntChat = dat.slice(0, 19).replace('T', ' ');
          if (this.chats === null) this.chats = [];
          this.sttngs.user.chats[this.slctd.chatGroup] = dat.slice(0, 19).replace('T', ' ');
          this.sttngsReq('PATCH', 'user');
        }
        this.chatBoxMsg = '';
        this.uploadedFiles = [];

        msg.forEach((uploadedFile) => {
          const chatBody = {
            frm: frm,
            tow: tow,
            msg: uploadedFile.filename.replaceAll('\n', ''),
            tp: uploadedFile.type ? uploadedFile.type : 'msg',
          };
          if (this.slctd.chatType == 'SMS') chatBody.id = this.sttngs.user.slctdCntctID;
          this.postMsg(dat, chatBody, this.slctd.chatType, this.slctdCntctIndex);
        });
      } else {
        this.showMsg('Message cannot be blank');
        this.chatBoxMsg = '';
        this.uploadedFiles = [];
      }
    },
    async postMsg(dat, chatBody, chatType, slctdCntctIndex) {
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
        if (resJSON !== null) this.spinLogin = false;
        if (resJSON.success) {
          // prettier-ignore
          chatType == 'Chat' ? this.chats.push(resJSON.data) : this.contacts[slctdCntctIndex].Msg.unshift(resJSON.data);
          setTimeout(() => {
            this.$refs.bottomChatEl.scrollIntoView();
          }, 1);
        } else {
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
        console.log(resJSON);
      } catch (error) {
        this.uploadingFiles = false;
        this.uploadedFiles = [];
        this.showMsg(error.toString());
        console.log(error.toString());
      }
    },
  },

  watch: {
    slctdMsgAmount() {
      setTimeout(() => {
        this.$refs.bottomChatEl.scrollIntoView();
      }, 1);
    },
    'slctd.chatType'() {
      setTimeout(() => {
        this.$refs.bottomChatEl.scrollIntoView();
      }, 1);
      this.uploadedFiles = [];
    },
    'slctd.smsGroup'() {
      setTimeout(() => {
        this.$refs.bottomChatEl.scrollIntoView();
      }, 1);
      this.uploadedFiles = [];
    },
    'slctd.chatGroup'() {
      setTimeout(() => {
        this.$refs.bottomChatEl.scrollIntoView();
      }, 1);
      this.uploadedFiles = [];
    },
  },

  mounted() {
    setTimeout(() => {
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
  margin-top: 45px;
  text-align: right;
  right: 200px;
}
.chat-box-left {
  border-radius: 10px;
  margin-right: 25%;
  margin-bottom: 10px;
  padding: 5px;
  text-align: left;
}
.chat-box-right {
  border-radius: 10px;
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
}
.chat-box-uploaded-files,
.chat-box textarea {
  float: left;
  resize: none;
  width: calc(100% - 170px);
  height: 100%;
  padding: 5px;
  overflow-y: scroll;
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
