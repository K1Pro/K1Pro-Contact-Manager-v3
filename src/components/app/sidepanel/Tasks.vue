<template>
  <div class="tasks">
    <template v-if="contacts[slctdCntctIndex].Tasks">
      <div class="tasks-title">
        <div class="tasks-title-grid-container">
          <div class="tasks-title-grid-item1">
            Tasks for
            {{ contacts[slctdCntctIndex].Members[0].First ? contacts[slctdCntctIndex].Members[0].First : '' }}
            {{ contacts[slctdCntctIndex].Members[0]?.Name }}
          </div>
          <div class="tasks-title-grid-item2">
            <button
              v-if="eventIndex === null"
              @click="
                sortAscDesc = !sortAscDesc;
                taskMemo = taskMemo + 1;
              "
            >
              <template v-if="Tasks.length > 1">
                <i v-if="sortAscDesc" class="fa-solid fa-arrow-down-wide-short"></i>
                <i v-else class="fa-solid fa-arrow-up-wide-short"></i>
              </template>
            </button>
          </div>
          <div class="tasks-title-grid-item3">
            <button @click="newTask">
              <i class="fa-solid fa-square-plus"></i>
            </button>
          </div>
        </div>
      </div>

      <template v-for="(task, taskIndex) in Tasks" v-memo="[taskMemo]">
        <div class="tasks-body" :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white' }">
          <i class="fa-solid fa-trash" @click="deleteTask(task.clmnIndex)"></i>
          <span class="tasks-label">Date:</span
          ><input
            type="datetime-local"
            :value="task.Date"
            v-on:blur="updateTask($event.target.value, task.clmnIndex, 'Date')"
            :class="[taskIndex % 2 ? 'even-task' : 'odd-task']"
          />
          <span class="tasks-label">Tag:</span>
          <select
            :value="task.Tag"
            @change="updateTask($event.target.value, task.clmnIndex, 'Tag')"
            :class="[taskIndex % 2 ? 'even-task' : 'odd-task']"
          >
            <option value="">None</option>
            <option value="fa-solid fa-phone">Call</option>
            <option value="fa-regular fa-at">Email</option>
            <option value="fa-solid fa-cart-shopping">Order</option>
            <option value="fa-solid fa-dollar-sign">Payment</option>
            <option value="fa-solid fa-print">Print</option>
            <option value="fa-solid fa-question">Question</option>
            <option value="fa-solid fa-user">Meeting</option>
            <option value="fa-solid fa-star">Urgent</option>
            <option value="fa-solid fa-pen">Write</option>
          </select>
          <span class="tasks-label">Owner:</span>
          <select
            :value="task.Assign"
            @change="updateTask($event.target.value, task.clmnIndex, 'Assign')"
            :class="[taskIndex % 2 ? 'even-task' : 'odd-task']"
          >
            <option v-for="([userNo, userInfo], userIndex) in Object.entries(userList)" :value="userNo">
              {{ userInfo[0] }}
            </option>
            <option disabled>Updated by {{ userList[task.Update][0] }}</option>
            <option disabled>Created by {{ userList[task.Create][0] }}</option>
          </select>
          <span class="tasks-label">Finished:</span
          ><input
            type="checkbox"
            :checked="task?.Status === true || task?.Status == '1'"
            @change="updateTask($event.target.checked, task.clmnIndex, 'Status')"
          />
          {{ task?.Status === true || task?.Status == '1' ? 'Yes' : 'No' }}
          <div class="tasks-span" :class="[taskIndex % 2 ? 'even-task' : 'odd-task']">
            <span
              spellcheck="false"
              contenteditable="plaintext-only"
              v-on:blur="updateTask($event.target.innerHTML, task.clmnIndex, 'Desc')"
              >{{ task?.Desc }}</span
            >
          </div>
        </div>
      </template>
      <div
        v-if="eventIndex !== null && contacts[slctdCntctIndex].Tasks.length > 1"
        class="tasks-body"
        style="background-color: lightblue; text-align: right"
      >
        <div>
          <b @click="showAllTasks()"
            >Show {{ contacts[slctdCntctIndex].Tasks.length - 1 }} more
            {{ contacts[slctdCntctIndex].Tasks.length - 1 > 1 ? 'tasks' : 'task' }}
          </b>
        </div>
      </div>

      <div v-if="Tasks.length === 0" class="tasks-body" style="background-color: white">
        <div>No tasks</div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Tasks',

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
    Tasks() {
      return this.eventIndex !== null
        ? [
            {
              ...this.contacts[this.slctdCntctIndex].Tasks[this.eventIndex],
              clmnIndex: this.eventIndex,
            },
          ]
        : this.sortAscDesc
        ? this.contacts[this.slctdCntctIndex].Tasks.map((val, index) => {
            return { ...val, clmnIndex: index };
          }).sort((a, b) => a.Date.localeCompare(b.Date))
        : this.contacts[this.slctdCntctIndex].Tasks.map((val, index) => {
            return { ...val, clmnIndex: index };
          }).sort((a, b) => b.Date.localeCompare(a.Date));
    },
  },

  data() {
    return { clmn: 'Tasks', sortAscDesc: false, taskMemo: false };
  },

  methods: {
    newTask() {
      const newTasks = [
        ...this.contacts[this.slctdCntctIndex].Tasks,
        {
          Date: this.slctdY_m_d + this.times.updtngY_m_d_H_i_s_z.slice(10, 16),
          Assign: this.userData.id,
          Create: this.userData.id,
          Update: this.userData.id,
        },
      ];
      this.contacts[this.slctdCntctIndex].Tasks = newTasks;
      this.eventIndex = this.contacts[this.slctdCntctIndex].Tasks.length - 1;
      this.patchContactInfo(
        this.slctdY_m_d + this.times.updtngY_m_d_H_i_s_z.slice(10, 16),
        this.clmn,
        this.contacts[this.slctdCntctIndex].Tasks.length,
        'Date'
      );
      this.taskMemo = this.taskMemo + 1;
    },
    updateTask(event, clmnIndex, key) {
      if (
        (event != this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key] && event != '') ||
        (event == '' && this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key])
      ) {
        this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex][key] = event;
        this.contacts[this.slctdCntctIndex][this.clmn][clmnIndex].Update = this.userData.id;
        this.taskMemo = this.taskMemo + 1;
        this.patchContactInfo(event, this.clmn, clmnIndex, key);
      }
    },
    deleteTask(clmnIndex) {
      if (confirm(this.msg.confirmDeletion) == true) {
        this.deleteContactInfo(this.clmn, clmnIndex, true);
        this.showAllTasks();
      }
    },
    showAllTasks() {
      this.eventIndex = null;
      this.taskMemo = this.taskMemo + 1;
    },
  },

  watch: {
    eventIndex() {
      this.taskMemo = this.taskMemo + 1;
    },
    slctdCntctIndex() {
      this.taskMemo = this.taskMemo + 1;
    },
  },
};
</script>

