// import example from './components/example_vue.js';

export default {
  name: 'Properties',

  template: /*html*/ `
        <div class='properties'>
            <div v-for="(property, propertyIndex) in slctdCntct?.Properties">
                <div class="property-title-grid-container">
                  <div class="property-title"><i class="fa-solid fa-house"></i>&nbsp;{{ property.Type }}</div>
                  <button class="property-button" @click="deleteContactInfo('Properties', propertyIndex)">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
                <div class="property-grid-container">
                    <div :class="'property-grid-item' + propertyInputIndex" v-for="(propertyInputs, propertyInputIndex) in accountSettings.contactInfo.keys.Properties[property.Type]">
                        <input 
                            :type="propertyInputs.type" 
                            :placeholder="propertyInputs.placeholder"
                            :value="property[propertyInputs.value]"
                            @change="updateProperty($event, 'Properties', propertyIndex, propertyInputs.value)" />
                    </div>
                </div>
                <template v-if="propertyIndex === slctdCntct.Properties.length - 1">
                    <hr>
                </template>
            </div>
        </div>`,

  computed: {
    ...Pinia.mapWritableState(useDefaultStore, [
      'accountSettings',
      'userSettings',
      'contacts',
      'patchContactInfo',
      'deleteContactInfo',
      'slctdCntct',
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

  methods: {
    updateProperty(event, column, columnIndex, key) {
      this.contacts[this.userSettings.selectedContactIndex][column][
        columnIndex
      ][key] = event.target.value;
      this.patchContactInfo(event.target.value, column, columnIndex, key);
    },
  },

  mounted() {
    style(
      'properties',
      /*css*/ `
.properties{}
.property-title-grid-container{
  display: grid;
  grid-template-columns: calc(100% - 34px) 34px;
}
.property-title {
  padding-top: 6px;
}
.property-button{
  padding: 7px;
  width: 32px;
  background-color: transparent;
  border: 0px;
  cursor: pointer;
}
.property-grid-container {
  margin-top: 2px;
  display: grid;
  grid-template-columns: 33% 33% 33%;
  grid-template-rows: 28px 28px;
}
.property-grid-item0 {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 1;
}

.property-grid-item2 {
  grid-column-start: 1;
  grid-row-start: 2;
  grid-row-end: 2;
}
.property-grid-item0 input[type='text'], 
.property-grid-item1 input[type='text'],
.property-grid-item2 input[type='text'],
.property-grid-item3 input[type='text'],
.property-grid-item4 input[type='text'] {
  border-style: solid;
  border-color: black;
  border-top: 2px;
  border-right: 0px;
  border-bottom: 2px;
  border-left: 0px;
  padding: 6px;
  width: 100%
}
.property{
    text-align: left;
}
`
    );
  },
};
