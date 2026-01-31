<template>
  <div class="emails">
    <template v-if="contacts">
      <div class="emails-title">
        Send email to
        {{ contacts[slctdCntctIndex].Members[0].First ? contacts[slctdCntctIndex].Members[0].First : '' }}
        {{ contacts[slctdCntctIndex].Members[0]?.Name }}
        <i @click="slctd.sideMenuLnk = ['Contactinfo', 'Calendar']" class="fa-solid fa-xmark"></i>
      </div>
      <div class="emails-body">
        <div class="emailInputLabel">From:</div>
        <input type="text" :value="userData.Email" disabled />

        CC:
        <input type="checkbox" ref="CC" />

        <div class="emailInputLabel">To:</div>
        <select ref="emailTo">
          <template v-for="connection in contacts[slctdCntctIndex].Connections">
            <option v-if="connection.Email" :value="connection.Email">
              {{ connection.Email }}
            </option>
          </template>
        </select>

        <div class="emailInputLabel">Template:</div>
        <select v-model="slctdTemplate" ref="emailTemplate">
          <option value="null">None</option>
          <option v-for="(email, emailIndex) in sttngs.entity.emails" :value="emailIndex">
            {{ email.placeholder }}
          </option>
        </select>

        <div class="emailInputLabel">Subject:</div>
        <input
          ref="emailSubject"
          type="text"
          :value="slctdTemplate != 'null' ? sttngs.entity.emails[slctdTemplate].subject : ''"
          placeholder="Enter email subject"
        />

        <div class="emailInputLabel">Attachment:</div>
        <input ref="emailAttachment" type="file" multiple />

        <span ref="emailBody" spellcheck="false" contenteditable="true" v-html="templateBody"></span>

        <button :disabled="spinLogin" @click="sendEmail" style="cursor: pointer">
          <i v-if="spinLogin" class="spin fa-sharp fa-solid fa-circle-notch"></i>
          <template v-else>Send</template>
        </button>
        <select style="width: calc(85% - 15px); border: none">
          <option v-for="email in contacts[slctdCntctIndex].Email">
            {{ userList?.[email.frm]?.FirstName }} sent an email
            {{ emailTemplates.includes(email.msg?.toLowerCase()) ? '(' + email.msg + ')' : '' }} on
            {{ usaDateFrmt(email.dat) }} to
            {{ email.tow }}
          </option>
        </select>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Emails',

  inject: ['contacts', 'slctd', 'slctdCntctIndex', 'sttngs', 'updt', 'userData', 'userList', 'showMsg', 'usaDateFrmt'],

  computed: {
    templateBody() {
      let slctdTemplateBody;
      if (this.slctdTemplate != 'null') {
        // prettier-ignore
        slctdTemplateBody = this.sttngs.entity.emails[this.slctdTemplate].body
          .replaceAll('___FirstName___', this.contacts[this.slctdCntctIndex].Members[0]?.First)
          .replaceAll('___Address___', this.contacts[this.slctdCntctIndex]?.Addresses?.[0]?.Address_1)
          .replaceAll('___Address2___', this.contacts[this.slctdCntctIndex]?.Addresses?.[0]?.Address_2)
          .replaceAll('___City___', this.contacts[this.slctdCntctIndex]?.Addresses?.[0]?.City)
          .replaceAll('___State___', this.contacts[this.slctdCntctIndex]?.Addresses?.[0]?.State)
          .replaceAll('___Zip___', this.contacts[this.slctdCntctIndex]?.Addresses?.[0]?.Zip)
          .replaceAll('___Phone___', this.contacts[this.slctdCntctIndex]?.Connections?.[0]?.Phone)
          .replaceAll('___Car1___', this.contacts[this.slctdCntctIndex]?.Assets?.[0]?.Car)
          .replaceAll('___Car2___', this.contacts[this.slctdCntctIndex]?.Assets?.[1]?.Car)
          .replaceAll('___Car3___', this.contacts[this.slctdCntctIndex]?.Assets?.[2]?.Car)
          .replaceAll('___Car4___', this.contacts[this.slctdCntctIndex]?.Assets?.[3]?.Car)
          .replaceAll('___Policy1Type___', this.contacts[this.slctdCntctIndex]?.Custom1?.[0]?.Type)
          .replaceAll('___Policy2Type___', this.contacts[this.slctdCntctIndex]?.Custom1?.[1]?.Type)
          .replaceAll('___Policy3Type___', this.contacts[this.slctdCntctIndex]?.Custom1?.[2]?.Type)
          .replaceAll('___Policy4Type___', this.contacts[this.slctdCntctIndex]?.Custom1?.[3]?.Type)
          .replaceAll('___Policy1No___', this.contacts[this.slctdCntctIndex]?.Custom1?.[0]?.No)
          .replaceAll('___Policy2No___', this.contacts[this.slctdCntctIndex]?.Custom1?.[1]?.No)
          .replaceAll('___Policy3No___', this.contacts[this.slctdCntctIndex]?.Custom1?.[2]?.No)
          .replaceAll('___Policy4No___', this.contacts[this.slctdCntctIndex]?.Custom1?.[3]?.No)
          .replaceAll('___Policy1Date___', this.contacts[this.slctdCntctIndex]?.Custom1?.[0]?.Eff?.slice(5,7) + '/' + this.contacts[this.slctdCntctIndex]?.Custom1?.[0]?.Eff?.slice(8,10) + '/' + this.contacts[this.slctdCntctIndex]?.Custom1?.[0]?.Eff?.slice(0,4))
          .replaceAll('___Policy2Date___', this.contacts[this.slctdCntctIndex]?.Custom1?.[1]?.Eff?.slice(5,7) + '/' + this.contacts[this.slctdCntctIndex]?.Custom1?.[1]?.Eff?.slice(8,10) + '/' + this.contacts[this.slctdCntctIndex]?.Custom1?.[1]?.Eff?.slice(0,4))
          .replaceAll('___Policy3Date___', this.contacts[this.slctdCntctIndex]?.Custom1?.[2]?.Eff?.slice(5,7) + '/' + this.contacts[this.slctdCntctIndex]?.Custom1?.[2]?.Eff?.slice(8,10) + '/' + this.contacts[this.slctdCntctIndex]?.Custom1?.[2]?.Eff?.slice(0,4))
          .replaceAll('___Policy4Date___', this.contacts[this.slctdCntctIndex]?.Custom1?.[3]?.Eff?.slice(5,7) + '/' + this.contacts[this.slctdCntctIndex]?.Custom1?.[3]?.Eff?.slice(8,10) + '/' + this.contacts[this.slctdCntctIndex]?.Custom1?.[3]?.Eff?.slice(0,4))
          .replaceAll('___Username___', this.userData.FirstName)
          .replaceAll('___Useremail___', this.userData.Email.slice(0,1).toUpperCase() + this.userData.Email.slice(1))
      } else {
        slctdTemplateBody = '';
      }
      return slctdTemplateBody.replaceAll('undefined', '');
    },
    emailTemplates() {
      let emailTemplatesArray = [];
      this.sttngs.entity.emails.forEach((email) => emailTemplatesArray.push(email.placeholder?.toLowerCase()));
      return emailTemplatesArray;
    },
  },

  data() {
    return { spinLogin: false, slctdTemplate: 'null' };
  },

  methods: {
    async sendEmail() {
      const confirmSendEmail = 'Are you sure you would like to send this?';
      if (confirm(confirmSendEmail) == true) {
        this.spinLogin = true;
        const columnIndex = this.slctdCntctIndex;
        const emailTemplate =
          this.$refs['emailTemplate'].value == 'null'
            ? ''
            : this.sttngs.entity.emails[this.slctdTemplate].placeholder.toLowerCase();
        const tow = this.$refs['emailTo'].value;
        let formData = new FormData();
        Object.values(this.$refs['emailAttachment'].files).forEach((file) => {
          formData.append('email_attachment[]', file);
        });
        formData.append('To', tow);
        formData.append('Subject', this.$refs['emailSubject'].value);
        formData.append('Template', emailTemplate);
        formData.append('Body', this.$refs['emailBody'].innerHTML);
        formData.append('id', this.contacts[this.slctdCntctIndex].id);
        formData.append('CC', this.$refs['CC'].checked);
        try {
          const response = await fetch(
            app_api_url + '/' + this.updt.updtngY_m_d_H_i_s_z.slice(0, 19).replace(' ', 'T') + '/emails',
            {
              method: 'POST',
              headers: {
                Authorization: access_token,
                'Cache-Control': 'no-store',
              },
              body: formData,
            },
          );
          const sendEmailResJSON = await response.json();
          if (sendEmailResJSON.success) {
            this.spinLogin = false;
            this.showMsg(sendEmailResJSON.messages[0]);
            this.contacts[columnIndex].Email.unshift({
              frm: this.userData.id,
              dat: this.updt.updtngY_m_d_H_i_s_z.slice(0, 16),
              tow: tow,
              msg: emailTemplate,
            });
          } else {
            this.spinLogin = false;
            this.showMsg('Email error');
          }
        } catch (error) {
          this.spinLogin = false;
          this.showMsg(error?.toString()?.slice(-20));
          console.log(error.toString());
        }
      }
    },
  },
};
</script>

