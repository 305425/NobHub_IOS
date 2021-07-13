import React, { Component } from 'react';
import { connect } from 'react-redux';
import { goBack } from '../Services/BackButtonServices';
import CommonHeader from '../shared/CommonHeader';
import { styles } from './MeetingStyles';
import Button from '../shared/Button';
import { MediumBoldText } from '../shared/Text';
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Image,
  Text
} from 'react-native';
import { BoldText } from '../shared/Text';
import moment from 'moment';
import {
  CommonStyles,
  GilRoyRegularColor,
  GilRoyMediumColor,
} from '../shared/Constants';
import { Thumbnail } from 'native-base';
import { ArrowLeft, Search, CircleCheck, X, Closecircle } from '../shared/Icon';
import { AlertClass } from '../shared/CustomAlert';
import crossLogo from '../Images/cross.png';
import { _ } from 'lodash';
const colors = [
  '#27BECF', '#994F14', '#DA291C', '#FFCD00', '#007A33', '#EB9CA8', '#7C878E',
  '#8A004F', '#000000', '#10069F', '#00a3e0', '#4CC1A1', '#915520', '#b3d962',
  '#67a8e0', '#c06dde', '#1ec952', '#cc1f36', '#0b615f', '#911c16'
]
class Meetingusers extends Component {
  _menu = null;
  constructor(props) {
    super(props);
    this.state = {
      MeetingUsersList: [],
      tempMeetingusers: [],
      selectedUserIds: [],
      SelectedUsersObj: [],
      ShownoOfRes: false,
      IsCancel: false,
      SearchText: '',
      AddPeopleList: [],
      IsShowAlertAlreadySelected: false,
    };
    global.Meetingusers = null;
    this.searchTextInput = React.createRef();
  }

  _handleBackPress = () => {
    const { handleGoBack } = this.props;
    handleGoBack();
  };

