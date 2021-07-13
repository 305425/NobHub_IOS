import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {setUserProfile, clearUserProfile} from '../../state/operations';
import {connect} from 'react-redux';
import OTPTextView from 'react-native-otp-textinput';
import VerifyButton from '../Button';
import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'NobHUb.db'});
import TopBackground from '../../Account/TopBackground';
import BottomBackground from '../../Account/BottomBackground';
import {Text} from '../../shared/Text';
class OTPView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOTPManualEntry: false,
      OTPTextInputLayOutColor: '#4b230d',
      NOTP: '',
      userProfile: '',
      DefaultOTPColor: '#c5ccce',
      ButtonDisable: true,
    };
  }
  _handleOTPTextChange = text => {
    this.setState({
      isOTPManualEntry: true,
      NOTP: text,
      OTPTextInputLayOutColor: '#4b230d',
    });
  };
  _handleOTPViewRendering = IsCallRegistration => {
    var that = this;
    const {
      userData,
      Mobile,
      CountryCode,
      DialCode,
      IsFromChangeNumber,
      GeneratedOTP,
    } = this.props;
    if (IsFromChangeNumber) {
      var dataToSend = {
        MobileNumber: Mobile.replace(/ /g, ''),
        CountryCode: DialCode,
        UserId: global.LoginUserId,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Account/UpdateMobileNumber', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          this.props.clearUserProfile();
          this.props.setUserProfile(responseJson);
          global.CountryCode = CountryCode;
          global.LoginUserId = global.LoginUserId;
          global.LoginUserName = global.LoginUserName;
          global.PhoneNumber = global.PhoneNumber;
          try {
            db.transaction(() => {
              db.transaction(function(tx) {
                tx.executeSql(
                  'UPDATE CurrentData SET user_id =?, country_code=?',
                  [userData.guid, CountryCode],
                  () => {
                    that.UpdateUserFCMToken();
                  },
                );
              });
            });
          } catch (e) {}
          // if (GeneratedOTP == this.state.NOTP) {
          //   this.setState({ButtonDisable: false});
          Actions.verifiedView({
            MobileNumber: Mobile,
            CountryCode: DialCode,
            Text1: 'Welcome back to NobHub!',
            Text2: 'Congratulations!',
            Text3: 'You have successfully migrate to your account to' + Mobile,
            Registration: false,
          });
          // } else {
          //   Alert.alert('OTP does not match');
          // }
        });
    } else {
      if (IsCallRegistration === true) {
        try {
          db.transaction(() => {
            db.transaction(function(tx) {
              tx.executeSql(
                'UPDATE CurrentData SET  country_code=?',
                [CountryCode],
                () => {
                  global.CountryCode = CountryCode;
                },
              );
            });
          });
        } catch (e) {}
        // if (GeneratedOTP == this.state.NOTP) {
        //   this.setState({ButtonDisable: false});
        Actions.verifiedView({
          MobileNumber: Mobile,
          CountryCode: DialCode,
          Text1: 'You' + "'re" + 'Verified',
          Text2: 'Welcome to NobHub!',
          Text3: 'Let' + "'s" + 'build your Profile',
          Registration: true,
        });
        // } else {
        //   Alert.alert('OTP does not match');
        // }
      } else {
        this.props.clearUserProfile();
        this.props.setUserProfile(userData);
        global.CountryCode = CountryCode;
        global.LoginUserId = userData.guid;
        global.LoginUserName = userData.name;
        global.PhoneNumber = userData.mobile;
        try {
          db.transaction(() => {
            db.transaction(function(tx) {
              tx.executeSql(
                'UPDATE CurrentData SET user_id =?, country_code=?',
                [userData.guid, CountryCode],
                () => {
                  that.UpdateUserFCMToken();
                },
              );
            });
          });
        } catch (e) {}
        Actions.myConnections();
      }
    }
  };
  UpdateUserFCMToken() {
    try {
      var dataToSend = {
        UserId: global.LoginUserId,
        FCMToken: global.LoginUserFcmToken,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/GetUserFCMToken', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(() => {})
        .catch(error => Alert.alert(error));
    } catch (e) {
      Alert.alert(e);
    }
  }
  ResendOTP() {
    this.setState({OTP: ''});
    try {
      var _randomdigit = Math.floor(1000 + Math.random() * 9000).toString();
      this.setState({OTP: _randomdigit});
      this.setState({NOTP: _randomdigit});
      // fetch(
      //   `https://api.msg91.com/api/sendhttp.php?mobiles=${
      //     this.state.MobileNumber
      //   }&authkey=115776AnHtccZdzwlB58aadd43&route=4&sender=NobHub&message=Dear User,your verification code is ${_randomdigit} Thank You,NOBHUB&country=${
      //     this.state.CountryCode
      //   }`,
      // )
      //   .then(response => response.text())
      //   .then(() => {
      //     setTimeout(
      //       () =>
      //         this.setState(function() {
      //           this.setState({OTP: _randomdigit});
      //           this.setState({NOTP: _randomdigit});
      //         }),
      //       4000,
      //     );

      //     //this.OTPView();
      //   })
      //   .catch(error => {});
    } catch (e) {
      Alert.alert(e);
    }
  }
  render() {
    const {Mobile, IsCallRegistration, GeneratedOTP} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: '#f5f6fa'}}>
        <TopBackground />
        <View style={styles.textView}>
          <View style={styles.container}>
            <Text style={styles.text}>Enter your One Time Password</Text>
            <View>
              <View style={styles.viewFlexDirection}>
                <Text style={styles.text}>Sent to {Mobile}</Text>
              </View>
              <OTPTextView
                accessibilityLabel="otpText"
                containerStyle={styles.textInputContainer}
                handleTextChange={text => this._handleOTPTextChange(text)}
                textInputStyle={styles.roundedTextInput}
                inputCount={4}
                keyboardType={'phone-pad'}
                offTintColor={this.state.DefaultOTPColor}
                tintColor={this.state.OTPTextInputLayOutColor}
                //defaultValue={OTP}
              />
              <View style={[styles.viewFlexDirection, {marginBottom: 50}]}>
                <Text style={[styles.text, {padding: 2}]}>
                  Didn't get OTP?{' '}
                </Text>
                <TouchableOpacity onPress={() => this.ResendOTP()} accessibilityLabel="resendOtp">
                  <Text style={styles.textResendOtp}>Resend OTP</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.bottomButton}>
            <VerifyButton
              accessibilityLabel="verifyLogin"
              buttonColor={styles.button}
              buttonTitle={'Verify'}
              //isDisabled={this.state.ButtonDisable}
              isDisabled={false}
              onButtonPress={() =>
                this._handleOTPViewRendering(IsCallRegistration)
              }
            />
          </View>
        </View>
        <BottomBackground />
      </View>
    );
  }
}
export const mapStateToProps = state => {
  return {
    userProfile: state.user.userProfile,
  };
};

const mapDispatchToProps = {
  setUserProfile,
  clearUserProfile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OTPView);

const styles = StyleSheet.create({
  imageBackground: {width: '100%', height: '100%'},
  container: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textResendOtp: {
    fontSize: 20,
    color: '#08a0af',
    textDecorationLine: 'underline',
    textDecorationColor: '#08a0af',
  },
  text: {
    fontSize: 20,
    color: '#000',
    padding: 20,
  },
  textInputContainer: {
    marginBottom: 20,
  },
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: 4,
  },
  button: {
    backgroundColor: '#08a0af',
  },
  viewHeight: {marginTop: 10},
  verifyText: {color: 'white', fontSize: 15},
  viewFlex: {flex: 1},
  imageAlign: {alignSelf: 'center'},
  viewFlexDirection: {flexDirection: 'row'},
  textView: {
    //width: Dimensions.get('window').width,
    //height: Dimensions.get('window').height,
    //backgroundColor: '#b6e7ec',
    flex: 3,
    marginTop: 20,
  },
  curveShape: {
    width: 32,
    height: 95,
    position: 'absolute',
    right: 0,
    top: 70,
  },
  bottomButton: {
    justifyContent: 'flex-end',
    flex: 1,
    marginBottom: 20,
  },
});