<style>
.emails {
  padding: 10px 10px 10px 10px;
  font-size: 12px;
}
.emails-title {
  background-color: lightblue;
  font-weight: bold;
  padding: 5px;
  color: black;
  height: 30px;
  overflow: hidden;
  white-space: nowrap;
  font-size: 16px;
}
.emails-title i {
  float: right;
  cursor: pointer;
}
.emails-body {
  background-color: white;
  width: 100%;
  height: calc(100vh - 50px);
  font-family: 'Helvetica', sans-serif;
  padding: 5px;
  border: none;
  overflow: hidden scroll;
}
.emailInputLabel {
  text-align: right;
  display: inline-block;
  width: 70px;
  padding: 5px;
}
.emails-body select,
.emails-body input:not([disabled]):not([type='checkbox']) {
  width: calc(100% - 75px);
  margin: 5px 0px 5px 0px;
  padding: 5px;
}
.emails-body input:disabled {
  width: calc(100% - 125px);
  margin: 5px 0px 5px 0px;
  padding: 5px;
}
.emails-body button {
  padding: 5px;
  width: 15%;
  margin: 5px;
}
.emails-body span {
  border-radius: 1px;
  border: 1px solid black;
  padding: 5px;
  margin: 5px;
  word-break: break-word;
  font-size: 12px;
}
.emails-body span[contenteditable] {
  display: block; /* not sure if this is needed */
  height: calc(100vh - 330px);
  overflow: hidden scroll;
}
.emails-body span[contenteditable]:empty::before {
  content: 'Enter email body';
  display: inline-block;
  color: grey;
  height: calc(100vh - 330px);
  overflow: hidden hidden;
}
.emails-body span[contenteditable]:empty:focus::before {
  content: 'Start typing';
  color: grey;
  height: calc(100vh - 330px);
  overflow: hidden hidden;
}

@media only screen and (min-width: 768px) {
  .emails {
    padding: 10px 10px 10px 0px;
  }
}
</style>
