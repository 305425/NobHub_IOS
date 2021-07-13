import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  TextInput,
  Text, Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import CommonHeader from '../shared/CommonHeader';
import { CommonStyles } from '../shared/Constants';
import Footer from '../shared/Footer';
import { MediumBoldText, BoldText } from '../shared/Text';
import {
  GilRoyMediumColor,
  GilRoyRegularColor,
  PlayStoreLink,
} from '../shared/Constants';
import { ShareICon } from '../shared/Icon';
import FloatingTextInput from '../shared/FloatingTextInput';
import { Close } from '../shared/Icon';
import Dialog, { DialogContent, ScaleAnimation } from 'react-native-popup-dialog';
import { setUserProfile, clearUserProfile } from '../state/operations';
import CustomMenuIcon from '../Custom/MenuIconForHeader';
import { Actions } from 'react-native-router-flux';
import Share from 'react-native-share';
import files from '../files/filesBase64';
import ProgressBarAnimated from 'react-native-progress-bar-animated';

class ReferFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ReferralCode: '',
      showTermsAndConditions: false,
      TextInputValueHolder:
        'Hey! Download this awesome app from the Google Play Store/Apple App Store. You can install NobHub here: ',
      Title: 'CHECK OUT THIS COOL NEW APP - NOBHUB',
      ReferalCode: '',
    };
  }
  // ShareMessage = () => {
  //   const {userProfile} = this.props;
  //   Share.share({
  //     title: 'CHECK OUT THIS COOL NEW APP - NOBHUB',
  //     message:
  //       'Hey! Download this awesome app from the Google Play Store/Apple App Store. You can install NobHub here: ' +
  //       '\n' +
  //       'Referral code is ' +
  //       userProfile.mycode +
  //       '\n' +
  //       PlayStoreLink.android,
  //   })
  //     .then(() => {})
  //     .catch(errorMsg => Alert.alert(errorMsg));
  // };
  ShareMessage = async () => {
    const { userProfile } = this.props;
    const shareOptions = {
      title: 'CHECK OUT THIS COOL NEW APP - NOBHUB',
      message:
        'Hey! Download this awesome app from the Google Play Store/Apple App Store. You can install NobHub here: ' +
        '\n' +
        'Referral code is ' +
        userProfile.mycode +
        '\n' +
        PlayStoreLink.android,
      url: files.appLogo,

      // urls: [files.image1, files.image2]
    }

    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      console.log('Error => ', error);
    }
  };

  RedeemPoints() {
    const { userProfile } = this.props;
    try {
      var dataToSend = {
        ReferalCode: this.state.ReferralCode,
        UserId: userProfile.guid,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/RedeemPoints', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log("Referal Data", responseJson)
          this.props.clearUserProfile();
          this.props.setUserProfile(responseJson);
        });
    } catch (e) {
      Alert.alert(e);
    }
  }
  _handleHeaderLeftIcon = () => {
    const { userProfile } = this.props;
    return (
      <View>
        <View style={styles.leftHeader}>
          <Text style={{ color: CommonStyles.appColor, fontSize: 12 }}>
            {userProfile != null && userProfile != '' && userProfile.points
              ? userProfile.points
              : '18/500'}
          </Text>
        </View>
        <Text style={{ color: '#ffffff', fontSize: 12, textAlign: 'center' }}>Subscriptions Redeemed</Text>
      </View>
    );
  };
  _handleHeaderRightIcon = () => {
    const { userProfile } = this.props;
    return (
      <TouchableOpacity onPress={() => {
        this.props.navigation.navigate("referAfriendList")
      }}>
        <View>
          <View style={styles.leftHeader}>
            <Text style={{ color: CommonStyles.appColor, fontSize: 15 }}>
              {userProfile != null && userProfile != ''
                ? userProfile.referalcount
                : '25'}
            </Text>
          </View>
          <Text style={{ color: '#ffffff', fontSize: 12, textAlign: 'center' }}>Referral Count</Text>
        </View>
      </TouchableOpacity>
    );
  };
  _handleHeaderCenterIcon = () => {
    return (
      <View>
        <BoldText style={{ fontSize: 15, alignSelf: "center" }}>25%</BoldText>
        <View style={{ backgroundColor: "#fff", borderRadius: 10 }}>
          <ProgressBarAnimated
            width={windowWidth / 1.8}
            height={20}
            value={32}
            backgroundColorOnComplete="#fff"
            backgroundColor="#6CC644"
            borderColor="#000000"
            borderRadius={20}
          />
        </View>
      </View>
    );

  };
  _handleHeaderText = () => {
    return (
      <MediumBoldText style={{ color: '#ffffff', fontSize: 15 }}>Refer & Redeem</MediumBoldText>
    );
  };
  _handleOnChange = value => {
    this.setState({ ReferralCode: value });
  };
  _handleHeaderProfileIcon = () => {
    const { userProfile } = this.props;
    return (
      <View style={[styles.leftHeader, { borderRadius: 0, backgroundColor: '' }]}>
        <CustomMenuIcon
          menutext="Menu"
          menuStyle={styles.headerCustomMenu}
          //Menu Text Style
          textStyle={styles.headerTextMenu}
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
          userProfile={userProfile}
          IsProfile={false}
          iconColor={'#ffffff'}
        />
      </View>
    );
  };
  _handleCloseTermsAndConditons = () => {
    this.setState({
      showTermsAndConditions: false,
    });
  };
  _handleOnTermsAndConditionsPress = () => {
    this.setState({
      showTermsAndConditions: true,
    });
  };
  render() {
    const { userProfile } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: '#f4f6f9' }}>
        <View style={{ flex: 0.18 }}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => this._handleHeaderRightIcon()}
            HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
            HeaderLeftIconPress={this._handleHeaderLeftIconPress}
            HeaderText={() => this._handleHeaderText()}
            HeaderProfileIcon={() => this._handleHeaderProfileIcon()}
            HeaderProfileIconPress={this._handleHeaderProfileIconPress}
            IsShowTextForTabs={false}
          />
        </View>

        <View
          style={{
            flex: 0.82,
            marginRight: 10,
            marginLeft: 10
          }}>
          <ScrollView>
            <View
              style={{
                flex: 0.1,
                borderBottomWidth: 1,
                borderColor: '#ffffff',
              }}>
              <Text style={{ color: GilRoyRegularColor, textAlign: 'center', margin: 10 }}>
                You nailed it, Awesome! Enjoy 1 year Premium Membership for
                free!
              </Text>
            </View>

            <View
              style={{
                flex: 0.2,
                marginTop: 5,
              }}>
              <MediumBoldText
                style={{
                  color: GilRoyMediumColor,
                  textAlign: 'center',
                  fontSize: 25,
                  margin: 10,
                  fontWeight: "bold"
                }}>
                App Promotional Offer
              </MediumBoldText>
              <MediumBoldText
                style={{
                  color: GilRoyMediumColor,
                  textAlign: 'center',
                  fontSize: 25,
                  bottom: 10,
                  fontWeight: "bold"
                }}>
                500 Free Premium Memberships
              </MediumBoldText>
              <MediumBoldText
                style={{
                  color: GilRoyMediumColor,
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: "bold"
                }}>
                Reward your Friends & Yourself!
              </MediumBoldText>
              <Text
                style={{
                  color: GilRoyRegularColor,
                  textAlign: 'center',
                  fontSize: 12,
                  marginTop: 5,
                  lineHeight: 15,
                  margin: 10
                }}>
                {/* Share your Referral code with your friends and get exciting bonus points.
                You can earn 5 points by inviting your amazing friends. They
                also get 5 points when they install the app and connect. */}
                Share your Referral code with your friends and enjoy 1 year
                premium subscription for free once you are eligible .Get one
                Referral Count for every friend that redeems your code and your
                friend gets one count too !
              </Text>
            </View>
            <View
              style={{
                flex: 0.1,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                backgroundColor: CommonStyles.appColor,
                borderRadius: 10
              }}>
              <View style={{ alignSelf: 'center' }}>
                <Text style={{ color: '#ffffff', fontSize: 12, left: 60 }}>Your Referral code</Text>
                <MediumBoldText style={{ color: '#ffffff', fontSize: 25, left: 45 }}>
                  {userProfile != null && userProfile != ''
                    ? userProfile.mycode
                    : null}
                </MediumBoldText>
              </View>
              <TouchableOpacity
                // style={{height:45,width:45,borderRadius:50,backgroundColor: 'rgba(52, 52, 52, 0.8)'}}
                onPress={() => this.ShareMessage()}>
                <View>
                  {/* <Image
                  style={{height:45,width:45,backgroundColor:"white"}}
                  source={require('../Images/share.png')}
                  /> */}
                  <ShareICon style={{ color: '#ffffff', paddingVertical: 8, left: 55 }} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.3, top: 5 }}>
              <Image
                style={styles.image}
                source={require('../Images/Refer&Earn.png')}
              />
            </View>
            <View style={{ flex: 0.1, marginTop: 10 }}>
              <MediumBoldText
                style={{
                  color: GilRoyMediumColor,
                  textAlign: 'center',
                  fontSize: 23,
                }}>
                Were you referred to NubHub ?
              </MediumBoldText>
              <MediumBoldText
                style={{
                  color: GilRoyMediumColor,
                  textAlign: 'center',
                  fontSize: 12,
                }}>
                Did you recieve an Referral code to download NubHub ?
              </MediumBoldText>
              <MediumBoldText
                style={{
                  color: GilRoyMediumColor,
                  textAlign: 'center',
                  fontSize: 12,
                }}>
                Enter the code to earn one referral count.
              </MediumBoldText>
            </View>
            <View
              style={{
                flex: 0.1,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              <View
                style={{ borderBottomWidth: 1, borderBottomColor: 'lightgray' }}>
                <TextInput
                  placeholder="Enter code here"
                  fontSize={20}
                  onChangeText={value => {
                    this._handleOnChange(value);
                  }}
                  value={this.state.ReferralCode}
                />
              </View>
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity onPress={() => this.RedeemPoints()}>
                  <Text style={styles.redeemstyle}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flex: 0.1,
                fontSize: 10,
                marginTop: 5,
                lineHeight: 15,
              }}>
              <Text style={{ color: GilRoyMediumColor, textAlign: 'justify', margin: 15 }}>
                **To get referral credit , your friend will need to download
                NobHub app and submit your referral code in the application.
                <Text
                  onPress={() => this._handleOnTermsAndConditionsPress()}
                  style={{
                    color: CommonStyles.appColor,
                    bottomBorderWidth: 1,
                  }}>
                  Terms and Coniditons,
                </Text>
              </Text>
            </View>
          </ScrollView>
        </View>
        <Dialog
          onTouchOutside={this._handleCloseTermsAndConditons}
          width={0.9}
          height={380}
          visible={this.state.showTermsAndConditions}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={this._handleCloseTermsAndConditons}>
          <DialogContent>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.viewTermsAndConditions}>
                <Text style={styles.textTitleTermsAndConditions}>
                  {'Terms & Conditions'}
                </Text>
                <View style={styles.viewCloseTermsAndConditions}>
                  <TouchableOpacity
                    onPress={this._handleCloseTermsAndConditons}>
                    <Close style={styles.iconClose} />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
            <ScrollView>
              <View style={{ paddingBottom: 30 }}>
                <Text style={{ textAlign: 'justify' }}>
                  Each User only has one unique Referral code, can be redeemed
                  for only one.
                </Text>
                <Text style={{ textAlign: 'justify', paddingBottom: 10 }}>
                  5 points will be rewarded, for both referrer and invitee for
                  successful invite.
                </Text>
                <Text style={{ textAlign: 'justify' }}>
                  By successful invite, it means the invitee will have to:
                </Text>
                <Text style={{ textAlign: 'justify' }}>
                  Submit the referral code in the Refer & Redeem page via the
                  NobHub app. Register a new account via the NobHub app with a
                  new device that had never downloaded the NobHub app.
                  Otherwise, the invitation reward would be invalid. NobHub
                  reserves the right of final decision.
                </Text>
              </View>
            </ScrollView>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}
const mapStateToProps = state => {
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
)(ReferFriend);

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
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
  headerCustomMenu: {
    marginRight: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 100,
  },
  headerTextMenu: {
    color: 'red',
  },
  image: {
    width: 350,
    height: 231,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignSelf: 'center',
    //marginBottom:20
  },
  redeemstyle: {
    color: '#ffffff',
    textAlign: 'center',
    height: 40,
    width: 100,
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: CommonStyles.appColor,
    paddingVertical: 8,
    fontSize: 18
  },
  viewTermsAndConditions: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 60,
    alignItems: 'flex-end',
  },
  textTitleTermsAndConditions: {
    fontSize: 18,
    color: '#08a0af',
  },
  viewCloseTermsAndConditions: { flex: 1, alignItems: 'flex-end' },
  iconClose: { color: '#ff0000', fontSize: 24 },
});