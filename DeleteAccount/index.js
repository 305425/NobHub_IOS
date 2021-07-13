import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import {goBack} from '../Services/BackButtonServices';
import {Actions} from 'react-native-router-flux';
import {ArrowLeft} from '../shared/Icon';
import {connect} from 'react-redux';
import {CommonStyles} from '../shared/Constants';
import CustomMenuIcon from '../Custom/MenuIconForHeader';
import {BoldText} from '../shared/Text';
import ServiceCalls from '../Services/APICalls';
import {
  clearUserProfile,
  setUserProfile,
  clearBusinessCardDetails,
  clearMyConnectionDetails,
} from '../state/operations';
import {
  GilRoyMediumColor,
  GilRoyRegularColor,
  PlayStoreLink,
} from '../shared/Constants';
import Button from '../shared/Button';
import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'NobHUb.db'});
class DeleteAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTermsAndConditions: false,
      isChecked: false,
    };
  }

  _handleHeaderProfileIcon = () => {
    const {userProfile} = this.props;
    return (
      <View style={[styles.leftHeader, {borderRadius: 0, backgroundColor: ''}]}>
        <CustomMenuIcon
          menutext="Menu"
          menuStyle={styles.headerCustomMenu}
          //Menu Text Style
          textStyle={styles.headerTextMenu}
          //Click functions for the menu items
          option1Click={() => {
            const {userProfile} = this.props;
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
            Actions.businessCard({userProfile: userProfile});
          }}
          option3Click={() => {
          Actions.myConnections();
          }}
          option4Click={() => {
            Actions.qrCode({userProfile: userProfile});
          }}
          option5Click={() => {
            Actions.referAfriend({
              userProfile: userProfile,
            });
          }}
          option6Click={() => {
            Actions.rateUs({userProfile: userProfile});
          }}
          option7Click={() => {
            Actions.settings({
              UserId: userProfile.guid,
              IsShow: userProfile.sharecard,
              UserProfile: userProfile,
            });
          }}
          option8Click={() => {
            Actions.helpCenter({userProfile: userProfile});
          }}
          option9Click={() => {
            Actions.premierMembership({userProfile: userProfile});
          }}
          // option5Click={() => {
          //   this._handleClearLocalDB();
          // }}
          userProfile={userProfile}
          IsProfile={false}
          iconColor={'#00000'}
        />
      </View>
    );
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
            Actions.startPage();
            this.props.clearUserProfile();
            this.props.clearMyConnectionDetails();
            this.props.clearBusinessCardDetails();
            // Actions.startPage();
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


  DeleteAccount = () => {
    try {
      var dataToSend = {
        LoginUserId: global.LoginUserId,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      console.log("DeleteBody",formBody)
      fetch(global.APIURL + 'api/Card/DeleteNobhubAccount', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log("ResponseDelete",responseJson)
          this._handleClearLocalDB();
          // Actions.login1({
          //   IsCallRegistration: true,
          //   ButtonText: 'Continue',
          //   LabelText: 'What' + "'s" + ' your phone number?',
          //   IsFromChangeNumber: false,
          // });
        })
        .catch(error => Alert.alert(error));
    } catch (e) {
      Alert.alert(e);
    }
  };

  leftArrowPress = () => {
    const {handleGoBack} = this.props;
    handleGoBack();
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <ImageBackground
          style={{width: '100%', height: '100%'}}
          imageStyle={{
            resizeMode: 'stretch',
          }}
          source={require('../Images/curvesbg.jpg')}>
          <View
            style={{
              flexDirection: 'row',
              flex: 0.25,
              justifyContent: 'space-between',
              alignItems:"center"
            }}>
            <View style={{marginLeft: 10, bottom:10}}>
              <TouchableOpacity onPress={() => this.leftArrowPress()}>
                <View style={styles.arrowBgstyle}>
                  <ArrowLeft
                    style={{fontSize: 20, color: CommonStyles.appColor}}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{margin: 5, top:40}}>
            <BoldText style={styles.text}>{'Delete Account'}</BoldText>
          </View>
            {this._handleHeaderProfileIcon()}
          </View>
         
         <View style={{justifyContent:"center", top:80}}>
         <View>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                color: 'red',
                textAlign: 'center',
              }}>
              Deleting your Account Will be:
            </Text>
          </View>
          <View
            style={{
              margin: 5,
              flexDirection: 'row',
            }}>
            <Text style={{color: GilRoyRegularColor, lineHeight: 20}}>
              {'\u2B24'}
            </Text>
            <Text
              style={[styles.textalignment, {marginRight: 10, marginLeft: 10}]}>
              Deleting your account cannot be undone. You are going to delete
              absolutely everything you've ever done in NobHub, your Contacts,
              Chatting, meetings, your profile ... everything.

            </Text>
          </View>
          <View
            style={{
              margin: 5,
              flexDirection: 'row',
            }}>
            <Text style={{color: GilRoyRegularColor, lineHeight: 20}}>
              {'\u2B24'}
            </Text>
            <Text
              style={[
                styles.textalignment,
                {marginRight: 10, marginLeft: 10},
              ]}>
              After you delete your account, you will be able to create a new
              account with the same phone number.
            </Text>

          </View>
          <View
            style={{
              margin: 5,
              flexDirection: 'row',
            }}>
            <Text style={{color: GilRoyRegularColor, lineHeight: 20}}>
              {'\u2B24'}
            </Text>
            <Text
              style={[
                styles.textalignment,
                {marginRight: 10, marginLeft: 10},
              ]}>
              If you would like to cancel your paid subscription, 
              but keep your profile, simply unsubscribe from Premium membership services and avail all free basic features!
            </Text>

          </View>
          <Button
            buttonTitle={'Delete Account'}
            onButtonPress={() => this.DeleteAccount()}
          />
         </View>
        </ImageBackground>
      </View>
    );
  }
}
const mapDispatchToProps = {
  clearBusinessCardDetails,
  clearMyConnectionDetails,
  setUserProfile,
  clearUserProfile,
  handleGoBack: goBack,
};

export default connect(
  null,
  mapDispatchToProps,
)(DeleteAccount);
const styles = StyleSheet.create({
  textalignment: {
    fontSize: 14,

    textAlign: 'justify',
  },
  text: {
    fontSize: 25,
    textAlign: 'center',
    color: '#000',
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
});
