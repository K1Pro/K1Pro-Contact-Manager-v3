<template>
  <div class="recur-tasks">
    <template v-if="slctdCntct">
      <div class="recur-tasks-title">
        <div class="recur-tasks-title-grid-container">
          <div class="recur-tasks-title-grid-item1">
            Recurring tasks for
            {{ slctdCntct.Members[0].First ? slctdCntct.Members[0].First : '' }}
            {{ slctdCntct.Members[0].Name }}
          </div>
          <div class="recur-tasks-title-grid-item2">
            <button @click="newRecurTask">
              <i class="fa-solid fa-square-plus"></i>
            </button>
          </div>
        </div>
      </div>

      <template v-for="(recurTask, recurTaskIndex) in recurtasks">
        <div
          class="recur-tasks-body"
          :style="{
            'background-color': recurTaskIndex % 2 ? 'lightblue' : 'white',
          }"
        >
          <i class="fa-solid fa-trash" @click="deleteRecurTask(recurTask.RealIndex, recurTaskIndex)"></i>
          <span class="recur-tasks-label">Start:</span
          ><input
            type="date"
            :value="recurTask.Start"
            @change="updateRecurTaskFreq(recurTask.RealIndex, recurTaskIndex, $event.target.value, recurTask.Freq)"
            :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']"
          />
          <span class="recur-tasks-label">End:</span
          ><input
            type="date"
            :value="recurTask.End"
            @change="updateRecurTask($event.target.value, recurTask.RealIndex, recurTaskIndex, 'End')"
            :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']"
          />
          <span class="recur-tasks-label">Time:</span
          ><input
            type="time"
            :value="recurTask.Time"
            @change="updateRecurTask($event.target.value, recurTask.RealIndex, recurTaskIndex, 'Time')"
            :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']"
          />
          <span class="recur-tasks-label">Recur:</span>
          <select
            :value="recurTask.Freq"
            @change="updateRecurTaskFreq(recurTask.RealIndex, recurTaskIndex, recurTask.Start, $event.target.value)"
            :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']"
          >
            <option>Annually</option>
            <option>Semiannually</option>
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Daily</option>
          </select>
          <span class="recur-tasks-label">Owner:</span>
          <select
            :value="recurTask.Assign"
            @change="updateRecurTask($event.target.value, recurTask.RealIndex, recurTaskIndex, 'Assign')"
            :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']"
          >
            <option v-for="([userNo, userInfo], userIndex) in Object.entries(userList)" :value="userNo">
              {{ userInfo[0] }}
            </option>
            <option disabled>Updated by {{ userList[recurTask.Update][0] }}</option>
            <option disabled>Created by {{ userList[recurTask.Create][0] }}</option>
          </select>
          <span class="recur-tasks-label">Finished:</span>
          <button
            @click="updateRecurTask(times.Y_m_d_H_i_s_z.slice(0, 10), recurTask.RealIndex, recurTaskIndex, 'Review')"
          >
            {{
              recurTask.Review
                ? recurTask.Review.slice(5, 7) +
                  '/' +
                  recurTask.Review.slice(8, 10) +
                  '/' +
                  recurTask.Review.slice(0, 4)
                : 'Click here'
            }}
          </button>
          <div class="recur-tasks-span" :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']">
            <span
              spellcheck="false"
              contenteditable="plaintext-only"
              v-on:blur="updateRecurTask($event.target.innerHTML, recurTask.RealIndex, recurTaskIndex, 'Desc')"
              >{{ recurTask.Desc }}</span
            >
          </div>
        </div>
        <div
          v-if="eventIndex !== null && slctdCntct.RecurTasks.length > 1"
          class="recur-tasks-body"
          style="background-color: lightblue; text-align: right"
        >
          <div>
            <b @click="showAll"
              >Show {{ slctdCntct.RecurTasks.length - 1 }} more
              {{ slctdCntct.RecurTasks.length - 1 > 1 ? 'tasks' : 'task' }}
            </b>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Recur Tasks',

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'eventIndex',
      'userData',
      'userSettings',
      'contacts',
      'times',
      'patchContactInfo',
      'deleteContactInfo',
      'slctdCntct',
      'userList',
    ]),
  },

  data() {
    return { recurtasks: [], column: 'RecurTasks', sortAscDesc: false };
  },

  methods: {
    recurTaskArray() {
      this.recurtasks =
        this.eventIndex === null
          ? this.slctdCntct.RecurTasks.map((val, index) => {
              return { ...val, RealIndex: index };
            }).sort((a, b) => b.Start.localeCompare(a.Start))
          : [
              {
                ...this.slctdCntct.RecurTasks[this.eventIndex],
                RealIndex: this.eventIndex,
              },
            ];
    },
    sortTask() {
      if (this.sortAscDesc) {
        this.recurtasks = this.slctdCntct.RecurTasks.map((val, index) => {
          return { ...val, RealIndex: index };
        }).sort((a, b) => b.Start.localeCompare(a.Start));
      } else {
        this.recurtasks = this.slctdCntct.RecurTasks.map((val, index) => {
          return { ...val, RealIndex: index };
        }).sort((a, b) => a.Start.localeCompare(b.Start));
      }
      this.sortAscDesc = !this.sortAscDesc;
    },
    newRecurTask() {
      this.showAll();
      // new component recurTask
      this[this.column.toLowerCase()].unshift({
        Start: this.times.Y_m_d,
        Recur: [this.times.Y_m_d.slice(5, 10)],
        Freq: 'Annually',
        Assign: this.userData.id,
        Create: this.userData.id,
        Update: this.userData.id,
      });
      // new state recurTask
      this.contacts[this.userSettings.selectedContactIndex][this.column].push({
        Start: this.times.Y_m_d,
        Recur: [this.times.Y_m_d.slice(5, 10)],
        Freq: 'Annually',
        Assign: this.userData.id,
        Create: this.userData.id,
        Update: this.userData.id,
      });
      // new database recurTask
      this.patchContactInfo(this.times.Y_m_d, this.column, this.slctdCntct.RecurTasks.length, 'Start');
    },
    updateRecurTask(event, columnIndex, recurTaskIndex, key) {
      if (event != this.contacts[this.userSettings.selectedContactIndex][this.column][columnIndex][key]) {
        // updating component recurTask
        this[this.column.toLowerCase()][recurTaskIndex][key] = event;
        this[this.column.toLowerCase()][recurTaskIndex].Update = this.userData.id;
        // updating state recurTask
        this.contacts[this.userSettings.selectedContactIndex][this.column][columnIndex][key] = event;
        this.contacts[this.userSettings.selectedContactIndex][this.column][columnIndex].Update = this.userData.id;
        // updating database recurTask
        this.patchContactInfo(event, this.column, columnIndex, key);
      }
    },
    updateRecurTaskFreq(columnIndex, recurTaskIndex, start, freq) {
      let recurTaskEvent, newRecurTask;
      if (freq == 'Annually') {
        recurTaskEvent = start.slice(5, 10) != '02-29' ? start.slice(5, 10) : '02-28';
      } else if (freq == 'Semiannually') {
        const halfYearLater = new Date(start + 'T00:00:00').setMonth(new Date(start + 'T00:00:00').getMonth() + 6);
        // prettier-ignore
        recurTaskEvent = (start.slice(5, 10) != '02-29' ? start.slice(5, 10) : '02-28') + '_' + new Date(halfYearLater).toISOString().slice(5, 10);
        // prettier-ignore
        newRecurTask = [(start.slice(5, 10) != '02-29' ? start.slice(5, 10) : '02-28'), new Date(halfYearLater).toISOString().slice(5, 10),];
      } else if (freq == 'Monthly') {
        recurTaskEvent = start.slice(8, 10);
      } else if (freq == 'Weekly') {
        recurTaskEvent = new Date(start + 'T00:00:00').getDay().toString();
      } else if (freq == 'Daily') {
        recurTaskEvent = 'everyday';
      }
      // updating component recurTask
      this[this.column.toLowerCase()][recurTaskIndex].Start = start;
      // prettier-ignore
      this[this.column.toLowerCase()][recurTaskIndex].Recur = freq == 'Semiannually' ? newRecurTask : [recurTaskEvent];
      this[this.column.toLowerCase()][recurTaskIndex].Freq = freq;
      this[this.column.toLowerCase()][recurTaskIndex].Update = this.userData.id;
      // updating state recurTask
      this.contacts[this.userSettings.selectedContactIndex][this.column][columnIndex].Start = start;
      // prettier-ignore
      this.contacts[this.userSettings.selectedContactIndex][this.column][columnIndex].Recur = freq == 'Semiannually' ? newRecurTask : [recurTaskEvent];
      this.contacts[this.userSettings.selectedContactIndex][this.column][columnIndex].Freq = freq;
      this.contacts[this.userSettings.selectedContactIndex][this.column][columnIndex].Update = this.userData.id;
      // updating database recurTask
      this.patchContactInfo(freq + '+' + start + '+' + recurTaskEvent, this.column, columnIndex, 'Freq');
    },
    deleteRecurTask(columnIndex, taskIndex) {
      if (confirm(this.msg.confirmDeletion) == true) {
        // deleting component task
        this[this.column.toLowerCase()].splice(taskIndex, 1);
        // deleting state and database task
        this.deleteContactInfo(this.column, columnIndex, true);
      }
    },
    showAll() {
      this.eventIndex = null;
    },
  },

  watch: {
    eventIndex() {
      this.recurTaskArray();
    },
  },

  mounted() {
    this.recurTaskArray();
  },
};
</script>

