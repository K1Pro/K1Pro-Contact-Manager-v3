// import example from './components/example_vue.js';

export default {
  name: 'Day Content',

  template: /*html*/ `
    <div class='day-content'>
        <div class="task-grid-day" v-if="firstCalDate && calContactTasks">
          <b v-if="days[dayIndex] == times.Y_m_d_H_i_s_z.slice(0,10)">
            {{ firstCalDate ? days[dayIndex].slice(-5) : '' }}{{days[dayIndex] == times.Y_m_d_H_i_s_z.slice(0,10) ? ' - Today' : ''}}
          </b>
          <span v-else>
            {{ firstCalDate ? days[dayIndex].slice(-5) : '' }}
          </span>
        </div>
        <div class="task-grid-day-content" v-if="firstCalDate && calContactTasks">
          <template v-for="calContactTask in calContactTasks">
            <div
                class="task-grid-container"
                :class="[calContactTask.Status, {'active': calContactTask.ContactIndex == userSettings.selectedContactIndex}, {'activeTask': calContactTask.EventIndex == eventIndex && calContactTask.ContactIndex == userSettings.selectedContactIndex && calContactTask.Type == activeTab}]" 
                :style="{'grid-template-columns': calContactTask.Icon ? 'calc(100% - 20px) 20px' : '100%'}" 
                v-show="(userSettings.calendar.filters.owners == calContactTask.Assign || userSettings.calendar.filters.owners == '') && (userSettings.calendar.filters.status == calContactTask.Status || userSettings.calendar.filters.status == '') && (userSettings.calendar.filters.category == calContactTask.Categ || userSettings.calendar.filters.category == '')" >
                <div style="overflow: hidden" class="prevent-select" 
                  @click="selectContact(calContactTask.ContactIndex, calContactTask.Type, calContactTask.EventIndex)" 
                  v-on:dblclick="selectContact(calContactTask.ContactIndex, 'house-chimney-user', null)">
                  {{ calContactTask.Time != '25:00' ? calContactTask.Time : '' }} {{ calContactTask.Name }}
                </div>
                <div style="text-align: center" class="prevent-select" v-if="calContactTask.Icon">
                  <i :class="calContactTask.Icon"></i>
                </div>
            </div>
          </template>
        </div>
    </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'activeTab',
      'eventIndex',
      'userSettings',
      'contacts',
      'patchUserSettings',
      'times',
      'firstCalDate',
      'days',
    ]),
    calContactTasks() {
      let contactArray = {};
      let calDay;
      this.contacts.forEach((contact, contactIndex) => {
        contact.Tasks.forEach((task, taskIndex) => {
          calDay = task?.Date?.split('T')[0];
          if (this.days[this.dayIndex] == calDay) {
            contactArray[contactIndex + 'Task' + taskIndex] = {
              Name: contact.Members[0].Name,
              Time: task.Date.split('T')[1],
              Type: 'list-check',
              Status: task.Status == 1 ? 'compltd' : 'not-compltd',
              Assign: task.Assign,
              Categ: contact.Categ,
              Icon:
                task.Status == 1
                  ? 'fa fa-check'
                  : task.Tag != ''
                  ? task.Tag
                  : false,
              ContactIndex: contactIndex,
              EventIndex: taskIndex,
            };
          }
        });
        contact.RecurTasks.forEach((task, taskIndex) => {
          if (
            task.Start &&
            task?.Start <= this.days[this.dayIndex] &&
            (!task?.End || task?.End >= this.days[this.dayIndex]) &&
            (task?.Recur.includes(this.days[this.dayIndex].slice(-5)) ||
              task?.Recur.includes(this.days[this.dayIndex].slice(8, 10)) ||
              task?.Recur.includes(
                new Date(this.days[this.dayIndex] + 'T00:00:00')
                  .getDay()
                  .toString()
              ) ||
              task?.Recur.includes('everyday'))
          ) {
            contactArray[contactIndex + 'Recur' + taskIndex] = {
              Name: contact.Members[0].Name,
              Time: task.Time ? task.Time : '25:00',
              Type: 'repeat',
              Status:
                task.Review >= this.days[this.dayIndex] ? 'compltd' : 'renewal',
              Icon:
                task.Review >= this.days[this.dayIndex]
                  ? 'fa fa-check'
                  : 'fa fa-repeat',
              Assign: task.Assign,
              Categ: contact.Categ,
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
      this.patchUserSettings();
    },
  },

  mounted() {
    style(
      'day-content',
      /*css*/ `
.day-content{
  height: -webkit-fill-available;
  height: -moz-fill-available;
}
.task-grid-day{
  padding-left: 2px;
  padding-top: 2px;
  padding-bottom: 2px;
  border-right: 5px solid #888;
  overflow: hidden;
}
.task-grid-day-content{
  height: -webkit-fill-available;
  overflow: hidden scroll;
}

.task-grid-day-content::-webkit-scrollbar {
  width: 5px;
}
.task-grid-day-content::-webkit-scrollbar-track {
  background: #888;
}

.task-grid-day-content::-webkit-scrollbar-thumb {
  background: #f1f1f1;
}

.task-grid-day-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.task-grid-container {
  color: white;
  display: grid;
  cursor: pointer;
  border: 1px solid white;
  padding-left: 2px;
  padding-top: 2px;
  padding-bottom: 2px;
}
.task-grid-container:hover:not(.activeTask) {
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
.activeTask {
  background-color: #9c41d9;
}
`
    );
  },
};
