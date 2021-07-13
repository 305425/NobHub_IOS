import React, { Component } from 'react';
import { View, Switch, TouchableOpacity, Text } from 'react-native';
import { styles } from './Business.styles';
import FloatingInput from '../../shared/FloatingTextInput';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Autocomplete from 'react-native-autocomplete-input';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';
//import {Text} from '../../shared/Text';
import { CommonStyles } from '../../shared/Constants';
import ServiceCalls from '../../Services/APICalls';
import { DropDownIcon } from '../../shared/Icon';
import { EventRegister } from 'react-native-event-listeners';

export default class Personal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ProfessionsList: [],
      Profession: '',
      isIndustryFocused: false,
      isShowIndustryLabel: false,
      IndustryPlaceHolder: 'Industry',
      dropDownIconMargin: 15,
      dropDownVisible: true,
      googleAddressEnabled: false,
      textFieldEnabled: false,
    };
  }
  componentDidMount = () => {
    try {
      ServiceCalls.handleGetAllProfessions().then(response => {
        this.setState({ ProfessionsList: response });
      });
    } catch (e) {
      Alert.alert(e.message);
    }

  }
  componentWillMount() {
    this.listener = EventRegister.addEventListener('editBusiness', (data) => {
      if(data){
        this.setState({textFieldEnabled:true})
      }
      else{
        this.setState({textFieldEnabled:false}) 
      }
        console.log("isBusinessProfileEditEabled",data)
    })
}

