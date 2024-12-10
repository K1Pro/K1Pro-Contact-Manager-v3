<template>
  <div
    class="task-grid-day-title"
    v-if="firstDayY_m_d && calContactTasks"
    @drop.prevent="dropEvent(days[dayIndex])"
    @dragover.prevent
    @dragenter.prevent
  >
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
            active: calContactTask.ContactID == sttngs.user.slctdCntctID,
          },
          {
            activeTask:
              calContactTask.EventIndex == slctd.eventIndx &&
              calContactTask.ContactID == sttngs.user.slctdCntctID &&
              calContactTask.Type == slctd.sideMenuLnk[0],
          },
        ]"
        :style="{
          'grid-template-columns': calContactTask.Icon ? 'calc(100% - 20px) 20px' : '100%',
        }"
        v-show="
          (sttngs.user.calendar.filters.owners == calContactTask.Assign || sttngs.user.calendar.filters.owners == '') &&
          (sttngs.user.calendar.filters.status == calContactTask.Status || sttngs.user.calendar.filters.status == '') &&
          (sttngs.user.calendar.filters.category == calContactTask.Categ || sttngs.user.calendar.filters.category == '')
        "
      >
        <div
          style="overflow: hidden"
          class="prevent-select"
          @click="selectContact(calContactTask.ContactID, calContactTask.Type, calContactTask.EventIndex)"
          v-on:dblclick="selectContact(calContactTask.ContactID, 'Contactinfo', null)"
          :draggable="calContactTask.Type == 'Tasks' ? true : false"
          @dragstart="
            dragEvent(
              $event,
              calContactTask.ContactID,
              calContactTask.EventIndex,
              calContactTask.Type,
              calContactTask.Time
            )
          "
        >
          {{ calContactTask.Time != '25:00' ? calContactTask.Clock.replace(' AM', '').replace(' PM', '') : '' }}
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

  inject: [
    'contacts',
    'days',
    'firstDayTmstmp',
    'patchContactInfo',
    'userSttngsReq',
    'slctd',
    'sttngs',
    'times',
    'wndw',
    'userData',
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
              Clock:
                this.sttngs.user.clock == 12
                  ? new Date(task.Date).toLocaleTimeString('en-US', {
                      hour12: true,
                      hour: 'numeric',
                      minute: 'numeric',
                    })
                  : task.Date.split('T')[1],
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
              Clock:
                task.Time && this.sttngs.user.clock == 12
                  ? new Date(this.days[this.dayIndex] + 'T' + task.Time).toLocaleTimeString('en-US', {
                      hour12: true,
                      hour: 'numeric',
                      minute: 'numeric',
                    })
                  : task.Time && this.sttngs.user.clock == 24
                  ? task.Time
                  : '25:00',
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
      this.slctd.eventIndx = eventIndex;
      this.slctd.sideMenuLnk = [sidemenuLink, 'Calendar'];
      const cloneSttngs = this.sttngs.user;
      cloneSttngs.slctdCntctID = ContactID;
      this.userSttngsReq('PATCH', cloneSttngs);
      if (this.wndw.wdth < 768) {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      }
    },
    dragEvent(event, contactID, eventIndex, eventType, eventTime) {
      event.dataTransfer.setData('array', [contactID, eventIndex, eventType, eventTime]);
    },
    dropEvent(newDate) {
      const eventInfo = event.dataTransfer.getData('array').split(',');
      const slctdCntctIndex = this.contacts.findIndex((contact) => contact.id == eventInfo[0]);
      const ContactID = eventInfo[0];
      const clmnIndex = eventInfo[1];
      const clmn = eventInfo[2];
      const eventDateTime = newDate + 'T' + eventInfo[3];
      const key = 'Date';

      const cloneSttngs = this.sttngs.user;
      cloneSttngs.slctdCntctID = ContactID;
      this.userSttngsReq('PATCH', cloneSttngs);

      if (
        (eventDateTime != this.contacts[slctdCntctIndex][clmn][clmnIndex][key] && eventDateTime != '') ||
        (eventDateTime == '' && this.contacts[slctdCntctIndex][clmn][clmnIndex][key])
      ) {
        const cloneCntct = this.contacts[slctdCntctIndex];
        cloneCntct[clmn][clmnIndex][key] = eventDateTime;
        cloneCntct[clmn][clmnIndex].Update = this.userData.id;
        if (this.slctd.sideMenuLnk[0] == 'Tasks') {
          this.slctd.eventIndx = null;
          this.slctd.eventIndx = clmnIndex;
        }
        // this.taskMemo = this.taskMemo + 1;
        this.patchContactInfo(eventDateTime, clmn, clmnIndex, key, cloneCntct);
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
