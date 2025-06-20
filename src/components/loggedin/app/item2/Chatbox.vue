<template>
  <div class="chat-box">
    <div class="chat-box-title">
      {{ slctd.chatType }} with
      {{
        slctd.chatType == 'SMS'
          ? (contacts[slctdCntctIndex].Members[0].First ? contacts[slctdCntctIndex].Members[0].First : '') +
            ' ' +
            contacts[slctdCntctIndex].Members[0].Name +
            ' (' +
            slctd.smsGroup +
            ')'
          : slctd.chatGroup
      }}
    </div>
    <div class="chat-box-body">
      <div v-for="(msg, msgIndx) in slctdMsgs">
        <div v-if="msg.dat.slice(5, 10) != slctdMsgs?.[msgIndx - 1]?.dat?.slice(5, 10)" class="chat-box-body-time">
          <div class="chat-box-body-timedate">{{ this.usaDateFrmt(msg.dat).slice(0, 10) }}</div>
        </div>

        <div
          class="chat-box-body-msg"
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
            height: msg.tp.includes('msg') || msg.tp.includes('image') ? false : '80px',
          }"
        >
          <template v-if="msg.tp == 'msg'">
            <i v-if="msg.err" class="fa-solid fa-circle-exclamation" :title="msg.err"></i> {{ msg.msg }}
          </template>
          <a
            v-else
            :href="'src/assets/images/' + userData.Entity + '/' + secDir + msgLctn + msg.msg"
            target="_blank"
            style="text-decoration: none"
          >
            <img
              v-if="msg.tp.includes('image')"
              :src="'src/assets/images/' + userData.Entity + '/' + secDir + msgLctn + msg.msg"
              alt="pic"
              style="width: 30%"
            />
            <div
              v-else
              :style="{
                backgroundColor: fileTypeColors?.[msg?.tp?.split('/')?.[1]]?.body
                  ? fileTypeColors[msg.tp.split('/')[1]].body
                  : '#C0C0C0',
                color: fileTypeColors?.[msg?.tp?.split('/')?.[1]]?.text
                  ? fileTypeColors[msg.tp.split('/')[1]].text
                  : '#000000',
                right: msg.frm == userData.id ? '5px' : false,
                left: msg.frm != userData.id ? '5px' : false,
              }"
              style="
                width: 30%;
                height: 50px;
                text-align: center;
                padding-top: 15px;
                border-radius: 5px;
                position: absolute;
              "
            >
              {{ msg.tp.split('/')[1] }}
            </div>
          </a>

          <div
            class="chat-box-body-date"
            :style="{
              position: msg.tp.includes('msg') || msg.tp.includes('image') ? false : 'absolute',
              bottom: msg.tp.includes('msg') || msg.tp.includes('image') ? false : '5px',
              right: (msg.tp.includes('msg') || msg.tp.includes('image')) && msg.frm == userData.id ? false : '5px',
              left: (msg.tp.includes('msg') || msg.tp.includes('image')) && msg.frm != userData.id ? false : '5px',
            }"
          >
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
      <div
        v-if="uploadedFiles.length > 0"
        style="
          display: grid;
          grid-gap: 10px;
          width: calc(100% - 170px);
          float: left;
          border: 1px solid black;
          height: 65px;
        "
        :style="{ gridTemplateColumns: 'repeat(' + uploadedFiles.length + ', 83px) auto' }"
      >
        <a
          v-for="(uploadedFile, uploadedFileIndx) in uploadedFiles"
          :style="{ borderLeft: uploadedFileIndx === 0 ? false : '1px solid black', borderRight: '1px solid black' }"
          :href="uploadedFile.path + uploadedFile.filename"
          target="_blank"
          style="text-decoration: none"
          :name="uploadedFile.filename"
        >
          <img
            v-if="uploadedFile.type.includes('image')"
            :src="uploadedFile.path + uploadedFile.filename"
            style="width: 81px; height: 59px"
          />
          <div
            v-else
            :style="{
              backgroundColor: fileTypeColors?.[uploadedFile?.type?.split('/')?.[1]]?.body
                ? fileTypeColors[uploadedFile.type.split('/')[1]].body
                : '#C0C0C0',
              color: fileTypeColors?.[uploadedFile?.type?.split('/')?.[1]]?.text
                ? fileTypeColors[uploadedFile.type.split('/')[1]].text
                : '#000000',
            }"
            style="width: 100%; height: 100%; text-align: center; padding-top: 20px"
          >
            {{ uploadedFile.type.split('/')[1] }}
          </div>
        </a>
      </div>

      <textarea
        v-else
        :placeholder="'Enter ' + slctd.chatType + ' here'"
        v-model="chatBoxMsg"
        v-on:keyup.enter="sttngs.entity.sms.enabled === true && slctd.chatType == 'SMS' ? sendSMS() : sendChat()"
        :disabled="dsbld || spinLogin || uploadingFiles"
      ></textarea>
      <div v-if="slctd.chatType == 'SMS' && uploadedFiles.length === 0" class="chat-msg-len">
        {{ Math.ceil(chatBoxMsg.length / 160) }} / {{ chatBoxMsg.length }}
      </div>
      <!-- <button :disabled="dsbld || spinLogin"><i class="fa-solid fa-paperclip"></i></button> -->
      <button v-if="uploadingFiles" disabled><i class="spin fa-sharp fa-solid fa-circle-notch"></i></button>
      <template v-else>
        <label for="chat-upload-btn"><i class="fa-solid fa-paperclip"></i></label>
        <input type="file" id="chat-upload-btn" hidden @change="uploadFile($event)" multiple />
      </template>

      <button
        :disabled="uploadedFiles.length === 0 && (spinLogin || !chatBoxMsg || dsbld || uploadingFiles)"
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
  },

  methods: {
    sendChat() {
      if (this.chatBoxMsg.replaceAll('\n', '') != '' || this.uploadedFiles.length > 0) {
        this.spinLogin = true;
        const dat = this.times.updtngY_m_d_H_i_s_z;
        const frm = this.userData.id;
        const tow = this.sttngs.entity.chats[this.slctd.chatGroup];
        const msg = this.uploadedFiles.length > 0 ? this.uploadedFiles : [{ filename: this.chatBoxMsg }];

        this.times.mstRcntChat = dat.slice(0, 19).replace('T', ' ');
        this.chatBoxMsg = '';
        this.uploadedFiles = [];

        if (this.chats === null) this.chats = [];
        this.sttngs.user.chats[this.slctd.chatGroup] = dat.slice(0, 19).replace('T', ' ');
        this.sttngsReq('PATCH', 'user');

        msg.forEach((uploadedFile) => {
          const chatBody = {
            frm: frm,
            tow: tow,
            msg: uploadedFile.filename.replaceAll('\n', ''),
            tp: uploadedFile.type ? uploadedFile.type : 'msg',
          };
          this.postChat(dat, chatBody);
        });
      } else {
        this.showMsg('Message cannot be blank');
        this.chatBoxMsg = '';
        this.uploadedFiles = [];
      }
    },
    async postChat(dat, chatBody) {
      try {
        const response = await fetch(app_api_url + '/' + dat.slice(0, 19).replace(' ', 'T') + '/chats', {
          method: 'POST',
          headers: {
            Authorization: access_token,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify(chatBody),
        });
        const resJSON = await response.json();
        if (resJSON.success) {
          this.spinLogin = false;
          this.chats.push(resJSON.data);
        } else {
          this.spinLogin = false;
          this.showMsg('Chat was not sent');
        }
        console.log(resJSON);
      } catch (error) {
        this.spinLogin = false;
        this.showMsg('Chat was not sent');
        console.log(error.toString());
      }
    },
    async sendSMS() {
      if (this.chatBoxMsg.replaceAll('\n', '') != '') {
        this.spinLogin = true;
        const frm = this.userData.id.toString();
        const dat = this.times.updtngY_m_d_H_i_s_z.slice(0, 19);
        const tp = 'sms';
        const tow = this.slctd.smsGroup.replace(/[^0-9]/g, '');
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
              To: tow,
              ChatMessage: msg,
            }),
          });
          const resJSON = await response.json();
          console.log(resJSON);
          if (resJSON.success) {
            this.spinLogin = false;
            contactMsg.unshift({ frm: frm, dat: dat, tp: tp, tow: tow, msg: msg });
          } else {
            this.spinLogin = false;
            contactMsg.unshift({ frm: frm, dat: dat, tp: tp, tow: tow, msg: msg, err: true });
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
  position: relative;
  font-size: 20px;
}
.chat-msg-len {
  position: absolute;
  margin-top: 45px;
  text-align: right;
  right: 200px;
}
.chat-box-left {
  /* border: 1px solid rgb(255, 205, 205); */
  /* background-color: rgb(255, 205, 205); */
  border-radius: 10px;
  margin-right: 50px;
  margin-bottom: 10px;
  padding: 5px;
  text-align: left;
}
.chat-box-right {
  /* border: 1px solid rgb(205, 255, 205); */
  /* background-color: rgb(205, 255, 205); */
  border-radius: 10px;
  margin-left: 50px;
  margin-bottom: 10px;
  padding: 5px;
  text-align: right;
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
  padding: 5px;
}
.chat-box label {
  display: inline-block;
  background-color: #eeeeee;
  border-radius: 2px;
  border: 1px solid black;
  /* cursor: pointer; */
  height: 100%;
  width: 75px;
  padding: 23.5px 32px;
  color: black;
  font-size: 13px;
  /* margin-bottom: -28px; */
}
.chat-box button {
  /* float: right; */
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
