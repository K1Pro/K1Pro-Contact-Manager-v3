// import example from './components/example_vue.js';

export default {
  name: 'Reports Panel',

  template: /*html*/ `
        <div class='reports-panel'>
            <div class="reports-panel-title">
                Select a report
            </div>
            <div class="reports-panel-body">
                <div class="reports-panel-report reports-panel-odd" @click="selectReport($event.target.innerHTML)">All contacts</div>
                <div class="reports-panel-report reports-panel-even" @click="selectReport($event.target.innerHTML)">Contacts with minimum information</div>
                <div class="reports-panel-report reports-panel-odd">All Customers</div>
                <div class="reports-panel-report reports-panel-even">All prospects</div>
                <div class="reports-panel-report reports-panel-odd">New business</div>
            </div>
        </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, ['msg', 'reports']),
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
    selectReport(event) {
      this.reports = event;
    },
  },

  mounted() {
    style(
      'reports-panel',
      /*css*/ `
.reports-panel {
    background-color: lightblue;
}
.reports-panel-title{
    font-weight: bold;
    padding: 5px;
    color: black;
    height: 30px;
    overflow: hidden;
    white-space: nowrap;
}
.reports-panel-body{
    padding: 5px;
    background-color: white;
    height: calc(100vh - 50px);
}
.reports-panel-report{
    padding: 5px;
    cursor: pointer;
}
.reports-panel-odd {
    background-color: white;
}
.reports-panel-even {
    background-color: lightblue;
}

    `
    );
  },
};
