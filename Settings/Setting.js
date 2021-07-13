import React, { Component } from 'react';
import {
  View,
  //Text,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  Alert,
  FlatList,
  Switch,
} from 'react-native';
import { ArrowLeft, Treedotmenu } from '../shared/Icon';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { goBack } from '../Services/BackButtonServices';
import { CommonStyles } from '../shared/Constants';
import { Text, BoldText } from '../shared/Text';
import {
  PhoneIcon,
  NotificationOff,
  Feature,
  Delete,
  SignOut,
  Language,
} from '../shared/Icon';
import {
  clearUserProfile,
  setUserProfile,
  clearBusinessCardDetails,
  clearMyConnectionDetails,
} from '../state/operations';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'NobHUb.db' });
import ServiceCalls from '../Services/APICalls';
import CustomMenuIcon from '../Custom/MenuIconForHeader';
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchValue: false,
      muteNotificationValue: false,
      businessCardValue: false
    };
  }
  componentDidMount = () => {
    const { UserProfile } = this.props;
    var IsShow = UserProfile.sharecard;
    this.setState({ switchValue: IsShow, businessCardValue: IsShow });
  };
  toggleMuteNotification = value => {
    //  const {UserProfile} = this.props;
    //  let muteObject = UserProfile.isMuteNotification;
    //  if(muteObject === true){
    //   let obj = {...UserProfile,isMuteNotification:false}
    //   this.props.clearUserProfile();
    //   this.props.setUserProfile(obj);
    //   this.setState({muteNotificationValue:false})
    //  }
    //  else{
    //   let obj = {...UserProfile,isMuteNotification:true}
    //   this.props.clearUserProfile();
    //   this.props.setUserProfile(obj);
    //   this.setState({muteNotificationValue:true})
    //  }
    // console.log("UserProfile",UserProfile);
    this.setState({ muteNotificationValue: !this.state.muteNotificationValue })
  };
  toggleAllowBusinesscard = value => {
    this.setState({ businessCardValue: !this.state.businessCardValue })
    const { UserId } = this.props;
    try {
      var dataToSend = { Userid: UserId, IsShareCard: value };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/UpdateUserIsShareCard', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log("responseJson", responseJson)
          this.setState({ switchValue: responseJson.sharecard, businessCardValue: responseJson.sharecard });
          this.props.clearUserProfile();
          this.props.setUserProfile(responseJson);
        });
    } catch (e) {
      Alert.alert(e);
    }
  };
  leftArrowPress = () => {
    const { handleGoBack } = this.props;
    handleGoBack();
  };
  _handleClearLocalDB = () => {
    try {
      db.transaction(tx => {
        tx.executeSql('UPDATE CurrentData SET user_id=null', [], () => {
          ServiceCalls.handleDeleteUserFCMToken(
            global.LoginUserId,
            global.LoginUserFcmToken,
          ).then(() => {
            this.UpdaytelogoutTime();
            global.LoginUserId = 0;
            global.PersonalCoverPhoto = '';
            global.PersonalPhoto = '';
            global.BusinessCoverPhoto = '';
            global.BusinessLogo = '';
            this.props.clearUserProfile();
            this.props.clearMyConnectionDetails();
            this.props.clearBusinessCardDetails();
            Actions.startPage();
          });
        });
      });
    } catch (e) {
      Alert.alert(e);
    }
  };
  UpdaytelogoutTime() {
    ServiceCalls.UpdateLastSeenStatus('background').then(response => {
      if (response) {
      }
    });
  }
  RedirectTomenu(Value) {
    const { UserId, UserProfile } = this.props;
    if (Value === 'Premium Membership') {
      Actions.startPage();
    }
    if (Value === 'Change Number') {
      Actions.login1({
        IsCallRegistration: true,
        ButtonText: 'Continue',
        LabelText: 'Change phone number',
        IsFromChangeNumber: true,
      });
    }
    if (Value === 'Log Out') {
      this._handleClearLocalDB();
    }
    if (Value === 'Features') {
      const { UserProfile } = this.props;
      Actions.features({ userProfile: UserProfile });
    }
    if (Value === 'Language') {
      Actions.Language({ userProfile: UserProfile });
    }
    if (Value === 'Support') {
      Actions.support({ userProfile: UserProfile });
    }
    if (Value === 'About NobHub') {
      Actions.aboutNobHub({
        UserId: UserId,
      });
    }
    if (Value === 'Privacy Policy') {
      const { UserProfile } = this.props;
      Actions.privacyPolicy({
        UserId: UserId,
        userProfile: UserProfile,
      });
    }
    if (Value === 'Help') {
      Actions.help({
        UserId: UserId,
      });
    }
    if (Value === 'Delete Account') {
      Actions.DeleteAccount({ userProfile: UserProfile });
    }

    if (Value === 'Terms of Service') {
      const { UserProfile } = this.props;
      Actions.termsAndCondtitions({
        userProfile: UserProfile,
      });
    }
  }
  _handleHeaderProfileIcon = () => {
    const { UserProfile } = this.props;
    return (
      <View style={[styles.leftHeader, { borderRadius: 0, backgroundColor: '' }]}>
        <CustomMenuIcon
          menutext="Menu"
          menuStyle={styles.customMenu}
          //Menu Text Style
          textStyle={styles.textMenu}
          //Click functions for the menu items
          option1Click={() => {
            const { userProfile } = this.props;
            const UserId = userProfile.guid;
            const Mobile = userProfile.mobile;
            var CountryCode = userProfile.countryCode;
            Actions.profileBusiness({
              UserId: UserId,
              Mobile: Mobile,
              CountryCode: CountryCode,
              FirstName: userProfile.name + ' ' + userProfile.lastname,
              Title: userProfile.title,
            });
          }}
          option2Click={() => {
            Actions.businessCard({ userProfile: userProfile });
          }}
          option3Click={() => {
            Actions.myConnections();
          }}
          option4Click={() => {
            Actions.qrCode({ userProfile: userProfile });
          }}
          option5Click={() => {
            Actions.referAfriend({
              userProfile: userProfile,
            });
          }}
          option6Click={() => {
            Actions.rateUs({ userProfile: userProfile });
          }}
          option7Click={() => {
            Actions.settings({
              UserId: userProfile.guid,
              IsShow: userProfile.sharecard,
              UserProfile: userProfile,
            });
          }}
          option8Click={() => {
            Actions.helpCenter({ userProfile: userProfile });
          }}
          option9Click={() => {
            Actions.premierMembership({ userProfile: userProfile });
          }}
          // option5Click={() => {
          //   this._handleClearLocalDB();
          // }}
          userProfile={UserProfile}
          IsProfile={false}
          iconColor={'#000000'}
        />
      </View>
    );
  };
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f6fa' }}>
        <ImageBackground
          style={{ width: '100%', height: '100%' }}
          imageStyle={{
            resizeMode: 'stretch',
          }}
          source={require('../Images/curvesbg.jpg')}>
          <View style={{ flex: 0.04 }} />
          <View
            style={{
              flexDirection: 'row',
              flex: 0.07,
              justifyContent: 'space-between',
            }}>
            <View style={{ marginLeft: 10 }}>
              <TouchableOpacity onPress={() => this.leftArrowPress()}>
                <View style={styles.arrowBgstyle}>
                  <ArrowLeft
                    style={{ fontSize: 20, color: CommonStyles.appColor }}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View>{this._handleHeaderProfileIcon()}</View>
          </View>
          <View style={{ flex: 0.8 }}>
            <View style={styles.child}>
              <BoldText style={styles.text}>{'Settings'}</BoldText>
              <View style={styles.viewSwiperImages}>
                <FlatList
                  showsVerticalScrollIndicator={true}
                  data={[
                    { key: 'Change Number', Value: 'Change Number' },
                    { key: 'Mute Notifications', Value: 'Mute Notifications' },
                    {
                      key: 'Allow Business Card Sharing',
                      Value: 'Allow Business Card Sharing',
                    },
                    { key: 'Language', Value: 'Language' },
                    { key: 'Features', Value: 'Features' },
                    { key: 'Terms of Service', Value: 'Terms of Service' },
                    { key: 'Privacy Policy', Value: 'Privacy Policy' },
                    { key: 'Support', Value: 'Support' },
                    { key: 'Delete Account', Value: 'Delete Account' },
                    { key: 'Log Out', Value: 'Log Out' },
                  ]}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => this.RedirectTomenu(item.Value)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                          padding: 5,
                          marginVertical: 10
                        }}>
                        <View style={{ flex: 0.5, marginLeft: 10, bottom: 3 }}>
                          {item.key == 'Change Number' ? <PhoneIcon /> : null}
                          {item.key == 'Mute Notifications' ? (
                            <NotificationOff />
                          ) : null}
                          {item.key == 'Allow Business Card Sharing' ? (
                            <Image
                              style={styles.image}
                              source={require('../Images/sharecard.jpg')}
                            />
                          ) : null}
                          {item.key == 'Language' ? <Language /> : null}
                          {item.key == 'Features' ? <Feature /> : null}
                          {item.key == 'Terms of Service' ? (
                            <Image
                              style={styles.image}
                              source={require('../Images/changenumber.png')}
                            />
                          ) : null}
                          {item.key == 'Privacy Policy' ? (
                            <Image
                              style={styles.image}
                              source={require('../Images/privacypolicy.png')}
                            />
                          ) : null}
                          {item.key == 'Support' ? (
                            <Image
                              style={styles.image}
                              source={require('../Images/support.png')}
                            />
                          ) : null}
                          {item.key == 'Delete Account' ? <Delete /> : null}
                          {item.key == 'Log Out' ? <SignOut /> : null}

                          {item.key == 'About NobHub' ? (
                            <Image
                              style={styles.image}
                              source={require('../Images/aboutnobhub.png')}
                            />
                          ) : null}
                          {item.key == 'Help' ? (
                            <Image
                              style={styles.image}
                              source={require('../Images/help.png')}
                            />
                          ) : null}
                        </View>
                        <View style={{ flex: 3 }}>
                          <Text style={{ fontSize: 16 }}>{item.key}</Text>
                        </View>
                        <View style={{ flex: 1, position: "absolute", right: 52 }}>
                          {item.key == 'Mute Notifications' ? (
                            <Switch
                              trackColor={{
                                true: CommonStyles.appColor,
                                false: 'grey',
                              }}
                              thumbColor={'#ffffff'}
                              style={{ position: "absolute" }}
                              onValueChange={this.toggleMuteNotification}
                              value={this.state.muteNotificationValue}
                            />
                          ) : null}
                        </View>
                        <View style={{ flex: 1, position: "absolute", right: 52 }}>
                          {item.key == 'Allow Business Card Sharing' ? (
                            <Switch
                              trackColor={{
                                true: CommonStyles.appColor,
                                false: 'grey',
                              }}
                              style={{ position: "absolute" }}
                              thumbColor={'#ffffff'}
                              onValueChange={this.toggleAllowBusinesscard}
                              // value={this.state.switchValue}
                              value={this.state.businessCardValue}
                            />
                          ) : null}
                        </View>
                        <View style={{ flex: 1, position: "absolute", right: 10 }}>
                          {item.key == 'Language' ? (
                            <BoldText style={{ flex: 1, top: 6 }}>English</BoldText >
                          ) : null}
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
              <View />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
const { width, height } = Dimensions.get('window');
const mapStateToProps = state => {
  return {
    userProfile: state.user.userProfile,
  };
};
const mapDispatchToProps = {
  handleGoBack: goBack,
  setUserProfile,
  clearUserProfile,
  clearBusinessCardDetails,
  clearMyConnectionDetails,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
const styles = StyleSheet.create({
  fontSize: {
    fontSize: 15,
    borderBottomWidth: 1,
    color: '#08a0af',
    borderBottomColor: '#08a0af',
  },

  image: {
    width: 25,
    height: 24,
    //alignSelf: 'center',
  },
  arrowBgstyle: {
    flexDirection: 'column',
    height: 35,
    width: 35,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
  },
  leftHeader: {
    flexDirection: 'column',
    height: 38,
    width: 38,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 25,
    textAlign: 'center',
    color: '#000',
  },

  child: {
    height: height * 4,
    width,
    justifyContent: 'center',
  },
  viewSwiperImages: { flex: 1 },
});
