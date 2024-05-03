// import example from './components/example_vue.js';

export default {
  name: 'Day Content',

  template: /*html*/ `
    <div class='day-content'>
        {{ firstCalDate ? days[dayIndex].slice(-5) : '' }}
        <template v-if="firstCalDate && calContactEvents[days[dayIndex]]">
            <div v-for="([calContactName, calContactValue], calContactIndex) in Object.entries(calContactEvents[days[dayIndex]])">
                <div 
                    class="task-grid-container" 
                    :class="{compltd: calContactValue.Status == 1, 'not-compltd': calContactValue.Status == 0, 'active': calContactValue.contactIndex == userSettings.selectedContactIndex}" >
                    <div @click="selectContact(calContactValue.contactIndex, 'list-check')">{{ calContactValue.Time }}</div>
                    <div @click="selectContact(calContactValue.contactIndex, 'list-check')" style="overflow: hidden">{{ calContactName }}</div>
                    <div><input type="checkbox" :checked="calContactValue.Status == 1"></div>
                </div>
            </div>
        </template>
    </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'activeTab',
      'userSettings',
      'contacts',
      'firstCalDate',
      'days',
    ]),
    calContactEvents() {
      let contactArray = {};
      this.contacts.forEach((contact, contactIndex) => {
        // contactArray.push(contact.id);
        Object.entries(contact.Events).forEach(([calDate, calEvent]) => {
          let calDay = calDate.split('T')[0];
          if (this.days.includes(calDay)) {
            if (!contactArray[calDay]) contactArray[calDay] = {};
            // if (contact.Members[0]) {
            if (
              !contactArray[calDay][Object.values(contact.Members[0])[0].Name]
            )
              contactArray[calDay][Object.values(contact.Members[0])[0].Name] =
                {
                  contactIndex: contactIndex,
                  Time: calDate.split('T')[1],
                  Status: calEvent.Status,
                };
            // } else {
            //   contactArray[calDay]['Bad thing'] = {
            //     contactIndex: contactIndex,
            //     Time: calEvent.Time,
            //   };
            // }
          }
        });
      });
      return contactArray;
    },
  },

  //   components: {
  //     example,
  //   },

  props: ['dayIndex'],

  //   emits: [''],

  //   data() {
  //     return {};
  //   },

  methods: {
    selectContact(contactIndex, tab) {
      this.activeTab = tab;
      this.userSettings.selectedContactIndex = contactIndex;
    },
  },

  mounted() {
    style(
      'day-content',
      /*css*/ `
.day-content{}
.task-grid-container {
    color: white;
    display: grid;
    grid-template-columns: 45px calc(100% - 65px) 20px;
    cursor: pointer;
    border: 1px solid white;
    padding-left: 2px;
    padding-top: 2px;
    padding-bottom: 2px;
}
.task-grid-container:hover:not(.active) {
    background-color: #DB66FF;
}
.task-grid-container input[type="checkbox"] {
    accent-color: #D9414E;
}
.active input[type="checkbox"] {
  accent-color: #417CD9;
}
.compltd {
    background-color: #D9414E;
}
.not-compltd {
    background-color: #52A375;
}
.active {
    background-color: #417CD9;
    cursor: default;
}
`
    );
  },
};
