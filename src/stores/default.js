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
        initialUsrTmstmp: '',
        initialBrwsrTmstmp: '',
        updtngY_m_d_H_i_s_z: null,
        slctdTmstmp: '',
      },
      daysRangeArr: [1, 3, 7, 14, 21, 28],
      appName: app_name,
      slctdDayIndex: null,
    };
  },
  actions: {
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
      this.contacts[this.slctdCntctIndex].Updated = {
        [this.userData.id]: this.times.updtngY_m_d_H_i_s_z,
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
            ID: this.userSettings.selectedContactIndex,
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
              ID: this.userSettings.selectedContactIndex,
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
  },
  getters: {
    firstDayTmstmp(state) {
      const cmptdDayNumber = state.slctdDayIndex != null ? state.slctdDayIndex : 1;
      const cmptdDayOfTheWeek = state.dayOfTheWeek == 0 ? 6 : state.dayOfTheWeek - 1;
      const cmptdNoOfWeeks = state.slctdDayIndex != null ? Math.floor(state.slctdDayIndex / 7) : 1;
      return state.userSettings.calendar.filters.days == 0
        ? state.times.slctdTmstmp
        : state.userSettings.calendar.filters.days == 1
        ? state.times.slctdTmstmp - cmptdDayNumber * 86400000
        : state.userSettings.calendar.filters.days == 2
        ? state.times.slctdTmstmp - cmptdDayOfTheWeek * 86400000
        : state.times.slctdTmstmp - cmptdNoOfWeeks * 604800000 - cmptdDayOfTheWeek * 86400000;
    },
    firstDayY_m_d(state) {
      // prettier-ignore
      return (new Date(state.firstDayTmstmp).getFullYear() + '-' + (new Date(state.firstDayTmstmp).getMonth() + 1).toString().padStart(2, '0') + '-' + new Date(state.firstDayTmstmp).getDate().toString().padStart(2, '0'));
    },
    slctdY_m_d(state) {
      // prettier-ignore
      return (new Date(state.times.slctdTmstmp).getFullYear() + '-' + (new Date(state.times.slctdTmstmp).getMonth() + 1).toString().padStart(2, '0') + '-' + new Date(state.times.slctdTmstmp).getDate().toString().padStart(2, '0'));
    },
    slctdCntctIndex(state) {
      return state.contacts.findIndex((contact) => contact.id == state.userSettings.selectedContactIndex);
    },
    dayOfTheWeek(state) {
      return new Date(state.times.slctdTmstmp).getDay(); // 0 is Sunday, 1 is Monday, 2 is Tuesday, ...,
    },
    dayIndex(state) {
      return state.days.findIndex((day) => day == state.slctdY_m_d);
    },
    calRow(state) {
      return Math.ceil((state.days.findIndex((day) => day == state.slctdY_m_d) + 1) / 7);
    },
    days(state) {
      let dateRangeStart = 1;
      let dateArray = [];
      let currentDate = new Date(state.firstDayTmstmp);
      while (dateRangeStart <= state.daysRangeArr[state.userSettings.calendar.filters.days]) {
        // prettier-ignore
        dateArray.push(currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + currentDate.getDate().toString().padStart(2, '0'));
        currentDate.setDate(currentDate.getDate() + 1);
        dateRangeStart++;
      }
      return dateArray;
    },
    userList(state) {
      return { ...state.activeUserList, ...state.accountSettings.userList };
    },
  },
});
