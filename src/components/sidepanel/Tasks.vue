<template>
  <div class="tasks">
    <template v-if="slctdCntct">
      <div class="tasks-title">
        <div class="tasks-title-grid-container">
          <div class="tasks-title-grid-item1">
            Tasks for
            {{ slctdCntct.Members[0].First ? slctdCntct.Members[0].First : '' }}
            {{ slctdCntct.Members[0].Name }}
          </div>
          <div class="tasks-title-grid-item2">
            <button v-if="eventIndex === null" @click="sortTask">
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

      <template v-for="(task, taskIndex) in Tasks">
        <div class="tasks-body" :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white' }">
          <i class="fa-solid fa-trash" @click="deleteTask(task.RealIndex, taskIndex)"></i>
          <span class="tasks-label">Date:</span
          ><input
            type="datetime-local"
            :value="task.Date"
            @change="updateTask($event.target.value, task.RealIndex, taskIndex, 'Date')"
            :class="[taskIndex % 2 ? 'even-task' : 'odd-task']"
          />
          <span class="tasks-label">Tag:</span>
          <select
            :value="task.Tag"
            @change="updateTask($event.target.value, task.RealIndex, taskIndex, 'Tag')"
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
            @change="updateTask($event.target.value, task.RealIndex, taskIndex, 'Assign')"
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
            :checked="task?.Status == 1"
            @change="updateTask($event.target.checked, task.RealIndex, taskIndex, 'Status')"
          />
          {{ task?.Status == 1 ? 'Yes' : 'No' }}
          <div class="tasks-span" :class="[taskIndex % 2 ? 'even-task' : 'odd-task']">
            <span
              spellcheck="false"
              contenteditable="plaintext-only"
              v-on:blur="updateTask($event.target.innerHTML, task.RealIndex, taskIndex, 'Desc')"
              >{{ task?.Desc }}</span
            >
          </div>
        </div>
        <div
          v-if="eventIndex !== null && slctdCntct.Tasks.length > 1"
          class="tasks-body"
          style="background-color: lightblue; text-align: right"
        >
          <div>
            <b @click="showAll"
              >Show {{ slctdCntct.Tasks.length - 1 }} more
              {{ slctdCntct.Tasks.length - 1 > 1 ? 'tasks' : 'task' }}
            </b>
          </div>
        </div>
      </template>
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
    return { Tasks: [], column: 'Tasks', sortAscDesc: false };
  },

  methods: {
    taskArray() {
      this.Tasks =
        this.eventIndex === null
          ? this.slctdCntct.Tasks.map((val, index) => {
              return { ...val, RealIndex: index };
            }).sort((a, b) => b.Date.localeCompare(a.Date))
          : [
              {
                ...this.slctdCntct.Tasks[this.eventIndex],
                RealIndex: this.eventIndex,
              },
            ];
    },
    sortTask() {
      if (this.sortAscDesc) {
        this.Tasks = this.slctdCntct.Tasks.map((val, index) => {
          return { ...val, RealIndex: index };
        }).sort((a, b) => b.Date.localeCompare(a.Date));
      } else {
        this.Tasks = this.slctdCntct.Tasks.map((val, index) => {
          return { ...val, RealIndex: index };
        }).sort((a, b) => a.Date.localeCompare(b.Date));
      }
      this.sortAscDesc = !this.sortAscDesc;
    },
    newTask() {
      this.showAll();
      // new component task
      this[this.column].unshift({
        Date: this.times.Y_m_d + this.times.Y_m_d_H_i_s_z.slice(10, 16),
        Assign: this.userData.id,
        Create: this.userData.id,
        Update: this.userData.id,
        RealIndex: this.Tasks.length,
      });
      // new state task
      this.contacts[this.userSettings.selectedContactIndex][this.column].push({
        Date: this.times.Y_m_d + this.times.Y_m_d_H_i_s_z.slice(10, 16),
        Assign: this.userData.id,
        Create: this.userData.id,
        Update: this.userData.id,
      });
      // new database task
      // prettier-ignore
      this.patchContactInfo(this.times.Y_m_d+this.times.Y_m_d_H_i_s_z.slice(10,16), this.column, this.slctdCntct.Tasks.length, 'Date');
    },
    updateTask(event, columnIndex, taskIndex, key) {
      if (event != this.contacts[this.userSettings.selectedContactIndex][this.column][columnIndex][key]) {
        // updating component task
        this[this.column][taskIndex][key] = event;
        this[this.column][taskIndex].Update = this.userData.id;
        // updating state task
        this.contacts[this.userSettings.selectedContactIndex][this.column][columnIndex][key] = event;
        this.contacts[this.userSettings.selectedContactIndex][this.column][columnIndex].Update = this.userData.id;
        // updating database task
        this.patchContactInfo(event, this.column, columnIndex, key);
      }
    },
    deleteTask(columnIndex, taskIndex) {
      if (confirm(this.msg.confirmDeletion) == true) {
        // deleting component task
        this[this.column].splice(taskIndex, 1);
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
      this.taskArray();
    },
  },

  mounted() {
    this.taskArray();
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
  display: block; /* not sure if this is needed */
}
.tasks-span span[contenteditable]:empty::before {
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
