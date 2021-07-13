import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {goBack} from '../Services/BackButtonServices';
import CommonHeader from '../shared/CommonHeader';
import FloatingInput from '../shared/FloatingTextInput';
import {BoldText, MediumBoldText} from '../shared/Text';
import {PlusCircle, BottomChatIcon, Person, Close, Block, Cancel} from '../shared/Icon';
import {styles} from './MeetingStyles';
import ServiceCalls from '../Services/APICalls';
import Footer from '../shared/Footer';
import {CommonStyles} from '../shared/Constants';
import {Thumbnail} from 'native-base';
import {Calendar} from 'react-native-calendars';
import crossLogo from '../Images/cross.png';
import Communications from 'react-native-communications';
import Hyperlink from 'react-native-hyperlink';
import { EventRegister } from 'react-native-event-listeners';
//import Calendar from 'react-native-calendar';
import moment from 'moment';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  TouchableHighlight,
  TextInput,
  Keyboard,
  Image,
  Text,
  Dimensions,
  Linking
} from 'react-native';
import Button from '../shared/Button';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  ArrowLeft,
  Closecircle,
  SkypeIcon,
  HangoutsIcon,
  Phone,
  Questioncircleo,
  Circlcheckbox,
  Edit,
  X,
} from '../shared/Icon';
import image from '../Images';
import SwipeablePanel from 'rn-swipeable-panel';
import {ScrollView} from 'react-native-gesture-handler';
import Tooltip from 'react-native-walkthrough-tooltip';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const colors = [
  '#27BECF', '#994F14', '#DA291C', '#FFCD00', '#007A33', '#EB9CA8', '#7C878E',
  '#8A004F', '#000000', '#10069F', '#00a3e0', '#4CC1A1', '#915520', '#b3d962',
  '#67a8e0', '#c06dde', '#1ec952', '#cc1f36', '#0b615f', '#911c16'
]

