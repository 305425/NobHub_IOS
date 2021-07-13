import React, { Component } from 'react';
import { View, Switch, TextInput, Image, Text, ScrollView, KeyboardAvoidingView } from 'react-native';
//import {Text} from '../../shared/Text';
import { styles } from './Personal.styles';
import FloatingInput from '../../shared/FloatingTextInput';
import { Facebook, Twitter, LinkedIn, SkypeIcon } from '../../shared/Icon';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { CommonStyles } from '../../shared/Constants';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';
import instagramIcon from '../../Images/instagram.png';
import { EventRegister } from 'react-native-event-listeners';
import Textarea from 'react-native-textarea';

export default class Personal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      googleAddressEnabled: false,
      textFieldEnabled: false,
      userStory: this.props.userProfile.story == null ||
        this.props.userProfile.story === 'null'
        ? ''
        : this.props.userProfile.story
    }
  }
  componentWillMount() {
    this.listener = EventRegister.addEventListener('editPersonal', (data) => {
      if (data) {
        this.setState({ textFieldEnabled: true })
      }
      else {
        this.setState({ textFieldEnabled: false })
      }
      // console.log("isPersonalProfileEditEabled",data)
    })
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener)
  }
  _handleOnChange = (id, value) => {
    const { onChangeHandler } = this.props;
    if (id === 'Story') {
      onChangeHandler(id, value);
      this.setState({ userStory: value })
    } else {
      onChangeHandler(id, value);
    }
  };
  _handleGetDefaultValue = () => {
    const { userProfile } = this.props;
    if (userProfile.address == null) {
      return '';
    } else {
      return userProfile.address;
    }
  };
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
  render() {
    const {
      userProfile,
      objectElements,
      toggleEmail,
      toggleHome,
      toggleAddres,
      toggleFacebook,
      toggleTwitter,
      toggleLinkedin,
      isPersonalProfileEditEabled,
      toggleSkype,
    } = this.props;
    console.log("PersonalProfile", userProfile)
    return (
      <View style={styles.viewFlex1}>
        <View style={styles.scrollviewstyle}>
          <View style={{ margin: 10 }} >
            <Text style={{ color: "#a1b2b6", fontSize: 15, marginVertical:5 }}>Your Story (Optional)</Text>
            <Textarea
              containerStyle={{
                flex: 1,
                height: 100,
                //backgroundColor: '#F5FCFF',
                borderColor: 'gray',
                borderWidth: 1,
              }}
              style={{
                textAlignVertical: 'top',  // hack android
                fontSize: 15,
                color: '#333',
                //backgroundColor: "#f4f6f9"
              }}
              //onFocus={this.onFocusChange}
              onChangeText={value => this._handleOnChange('Story', value)}
              value={this.state.userStory}
              maxLength={500}
              numberOfLines={20}
              multiline={true}
              editable={isPersonalProfileEditEabled ? true : false}
              fontSize={16}
              //blurOnSubmit={true}
              //placeholder={"Type something"}
              placeholder={"Tell your story to people what you are offering or seeking ...."}
              placeholderTextColor={'#a1b2b6'}
              //placeholderTextColor={'grey'}
              underlineColorAndroid={'transparent'}
            />
          </View>
          <View style={styles.viewMultipleElementsInRow1}>
            <View style={styles.viewFlex1}>
              <FloatingInput
                borderEnable={false}
                placeholder="Cell Phone"
                value={
                  userProfile.mobile == null || userProfile.mobile === 'null'
                    ? ''
                    : userProfile.mobile
                }
                isDisabled={true}
                labelStyle={styles.labelTextColor}
              />
            </View>
            <View style={styles.viewFlex1}>
              <FloatingInput
                borderEnable={false}
                placeholder="Home Phone"
                onChangeText={value => {
                  this._handleOnChange('Home', value);
                }}
                value={
                  userProfile.homephone == null ||
                    userProfile.homephone === 'null'
                    ? ''
                    : userProfile.homephone
                }
                labelStyle={styles.labelTextColor}
                isDisabled={!isPersonalProfileEditEabled}
                keyboardType={'phone-pad'}
                maxLength={10}
              />
            </View>
            <View>
              <Switch
                trackColor={{ true: CommonStyles.appColor, false: 'grey' }}
                thumbColor={'#ffffff'}
                onValueChange={toggleHome}
                value={
                  (userProfile.homephone == null || userProfile.homephone === 'null')
                    ? false
                    : objectElements.HomePhoneElem.length != 0
                      ? objectElements.HomePhoneElem[0].cardelElements.isShow
                      : false

                }
              />
            </View>
          </View>
          <View style={styles.viewMultipleElementsInRow}>
            <View style={styles.viewPersonalEmail}>
              <View style={styles.viewFlex2}>
                <FloatingInput
                  borderEnable={false}
                  placeholder="Personal Email"
                  onChangeText={value => {
                    this._handleOnChange('Email', value);
                  }}
                  value={
                    userProfile.email == null || userProfile.email === 'null'
                      ? ''
                      : userProfile.email
                  }
                  labelStyle={styles.labelTextColor}
                  isDisabled={!isPersonalProfileEditEabled}
                />
              </View>
              <View style={styles.viewElementsSwitch}>
                <Switch
                  trackColor={{ true: CommonStyles.appColor, false: 'grey' }}
                  thumbColor={'#ffffff'}
                  onValueChange={toggleEmail}
                  value={
                    userProfile.email == null || userProfile.email === 'null'
                      ? false
                      : objectElements.EmailElem.length != 0
                        ? objectElements.EmailElem[0].cardelElements.isShow
                        : false
                  }
                />
              </View>
            </View>
            {/* <View style={styles.viewFlex1}>
                <FloatingInput
                  placeholder="Job Title"
                  onChangeText={value => {
                    this._handleOnChange('JobTitle', value);
                  }}
                  value={userProfile.title}
                  labelStyle={styles.labelTextColor}
                  isDisabled={!isPersonalProfileEditEabled}
                />
              </View> */}
          </View>
          <View style={styles.addressMultipleElementsInRow}>
            <View style={styles.viewFlex2}>
              {isPersonalProfileEditEabled && this.state.textFieldEnabled === true ? (
                <View style={{ backgroundColor: '#f4f6f9' }}>
                  {/* <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 15,
                        color: '#98a9ac',
                      }}>
                      Address123
                    </Text> */}
                  {/* <GooglePlacesAutocomplete
                      placeholder={'Add Address'}
                      placeholderTextColor="#6e8f94"
                      minLength={2}
                      returnKeyType={'search'}
                      keyboardAppearance={'light'}
                      listViewDisplayed={false}
                      fetchDetails={true}
                      renderDescription={row => row.description}
                      keyboardShouldPersistTaps={'handled'}
                      onPress={_data => {
                        this._handleOnAddressSelect(_data.description, '1');
                      }}
                      textInputProps={{
                        onChangeText: text => {
                          this._handleOnAddressSelect(text, '1');
                        },
                      }}
                      getDefaultValue={() => this._handleGetDefaultValue()}
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
                    /> */}
                  {/* </View> */}
                  <FloatingInput
                    borderEnable={false}
                    placeholder="Address"
                    //onChangeText={value => {
                    //this._handleOnChange('Address', value);
                    //}}
                    onFocus={() => this.setState({ googleAddressEnabled: true, textFieldEnabled: false })}
                    value={
                      userProfile.address == null ||
                        userProfile.address == 'null'
                        ? ''
                        : userProfile.address.split("////")[0]
                    }
                    labelStyle={styles.labelTextColor}
                    editable={false}
                  // isDisabled={!isPersonalProfileEditEabled}
                  />
                </View>
              ) : (isPersonalProfileEditEabled && !this.state.textFieldEnabled && this.state.googleAddressEnabled) ? (
                <View style={{ backgroundColor: '#f4f6f9' }}>
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 15,
                      color: '#98a9ac',
                    }}>
                    Address
                  </Text>
                  <GooglePlacesAutocomplete
                    //placeholder={'Add Address'}
                    placeholderTextColor="#6e8f94"
                    minLength={2}
                    returnKeyType={'search'}
                    // keyboardAppearance={'light'}
                    listViewDisplayed={false}
                    fetchDetails={true}
                    autoFocus={true}
                    renderDescription={row => row.description}
                    // keyboardShouldPersistTaps={'handled'}
                    onPress={(_data, details = null)=> {
                      console.log("data=>>", _data.description +"details",details.geometry.location)
                       this._handleOnAddressSelect(_data.description, details.geometry.location.lat, details.geometry.location.lng, '1');
                      this.setState({ googleAddressEnabled: false, textFieldEnabled: true })
                    }}
                    textInputProps={{
                      onChangeText: text => {
                        this._handleOnAddressSelect(text, null, null,'1');
                      },
                    }}
                    getDefaultValue={() => this._handleGetDefaultValue()}
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
                //   borderEnable={false}
                //   placeholder="Address"
                //   //onChangeText={value => {
                //   //this._handleOnChange('Address', value);
                //   //}}
                //   value={
                //     userProfile.address == null ||
                //     userProfile.address == 'null'
                //       ? ''
                //       : userProfile.address
                //   }
                //   labelStyle={styles.labelTextColor}
                //   isDisabled={!isPersonalProfileEditEabled}
                // />
                <View>
                  <Text style={{ color: "#98a9ac", marginLeft: 15, fontSize: 15 }}>Address</Text>
                  <Text numberOfLines={1} style={{ color: "#000", fontSize: 15, marginVertical: 5, marginLeft: 20 }}>{
                    userProfile.address == null ||
                      userProfile.address == 'null'
                      ? ''
                      : userProfile.address.split("////")[0]
                  }</Text>
                </View>
              )}
            </View>
            <View style={styles.viewElementsSwitch}>
              <Switch
                trackColor={{ true: CommonStyles.appColor, false: 'grey' }}
                thumbColor={'#ffffff'}
                onValueChange={toggleAddres}
                value={
                  userProfile.address == null || userProfile.address == 'null' || userProfile.address == ' '
                    ? false
                    : objectElements.AddresElem.length != 0
                      ? objectElements.AddresElem[0].cardelElements.isShow
                      : false
                }
              />
            </View>
          </View>
          <View style={styles.viewSocialMedia}>
            <View style={styles.viewSocialIcon}>
              <Facebook style={styles.iconFacebook} />
            </View>
            <View style={styles.viewSocialMediaText}>
              <TextInput
                style={{ color: "black", fontSize: 15 }}
                value={
                  userProfile.facebook == null ||
                    userProfile.facebook === 'null'
                    ? 'www.facebook.com'
                    : userProfile.facebook
                }
                onChangeText={value => {
                  this._handleOnChange('Facebook', value);
                }}
                editable={isPersonalProfileEditEabled}
              />
            </View>
            <View style={styles.viewSwitchSocialIcon}>
              <Switch
                trackColor={{ true: CommonStyles.appColor, false: 'grey' }}
                thumbColor={'#ffffff'}
                onValueChange={toggleFacebook}
                value={
                  userProfile.facebook == null ||
                    userProfile.facebook === 'null'
                    ? false
                    : objectElements.FbElem.length != 0
                      ? objectElements.FbElem[0].cardelElements.isShow
                      : false
                }
              />
            </View>
          </View>
          <View style={styles.viewSocialMedia}>
            <View style={styles.viewSocialIcon}>
              {/* <SkypeIcon style={styles.iconTwitter} /> */}
              <Image source={instagramIcon} style={{ height: 30, width: 30 }} />
            </View>
            <View style={styles.viewSocialMediaText}>
              <TextInput
                // style={{top: -10}}
                style={{ color: "black", fontSize: 15 }}
                value={
                  userProfile.skype == null || userProfile.skype == 'null'
                    ? 'www.instagram.com'
                    : userProfile.skype
                }
                onChangeText={value => {
                  this._handleOnChange('Skype', value);
                }}
                editable={isPersonalProfileEditEabled}
              />
            </View>
            <View style={styles.viewSwitchSocialIcon}>
              <Switch
                trackColor={{ true: CommonStyles.appColor, false: 'grey' }}
                thumbColor={'#ffffff'}
                onValueChange={toggleSkype}
                value={
                  userProfile.skype == null || userProfile.skype == 'null'
                    ? false
                    : objectElements.SkypeElem.length != 0
                      ? objectElements.SkypeElem[0].cardelElements.isShow
                      : false
                }
              />
            </View>
          </View>
          <View style={styles.viewSocialMedia}>
            <View style={styles.viewSocialIcon}>
              <Twitter style={styles.iconTwitter} />
            </View>
            <View style={styles.viewSocialMediaText}>
              <TextInput
                style={{ color: "black", fontSize: 15 }}
                // style={{top: -10}}
                value={
                  userProfile.twitter == null ||
                    userProfile.twitter === 'null'
                    ? 'www.twitter.com'
                    : userProfile.twitter
                }
                onChangeText={value => {
                  this._handleOnChange('Twitter', value);
                }}
                editable={isPersonalProfileEditEabled}
              />
            </View>
            <View style={styles.viewSwitchSocialIcon}>
              <Switch
                trackColor={{ true: CommonStyles.appColor, false: 'grey' }}
                thumbColor={'#ffffff'}
                onValueChange={toggleTwitter}
                value={
                  userProfile.twitter == null ||
                    userProfile.twitter === 'null'
                    ? false
                    : objectElements.TwitterEle.length != 0
                      ? objectElements.TwitterEle[0].cardelElements.isShow
                      : false
                }
              />
            </View>
          </View>
          <View style={styles.viewSocialMedia}>
            <View style={styles.viewSocialIcon}>
              <LinkedIn LinkedIn style={styles.iconLinkedIn} />
            </View>
            <View style={styles.viewSocialMediaText}>
              <TextInput
                style={{ color: "black", fontSize: 15 }}
                // style={{top: -10}}
                value={
                  userProfile.linkedin == null ||
                    userProfile.linkedin === 'null'
                    ? 'www.linkedin.com'
                    : userProfile.linkedin
                }
                onChangeText={value => {
                  this._handleOnChange('LinkedIn', value);
                }}
                editable={isPersonalProfileEditEabled}
              />
            </View>
            <View style={styles.viewSwitchSocialIcon}>
              <Switch
                trackColor={{ true: CommonStyles.appColor, false: 'grey' }}
                thumbColor={'#ffffff'}
                onValueChange={toggleLinkedin}
                value={
                  userProfile.linkedin == null ||
                    userProfile.linkedin === 'null'
                    ? false
                    : objectElements.LinkedinElem.length != 0
                      ? objectElements.LinkedinElem[0].cardelElements.isShow
                      : false
                }
              />
            </View>
          </View>

          {/* {isPersonalProfileEditEabled ? (
              <View style={styles.viewUpdateButton}>
                <UpdateButton
                  buttonColor={{backgroundColor: '#08a0af'}}
                  buttonTitle={'Update'}
                  isDisabled={false}
                  onButtonPress={updateUserPersonalProfile}
                />
              </View>
            ) : null} */}
        </View>
      </View>
    );
  }
}