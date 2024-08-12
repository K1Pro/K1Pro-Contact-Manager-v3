<template>
  <div class="task-grid-day-title" v-if="firstDayY_m_d && calContactTasks">
    <b v-if="days[dayIndex] == times.updtngY_m_d_H_i_s_z.slice(0, 10)">
      {{ firstDayY_m_d ? days[dayIndex].slice(5, 7) + '/' + days[dayIndex].slice(8, 10) : ''
      }}{{ days[dayIndex] == times.updtngY_m_d_H_i_s_z.slice(0, 10) ? ' - Today' : '' }}
    </b>
    <span v-else>
      {{ firstDayY_m_d ? days[dayIndex].slice(5, 7) + '/' + days[dayIndex].slice(8, 10) : '' }}
    </span>
  </div>
  <div class="task-grid-day-content" v-if="firstDayY_m_d && calContactTasks">
    <template v-for="calContactTask in calContactTasks">
      <div
        class="task-grid-container"
        :class="[
          calContactTask.Status,
          {
            active: calContactTask.ContactID == userSettings.selectedContactIndex,
          },
          {
            activeTask:
              calContactTask.EventIndex == eventIndex &&
              calContactTask.ContactID == userSettings.selectedContactIndex &&
              calContactTask.Type == sideMenuSlctdLnk[0],
          },
        ]"
        :style="{
          'grid-template-columns': calContactTask.Icon ? 'calc(100% - 20px) 20px' : '100%',
        }"
        v-show="
          (userSettings.calendar.filters.owners == calContactTask.Assign ||
            userSettings.calendar.filters.owners == '') &&
          (userSettings.calendar.filters.status == calContactTask.Status ||
            userSettings.calendar.filters.status == '') &&
          (userSettings.calendar.filters.category == calContactTask.Categ ||
            userSettings.calendar.filters.category == '')
        "
      >
        <div
          style="overflow: hidden"
          class="prevent-select"
          @click="selectContact(calContactTask.ContactID, calContactTask.Type, calContactTask.EventIndex)"
          v-on:dblclick="selectContact(calContactTask.ContactID, 'Contactinfo', null)"
        >
          {{ calContactTask.Time != '25:00' ? calContactTask.Time : '' }}
          {{ calContactTask?.Name }}
        </div>
        <div style="text-align: center" class="prevent-select" v-if="calContactTask.Icon">
          <i :class="calContactTask.Icon"></i>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Day Content',

  emits: ['eventIndex', 'sideMenuSlctdLnk'],

  inject: [
    'contacts',
    'days',
    'eventIndex',
    'firstDayTmstmp',
    'patchUserSettings',
    'sideMenuSlctdLnk',
    'times',
    'wndw',
    'userSettings',
  ],

  props: ['dayIndex'],

  computed: {
    calContactTasks() {
      let contactArray = {};
      let calDay;
      this.contacts.forEach((contact, contactIndex) => {
        contact.Tasks.forEach((task, taskIndex) => {
          calDay = task?.Date?.split('T')[0];
          if (this.days[this.dayIndex] == calDay) {
            contactArray[contactIndex + 'Task' + taskIndex] = {
              Name: contact.Members[0]?.Name,
              Time: task.Date.split('T')[1],
              Type: 'Tasks',
              Status: task.Status == 1 ? 'compltd' : 'not-compltd',
              Assign: task.Assign,
              Categ: contact.Categ,
              Icon: task.Status == 1 ? 'fa fa-check' : task.Tag != '' ? task.Tag : false,
              ContactID: contact.id,
              EventIndex: taskIndex,
            };
          }
        });
        contact.RecurTasks.forEach((task, taskIndex) => {
          if (
            task.Start &&
            task?.Start <= this.days[this.dayIndex] &&
            (!task?.End || task?.End >= this.days[this.dayIndex]) &&
            ((task?.Recur.includes(this.days[this.dayIndex].slice(-5)) &&
              (task?.Freq == 'Annually' || task?.Freq == 'Semiannually' || task?.Freq == 'Quarterly')) ||
              (task?.Recur.includes(this.days[this.dayIndex].slice(8, 10)) && task?.Freq == 'Monthly') ||
              (task?.Recur.includes(new Date(this.days[this.dayIndex] + 'T00:00:00').getDay().toString()) &&
                task?.Freq == 'Weekly') ||
              (task?.Recur.includes('everyday') && task?.Freq == 'Daily'))
          ) {
            contactArray[contactIndex + 'Recur' + taskIndex] = {
              Name: contact.Members[0]?.Name,
              Time: task.Time ? task.Time : '25:00',
              Type: 'Recurringtasks',
              Status: task.Review >= this.days[this.dayIndex] ? 'compltd' : 'renewal',
              Icon: task.Review >= this.days[this.dayIndex] ? 'fa fa-check' : 'fa fa-repeat',
              Assign: task.Assign,
              Categ: contact.Categ,
              ContactID: contact.id,
              EventIndex: taskIndex,
            };
          }
        });
      });
      return Object.values(contactArray).sort((a, b) => a.Time.localeCompare(b.Time));
    },
    firstDayY_m_d() {
      // prettier-ignore
      return (new Date(this.firstDayTmstmp).getFullYear() + '-' + (new Date(this.firstDayTmstmp).getMonth() + 1).toString().padStart(2, '0') + '-' + new Date(this.firstDayTmstmp).getDate().toString().padStart(2, '0'));
    },
  },

  methods: {
    selectContact(ContactID, sidemenuLink, eventIndex) {
      this.$emit('eventIndex', eventIndex);
      this.$emit('sideMenuSlctdLnk', [sidemenuLink, 'Calendar']);
      const cloneUserSettings = this.userSettings;
      cloneUserSettings.selectedContactIndex = ContactID;
      this.patchUserSettings(cloneUserSettings);
      if (this.wndw.wdth < 768) {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      }
    },
  },
};
</script>

<style>
.task-grid-day-title {
  position: sticky;
  top: 0;
  padding-left: 2px;
  padding-top: 2px;
  padding-bottom: 2px;
  overflow: hidden;
  background-color: inherit;
}
.task-grid-day-content {
  overflow: hidden;
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
  background-color: #db66ff;
  background-image: linear-gradient(125deg, #db66ff 0 25%, #af51cc 95% 100%);
}
.task-grid-container i {
  font-size: 10px;
}
.compltd {
  background-color: #52a375;
  background-image: linear-gradient(125deg, #52a375 0 25%, #41825d 95% 100%);
}
.not-compltd {
  background-color: #d9414e;
  background-image: linear-gradient(125deg, #d9414e 0 25%, #ad343e 95% 100%);
}
.renewal {
  background-color: #f09030;
  background-image: linear-gradient(125deg, #f09030 0 25%, #c07326 95% 100%);
}
.active {
  background-color: #417cd9;
  background-image: linear-gradient(125deg, #417cd9 0 25%, #3463ad 95% 100%);
}
.activeTask {
  background-color: #9c41d9;
  background-image: linear-gradient(125deg, #9c41d9 0 25%, #7c34ad 95% 100%);
}
</style>
