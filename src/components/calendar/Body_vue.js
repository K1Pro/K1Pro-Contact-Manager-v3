// import example from './components/example_vue.js';

export default {
  name: 'Calendar body',

  template: /*html*/ `
        <div class='calendar-body'>Body</div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, ['msg']),
  },

  //   components: {
  //     example,
  //   },

  //   props: [''],

  //   emits: [''],

  data() {
    return {};
  },

  methods: {},

  mounted() {
    style(
      'Calendar-body',
      /*css*/ `
.Calendar body{}`
    );
  },
};
