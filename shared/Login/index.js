import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import CountryFlags from './Countries';
import {Actions} from 'react-native-router-flux';
import {DropDownIcon, Phone} from '../../shared/Icon';
import {styles} from './Login.styles';
import ServiceCalls from '../../Services/APICalls';
import FloatingTextInput from '../FloatingTextInput';
import {openDatabase} from 'react-native-sqlite-storage';
import LoginButton from '../Button';
import TopBackground from '../../Account/TopBackground';
import BottomBackground from '../../Account/BottomBackground';
import {AlertClass} from '../CustomAlert';
import {Text, MediumBoldText, BoldText} from '../../shared/Text';
import {ArrowLeft, Treedotmenu} from '../../shared/Icon';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


var db = openDatabase({name: 'NobHUb.db'});
console.disableYellowBox = true;
export default class Login extends Component {
  constructor(props) {
    super(props);
    //global.LoginUserId = 0;
    //global.LoginUserFcmToken = '';
    //global.LoginUserName = '';
    global.readOTP = '';
    global.IsNearBy = false;
    this.state = {
      MobileNumber: '',
      SelectedCcode: '',
      OTP: '',
      CountryCode: '',
      UserId: '',
      Theme: '',
      Name: '',
      ProfilePicture: '',
      ReferalCode: '',
      fcmtoken: '',
      DialCode: '',
      Cname: '',
      flag: '',
      modalVisible: false,
      phoneNumber: '',
      CountryCodedigit: '',
      CountryName: '',
      isOTPManualEntry: false,
      OTPTextInputLayOutColor: '#DEE4E7',
      userProfile: {},
      countryFlagsList: CountryFlags,
      IsCallFromRegistration: false,
      showPhoneNumberVeritfication: false,
      showAccountExistAlert: false,
      showAccountDoesnotExistAlert: false,
    };
    global.Country = this;
  }
  componentDidMount = () => {
    const {IsCallRegistration} = this.props;
    this.setState({IsCallFromRegistration: IsCallRegistration});
    try {
      var resultObject = this.search(
        global.CountryCode,
        this.state.countryFlagsList,
      );
      this.setState({
        DialCode: resultObject.dial_code.replace(/[^a-zA-Z0-9+ ]/g, ''),
      });
      this.setState({Cname: resultObject.code});
      const defaultFlag = CountryFlags.filter(
        obj => obj.name === resultObject.name,
      )[0].flag;
      this.setState({flag: defaultFlag});
    } 
    catch (e) {
     // Alert.alert(e.message);
     console.log("Error",e.message)
    }
  };
  async getCountry(country, Countrycodedigit) {
    this.setState({DialCode: Countrycodedigit});
    const countryData = await CountryFlags;
    try {
      const countryCode = await countryData.filter(
        obj => obj.name === country,
      )[0].dial_code;
      const countryFlag = await countryData.filter(
        obj => obj.name === country,
      )[0].flag;
      // Set data from user choice of country
      this.setState({phoneNumber: countryCode, flag: countryFlag});
      await this.setState({scaleCountryDialog: false});
    } catch (err) {
     // Alert.alert(err.message);
     console.log("Error",err.message)
    }
  }
  search(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].code === nameKey) {
        return myArray[i];
      }
    }
  }
  LoginClick = () => {
    const {MobileNumber, IsFromChangeNumber} = this.state;
    if (MobileNumber) {
      try {
        var Mobile = MobileNumber.replace(/ /g, '');
        var CountryCode = this.state.DialCode.replace(/ /g, '');
        ServiceCalls.handleLoginClick(Mobile, CountryCode)
          .then(response => {
            this.setState({
              userProfile: response,
            });
            this.setState({
              CountryCode: response.countryCode,
            });
            if (this.state.CountryCode == null) {
              this.setState({showAccountDoesnotExistAlert: true});
            } else {
              var _randomdigit = Math.floor(
                1000 + Math.random() * 9000,
              ).toString();
              // fetch(
              //   `http://api.msg91.com/api/sendotp.php?mobile=${Mobile}&authkey=115776AnHtccZdzwlB58aadd43&route=4&sender=NobHub&message=Dear User,your verification code is ${_randomdigit} Thank You,NOBHUB&country=${CountryCode}`,
              // )
              //   .then(response => response.text())
              //   .then(() => {
              Actions.otp({
                GeneratedOTP: _randomdigit,
                Mobile: this.state.MobileNumber,
                IsCallRegistration: this.state.IsCallFromRegistration,
                userData: this.state.userProfile,
                CountryCode: global.CountryCode,
                DialCode: this.state.DialCode,
                IsFromChangeNumber: IsFromChangeNumber,
              });
              // });
            }
          })

          .catch(error => {
            Alert.alert(error.message);
          });
      } catch (e) {
        Alert.alert(e.message);
      }
    } else {
      Alert.alert('Enter Mobile Number');
    }
  };
  renderContinueButton = ButtonText => {
    var style = styles.inactiveStyle;
    var isDisabled = true;
    if (
      this.state.MobileNumber.length < 12 ||
      this.state.MobileNumber.length === undefined
    ) {
      style = styles.inactiveStyle;
      isDisabled = true;
    } else {
      style = styles.activeStyle;
      isDisabled = false;
    }
    return (
      <LoginButton
        buttonColor={style}
        buttonTitle={ButtonText}
        isDisabled={isDisabled}
        onButtonPress={() => this._handleEnterMobileNumber(ButtonText)}
        accessibilityLabel="continueLogin"
      />
    );
  };
  _handleEnterMobileNumber(ButtonText) {
    if (ButtonText === 'Continue') {
      this.CheckMobile();
    } else {
      this.LoginClick();
    }
  }
  CheckMobile() {
    try {
      if (this.state.MobileNumber.length === 12) {
        ServiceCalls.handleRegistrationClick(this.state.MobileNumber).then(
          response => {
            var IsMobileexist = response;
            if (IsMobileexist === 'true') {
              this.setState({showAccountExistAlert: true});
            } else {
              this.setState({showPhoneNumberVeritfication: true});
            }
          },
        );
      } else {
        Alert.alert('Enter valid Mobile Number');
        this.setState({MobileNumber: 0});
      }
    } catch (e) {
      Alert.alert(e.message);
    }
  }
  onTextChange(f) {
    var r = /(\D+)/g,
      npa = '',
      nxx = '',
      last4 = '';
    f = f.replace(r, '');
    npa = f.substr(0, 3);
    nxx = f.substr(3, 3);
    last4 = f.substr(6, 4);
    f =
      npa +
      (nxx.length > 0 ? ' ' : '') +
      nxx +
      (last4.length > 0 ? ' ' : '') +
      last4;

    this.setState({
      MobileNumber: f,
    });
  }
  ConfirmClick() {
    const {IsFromChangeNumber} = this.props;
    var _randomdigit = Math.floor(1000 + Math.random() * 9000).toString();
    alert("Your OTP:"+_randomdigit)
    Actions.otp({
      GeneratedOTP: _randomdigit,
      Mobile: this.state.MobileNumber,
      IsCallRegistration: this.state.IsCallFromRegistration,
      CountryCode: global.CountryCode,
      DialCode: this.state.DialCode,
      IsFromChangeNumber: IsFromChangeNumber,
    });
  }
  render() {
    let {flag} = this.state;
    const {ButtonText, LabelText} = this.props;
    return (
      <View style={styles.viewLoginPageContainer}>
      <TopBackground />
      {LabelText =="Change phone number"&&(
            <View style={{position:"absolute",top:40, left:20}}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <View style={styles.arrowBgstyle}>
                  <ArrowLeft
                    style={{fontSize: 20, color: "#29cee1"}}
                  />
                </View>
              </TouchableOpacity>
            </View>
            )}
        <View style={styles.viewMobileNumberContainer}>
          {/* <ScrollView
            keyboardShouldPersistTaps={'handled'}
            keyboardDismissMode="on-drag"> */}
          <KeyboardAvoidingView style={styles.container}>
            {/* <View style={styles.container}> */}
            <View style={styles.textView}>
              <Phone />
              <BoldText style={styles.mobileNumberText}>{LabelText}</BoldText>
            </View>
            {LabelText =="Change phone number"?(
              <View>
              <Text style={{lineHeight:20,fontSize:12}}> Changing Your Phone number will migrate Your account to the new number </Text>
            
              <Text style={{lineHeight:20,fontSize:12}}>Before Proceeding, Please Confirm that you are able to receive SMS at your new number </Text>
              </View>
              ):null}
            <View style={[styles.flagContainer]}>
              <View style={styles.subViewFlag}>
                <TouchableOpacity
                  onPress={() =>
                    Actions.flagsList({
                      flagsList: this.state.countryFlagsList,
                    })
                  }>
                  <View style={styles.infoContainer}>
                    <Text style={styles.flagImage}>{flag}</Text>
                    <MediumBoldText
                      style={styles.countryCodeinput}
                      placeholderTextColor="#adb4bc"
                      keyboardType={'phone-pad'}
                      returnKeyType="done"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={false}
                      value={this.state.DialCode}>
                      {this.state.DialCode}
                    </MediumBoldText>
                    <DropDownIcon style={styles.iconDropDown} />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.viewMobileNumber}>
                <FloatingTextInput
                borderEnable={true}
                  maxLength={12}
                  accessibilityLabel="phoneNumber"
                  keyboardType={'numeric'}
                  // placeholder={'Mobile Number'}
                  onChangeText={value => this.onTextChange(value)}
                  value={this.state.MobileNumber}
                  textInputStyle={styles.textInputMobileNumber}
                  labelStyle={styles.labelMobileNumber}
                />
              </View>
            </View>
            {/* </View> */}
            {/* </ScrollView> */}
          </KeyboardAvoidingView>
          <View style={{flex: 1,top:50}}>
            {this.renderContinueButton(ButtonText)}
          </View>
        </View>
        {/* {LabelText =="Change phone number"&&(
            <View style={{bottom:windowHeight/1.23, right:windowWidth/2.5}}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <View style={styles.arrowBgstyle}>
                  <ArrowLeft
                    style={{fontSize: 20, color: "#008080"}}
                  />
                </View>
              </TouchableOpacity>
            </View>
            )} */}
        <View>
          <AlertClass
            AlertTitle={'Phone Number Confirmation'}
            AlertMessage={
              'We will send you a verification code to the following number \n' +
              this.state.DialCode +
              ' ' +
              this.state.MobileNumber
            }
            OkButtonText={'Confirm'}
            CancelButtonText={'Cancel'}
            showAlert={this.state.showPhoneNumberVeritfication}
            onOkPress={() => {
              this.ConfirmClick();
              this.setState({showPhoneNumberVeritfication: false});
            }}
            onAlertClose={() =>
              this.setState({showPhoneNumberVeritfication: false})
            }
            Height={180}
            accessibilityLabel="alertLogin"
          />
          <AlertClass
            AlertMessage={'Account does not exist'}
            OkButtonText={'OK'}
            CancelButtonText={'Cancel'}
            showAlert={this.state.showAccountDoesnotExistAlert}
            onOkPress={() => {
              Actions.startPage();
              this.setState({showAccountDoesnotExistAlert: false});
            }}
            onAlertClose={() =>
              this.setState({showAccountDoesnotExistAlert: false})
            }
            Height={120}
          />
          <AlertClass
            AlertTitle={'Alert!'}
            AlertMessage={'You are already Registered. Please Login'}
            OkButtonText={'OK'}
            CancelButtonText={'Cancel'}
            showAlert={this.state.showAccountExistAlert}
            onOkPress={() => {
              Actions.login1({
                IsCallRegistration: false,
                ButtonText: 'Login',
                LabelText: 'What' + "'s" + ' your phone number?',
                IsFromChangeNumber: false,
              });
              this.setState({showAccountExistAlert: false});
            }}
            onAlertClose={() => this.setState({showAccountExistAlert: false})}
            Height={120}
          />
        </View>
        <BottomBackground />
      </View>
    );
  }
}
