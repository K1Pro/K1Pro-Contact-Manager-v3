// import example from './components/example_vue.js';

export default {
  name: 'Filters',

  template: /*html*/ `
        <div class='filters'>Filters</div>`,

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
      'Filters',
      /*css*/ `
.Filters{}`
    );
  },
};
