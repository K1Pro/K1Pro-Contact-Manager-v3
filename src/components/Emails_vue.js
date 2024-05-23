// import example from './components/example_vue.js';

export default {
  name: 'Emails',

  template: /*html*/ `
    <div class='emails'>
      <template v-if="slctdCntct && contacts && userSettings">
        <div class="emails-title">
        Send email to
        {{slctdCntct.Members[0].First ? slctdCntct.Members[0].First : ''}} 
        {{slctdCntct.Members[0].Name}}
        <i @click="activeWindow = 'calendar'" class="fa-solid fa-xmark"></i>
        </div>
        <div class="emails-body">
          <div class=emailInputLabel>From:</div>
          <input type="text" :value="userData.Email" disabled/>

          <div class=emailInputLabel>To:</div>
          <select ref="emailTo">
            <template v-for="connection in slctdCntct.Connections">
              <option v-if="connection.Email" :value="connection.Email">{{ connection.Email }}</option>
            </template>
          </select>

          <div class=emailInputLabel>Template:</div>
          <select v-model="slctdTemplate">
            <option value="null">None</option>
            <option v-for="email, emailIndex in emails" :value="emailIndex">{{email.placeholder}}</option>
          </select>

          <div class=emailInputLabel>Subject:</div>
          <input ref="emailSubject" type="text" :value="slctdTemplate != 'null' ? emails[slctdTemplate].subject : ''" placeholder="Enter email subject" />

          <div class=emailInputLabel>Attachment:</div>
          <input type="file" name="filename" @change="uploadFile" multiple>

          <span ref="emailBody" spellcheck="false" contenteditable="plaintext-only" v-html="templateBody"></span>


          <button @click="sendEmail">Send</button>

        </div>
      </template>
    </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'accessToken',
      'msg',
      'activeWindow',
      'userData',
      'userSettings',
      'contacts',
      'emails',
      'endPts',
      'slctdCntct',
    ]),
    templateBody() {
      let slctdTemplateBody;
      if (this.slctdTemplate != 'null') {
        // prettier-ignore
        slctdTemplateBody = this.emails[this.slctdTemplate].body
          .replaceAll('___FirstName___', this.slctdCntct.Members[0]?.First)
          .replaceAll('___Address___', this.slctdCntct?.Properties?.[0]?.Address_1)
          .replaceAll('___Address2___', this.slctdCntct?.Properties?.[0]?.Address_2)
          .replaceAll('___City___', this.slctdCntct?.Properties?.[0]?.City)
          .replaceAll('___State___', this.slctdCntct?.Properties?.[0]?.State)
          .replaceAll('___Zip___', this.slctdCntct?.Properties?.[0]?.Zip)
          .replaceAll('___Phone___', this.slctdCntct?.Connections?.[0]?.Phone)
          .replaceAll('___Car1___', this.slctdCntct?.Assets?.[0]?.Car)
          .replaceAll('___Car2___', this.slctdCntct?.Assets?.[1]?.Car)
          .replaceAll('___Car3___', this.slctdCntct?.Assets?.[2]?.Car)
          .replaceAll('___Car4___', this.slctdCntct?.Assets?.[3]?.Car)
          .replaceAll('___Policy1Type___', this.slctdCntct?.Custom1?.[0]?.Policy_Type)
          .replaceAll('___Policy2Type___', this.slctdCntct?.Custom1?.[1]?.Policy_Type)
          .replaceAll('___Policy3Type___', this.slctdCntct?.Custom1?.[2]?.Policy_Type)
          .replaceAll('___Policy4Type___', this.slctdCntct?.Custom1?.[3]?.Policy_Type)
          .replaceAll('___Policy1No___', this.slctdCntct?.Custom1?.[0]?.Policy_No)
          .replaceAll('___Policy2No___', this.slctdCntct?.Custom1?.[1]?.Policy_No)
          .replaceAll('___Policy3No___', this.slctdCntct?.Custom1?.[2]?.Policy_No)
          .replaceAll('___Policy4No___', this.slctdCntct?.Custom1?.[3]?.Policy_No)
          .replaceAll('___Policy1Date___', this.slctdCntct?.Custom1?.[0]?.Date.slice(5,7) + '/' + this.slctdCntct?.Custom1?.[0]?.Date.slice(8,10) + '/' + this.slctdCntct?.Custom1?.[0]?.Date.slice(0,4))
          .replaceAll('___Policy2Date___', this.slctdCntct?.Custom1?.[1]?.Date.slice(5,7) + '/' + this.slctdCntct?.Custom1?.[1]?.Date.slice(8,10) + '/' + this.slctdCntct?.Custom1?.[1]?.Date.slice(0,4))
          .replaceAll('___Policy3Date___', this.slctdCntct?.Custom1?.[2]?.Date.slice(5,7) + '/' + this.slctdCntct?.Custom1?.[2]?.Date.slice(8,10) + '/' + this.slctdCntct?.Custom1?.[2]?.Date.slice(0,4))
          .replaceAll('___Policy4Date___', this.slctdCntct?.Custom1?.[3]?.Date.slice(5,7) + '/' + this.slctdCntct?.Custom1?.[3]?.Date.slice(8,10) + '/' + this.slctdCntct?.Custom1?.[3]?.Date.slice(0,4))
          .replaceAll('___Username___', this.userData.FirstName)
          .replaceAll('___Useremail___', this.userData.Email.slice(0,1).toUpperCase() + this.userData.Email.slice(1))
      } else {
        slctdTemplateBody = '';
      }
      return slctdTemplateBody.replaceAll('undefined', '');
    },
  },

  //   components: {
  //     example,
  //   },

  //   props: [''],

  //   emits: [''],

  data() {
    return { slctdTemplate: 'null' };
  },

  methods: {
    async sendEmail() {
      const confirmSendEmail = 'Are you sure you would like to send this?';
      if (confirm(confirmSendEmail) == true) {
        try {
          const response = await fetch(servr_url + this.endPts.emails, {
            method: 'POST',
            headers: {
              Authorization: this.accessToken,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
            body: JSON.stringify({
              To: this.$refs['emailTo'].value,
              Subject: this.$refs['emailSubject'].value,
              Body: this.$refs['emailBody'].innerHTML,
            }),
          });
          const sendEmailResJSON = await response.json();
          if (sendEmailResJSON.success) {
            this.msg.snackBar = 'Email sent successfully';
            console.log(sendEmailResJSON);
          } else {
            this.msg.snackBar = 'Email error';
          }
        } catch (error) {
          this.msg.snackBar = error.toString();
          console.log(error.toString());
        }
      }
    },
    async uploadFile(event) {
      let files = event.target.files;
      console.log(event.target.files);
      let formData = new FormData();
      formData.append('email_attachment', files);

      // const reader = new FileReader();
      // reader.readAsDataURL(event.target.files[0]);
      // reader.onload = (e) => {
      //   this.userStore.userData.MostRecentPhoto = e.target.result;
      // };

      try {
        const response = await fetch(servr_url + this.endPts.emails, {
          method: 'POST',
          headers: {
            Authorization: this.accessToken,
            'Cache-Control': 'no-store',
          },
          body: formData,
        });
        const uploadFileJSON = await response.json();
        if (uploadFileJSON.success) {
          console.log(uploadFileJSON);
        }
      } catch (error) {
        this.msg.snackBar = error.toString();
      }
    },
  },

  mounted() {
    style(
      'emails',
      /*css*/ `
.emails {
  padding: 10px 10px 10px 0px;
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
.emails-title i{
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
.emails-body input{
    width: calc(100% - 75px);
    margin: 5px 0px 5px 0px;
    padding: 5px;
}
.emails-body button{
  padding: 5px;
    width: 50%;
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
.emails-body span[contenteditable]{
    display: block; /* not sure if this is needed */
}
.emails-body span[contenteditable]:empty::before {
    content: 'Enter email body';
    display: inline-block;
    color: grey;
    height: 200px;
}
.emails-body span[contenteditable]:empty:focus::before {
    content: 'Start typing';
    color: grey;
    height: 200px;
}
`
    );
  },
};
