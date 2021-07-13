import React, {Component} from 'react';
import {
  View,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import CommonHeader from '../shared/CommonHeader';
import Footer from '../shared/Footer';
import {MediumBoldText} from '../shared/Text';
import {Thumbnail} from 'native-base';
import {
  CommonStyles,
  GilRoyMediumColor,
  LightGrayColor,
} from '../shared/Constants';
import {ClearAll, Dots} from '../shared/Icon';
import {Actions} from 'react-native-router-flux';
import Updatenearbystatus from '../Services/UpdateNearbystatus';
import SwipeablePanelView from './BottomPopup';
import {connect} from 'react-redux';
import {clearUserProfile, setUserProfile} from '../state/operations';
import ViewMoreText from 'react-native-view-more-text';
import moment from 'moment';
import {styles} from './index.styles';
const colors= [
  '#27BECF','#994F14','#DA291C','#FFCD00','#007A33','#EB9CA8', '#7C878E',
  '#8A004F','#000000','#10069F','#00a3e0','#4CC1A1','#915520', '#b3d962',
  '#67a8e0', '#c06dde', '#1ec952', '#cc1f36', '#0b615f', '#911c16'
]
class NotificationsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      NotificationDetails: [],
      swipeablePanelActive: false,
      SelectedData: [],
      showAlert: false,
      SuccessText: '',
    };
    global.NotificationsContainer = this;
  }
  _handleHeaderLeftIcon = () => {
    return null;
  };
  _handleHeaderRightIcon = () => {
    return (
      <View>
        <View style={styles.leftHeader}>
          <ClearAll style={{color: CommonStyles.appColor}} />
        </View>
        <Text style={{color: '#ffffff', textAlign: 'center', fontSize: 10}}>
          Clear All
        </Text>
      </View>
    );
  };
  _handleDeleteNotifications = () => {
    const {userProfile} = this.props;
    try {
      var dataToSend = {
        Id: 0,
        Touserid: global.LoginUserId,
        IsAllDelete: true,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/DeleteNotificationById', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          this.setState({NotificationDetails: []});
          this.setState({
            showAlert: true,
            SuccessText: 'Notifications deleted successfully',
          });
          setTimeout(() => {
            this.setState({
              SuccessText: '',
              showAlert: false,
            });
          }, 5000);
           this.GetUserNotifications();
          this.renderNotificationDetails();
          var obj = userProfile;
          obj.notificationcount = 0;
          this.props.clearUserProfile();
          this.props.setUserProfile(obj);
        });
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleHeaderRightIconPress = () => {
    var that = this;
    try {
      Alert.alert(
        'Are sure you want to delete?',
        'While deleting, Notification will no longer appear anywhere. Still you want to delete?',
        [
          {
            text: 'NO',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'YES', onPress: () => that._handleDeleteNotifications()},
        ],
      );
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleHeaderCenterIcon = () => {
    return (
      <View>
        <Text style={{color: '#ffffff', fontSize: 20, top:7}}>Notifications</Text>
      </View>
    );
  };
  _handleHeaderText = () => {
    return null;
  };
  GetUserNotifications = () => {
    try {
      const data = {UserId: global.LoginUserId};
      fetch(
        global.APIURL + `api/Card/GetUserNotifications?UserId=${data.UserId}`,
        {
          method: 'GET',
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          for (let i = 0; i < responseJson.length; i++) {
            var status = this.calculateDateDiff(
              responseJson[i].notificationDate,
            );
            responseJson[i].connectedStatus = status;
          }
          console.log("GetUserNotifications",responseJson.map(x=>x.notificationtype))
          this.setState({NotificationDetails: responseJson});
        });
    } catch (e) {
      Alert.alert(e);
    }
  };
  calculateDateDiff(NotificationDate) {
    if (NotificationDate == null) {
      return '';
    } else {
      const CurrentDate = moment.utc();
      const _acceptedDate = moment.utc(NotificationDate);
      var dateDiffInYears = _acceptedDate.diff(CurrentDate, 'years').toString();
      dateDiffInYears = dateDiffInYears.replace(/-/g, '');
      if (dateDiffInYears == 1) {
        return dateDiffInYears + 'y';
      }
      if (dateDiffInYears > 1) {
        return dateDiffInYears + 'y';
      }

      var dateDiffInMonths = _acceptedDate
        .diff(CurrentDate, 'months')
        .toString();
      dateDiffInMonths = dateDiffInMonths.replace(/-/g, '');
      if (dateDiffInMonths == 1) {
        return dateDiffInMonths + 'm';
      } else if (dateDiffInMonths > 1) {
        return dateDiffInMonths + 'm';
      }
      var dateDiffInDays = _acceptedDate.diff(CurrentDate, 'days').toString();
      dateDiffInDays = dateDiffInDays.replace(/-/g, '');
      if (dateDiffInDays == 1) {
        return dateDiffInDays + 'd';
      } else if (dateDiffInDays > 1 && dateDiffInDays < 7) {
        return dateDiffInDays + 'd';
      } else if (dateDiffInDays >= 7 && dateDiffInDays < 14) {
        return '1w';
      } else if (dateDiffInDays >= 14 && dateDiffInDays < 21) {
        return '2w';
      } else if (dateDiffInDays >= 21 && dateDiffInDays < 28) {
        return '3w';
      } else if (dateDiffInDays >= 28) {
        return '4w';
      }
      var dateDiffInHours = _acceptedDate.diff(CurrentDate, 'hour').toString();

      dateDiffInHours = dateDiffInHours.replace(/-/g, '');
      if (dateDiffInHours == 1) {
        return dateDiffInHours + 'h';
      } else if (dateDiffInHours > 1) {
        return dateDiffInHours + 'h';
      }
      var dateDiffInMinutes = _acceptedDate
        .diff(CurrentDate, 'minute')
        .toString();
      dateDiffInMinutes = dateDiffInMinutes.replace(/-/g, '');

      if (dateDiffInMinutes == 1) {
        return dateDiffInMinutes + 'm';
      } else if (dateDiffInMinutes > 1) {
        return dateDiffInMinutes + 'm';
      }
      var dateDiffInSeconds = _acceptedDate
        .diff(CurrentDate, 'second')
        .toString();
      dateDiffInSeconds = dateDiffInSeconds.replace(/-/g, '');

      if (dateDiffInSeconds > 0) {
        return 'now';
      }
    }
  }
  componentDidMount = () => {
    try {
      Updatenearbystatus.updateNearbyStatus(
        false,
        global.currentLongitude,
        global.currentLatitude,
      );
      this.GetUserNotifications();
    } catch (e) {
      Alert.alert(e);
    }
  };
  dotsPress = item => {
    console.log("Notificationdetails",item)
    this.setState({swipeablePanelActive: true, SelectedData: item});
  };
  _handleOnNotificationPress = data => {
    this.setState({SelectedData: data});
    if (!data.isread) {
      try {
        var dataToSend = {
          Id: data.id,
          Touserid: global.LoginUserId,
        };
        var formBody = [];
        for (var key in dataToSend) {
          var encodedKey = encodeURIComponent(key);
          var encodedValue = encodeURIComponent(dataToSend[key]);
          formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');
        fetch(global.APIURL + 'api/Card/updateNotificationIsread', {
          method: 'POST', //Request Type
          body: formBody, //post body
          headers: {
            //Header Defination
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
        })
          .then(response => response.json())
          .then(responseJson => {
            var _detailsOfNotifications = responseJson;
            this.props.clearUserProfile();
            this.props.setUserProfile(_detailsOfNotifications);
            var obj = this.state.NotificationDetails;
            obj.map(item => {
              if (item.id == data.id) {
                item.isread = true;
              }
            });
            this.setState({NotificationDetails: obj});
            this.renderNotificationDetails();
          });
      } catch (e) {
        Alert.alert(e);
      }
    }
  };
  renderViewMore(onPress) {
    return (
      <Text
        style={{
          color: '#d4d4d4',
          textAlign: 'right',
          right: 5,
          marginBottom: 2,
        }}
        onPress={onPress}>
        View more
      </Text>
    );
  }
  renderViewLess(onPress) {
    return (
      <Text
        style={{
          color: '#d4d4d4',
          textAlign: 'right',
          right: 5,
          marginBottom: 2,
        }}
        onPress={onPress}>
        View less
      </Text>
    );
  }
  renderNotificationDetails = () => {
    console.log("LengthOfNotifications",this.state.NotificationDetails.length)
    if (this.state.NotificationDetails.length == 0) {
      return (
        <View style={{flex: 1}}>
          <Text style={{textAlign: 'center'}}>No notifications found</Text>
        </View>
      );
    } else {
      return (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={this.state.NotificationDetails}
          renderItem={({item,index}) => {
            if (item.fromuserid != item.touserid) {
              return (
                <TouchableOpacity onPress={()=>{this._handleOnNotificationPress(item)}}>
                  <View
                    style={[
                      styles.notification_View,
                      {backgroundColor: item.isread ? '#f4f6f9' : '#ffffff'},
                    ]}>
                    <View
                      style={{
                        marginLeft: 10,
                        flex: 0.2,
                        right: 3,
                        alignSelf: 'center',
                      }}>
                      {this._renderImageData(item.userDetails,index)}
                    </View>
                    <View style={{flex: 1, alignContent: 'center'}}>
                      {item.notificationtype == 'MS' ? (
                        <View style={styles.notification_container}>
                          <View style={styles.notification_View}>
                            <View style={styles.notificationTitle_View}>
                              <MediumBoldText
                                style={{
                                  fontWeight: item.isread ? '900' : 'bold',
                                }}>
                                Meeting Invitation
                              </MediumBoldText>
                            </View>
                            <View style={styles.connectedStatus}>
                              <Text>{item.connectedStatus}</Text>
                            </View>
                            <View style={styles.dotsView}>
                              <TouchableOpacity
                                onPress={() => this.dotsPress(item)}>
                                <Dots />
                              </TouchableOpacity>
                            </View>
                          </View>

                          <ViewMoreText
                            numberOfLines={1}
                            renderViewMore={this.renderViewMore}
                            renderViewLess={this.renderViewLess}
                            afterExpand={() =>
                              this._handleOnNotificationPress(item)
                            }>
                            <Text>
                              {item.userDetails && item.userDetails[0] && item.userDetails[0].name ? item.userDetails[0].name :""} sent meeting
                              invitation. Please click the
                              <Text
                                onPress={() =>
                                  onPressNewMeetingInvitation(item.itemId)
                                }
                                style={{color: 'blue'}}>
                                {' '}
                                Link{' '}
                              </Text>
                              here to see the invitation.
                            </Text>
                          </ViewMoreText>
                        </View>
                      ) : null}
                      {item.notificationtype == 'F' ? (
                        <View style={styles.notification_container}>
                          <View style={styles.notifications_display}>
                            <View style={styles.notificationTitle_View}>
                              <MediumBoldText
                                style={{
                                  fontWeight: item.isread ? '900' : 'bold',
                                }}>
                                New Invitation
                              </MediumBoldText>
                            </View>
                            <View style={styles.connectedStatus}>
                              <Text>{item.connectedStatus}</Text>
                            </View>
                            <View style={styles.dotsView}>
                              <TouchableOpacity
                                onPress={() => this.dotsPress(item)}>
                                <Dots />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <ViewMoreText
                            numberOfLines={1}
                            renderViewMore={this.renderViewMore}
                            renderViewLess={this.renderViewLess}
                            afterExpand={() =>
                              this._handleOnNotificationPress(item)
                            }>
                            <Text>
                            {item.userDetails && item.userDetails[0] && item.userDetails[0].name ? item.userDetails[0].name :""} sent an invitation to
                              connect. Please click the
                              <Text
                                onPress={onPressNewInvitation}
                                style={{color: 'blue'}}>
                                {' '}
                                Link{' '}
                              </Text>
                              here to see the invitation.
                            </Text>
                          </ViewMoreText>
                        </View>
                      ) : null}
                      {item.notificationtype == 'S' ? (
                        <View style={styles.notification_container}>
                          <View style={styles.notifications_display}>
                            <View style={styles.notificationTitle_View}>
                              <MediumBoldText
                                style={{
                                  fontWeight: item.isread ? '900' : 'bold',
                                }}>
                                New Business Shoutout!
                              </MediumBoldText>
                            </View>
                            <View style={styles.connectedStatus}>
                              <Text>{item.connectedStatus}</Text>
                            </View>
                            <View style={styles.dotsView}>
                              <TouchableOpacity
                                onPress={() => this.dotsPress(item)}>
                                <Dots />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <ViewMoreText
                            numberOfLines={1}
                            renderViewMore={this.renderViewMore}
                            renderViewLess={this.renderViewLess}
                            afterExpand={() =>
                              this._handleOnNotificationPress(item)
                            }>
                            <Text>
                            {item.userDetails && item.userDetails[0] && item.userDetails[0].name ? item.userDetails[0].name :""} posted new business
                              shoutout. Please click the
                              <Text
                                onPress={() => onPressNewShoutout(item.itemId)}
                                style={{color: 'blue'}}>
                                {' '}
                                Link{' '}
                              </Text>
                              here to see the details.
                            </Text>
                          </ViewMoreText>
                        </View>
                      ) : null}
                      {item.notificationtype == 'RS' ? (
                        <View style={styles.notification_container}>
                          <View style={styles.notifications_display}>
                            <View style={styles.notificationTitle_View}>
                              <MediumBoldText
                                style={{
                                  fontWeight: item.isread ? '900' : 'bold',
                                }}>
                                Reshared Business Shoutout! 
                                {/* New Business Shoutout! */}
                              </MediumBoldText>
                            </View>
                            <View style={styles.connectedStatus}>
                              <Text>{item.connectedStatus}</Text>
                            </View>
                            <View style={styles.dotsView}>
                              <TouchableOpacity
                                onPress={() => this.dotsPress(item)}>
                                <Dots />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <ViewMoreText
                            numberOfLines={1}
                            renderViewMore={this.renderViewMore}
                            renderViewLess={this.renderViewLess}
                            afterExpand={() =>
                              this._handleOnNotificationPress(item)
                            }>
                            <Text>
                            {item.userDetails && item.userDetails[0] && item.userDetails[0].name ? item.userDetails[0].name :""} has Reshared the
                              business shoutout. Please click the
                              <Text
                                onPress={() => onPressNewShoutout(item.itemId)}
                                style={{color: 'blue'}}>
                                {' '}
                                Link{' '}
                              </Text>
                              here to see the details.
                            </Text>
                          </ViewMoreText>
                        </View>
                      ) : null}
                      {item.notificationtype == 'C' ? (
                        <View style={styles.notification_container}>
                          <View style={styles.notifications_display}>
                            <View style={styles.notificationTitle_View}>
                              <MediumBoldText
                                style={{
                                  fontWeight: item.isread ? '900' : 'bold',
                                }}>
                                Business Card Shared!
                              </MediumBoldText>
                            </View>
                            <View style={styles.connectedStatus}>
                              <Text>{item.connectedStatus}</Text>
                            </View>
                            <View style={styles.dotsView}>
                              <TouchableOpacity
                                onPress={() => this.dotsPress(item)}>
                                <Dots />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <ViewMoreText
                            numberOfLines={1}
                            renderViewMore={this.renderViewMore}
                            renderViewLess={this.renderViewLess}
                            afterExpand={() =>
                              this._handleOnNotificationPress(item)
                            }>
                            <Text>
                            {item.userDetails && item.userDetails[0] && item.userDetails[0].name ? item.userDetails[0].name :""} shared your business
                              card.
                            </Text>
                          </ViewMoreText>
                        </View>
                      ) : null}
                      {item.notificationtype == 'A' ? (
                        <View style={styles.notification_container}>
                          <View style={styles.notifications_display}>
                            <View style={styles.notificationTitle_View}>
                              <MediumBoldText
                                style={{
                                  fontWeight: item.isread ? '900' : 'bold',
                                }}>
                                Invitation Accepted!
                              </MediumBoldText>
                            </View>
                            <View style={styles.connectedStatus}>
                              <Text>{item.connectedStatus}</Text>
                            </View>
                            <View style={styles.dotsView}>
                              <TouchableOpacity
                                onPress={() => this.dotsPress(item)}>
                                <Dots />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <ViewMoreText
                            numberOfLines={1}
                            renderViewMore={this.renderViewMore}
                            renderViewLess={this.renderViewLess}
                            afterExpand={() =>
                              this._handleOnNotificationPress(item)
                            }>
                            <Text>
                            {item.userDetails && item.userDetails[0] && item.userDetails[0].name ? item.userDetails[0].name :""} has accepted your
                              invitation. Now you both are connected, please
                              click the{' '}
                              <Text
                                onPress={onPressCard}
                                style={{color: 'blue'}}>
                                {' '}
                                Link{' '}
                              </Text>
                              here to see his Business Card.
                            </Text>
                          </ViewMoreText>
                        </View>
                      ) : null}
                      {item.notificationtype == 'MA' ? (
                        <View style={styles.notification_container}>
                          <View style={styles.notifications_display}>
                            <View style={styles.notificationTitle_View}>
                              <MediumBoldText
                                style={{
                                  fontWeight: item.isread ? '900' : 'bold',
                                }}>
                                Meeting Accepted!
                              </MediumBoldText>
                            </View>
                            <View style={styles.connectedStatus}>
                              <Text>{item.connectedStatus}</Text>
                            </View>
                            <View style={styles.dotsView}>
                              <TouchableOpacity
                                onPress={() => this.dotsPress(item)}>
                                <Dots />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <ViewMoreText
                            numberOfLines={1}
                            renderViewMore={this.renderViewMore}
                            renderViewLess={this.renderViewLess}
                            afterExpand={() =>
                              this._handleOnNotificationPress(item)
                            }>
                            <Text>
                            {item.userDetails && item.userDetails[0] && item.userDetails[0].name ? item.userDetails[0].name :""} has accepted your
                              meeting invitation. Please click the{' '}
                              <Text
                                onPress={() => onMeetingAccepted(item.itemId)}
                                style={{color: 'blue'}}>
                                {' '}
                                Link{' '}
                              </Text>
                              here to see the details.
                            </Text>
                          </ViewMoreText>
                        </View>
                      ) : null}
                      {item.notificationtype == 'MD' ? (
                        <View style={styles.notification_container}>
                          <View style={styles.notifications_display}>
                            <View style={styles.notificationTitle_View}>
                              <MediumBoldText
                                style={{
                                  fontWeight: item.isread ? '900' : 'bold',
                                }}>
                                Meeting Declined!
                              </MediumBoldText>
                            </View>
                            <View style={styles.connectedStatus}>
                              <Text>{item.connectedStatus}</Text>
                            </View>
                            <View style={styles.dotsView}>
                              <TouchableOpacity
                                onPress={() => this.dotsPress(item)}>
                                <Dots />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <ViewMoreText
                            numberOfLines={1}
                            renderViewMore={this.renderViewMore}
                            renderViewLess={this.renderViewLess}
                            afterExpand={() =>
                              this._handleOnNotificationPress(item)
                            }>
                            <Text>
                            {item.userDetails && item.userDetails[0] && item.userDetails[0].name ? item.userDetails[0].name :""} has declined your
                              meeting invitation. Thank you for the invite, I
                              can't make it.Please click the the{' '}
                              <Text
                                onPress={() => onMeetingAccepted(item.itemId)}
                                style={{color: 'blue'}}>
                                {' '}
                                Link{' '}
                              </Text>
                              here to see the details.
                            </Text>
                          </ViewMoreText>
                        </View>
                      ) : null}
                      {item.notificationtype == 'MC' ? (
                        <View style={styles.notification_container}>
                          <View style={styles.notifications_display}>
                            <View style={styles.notificationTitle_View}>
                              <MediumBoldText
                                style={{
                                  fontWeight: item.isread ? '900' : 'bold',
                                }}>
                                Meeting Cancelled!
                              </MediumBoldText>
                            </View>
                            <View style={styles.connectedStatus}>
                              <Text>{item.connectedStatus}</Text>
                            </View>
                            <View style={styles.dotsView}>
                              <TouchableOpacity
                                onPress={() => this.dotsPress(item)}>
                                <Dots />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <ViewMoreText
                            numberOfLines={1}
                            renderViewMore={this.renderViewMore}
                            renderViewLess={this.renderViewLess}
                            afterExpand={() =>
                              this._handleOnNotificationPress(item)
                            }>
                            <Text>
                            {item.userDetails && item.userDetails[0] && item.userDetails[0].name ? item.userDetails[0].name :""} has cancelled your
                              meeting invitation. Sorry I have to cancel this
                              meeting, will reschedule later.
                            </Text>
                          </ViewMoreText>
                        </View>
                      ) : null}
                      {item.notificationtype == 'MT' ? (
                        <View style={styles.notification_container}>
                          <View style={styles.notifications_display}>
                            <View style={styles.notificationTitle_View}>
                              <MediumBoldText
                                style={{
                                  fontWeight: item.isread ? '900' : 'bold',
                                }}>
                                Meeting Accepted Tentatively!
                              </MediumBoldText>
                            </View>
                            <View style={styles.connectedStatus}>
                              <Text>{item.connectedStatus}</Text>
                            </View>
                            <View style={styles.dotsView}>
                              <TouchableOpacity
                                onPress={() => this.dotsPress(item)}>
                                <Dots />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <ViewMoreText
                            numberOfLines={1}
                            renderViewMore={this.renderViewMore}
                            renderViewLess={this.renderViewLess}
                            afterExpand={() =>
                              this._handleOnNotificationPress(item)
                            }>
                            <Text>
                            {item.userDetails && item.userDetails[0] && item.userDetails[0].name ? item.userDetails[0].name :""} has tentatively
                              accepted your meeting invitation. Thank you for
                              the invite, sorry, I have a conflict with other
                              meetings, will try to join late..Please click the the{' '}
                              <Text
                                onPress={() => onMeetingAccepted(item.itemId)}
                                style={{color: 'blue'}}>
                                {' '}
                                Link{' '}
                              </Text>
                              here to see the details.
                            </Text>
                          </ViewMoreText>
                        </View>
                      ) : null}
                      {item.notificationtype == 'MU' ? (
                        <View style={styles.notification_container}>
                          <View style={styles.notifications_display}>
                            <View style={styles.notificationTitle_View}>
                              <MediumBoldText
                                style={{
                                  fontWeight: item.isread ? '900' : 'bold',
                                }}>
                                Meeting Schedule Changed!
                              </MediumBoldText>
                            </View>
                            <View style={styles.connectedStatus}>
                              <Text>{item.connectedStatus}</Text>
                            </View>
                            <View style={styles.dotsView}>
                              <TouchableOpacity
                                onPress={() => this.dotsPress(item)}>
                                <Dots />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <ViewMoreText
                            numberOfLines={1}
                            renderViewMore={this.renderViewMore}
                            renderViewLess={this.renderViewLess}
                            afterExpand={() =>
                              this._handleOnNotificationPress(item)
                            }>
                            <Text>
                            {item.userDetails && item.userDetails[0] && item.userDetails[0].name ? item.userDetails[0].name :""} has changed meeting
                              schedule date. I have to rescheduled this
                              meeting,Sorry for the inconvenience!
                            </Text>
                          </ViewMoreText>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            } else {
              return null;
            }
          }}
        />
      );
    }
  };
  _renderImageData = (item,index) => {
    //var _profile = item[0].name.split(' ');
    if (item && item[0] && item[0].image && item[0].image !== '' && item[0].image !== null) {
      return (
        <View style={{flexDirection: 'row', position: 'relative'}}>
          <Thumbnail
            medium
            source={{
              uri:
                global.APIURL + 'uploadimgs/ProfilePictures/' + item[0].image,
            }}
          />
        </View>
      );
    }
    //return <Thumbnail medium source={Images.defaultProfile} />;
    else{
    return (
      <View style={{flexDirection: 'column',
      height: 55,
      width: 55,
      borderRadius: 110,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: colors[index%colors.length]}}>
        <MediumBoldText
          style={{
            fontSize: 22,
            color: '#ffffff',
            textAlign: 'center',
          }}>
          {/* {_profile[0].charAt(0) + _profile[1].charAt(0)} */}
          {(item[0] && item[0].initials && item[0].initials !== '' && item[0].initials !== null) ? item[0].initials : ''}
        </MediumBoldText>
      </View>
    );
        }
  };
  _handleOnCancelButtonPress = () => {
    this.setState({swipeablePanelActive: false});
  };
  _handleOnWipeOutButtonPress = data => {
    this.setState({SelectedData: data});
    if (!data.isread) {
      try {
        var dataToSend = {
          Id: data.id,
          Touserid: global.LoginUserId,
        };
        var formBody = [];
        for (var key in dataToSend) {
          var encodedKey = encodeURIComponent(key);
          var encodedValue = encodeURIComponent(dataToSend[key]);
          formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');
        fetch(global.APIURL + 'api/Card/updateNotificationIsread', {
          method: 'POST', //Request Type
          body: formBody, //post body
          headers: {
            //Header Defination
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
        })
          .then(response => response.json())
          .then(responseJson => {
            var _detailsOfNotifications = responseJson;
            this.props.clearUserProfile();
            this.props.setUserProfile(_detailsOfNotifications);
            var obj = this.state.NotificationDetails;
            obj.map(item => {
              if (item.id == data.id) {
                item.isread = true;
              }
            });
            this.setState({NotificationDetails: obj});
            this.renderNotificationDetails();
             const {userProfile} = this.props;
    this.setState({swipeablePanelActive: false});
    console.log("My Not Data",data)
    try {
      var dataToSend = {
        Id: data.id,
        Touserid: data.touserid,
        IsAllDelete: false,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/DeleteNotificationById', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          var obj = this.state.NotificationDetails;
          this.setState({
            NotificationDetails: obj.filter(list => {
              return list.id !== data.id;
            }),
            //this.GetBlockedInvitationList(UserId);
          });
          this.setState({
            showAlert: true,
            SuccessText: 'Notification deleted successfully',
          });
          setTimeout(() => {
            this.setState({
              SuccessText: '',
              showAlert: false,
            });
          }, 5000);
          this.GetUserNotifications();
          this.renderNotificationDetails();
          var obj = userProfile;
          let object = obj.notificationcount-1;
          obj.notificationcount = object;
         // this.props.clearUserProfile();
          this.props.setUserProfile(obj);
        });
    } catch (e) {
      Alert.alert(e);
    }
          });
      } catch (e) {
        Alert.alert(e);
      }
    }
    else {
      const {userProfile} = this.props;
    this.setState({swipeablePanelActive: false});
    console.log("My Not Data",data)
    try {
      var dataToSend = {
        Id: data.id,
        Touserid: data.touserid,
        IsAllDelete: false,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/DeleteNotificationById', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          var obj = this.state.NotificationDetails;
          this.setState({
            NotificationDetails: obj.filter(list => {
              return list.id !== data.id;
            }),
            //this.GetBlockedInvitationList(UserId);
          });
          this.setState({
            showAlert: true,
            SuccessText: 'Notification deleted successfully',
          });
          setTimeout(() => {
            this.setState({
              SuccessText: '',
              showAlert: false,
            });
          }, 5000);
          this.GetUserNotifications();
          this.renderNotificationDetails();
          var obj = userProfile;
          let object = obj.notificationcount-1;
          obj.notificationcount = object;
         // this.props.clearUserProfile();
          this.props.setUserProfile(obj);
        });
    } catch (e) {
      Alert.alert(e);
    }
    }
    // const {userProfile} = this.props;
    // this.setState({swipeablePanelActive: false});
    // console.log("My Not Data",data)
    // try {
    //   var dataToSend = {
    //     Id: data.id,
    //     Touserid: data.touserid,
    //     IsAllDelete: false,
    //   };
    //   var formBody = [];
    //   for (var key in dataToSend) {
    //     var encodedKey = encodeURIComponent(key);
    //     var encodedValue = encodeURIComponent(dataToSend[key]);
    //     formBody.push(encodedKey + '=' + encodedValue);
    //   }
    //   formBody = formBody.join('&');
    //   fetch(global.APIURL + 'api/Card/DeleteNotificationById', {
    //     method: 'POST', //Request Type
    //     body: formBody, //post body
    //     headers: {
    //       //Header Defination
    //       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    //     },
    //   })
    //     .then(response => response.text())
    //     .then(responseJson => {
    //       var obj = this.state.NotificationDetails;
    //       this.setState({
    //         NotificationDetails: obj.filter(list => {
    //           return list.id !== data.id;
    //         }),
    //         //this.GetBlockedInvitationList(UserId);
    //       });
    //       this.setState({
    //         showAlert: true,
    //         SuccessText: 'Notification deleted successfully',
    //       });
    //       setTimeout(() => {
    //         this.setState({
    //           SuccessText: '',
    //           showAlert: false,
    //         });
    //       }, 5000);
    //       this.GetUserNotifications();
    //       this.renderNotificationDetails();
    //       var obj = userProfile;
    //       let object = obj.notificationcount-1;
    //       obj.notificationcount = object;
    //      // this.props.clearUserProfile();
    //       this.props.setUserProfile(obj);
    //     });
    // } catch (e) {
    //   Alert.alert(e);
    // }
  };
  _handleHeaderProfileIcon = () => {
    const {userProfile} = this.props;
    return null;
  };
  _handleOnLinkPress = () => {
    Actions.businessShoutOut();
  };
  _handleOnPressNewInvitation = () => {
    const {userProfile} = this.props;
    Actions.manageInvitations({
      UserId: global.LoginUserId,
      UserProfile: userProfile,
    });
  };
  _handleOnPressCard = () => {
    var obj = this.state.SelectedData;
    Actions.viewCard({
      CUserId: obj.fromuserid,
      Theme: obj.userDetails[0].theme,
      LoggedUserId: global.LoginUserId,
    });
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#f4f6f9'}}>
        <View style={{flex: 0.18}}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => this._handleHeaderRightIcon()}
            HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
            HeaderRightIconPress={this._handleHeaderRightIconPress}
            HeaderText={() => this._handleHeaderText()}
            HeaderProfileIcon={() => this._handleHeaderProfileIcon()}
            HeaderProfileIconPress={this._handleHeaderProfileIconPress}
            IsShowTextForTabs={false}
          />
        </View>
        {this.state.showAlert ? (
          <View style={{marginLeft: 20, marginTop: 10}}>
            <Text style={{color: GilRoyMediumColor.fontColor}}>
              {this.state.SuccessText}
            </Text>
          </View>
        ) : null}
        <View style={{flex: 1, top: 5}}>
          {this.renderNotificationDetails()}
        </View>
        <View style={{flex: 0.13}}>
          <Footer />
        </View>
        <SwipeablePanelView
          onCancelButtonPress={this._handleOnCancelButtonPress}
          onWipeOutButtonPress={data => this._handleOnWipeOutButtonPress(data)}
          swipeablePanelActive={this.state.swipeablePanelActive}
          SelectedData={this.state.SelectedData}
        />
      </View>
    );
  }
}
const onPressNewMeetingInvitation = meetingId => {
  Actions.MeetingInvitations({
    MeetingId: meetingId,
  });
};
const onPressNewShoutout = ShoutoutId => {
  global.ConnectionsTabColor = LightGrayColor.fontColor;
  global.ChatTabColor = LightGrayColor.fontColor;
  global.MeetingsTabColor = LightGrayColor.fontColor;
  global.NotificationsTabColor = LightGrayColor.fontColor;
  global.ShoutoutTabColor = CommonStyles.appColor;
  Actions.businessShoutOut({Id: ShoutoutId, IsAll: false});
};
const onPressCard = () => {
  global.NotificationsContainer._handleOnPressCard();
};
const onPressNewInvitation = () => {
  global.NotificationsContainer._handleOnPressNewInvitation();
};
const onMeetingAccepted = meetingId => {
  Actions.ScheduleMetting({
    MeetingId: meetingId,
  });
};
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
)(NotificationsContainer);
