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
              {{slctdCntct.Members[0].First ? slctdCntct.Members[0].First : ''}} 
              {{slctdCntct.Members[0].Name}}
            </div>
            <div class="recur-tasks-title-grid-item2">
              <button @click="newRecurTask" ><i class="fa-solid fa-square-plus"></i></button>
            </div>
          </div>
        </div>
        
        <template v-for="(recurTask, recurTaskIndex) in recurtasks">
          <div class="recur-tasks-body" :style="{ 'background-color': recurTaskIndex % 2 ? 'lightblue' : 'white'}">
            <i class="fa-solid fa-trash" @click="deleteContactInfo('RecurTasks', recurTask.RealIndex)"></i>
            <span class="recur-tasks-label">Start:</span><input type="date" v-model="contacts[userSettings.selectedContactIndex].RecurTasks[recurTask.RealIndex].Start" @change="updateRecurTaskFreq(recurTask.RealIndex)" :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']">
            <span class="recur-tasks-label">End:</span><input type="date" :value="recurTask.End" @change="updateRecurTask($event, recurTask.RealIndex, 'End')" :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']">
            <span class="recur-tasks-label">Time:</span><input type="time" :value="recurTask.Time" @change="updateRecurTask($event, recurTask.RealIndex, 'Time')" :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']">
            <span class="recur-tasks-label">Recur:</span>
            <select v-model="contacts[userSettings.selectedContactIndex].RecurTasks[recurTask.RealIndex].Freq" @change="updateRecurTaskFreq(recurTask.RealIndex)" :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']">              
              <option>Annually</option>
              <option>Semiannually</option>
              <option>Monthly</option>
              <option>Weekly</option>  
              <option>Daily</option>
            </select>
            <span class="recur-tasks-label">Owner:</span>
            <select :value="recurTask.Assign" :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']">
              <option v-for="([userNo, userInfo], userIndex) in Object.entries(userList)" :value="userNo">{{userInfo[0]}}</option>
              <option disabled>Last updated by: {{userList[recurTask.Update][0]}}</option>
              <option disabled>Created by: {{userList[recurTask.Create][0]}}</option>
            </select>
            <div class="recur-tasks-span" :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']">
              <span spellcheck="false" contenteditable v-on:blur="updateRecurTask($event, recurTaskIndex, 'Desc')">{{recurTask.Desc}}</span>
            </div>
            <div>
              <button @click="updateRecurTask($event, recurTask.RealIndex, 'Review')">Reviewed</button> {{ recurTask.Review? recurTask.Review.slice(5,7) + '/' + recurTask.Review.slice(8,10) + '/' + recurTask.Review.slice(0,4) : '' }}
            </div>
          </div>
          <div v-if="eventIndex !== null && slctdCntct.RecurTasks.length > 1" class="recur-tasks-body" style="backgroundColor: lightblue; textAlign: right">
            <div><b @click="showAll">Show {{slctdCntct.RecurTasks.length - 1}} more {{(slctdCntct.RecurTasks.length - 1) > 1 ? 'tasks' : 'task'}} </b></div>
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
    recurtasks() {
      return this.eventIndex === null
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
    updateRecurTask(event, columnIndex, key) {
      const column = 'RecurTasks';
      let recurTaskValue =
        event.target.type == 'date'
          ? event.target.value
          : event.target.type == 'time'
          ? event.target.value
          : event.target.type == 'checkbox'
          ? event.target.checked
          : event.target.type == 'submit'
          ? this.times.Y_m_d_H_i_s_z.slice(0, 10)
          : event.target.innerHTML; // SPAN
      // prettier-ignore
      this.contacts[this.userSettings.selectedContactIndex][column][columnIndex][key] = recurTaskValue;
      this.patchContactInfo(recurTaskValue, column, columnIndex, key);
    },
    updateRecurTaskFreq(columnIndex) {
      const column = 'RecurTasks';
      // prettier-ignore
      const start = this.contacts[this.userSettings.selectedContactIndex][column][columnIndex].Start
      // prettier-ignore
      const freq = this.contacts[this.userSettings.selectedContactIndex][column][columnIndex].Freq;
      let recurTaskEvent, newRecurTask;
      if (freq == 'Annually') {
        // prettier-ignore
        recurTaskEvent = (start.slice(5, 10) != '02-29' ? start.slice(5, 10) : '02-28');
      } else if (freq == 'Semiannually') {
        // prettier-ignore
        const halfYearLater = new Date(start).setMonth(new Date(start).getMonth() + 6);
        // prettier-ignore
        recurTaskEvent = (start.slice(5, 10) != '02-29' ? start.slice(5, 10) : '02-28') + '_' + new Date(halfYearLater).toISOString().slice(5, 10);
        // prettier-ignore
        newRecurTask = [(start.slice(5, 10) != '02-29' ? start.slice(5, 10) : '02-28'), new Date(halfYearLater).toISOString().slice(5, 10),];
      } else if (freq == 'Monthly') {
        recurTaskEvent = start.slice(8, 10);
      } else if (freq == 'Weekly') {
        recurTaskEvent = new Date(start).getDay();
      } else if (freq == 'Daily') {
        recurTaskEvent = 'everyday';
      }
      // prettier-ignore
      this.contacts[this.userSettings.selectedContactIndex][column][columnIndex].Recur = freq == 'Semiannually' ? newRecurTask : [recurTaskEvent];
      // prettier-ignore
      this.patchContactInfo(freq + '+' + start + '+' + recurTaskEvent, column, columnIndex, 'Freq');
    },
    newRecurTask() {
      this.showAll();
      const column = 'RecurTasks';
      this.contacts[this.userSettings.selectedContactIndex][column].push({
        Start: this.times.Y_m_d,
        Recur: [this.times.Y_m_d.slice(5, 10)],
        Freq: 'Annually',
        Assign: this.userData.id,
        Create: this.userData.id,
        Update: this.userData.id,
      });
      // prettier-ignore
      this.patchContactInfo(this.times.Y_m_d, column, this.slctdCntct.RecurTasks.length, 'Start');
    },
    showAll() {
      this.eventIndex = null;
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
  padding: 10px;
}
.recur-tasks-body i{
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
.recur-tasks-body input, .recur-tasks-body select {
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
.recur-tasks-span span[contenteditable]{
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
`
    );
  },
};
