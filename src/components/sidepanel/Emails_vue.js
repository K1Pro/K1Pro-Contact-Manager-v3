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
            </div>
            <div class="emails-body">
                <div><input type="text" :value="emailRecepient[0]"/></div>
                <div>
                    <select v-model="selectedEmail">
                        <option value="null">Choose template</option>
                        <option v-for="email, emailIndex in emails" :value="emailIndex">{{email.placeholder}}</option>
                    </select>
                </div>
                <span ref="currentEmailBody" spellcheck="false" contenteditable="plaintext-only" v-html="emailBody"></span>
                <button @click="sendEmail">Send</button>
            </div>
        </template>
    </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'accessToken',
      'msg',
      'userData',
      'userSettings',
      'contacts',
      'emails',
      'endPts',
      'slctdCntct',
    ]),
    emailBody() {
      let selectedEmailBody;
      if (this.selectedEmail != 'null') {
        // prettier-ignore
        selectedEmailBody = this.emails[this.selectedEmail].body
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
          .replaceAll('___Username___', this.userData.FirstName)
          .replaceAll('___Useremail___', this.userData.Email)
      } else {
        selectedEmailBody = '';
      }
      return selectedEmailBody.replaceAll('undefined', '');
    },
    emailRecepient() {
      let emailRecipientArray = [];
      this.slctdCntct.Connections.forEach((connection) => {
        if (connection.Email) {
          emailRecipientArray.push(connection.Email);
        }
      });
      return emailRecipientArray;
    },
  },

  //   components: {
  //     example,
  //   },

  //   props: [''],

  //   emits: [''],

  data() {
    return { selectedEmail: 'null' };
  },

  methods: {
    async sendEmail() {
      try {
        const response = await fetch(servr_url + this.endPts.emails, {
          method: 'POST',
          headers: {
            Authorization: this.accessToken,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            RecepientEmail: this.emailRecepient[0],
            RecepientName: this.slctdCntct.Members[0]?.First,
            Body: this.$refs['currentEmailBody'].innerHTML,
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
    },
  },

  mounted() {
    style(
      'emails',
      /*css*/ `
.emails {}
.emails-title {
    background-color: lightblue;
    font-weight: bold;
    padding: 5px;
    color: black;
    height: 30px;
    overflow: hidden;
    white-space: nowrap;
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
/* .emails-body textarea{
    font-size: 12px;
    font-weight: normal;
    font-family: 'Helvetica', sans-serif;
    width: 100%;
    height: calc(100% - 50px);
    margin: 5px 0px 5px 0px;
    resize: vertical;
} */
.emails-body select, .emails-body input{
    width: 100%;
    margin: 5px 0px 5px 0px;
}
.emails-body button{
    width: 50%;
    margin: 5px 0px 5px 0px;
}
.emails-body span {
    border-radius: 1px;
    border: 1px solid black;
    padding: 5px;
    word-break: break-word;
    font-size: 14px;
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
