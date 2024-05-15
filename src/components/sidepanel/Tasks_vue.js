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
            <div>
              <input type="checkbox" :checked="task?.Status == 1" @change="updateTask($event, 'Tasks', task.RealIndex, 'Status')"/>
              <input type="datetime-local" :value="task.Date" @change="updateTask($event, 'Tasks', task.RealIndex, 'Date')" :class="[taskIndex % 2 ? 'even-task' : 'odd-task']">
            </div>
            <div class="tasks-span" :class="[taskIndex % 2 ? 'even-task' : 'odd-task']">
              <span spellcheck="false" contenteditable v-on:blur="updateTask($event, 'Tasks', task.RealIndex, 'Desc')">{{task?.Desc}}</span>
            </div>
            <div>Owner: 
              <select :value="task.Assign" :class="[taskIndex % 2 ? 'even-task' : 'odd-task']">
                <option v-for="([userNo, userInfo], userIndex) in Object.entries(userList)" :value="userNo">{{userInfo[0]}}</option>
                <option disabled>Last updated by: {{userList[task.Update][0]}}</option>
                <option disabled>Created by: {{userList[task.Create][0]}}</option>
              </select>
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
    updateTask(event, column, columnIndex, key) {
      let taskValue =
        event.target.type == 'datetime-local'
          ? event.target.value
          : event.target.type == 'checkbox'
          ? event.target.checked
          : event.target.innerHTML;
      this.patchContactInfo(taskValue, column, columnIndex, key);
    },
    newTask() {
      // prettier-ignore
      this.patchContactInfo(this.times.Y_m_d+this.times.Y_m_d_H_i_s_z.slice(10,16), 'Tasks', this.slctdCntct.Tasks.length, 'Date');
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
  padding: 10px 10px 0px 10px;
}
.tasks-body i{
  float: right;
  font-size: 14px;
  cursor: pointer;
}
.tasks-body div {
  padding-bottom: 10px;
}
.tasks-body input, .tasks-body select {
  font-family: 'Helvetica', sans-serif;
  font-size: 14px;
}
.tasks-body select {
  margin-top: 10px;
  width: 50%
}
.tasks-span {
  display: block;
  min-height: 40px;
  border-radius: 1px;
  border: 1px solid lightgray;
  padding: 10px 10px 0px 10px;
  word-break: break-word;
  font-size: 14px;
}
.tasks-span span{
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
.tasks-body span:focus {
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
