/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Text, MediumBoldText} from '../shared/Text';
import CommonHeader from '../shared/CommonHeader';
import Footer from '../shared/Footer';
import {Cancel, Dots} from '../shared/Icon';
import {Actions} from 'react-native-router-flux';
import SwipeablePanelView from './SwipableManageShoutout';
import ReadMore from 'react-native-read-more-text';
import moment from 'moment';
import {goBack} from '../Services/BackButtonServices';
import {connect} from 'react-redux';
class ManageShoutOuts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      swipeablePanelActive: false,
      SelectedData: [],
      MyShoutoutDetails: [],
    };
    global.ManageShoutOuts = this;
  }
  _handleHeaderLeftIcon = () => {
    return null;
  };
  _handleHeaderRightIcon = () => {
    return (
      <View>
        <View style={styles.leftHeader}>
          <Cancel style={{color: '#a4a6a9', fontSize: 20}} />
        </View>
        <Text style={{color: '#ffffff', textAlign: 'center', fontSize: 10}}>
          Cancel
        </Text>
      </View>
    );
  };
  _handleHeaderCenterIcon = () => {
    return (
      <View style={{alignContent: 'center'}}>
        <Text style={{color: '#ffffff', textAlign: 'center', fontSize: 18}}>
          Manage Shoutouts
        </Text>
      </View>
    );
  };
  _handleHeaderText = () => {
    return null;
  };
  _handleHeaderRightIconPress = () => {
    Actions.businessShoutOut({Id: 0, IsAll: true});
    //const {handleGoBack} = this.props;
    //handleGoBack();
  };
  renderShoutoutData = data => {
    if (data.userid == global.LoginUserId) {
      return (
        <View
          style={{
            flex: 1,
            borderBottomWidth: 0.5,
            borderColor: '#a4a6a9',
            borderBottomStartWidth: 20,
            borderBottomEndWidth: 20,
            margin: 10,
          }}>
          <View
            style={{
              flex: 0.2,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{flex: 1.5}}>
              <MediumBoldText>{data.shoutoutTitle}</MediumBoldText>
            </View>
            <View style={{flex: 0.13, top: 5}}>
              <Text>{data.connectedStatus}</Text>
            </View>
            <View style={{flex: 0.13, flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => this._handleOpenBottomPanel(data)}>
                <Dots />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 0.8, flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <ReadMore numberOfLines={2}>
                <Text>{data.text}</Text>
              </ReadMore>
            </View>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };
  _handleOpenBottomPanel = data => {
    this.setState({swipeablePanelActive: true, SelectedData: data});
  };
  _handleOnEditIconPress = () => {
    const {userProfile} = this.props;
    this.setState({swipeablePanelActive: false});
    Actions.editShoutout({
      SelectedData: this.state.SelectedData,
      userProfile: userProfile,
    });
  };
  _handleOnCancelButtonPress = () => {
    this.setState({swipeablePanelActive: false});
  };
  _handleGetMyShoutouts = () => {
    try {
      const data = {UserId: global.LoginUserId};
      fetch(
        global.APIURL + `api/Card/GetMyShoutouts?LoginUserId=${data.UserId}`,
        {
          method: 'GET',
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          for (let i = 0; i < responseJson.length; i++) {
            var status = this.calculateDateDiff(responseJson[i].updateddate);
            responseJson[i].connectedStatus = status;
          }
          this.setState({
            MyShoutoutDetails: responseJson,
          });
        });
    } catch (e) {
      Alert.alert(e.message);
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
      this._handleGetMyShoutouts();
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  _handleOnWipeOutButtonPress = data => {
    this.setState({swipeablePanelActive: false});
    try {
      var dataToSend = {
        Id: data.id,
        Userid: data.userid,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/DeleteUserShoutout', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(() => {
          //responseJson;
          this._handleGetMyShoutouts();
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  _handleHeaderProfileIcon = () => {
    return null;
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#f4f6f9'}}>
        <View style={{flex: 0.18}}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => this._handleHeaderRightIcon()}
            HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
            HeaderText={() => this._handleHeaderText()}
            HeaderLeftIconPress={this._handleHeaderLeftIconPress}
            HeaderRightIconPress={this._handleHeaderRightIconPress}
            HeaderProfileIcon={() => this._handleHeaderProfileIcon()}
            HeaderProfileIconPress={this._handleHeaderProfileIconPress}
            IsShowTextForTabs={false}
          />
        </View>
        <View style={{flex: 1}}>
          <FlatList
            showsVerticalScrollIndicator={true}
            data={this.state.MyShoutoutDetails}
            renderItem={shoutoutdata =>
              this.renderShoutoutData(shoutoutdata.item)
            }
          />
        </View>
        <SwipeablePanelView
          onEditIconPress={data => this._handleOnEditIconPress(data)}
          onCancelButtonPress={this._handleOnCancelButtonPress}
          onWipeOutButtonPress={data => this._handleOnWipeOutButtonPress(data)}
          swipeablePanelActive={this.state.swipeablePanelActive}
          SelectedData={this.state.SelectedData}
        />
        <View style={{flex: 0.13}}>
          <Footer />
        </View>
      </View>
    );
  }
}
const mapDispatchToProps = {
  handleGoBack: goBack,
};

export default connect(
  null,
  mapDispatchToProps,
)(ManageShoutOuts);
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
});
