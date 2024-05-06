export default {
  name: 'Notes',

  template: /*html*/ `
    <div class='notes'>
        <template v-if="slctdCntct && contacts && userSettings">
          <div class="notes-title">
            Notes for
            {{Object.values(slctdCntct.Members[0])[0].First ? Object.values(slctdCntct.Members[0])[0].First : ''}} 
            {{Object.values(slctdCntct.Members[0])[0].Name}}
          </div>
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
.notes {
  background-color: lightblue;
  
}
.notes-title{
  font-weight: bold;
  padding: 5px;
  color: black;
}
.notes textarea {
    width: 100%;
    height: calc(100vh - 90px);
    font-family: 'Helvetica', sans-serif;
    resize: none;
    padding: 5px;
    border: none;
    margin-bottom: -4px;
}
`
    );
  },
};
