import firebase from 'react-native-firebase';
import {Alert} from 'react-native';
import {CommonStyles} from '../shared/Constants';

export const createNotificationListeners = async () => {
  /*
   * Triggered when a particular notification has been received in foreground
   * */
  if (global.IsListenerOn == null || global.IsListenerOn == undefined) {
    global.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const {title, body, data} = notification;
        if (
          global.GlobalchannelId == data.ChannelId &&
          global.LoginUserFcmToken !== data.fromFcmToken
        ) {
          if (data.MessageType == 1) {
            var datamsgObj = {
              _id: 0,
              text: body,
              user: {_id: data.fromUserId,
               // avatar: true,
              },
              channelId: data.ChannelId,
              createdAt: new Date(),
              // avatarProps: {
              //   icon: data.SenderProf,
              // },
            };
          } else if (data.MessageType == 2) {
            var datamsgObj = {
              _id: 0,
              image: global.APIURL + 'uploadimgs/ChatImages/' + body,
              user: {_id: data.fromUserId},
              channelId: data.ChannelId,
              createdAt: new Date(),
            };
          }
          global.groupChattingUI.GiftedChatdesign(datamsgObj);
        } else if (
          data.type == 'chat' &&
          (data.MessageType == 1 || data.MessageType == 2)
        ) {
          var userPrfoiles = global.MyConnections.props.userProfile;
          if (userPrfoiles != null) {
            userPrfoiles.hasnewchatmessage = true;
            global.MyConnections.props.setUserProfile(userPrfoiles);
          }
          global.footer.setState({HasChatmsg: true});
        } else if (data.type == 'F') {
          var userPrfoiles = global.MyConnections.props.userProfile;
          if (userPrfoiles != null) {
            userPrfoiles.isnewinvititation = true;
            global.MyConnections.props.setUserProfile(userPrfoiles);
          }
          global.MyConnections.setState({HasInvitation: true});
          // global.MyConnections.setState({
          //   HasInvitation: true,
          //   InviteIconColor: CommonStyles.appColor,
          // });
          //  showAlert(title, body, data);
        } else if (data.type == 'S') {
          var userPrfoiles = global.MyConnections.props.userProfile;
          if (userPrfoiles != null) {
            userPrfoiles.hasnewshoutout = true;
            global.MyConnections.props.setUserProfile(userPrfoiles);
          }
          global.footer.setState({HasNewShoutout: true});
        } else if (data.type == 'Meeeting') {
          var userPrfoiles = global.MyConnections.props.userProfile;
          if (userPrfoiles != null) {
            userPrfoiles.hasnewmeeting = true;
            global.MyConnections.props.setUserProfile(userPrfoiles);
          }
          global.footer.setState({hasnewmeeting: true});
        }
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        global.InviteText = 'NEW';
        const {title, body} = notificationOpen.notification;
      //  showAlert1(title, body);
      });
    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const {title, body} = notificationOpen.notification;
    //  showAlert1(title, body);
    }

    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage(message => {});
  }
  global.IsListenerOn = true;
};
// const showAlert1 = (title, body) => {
//   Alert.alert(
//     //title
//     title,
//     //body
//     body,
//     [
//       {
//         text: 'Ok',
//         style: 'cancel',
//       },
//       ,
//     ],
//     {cancelable: false},
//     //clicking out side of alert will not cancel
//   );
// };

const showAlert = (title, body, data) => {
  Alert.alert(
    //title
    title,
    //body
    body,
    [
      {
        text: 'Decline',
        onPress: () => DeclineInvitation(data.fromUserId),
        style: 'cancel',
      },
      {
        text: 'Accept',
        onPress: () => Acceptinvitation(data.fromUserId),
      },
      {
        text: 'Later',
        onPress: () => LaterInvitation(data.fromUserId),
        style: 'cancel',
      },
    ],
    {cancelable: false},
    //clicking out side of alert will not cancel
  );
};

const Acceptinvitation = InvitationFrom => {
  try {
    global.MyConnections._handleAcceptInvitation(
      global.LoginUserId,
      InvitationFrom,
    );
  } catch (e) {
    Alert.alert(e);
  }
};
const DeclineInvitation = InvitationFrom => {
  try {
    var dataToSend = {
      FromUserId: InvitationFrom,
      LoginUserId: global.LoginUserId,
    };
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    fetch(global.APIURL + 'api/Card/DeclineInvitation', {
      method: 'POST', //Request Type
      body: formBody, //post body
      headers: {
        //Header Defination
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(() => {});
  } catch (e) {
    Alert.alert(e);
  }
};
const LaterInvitation = () => {
  if (global.MyInvitations != undefined) {
    global.MyInvitations.GetReceiveInvitationList(global.LoginUserId);
  }
};
