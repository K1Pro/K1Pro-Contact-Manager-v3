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
      activeTab: 'house-chimney-user',
      userData: {},
      accountSettings: {},
      userSettings: {},
      tempUserSettings: {},
      contacts: [],
      endPts: {
        url: url,
        accountLoginURL: accountlogin_url,
        accountResetURL: accountreset_url,
        k1proURL: k1pro_url,
        loginURL: login_url,
        userData: 'users',
        settings: 'settings',
        contacts: 'contacts',
        login: 'sessions',
        logout: 'sessions/',
      },
      times: {
        Y_m_d: server_datetime_Y_m_d,
        Y_m_d_H_i_s: '',
      },
      firstCalDate: '',
      daysRangeArr: [1, 3, 7, 14, 21, 28],
      appName: app_name,
    };
  },
  actions: {
    async time(method, timezone, datetime, type) {
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
          if (type == 'time') {
            this.times = timeResJSON.data;
            // console.log('times');
            // console.log(timeResJSON.data);
            // console.log('=================');
          } else if (type == 'firstCalDate') {
            this.firstCalDate = timeResJSON.data.Y_m_d;
            // console.log('firstCalDate');
            // console.log(timeResJSON.data.Y_m_d);
            // console.log('=================');
          }
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
    changeCalDaysOrder() {
      const DaysOrderYesterday =
        this.dayOfTheWeek == 1 ? '' : 'previous Monday';
      if (this.userSettings.calendar.filters.days == 0) {
        this.time('POST', null, this.times.Y_m_d, 'firstCalDate');
      } else if (this.userSettings.calendar.filters.days == 1) {
        // prettier-ignore
        this.time('POST', null, `${this.times.Y_m_d} yesterday`, 'firstCalDate');
      } else if (this.userSettings.calendar.filters.days == 2) {
        // prettier-ignore
        this.time('POST', null, `${this.times.Y_m_d} ${DaysOrderYesterday}`, 'firstCalDate');
      } else {
        // prettier-ignore
        this.time('POST', null, `${this.times.Y_m_d} -1 week ${DaysOrderYesterday}`, 'firstCalDate');
      }
    },
  },
  getters: {
    days(state) {
      let dateRangeStart = 1;
      let dateArray = [];
      let timezone = new Date(state.firstCalDate).getTimezoneOffset() / 60;
      let currentDate = new Date(
        new Date(state.firstCalDate).setHours(
          new Date(state.firstCalDate).getHours() + timezone
        )
      );
      while (
        dateRangeStart <=
        state.daysRangeArr[state.userSettings.calendar.filters.days]
      ) {
        dateArray.push(
          // prettier-ignore
          currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + currentDate.getDate().toString().padStart(2, '0')
        );
        // Can use UTC date to prevent problems with time zones and DST: currentDate.setUTCDate(currentDate.getUTCDate() + steps);
        currentDate.setDate(currentDate.getDate() + 1);
        dateRangeStart++;
      }
      return dateArray;
    },
    dayOfTheWeek(state) {
      return new Date(state.times.Y_m_d).getDay(); // 1 is Monday, 2 is Tuesday, ..., 0 is Sunday
    },
    dayIndex(state) {
      return state.days.findIndex((day) => day == state.times.Y_m_d);
    },
    calRow(state) {
      return Math.ceil(
        (state.days.findIndex((day) => day == state.times.Y_m_d) + 1) / 7
      );
    },
    slctdCntct(state) {
      return state.contacts[state.userSettings.selectedContactIndex];
    },
  },
});
