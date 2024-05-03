// import example from './components/example_vue.js';

export default {
  name: 'Tasks',

  template: /*html*/ `
    <div class='tasks'>
        <template v-if="slctdCntct">
          <div class="tasks-title">
            Tasks for
            {{Object.values(slctdCntct.Members[0])[0].First ? Object.values(slctdCntct.Members[0])[0].First : ''}} 
            {{Object.values(slctdCntct.Members[0])[0].Name}}
          </div>
          <hr />
          <div v-for="([taskDate, task], taskIndex) in Object.entries(slctdCntct?.Events).sort().reverse()" class="tasks-grid-container">
            <div class="tasks-grid-item1" :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white'}">
              <input type="datetime-local" :value="taskDate" @change="changeTask($event, taskDate)">
              <input type="checkbox" :checked="task.Status == 1" @change="changeTask($event, taskDate)"/>
            </div>
            <div class="tasks-grid-item2" :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white'}">
              <span contenteditable v-on:blur="changeTask($event, taskDate)">{{task.Desc}}</span>
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
    async changeTask(event, taskDate) {
      if (event.target.type == 'datetime-local') {
        this.contacts[this.userSettings.selectedContactIndex].Events[
          event.target.value
        ] =
          this.contacts[this.userSettings.selectedContactIndex].Events[
            taskDate
          ];
        delete this.contacts[this.userSettings.selectedContactIndex].Events[
          taskDate
        ];
      } else if (event.target.type == 'checkbox') {
        if (event.target.checked) {
          this.contacts[this.userSettings.selectedContactIndex].Events[
            taskDate
          ].Status = '1';
        } else {
          this.contacts[this.userSettings.selectedContactIndex].Events[
            taskDate
          ].Status = '0';
        }
      } else if (event.srcElement.nodeName == 'SPAN') {
        if (
          event.target.innerHTML !=
          this.contacts[this.userSettings.selectedContactIndex].Events[taskDate]
            .Desc
        ) {
          this.contacts[this.userSettings.selectedContactIndex].Events[
            taskDate
          ].Desc = event.target.innerHTML;
        }
      }
    },
  },

  mounted() {
    style(
      'tasks',
      /*css*/ `
.tasks{}
.tasks-title{
  border-radius: 5px;
  font-weight: bold;
  padding: 5px;
  background-color: black;
  color: white;
}
.tasks-grid-container{
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto auto;
}
.tasks input[type='datetime-local'] {
  background-color: #99999900;
  border: none;
  /* padding: 5px;*/
  border-bottom: 1px solid black; 
  font-family: 'Helvetica', sans-serif;
  /* font-size: 14px; */
}
.tasks input[type='datetime-local']:focus {
  outline: none; 
}
.tasks span {
  word-break: break-word;
}
.tasks span:focus {
  outline: none; 
}
.tasks-grid-item1 {
  padding: 15px 5px 5px 5px;
  /* border-top: 1px solid black;
  border-left: 1px solid black;
  border-right: 1px solid black;
  background-color: white; */
}
.tasks-grid-item2 {
  padding: 5px 5px 15px 5px;
  /* border-left: 1px solid black;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  background-color: white; */
}
`
    );
  },
};