  componentDidMount() {
    //  global.scheduleMeetings.state.AttendeesList.splice(0, global.scheduleMeetings.state.AttendeesList.length)
    console.log("MYUsers", this.state.AddPeopleList)
    const { AlreadyAttendees, ScheduleDate } = this.props;
    var existattendees = [];
    if (AlreadyAttendees != null && AlreadyAttendees != '') {
      existattendees = AlreadyAttendees;
    }
    try {
      var dataToSend = {
        UserId: global.LoginUserId,
        Scheduledate: ScheduleDate,
        TimezoneMinutes: moment().zone(),
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/GetMeetingUsers', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          var obj = responseJson;
          existattendees.forEach(element => {
            obj = obj.filter(list => {
              return list.userId != element.userId;
            });
          });
          this.setState({ MeetingUsersList: obj, tempMeetingusers: obj });
        })
        .catch(error => Alert.alert(error));
    } catch (e) {
      Alert.alert(e);
    }
  }
  _handleHeaderLeftIcon = () => {
    //  return null;
    return (
      <View style={styles.BgIconStyle}>
        <ArrowLeft style={{ color: CommonStyles.appColor, fontSize: 20 }} />
      </View>
    );
  };

  _renderContactDetails = item => {
    return (
      <View style={{ flex: 3, marginLeft: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 4 }}>
            <View style={{ flexDirection: 'column' }} />
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ flex: 1 }}>
                <MediumBoldText style={styles.textName}>
                  {item.displayname}
                </MediumBoldText>
              </View>
            </View>
            <Text
              style={{
                color: GilRoyRegularColor.fontColor,
                fontSize: 12,
                paddingBottom: 5,
              }}>
              {item.title + ',' + item.companyname}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  _renderImageData = (item, index) => {
    if (item.image !== '' && item.image !== null) {
      return (
        <Thumbnail
          medium
          source={{
            uri: global.APIURL + 'uploadimgs/ProfilePictures/' + item.image,
          }}
        />
      );
    }
    return (
      <View style={{
        flexDirection: 'column',
        height: 55,
        width: 55,
        borderRadius: 110,
        justifyContent: 'center',
        backgroundColor: colors[index % colors.length]
      }}>
        <Text
          style={{
            fontSize: 26,
            color: '#ffffff',
            textAlign: 'center',
          }}>
          {item.initials}
        </Text>
      </View>
    );
  };
  _renderStatus = item => {
    return (
      <View style={styles.statustyle}>
        {item.outofoffice ? (
          <Text
            style={{
              textAlign: 'center',
              color: '#ffffff',
              alignSelf: 'center',
            }} numb>
            Out of office
          </Text>
        ) : (
          <View>
            {item.isBusy ? (
              <Text
                style={{
                  textAlign: 'center',
                  color: '#ffffff',
                  alignSelf: 'center',
                }}>
                Busy
              </Text>
            ) : (
              <Text style={{ color: '#ffffff', alignSelf: 'center' }}>
                Available
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };
  _handleOnContactPress = item => {
    const userIndex = this.state.selectedUserIds.indexOf(item.userId);
    if (userIndex != -1) {
      this.setState({ IsShowAlertAlreadySelected: true });
    } else {
      this.selectContact(item, true);
    }
    // if (this.state.selectedUserIds.length > 0) {
    //   this.selectContact(item, false);
    // }
  };
  _hadleOnContactLongPress = item => {
    if (this.state.selectedUserIds.length === 0) {
      this.selectContact(item, true);
    }
  };
  _handleUnselectContact = item => {
    this.selectContact(item, false);
  };
  selectContact = (item, Isselected) => {
    var MeetingMembersList = this.state.MeetingUsersList;
    var selectedUserIds = this.state.selectedUserIds;
    if (Isselected == true) {
      MeetingMembersList.map(data => {
        if (data.userId == item.userId) {
          data.check = !data.check;
          //  selectedUserIds.push(data.userId);
          selectedUserIds = _.concat(data.userId, selectedUserIds)
          global.scheduleMeetings.state.AttendeesList = _.concat(data, global.scheduleMeetings.state.AttendeesList);
        }
        console.log("Data1", selectedUserIds)
      });
    } else if (Isselected == false) {
      //  var index = selectedUserIds.indexOf(data.userId);
      //  selectedUserIds.splice(index, 1);
      //  var idx = this.state.SelectedUsersObj.indexOf(data.userId);
      //  global.scheduleMeetings.state.AttendeesList.splice(index, 1);
      global.scheduleMeetings.state.AttendeesList.forEach(function (
        itemdata,
        index,
        object,
      ) {
        console.log("Data2", object)
        if (itemdata.userId == item.userId) {
          itemdata.check = !itemdata.check;
          object.splice(index, 1);
          var index = selectedUserIds.indexOf(itemdata.userId);
          selectedUserIds.splice(index, 1);
        }
      });
    }

    this.setState({
      MeetingUsersList: MeetingMembersList,
      selectedUserIds: selectedUserIds,
    });
    global.scheduleMeetings.setState({
      AttendeesList: global.scheduleMeetings.state.AttendeesList,
    });
  };
  _handleOnTextInputFocus = () => {
    this.setState({ IsCancel: true });
  };
  ClearYesprofiles = () => {
    this.setState({
      IsCancel: false,
      MeetingUsersList: this.state.tempMeetingusers,
      SearchText: '',
      ShownoOfRes: false,
      SearchCount: '',
    });
    this.searchTextInput.current.blur();
  };
  _handleMyContactSearch = value => {
    this.setState({ ShownoOfRes: false, IsCancel: false, SearchText: value });
    if (value != '' && value != null) {
      this.setState({ ShownoOfRes: true, IsCancel: true });
    }
    var searchItems = value
      .trim()
      .toLowerCase()
      .split(' ');
    value = value.trim().toLowerCase();
    var ContactsData = [];
    ContactsData = this.state.tempMeetingusers.filter(contact => {
      if (
        searchItems.filter(
          x =>
            (contact.displayname != null &&
              contact.displayname.toLowerCase().indexOf(x) === 0) ||
            (contact.mobile != null &&
              contact.mobile.toLowerCase().includes(x)),
        ).length > 0
      ) {
        return true;
      }
    });
    this.setState({
      MeetingUsersList: ContactsData,
      SearchCount: ContactsData.length,
    });
  };
  _handleHeaderCenterIcon = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: '#ffffff',
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          width: Dimensions.get('window').width * 0.56,
          top: 2
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 10,
            flex: 0.1,
          }}>
          <Search style={{ color: '#a9a9a9', fontSize: 20 }} />
        </View>
        <View style={{ flex: 0.8, flexDirection: 'row', height: 38 }}>
          <TextInput
            ref={this.searchTextInput}
            underlineColor="transparent"
            placeholder="Name/Phone number"
            placeholderTextColor={'#a9a9a9'}
            onChangeText={value => this._handleMyContactSearch(value)}
            value={this.state.SearchText}
            onFocus={() => this._handleOnTextInputFocus()}
          />
        </View>
        <View
          style={{
            flex: 0.1,
            // marginTop: 10,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10
          }}>
          {this.state.IsCancel ? (
            <TouchableOpacity onPress={() => this.ClearYesprofiles()}>
              <X style={{ color: '#a9a9a9', fontSize: 18 }} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  _handleHeaderLeftIconPress = () => {
    const { handleGoBack } = this.props;
    handleGoBack();
  };
  SelecteUsersPress = () => {
    global.scheduleMeetings.setState({
      AttendeesList: global.scheduleMeetings.state.AttendeesList,
      AttendeesDynamicHeight:
        global.scheduleMeetings.state.AttendeesList.length > 3 ? 180 : null,
    });
    this._handleHeaderLeftIconPress();
  };
  _handleHeaderText = () => {
    return (
      <View style={{ flex: 1, bottom: 3 }}>
        <BoldText
          style={{
            color: '#ffff',
            fontSize: 20,
            textAlign: 'center',
            alignItems: 'center',
          }}>
          Add Attendee
        </BoldText>
      </View>
    );
  };
  _renderContactImage = (item, index) => {
    if (item.image !== '' && item.image !== null) {
      return (
        <View style={{ flexDirection: 'row', position: 'relative' }}>
          <TouchableOpacity onPress={() => this._handleUnselectContact(item)}>
            <View style={{ height: 80 }}>
              <Thumbnail
                medium
                source={{
                  uri:
                    global.APIURL + 'uploadimgs/ProfilePictures/' + item.image,
                }}
              />
              <Image source={crossLogo} style={{ height: 25, width: 25, flex: 1, position: 'absolute', alignSelf: "flex-end", left: 40 }} />
              <View
                style={{
                  position: 'absolute',
                  top: 35,
                  borderRadius: 50,
                  backgroundColor: '#ffffff',
                  left: 45,
                }}>
                {/* <Closecircle style={{color: 'lightgray', fontSize: 16}} /> */}

              </View>
              <Text style={{ fontSize: 14 }}>
                {item.name.length > 8
                  ? item.name.substring(0, 8) + '...'
                  : item.name}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <TouchableOpacity onPress={() => this._handleUnselectContact(item)}>
            <View style={{
              flexDirection: 'column',
              height: 55,
              width: 55,
              borderRadius: 110,
              justifyContent: 'center',
              backgroundColor: colors[index % colors.length]
            }}>
              <MediumBoldText
                style={{
                  fontSize: 26,
                  color: '#ffffff',
                  textAlign: 'center',
                }}>
                {item.initials}
              </MediumBoldText>
              <Image source={crossLogo} style={{ height: 25, width: 25, flex: 1, position: 'absolute', alignSelf: "flex-end", left: 40, bottom: 30 }} />
              <View
                style={{
                  position: 'absolute',
                  top: 35,
                  borderRadius: 50,
                  backgroundColor: '#ffffff',
                  left: 42,
                }}>
                {/* <Closecircle style={{color: 'lightgray', fontSize: 16}} /> */}
              </View>
            </View>
            <Text
              style={{
                fontSize: 14,
              }}>
              {item.name.length > 8
                ? item.name.substring(0, 8) + '...'
                : item.name}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };
  render() {
    let userData = global.scheduleMeetings.state.AttendeesList.filter(e => this.state.MeetingUsersList.includes(e))
    console.log("UserData", userData)
    return (
      <View style={{ backgroundColor: '#f4f6f9', flex: 1 }}>
        <View style={{ flex: 0.2 }}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => {
              return null;
            }}
            HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
            HeaderLeftIconPress={this._handleBackPress}
            HeaderText={() => this._handleHeaderText()}
            HeaderProfileIcon={() => {
              return null;
            }}
            HeaderProfileIconPress={() => {
              return null;
            }}
            IsShowTextForTabs={false}
          />
        </View>
        {this.state.ShownoOfRes ? (
          <View>
            <Text
              style={{
                fontSize: 17,
                color: GilRoyMediumColor.fontColor,
                marginBottom: 15,
              }}>
              Found Contacts({this.state.SearchCount})
            </Text>
          </View>
        ) : null}
        <View
          style={{
            borderBottomColor: 'lightgray',
            marginBottom: 10,
            marginTop: 10,
            marginLeft: 10,
          }}>
          <FlatList
            horizontal
            // data={global.scheduleMeetings.state.AttendeesList}
            data={userData}
            renderItem={({ item, index }) => (
              <View
                style={{
                  // marginLeft: 10,
                  marginRight: 15,
                  borderBottomColor: 'lightgray',
                }}>
                {this._renderContactImage(item, index)}
              </View>
            )}
          />
        </View>
        <View style={{ flex: 0.75 }}>
          <FlatList
            data={this.state.MeetingUsersList}
            keyboardShouldPersistTaps={'always'}
            keyboardDismissMode={'interactive'}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => this._handleOnContactPress(item)}
                onLongPress={() => this._hadleOnContactLongPress(item)}>
                <View style={styles.viewContactContainer}>
                  <View style={[styles.viewContact]}>
                    {this._renderImageData(item, index)}
                    <View>
                      {item.check ? (
                        <View style={styles.Tickmark}>
                          <CircleCheck
                            style={{ color: CommonStyles.appColor, fontSize: 15 }}
                          />
                        </View>
                      ) : null}
                    </View>
                    {this._renderContactDetails(item)}
                    {this._renderStatus(item)}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={{ flex: 0.1 }}>
          <Button
            style={{ marginTop: 5 }}
            touchableOpacity={styles.CreateNeGroupStyle}
            buttonTitle={'Select'}
            onButtonPress={() => this.SelecteUsersPress()}
          />
        </View>
        <View>
          <AlertClass
            AlertMessage={'You are  already  selected'}
            OkButtonText={'OK'}
            // CancelButtonText={'Cancel'}
            showAlert={this.state.IsShowAlertAlreadySelected}
            onOkPress={() => {
              this.setState({ IsShowAlertAlreadySelected: false });
            }}
          />
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
)(Meetingusers);
