const useDefaultStore = Pinia.defineStore('default', {
  state: () => {
    return {
      accessToken: '',
      sessionID: '',
      loggedIn: '',
      msg: {
        snackBar: '',
        login: '',
      },
      windowWidth: 0,
      userData: {},
      accountParams: {},
      endPts: {
        url: url,
        accountLoginURL: accountlogin_url,
        accountResetURL: accountreset_url,
        k1proURL: k1pro_url,
        loginURL: loginURL,
        userData: 'users',
        login: 'sessions',
        logout: 'sessions/',
      },
      appName: app_name,
    };
  },
  actions: {},
  getters: {},
});
