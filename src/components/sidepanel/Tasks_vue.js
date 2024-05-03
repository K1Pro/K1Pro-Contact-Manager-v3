// import example from './components/example_vue.js';

export default {
  name: 'Tasks',

  template: /*html*/ `
    <div class='tasks'>
        Tasks  
        <template v-if="slctdCntct">
          for
          {{Object.values(slctdCntct.Members[0])[0].First ? Object.values(slctdCntct.Members[0])[0].First : ''}} 
          {{Object.values(slctdCntct.Members[0])[0].Name}}
          <hr />
          <div v-for="([taskDate, task], taskIndex) in Object.entries(slctdCntct?.Events).sort().reverse()" class="tasks-grid-container">
            <div class="tasks-grid-item1" :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white'}">
              <input type="datetime-local" :value="taskDate" @change="patchTask($event, taskDate)">
              <input type="checkbox" :checked="task.Status == 1"/>
            </div>
            <div class="tasks-grid-item2" :style="{ 'background-color': taskIndex % 2 ? 'lightblue' : 'white'}">
              <span contenteditable>{{task.Desc}}</span>
            </div>
            
          </div>
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
    async patchTask(event, taskDate) {
      this.contacts[this.userSettings.selectedContactIndex].Events[
        event.target.value
      ] =
        this.contacts[this.userSettings.selectedContactIndex].Events[taskDate];
      delete this.contacts[this.userSettings.selectedContactIndex].Events[
        taskDate
      ];
    },
  },

  mounted() {
    style(
      'tasks',
      /*css*/ `
.tasks{}
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
