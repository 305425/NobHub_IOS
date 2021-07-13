import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  ImageBackground,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {
  BottomChatIcon,
  BottomGroupIcon,
  BottomNotificationIcon,
  ShoutOut,
} from '../shared/Icon';
import {CommonStyles, LightGrayColor} from './Constants';
import {MediumBoldText} from './Text';
import {clearUserProfile, setUserProfile} from '../state/operations';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {HubConnectionBuilder, LogLevel} from "@aspnet/signalr";
class BottomNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      NotificationCount: 10,
      HasChatmsg: '',
      hasnewmeeting: '',
      HasNewShoutout: '',
      IsMeettingPressed: (this.props.userProfile != null && this.props.userProfile.hasnewmeeting) ? false : true,
      hubConnection: null,
      isPageReload: false
    };
    global.footer = this;
  }
//   componentWillMount(){
//     this.setState({
//         hubConnection: new HubConnectionBuilder()
//             .withUrl(global.APIURL+"/NotificationHub")
//             .configureLogging(LogLevel.Debug)
//             .build()
//     });
// }

// componentDidMount(){
//     this.state.hubConnection
//         .start()
//         .then(() => console.log('Connection started!'))
//         .catch(err => console.log('Error while establishing connection', err));

//     this.state.hubConnection.on('dataRefresh', (name,message) => {
//         this.setState({isPageReload: true});
//     });
// }
  MeetingsPress = () => {
    this.setState({IsMeettingPressed: true});
    global.ConnectionsTabColor = LightGrayColor.fontColor;
    global.ChatTabColor = LightGrayColor.fontColor;
    global.MeetingsTabColor = CommonStyles.appColor;
    global.NotificationsTabColor = LightGrayColor.fontColor;
    global.ShoutoutTabColor = '#000';
    global.ShoutoutBgColor = ['#D3D3D3', '#D3D3D3'];
    global.Active = 'rgba(211, 211, 211, .2)';
    if(this.props.userProfile != null && this.props.userProfile.hasnewmeeting)
    {
    Actions.Meetings({
      isNewMeetings: true,
    });
     }
     else{
      Actions.Meetings();
    }
  };
  MessagesPress = () => {
    this.setState({IsMeettingPressed: false});
    global.ConnectionsTabColor = LightGrayColor.fontColor;
    global.ChatTabColor = CommonStyles.appColor;
    global.MeetingsTabColor = LightGrayColor.fontColor;
    global.NotificationsTabColor = LightGrayColor.fontColor;
    global.ShoutoutTabColor = '#000';
    global.ShoutoutBgColor = ['#D3D3D3', '#D3D3D3'];
    global.Active = 'rgba(211, 211, 211, .2)';
    Actions.Chats();
  };
  MyConnectionPress = () => {
    this.setState({IsMeettingPressed: false});
    global.ConnectionsTabColor = CommonStyles.appColor;
    global.ChatTabColor = LightGrayColor.fontColor;
    global.MeetingsTabColor = LightGrayColor.fontColor;
    global.NotificationsTabColor = LightGrayColor.fontColor;
    global.ShoutoutTabColor = '#000';
    global.ShoutoutBgColor = ['#D3D3D3', '#D3D3D3'];
    global.Active = 'rgba(211, 211, 211, .2)';
    Actions.myConnections();
  };
  NotificationsPress = () => {
    this.setState({IsMeettingPressed: false});
    global.ConnectionsTabColor = LightGrayColor.fontColor;
    global.ChatTabColor = LightGrayColor.fontColor;
    global.MeetingsTabColor = LightGrayColor.fontColor;
    global.NotificationsTabColor = CommonStyles.appColor;
    global.ShoutoutTabColor = '#000';
    global.ShoutoutBgColor = ['#D3D3D3', '#D3D3D3'];
    global.Active = 'rgba(211, 211, 211, .2)';
    Actions.notifications();
  };
  _handleRedirectToShoutOut = () => {
    this.setState({IsMeettingPressed: false});
    global.ConnectionsTabColor = LightGrayColor.fontColor;
    global.ChatTabColor = LightGrayColor.fontColor;
    global.MeetingsTabColor = LightGrayColor.fontColor;
    global.NotificationsTabColor = LightGrayColor.fontColor;
    global.ShoutoutTabColor = '#ffffff';
    global.ShoutoutBgColor = ['#089bab', '#11cbdf'];
    global.Active = 'rgba(8, 160, 175, .2)';
    Actions.businessShoutOut({Id: 0, IsAll: true});
  };

  render() {
    const {userProfile} = this.props;
  //  console.log("IsPageReload",this.state.isPageReload)
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
        }}>
        <ImageBackground
          resizeMode={'stretch'}
          style={{
            width: Dimensions.get('window').width,
            flex: 1,
            flexDirection: 'row',
          }}
          source={require('../BottomTabImages/2020-06-01.png')}>
          <View
            style={{
              flex: 2.2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              top: 15,
              marginLeft: 5,
            }}>
            <TouchableOpacity
              style={{alignItems: 'center', top: 5}}
              onPress={() => this.MyConnectionPress()}>
              {global.ConnectionsTabColor == '#27BECF' ? (
                <Image
                  style={{height: 30, width: 30}}
                  source={require('../Images/myconnectionsblue.png')}
                />
              ) : (
                <Image
                  style={{height: 30, width: 30}}
                  source={require('../Images/myconnectionsgrey.png')}
                />
              )}
              <MediumBoldText
                style={[
                  styles.bottomText,
                  {color: global.ConnectionsTabColor},
                ]}>
                My Connections
              </MediumBoldText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginRight: 10, alignItems: 'center'}}
              onPress={() => this.MessagesPress()}>
              {userProfile != null && userProfile.hasnewchatmessage ? (
                <View style={styles.Chattingiconstyle}>
                  <Image source={require('../Images/dotimage.png')} />
                </View>
              ) : null}
              <BottomChatIcon
                style={[styles.bottomIcon, {color: global.ChatTabColor}]}
              />
              <MediumBoldText
                style={[styles.bottomText, {color: global.ChatTabColor}]}>
                Chat
              </MediumBoldText>
            </TouchableOpacity>
            {/* </View> */}
          </View>

          <View
            style={{
              flex: 1,
            }}>
            <LinearGradient
              start={{x: 1, y: 1.5}}
              end={{x: 1, y: 0}}
              colors={global.ShoutoutBgColor}
              style={[
                styles.centerButtonView,
                {
                  backgroundColor: global.ShoutoutBgColor,
                  borderColor: global.Active,
                },
              ]}>
              <TouchableOpacity
                onPress={() => this._handleRedirectToShoutOut()}>
                {userProfile != null && userProfile.hasnewshoutout ? (
                  <View style={styles.Chattingiconstyle}>
                    <Image source={require('../Images/dotimage.png')} />
                  </View>
                ) : null}
                <ShoutOut
                  style={[
                    styles.bottomIcon,
                    {
                      color: global.ShoutoutTabColor,
                      fontSize: 22,
                      marginTop: 0,
                    },
                  ]}
                />
              </TouchableOpacity>
            </LinearGradient>
          </View>
          <View
            style={{
              flex: 2.2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              top: 15,
              marginRight: 5,
            }}>
            <TouchableOpacity
              style={{left: 15, alignItems: 'center', top: 4}}
              onPress={() => this.MeetingsPress()}>
              {/* <Text>HasMeeting:{userProfile.hasnewmeeting} </Text> */}
              {(userProfile !== null && userProfile.hasnewmeeting) ? (
                <View style={styles.Chattingiconstyle}>
                  <Image source={require('../Images/dotimage.png')} />
                </View>
              ) : null}
              {global.MeetingsTabColor == '#27BECF' ? (
                <Image
                  style={{height: 30, width: 30}}
                  source={require('../Images/meetingsblue.png')}
                />
              ) : (
                <Image
                  style={{height: 30, width: 30}}
                  source={require('../Images/meetings.png')}
                />
              )}
              <MediumBoldText
                style={[styles.bottomText, {color: global.MeetingsTabColor}]}>
                Meetings
              </MediumBoldText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginLeft: 10, alignItems: 'center'}}
              onPress={() => this.NotificationsPress()}>
              {userProfile != null && userProfile != '' ? (
                userProfile.notificationcount > 0 ? (
                  <View style={styles.notificationCount}>
                    <Text style={{color: '#ffffff', fontSize: 11}}>
                      {userProfile.notificationcount >= 100
                        ? '99+'
                        : userProfile.notificationcount}
                    </Text>
                  </View>
                ) : null
              ) : null}
              <BottomNotificationIcon
                style={[
                  styles.bottomIcon,
                  {color: global.NotificationsTabColor},
                ]}
              />
              <MediumBoldText
                style={[
                  styles.bottomText,
                  {color: global.NotificationsTabColor},
                ]}>
                Notifications
              </MediumBoldText>
            </TouchableOpacity>
          </View>
        </ImageBackground>
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
  clearUserProfile,
  setUserProfile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BottomNavigator);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: Dimensions.get('window').width,
  },
  centerButtonView: {
    flexDirection: 'column',
    height: 55,
    width: 55,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    bottom: 28,
    borderWidth: 5,
    zIndex: 999,
  },
  footerView: {
    position: 'absolute',
    //backgroundColor: '#FFFF',
    bottom: 0,
    zIndex: 1,
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  iconsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 999,
    marginTop: 10,
  },
  containerViewStyle: {
    alignSelf: 'center',
  },
  bottomIcon: {
    alignSelf: 'center',
    marginTop: 5,
  },
  bottomText: {
    fontSize: 12,
    textAlign: 'center',
  },
  notificationCount: {
    flexDirection: 'column',
    height: 23,
    width: 23,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    top: -5,
    right: 10,
    backgroundColor: CommonStyles.appColor,
    zIndex: 99,
  },
  Chattingiconstyle: {
    flexDirection: 'column',
    borderRadius: 40,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    top: -5,
    left: 23,
    zIndex: 999,
  },
});