<style>
.recur-tasks-title {
  font-weight: bold;
  padding: 5px;
  background-color: lightblue;
  color: black;
}
.recur-tasks-title-grid-container {
  display: grid;
  grid-template-columns: calc(100% - 30px) 30px;
}
.recur-tasks-title-grid-item1 {
  height: 20px;
  overflow: hidden;
}
.recur-tasks-title-grid-item2 button {
  background-color: transparent;
  border: 0px;
  cursor: pointer;
  color: #417cd9;
}
.recur-tasks-title-grid-item2 button:hover {
  color: #db66ff;
}
.recur-tasks-body {
  padding: 10px;
}
.recur-tasks-body i {
  float: right;
  font-size: 14px;
  cursor: pointer;
}
.recur-tasks-label {
  padding-bottom: 10px;
  font-size: 14px;
  display: inline-block;
  width: 60px;
  text-align: right;
}
.recur-tasks-body input,
.recur-tasks-body select,
.recur-tasks-body button {
  width: calc(100% - 100px);
  height: 20px;
  font-family: 'Helvetica', sans-serif;
  font-size: 14px;
  overflow: hidden;
}
/*.recur-tasks-body button {
    margin: 10px 10px 0px 0px;
  }*/
.recur-tasks-span {
  border-radius: 1px;
  border: 1px solid lightgray;
  padding: 5px;
  word-break: break-word;
  font-size: 14px;
}
.recur-tasks-span span[contenteditable] {
  display: block; /* not sure if this is needed */
}
.recur-tasks-span span[contenteditable]:empty::before {
  content: 'Enter task description';
  display: inline-block;
  color: grey;
}
.recur-tasks-span span[contenteditable]:empty:focus::before {
  content: 'Start typing';
  color: grey;
}
.recur-tasks-body span[contenteditable]:focus {
  outline: none;
}
.recur-tasks b {
  cursor: pointer;
}
.odd-task {
  background-color: white;
  border: 1px solid lightgray;
}
.even-task {
  background-color: lightblue;
  border: 1px solid gray;
}
</style>
