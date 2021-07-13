import React, { Component } from 'react';
import FloatingInput from '../../shared/FloatingTextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  View,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
  Keyboard, KeyboardAvoidingView
} from 'react-native';
import { Label } from 'native-base';
import { RadioButton } from 'react-native-paper';
import OTPTextView from 'react-native-otp-textinput';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Actions } from 'react-native-router-flux';
import ContinueButton from '../../shared/Button';
import { Text, MediumBoldText, BoldText } from '../../shared/Text';
import { AlertClass } from '../../shared/CustomAlert';
export default class PersonalDetailsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CAddress: '',
      CName: '',
      CEmail: '',
      isShowCompanyAddress: false,
      companyAddressAutoFoucs: false,
      isEmptyViewShow: false,
      viewContainerStyle: { flex: 1 },
      emptyViewFlex: 3,
      isKeyboardActive: false,
      companyAddressLabel: 'Company Address',
      showEmailAlert: false,
      labelVisible: false,
      checked: 'first',
      DefaultCODEColor: 'gray',
      CODETextInputLayOutColor: '#4b230d',
      isCODEManualEntry: false,
      NCODE: '',
    };
  }
  componentDidMount = () => {
    var isApplyKeyboardView =
      Dimensions.get('window').height > 684 ? false : true;
    if (isApplyKeyboardView) {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this._keyboardDidShow,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this._keyboardDidHide,
      );
    }
  };
  _keyboardDidHide = () => {
    this.setState({
      isEmptyViewShow: false,
      viewContainerStyle: { flex: 1 },
      emptyViewFlex: 3,
      isKeyboardActive: false,
    });
  };
  _keyboardDidShow = () => {
    this.setState({
      isEmptyViewShow: true,
      isKeyboardActive: true,
    });
  };
  _handleOnGoogleSearchOnFoucs = isFocused => {
    var isApplyKeyboardView =
      Dimensions.get('window').height > 684 ? false : true;
    if (isApplyKeyboardView) {
      if (this.state.isKeyboardActive) {
        this.setState({
          isEmptyViewShow: true,
          viewContainerStyle: { flex: 1 },
          emptyViewFlex: 3,
          isShowCompanyAddress: true,
          companyAddressAutoFoucs: true,
          companyAddressLabel: '',
        });
      } else if (isFocused) {
        this.setState({
          isEmptyViewShow: true,
          viewContainerStyle: { flex: 0.8, marginTop: 40 },
          emptyViewFlex: 1.5,
          isShowCompanyAddress: true,
          companyAddressLabel: '',
        });
      } else {
        if (this.state.CAddress !== '') {
          this.setState({ isShowCompanyAddress: true, companyAddressLabel: '' });
        }
        this.setState({
          isEmptyViewShow: false,
          viewContainerStyle: { flex: 1 },
          emptyViewFlex: 3,
          companyAddressLabel: 'Company Address',
          isShowCompanyAddress: false,
        });
      }
    }
  };
  componentWillUnmount() {
    var isApplyKeyboardView =
      Dimensions.get('window').height > 684 ? false : true;
    if (isApplyKeyboardView) {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
  }
  _handleTextType(text) {
    var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (format.test(text)) {
      Alert.alert('Special characters are not allowed');
    } else {
      this.setState();
    }
  }
  getButtonCompany = () => {
    var flag = false;
    if (
      this.state.CName !== '' &&
      this.state.CEmail !== '' &&
      this.state.CAddress !== ''
    ) {
      flag = false;
    } else {
      flag = true;
    }
    return flag;
  };
  getStyleCompany = () => {
    if (
      this.state.CName !== '' &&
      this.state.CEmail !== '' &&
      this.state.CAddress !== ''
    ) {
      return styles.activeStyle;
    } else {
      return styles.inactiveStyle;
    }
  };
  validate = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      this.setState({ CEmail: text });
      return false;
    } else {
      this.setState({ CEmail: text });
      return true;
    }
  };
  _handleNavigateToSelectBusinessCard = () => {
    if (this.validate(this.state.CEmail)) {
      const { UserDetails } = this.props;
      UserDetails.CompanyName = this.state.CName;
      UserDetails.CompanyEmail = this.state.CEmail;
      UserDetails.CompanyAddress = this.state.CAddress;
      Actions.selectBusinessCard({ UserDetails: UserDetails });
    } else {
      this.setState({ showEmailAlert: true });
    }
  };
  _handleCorporateCodeTextChange = text => {
    this.setState({
      isCODEManualEntry: true,
      NCODE: text,
      CODETextInputLayOutColor: '#4b230d',
    });
  };
  render() {
    var labelCompanyAddressStyle = this.state.isShowCompanyAddress ? 0 : 20;
    var btmWidthCompanyDetails = this.state.isShowCompanyAddress ? 0 : 1;
    return (
      <View style={[this.state.viewContainerStyle, { backgroundColor: '#f5f6fa', flex: 1 }]}>
        <View style={{ flex: 1 }}>
          <Image
            style={{ alignSelf: 'center', marginTop: 20 }}
            source={require('../../Images/newlogo.png')}
          />
          <ImageBackground
            style={styles.curveShape}
            source={require('../../BottomTabImages/curve1.png')}
          />
        </View>
        <View style={{ marginTop: 60 }}>
          <ImageBackground
            style={{ width: '100%', height: 71 }}
            source={require('../../Images/topshape.png')}>
            <MediumBoldText style={styles.textEnterYourDetails}>
              Enter Your Company Details
            </MediumBoldText>
          </ImageBackground>
        </View>
        <View style={styles.textView}>

          <KeyboardAwareScrollView
            enableOnAndroid
            enableAutomaticScroll
            keyboardOpeningTime={0}
            keyboardShouldPersistTaps='always'
            automaticallyAdjustContentInsets={false}
            extraScrollHeight={100}
            //style={{ backgroundColor: '#b6e7ec', flex: 4 }}
          >

            <View style={{ flex: 3.2, justifyContent: 'space-between', backgroundColor: '#b6e7ec' }}>
              <View
                style={{
                  flex: 1,
                  marginLeft: 40,
                  marginRight: 40,
                }}>
                <View style={{ marginBottom: 10 }}>
                  <FloatingInput
                    borderEnable={true}
                    placeholder="Company Name"
                    maxLength={30}
                    onChangeText={value => {
                      //this._handleTextType(value);
                      this.setState({ CName: value });
                    }}
                    value={this.state.MobileNumber}
                  />
                </View>
                <View style={{ marginBottom: 10 }}>
                  <FloatingInput
                    borderEnable={true}
                    placeholder="Company Email"
                    onChangeText={value => {
                      //this._handleTextType(value);
                      this.setState({ CEmail: value });
                    }}
                    value={this.state.MobileNumber}
                  />
                </View>
                <View
                  style={[
                    styles.viewLabelCompanyDetails,
                    // {borderBottomWidth: btmWidthCompanyDetails},
                  ]}>
                  {this.state.isShowCompanyAddress ? (
                    <View
                      style={[
                        styles.touchableOpacityCompanyAddress,
                        { marginTop: labelCompanyAddressStyle },
                      ]}>
                      <Label style={[styles.floatingstyle]}>
                        {'Company Address'}
                      </Label>
                    </View>
                  ) : null}
                  {/* <GooglePlacesAutocomplete
                    placeholder={this.state.companyAddressLabel}
                    placeholderTextColor="#6e8f94"
                    minLength={2} // minimum length of text to search
                    autoFocus={this.state.companyAddressAutoFoucs}
                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                    keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                    listViewDisplayed="false" // true/false/undefined
                    fetchDetails={true}
                    renderDescription={row => row.description} // custom description render
                    onPress={_data => {
                      this.setState({CAddress: _data.description});
                    }}
                    getDefaultValue={() => ''}
                    query={{
                      // available options: https://developers.google.com/places/web-service/autocomplete
                      key: 'AIzaSyDEc6y2PP50c3529HoVRWY5wru5wLE_6hY',
                      language: 'en', // language of the results
                      types: 'geocode', // default: 'geocode'
                    }}
                    // textInputProps={{
                    //   onFocus: () => this._handleOnGoogleSearchOnFoucs(true),
                    //   onBlur: () => this._handleOnGoogleSearchOnFoucs(false),
                    // }}
                    styles={{
                      textInputContainer:
                        styles.CompanyAddressTextInputContainer,
                      textInput: styles.CompanyAddressTextInput,
                      description: styles.CompanyAddressTextInputDescription,
                    }}
                  /> */}
                  {this.state.labelVisible && (
                    <View style={{ bottom: 5 }}>
                      <Label style={[styles.floatingstyle2]}>
                        {'Company Address'}
                      </Label>
                    </View>
                  )}
                  <GooglePlacesAutocomplete
                    placeholder={this.state.companyAddressLabel}
                    placeholderTextColor="#6e8f94"
                    minLength={2} // minimum length of text to search
                    autoFocus={this.state.companyAddressAutoFoucs}
                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                    keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                    listViewDisplayed="false" // true/false/undefined
                    fetchDetails={true}
                    renderDescription={row => row.description} // custom description render
                    onPress={_data => {
                      this.setState({ CAddress: _data.description });
                    }}
                    getDefaultValue={() => ''}
                    query={{
                      // available options: https://developers.google.com/places/web-service/autocomplete
                      key: 'AIzaSyDEc6y2PP50c3529HoVRWY5wru5wLE_6hY',
                      language: 'en', // language of the results
                      types: 'geocode', // default: 'geocode'
                    }}
                    textInputProps={{
                      onChangeText: text => {
                        this.setState({ CAddress: text });
                        console.log("CAddress", text)
                      },
                      onFocus: () => this.setState({ labelVisible: true, companyAddressLabel: '' })
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
              </View>
              <View style={{ flexDirection: 'row', marginLeft: 40, marginRight: 40 }}>
                <Text style={{ padding: 10 }}>Do you have Corporate Account </Text>
                <View style={{ flexDirection: "column" }}>
                  <View style={{ flexDirection: "row" }}>
                    <RadioButton
                    // value="first"
                    // status={checked === 'first' ? 'checked' : 'unchecked'}
                    // onPress={() => {
                    //   this.setState({ checked: 'first' });
                    // }}
                    />
                    <Text style={{ top: 8, fontSize: 13 }}>YES</Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <RadioButton
                    // value="second"
                    // status={checked === 'second' ? 'checked' : 'unchecked'}
                    // onPress={() => {
                    //   this.setState({ checked: 'second' });
                    // }}
                    />
                    <Text style={{ top: 10, fontSize: 13 }}>NO</Text>
                  </View>
                </View>
              </View>
              <View style={{ marginBottom: 15, marginLeft: 40, marginRight: 40 }}>
                <FloatingInput
                  borderEnable={true}
                  placeholder="Enter Corporate Key"
                  maxLength={30}
                  onChangeText={value => {
                    //this._handleTextType(value);
                    this.setState({ CorporateKey: value });
                  }}
                  value={this.state.MobileNumber}
                />
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 40, marginRight: 40 }}>
                <Text style={{ padding: 10 }}>Enter Corporate Code</Text>
                <OTPTextView
                  accessibilityLabel="corporateCode"
                  containerStyle={styles.textInputContainer}
                  handleTextChange={text => this._handleCorporateCodeTextChange(text)}
                  textInputStyle={styles.roundedTextInput}
                  inputCount={6}
                  offTintColor={this.state.DefaultCODEColor}
                  tintColor={this.state.CODETextInputLayOutColor}
                //defaultValue={OTP}
                />
              </View>
            </View>
            <View style={styles.bottomButton}>
              <ContinueButton
                buttonColor={this.getStyleCompany()}
                buttonTitle={'Continue'}
                isDisabled={this.getButtonCompany()}
                onButtonPress={() =>
                  this._handleNavigateToSelectBusinessCard()
                }
              />
            </View>

            {this.state.isEmptyViewShow ? (
              <View style={{ flex: this.state.emptyViewFlex }} />
            ) : null}
            <AlertClass
              AlertMessage={'Invalid Email'}
              OkButtonText={'OK'}
              // CancelButtonText={'Cancel'}
              showAlert={this.state.showEmailAlert}
              onOkPress={() => {
                // Actions.startPage();
                this.setState({ showEmailAlert: false });
              }}
              onAlertClose={() => this.setState({ showEmailAlert: false })}
              Height={100}
            />

          </KeyboardAwareScrollView>

        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewHeight: { marginTop: 10 },
  continueText: { color: 'white', fontSize: 15 },
  viewFlex: { flex: 1 },
  imageAlign: { alignSelf: 'center' },
  continueButtonAlign: { alignSelf: 'center' },
  imageBackground: { width: '100%', height: '100%' },
  textEnterYourDetails: {
    flex: 1,
    fontSize: 20,
    color: '#000',
    paddingTop: 30,
    alignSelf: 'center',
  },
  viewLabelCompanyDetails: {
    flexDirection: 'column',
    flex: 1,
    borderBottomColor: '#6e8f94',
    paddingVertical: 5,
    marginHorizontal: 6,
    marginBottom: 10,
  },
  floatingstyle: {
    marginLeft: 2,
    fontSize: 15,
    color: '#6e8f94',
  },
  floatingstyle2: {
    marginLeft: 2,
    fontSize: 15,
    color: '#84aaae',
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 300,
    marginBottom: 10,
    height: 45,
  },
  activeStyle: {
    backgroundColor: '#08a0af',
  },
  inactiveStyle: {
    backgroundColor: '#dcdcdc',
  },
  bottomButton: {
    flex: 0.8,
    marginTop: 10,
    //bottom: 10
  },
  textView: {
    backgroundColor: '#b6e7ec',
    flex: 4,
  },
  curveShape: {
    width: 32,
    height: 95,
    position: 'absolute',
    right: 0,
    top: 70,
  },
  CompanyAddressTextInputContainer: {
    height: 38,
    //borderBottomColor: '#6e8f94',
    // borderBottomWidth: 1,
    // borderTopWidth: 0,
    backgroundColor: '#b6e7ec',
  },
  CompanyAddressTextInput: {
    backgroundColor: '#b6e7ec',
    right: 1,
    borderBottomColor: '#6e8f94',
    borderBottomWidth: 1,
    fontSize: 15,
    // fontWeight:'600'
  },
  CompanyAddressTextInputDescription: {
    fontWeight: 'bold',
    backgroundColor: '#b6e7ec',
    marginVertical: 7,
    marginLeft: 8,
    paddingVertical: 5,
    borderBottomColor: '#6e8f94',
    borderBottomWidth: 0.2,
  },
  touchableOpacityCompanyAddress: {
    marginLeft: 5,
  },
  textInputContainer: {
    marginBottom: 15,
  },
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: 3,
    height: 40,
    width: 40,
    //borderBottomWidth: 4,
    margin: 5,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
});
