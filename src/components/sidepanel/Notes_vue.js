export default {
  name: 'Notes',

  template: /*html*/ `
    <div class='notes'>
        <template v-if="slctdCntct && contacts && userSettings">
            Notes for
            {{Object.values(slctdCntct.Members[0])[0].First ? Object.values(slctdCntct.Members[0])[0].First : ''}} 
            {{Object.values(slctdCntct.Members[0])[0].Name}}
            <br />
            <br />
            <textarea placeholder="Notes" v-model="contacts[userSettings.selectedContactIndex].Notes"></textarea>
        </template>
        <template v-else>
        Notes
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

  //   components: {},

  //   props: [''],

  //   emits: [''],

  data() {
    return {};
  },

  methods: {},

  mounted() {
    style(
      'notes',
      /*css*/ `
.notes {}
.notes textarea {
    width: 100%;
    height: calc(100vh - 100px);
    font-family: 'Helvetica', sans-serif;
    resize: none;
    padding: 5px;
}
`
    );
  },
};
