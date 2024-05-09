// import example from './components/example_vue.js';

export default {
  name: 'Recur Tasks',

  template: /*html*/ `
    <div class='recur-tasks'>
      <template v-if="slctdCntct">
        <div class="recur-tasks-title">
          <div class="recur-tasks-title-grid-container">
            <div class="recur-tasks-title-grid-item1">
              Recurring tasks for
              {{Object.values(slctdCntct.Members[0])[0].First ? Object.values(slctdCntct.Members[0])[0].First : ''}} 
              {{Object.values(slctdCntct.Members[0])[0].Name}}
            </div>
            <div class="recur-tasks-title-grid-item2">
              <button @click="newTask" ><i class="fa-solid fa-square-plus"></i></button>
            </div>
          </div>
        </div>
        <template v-for="(recurTask, recurTaskIndex) in slctdCntct.RecurTasks">
          <template v-if="eventIndex === recurTaskIndex || eventIndex === null">
            <div class="recur-tasks-body" :style="{ 'background-color': recurTaskIndex % 2 && !eventIndex ? 'lightblue' : 'white'}">
              <i class="fa-solid fa-trash"></i>
              <div>Start: <input type="date" v-model="contacts[userSettings.selectedContactIndex].RecurTasks[recurTaskIndex].Start" :class="[recurTaskIndex % 2 && !eventIndex ? 'even-task' : 'odd-task']"></div>
              <div>End: <input type="date" v-model="contacts[userSettings.selectedContactIndex].RecurTasks[recurTaskIndex].End" :class="[recurTaskIndex % 2 && !eventIndex ? 'even-task' : 'odd-task']"></div>
              <div>Time: <input type="time" v-model="contacts[userSettings.selectedContactIndex].RecurTasks[recurTaskIndex].Time" :class="[recurTaskIndex % 2 && !eventIndex ? 'even-task' : 'odd-task']"></div>
              <div>Recur:
                <select v-model="contacts[userSettings.selectedContactIndex].RecurTasks[recurTaskIndex].Freq" :class="[recurTaskIndex % 2 && !eventIndex ? 'even-task' : 'odd-task']">
                  <option>Daily</option>
                  <option>Weekly</option>  
                  <option>Monthly</option>
                  <option>Semiannually</option>
                  <option>Annually</option>
                </select>
              </div>
              <div>Owner:
                <select v-model="contacts[userSettings.selectedContactIndex].RecurTasks[recurTaskIndex].Assign" @change="selectFirst" :class="[recurTaskIndex % 2 && !eventIndex ? 'even-task' : 'odd-task']">
                  <option disabled selected :value="recurTask.Assign">{{userList[recurTask.Assign][0]}}</option>
                  <template v-for="([userNo, userInfo], userIndex) in Object.entries(userList)">
                    <option v-if="userNo != recurTask.Assign" :value="userNo">{{userInfo[0]}}</option>
                  </template>
                  <option disabled>Last updated by: {{recurTask.Update}}</option>
                  <option disabled>Created by: {{recurTask.Create}}</option>
                </select>
              </div>
              <div class="recur-tasks-span" :class="[recurTaskIndex % 2 && !eventIndex ? 'even-task' : 'odd-task']">
                <span spellcheck="false" contenteditable >{{recurTask.Desc}}</span>
              </div>
              <div>
                <button>Reviewed</button> {{ recurTask.Review }}
              </div>
            </div>
            <div v-if="eventIndex && slctdCntct.RecurTasks.length > 1" class="recur-tasks-body" style="backgroundColor: lightblue; textAlign: right">
              <div><b @click="showAll">Show {{slctdCntct.RecurTasks.length - 1}} more {{(slctdCntct.RecurTasks.length - 1) > 1 ? 'tasks' : 'task'}} </b></div>
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
      //   if (event.target.type == 'datetime-local') {
      //     this.contacts[this.userSettings.selectedContactIndex].Tasks[
      //       event.target.value
      //     ] =
      //       this.contacts[this.userSettings.selectedContactIndex].Tasks[taskDate];
      //     delete this.contacts[this.userSettings.selectedContactIndex].Tasks[
      //       taskDate
      //     ];
      //   } else if (event.target.type == 'checkbox') {
      //     if (event.target.checked) {
      //       this.contacts[this.userSettings.selectedContactIndex].Tasks[
      //         taskDate
      //       ].Status = '1';
      //     } else {
      //       this.contacts[this.userSettings.selectedContactIndex].Tasks[
      //         taskDate
      //       ].Status = '0';
      //     }
      //   } else if (event.srcElement.nodeName == 'SPAN') {
      //     if (
      //       event.target.innerHTML !=
      //       this.contacts[this.userSettings.selectedContactIndex].Tasks[taskDate]
      //         .Desc
      //     ) {
      //       this.contacts[this.userSettings.selectedContactIndex].Tasks[
      //         taskDate
      //       ].Desc = event.target.innerHTML;
      //     }
      //   }
    },
    newTask() {
      console.log('creating a new task');
      //   this.contacts[this.userSettings.selectedContactIndex].Tasks[
      //     this.times.Y_m_d_H_i
      //   ] = {
      //     Desc: 'Just a test',
      //     Status: '0',
      //     Create: 'Bartosz',
      //     Assign: 'Bartosz',
      //     Update: 'Bartosz',
      //   };
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
      'recur-tasks',
      /*css*/ `
.recur-tasks-title{
  font-weight: bold;
  padding: 5px;
  background-color: lightblue;
  color: black;
}
.recur-tasks-title-grid-container{
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
  color: #417CD9
}  
.recur-tasks-title-grid-item2 button:hover {
  color: #DB66FF;
}
.recur-tasks-body{
  padding: 10px 10px 0px 10px;
}
.recur-tasks-body i{
  float: right;
  font-size: 14px;
}
.recur-tasks-body div {
  padding-bottom: 10px;
}
.recur-tasks-body input, .recur-tasks-body select {
  position: absolute;
  left: 60px;
  width: calc(100% - 100px);
  height: 20px;
  font-family: 'Helvetica', sans-serif;
  font-size: 14px;
}
.recur-tasks-body button {
  margin: 10px 10px 0px 0px;
}
.recur-tasks-span {
  border-radius: 1px;
  border: 1px solid lightgray;
  padding: 5px;
  word-break: break-word;
  font-size: 14px;
}
.recur-tasks-body span:focus {
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
`
    );
  },
};
