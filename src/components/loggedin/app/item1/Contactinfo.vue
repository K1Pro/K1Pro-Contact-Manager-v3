<template>
  <div class="contact-info">
    <searchbar></searchbar>
    <members @contacts="(el) => $emit('contacts', el)"></members>
    <addresses></addresses>
    <connections></connections>
    <assets></assets>
    <credentials></credentials>
    <ownercateg v-if="contacts !== null && contacts.length !== 0"></ownercateg>
  </div>
</template>

<script>
export default {
  name: 'Contact Info',

  emits: ['contacts'],

  inject: ['contacts'],
};
</script>

<style>
.contact-info {
  /* text-align: center; */
  font-family: 'Helvetica', sans-serif;
}
.contact-info select {
  padding: 5px;
}
/*.contact-info input[type='text'] {
  background: white;
  padding: 6px;
  border: 0px;
}
.contact-info input[type='text']:focus {
  outline: none;
}
.contact-info input[type='date'] {
  border-width: 0px;
  font-family: 'Helvetica', sans-serif;
  padding: 6px
  }
.contact-info input[type='date']:focus {
  outline: none;
} 
.contact-info-group {
  position: relative;
}
.contact-info-group i {
  position: absolute;
  top: 6px;
  left: 6px;
  color: grey;
  z-index: 1;
}
.contact-info-group input[type='text'] {
  padding-left: 30px;
}*/
</style>
