import React, {Component} from 'react';
import {
  ImageBackground,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
  View,
  StatusBar,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {setUserProfile} from './state/operations';
import {connect} from 'react-redux';
import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'NobHUb.db', location: 'default'});
import ServiceCalls from './Services/APICalls';
import firebase from 'react-native-firebase';
import {CommonStyles, LightGrayColor} from './shared/Constants';
import GetLocation from 'react-native-get-location';
//import {StackActions, NavigationActions} from 'react-navigation';
// const resetAction = StackActions.reset({
//   index: 0,
//   actions: [NavigationActions.navigate({routeName: 'StartPage'})],
// });
class SplashScreen extends Component {
  constructor() {
    super();
    this.state = {
      align: 'center',
      currentLongitude: 'unknown', //Initial Longitude
      currentLatitude: 'unknown', //Initial Latitude
    };
    setTimeout(
      () =>
        this.setState({align: 'center'}, function() {
          //Actions.startPage();
          this.LocalDBCall();
        }),
      5000,
    );
    global.APIURL = 'http://nobhubapi.azurewebsites.net/';
    //global.APIURL = 'http://10.200.0.15:9095/';
    global.LoginUserFcmToken = '';
    global.CountryCode = '';
    global.ConnectionsTabColor = CommonStyles.appColor;
    global.ChatTabColor = LightGrayColor.fontColor;
    global.MeetingsTabColor = LightGrayColor.fontColor;
    global.NotificationsTabColor = LightGrayColor.fontColor;
    global.ShoutoutTabColor = '#000';
    global.ShoutoutBgColor = ['#D3D3D3', '#D3D3D3'];
    global.Active = 'rgba(211, 211, 211, .2)';
    global.PersonalCoverPhoto = '';
    global.PersonalPhoto = '';
    global.BusinessCoverPhoto = '';
    global.BusinessLogo = '';
    global.NotificationCount = '';
    global.currentLongitude = 0; //Initial Longitude
    global.currentLatitude = 0; //Initial Latitude
    global.NewShoutout = false;
  }
  componentDidMount = () => {
    var that = this;
    //Checking for the permission just after component loaded
    if (Platform.OS === 'ios') {
      this.callLocation(that);
    } else {
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            that.callLocation(that);
          } else {
            Alert.alert('Permission Denied');
          }
        } catch (err) {
          Alert.alert('err', err);
        }
      }
      requestLocationPermission();
    }
  };
  callLocation = that => {
    try {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then(location => {
          const currentLongitude = JSON.stringify(location.longitude);
          const currentLatitude = JSON.stringify(location.latitude);
          that.setState({currentLongitude: currentLongitude});
          that.setState({currentLatitude: currentLatitude});
          global.currentLongitude = currentLongitude; //Initial Longitude
          global.currentLatitude = currentLatitude; //Initial Latitude
          this.LocalDBCall();
        })
        .catch(error => {
          const {code, message} = error;
        });
    } catch (e) {
      Alert.alert(e);
    }
  };
  LocalDBCall = () => {
    var that = this;
    if (global.LoginUserId != null) {
      Actions.myConnections();
    } else {
      try {
        db.transaction(function(txn) {
          txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='CurrentData'",
            [],
            function(tx, res) {
              if (res.rows.length === 0) {
                let enabled = false;
                try {
                  firebase.messaging().requestPermission();
                  enabled = firebase.messaging().hasPermission();
                  if (enabled) {
                    that.getFCMtoken();
                  }
                } catch (error) {
                  that.showAlert('checkPermission', 'checkPermission error');
                }
              } else {
                that.LandingPage();
              }
            },
          );
        });
      } catch (e) {
        Alert.alert(e);
      }
    }
  };
  LandingPage() {
    try {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM CurrentData', [], (tx, results) => {
          global.LoginUserFcmToken = results.rows.item(0).FCMToken;
          global.CountryCode = results.rows.item(0).country_code;
          if (results.rows.item(0).user_id != null) {
            var UserId = results.rows.item(0).user_id;
            ServiceCalls.handleGetUserDeatailsById(UserId).then(response => {
              this.props.setUserProfile(response);
              global.LoginUserId = response.guid;
              global.LoginUserName = response.name + ' ' + response.lastname;
              global.PhoneNumber = response.mobile;
              // global.HasInvitation=response.isnewinvititation;
              Actions.myConnections();
            });
          } else {
            Actions.startPage();
          }
        });
      });
    } catch (e) {
      Alert.alert(e);
    }
  }
  getFCMtoken() {
    try {
      if (Platform.OS == 'android') {
        firebase
          .messaging()
          .getToken()
          .then(fcmToken => {
            if (fcmToken) {
              this.setState({FCMtoken: fcmToken});
              global.LoginUserFcmToken = fcmToken;
              this.IntilizeData(fcmToken);

              Actions.startPage();
            } else {
              Alert.alert("user doesn't have a device token yet");
            }
          });
      } else {
        this.checkPermission();
      }
    } catch (e) {
      Alert.alert('Error from firebase:' + e);
    }
  }
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      Alert.alert('permission rejected');
    }
  }
  async getToken() {
    try {
      const enabled = await firebase.messaging().hasPermission();
      if (!enabled) {
        await firebase.messaging().requestPermission();
      }

      const fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        this.setState({FCMtoken: fcmToken});
        global.LoginUserFcmToken = fcmToken;
        this.IntilizeData(fcmToken);
        this.setState({fcmToken});

        Actions.startPage();
        return fcmToken;
      }
    } catch (error) {
      Alert.alert('notification token error', error);
    }
  }

  IntilizeData = FCMToken => {
    try {
      fetch('http://www.geoplugin.net/json.gp')
        .then(response => response.json())
        .then(responseJson => {
          global.CountryCode = responseJson.geoplugin_countryCode;
          db.transaction(function(txn) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS CurrentData(user_id INTEGER,country_code VARCHAR(20),language INTEGER,FCMToken VARCHAR(500))',
              [],
              () => {
                txn.executeSql(
                  'INSERT INTO CurrentData (country_code, language, FCMToken) VALUES (?,?,?)',
                  [global.CountryCode, 1, FCMToken],
                  () => {
                    return true;
                  },
                );
              },
            );
          });
        });
    } catch (e) {
      Alert.alert(e);
    }
  };
  render() {
    return (
      <ImageBackground
        source={require('./Images/NobHubSplashScreen.gif')}
        style={{
          resizeMode: 'stretch',
          width: '100%',
          height: '100%',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <StatusBar translucent backgroundColor="transparent" />
        <ActivityIndicator
          color={CommonStyles.appColor}
          size="large"
          height="80"
        />
      </ImageBackground>
    );
  }
}
export const mapStateToProps = state => {
  return {userProfile: state.user.userProfile};
};

const mapDispatchToProps = {
  setUserProfile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SplashScreen);
