// import example from './components/example_vue.js';

export default {
  name: 'Day Content',

  template: /*html*/ `
    <div class='day-content'>
        {{ firstCalDate ? days[dayIndex].slice(-5) : '' }}
        <template v-if="firstCalDate && calContactTasks">
          <div v-for="calContactTask in calContactTasks">
            <div
                class="task-grid-container"
                :class="[calContactTask.Status, {'active': calContactTask.ContactIndex == userSettings.selectedContactIndex}]" 
                :style="{'grid-template-columns': calContactTask.Icon ? 'calc(100% - 20px) 20px' : '100%'}" >
                <div @click="selectContact(calContactTask.ContactIndex, calContactTask.Type, calContactTask.EventIndex)" style="overflow: hidden">{{ calContactTask.Time != '25:00' ? calContactTask.Time : '' }} {{ calContactTask.Name }}</div>
                <div style="text-align: center" v-if="calContactTask.Icon"><i :class="calContactTask.Icon"></i></div>
            </div>
          </div>
        </template>
    </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'activeTab',
      'eventIndex',
      'userSettings',
      'contacts',
      'patchUserSettings',
      'firstCalDate',
      'days',
    ]),
    calContactTasks() {
      let contactArray = {};
      let calDay;
      this.contacts.forEach((contact, contactIndex) => {
        // Object.entries(contact.Tasks).forEach(([taskDate, taskEvent]) => {
        //   calDay = taskDate.split('T')[0];
        //   if (
        //     this.days[this.dayIndex] == calDay &&
        //     !contactArray[contactIndex]
        //   ) {
        //     contactArray[contactIndex] = {
        //       Name: Object.values(contact.Members[0])[0].Name,
        //       Time: taskDate.split('T')[1],
        //       Type: 'list-check',
        //       Status: taskEvent.Status == 1 ? 'compltd' : 'not-compltd',
        //       Icon: taskEvent.Status == 1 ? 'fa fa-check' : false,
        //       ContactIndex: contactIndex,
        //       EventIndex: taskDate,
        //     };
        //   }
        // });
        contact.Tasks.forEach((task, taskIndex) => {
          calDay = task?.Date?.split('T')[0];
          if (
            this.days[this.dayIndex] == calDay &&
            !contactArray[contactIndex]
          ) {
            contactArray[contactIndex] = {
              Name: contact.Members[0].Name,
              Time: task.Date.split('T')[1],
              Type: 'list-check',
              Status: task.Status == 1 ? 'compltd' : 'not-compltd',
              Icon: task.Status == 1 ? 'fa fa-check' : false,
              ContactIndex: contactIndex,
              EventIndex: taskIndex,
            };
          }
        });
        contact.RecurTasks.forEach((task, taskIndex) => {
          if (
            task.Start &&
            task?.Recur.includes(this.days[this.dayIndex].slice(-5)) &&
            !contactArray[contactIndex]
          ) {
            contactArray[contactIndex] = {
              Name: contact.Members[0].Name,
              Time: task.Time ? task.Time : '25:00',
              Type: 'repeat',
              Status:
                task.Reviewed > this.days[this.dayIndex]
                  ? 'compltd'
                  : 'renewal',
              Icon:
                task.Reviewed > this.days[this.dayIndex]
                  ? 'fa fa-check'
                  : 'fa fa-repeat',
              ContactIndex: contactIndex,
              EventIndex: taskIndex,
            };
          }
        });
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
    selectContact(contactIndex, tab, eventIndex) {
      this.activeTab = tab;
      this.userSettings.selectedContactIndex = contactIndex;
      this.eventIndex = eventIndex;
      console.log(eventIndex);
      this.patchUserSettings();
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
  cursor: pointer;
  border: 1px solid white;
  padding-left: 2px;
  padding-top: 2px;
  padding-bottom: 2px;
}
.task-grid-container:hover:not(.active) {
  background-color: #DB66FF; 
}
.task-grid-container i{
  font-size: 10px;
}
.compltd {
  background-color: #52A375;
}
.not-compltd {
  background-color: #D9414E;
}
.renewal {
  background-color: #F09030;
}
.active {
  background-color: #417CD9;
}
`
    );
  },
};
