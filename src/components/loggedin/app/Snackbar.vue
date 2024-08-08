<template>
  <Transition name="slide-fade">
    <span></span>
    <!-- <div v-if="msg.snackBar" class="snackbar">
      {{ msg.snackBar }}
    </div> -->
  </Transition>
</template>

<script>
export default {
  name: 'Snackbar',

  // watch: {
  //   'msg.snackBar'() {
  //     setTimeout(() => {
  //       this.msg.snackBar = null;
  //     }, 3000);
  //   },
  // },
};
</script>

<style>
.slide-fade-enter-active {
  transition: all 0.8s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 1, 1, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
.snackbar {
  width: 250px;
  padding: 16px;
  margin-left: -141px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  position: fixed;
  z-index: 10;
  left: 50vw;
  top: 30px;
  font-size: 17px;
}
</style>
