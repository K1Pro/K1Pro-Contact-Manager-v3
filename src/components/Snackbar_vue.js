export default {
  name: 'Snackbar',

  template: /*html*/ `
    <Transition name="slide-fade">
      <div v-if="msg.snackBar && loggedIn" class="snackbar">
        {{ msg.snackBar }}
      </div>
    </Transition>
  `,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, ['msg', 'loggedIn']),
  },

  watch: {
    'msg.snackBar'() {
      setTimeout(() => {
        this.msg.snackBar = null;
      }, 3000);
    },
  },

  mounted() {
    style(
      'Snackbar',
      /*css*/ `
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
      `
    );
  },
};
