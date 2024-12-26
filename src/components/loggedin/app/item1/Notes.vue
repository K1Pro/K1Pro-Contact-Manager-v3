<template>
  <div class="notes">
    <template v-if="contacts !== null && contacts.length !== 0">
      <div class="notes-title">
        Notes for
        {{ contacts[slctdCntctIndex].Members[0].First ? contacts[slctdCntctIndex].Members[0].First : '' }}
        {{ contacts[slctdCntctIndex].Members[0]?.Name }}
      </div>
      <textarea
        placeholder="Notes"
        :value="contacts[slctdCntctIndex].Notes"
        @change="updateNotes($event.target.value)"
        :disabled="dsbld"
      ></textarea>
    </template>
    <template v-else>Create a contact first</template>
  </div>
</template>

<script>
export default {
  name: 'Notes',

  inject: ['contacts', 'dsbld', 'patchContactInfo', 'slctdCntctIndex'],

  data() {
    return { clmn: 'Notes' };
  },

  methods: {
    updateNotes(event) {
      event = typeof event === 'boolean' ? event : event.trim();
      if (
        (event != this.contacts[this.slctdCntctIndex][this.clmn] && event != '') ||
        (event == '' && this.contacts[this.slctdCntctIndex][this.clmn])
      ) {
        const cloneCntct = this.contacts[this.slctdCntctIndex];
        cloneCntct[this.clmn] = event;
        this.patchContactInfo(event, this.clmn, null, null, cloneCntct);
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
