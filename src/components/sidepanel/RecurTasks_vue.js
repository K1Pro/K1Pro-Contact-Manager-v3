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
            <div v-for="recurTask in slctdCntct.RecurTasks" class="recur-tasks-grid-container">
              <div class="recur-tasks-grid-item1" :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white'}">
                <div class="recur-tasks-item1-grid-container">
                  <div><input type="checkbox" /></div>
                  <div><input type="datetime-local" :value="recurTask.Date"></div>
                  <div><button class="member-button"><i class="fa-solid fa-trash"></i></button></div>
                </div>
              </div> 
              <div class="recur-tasks-grid-item2" :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white'}">
                  <select :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white'}">
                    <option>{{recurTask.Type}}</option>
                  </select>
                  <div><input type="checkbox" />Remind</div>
                  <div><input type="range" /></div>
                  <div><input type="text" :value="recurTask.Policy_Number" /></div>
                  <select :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white'}">
                    <option>{{recurTask.Source}}</option>
                  </select>
                  <select :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white'}">
                    <option>{{recurTask.Policy_Type}}</option>
                  </select>
                  <select :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white'}">
                    <option>{{recurTask.Policy_Status}}</option>
                  </select>
              </div>
              <div class="recur-tasks-grid-item3" :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white'}">
                <select :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white'}">
                  <option>Assigned to: {{recurTask.Assign}}</option>
                  <option disabled>Last updated by: {{recurTask.Update}}</option>
                  <option disabled>Created by: {{recurTask.Create}}</option>
                </select>
              </div>
            </div>
            
          </template>
          <template v-else>
            <div class="recur-tasks-title">Tasks</div>
          </template>
  
      </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'userSettings',
      'contacts',
      'times',
      'slctdCntct',
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
  },

  mounted() {
    style(
      'recur-tasks',
      /*css*/ `
  .recur-tasks{}
  .recur-tasks-title{
    font-weight: bold;
    padding: 5px;
    background-color: lightblue;
    color: black;
  }
  .recur-tasks-grid-container{
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto auto auto;
  }
  .recur-tasks input[type='datetime-local'] {
    /* color-scheme: dark;
    color: black;
    padding: 5px;*/
    background-color: #99999900;
    border: none;
    font-family: 'Helvetica', sans-serif;
    font-size: 14px;
  }
  /*input[type="date"]::-webkit-calendar-picker-indicator {
    opacity: 0.6;
    filter: invert(1);
  }*/
  .recur-tasks input[type='datetime-local']:focus {
    outline: none; 
  }
  .recur-tasks span {
    word-break: break-word;
    font-size: 14px;
  }
  .recur-tasks span:focus {
    outline: none; 
  }
  .recur-tasks-grid-item1 {
    padding: 15px 5px 5px 5px;
  }
  .recur-tasks-grid-item2 {
    padding: 5px 5px 5px 5px;
    /* border-top: 1px dashed grey;
    border-bottom: 1px dashed grey; */
  }
  .recur-tasks-grid-item3 {
    padding: 5px 5px 15px 5px;
  }
  .recur-tasks-grid-item3 select {
    border: none;
    font-size: 14px;
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
  .recur-tasks-item1-grid-container {
    display: grid;
    grid-template-columns: 20px calc(100% - 50px) 30px;
    align-items: center;
  }
  .recur-tasks-item2-grid-container {
    display: grid;
    grid-template-columns: 20px calc(100% - 50px) 30px;
    align-items: center;
  }
  .recur-tasks-title-grid-item2 button:hover {
    color: #DB66FF;
  }
  
  
  `
    );
  },
};
