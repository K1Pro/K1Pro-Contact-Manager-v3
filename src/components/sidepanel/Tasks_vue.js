// import example from './components/example_vue.js';

export default {
  name: 'Tasks',

  template: /*html*/ `
    <div class='tasks'>
        Tasks for {{Object.values(membersSlctdCntctArr[0])[0].Name}}
    </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, ['msg', 'membersSlctdCntctArr']),
  },

  //   components: {
  //     example,
  //   },

  //   props: [''],

  //   emits: [''],

  //   data() {
  //     return {};
  //   },

  //   methods: {},

  mounted() {
    style(
      'tasks',
      /*css*/ `
.tasks{}`
    );
  },
};
