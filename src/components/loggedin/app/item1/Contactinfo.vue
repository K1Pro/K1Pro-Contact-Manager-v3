<template>
  <div class="contact-info">
    <searchbar></searchbar>
    <members></members>
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

  inject: ['contacts'],
};
</script>

<style>
.contact-info {
  font-family: 'Helvetica', sans-serif;
}
.contact-info select {
  padding: 5px;
}
</style>