class ScheduleMeeting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      StartTimePickerVisible: false,
      EndTimePickerVisible: false,
      MeetingDate: '',
      swipeablePanelActive: false,
      AttendeesList: [],
      Title: '',
      Message: '',
      Location: '',
      ScheduleDate: '',
      MeetingStartTime: '',
      LocationPanelActive: false,
      IsEditable: false,
      MeetingId: 0,
      SchedulingMeeting: false,
      StartTimeString: '',
      EndtimeString: '',
      Datestring: '',
      MeetingsURLpopup: false,
      meetingURL: '',
      maxlength: '',
      cancelORSendBtnDisable: false,
      MeetingURLType: '',
      ZoomMeetingURL: '',
      SkypeMeetingURL: '',
      HangoutMeetingURL: '',
      GoogleLocation: '',
      PhoneNumber: '',
      PrevTitle: '',
      PrevMessage: '',
      PrevScheduledate: '',
      PrevStartTimeString: '',
      PrevEndTimeString: '',
      PrevLocation: '',
      AttendeesDynamicHeight: null,
      IsCheck: false,
      isMoreVisible: false
    };
    global.scheduleMeetings = this;
  }

  componentDidMount() {
    const {
      AttendeeData,
      ConnGrpId,
      AttendeesFromgrpMembers,
      MeetingId,
      SchedulingMeeting,
    } = this.props;
    if (AttendeeData != null && AttendeeData != '') {
      this.setState({AttendeesList: AttendeeData});
    }
    if (AttendeesFromgrpMembers != null && AttendeesFromgrpMembers != '') {
      this.setState({AttendeesList: AttendeesFromgrpMembers});
    }

    if (ConnGrpId != null && ConnGrpId != '') {
      ServiceCalls.handleGetGroupMembersById(ConnGrpId).then(response => {
        this.setState({AttendeesList: response});
      });
    }
    if (SchedulingMeeting) {
      this.setState({
        IsEditable: false,
        ButtonText: 'Send Invite',
        PhoneNumber: global.PhoneNumber,
      });
    }
    if (MeetingId != undefined || MeetingId != null) {
      this.setState({
        IsEditable: true,
        ButtonText: 'Cancel Meeting',
        MeetingId: MeetingId,
      });
      this.GetMeetingInfo(MeetingId);
    }
    if (this.state.AttendeesList.length > 3) {
      this.setState({AttendeesDynamicHeight: 180});
    }
  }
  GetMeetingInfo = MeetingId => {
    try {
      var dataToSend = {
        Userid: global.LoginUserId,
        Meetingid: MeetingId,
        TimezoneMinutes: moment().zone(),
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/AttendeesInInvitation', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
      
        .then(responseJson => {
          this.setState({
            Title: responseJson.title,
            PrevTitle: responseJson.title,
            Message: responseJson.message,
            PrevMessage: responseJson.message,
            ScheduleDate: responseJson.scheduledate,
            PrevScheduledate: moment(responseJson.scheduledate).format(
              'YYYY-MM-DD',
            ),
            MeetingDate: moment(responseJson.scheduledate).format('YYYY-MM-DD'),
            Datestring:
              moment(responseJson.scheduledate).format('MMM DD YYYY ddd') + ' ',
            MeetingMinutes: responseJson.meetingMinutes,
            StartTimeString: moment(responseJson.scheduledate).format('h:mm A'),
            PrevStartTimeString: moment(responseJson.scheduledate).format(
              'h:mm A',
            ),
            EndtimeString:
              ' - ' +
              moment(responseJson.scheduledate)
                .add(responseJson.meetingMinutes, 'minutes')
                .format('h:mm A'),
            PrevEndTimeString:
              ' - ' +
              moment(responseJson.scheduledate)
                .add(responseJson.meetingMinutes, 'minutes')
                .format('h:mm A'),
            AttendeesList: responseJson.attendees,
            Location: responseJson.location,
            PrevLocation: responseJson.location,
          });
          if (this.state.AttendeesList.length > 3) {
            this.setState({AttendeesDynamicHeight: 180});
          }
          if (responseJson.meetingurltype == 'Z') {
            this.setState({ZoomMeetingURL: responseJson.location});
          } else if (responseJson.meetingurltype == 'H') {
            this.setState({HangoutMeetingURL: responseJson.location});
          } else if (responseJson.meetingurltype == 'S') {
            this.setState({SkypeMeetingURL: responseJson.location});
          } else if (responseJson.meetingurltype == 'P') {
            this.setState({PhoneNumber: responseJson.location});
          }
          if (
            moment(responseJson.scheduledate).format('YYYY-MM-DD') <
            moment().format('YYYY-MM-DD')
          ) {
            this.setState({cancelORSendBtnDisable: true});
          }
        })
        .catch(error => Alert.alert(error));
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleHeaderLeftIcon = () => {
    const {SchedulingMeeting} = this.props;
    if (SchedulingMeeting) {
      return (
        <View style={styles.BgIconStyle}>
          <ArrowLeft style={{color: CommonStyles.appColor, fontSize: 20}} />
        </View>
      );
    } else {
      if (this.state.IsEditable) {
        return (
          <View style={styles.BgIconStyle}>
            <ArrowLeft style={{color: CommonStyles.appColor, fontSize: 20}} />
          </View>
        );
      } else {
        // return <Closecircle style={{color: '#ffffff', fontSize: 20}} />;
        return <Image source={crossLogo} style={{ height:30, width:30}} />
      }
    }
  };
  _handleHeaderRightIcon = () => {
    return (
      <View>
        {this.state.IsEditable &&
        moment(this.state.ScheduleDate).format('YYYY-MM-DD') >=
          moment().format('YYYY-MM-DD') ? (
          <TouchableOpacity onPress={() => this.EditIconPress()}>
            <View style={styles.BgIconStyle}>
            <Edit style={{color:  CommonStyles.appColor, fontSize: 20}} />
            </View>
            <Text style={{fontSize: 10, color: '#ffffff', textAlign: 'center'}}>
          Edit
        </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };
  _handleHeaderLeftIconPress = () => {
    const {handleGoBack} = this.props;
    EventRegister.emit('myCustomEvent', this.state.MeetingDate)
    handleGoBack();
  };
  _handleHeaderCenterIcon = () => {
    const {SchedulingMeeting} = this.props;
    if (SchedulingMeeting) {
      return (
        <View
          style={{
            flexDirection: 'row',
            width:windowWidth/2,
            flex:1
          }}>
          <MediumBoldText style={{color: '#ffffff', fontSize: 19,alignSelf:"center", left:30}}>
            Schedule Meeting
          </MediumBoldText>
        </View>
      );
    } else {
      if (this.state.IsEditable) {
        return (
          <View style={{flexDirection: 'row',width:windowWidth/1.7,flex:1}}>
            <MediumBoldText style={{color: '#ffffff', fontSize: 19,alignSelf:"center", left:30}}>
              Schedule Meeting
            </MediumBoldText>
          </View>
        );
      } else {
        return (
          <View style={{flexDirection: 'column'}}>
            <MediumBoldText style={{color: '#ffffff', fontSize: 20}}>
              Edit Meeting
            </MediumBoldText>
          </View>
        );
      }
    }
  };
  DatetimeOnPress = () => {
    Keyboard.dismiss();
    this.setState({swipeablePanelActive: true});
  };
  ondatepress = itemdate => {
    this.setState({
      Datestring: moment(itemdate.dateString).format('MMM DD YYYY ddd') + ' ',
      MeetingDate: moment(itemdate.dateString).format('YYYY-MM-DD'),
      StartTimePickerVisible: true,
    });
  };
  closePanel = () => {
    this.setState({swipeablePanelActive: false});
  };
  _handleUnselectContact = item => {
    this.press(item);
  };
  DeleteUserIds = UserId => {
    this.state.AttendeesList.forEach(function(item, index, object) {
      if (item.userId == UserId) {
        object.splice(index, 1);
      }
    });
    this.setState({AttendeesList: this.state.AttendeesList});
  };
  press = data => {
    var user = this.state.AttendeesList;
    user = user.filter(x => {
      return x.userId != data.userId;
    });
    this.setState({AttendeesList: user});
  };
  _renderAttendeeDetails = (item,index) => {
    return (
      <View style={{flex: 1, flexDirection: 'row', marginLeft: 10}}>
        <View style={{flex: 0.15}}>
          {item.image != null && item.image != '' ? (
            <Thumbnail
              medium
              source={{
                uri: global.APIURL + 'uploadimgs/ProfilePictures/' + item.image,
              }}
            />
          ) : (
            <View style={{height: 60,
              width: 60,
              borderRadius: 120,
              justifyContent: 'center',
              backgroundColor: colors[index%colors.length]}}>
              <Text
                style={{
                  fontSize: 26,
                  color: '#ffffff',
                  textAlign: 'center',
                }}>
                {item.initials}
              </Text>
            </View>
          )}
        </View>
        <View style={{flex: 0.75}}>
          <BoldText style={[styles.textName, {textAlignVertical: 'center',top:5, left:25}]}>
            {item.name}
          </BoldText>
          {!this.state.isMoreVisible ? (
          <Text onPress={()=>this.setState({isMoreVisible:!this.state.isMoreVisible})} 
            style={{fontSize: 15, marginLeft: 10, top:10, left:15}} numberOfLines={1}>
            {item.optionalMessage}
          </Text>
          ):(
            <Text onPress={()=>this.setState({isMoreVisible:!this.state.isMoreVisible})} 
            style={{fontSize: 15, marginLeft: 10, top:10, left:15}}>
            {item.optionalMessage}
          </Text> 
          )}
        </View>
        {!this.state.IsEditable ? (
          <View style={{flex: 0.2,top:15, left:10}}>
            <TouchableOpacity onPress={() => this.DeleteUserIds(item.userId)}>
              {/* <Closecircle
                style={{color: CommonStyles.appColor, fontSize: 20}}
              /> */}
              <Image source={crossLogo} style={{ height:30, width:30}} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{flex: 0.2,top:15, left:10}}>
            {item.status == 'A' ? (
              <Circlcheckbox
                style={{
                  color: 'green',
                  fontSize: 30,
                  marginRight: 10,
                }}
              />
            ) : null}
            {item.status == 'D' ? (
              // <Closecircle
              //   style={{color: 'red', fontSize: 25, marginRight: 10}}
              // />
              <Image source={crossLogo} style={{ height:30, width:30}} />
            ) : null}
            {item.status == 'T' ? (
              <Questioncircleo
                style={{color: 'blue', fontSize: 25}}
              />
            ) : null}
            {item.status == 'Author' ? (
              <Text style={{alignSelf: 'center'}}>(Author)</Text>
            ) : null}
          </View>
        )}
      </View>
    );
  };
  savemeetings() {
    var IsUpdatedExceptUserIds = false;
    if (this.state.Title == '') {
      alert('Please Enter Title');
    } else if (this.state.Message == '') {
      alert('Please Enter Message');
    } else if (this.state.StartTimeString == '') {
      alert('Please Enter Meeting Start time');
    } else if (this.state.EndtimeString == '') {
      alert('Please Enter Meeting End time');
    } else if (this.state.AttendeesList.length == 0) {
      alert('Please Select Attendee');
    } else if (this.state.Location == '') {
      alert('Please Enter Location');
    } else {
      if (
        this.state.PrevTitle != this.state.Title ||
        this.state.PrevMessage != this.state.Message ||
        this.state.PrevScheduledate != this.state.MeetingDate ||
        this.state.PrevStartTimeString != this.state.StartTimeString ||
        this.state.PrevEndTimeString != this.state.EndtimeString ||
        this.state.PrevLocation != this.state.Location
      ) {
        IsUpdatedExceptUserIds = true;
      }
      var idslist = [];
      this.state.AttendeesList.forEach(element => {
        if (element.userId != global.LoginUserId) {
          idslist.push(element.userId);
        }
      });
      var Ids = idslist.join(',');
      try {
        var dataToSend = {
          Meetingid: this.state.MeetingId,
          Userid: global.LoginUserId,
          Scheduledate: this.state.ScheduleDate,
          TimezoneMinutes: moment().zone(),
          MeetingMinutes: this.state.MeetingMinutes,
          Title: this.state.Title,
          Message: this.state.Message,
          Location: this.state.Location,
          meetingusers: Ids,
          body: global.LoginUserName,
          meetingurltype: this.state.MeetingURLType,
          IsUpdatedExceptUserIds: IsUpdatedExceptUserIds,
        };
        var formBody = [];
        for (var key in dataToSend) {
          var encodedKey = encodeURIComponent(key);
          var encodedValue = encodeURIComponent(dataToSend[key]);
          formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');
        return fetch(global.APIURL + 'api/Card/savemeetings', {
          method: 'POST', //Request Type
          body: formBody, //post body
          headers: {
            //Header Defination
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
        })
          .then(response => response.json())
          .then(responseJson => {
            if (
              global.MeetingIndex != undefined &&
              global.MeetingIndex != null
            ) {
              if (this.state.MeetingId == 0) {
                if (
                  moment(this.state.ScheduleDate).format('YYYY-MM-DD') ==
                  moment().format('YYYY-MM-DD')
                ) {
                  global.MeetingIndex.state.DayMeetingList.push({
                    meetingid: responseJson,
                    organizedUserid: global.LoginUserId,
                    scheduledate: this.state.ScheduleDate,
                    meetingMinutes: this.state.MeetingMinutes,
                    title: this.state.Title,
                    location: this.state.Location,
                    message: this.state.Message,
                  });
                }
                // global.MeetingIndex.state.MonthlyMeetingsList.push({
                //   meetingid: responseJson,
                //   organizedUserid: global.LoginUserId,
                //   name: global.LoginUserName,
                //   scheduledate: this.state.ScheduleDate,
                //   meetingMinutes: this.state.MeetingMinutes,
                //   title: this.state.Title,
                //   location: this.state.Location,
                //   message: this.state.Message,
                // });
                // global.MeetingIndex.state.markedDates.push(
                //   moment(this.state.ScheduleDate).format('YYYY-MM-DD'),
                // );
                global.MeetingIndex.setState({
                  showalert: true,
                  Successmsg: 'Meeting Scheduled Successfully',
                  DayORMonthView: true,
                  DayView: true,
                  CalenderTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
                  DayCalenderTabColor: [
                    'rgba(8,155,171,1)',
                    'rgba(17,203,223,1)',
                  ],
                  ReceiveTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
                  CalenderIconColor: '#e0e0e0',
                  DayCalenderIconColor: '#ffffff',
                  ReceiveIconColor: '#e0e0e0',
                  ReceiveIconBGColor: '#ffffff',
                  //DayviewDate: moment(this.state.ScheduleDate).format('YYYY-MM-DD'),
                });
              } else {
                global.MeetingIndex.state.MonthlyMeetingsList.forEach(
                  element => {
                    if (element.meetingid == this.state.MeetingId) {
                      element.scheduledate = this.state.ScheduleDate;
                      element.meetingMinutes = this.state.MeetingMinutes;
                      element.title = this.state.Title;
                      element.message = this.state.Message;
                      element.location = this.state.Location;
                    }
                  },
                );
                global.MeetingIndex.state.DayMeetingList.forEach(element => {
                  if (element.meetingid == this.state.MeetingId) {
                    element.scheduledate = this.state.ScheduleDate;
                    element.meetingMinutes = this.state.MeetingMinutes;
                    element.title = this.state.Title;
                    element.message = this.state.Message;
                    element.location = this.state.Location;
                  }
                });
                global.MeetingIndex.setState({
                  showalert: true,
                  Successmsg: 'Meeting Updated Successfully',
                  DayviewDate: moment
                    .utc(this.state.ScheduleDate)
                    .local()
                    .format('YYYY-MM-DD'),
                });
              }
              setTimeout(() => {
                global.MeetingIndex.setState({
                  showalert: false,
                });
              }, 10000);
            }
            this._handleHeaderLeftIconPress();
          })
          .catch(error => Alert.alert(error));
      } catch (e) {
        Alert.alert(e);
      }
    }
  }
  _renderTimeList = item => {
    return (
      <View style={{flexDirection: 'row', alignSelf: 'center'}}>
        <Text style={{fontSize: 20}}>{item.name}</Text>
      </View>
    );
  };
  EditIconPress = () => {
    this.setState({IsEditable: false, ButtonText: 'Send Invite'});
  };
  SelectStartTimePress = starttime => {
    var Starttime = moment(starttime).format('HH:mm:ss');
    this.setState({
      EndTimePickerVisible: true,
      StartTimeString: moment(starttime).format('h:mm A'),
      ScheduleDate: this.state.MeetingDate + ' ' + Starttime,
      MeetingStartTime: Starttime,
      StartTimePickerVisible: false,
      IsCheck: !this.state.IsCheck,
    });
    this.setState({ EndTimePickerVisible: true}, function() {
      this.setState({EndTimePickerVisible: true});
  });
  };
  SelectEndTimePress = endtime => {
    //     if (moment(this.state.MeetingStartTime).format('HH:mm:ss') > moment(endtime).format('HH:mm:ss'))
    //     {
    // alert('please Select Valid End Time Meeting');
    //     }
    //     else
    //     {
    var Endtime = moment(endtime).format('HH:mm:ss');
    this.setState({
      EndtimeString: '-' + moment(endtime).format('h:mm A'),
      MeetingMinutes: moment(Endtime, 'HH:mm:ss').diff(
        moment(this.state.MeetingStartTime, 'HH:mm:ss'),
        'minutes',
      ),
      EndTimePickerVisible: false,
      swipeablePanelActive: false,
    });
    // }
  };
  StartTimehideDatePicker = () => {
    this.setState({StartTimePickerVisible: false});
  };
  EndTimehideDatePicker = () => {
    this.setState({EndTimePickerVisible: false});
  };
  CancelOrSendInvite = () => {
    if (this.state.ButtonText == 'Send Invite') {
      this.savemeetings();
    } else {
      this.CancelMeeting();
    }
  };
  CancelMeeting = () => {
    const {MeetingId} = this.props;
    try {
      var dataToSend = {
        Userid: global.LoginUserId,
        Meetingid: MeetingId,
        body: this.state.Title + 'meeting has been Cancelled',
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/CancelScheduledMeetings', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          var schduledMeetings = global.MeetingIndex.state.MonthlyMeetingsList;
          schduledMeetings = schduledMeetings.filter(obj => {
            return obj.meetingid != MeetingId;
          });
          var dayMeetings = global.MeetingIndex.state.DayMeetingList;
          dayMeetings = dayMeetings.filter(obj => {
            return obj.meetingid != MeetingId;
          });
          global.MeetingIndex.setState({
            MonthlyMeetingsList: schduledMeetings,
            DayMeetingList: dayMeetings,
          });
          this._handleHeaderLeftIconPress();
        })
        .catch(error => Alert.alert(error));
    } catch (e) {
      Alert.alert(e);
    }
  };
  AddMeetingURL = () => {
    this.setState({
      MeetingsURLpopup: false,
      LocationPanelActive: false,
      Location: this.state.meetingURL,
      URLType: this.state.meetingurltype,
    });
  };
  OnCancelPress = () => {
    this.setState({MeetingsURLpopup: false, meetingURL: ''});
  };
 
  AddAttendees = () => {
    if (
      this.state.ScheduleDate != '' &&
      this.state.StartTimeString != ' ' &&
      this.state.EndtimeString != ' '
    ) {
      Actions.MeetingUsers({
        AlreadyAttendees: this.state.AttendeesList,
        ScheduleDate: this.state.ScheduleDate,
      });
    } else {
      alert('plese enter Meeting Date and Time');
    }
  };
  AddUrl = Value => {
    if (this.state.MeetingURLType == 'Z') {
      this.setState({
        meetingURL: Value,
        ZoomMeetingURL: Value,
        GoogleLocation: '',
      });
    } else if (this.state.MeetingURLType == 'H') {
      this.setState({
        meetingURL: Value,
        HangoutMeetingURL: Value,
        GoogleLocation: '',
      });
    } else if (this.state.MeetingURLType == 'S') {
      this.setState({
        meetingURL: Value,
        SkypeMeetingURL: Value,
        GoogleLocation: '',
      });
    } else if (this.state.MeetingURLType == 'P') {
      this.setState({
        meetingURL: Value,
        PhoneNumber: Value,
        GoogleLocation: '',
      });
    }
  };
  render() {
    console.log("MeetinUrlType",this.state.MeetingURLType)
    const customStyle = {
      dayHeading: {
        color: CommonStyles.appColor,
      },
      currentDayText: {
        color: 'gray',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 28,
        height: 28,
        width: 28,
        textAlign: 'center',
      },
      selectedDayCircle: {
        backgroundColor: CommonStyles.appColor,
      },
      eventIndicator: {
        backgroundColor: CommonStyles.appColor,
        width: 10,
        height: 10,
        borderRadius: 10,
      },
      weekendHeading: {
        color: CommonStyles.appColor,
      },
      weekendDayText: {
        color: 'black',
      },
    };
    return (
      <View style={{backgroundColor: '#f4f6f9', flex: 1}}>
        <View style={{flex: 0.14}}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => this._handleHeaderRightIcon()}
            HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
            HeaderLeftIconPress={this._handleHeaderLeftIconPress}
            HeaderText={() => {
              return null;
            }}
            HeaderProfileIcon={() => {
              return null;
            }}
            HeaderProfileIconPress={() => {
              return null;
            }}
            IsShowTextForTabs={false}
            TabLabel1={'Day View'}
            TabLabel2={'Month View'}
          />
        </View>
        <View style={{flex: 0.86}}>
          <ScrollView nestedScrollEnabled = {true}>
            <View style={{marginBottom: 5}}>
              <Text style={styles.TextStyle}>Title</Text>
              <TextInput
                style={styles.MeetinginviTIstyle}
                placeholder="Enter Meeting Title"
                placeholderTextColor="lightgray"
                onChangeText={value => {
                  this.setState({Title: value});
                }}
                maxLength={30}
                value={this.state.Title}
                editable={!this.state.IsEditable}
              />
            </View>
            <Text style={styles.TextStyle}>Message</Text>
            <View style={styles.MSGInputstyle}>
              {!this.state.IsEditable ? (
                <TextInput
                style={{
                  justifyContent: 'flex-start',
                  textAlignVertical: 'top',
                  height: 80,
                }}
                onFocus={this.onFocusChange}
                placeholder="Add Message"
                placeholderTextColor="lightgray"
                underlineColorAndroid="transparent"
                numberOfLines={20}
                multiline={true}
                onChangeText={value => {
                  this.setState({Message: value});
                }}
                value={this.state.Message}
                maxLength={500}
                editable={!this.state.IsEditable}
              />):(
                <ScrollView nestedScrollEnabled = {true} showsVerticalScrollIndicator={false} style={{height:80}}>
                {/* <Text style={{ color: "gray" }}>{this.state.Message}</Text> */}
                <Hyperlink linkDefault={ true } linkStyle={ { color: '#2980b9', fontSize: 15 } }>
                <Text style={ { fontSize: 15 } }>
                {this.state.Message}
                </Text>
              </Hyperlink>
              </ScrollView>
              )}
            </View>
            <View>
              <Text style={styles.TextStyle}>When</Text>
              <TextInput
                style={styles.MeetinginviTIstyle}
                placeholder="select Date and Time"
                placeholderTextColor="lightgray"
                onFocus={event => {
                  this.DatetimeOnPress();
                }}
                value={
                  this.state.Datestring +
                  this.state.StartTimeString +
                  this.state.EndtimeString
                }
                editable={!this.state.IsEditable}
              />
            </View>
            <View style={{marginBottom: 5}}>
              <Text style={styles.TextStyle}>Who</Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <FlatList
                  vertical
                  nestedScrollEnabled={true}
                  height={this.state.AttendeesDynamicHeight}
                  data={this.state.AttendeesList}
                  renderItem={({item,index}) => (
                    <View>{this._renderAttendeeDetails(item,index)}</View>
                  )}
                />
              </View>
              <TextInput
                style={styles.MeetinginviTIstyle}
                placeholder="Add Attendees"
                placeholderTextColor="lightgray"
                editable={!this.state.IsEditable}
                onFocus={() => this.AddAttendees()}
              />
            </View>
            <View style={{borderBottomColor:"gray", borderBottomWidth:0.2}}>
              <Text style={styles.TextStyle}>Where</Text>
              {this.state.Location === ''? (
              <TextInput
                style={[styles.MeetinginviTIstyle2, {marginBottom: 10}]}
                placeholder="Add Location"
                placeholderTextColor="lightgray"
                onFocus={event => {
                  Actions.MeetingLocation()
                }}
                value={this.state.Location}
                editable={!this.state.IsEditable}
              />) :
              this.state.IsEditable ?
              (this.state.MeetingURLType === 'P' ?
               (<TextInput
                style={[styles.MeetinginviTIstyle2, {color:"#32a0db"}]}
                placeholder="Add Location"
                placeholderTextColor="lightgray"
                value={this.state.Location}
                onFocus={() =>Communications.phonecall(this.state.Location, true)}
                editable={true}
                // onChangeText={event => {
                //   Actions.MeetingLocation()
                // }}
              />):(
                 <TextInput
                   style={[styles.MeetinginviTIstyle2, {textDecorationLine:"underline",color:"#32a0db"}]}
                   placeholder="Add Location"
                   placeholderTextColor="lightgray"
                   value={this.state.Location}
                   onFocus={() =>Communications.web(`https://${this.state.Location}`)}
                   editable={true}
                  //  onChangeText={event => {
                  //   Actions.MeetingLocation()
                  // }}
                 />
              )
              ):
              (this.state.MeetingURLType === 'P' ?
               (<View style={{flexDirection:"row"}}>
                 <TextInput
                style={[styles.MeetinginviTIstyle2, {color:"#32a0db", width:"85%"}]}
                placeholder="Add Location"
                placeholderTextColor="lightgray"
                value={this.state.Location}
                onFocus={() =>Communications.phonecall(this.state.Location, true)}
                editable={true}
                // onChangeText={event => {
                //   Actions.MeetingLocation()
                // }}
              />
               <TouchableOpacity
                onPress={() =>Actions.MeetingLocation()}>
                <Cancel style={{color: 'grey', fontSize: 20, margin: 10, top:3}}/>
                </TouchableOpacity>
               </View>):(
                 <View style={{flexDirection:"row"}}>
                 <TextInput
                   style={[styles.MeetinginviTIstyle2, {textDecorationLine:"underline",color:"#32a0db", width:"85%"}]}
                   placeholder="Add Location"
                   placeholderTextColor="lightgray"
                   value={this.state.Location}
                   onFocus={() =>Communications.web(`https://${this.state.Location}`)}
                   editable={true}
                  //  onChangeText={event => {
                  //   Actions.MeetingLocation()
                  // }}
                 />
                 <TouchableOpacity
                onPress={() =>Actions.MeetingLocation()}>
                <Cancel style={{color: 'grey', fontSize: 20, margin: 10, top:3}}/>
                </TouchableOpacity>
                 </View>
              )
              )}
              {/* <TextInput
                style={[styles.MeetinginviTIstyle, {marginBottom: 10}]}
                placeholder="Add Location"
                placeholderTextColor="lightgray"
                onFocus={event => {
                  Actions.MeetingLocation()
                }}
                value={this.state.Location}
                editable={!this.state.IsEditable}
              /> */}
            </View>
           <View style={{marginVertical:15}}>
           <Button
              buttonTitle={this.state.ButtonText}
              isDisabled={this.state.cancelORSendBtnDisable}
              onButtonPress={() => this.CancelOrSendInvite()}
            />
           </View>
          </ScrollView>
        </View>
        <SwipeablePanel
          fullWidth={true}
          openLarge={true}
          isActive={this.state.swipeablePanelActive}
          onClose={() => this.closePanel()}
          style={{height:windowHeight, width: windowWidth}}
          closeOnTouchOutside>
          <View style={{flex: 1}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{marginLeft: 10}}>Select Date</Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({swipeablePanelActive: false});
                }}>
                <View
                  style={{
                    borderWidth: 0.5,
                    borderColor: 'gray',
                    height: 25,
                    width: 25,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <X
                    style={{
                      color: '#a9a9a9',
                      fontSize: 20,
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
              {this.state.StartTimePickerVisible === true && (<Text style={{color:"#017a85", fontSize:30, fontWeight:"900", textAlign:"center", opacity:1.5}}>Start Time</Text>)}
            {this.state.EndTimePickerVisible === true && (<Text style={{color:"#017a85", fontSize:30, fontWeight:"900", textAlign:"center", opacity:1.5}}>End Time</Text>)}
            <View style={{flex: 1}}>
            {/* {this.state.StartTimePickerVisible === true && (<Text style={{color:"#017a85", fontSize:30, fontWeight:"600", alignSelf:"center", bottom:30, opacity:1.5}}>Start Time</Text>)}
            {this.state.EndTimePickerVisible === true && (<Text style={{color:"#017a85", fontSize:30, fontWeight:"600", alignSelf:"center", bottom:30, opacity:1.5}}>End Time</Text>)} */}
              <Calendar
                onDayPress={day => {
                  this.ondatepress(day);
                }}
                minDate={moment().format('YYYY-MM-DD')}
               // current={this.state.MeetingDate}
                selectedDay={moment(this.state.MeetingDate).format('YYYY-MM-DD')}
                theme={{
                //  todayTextColor: 'red',
                 // selectedDayBackgroundColor:'red',
                  textSectionTitleColor: CommonStyles.appColor,
                }}
              />
              <DateTimePickerModal
                isVisible={this.state.StartTimePickerVisible}
                mode="time"
                onConfirm={time => this.SelectStartTimePress(time)}
                onCancel={() => this.StartTimehideDatePicker()}
                date={new Date()}
              />
              <DateTimePickerModal
                isVisible={this.state.EndTimePickerVisible}
                mode="time"
                onConfirm={time => this.SelectEndTimePress(time)}
                onCancel={() => this.EndTimehideDatePicker()}
                date={new Date()}
              />
            </View>
          </View>
        </SwipeablePanel>
        
       
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
)(ScheduleMeeting);
