<template>
  <div class="notes">
    <template v-if="contacts && userSettings">
      <div class="notes-title">
        Notes for
        {{ contacts[slctdCntctIndex].Members[0].First ? contacts[slctdCntctIndex].Members[0].First : '' }}
        {{ contacts[slctdCntctIndex].Members[0]?.Name }}
      </div>
      <textarea
        placeholder="Notes"
        :value="contacts[slctdCntctIndex].Notes"
        @change="updateNotes($event)"
        :disabled="dsbld"
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
      'userSettings',
      'contacts',
      'dsbld',
      'patchContactInfo',
      'slctdCntctIndex',
    ]),
  },

  data() {
    return { clmn: 'Notes' };
  },

  methods: {
    updateNotes(event) {
      if (
        (event.target.value != this.contacts[this.slctdCntctIndex][this.clmn] && event.target.value != '') ||
        (event.target.value == '' && this.contacts[this.slctdCntctIndex][this.clmn])
      ) {
        this.contacts[this.slctdCntctIndex][this.clmn] = event.target.value;
        this.patchContactInfo(event.target.value, this.clmn);
      }
    },
  },
};
</script>

<style>
.notes-title {
  background-color: lightblue;
  font-weight: bold;
  padding: 5px;
  color: black;
  height: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
