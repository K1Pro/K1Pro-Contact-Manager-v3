// import example from './components/example_vue.js';

export default {
  name: 'Tasks',

  template: /*html*/ `
    <div class='tasks'>
      <template v-if="slctdCntct">
        <div class="tasks-title">
          <div class="tasks-title-grid-container">
            <div class="tasks-title-grid-item1">
              Tasks for
              {{slctdCntct.Members[0].First ? slctdCntct.Members[0].First : ''}} 
              {{slctdCntct.Members[0].Name}}
            </div>
            <div class="tasks-title-grid-item2">
              <button @click="newTask" ><i class="fa-solid fa-square-plus"></i></button>
            </div>
          </div>
        </div>
        
        <template v-for="(task, taskIndex) in tasks">
          <div class="tasks-body" :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white'}">
            <i class="fa-solid fa-trash" @click="deleteContactInfo('Tasks', task.RealIndex)"></i>
            <span class="tasks-label">Date:</span><input type="datetime-local" :value="task.Date" @change="updateTask($event.target.value, task.RealIndex, 'Date')" :class="[taskIndex % 2 ? 'even-task' : 'odd-task']">
            <span class="tasks-label">Tag:</span>
            <select :value="task.Tag" @change="updateTask($event.target.value, task.RealIndex, 'Tag')" :class="[taskIndex % 2 ? 'even-task' : 'odd-task']">
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
            <select :value="task.Assign" @change="updateTask($event.target.value, task.RealIndex, 'Assign')" :class="[taskIndex % 2 ? 'even-task' : 'odd-task']">
              <option v-for="([userNo, userInfo], userIndex) in Object.entries(userList)" :value="userNo">{{userInfo[0]}}</option>
              <option disabled>Updated by {{userList[task.Update][0]}}</option>
              <option disabled>Created by {{userList[task.Create][0]}}</option>
            </select>
            <span class="tasks-label">Finished:</span><input type="checkbox" :checked="task?.Status == 1" @change="updateTask($event.target.checked, task.RealIndex, 'Status')"/> {{task?.Status == 1 ? 'Yes' : 'No'}}
            <div class="tasks-span" :class="[taskIndex % 2 ? 'even-task' : 'odd-task']">
              <span spellcheck="false" contenteditable="plaintext-only" v-on:blur="updateTask($event.target.innerHTML, task.RealIndex, 'Desc')">{{task?.Desc}}</span>
            </div>
          </div>
          <div v-if="eventIndex !== null && slctdCntct.Tasks.length > 1" class="tasks-body" style="backgroundColor: lightblue; textAlign: right">
            <div><b @click="showAll">Show {{slctdCntct.Tasks.length - 1}} more {{(slctdCntct.Tasks.length - 1) > 1 ? 'tasks' : 'task'}} </b></div>
          </div>
        </template>
      </template>
    </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
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
    tasks() {
      return this.eventIndex === null
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
  },

  //   components: {
  //     example,
  //   },

  //   props: [''],

  //   emits: [''],

  //   data() {
  //     return {};
  //   },

  methods: {
    updateTask(event, columnIndex, key) {
      const column = 'Tasks';
      // prettier-ignore
      if(event != this.contacts[this.userSettings.selectedContactIndex][column][columnIndex][key]) {
        // prettier-ignore
        this.contacts[this.userSettings.selectedContactIndex][column][columnIndex][key] = event;
        // prettier-ignore
        this.contacts[this.userSettings.selectedContactIndex][column][columnIndex].Update = this.userData.id;
        this.patchContactInfo(event, column, columnIndex, key);
      }
    },
    newTask() {
      this.showAll();
      const column = 'Tasks';
      this.contacts[this.userSettings.selectedContactIndex][column].push({
        Date: this.times.Y_m_d + this.times.Y_m_d_H_i_s_z.slice(10, 16),
        Assign: this.userData.id,
        Create: this.userData.id,
        Update: this.userData.id,
      });
      // prettier-ignore
      this.patchContactInfo(this.times.Y_m_d+this.times.Y_m_d_H_i_s_z.slice(10,16), column, this.slctdCntct.Tasks.length, 'Date');
    },
    showAll() {
      this.eventIndex = null;
    },
  },

  mounted() {
    style(
      'tasks',
      /*css*/ `
.tasks{}
.tasks-title {
  font-weight: bold;
  padding: 5px;
  background-color: lightblue;
  color: black;
}
.tasks-title-grid-container {
  display: grid;
  grid-template-columns: calc(100% - 30px) 30px;
}
.tasks-title-grid-item1 {
  height: 20px;
  overflow: hidden;
}
.tasks-title-grid-item2 button {
  background-color: transparent;
  border: 0px;
  cursor: pointer;
  color: #417CD9
}
.tasks-title-grid-item2 button:hover {
  color: #DB66FF;
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
.tasks-body input, .tasks-body select {
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
.tasks-span span[contenteditable]{
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
`
    );
  },
};
