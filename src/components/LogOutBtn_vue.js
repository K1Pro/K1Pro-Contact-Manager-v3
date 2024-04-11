export default {
  name: 'LogOutBtn',

  template: /*html*/ `
    <button
      title="Log out"
      @click.prevent="deleteLogin">
      <i class="fa fa-sign-out"></i>
      <span v-if="sidePanelOpen">
        Log out
      </span>
    </button>
  `,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'accessToken',
      'sessionID',
      'loggedIn',
      'msg',
      'endPts',
    ]),
  },

  props: ['sidePanelOpen'],

  methods: {
    deleteCookie() {
      this.accessToken = undefined;
      this.sessionID = undefined;
      document.cookie = `_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${this.cookiePath};`;
      document.cookie = `_s_i=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${this.cookiePath};`;
    },

    async deleteLogin() {
      if (confirm('Are you sure you want to log out?') == true) {
        this.loggedIn = false;
        this.msg.snackBar = 'Logged out';
        try {
          const response = await fetch(
            this.endPts.loginURL + this.endPts.logout + this.sessionID,
            {
              method: 'DELETE',
              headers: {
                Authorization: this.accessToken,
                'Cache-Control': 'no-store',
              },
            }
          );
          this.deleteCookie();
          // const logOutResJSON = await response.json();
        } catch (error) {
          this.deleteCookie();
          this.msg.snackBar = 'Logged out';
          console.log(error);
        }
      }
    },
  },
};
