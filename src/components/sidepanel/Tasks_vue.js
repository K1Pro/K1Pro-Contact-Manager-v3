// import example from './components/example_vue.js';

export default {
  name: 'Tasks',
  // ([taskDate, task], taskIndex)
  template: /*html*/ `
    <div class='tasks'>
      <template v-if="slctdCntct">
        <div class="tasks-title">
          <div class="tasks-title-grid-container">
            <div class="tasks-title-grid-item1">
              Tasks for
              {{Object.values(slctdCntct.Members[0])[0].First ? Object.values(slctdCntct.Members[0])[0].First : ''}} 
              {{Object.values(slctdCntct.Members[0])[0].Name}}
            </div>
            <div class="tasks-title-grid-item2">
              <button @click="newTask" ><i class="fa-solid fa-square-plus"></i></button>
            </div>
          </div>
        </div>
        
        <template v-for="(task, taskIndex) in tasks">
          <div class="tasks-body" :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white'}">
            <i class="fa-solid fa-trash"></i>
            <div>
              <input type="checkbox" :checked="task.Status == 1" @change="changeTask($event, taskIndex)"/>
              <input type="datetime-local" :value="task.Date" @change="changeTask($event, taskIndex)" :class="[taskIndex % 2 ? 'even-task' : 'odd-task']">
            </div>
            <div class="tasks-span" :class="[taskIndex % 2 ? 'even-task' : 'odd-task']">
              <span spellcheck="false" contenteditable v-on:blur="changeTask($event, taskIndex)">{{task.Desc}}</span>
            </div>
            <div>Owner: 
              <select :value="task.Assign" :class="[taskIndex % 2 ? 'even-task' : 'odd-task']">
                <option v-for="([userNo, userInfo], userIndex) in Object.entries(userList)" :value="userNo">{{userInfo[0]}}</option>
                <option disabled>Last updated by: {{userList[task.Update][0]}}</option>
                <option disabled>Created by: {{userList[task.Create][0]}}</option>
              </select>
              {{taskIndex}}
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
      'msg',
      'eventIndex',
      'userSettings',
      'contacts',
      'times',
      'slctdCntct',
      'userList',
    ]),
    tasks() {
      return this.eventIndex === null
        ? this.slctdCntct.Tasks.sort((a, b) => b.Date.localeCompare(a.Date))
        : Array(this.slctdCntct.Tasks[this.eventIndex]);
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
    changeTask(event, taskDate) {
      // if (event.target.type == 'datetime-local') {
      //   this.contacts[this.userSettings.selectedContactIndex].Tasks[
      //     event.target.value
      //   ] =
      //     this.contacts[this.userSettings.selectedContactIndex].Tasks[taskDate];
      //   delete this.contacts[this.userSettings.selectedContactIndex].Tasks[
      //     taskDate
      //   ];
      // } else if (event.target.type == 'checkbox') {
      //   if (event.target.checked) {
      //     this.contacts[this.userSettings.selectedContactIndex].Tasks[
      //       taskDate
      //     ].Status = '1';
      //   } else {
      //     this.contacts[this.userSettings.selectedContactIndex].Tasks[
      //       taskDate
      //     ].Status = '0';
      //   }
      // } else if (event.srcElement.nodeName == 'SPAN') {
      //   if (
      //     event.target.innerHTML !=
      //     this.contacts[this.userSettings.selectedContactIndex].Tasks[taskDate]
      //       .Desc
      //   ) {
      //     this.contacts[this.userSettings.selectedContactIndex].Tasks[
      //       taskDate
      //     ].Desc = event.target.innerHTML;
      //   }
      // }
    },
    newTask() {
      console.log('creating a new task');
      this.contacts[this.userSettings.selectedContactIndex].Tasks[
        this.times.Y_m_d_H_i
      ] = {
        Desc: 'Just a test',
        Status: '0',
        Create: 'Bartosz',
        Assign: 'Bartosz',
        Update: 'Bartosz',
      };
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
  border-radius: 1px;
  border: 1px solid lightgray;
  padding: 5px;
  word-break: break-word;
  font-size: 14px;
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
