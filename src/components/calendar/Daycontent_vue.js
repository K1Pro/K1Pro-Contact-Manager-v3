// import example from './components/example_vue.js';

export default {
  name: 'Day Content',

  template: /*html*/ `
    <div class='day-content'>
        {{ firstCalDate ? days[dayIndex].slice(-5) : '' }}
        <template v-if="firstCalDate && calContactTasks">
          <div v-for="calContactTask in calContactTasks" @mouseleave="dayContentHover = ''">
            <div
                class="task-grid-container"
                :class="[calContactTask.Status, {'active': calContactTask.ContactIndex == userSettings.selectedContactIndex}]" >
                <div @click="selectContact(calContactTask.ContactIndex, calContactTask.Type)">{{ calContactTask.Time }}</div>
                <div @click="selectContact(calContactTask.ContactIndex, calContactTask.Type)" style="overflow: hidden">{{ calContactTask.Name }}</div>
                <div></div>
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
      'dayContentHover',
      'firstCalDate',
      'days',
    ]),
    calContactTasks() {
      let contactArray = {};
      let calDay;
      this.contacts.forEach((contact, contactIndex) => {
        Object.entries(contact.Tasks).forEach(([calDate, calEvent]) => {
          calDay = calDate.split('T')[0];
          if (
            this.days[this.dayIndex] == calDay &&
            !contactArray[contactIndex]
          ) {
            contactArray[contactIndex] = {
              Name: Object.values(contact.Members[0])[0].Name,
              Time: calDate.split('T')[1],
              Status: calEvent.Status == 1 ? 'not-compltd' : 'compltd',
              Type: 'list-check',
              ContactIndex: contactIndex,
            };
          }
        });
        // contact.RecurTasks.forEach((task) => {
        //   if (
        //     task.Date &&
        //     task?.Recur.includes(this.days[this.dayIndex].slice(5))
        //   ) {
        //     calDay = task.Date.split('T')[0];
        //     // if (!contactArray[calDay]) contactArray[calDay] = {};
        //     if (!contactArray[task.Date.split('T')[1] + '_' + contactIndex])
        //       contactArray[task.Date.split('T')[1] + '_' + contactIndex] = {
        //         Name: Object.values(contact.Members[0])[0].Name,
        //         Status: 1,
        //       };
        //   }
        // });
      });
      return Object.values(contactArray).sort((a, b) =>
        a.Time.localeCompare(b.Time)
      );
    },
  },

  //   components: {
  //     example,
  //   },

  props: ['dayIndex'],

  //   emits: [''],

  // data() {
  //   return {};
  // },

  methods: {
    selectContact(contactIndex, tab) {
      this.activeTab = tab;
      this.userSettings.selectedContactIndex = contactIndex;
    },
    highlightContact(event) {
      // console.log('mouse over' + event.target.innerHTML);
      console.log(event);
      event.target.classList.add('highlight');
    },
    nohighlightContact(event) {
      // console.log('mouse out' + event.target.innerHTML);
      event.target.classList.remove('highlight');
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
  accent-color: inherit;
}
.active input[type="checkbox"] {
  accent-color: #417CD9;
}
.compltd {
  background-color: #D9414E;
  accent-color: #D9414E;
}
.not-compltd {
  background-color: #52A375;
  accent-color: #52A375;
}
.active {
  background-color: #417CD9;
  accent-color: #417CD9;
  cursor: default;
}
.highlight {
  accent-color: #DB66FF;
}
`
    );
  },
};
