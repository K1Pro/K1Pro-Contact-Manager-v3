<template>
  <button title="Log out" @click.prevent="deleteLogin">
    <i class="fa fa-sign-out"></i>
    Log out
  </button>
</template>

<script>
export default {
  name: 'Logoutbtn',

  methods: {
    deleteCookie() {
      document.cookie = `_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${this.cookiePath};`;
      document.cookie = `_s_i=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${this.cookiePath};`;
      location.reload();
    },

    async deleteLogin() {
      if (confirm('Are you sure you want to log out?') == true) {
        // this.msg.snackBar = 'Logged out';
        try {
          const response = await fetch(login_url + 'sessions/' + session_id, {
            method: 'DELETE',
            headers: {
              Authorization: access_token,
              'Cache-Control': 'no-store',
            },
          });
          this.deleteCookie();
          // const logOutResJSON = await response.json();
        } catch (error) {
          this.deleteCookie();
          // this.msg.snackBar = 'Logged out with error';
          console.log(error);
        }
      }
    },
  },
};
</script>

<style></style>
