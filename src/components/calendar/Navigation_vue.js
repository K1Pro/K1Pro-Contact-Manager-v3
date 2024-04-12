// import example from './components/example_vue.js';

export default {
  name: 'Navigation',

  template: /*html*/ `
        <div class='navigation'>Navigation</div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, ['msg']),
  },

  // components: {
  //     example,
  // },

  // props: [''],

  // emits: [''],

  data() {
    return {};
  },

  methods: {},

  mounted() {
    style(
      'Navigation',
      /*css*/ `
.Navigation{}`
    );
  },
};
