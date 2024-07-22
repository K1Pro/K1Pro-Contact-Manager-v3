<template>
  <div class="recur-tasks">
    <template v-if="contacts[slctdCntctIndex].RecurTasks">
      <div class="recur-tasks-title">
        <div class="recur-tasks-title-grid-container">
          <div class="recur-tasks-title-grid-item1">
            Recurring tasks for
            {{ contacts[slctdCntctIndex].Members[0].First ? contacts[slctdCntctIndex].Members[0].First : '' }}
            {{ contacts[slctdCntctIndex].Members[0]?.Name }}
          </div>
          <div class="tasks-title-grid-item2">
            <button
              v-if="eventIndex === null"
              @click="
                sortAscDesc = !sortAscDesc;
                recurTaskMemo = recurTaskMemo + 1;
              "
            >
              <template v-if="RecurTasks.length > 1">
                <i v-if="sortAscDesc" class="fa-solid fa-arrow-down-wide-short"></i>
                <i v-else class="fa-solid fa-arrow-up-wide-short"></i>
              </template>
            </button>
          </div>
          <div class="recur-tasks-title-grid-item3">
            <button @click="newRecurTask">
              <i class="fa-solid fa-square-plus"></i>
            </button>
          </div>
        </div>
      </div>

      <template v-for="(recurTask, recurTaskIndex) in RecurTasks" v-memo="[recurTaskMemo]">
        <div
          class="recur-tasks-body"
          :style="{
            'background-color': recurTaskIndex % 2 ? 'lightblue' : 'white',
          }"
        >
          <i class="fa-solid fa-trash" @click="deleteRecurTask(recurTask.clmnIndex)"></i>
          <span class="recur-tasks-label">Start:</span
          ><input
            type="date"
            :value="recurTask.Start"
            v-on:blur="updateRecurTaskFreq(recurTask.clmnIndex, $event.target.value, recurTask.Freq)"
            :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']"
          />
          <span class="recur-tasks-label">End:</span
          ><input
            type="date"
            :value="recurTask.End"
            v-on:blur="updateRecurTask($event.target.value, recurTask.clmnIndex, 'End')"
            :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']"
          />
          <span class="recur-tasks-label">Time:</span
          ><input
            type="time"
            :value="recurTask.Time"
            v-on:blur="updateRecurTask($event.target.value, recurTask.clmnIndex, 'Time')"
            :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']"
          />
          <span class="recur-tasks-label">Recur:</span>
          <select
            :value="recurTask.Freq"
            @change="updateRecurTaskFreq(recurTask.clmnIndex, recurTask.Start, $event.target.value)"
            :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']"
          >
            <option>Annually</option>
            <option>Semiannually</option>
            <option>Quarterly</option>
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Daily</option>
          </select>
          <span class="recur-tasks-label">Owner:</span>
          <select
            :value="recurTask.Assign"
            @change="updateRecurTask($event.target.value, recurTask.clmnIndex, 'Assign')"
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
            @click="
              updateRecurTask(times.updtngY_m_d_H_i_s_z.slice(0, 10), recurTask.clmnIndex, 'Review');
              recurTaskMemo = recurTaskMemo + 1;
            "
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
              v-on:blur="updateRecurTask($event.target.innerHTML, recurTask.clmnIndex, 'Desc')"
              >{{ recurTask.Desc }}</span
            >
          </div>
        </div>
      </template>
      <div
        v-if="eventIndex !== null && contacts[slctdCntctIndex].RecurTasks.length > 1"
        class="recur-tasks-body"
        style="background-color: lightblue; text-align: right"
      >
        <div>
          <b @click="showAllRecurTasks()"
            >Show {{ contacts[slctdCntctIndex].RecurTasks.length - 1 }} more
            {{ contacts[slctdCntctIndex].RecurTasks.length - 1 > 1 ? 'tasks' : 'task' }}
          </b>
        </div>
      </div>

      <div v-if="RecurTasks.length === 0" class="recur-tasks-body" style="background-color: white">
        <div>No recurring tasks</div>
      </div>
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
      'contacts',
      'times',
      'patchContactInfo',
      'deleteContactInfo',
      'userList',
      'slctdCntctIndex',
      'slctdY_m_d',
    ]),
    RecurTasks() {
      return this.eventIndex !== null
        ? [
            {
              ...this.contacts[this.slctdCntctIndex].RecurTasks[this.eventIndex],
              clmnIndex: this.eventIndex,
            },
          ]
        : this.sortAscDesc
        ? this.contacts[this.slctdCntctIndex].RecurTasks.map((val, index) => {
            return { ...val, clmnIndex: index };
          }).sort((a, b) => a.Start.localeCompare(b.Start))
        : this.contacts[this.slctdCntctIndex].RecurTasks.map((val, index) => {
            return { ...val, clmnIndex: index };
          }).sort((a, b) => b.Start.localeCompare(a.Start));
    },
  },

  data() {
    return { clmn: 'RecurTasks', sortAscDesc: false, recurTaskMemo: 0 };
  },

  methods: {
    newRecurTask() {
      const newRecurTasks = [
        ...this.contacts[this.slctdCntctIndex].RecurTasks,
        {
          Start: this.slctdY_m_d,
          Recur: [this.slctdY_m_d.slice(5, 10)],
          Freq: 'Annually',
          Assign: this.userData.id,
          Create: this.userData.id,
          Update: this.userData.id,
        },
      ];
      this.contacts[this.slctdCntctIndex].RecurTasks = newRecurTasks;
      this.eventIndex = this.contacts[this.slctdCntctIndex].RecurTasks.length - 1;
      this.patchContactInfo(this.slctdY_m_d, this.clmn, this.contacts[this.slctdCntctIndex].RecurTasks.length, 'Start');
      this.recurTaskMemo = this.recurTaskMemo + 1;
    },
    updateRecurTask(event, clmnIndex, key) {
      if (event != this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key]) {
        this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key] = event;
        this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Update = this.userData.id;
        this.patchContactInfo(event, this.clmn, clmnIndex, key);
      }
    },
    updateRecurTaskFreq(clmnIndex, start, freq) {
      if (
        start != this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Start ||
        freq != this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Freq
      ) {
        let recurTaskEvent, newRecurTask;
        if (freq == 'Annually') {
          recurTaskEvent = start.slice(5, 10) != '02-29' ? start.slice(5, 10) : '02-28';
        } else if (freq == 'Semiannually') {
          const halfYearLater = new Date(start + 'T00:00:00').setMonth(new Date(start + 'T00:00:00').getMonth() + 6);
          // prettier-ignore
          recurTaskEvent = (start.slice(5, 10) != '02-29' ? start.slice(5, 10) : '02-28') + '_' + new Date(halfYearLater).toISOString().slice(5, 10);
          // prettier-ignore
          newRecurTask = [(start.slice(5, 10) != '02-29' ? start.slice(5, 10) : '02-28'), new Date(halfYearLater).toISOString().slice(5, 10),];
        } else if (freq == 'Quarterly') {
          const quarterYearLater = new Date(start + 'T00:00:00').setMonth(new Date(start + 'T00:00:00').getMonth() + 3);
          const halfYearLater = new Date(start + 'T00:00:00').setMonth(new Date(start + 'T00:00:00').getMonth() + 6);
          const thirdYearLater = new Date(start + 'T00:00:00').setMonth(new Date(start + 'T00:00:00').getMonth() + 9);
          // prettier-ignore
          recurTaskEvent = (start.slice(5, 10) != '02-29' ? start.slice(5, 10) : '02-28') + '_' + new Date(quarterYearLater).toISOString().slice(5, 10) + '_' + new Date(halfYearLater).toISOString().slice(5, 10) + '_' + new Date(thirdYearLater).toISOString().slice(5, 10);
          // prettier-ignore
          newRecurTask = [(start.slice(5, 10) != '02-29' ? start.slice(5, 10) : '02-28'), new Date(quarterYearLater).toISOString().slice(5, 10), new Date(halfYearLater).toISOString().slice(5, 10), new Date(thirdYearLater).toISOString().slice(5, 10),];
        } else if (freq == 'Monthly') {
          recurTaskEvent = start.slice(8, 10);
        } else if (freq == 'Weekly') {
          recurTaskEvent = new Date(start + 'T00:00:00').getDay().toString();
        } else if (freq == 'Daily') {
          recurTaskEvent = 'everyday';
        }

        this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Start = start;
        this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Recur =
          freq == 'Semiannually' || freq == 'Quarterly' ? newRecurTask : [recurTaskEvent];
        this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Freq = freq;
        this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Update = this.userData.id;
        this.patchContactInfo(freq + '+' + start + '+' + recurTaskEvent, this.clmn, clmnIndex, 'Freq');
      }
    },
    deleteRecurTask(clmnIndex) {
      if (confirm(this.msg.confirmDeletion) == true) {
        this.deleteContactInfo(this.clmn, clmnIndex, true);
        this.showAllRecurTasks();
      }
    },
    showAllRecurTasks() {
      this.eventIndex = null;
      this.recurTaskMemo = this.recurTaskMemo + 1;
    },
  },

  watch: {
    eventIndex() {
      this.recurTaskMemo = this.recurTaskMemo + 1;
    },
    slctdCntctIndex() {
      this.recurTaskMemo = this.recurTaskMemo + 1;
    },
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
  grid-template-columns: calc(100% - 60px) 30px 30px;
}
.recur-tasks-title-grid-item1 {
  height: 20px;
  overflow: hidden;
}
.recur-tasks-title-grid-item2 button,
.recur-tasks-title-grid-item3 button {
  background-color: transparent;
  border: 0px;
  cursor: pointer;
  color: #417cd9;
}
.recur-tasks-title-grid-item2 button:hover,
.recur-tasks-title-grid-item3 button:hover {
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
  min-height: 32px;
  display: block; /* not sure if this is needed */
}
.recur-tasks-span span[contenteditable]:empty::before {
  min-height: 32px;
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
