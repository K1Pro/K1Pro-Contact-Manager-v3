const useDefaultStore = Pinia.defineStore('default', {
  state: () => {
    return {
      accessToken: '',
      sessionID: '',
      loggedIn: '',
      msg: {
        snackBar: '',
        login: '',
        confirmDeletion: 'Are you sure you would like to delete this?',
      },
      windowWidth: 0,
      activeTab: 'house-chimney-user',
      activeWindow: 'calendar',
      eventIndex: null,
      userData: {},
      accountSettings: {},
      activeUserList: {},
      userSettings: {},
      tempFiltersDays: null,
      contacts: [],
      emails: [],
      reports: 'Contacts with minimum info',
      endPts: {
        url: url,
        accountLoginURL: accountlogin_url,
        accountResetURL: accountreset_url,
        k1proURL: k1pro_url,
        loginURL: login_url,
        userData: 'users',
        settings: 'settings',
        contacts: 'contacts',
        currentupdate: 'currentupdate',
        emails: 'emails',
        calls: 'calls',
        login: 'sessions',
        logout: 'sessions/',
      },
      times: {
        Y_m_d: null,
        Y_m_d_H_i_s_z: null,
        timestamp: '',
        initialTimestamp: '',
        slctdTmstmp: '',
        firstSlctdTmstmp: '',
      },
      firstCalDate: '',
      daysRangeArr: [1, 3, 7, 14, 21, 28],
      appName: app_name,
      slctdCntct: [],
    };
  },
  actions: {
    async time(method, timezone, datetimeDescription, type) {
      try {
        const response = await fetch(time_url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            Timezone: timezone,
            DatetimeDescription: datetimeDescription,
          }),
        });
        const timeResJSON = await response.json();
        console.log(timeResJSON);
        if (timeResJSON.success) {
          if (type == 'time') {
            this.times.Y_m_d = timeResJSON.data.Y_m_d;
            console.log('times');
            console.log(timeResJSON.data);
            console.log('=================');
          } else if (type == 'firstCalDate') {
            this.firstCalDate = timeResJSON.data.Y_m_d;
            console.log('firstCalDate');
            console.log(timeResJSON.data.Y_m_d);
            console.log('=================');
          }
        }
      } catch (error) {
        console.log(error.toString());
      }
    },
    async patchContactInfo(event, column, columnIndex, key) {
      // console.log(
      //   'id: ' + this.contacts[this.slctdCntctIndex].id
      // );
      // console.log('column: ' + column);
      // console.log('columnIndex: ' + columnIndex);
      // console.log('key: ' + key);
      // console.log(
      //   'value: ' + (event?.target?.value ? event.target.value : event)
      // );
      // console.log('================');
      this.slctdCntct.Updated = {
        [this.userData.id]: this.times.Y_m_d_H_i_s_z,
      };
      this.contacts[this.slctdCntctIndex].Updated = {
        [this.userData.id]: this.times.Y_m_d_H_i_s_z,
      };
      try {
        const response = await fetch(servr_url + this.endPts.contacts, {
          method: 'PATCH',
          headers: {
            Authorization: this.accessToken,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            ID: this.slctdCntct.id,
            Column: column,
            ColumnIndex: columnIndex,
            Key: key,
            Value: event,
          }),
        });
        const patchContactInfoResJSON = await response.json();
        if (patchContactInfoResJSON.success) {
          // this.msg.snackBar = 'Updated ';
          // console.log(patchContactInfoResJSON);
        }
      } catch (error) {
        this.msg.snackBar = error.toString();
      }
    },
    async deleteContactInfo(column, columnIndex, prevConfirm) {
      // console.log('column: ' + column);
      // console.log('columnIndex: ' + columnIndex);
      if (prevConfirm || confirm(this.msg.confirmDeletion) == true) {
        this.slctdCntct[column].splice(columnIndex, 1);
        this.contacts[this.slctdCntctIndex][column].splice(columnIndex, 1);
        try {
          const response = await fetch(servr_url + this.endPts.contacts, {
            method: 'DELETE',
            headers: {
              Authorization: this.accessToken,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
            body: JSON.stringify({
              ID: this.slctdCntct.id,
              Column: column,
              ColumnIndex: columnIndex,
            }),
          });
          const patchContactInfoResJSON = await response.json();
          if (patchContactInfoResJSON.success) {
            // this.msg.snackBar = 'Updated ';
            // console.log(patchContactInfoResJSON);
          }
        } catch (error) {
          this.msg.snackBar = error.toString();
        }
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
        console.log(patchUserSettingsResJSON);
        if (!patchUserSettingsResJSON.success) {
          // console.log(patchUserSettingsResJSON);
          // this.msg.snackBar = patchUserSettingsResJSON.messages[0];
        }
      } catch (error) {
        console.log(error.toString());
        this.msg.snackBar = error.toString();
      }
    },
    getFirstCalDate() {
      const DaysOrderYesterday = this.dayOfTheWeek == 1 ? '' : 'previous Monday';
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
      let currentDate = new Date(state.firstCalDate + 'T00:00:00');
      // prettier-ignore
      while (dateRangeStart <= state.daysRangeArr[state.userSettings.calendar.filters.days]) {
        // prettier-ignore
        dateArray.push(currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + currentDate.getDate().toString().padStart(2, '0'));
        currentDate.setDate(currentDate.getDate() + 1);
        dateRangeStart++;
      }
      return dateArray;
    },
    dayOfTheWeek(state) {
      return new Date(state.times.Y_m_d + 'T00:00:00').getDay(); // 1 is Monday, 2 is Tuesday, ..., 0 is Sunday
    },
    dayIndex(state) {
      return state.days.findIndex((day) => day == state.times.Y_m_d);
    },
    calRow(state) {
      return Math.ceil((state.days.findIndex((day) => day == state.times.Y_m_d) + 1) / 7);
    },
    slctdCntctIndex(state) {
      return state.contacts.findIndex((contact) => contact.id == state.slctdCntct.id);
    },
    userList(state) {
      return { ...state.activeUserList, ...state.accountSettings.userList };
    },
    firstDate(state) {
      const oneWeek = state.daysRangeArr[state.userSettings.calendar.filters.days] > 7 ? 7 : 0;
      return new Date(
        new Date(state.times.Y_m_d + 'T00:00:00').setDate(
          new Date(state.times.Y_m_d + 'T00:00:00').getDate() - (oneWeek + state.dayOfTheWeek - 1)
        )
      );
    },
  },
});
