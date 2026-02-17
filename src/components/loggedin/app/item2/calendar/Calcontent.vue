<template>
  <div
    class="cal-title"
    v-if="firstDayY_m_d && calContactTasks"
    @dragover.prevent
    @dragenter.prevent
    @drop.prevent="dropEvent(days[dayIndex])"
  >
    <div v-if="days[dayIndex] == updt.updtngY_m_d_H_i_s_z.slice(0, 10)">
      <b>
        {{ firstDayY_m_d ? days[dayIndex].slice(5, 7) + '/' + days[dayIndex].slice(8, 10) : '' }}
        <i class="fa-solid fa-cloud-sun"></i>
      </b>
    </div>
    <div v-else>
      {{ firstDayY_m_d ? days[dayIndex].slice(5, 7) + '/' + days[dayIndex].slice(8, 10) : '' }}
    </div>

    <i v-if="!dsbld" @click="newTask(days[dayIndex])" class="fa-solid fa-square-plus cal-add"></i>
  </div>
  <div class="cal-day" v-if="firstDayY_m_d && calContactTasks">
    <template v-for="calContactTask in calContactTasks">
      <div
        class="cal-task prevent-select"
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
        v-show="
          (calContactTask.Assign?.includes(sttngs.user.calendar.filters.owners?.toString()) ||
            sttngs.user.calendar.filters.owners == '') &&
          (sttngs.user.calendar.filters.status == calContactTask.Status || sttngs.user.calendar.filters.status == '') &&
          (sttngs.user.calendar.filters.category == calContactTask.Categ || sttngs.user.calendar.filters.category == '')
        "
        :title="calContactTask.Desc"
        :draggable="calContactTask.Type == 'Tasks' ? true : false"
        v-on:dblclick="selectContact(calContactTask.ContactID, 'Contactinfo', null)"
        @click="selectContact(calContactTask.ContactID, calContactTask.Type, calContactTask.EventIndex)"
        @dragstart="
          dragEvent(
            $event,
            calContactTask.ContactID,
            calContactTask.EventIndex,
            calContactTask.Type,
            calContactTask.Time,
          )
        "
      >
        <div>
          {{ calContactTask.Time != '25:00' ? calContactTask.Clock.replace(' AM', '').replace(' PM', '') : '' }}
          {{ calContactTask?.Name }}
        </div>
        <i v-if="calContactTask.Icon" :class="calContactTask.Icon"></i>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Content',

  inject: [
    'contacts',
    'days',
    'dsbld',
    'firstDayTmstmp',
    'patchContactInfo',
    'slctd',
    'slctdCntctIndex',
    'sttngs',
    'updt',
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
            let taskAssign = JSON.parse(JSON.stringify(task.Assign));
            if (this.sttngs?.entity?.taskGroups && Array.isArray(taskAssign)) {
              taskAssign.forEach((Assignee) => {
                if (Object.keys(this.sttngs.entity.taskGroups).includes(Assignee)) {
                  const assigneeIndx = taskAssign.indexOf(Assignee);
                  if (assigneeIndx !== -1) taskAssign[assigneeIndx] = this.sttngs.entity.taskGroups[Assignee];
                }
              });
            }
            contactArray[contactIndex + 'Task' + taskIndex] = {
              Name: contact.Members[0]?.Name
                ? contact.Members[0].Name
                : contact.Members[0]?.First
                  ? contact.Members[0]?.First
                  : '',
              Time: task.Date.split('T')[1],
              Clock:
                this.sttngs.user.clock == 12
                  ? new Date(task.Date).toLocaleTimeString('en-US', {
                      hour12: true,
                      hour: 'numeric',
                      minute: 'numeric',
                    })
                  : task.Date.split('T')[1],
              Desc: task.Desc ? task.Desc : '',
              Type: 'Tasks',
              Status: task.Status == 1 ? 'compltd' : 'not-compltd',
              Assign: Array.isArray(taskAssign) ? taskAssign.flat() : taskAssign,
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
            let recurTaskAssign = JSON.parse(JSON.stringify(task.Assign));
            if (this.sttngs?.entity?.taskGroups && Array.isArray(recurTaskAssign)) {
              recurTaskAssign.forEach((Assignee) => {
                if (Object.keys(this.sttngs.entity.taskGroups).includes(Assignee)) {
                  const assigneeIndx = recurTaskAssign.indexOf(Assignee);
                  if (assigneeIndx !== -1) recurTaskAssign[assigneeIndx] = this.sttngs.entity.taskGroups[Assignee];
                }
              });
            }
            contactArray[contactIndex + 'Recur' + taskIndex] = {
              Name: contact.Members[0]?.Name
                ? contact.Members[0].Name
                : contact.Members[0]?.First
                  ? contact.Members[0]?.First
                  : '',
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
              Desc: task.Desc ? task.Desc : '',
              Type: 'Recurringtasks',
              Status: task.Review >= this.days[this.dayIndex] ? 'compltd' : 'renewal',
              Icon: task.Review >= this.days[this.dayIndex] ? 'fa fa-check' : 'fa fa-repeat',
              Assign: Array.isArray(recurTaskAssign) ? recurTaskAssign.flat() : recurTaskAssign,
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
    newTask(slctdY_m_d) {
      const oldCntct = JSON.parse(JSON.stringify(this.contacts[this.slctdCntctIndex]));
      const newTask = {
        Date: slctdY_m_d + this.updt.updtngY_m_d_H_i_s_z.slice(10, 16),
        Assign: [this.userData.id.toString()],
        Create: this.userData.id,
        Update: this.userData.id,
        Created: this.updt.updtngY_m_d_H_i_s_z,
      };
      this.contacts[this.slctdCntctIndex].Tasks = [...this.contacts[this.slctdCntctIndex].Tasks, newTask];
      this.slctd.eventIndx = oldCntct.Tasks.length;
      this.slctd.sideMenuLnk = ['Tasks', 'Calendar'];
      this.patchContactInfo(newTask, 'Tasks', oldCntct.Tasks.length, oldCntct, this.slctdCntctIndex);
      this.selectContact(this.sttngs.user.slctdCntctID, 'Tasks', oldCntct.Tasks.length);
      if (this.wndw.wdth < 768) window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    },
    selectContact(ContactID, sidemenuLink, eventIndex) {
      this.slctd.eventIndx = eventIndex;
      this.slctd.sideMenuLnk = [sidemenuLink, 'Calendar'];
      this.sttngs.user.slctdCntctID = ContactID;
      if (this.wndw.wdth < 768) window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    },
    dragEvent(event, contactID, eventIndex, eventType, eventTime) {
      event.dataTransfer.setData('array', [contactID, eventIndex, eventType, eventTime]);
    },
    dropEvent(newDate) {
      const eventInfo = event.dataTransfer.getData('array').split(',');
      const slctdCntctIndex = this.contacts.findIndex((contact) => contact.id == eventInfo[0]);
      const oldCntct = JSON.parse(JSON.stringify(this.contacts[slctdCntctIndex]));
      const ContactID = eventInfo[0];
      const clmnIndex = eventInfo[1];
      const clmn = eventInfo[2];
      const eventDateTime = newDate + 'T' + eventInfo[3];
      const key = 'Date';
      this.sttngs.user.slctdCntctID = ContactID;
      if (
        (eventDateTime != oldCntct[clmn][clmnIndex][key] && eventDateTime != '') ||
        (eventDateTime == '' && oldCntct[clmn][clmnIndex][key])
      ) {
        this.contacts[slctdCntctIndex][clmn][clmnIndex][key] = eventDateTime;
        this.contacts[slctdCntctIndex][clmn][clmnIndex].Update = this.userData.id;
        if (this.slctd.sideMenuLnk[0] == 'Tasks') {
          this.slctd.eventIndx = null;
          this.slctd.eventIndx = clmnIndex;
        }
        // this.taskMemo = this.taskMemo + 1;
        this.patchContactInfo({ [key]: eventDateTime }, clmn, clmnIndex, oldCntct, slctdCntctIndex);
      }
    },
  },
};
</script>

<style>
.cal-title {
  padding: 2px;
  height: 25px;
  display: flex;
  overflow: hidden;
  word-break: break-all;
  background-color: inherit;
  border-right: 5px solid #888;
}
.cal-title div,
.cal-task div {
  width: 100%;
}
.cal-add {
  cursor: pointer;
  color: #417cd9;
  font-size: 16px;
}
.cal-day {
  height: 100%;
  overflow-y: scroll;
}
.cal-day::-webkit-scrollbar {
  width: 5px;
}
.cal-day::-webkit-scrollbar-track {
  background: #888;
}
.cal-day::-webkit-scrollbar-thumb {
  background: #f1f1f1;
}
.cal-day::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.cal-task {
  display: flex;
  height: 25px;
  color: white;
  cursor: pointer;
  overflow: hidden;
  word-break: break-all;
  padding: 2px 0px 2px 2px;
  border: 1px solid white;
}
.cal-task i {
  margin: 5px;
  width: 10px;
  font-size: 10px;
}
.cal-task:hover:not(.activeTask) {
  background-color: #db66ff;
  background-image: linear-gradient(125deg, #db66ff 0 25%, #af51cc 95% 100%);
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
