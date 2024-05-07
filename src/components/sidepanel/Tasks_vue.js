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
          
          <div v-for="([taskDate, task], taskIndex) in Object.entries(slctdCntct?.Tasks).sort().reverse()" class="tasks-grid-container">
            <div class="tasks-grid-item1" :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white'}">
              <div class="tasks-item1-grid-container">
                <div><input type="checkbox" :checked="task.Status == 1" @change="changeTask($event, taskDate)"/></div>
                <div><input type="datetime-local" :value="taskDate" @change="changeTask($event, taskDate)"></div>
                <div><button class="member-button"><i class="fa-solid fa-trash"></i></button></div>
              </div>
            </div>
            <div class="tasks-grid-item2" :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white'}">
              <span spellcheck="false" contenteditable v-on:blur="changeTask($event, taskDate)">{{task.Desc}}</span>
            </div>
            <div class="tasks-grid-item3" :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white'}">
              <select :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white'}">
                <option>Assigned to: {{task.Assign}}</option>
                <option disabled>Last updated by: {{task.Update}}</option>
                <option disabled>Created by: {{task.Create}}</option>
              </select>
            </div>
            
          </div>
        </template>
        <template v-else>
          <div class="tasks-title">Tasks</div>
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
  },

  mounted() {
    style(
      'tasks',
      /*css*/ `
.tasks{}
.tasks-title{
  font-weight: bold;
  padding: 5px;
  background-color: lightblue;
  color: black;
}
.tasks-grid-container{
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto auto auto;
}
.tasks input[type='datetime-local'] {
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
.tasks input[type='datetime-local']:focus {
  outline: none; 
}
.tasks span {
  word-break: break-word;
  font-size: 14px;
}
.tasks span:focus {
  outline: none; 
}
.tasks-grid-item1 {
  padding: 15px 5px 5px 5px;
}
.tasks-grid-item2 {
  padding: 5px 5px 5px 10px;
  /* border-top: 1px dashed grey;
  border-bottom: 1px dashed grey; */
}
.tasks-grid-item3 {
  padding: 5px 5px 15px 5px;
}
.tasks-grid-item3 select {
  border: none;
  font-size: 14px;
}
.tasks-title-grid-container{
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
.tasks-item1-grid-container {
  display: grid;
  grid-template-columns: 20px calc(100% - 50px) 30px;
  align-items: center;
}
.tasks-title-grid-item2 button:hover {
  color: #DB66FF;
}


`
    );
  },
};
