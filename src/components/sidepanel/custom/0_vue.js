export default {
  name: 'Custom 0',

  template: /*html*/ `
        <div class='custom-0'>
            Policy Info Test
            {{ userData.AppPermissions.ContactManager[0] }}
            {{ accountSettings }}
        </div>
    `,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'userData',
      'accountSettings',
    ]),
  },

  mounted() {
    style(
      'custom-0',
      /*css*/ `
  .custom-0 {}
        `
    );
  },
};
