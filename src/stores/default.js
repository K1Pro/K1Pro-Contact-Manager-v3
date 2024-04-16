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
        loginURL: login_url,
        userData: 'users',
        login: 'sessions',
        logout: 'sessions/',
      },
      times: {
        Y_m_d: gm_Y_m_d_date,
        Y_m_d_H_i_s: '',
      },
      appName: app_name,
    };
  },
  actions: {
    async time(method, timezone, datetime) {
      try {
        const response = await fetch(time_url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            Timezone: timezone,
            Datetime: datetime,
          }),
        });
        const timeResJSON = await response.json();
        if (timeResJSON.success) {
          this.times = timeResJSON.data;
        }
      } catch (error) {
        console.log(error.toString());
      }
    },
  },
  getters: {},
});