<style>
.tasks {
}
.tasks-title {
  font-weight: bold;
  padding: 5px;
  background-color: lightblue;
  color: black;
}
.tasks-title-grid-container {
  display: grid;
  grid-template-columns: calc(100% - 60px) 30px 30px;
}
.tasks-title-grid-item1 {
  height: 20px;
  overflow: hidden;
}
.tasks-title-grid-item2 button,
.tasks-title-grid-item3 button {
  background-color: transparent;
  border: 0px;
  cursor: pointer;
  color: #417cd9;
}
.tasks-title-grid-item2 button:hover,
.tasks-title-grid-item3 button:hover {
  color: #db66ff;
}
.tasks-body {
  padding: 10px;
}
.tasks-body i {
  float: right;
  font-size: 14px;
  cursor: pointer;
}
.tasks-label {
  padding-bottom: 10px;
  font-size: 14px;
  display: inline-block;
  width: 60px;
  text-align: right;
}
.tasks-body input,
.tasks-body select {
  width: calc(100% - 100px);
  height: 20px;
  font-family: 'Helvetica', sans-serif;
  font-size: 14px;
}
.tasks-body input[type='checkbox'] {
  height: auto;
  width: auto;
}
.tasks-span {
  border-radius: 1px;
  border: 1px solid lightgray;
  padding: 5px;
  word-break: break-word;
  font-size: 14px;
}
.tasks-span span[contenteditable] {
  min-height: 32px;
  display: block; /* not sure if this is needed */
}
.tasks-span span[contenteditable]:empty::before {
  min-height: 32px;
  content: 'Enter task description';
  display: inline-block;
  color: grey;
}
.tasks-span span[contenteditable]:empty:focus::before {
  content: 'Start typing';
  color: grey;
}
.tasks-body span[contenteditable]:focus {
  outline: none;
}
.tasks b {
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
