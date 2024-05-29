<template>
  <div class="notes">
    <template v-if="slctdCntct && contacts && userSettings">
      <div class="notes-title">
        Notes for
        {{ slctdCntct.Members[0].First ? slctdCntct.Members[0].First : '' }}
        {{ slctdCntct.Members[0].Name }}
      </div>
      <textarea
        placeholder="Notes"
        :value="slctdCntct.Notes"
        @change="updateNotes($event)"
      ></textarea>
    </template>
    <template v-else> Notes </template>
  </div>
</template>

<script>
export default {
  name: 'Notes',

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'userSettings',
      'contacts',
      'patchContactInfo',
      'slctdCntct',
    ]),
  },

  data() {
    return {};
  },

  methods: {
    updateNotes(event) {
      const column = 'Notes';
      // prettier-ignore
      this.contacts[this.userSettings.selectedContactIndex][column] = event.target.value;
      this.patchContactInfo(event.target.value, column);
    },
  },
};
</script>

<style>
.notes {
  background-color: lightblue;
}
.notes-title {
  font-weight: bold;
  padding: 5px;
  color: black;
  height: 30px;
  overflow: hidden;
  white-space: nowrap;
}
.notes textarea {
  width: 100%;
  height: calc(100vh - 50px);
  font-family: 'Helvetica', sans-serif;
  resize: none;
  padding: 5px;
  border: none;
  margin-bottom: -4px;
}
</style>
