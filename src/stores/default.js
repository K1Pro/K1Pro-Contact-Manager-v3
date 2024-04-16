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
      accountSettings: { tabs: {} },
      userSettings: { calendar: {}, layout: { 'grid-size': '' } },
      endPts: {
        url: url,
        accountLoginURL: accountlogin_url,
        accountResetURL: accountreset_url,
        k1proURL: k1pro_url,
        loginURL: login_url,
        userData: 'users',
        settings: 'settings',
        login: 'sessions',
        logout: 'sessions/',
      },
      times: {
        Y_m_d: server_datetime_Y_m_d,
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
    async patchUserSettings() {
      try {
        const response = await fetch(servr_url + this.endPts.settings, {
          method: 'PATCH',
          headers: {
            Authorization: this.accessToken,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            Settings: this.userSettings,
          }),
        });
        const patchUserSettingsResJSON = await response.json();
        if (!patchUserSettingsResJSON.success) {
          console.log(patchUserSettingsResJSON);
          // this.msg.snackBar = patchUserSettingsResJSON.messages[0];
        }
      } catch (error) {
        console.log(error.toString());
        this.msg.snackBar = error.toString();
      }
    },
  },
  getters: {},
});
