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
              {{Object.values(slctdCntct.Members[0])[0].First ? Object.values(slctdCntct.Members[0])[0].First : ''}} 
              {{Object.values(slctdCntct.Members[0])[0].Name}}
            </div>
            <div class="tasks-title-grid-item2">
              <button @click="newTask" ><i class="fa-solid fa-square-plus"></i></button>
            </div>
          </div>
        </div>
        
        <template v-for="([taskDate, task], taskIndex) in Object.entries(slctdCntct?.Tasks).sort().reverse()">
          <template v-if="eventIndex == taskDate || eventIndex === null">
            <div class="tasks-body" :style="{ 'background-color': taskIndex % 2 && !eventIndex ? 'lightblue' : 'white'}">
              <i class="fa-solid fa-trash"></i>
              <div>
                <input type="checkbox" :checked="task.Status == 1" @change="changeTask($event, taskDate)"/>
                <input type="datetime-local" :value="taskDate" @change="changeTask($event, taskDate)" :class="[taskIndex % 2 && !eventIndex ? 'even-task' : 'odd-task']">
              </div>
              <div class="tasks-span" :class="[taskIndex % 2 && !eventIndex ? 'even-task' : 'odd-task']">
                <span spellcheck="false" contenteditable v-on:blur="changeTask($event, taskDate)">{{task.Desc}}</span>
              </div>
              <div>Owner: 
                <select v-model="contacts[userSettings.selectedContactIndex].Tasks[taskDate].Assign" @change="selectFirst" :class="[taskIndex % 2 && !eventIndex ? 'even-task' : 'odd-task']">
                  <option disabled selected :value="task.Assign">{{userList[task.Assign][0]}}</option>
                  <template v-for="([userNo, userInfo], userIndex) in Object.entries(userList)">
                    <option v-if="userNo != task.Assign" :value="userNo">{{userInfo[0]}}</option>
                  </template>
                  <option disabled>Last updated by: {{userList[task.Update][0]}}</option>
                  <option disabled>Created by: {{userList[task.Create][0]}}</option>
                </select>
              </div>
            </div>
            <div v-if="eventIndex && Object.entries(slctdCntct?.Tasks).length > 1" class="tasks-body" style="backgroundColor: lightblue; textAlign: right">
              <div><b @click="showAll">Show {{Object.entries(slctdCntct?.Tasks).length - 1}} more {{(Object.entries(slctdCntct?.Tasks).length - 1) > 1 ? 'tasks' : 'task'}} </b></div>
            </div>
          </template>
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
      if (event.target.type == 'datetime-local') {
        this.contacts[this.userSettings.selectedContactIndex].Tasks[
          event.target.value
        ] =
          this.contacts[this.userSettings.selectedContactIndex].Tasks[taskDate];
        delete this.contacts[this.userSettings.selectedContactIndex].Tasks[
          taskDate
        ];
      } else if (event.target.type == 'checkbox') {
        if (event.target.checked) {
          this.contacts[this.userSettings.selectedContactIndex].Tasks[
            taskDate
          ].Status = '1';
        } else {
          this.contacts[this.userSettings.selectedContactIndex].Tasks[
            taskDate
          ].Status = '0';
        }
      } else if (event.srcElement.nodeName == 'SPAN') {
        if (
          event.target.innerHTML !=
          this.contacts[this.userSettings.selectedContactIndex].Tasks[taskDate]
            .Desc
        ) {
          this.contacts[this.userSettings.selectedContactIndex].Tasks[
            taskDate
          ].Desc = event.target.innerHTML;
        }
      }
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
    selectFirst(event) {
      event.srcElement.selectedIndex = 0;
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
