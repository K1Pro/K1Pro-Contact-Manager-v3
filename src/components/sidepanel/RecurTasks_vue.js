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
              <button><i class="fa-solid fa-square-plus"></i></button>
            </div>
          </div>
        </div>
        
        <template v-for="(recurTask, recurTaskIndex) in recurtasks">
          <div class="recur-tasks-body" :style="{ 'background-color': recurTaskIndex % 2 ? 'lightblue' : 'white'}">
            <i class="fa-solid fa-trash"></i>
            <span class="recur-tasks-label">Start:</span><input type="date" :value="recurTask.Start" @change="updateRecurTask($event, 'RecurTasks', recurTask.RealIndex, 'Start')" :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']">
            <span class="recur-tasks-label">End:</span><input type="date" :value="recurTask.End" @change="updateRecurTask($event, 'RecurTasks', recurTask.RealIndex, 'End')" :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']">
            <span class="recur-tasks-label">Time:</span><input type="time" :value="recurTask.Time" @change="updateRecurTask($event, 'RecurTasks', recurTask.RealIndex, 'Time')" :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']">
            <span class="recur-tasks-label">Recur:</span>
            <select :value="recurTask.Freq" @change="updateRecurTaskFreq($event, 'RecurTasks', recurTask.RealIndex, 'Freq', recurTask.Start, recurTask.End)" :class="[recurTaskIndex % 2 ? 'even-task' : 'odd-task']">              
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
              <span spellcheck="false" contenteditable v-on:blur="patchRecurTasks($event, recurTaskIndex, 'Desc', null)">{{recurTask.Desc}}</span>
            </div>
            <div>
              <button>Reviewed</button> {{ recurTask.Review }}
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
    updateRecurTask(event, column, columnIndex, key) {
      let recurTaskValue =
        event.target.type == 'date'
          ? event.target.value
          : event.target.type == 'time'
          ? event.target.value
          : event.target.type == 'checkbox'
          ? event.target.checked
          : event.target.innerHTML;
      this.patchContactInfo(recurTaskValue, column, columnIndex, key);
    },
    updateRecurTaskFreq(event, column, columnIndex, key, start, end) {
      let oneYearLater, endTimestamp;
      let startTimestamp = new Date(start).getTime();
      if (!end) {
        endTimestamp = new Date(
          startTimestamp + 1000 * 60 * 60 * 24 * 365
        ).getTime();
        oneYearLater = new Date(startTimestamp + 1000 * 60 * 60 * 24 * 365)
          .toISOString()
          .slice(0, 10);
      } else {
        endTimestamp = new Date(end).getTime(); // gotta work on this if the end time is more than a year
      }
      if (event.target.value == 'Monthly') {
        const recurDay = start.slice(8, 11) < 31 ? start.slice(8, 11) : false;
        let tempStartTimestamp = startTimestamp;
        let recur = [];
        while (tempStartTimestamp < endTimestamp) {
          if (!recurDay) {
            recur.push(new Date(tempStartTimestamp).toISOString().slice(5, 10));
          } else {
            recur.push(
              new Date(tempStartTimestamp).toISOString().slice(5, 8) + recurDay
            );
          }
          tempStartTimestamp += 1000 * 60 * 60 * 24 * 30.41666666666667;
        }
        console.log(recur);
      }
      // console.log('column: ' + column);
      // console.log('columnIndex: ' + columnIndex);
      // console.log('key: ' + key);
      // console.log('event: ' + event.target.value);
      // console.log('start: ' + start);
      // console.log('end: ' + end);
      // console.log('================');
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
