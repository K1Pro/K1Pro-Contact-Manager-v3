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
                        <select v-if="propertyInputs.value == 'State'" :value="property[propertyInputs.value]" @change="updateProperty($event, propertyIndex, propertyInputs.value)">
                          <option value="AL">AL</option>
                          <option value="AK">AK</option>
                          <option value="AZ">AZ</option>
                          <option value="AR">AR</option>
                          <option value="CA">CA</option>
                          <option value="CO">CO</option>
                          <option value="CT">CT</option>
                          <option value="DE">DE</option>
                          <option value="DC">DC</option>
                          <option value="FL">FL</option>
                          <option value="GA">GA</option>
                          <option value="HI">HI</option>
                          <option value="ID">ID</option>
                          <option value="IL">IL</option>
                          <option value="IN">IN</option>
                          <option value="IA">IO</option>
                          <option value="KS">KS</option>
                          <option value="KY">KY</option>
                          <option value="LA">LA</option>
                          <option value="ME">ME</option>
                          <option value="MD">MD</option>
                          <option value="MA">MA</option>
                          <option value="MI">MI</option>
                          <option value="MN">MN</option>
                          <option value="MS">MI</option>
                          <option value="MO">MO</option>
                          <option value="MT">MT</option>
                          <option value="NE">NE</option>
                          <option value="NV">NV</option>
                          <option value="NH">NH</option>
                          <option value="NJ">NJ</option>
                          <option value="NM">NM</option>
                          <option value="NY">NY</option>
                          <option value="NC">NC</option>
                          <option value="ND">ND</option>
                          <option value="OH">OH</option>
                          <option value="OK">OK</option>
                          <option value="OR">OR</option>
                          <option value="PA">PA</option>
                          <option value="RI">RI</option>
                          <option value="SC">SC</option>
                          <option value="SD">SD</option>
                          <option value="TN">TN</option>
                          <option value="TX">TX</option>
                          <option value="UT">UT</option>
                          <option value="VT">VT</option>
                          <option value="VA">VA</option>
                          <option value="WA">WA</option>
                          <option value="WV">WV</option>
                          <option value="WI">WI</option>
                          <option value="WY">WY</option>
                        </select>
                        <input v-else
                            :type="propertyInputs.type" 
                            :placeholder="propertyInputs.placeholder"
                            :value="property[propertyInputs.value]"
                            @change="updateProperty($event, propertyIndex, propertyInputs.value)" />
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
    updateProperty(event, columnIndex, key) {
      const column = 'Properties';
      // prettier-ignore
      this.contacts[this.userSettings.selectedContactIndex][column][columnIndex][key] = event.target.value;
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
  padding-top: 5px;
}
.property-button{
  padding: 5px;
  width: 32px;
  background-color: transparent;
  border: 0px;
  cursor: pointer;
}
.property-button:hover{
  color: DimGrey;
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
.property-grid-item4 input[type='text'],
.property-grid-item0 input[type='number'], 
.property-grid-item1 input[type='number'],
.property-grid-item2 input[type='number'],
.property-grid-item3 input[type='number'],
.property-grid-item4 input[type='number'],
.property-grid-item0 select, 
.property-grid-item1 select,
.property-grid-item2 select,
.property-grid-item3 select,
.property-grid-item4 select {
  border-style: solid;
  border-color: black;
  border-top: 2px;
  border-right: 0px;
  border-bottom: 2px;
  border-left: 0px;
  padding: 5px;
  width: 100%;
  height: 100%;
}
.property{
    text-align: left;
}
`
    );
  },
};