componentWillUnmount() {
    EventRegister.removeEventListener(this.listener)
}
  _handleOnChange = (id, value) => {
    const { onChangeHandler } = this.props;
    onChangeHandler(id, value);
  };
  _handleGetDefaultValue = () => {
    const { userProfile } = this.props;
    if (userProfile.caddress == null) {
      return '';
    } else {
      return userProfile.caddress;
    }
  };
  // _handleOnAddressSelect = (value, id) => {
  //   const { OnAddressSelect } = this.props;
  //   OnAddressSelect(value, id);
  // };
  _handleOnAddressSelect = (value, latitude, longitude, id) => {
    const { OnAddressSelect } = this.props;
    let addressDetails = `${value}////${latitude}////${longitude}`
    console.log("addressDetails",addressDetails)
    if(latitude === null && longitude === null)
    {
      OnAddressSelect(value, id);
    }
   // OnAddressSelect(value, id);
   else{
       OnAddressSelect(addressDetails, id);
   }
  };
  findProfessoins(Profession) {
    if (Profession.trim === undefined || Profession === '') {
      return [];
    }
    const { ProfessionsList } = this.state;
    const regex = new RegExp(`${Profession.trim()}`, 'i');
    return ProfessionsList.filter(
      profession => profession.name.search(regex) >= 0,
    );
  }
  _handleOnIndustryTextChnage = text => {
    if (text !== '' && typeof text === 'object') {
      // this.setState({
      //   isShowIndustryLabel: true,
      //   IndustryPlaceHolder: null,
      //   dropDownIconMargin: 20,
      // });
    } else {
      this.setState({
        isShowIndustryLabel: false,
        IndustryPlaceHolder: 'Industry',
        dropDownIconMargin: 15,
      });
    }
    if (typeof text === 'string') {
      this.setState({ Profession: text });
    }
  };
  onIndustryValueChange = (item) => {
    this.setState({ Profession: item.name, dropDownVisible: true })
    this._handleOnChange('Profession', item.name)
  }
  render() {
    const {
      userProfile,
      objectElements,
      toggleCompanyWebsite,
      isBusinessProfileEditEabled,
      toggleDepartment,
      toggleExtension,
      toggleCompanyPhone,
      toggleFax,
    } = this.props;
    console.log("BusinessUserprofileData", isBusinessProfileEditEabled)
    const { Profession } = this.state;
    const Professoins = this.findProfessoins(Profession);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    return (
      <View style={styles.viewFlex1}>
        <KeyboardAvoidingScrollView keyboardShouldPersistTaps={'handled'}>
          <View style={styles.scrollviewstyle}>
            <View style={styles.viewSingleElementInRow}>
              <FloatingInput
                borderEnable={true}
                placeholder="Company Email"
                onChangeText={value => {
                  this._handleOnChange('Companyemail', value);
                }}
                value={
                  userProfile.cemail == null || userProfile.cemail === 'null'
                    ? ''
                    : userProfile.cemail
                }
                labelStyle={styles.labelTextColor}
                isDisabled={!isBusinessProfileEditEabled}
              />
            </View>
            <View style={styles.viewSingleElementInRow1}>
              {isBusinessProfileEditEabled && this.state.textFieldEnabled === true ? (
                <View style={{ backgroundColor: '#f4f6f9' }}>
                  <FloatingInput
                    borderEnable={false}
                    placeholder="Company Address"
                    // onChangeText={value => {
                    // this._handleOnChange('Companyaddress', value);
                    // }}
                    onFocus={() => this.setState({ googleAddressEnabled: true, textFieldEnabled: false })}
                    value={
                      userProfile.caddress == null ||
                        userProfile.caddress === 'null'
                        ? ''
                        : userProfile.caddress.split("////")[0]
                    }
                    labelStyle={styles.labelTextColor}
                    editable={false}
                  // isDisabled={!isBusinessProfileEditEabled}
                  />
                </View>
              ) : (isBusinessProfileEditEabled && !this.state.textFieldEnabled && this.state.googleAddressEnabled) ? (
                <View style={{ backgroundColor: '#f4f6f9' }}>
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 15,
                      color: '#98a9ac',
                    }}>
                    Company Address
                  </Text>
                  <GooglePlacesAutocomplete
                    //placeholder={''}
                    placeholderTextColor="#6e8f94"
                    minLength={2}
                    returnKeyType={'search'}
                    //  keyboardAppearance={'light'}
                    listViewDisplayed={false}
                    fetchDetails={true}
                    autoFocus={true}
                    renderDescription={row => row.description}
                    // keyboardShouldPersistTaps={'handled'}
                    autoFocus={true}
                    // onPress={_data => {
                    //   this._handleOnAddressSelect(_data.description, '2');
                    //   this.setState({ googleAddressEnabled: false, textFieldEnabled: true })
                    // }}
                    // textInputProps={{
                    //   onChangeText: text => {
                    //     this._handleOnAddressSelect(text, '2');
                    //   },
                    // }}
                    onPress={(_data, details = null)=> {
                      console.log("data=>>", _data.description +"details",details.geometry.location)
                       this._handleOnAddressSelect(_data.description, details.geometry.location.lat, details.geometry.location.lng, '2');
                      this.setState({ googleAddressEnabled: false, textFieldEnabled: true })
                    }}
                    textInputProps={{
                      onChangeText: text => {
                        this._handleOnAddressSelect(text, null, null,'2');
                      },
                    }}
                    getDefaultValue={() => this._handleGetDefaultValue()}
                    //enablePoweredByContainer={false}
                    query={{
                      key: 'AIzaSyDEc6y2PP50c3529HoVRWY5wru5wLE_6hY',
                      language: 'en',
                      types: 'geocode',
                    }}
                    suppressDefaultStyles={true}
                    styles={{
                      textInputContainer:
                        styles.CompanyAddressTextInputContainer,
                      textInput: styles.CompanyAddressTextInput,
                      description: styles.CompanyAddressTextInputDescription,
                    }}
                  />
                </View>
              ) : (
                // <FloatingInput
                // borderEnable={true}
                //   placeholder="Company Address"
                //   onChangeText={value => {
                //   this._handleOnChange('Companyaddress', value);
                //   }}
                //   value={
                //     userProfile.caddress == null ||
                //     userProfile.caddress === 'null'
                //       ? ''
                //       : userProfile.caddress
                //   }
                //   labelStyle={styles.labelTextColor}
                //   isDisabled={!isBusinessProfileEditEabled}
                // />
                <View >
                  <Text style={{ color: "#98a9ac", marginLeft: 15, fontSize: 15 }}>Company Address</Text>
                  <Text numberOfLines={1} style={{ color: "#000", fontSize: 15, marginVertical: 5, marginLeft: 15 }}>{
                    userProfile.caddress == null ||
                      userProfile.caddress == 'null'
                      ? ''
                      : userProfile.caddress.split("////")[0]
                  }</Text>
                </View>
              )}
            </View>
            <View style={styles.viewMultipleElementsInRow}>
              <View style={styles.viewFlex2}>
                <FloatingInput
                  borderEnable={false}
                  placeholder="Company website"
                  onChangeText={value => {
                    this._handleOnChange('companywebsite', value);
                  }}
                  value={
                    userProfile.website == null ||
                      userProfile.website === 'null'
                      ? ''
                      : userProfile.website
                  }
                  labelStyle={styles.labelTextColor}
                  isDisabled={!isBusinessProfileEditEabled}
                />
              </View>
              <View style={styles.viewSwitch}>
                <Switch
                  trackColor={{ true: CommonStyles.appColor, false: 'grey' }}
                  thumbColor={'#ffffff'}
                  onValueChange={toggleCompanyWebsite}
                  value={
                    userProfile.website == null ||
                      userProfile.website === 'null'
                      ? false
                      : objectElements.CompanyWebsiteEle.length != 0
                        ? objectElements.CompanyWebsiteEle[0].cardelElements.isShow
                        : false
                  }
                />
              </View>
            </View>
            <View style={styles.viewMultipleElementsInRow}>
              <View style={styles.viewFlex1}>
                {isBusinessProfileEditEabled && Professoins !== '' ? (
                  <View style={{ backgroundColor: '#f4f6f9' }}>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 15,
                        color: '#6e8f94',
                      }}>
                      Industry
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          Profession:
                            this.state.profession === undefined ||
                              this.state.profession === ''
                              ? ' '
                              : this.state.Profession,
                          isShowIndustryLabel: true,
                          dropDownVisible: false
                        })
                      }
                      style={{ top: 10, position: "absolute", alignSelf: "flex-end" }}>
                      <DropDownIcon
                        style={[
                          styles.dropDownProfession
                        ]}
                      />
                    </TouchableOpacity>
                    <Autocomplete
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={styles.professionAutoCompleteView}
                      inputContainerStyle={styles.autocompleteContainer}
                      listStyle={{ borderWidth: 0, borderColor: "transparent" }}
                      data={
                        Professoins.length === 1 && comp(Profession, Professoins[0].name)
                          ? []
                          : Professoins
                      }
                      defaultValue={
                        userProfile.profession == null ||
                          userProfile.profession === 'null'
                          ? ''
                          : userProfile.profession
                      }
                      // onFocus={() => this._handleOnIndustryOnFoucs()}
                      // onBlur={() => this._handleOnIndustryOnFoucs()}
                      onEndEditing={text => this._handleOnIndustryTextChnage(text)}
                      scrollEnabled={true}
                      onChangeText={text => this._handleOnIndustryTextChnage(text)}
                      // placeholder="Industry"
                      placeholderTextColor="#6e8f94"
                      renderItem={({ item }) => (
                        <View style={styles.professionRender}>
                          <TouchableOpacity
                            onPress={() => this.onIndustryValueChange(item)}>
                            <View style={styles.professionTouchableView}>
                              <Text style={styles.profText} numberOfLines={2}>{item.name}</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                  </View>
                ) : (
                  <FloatingInput
                    borderEnable={false}
                    placeholder="Industry"
                    // onChangeText={value => {
                    //   this._handleOnChange('Profession', value);
                    // }}
                    value={
                      userProfile.profession == null ||
                        userProfile.profession === 'null'
                        ? ''
                        : userProfile.profession
                    }
                    labelStyle={styles.labelTextColor}
                    isDisabled={!isBusinessProfileEditEabled}
                  />
                )}
              </View>
            </View>
            <View style={styles.viewMultipleElementsInRow}>
              <View style={[styles.viewFlex1, { flexDirection: 'row' }]}>
                <View style={styles.viewFlex2}>
                  <FloatingInput
                    borderEnable={false}
                    placeholder="Department"
                    onChangeText={value => {
                      this._handleOnChange('Department', value);
                    }}
                    value={
                      userProfile.department == null ||
                        userProfile.department === 'null'
                        ? ''
                        : userProfile.department
                    }
                    labelStyle={styles.labelTextColor}
                    isDisabled={!isBusinessProfileEditEabled}
                  />
                </View>
                <View style={styles.viewSwitch}>
                  <Switch
                    trackColor={{ true: CommonStyles.appColor, false: 'grey' }}
                    thumbColor={'#ffffff'}
                    onValueChange={toggleDepartment}
                    value={
                      userProfile.department == null ||
                        userProfile.department === 'null'
                        ? false
                        : objectElements.DepartmentEle.length != 0
                          ? objectElements.DepartmentEle[0].cardelElements.isShow
                          : false
                    }
                  />
                </View>
              </View>
            </View>
            <View style={styles.viewMultipleElementsInRow}>
              <View style={styles.viewFlex1}>
                <FloatingInput
                  borderEnable={false}
                  placeholder="Company Phone"
                  maxLength={10}
                  onChangeText={value => {
                    this._handleOnChange('CompanyPhone', value);
                  }}
                  value={
                    userProfile.cmobile == null ||
                      userProfile.cmobile === 'null'
                      ? ''
                      : userProfile.cmobile
                  }
                  labelStyle={styles.labelTextColor}
                  isDisabled={!isBusinessProfileEditEabled}
                  keyboardType={'phone-pad'}
                />
              </View>
              <View style={styles.viewSwitch}>
                  <Switch
                    trackColor={{ true: CommonStyles.appColor, false: 'grey' }}
                    thumbColor={'#ffffff'}
                    onValueChange={toggleCompanyPhone}
                    value={
                      userProfile.cmobile == null || userProfile.cmobile === 'null'
                        ? false
                        : objectElements.CmobileEle.length != 0
                          ? objectElements.CmobileEle[0].cardelElements.isShow
                          : false
                    }
                  />
                </View>
              <View style={[styles.viewFlex1, { flexDirection: 'row' }]}>
                <View style={styles.viewFlex2}>
                  <FloatingInput
                    borderEnable={false}
                    placeholder="Extension"
                    maxLength={4}
                    onChangeText={value => {
                      this._handleOnChange('Extension', value);
                    }}
                    value={
                      userProfile.exten == null || userProfile.exten === 'null'
                        ? ''
                        : userProfile.exten
                    }
                    labelStyle={styles.labelTextColor}
                    isDisabled={!isBusinessProfileEditEabled}
                    keyboardType={'phone-pad'}
                  />
                </View>
                <View style={styles.viewSwitch}>
                  <Switch
                    trackColor={{ true: CommonStyles.appColor, false: 'grey' }}
                    thumbColor={'#ffffff'}
                    onValueChange={toggleExtension}
                    value={
                      userProfile.exten == null || userProfile.exten === 'null'
                        ? false
                        : objectElements.ExtensionEle.length != 0
                          ? objectElements.ExtensionEle[0].cardelElements.isShow
                          : false
                    }
                  />
                </View>
              </View>
            </View>
            <View style={styles.viewMultipleElementsInRow}>
              <View style={styles.viewFlex2}>
                <FloatingInput
                  borderEnable={false}
                  placeholder="Fax Number"
                  maxLength={10}
                  onChangeText={value => {
                    this._handleOnChange('Fax', value);
                  }}
                  value={
                    userProfile.fax == null || userProfile.fax === 'null'
                      ? ''
                      : userProfile.fax
                  }
                  labelStyle={styles.labelTextColor}
                  isDisabled={!isBusinessProfileEditEabled}
                  keyboardType={'phone-pad'}
                />
              </View>
              <View style={{ flex: 0.1, zIndex: 999, top: 10 }}>
                <Switch
                  trackColor={{ true: CommonStyles.appColor, false: 'grey' }}
                  thumbColor={'#ffffff'}
                  onValueChange={toggleFax}
                  value={
                    (userProfile.fax == null || userProfile.fax === 'null')
                      ? false
                      : (objectElements.FaxEle.length != 0
                        ? objectElements.FaxEle[0].cardelElements.isShow
                        : false)
                  }
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingScrollView>
      </View>
    );
  }
}