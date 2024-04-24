// import example from './components/example_vue.js';

export default {
  name: 'Calendar body',

  template: /*html*/ `
        <div class='calendar-body'>
          <div :class="'calendar-body-grid-container' + userSettings.calendar.filters.days">
            <template v-for="(day, dayIndex) in days">
              <div v-if="((dayIndex + 1) % 7) && ((dayIndex + 2) % 7)" 
                class="calendar-body-grid-item day" 
                :class="{ activeDay: days[dayIndex] == times.Y_m_d }" 
                @click="changeDate(days[dayIndex])">
                {{ firstCalDate ? days[dayIndex].slice(-5) : '' }}
                <template v-if="firstCalDate && calContactEvents[days[dayIndex]]">
                <div v-for="([calContactKey, calContactValue], calContactIndex) in Object.entries(calContactEvents[days[dayIndex]])">
                  <div @click="selectContact(calContactValue.contactIndex)">
                    {{ calContactValue.Time }} {{ calContactKey }}
                  </div>
                </div>
              </template>
              </div>

              <div v-if="(dayIndex + 1) % 7 === 0" 
                class="calendar-body-grid-item">
                  <div 
                    class="day saturday" 
                    :class="{ activeDay: days[dayIndex-1] == times.Y_m_d }"
                    @click="changeDate(days[dayIndex-1])">
                    {{ firstCalDate ? days[dayIndex-1].slice(-5) : '' }}


                  </div>
                  <div 
                    class="day sunday" 
                    :class="{ activeDay: days[dayIndex] == times.Y_m_d }"
                    @click="changeDate(days[dayIndex])">
                    {{ firstCalDate ? days[dayIndex].slice(-5) : '' }}

                  </div>
              </div>

            </template>
          </div>
        </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'windowWidth',
      'userSettings',
      'tempUserSettings',
      'contacts',
      'times',
      'firstCalDate',
      'changeCalDaysOrder',
      'days',
    ]),

    calContactEvents() {
      let contactArray = {};
      this.contacts.forEach((contact, contactIndex) => {
        // contactArray.push(contact.id);
        Object.entries(contact.Events).forEach(([calDay, calEvent]) => {
          if (this.days.includes(calDay)) {
            if (!contactArray[calDay]) contactArray[calDay] = {};
            if (!contactArray[calDay][contact.Members[0].Last_Name])
              contactArray[calDay][contact.Members[0].Last_Name] = {
                contactIndex: contactIndex,
                Last_Name: contact.Members[0].Last_Name,
                Time: calEvent.Time,
              };
          }
        });
      });
      return contactArray;
    },
  },

  //   components: {
  //     example,
  //   },

  //   props: [''],

  //   emits: [''],

  data() {
    return { tempDaysFilter: '' };
  },

  methods: {
    changeDate(selectedY_m_d) {
      this.times.Y_m_d = selectedY_m_d;
    },
    selectContact(contactIndex) {
      console.log(contactIndex);
      this.userSettings.selectedContactIndex = contactIndex;
    },
  },

  watch: {
    windowWidth(newWidth, oldWidth) {
      if (
        newWidth < 768 &&
        oldWidth > 768 &&
        this.userSettings.calendar.filters.days != 0 &&
        this.userSettings.calendar.filters.days != 1
      ) {
        this.userSettings.calendar.filters.days = 1;
        this.changeCalDaysOrder();
      } else if (
        newWidth > 768 &&
        oldWidth < 768 &&
        this.userSettings.calendar.filters.days !=
          this.tempUserSettings.calendar.filters.days
      ) {
        this.userSettings.calendar.filters.days =
          this.tempUserSettings.calendar.filters.days;
        this.changeCalDaysOrder();
      }
    },
  },

  mounted() {
    this.changeCalDaysOrder();
    style(
      'Calendar-body',
      /*css*/ `
.Calendar body{}
.calendar-body-grid-container0 {
  display: grid;
  grid-template-columns: 100%;
}
.calendar-body-grid-container1 {
  display: grid;
  grid-template-columns: 33.33% 33.34% 33.33%;
}
.calendar-body-grid-container2,
.calendar-body-grid-container3,
.calendar-body-grid-container4,
.calendar-body-grid-container5 {
  display: grid;
  grid-template-columns: 16.67% 16.67% 16.67% 16.67% 16.66% 16.66%;
}
.calendar-body-grid-container0,
.calendar-body-grid-container1,
.calendar-body-grid-container2 {
  grid-template-rows: calc( 100vh - 100px);
}
.calendar-body-grid-container3 {
  grid-template-rows: calc( 50vh - 50px) calc( 50vh - 50px);
}
.calendar-body-grid-container4 {
  grid-template-rows: calc( 33.33vh - 33.33px) calc( 33.33vh - 33.33px) calc( 33.33vh - 33.33px);
}
.calendar-body-grid-container5 {
  grid-template-rows: calc( 25vh - 25px) calc( 25vh - 25px) calc( 25vh - 25px) calc( 25vh - 25px);
}
.day {
  border: solid black 1px;
  cursor: pointer;
  overflow: hidden scroll;
  white-space: nowrap;
}
.day:hover:not(.activeDay) {
  background-color: #EBCCFF;
}
.saturday {
  height: 50%;
  border-bottom: solid black 1px;
}
.sunday {
  height: 50%;
}
.activeDay {
  background-color: #ccffff;
  cursor: default;
}
`
    );
  },
};
