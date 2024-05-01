// import example from './components/example_vue.js';

export default {
  name: 'Properties',

  template: /*html*/ `
        <div class='properties'>
            <div v-for="(property, propertyIndex) in contacts[userSettings.selectedContactIndex]?.Properties">
                <div class="property" v-for="(propertyInfo, propertyType) in property">
                    <div>{{ propertyType }}</div>
                    <div v-for="propertyInputs in accountSettings.contactInfo.keys.Properties[propertyType]">
                        <input 
                            :type="propertyInputs.type" 
                            :placeholder="propertyInputs.placeholder"
                            v-model="contacts[userSettings.selectedContactIndex].Properties[propertyIndex][propertyType][propertyInputs.value]" />
                    </div>
                </div>
                <template v-if="propertyIndex === contacts[userSettings.selectedContactIndex]?.Properties.length - 1">
                    <br />
                    <button>Add property</button>
                    <hr>
                </template>
            </div>
        </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'msg',
      'accountSettings',
      'userSettings',
      'endPts',
      'contacts',
    ]),
  },

  //   components: {
  //     example,
  //   },

  //   props: [''],

  //   emits: [''],

  //   data() {
  //     return {};
  //   },

  //   methods: {},

  mounted() {
    style(
      'properties',
      /*css*/ `
.properties{}
.property{
    text-align: left;
}
`
    );
  },
};
