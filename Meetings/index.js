import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {goBack} from '../Services/BackButtonServices';
import CommonHeader from '../shared/CommonHeader';
import {BoldText, MediumBoldText} from '../shared/Text';
import {styles} from './MeetingStyles';
import ServiceCalls from '../Services/APICalls';
import Footer from '../shared/Footer';
import {CommonStyles, GilRoyMediumColor} from '../shared/Constants';
import Calendar from 'react-native-calendar';
import moment from 'moment';
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
  Text,
  Dimensions
} from 'react-native';
import {Thumbnail} from 'native-base';
import {
  Calender,
  Receive,
  Plus,
  DayCalender,
  ToDayCalender,
  User,
} from '../shared/Icon';
import LinearGradient from 'react-native-linear-gradient';
import Updatenearbystatus from '../Services/UpdateNearbystatus';
import { EventRegister } from 'react-native-event-listeners';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const colors= [
  '#27BECF','#994F14','#DA291C','#FFCD00','#007A33','#EB9CA8', '#7C878E',
  '#8A004F','#000000','#10069F','#00a3e0','#4CC1A1','#915520', '#b3d962',
  '#67a8e0', '#c06dde', '#1ec952', '#cc1f36', '#0b615f', '#911c16'
]

class meetings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateSelected: '',
      CalenderTabColor: ['rgba(8,155,171,1)', 'rgba(17,203,223,1)'],
      DayCalenderTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      ReceiveTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      CalenderIconColor: '#e0e0e0',
      DayCalenderIconColor: '#ffffff',
      ReceiveIconColor: '#e0e0e0',
      MonthlyMeetingsList: [],
      DayMeetingList: [],
      DayView: false,
      ReceiveInvitationsList: [],
      ToDayCalenderView: false,
      DayORMonthView: false,
      markedDates: [],
      MeetingTimesList: [],
      ReceiveIconBGColor: '#ffffff',
      showalert: false,
      Successmsg: '',
      DayviewDate: moment().format('YYYY-MM-DD'),
      fromScheduleDate:''
    };
    global.MeetingIndex = this;
  }

  ReeiveClick = () => {
    this.ReceiveInvitation();
  };
  CalenderClick = () => {
    this.setState({
      CalenderTabColor: ['rgba(8,155,171,1)', 'rgba(17,203,223,1)'],
      DayCalenderTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      ReceiveTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      CalenderIconColor: '#ffffff',
      DayCalenderIconColor: '#e0e0e0',
      ReceiveIconColor: '#e0e0e0',
      ReceiveIconBGColor: '#ffffff',
      DayView: false,
      DayORMonthView: true,
    });
    this.GetMeetingScheduleByMonth(
      moment().format('MM'),
      moment().format('YYYY'),
    );
  };
  ReceiveInvitation = () => {
    try {
      var dataToSend = {
        Userid: global.LoginUserId,
        TimezoneMinutes: moment().zone(),
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/ReceivedInvitationList', {
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
            ReceiveInvitationsList: responseJson,
          });
        })
        .catch(error => Alert.alert(error));
    } catch (e) {
      Alert.alert(e);
    }
  };

  _handleHeaderRightIcon = () => {
    return (
      <TouchableOpacity
        onPress={() => Actions.ScheduleMetting({SchedulingMeeting: true})}>
        <View style={[styles.BgIconStyle]}>
          <Plus style={{color: CommonStyles.appColor}} />
        </View>
        <Text style={{fontSize: 9, color: '#ffffff', textAlign: 'center'}}>
          Create Meeting
        </Text>
      </TouchableOpacity>
    );
  };
  DayCalenderClick = () => {
    this.setState({
      CalenderTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      DayCalenderTabColor: ['rgba(8,155,171,1)', 'rgba(17,203,223,1)'],
      ReceiveTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      CalenderIconColor: '#e0e0e0',
      DayCalenderIconColor: '#ffffff',
      ReceiveIconColor: '#e0e0e0',
      ReceiveIconBGColor: '#ffffff',
      DayView: true,
      DayORMonthView: true,
      DayviewDate: moment().format('YYYY-MM-DD'),
    });
    this.GetMeetingScheduleByDay(moment().format('YYYY-MM-DD'));
  };
  _handleHeaderCenterIcon = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: 'white',
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          padding: 1,
        }}>
        <LinearGradient
          start={{x: 1, y: 1.5}}
          end={{x: 1, y: 0}}
          colors={this.state.DayCalenderTabColor}
          style={styles.touchableOpacityView_InviteUser}>
          <TouchableOpacity onPress={() => this.DayCalenderClick()}>
            <DayCalender
              style={{color: this.state.DayCalenderIconColor, fontSize: 20}}
            />
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          start={{x: 1, y: 1.5}}
          end={{x: 1, y: 0}}
          colors={this.state.CalenderTabColor}
          style={styles.touchableOpacityView_InviteUser}>
          <TouchableOpacity onPress={() => this.CalenderClick()}>
            <Calender
              style={{color: this.state.CalenderIconColor, fontSize: 20}}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  };

  GetMeetingScheduleByMonth(month, Year) {
    try {
      var dataToSend = {
        month: month,
        year: Year,
        LoginUserId: global.LoginUserId,
        TimezoneMinutes: moment().zone(),
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/GetMeetingScheduleByMonth', {
        method: 'POST', //Request Type
        body: formBody, //post body

        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          var markedDates = [];
          var markedDateColor = '';
          const groups = responseJson.reduce((groups, item) => {
            const scheduledate = item.scheduledate.split('T')[0];
            if (!groups[scheduledate]) {
              groups[scheduledate] = [];
            }
            groups[scheduledate].push(item);
            return groups;
          }, {});

          // Edit: to add it in the array format instead
          const groupArrays = Object.keys(groups).map(scheduledate => {
            return {
              scheduledate,
              item: groups[scheduledate],
            };
          });
          responseJson.forEach(element => {
            if (
              moment(element.dateOnly).format('YYYY-MM-DD') <
              moment().format('YYYY-MM-DD')
            ) {
              markedDateColor = 'lightgray';
            } else {
              markedDateColor = CommonStyles.appColor;
            }
            markedDates.push({
              date: moment(element.dateOnly).format('YYYY-MM-DD'),
              eventIndicator: {backgroundColor: markedDateColor},
            });
          });
          this.setState({
            MonthlyMeetingsList: groupArrays,
            markedDates: markedDates,
          });
        })
        .catch(error => Alert.alert(error));
    } catch (e) {
      Alert.alert(e);
    }
  }

  GetMeetingScheduleByDay(itemdate) {
 
    //console.log("datatatata",dataToSend)
    try {
      var dataToSend = {
        Day: itemdate,
        LoginUserId: global.LoginUserId,
        TimezoneMinutes: moment().zone(),
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/GetMeetingScheduleByDay', {
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
            DayMeetingList: responseJson,
          });
        })
        .catch(error => Alert.alert(error));
    } catch (e) {
      Alert.alert(e);
    }
  }
  componentDidMount() {
    global.MeetingIndex = this;
    var userPrfoiles = global.MyConnections.props.userProfile;
    if (userPrfoiles != null) {
      userPrfoiles.hasnewmeeting = false;
      global.MyConnections.props.setUserProfile(userPrfoiles);
    }
    global.footer.setState({hasnewmeeting: false});
    Updatenearbystatus.updateNearbyStatus(
      false,
      global.currentLongitude,
      global.currentLatitude,
    );
    global.ConnectionsTabColor = '#e0e0e0';
    global.ChatTabColor = '#e0e0e0';
    global.MeetingsTabColor = CommonStyles.appColor;
    global.NotificationsTabColor = '#e0e0e0';
    this.DayCalenderClick();
    if(this.props.isNewMeetings === true){
      this._handleHeaderLeftIconPress();
    }
  }

  componentWillMount() {
    this.listener = EventRegister.addEventListener('myCustomEvent', (data) => {
        this.setState({fromScheduleDate:data})
        console.log(data)
        this.GetMeetingScheduleByDay(
          moment(data).format('YYYY-MM-DD'),
        );
    })
}

componentWillUnmount() {
    EventRegister.removeEventListener(this.listener)
}

  _handleHeaderLeftIcon = () => {
    return (
      <View style={{width:80}}>
        <View
          style={[
            styles.ReceivedIconStyle,
            {backgroundColor: this.state.ReceiveIconBGColor},
          ]}>
          <Receive style={{color: this.state.ReceiveIconColor}} />
        </View>
        <Text numberOfLines={1} style={{fontSize: 9, color: '#ffffff', textAlign: 'center'}}>
          Received Meetings
        </Text>
      </View>
    );
  };
  _handleHeaderLeftIconPress = () => {
    this.ReeiveClick();
    this.setState({
      CalenderTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      DayCalenderTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      ReceiveTabColor: ['rgba(8,155,171,1)', 'rgba(17,203,223,1)'],
      CalenderIconColor: '#e0e0e0',
      DayCalenderIconColor: '#e0e0e0',
      ReceiveIconColor: '#ffffff',
      ReceiveIconBGColor: CommonStyles.appColor,
      DayORMonthView: false,
    });
  };
  _renderImageData = item => {
    <Text style={styles.name}>2</Text>;
  };
  _renderreceivingInvitationImages = (item,index) => {
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
      <View style={{flexDirection: 'column',
      height: 55,
      width: 55,
      borderRadius: 110,
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
    );
  };
  _renderReceiveDetails = item => {
    var startMettigDate = moment(item.scheduledate).format('MMM DD YYYY ddd');
    var startMettigTime = moment(item.scheduledate).format('h:mm A');
    return (
      <View style={{flex: 3}}>
        {moment(item.scheduledate).format(
                  'YYYY-MM-DD',
                ) < moment().format('YYYY-MM-DD')?(
        <View style={{flexDirection: 'column'}}>
                  <View style={{flex: 4, flexDirection: 'row'}}>
                  <MediumBoldText style={{color: "#d3d3d3",fontSize: 16,}}>{item.name}</MediumBoldText>
                </View> 
          <View style={{flex: 1}}>
          <MediumBoldText style={{color: "#d3d3d3",fontSize: 16,}}>
            {item.title + ' ' + startMettigDate + ' ' + startMettigTime}
          </MediumBoldText>
        </View>
        </View>):(
           <View style={{flexDirection: 'column'}}>
           <View style={{flex: 4, flexDirection: 'row'}}>
           <MediumBoldText style={styles.textName}>{item.name}</MediumBoldText>
         </View> 
   <View style={{flex: 1}}>
   <MediumBoldText style={styles.textName}>
     {item.title + ' ' + startMettigDate + ' ' + startMettigTime}
   </MediumBoldText>
 </View>
 </View>
        )}
      </View>
    );
  };
  DayPressinScheduleMeeting = item => {
    this.GetMeetingScheduleByDay(
      moment(item.scheduledate).format('YYYY-MM-DD'),
    );
    this.setState({
      CalenderTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      DayCalenderTabColor: ['rgba(8,155,171,1)', 'rgba(17,203,223,1)'],
      CalenderIconColor: '#e0e0e0',
      DayCalenderIconColor: '#ffffff',
      DayviewDate: moment(item.scheduledate).format('YYYY-MM-DD'),
      DayORMonthView: true,
      DayView: true,
    });
  };
  _renderScheduledMeetings1 = item => {
    var startMettigTime = moment(item.scheduledate).format('h:mm A');
    var EndMeetingTime = moment(item.scheduledate)
      .add(item.meetingMinutes, 'minutes')
      .format('h:mm A');
    if (
      moment(item.scheduledate).format('YYYY-MM-DD') <
      moment().format('YYYY-MM-DD')
    ) {
      Color = 'lightgray';
    } else {
      var Color = '';
      if (item.status == 'A') {
        Color = 'blue';
      } else if (item.status == 'T') {
        Color = 'orange';
      } else {
        Color = 'black';
      }
    }
    return (
      <TouchableOpacity onPress={() => this.SchedulemeetingPress(item)}>
        <Text numberOfLines={1} style={{fontSize: 16, color: Color}}>
          {startMettigTime +
            ' - ' +
            EndMeetingTime +
            ' ' +
            item.name +
            ' - ' +
            item.title}
        </Text>
      </TouchableOpacity>
    );
  };
  _renderScheduledMeetings = itemList => {
    return (
      <View style={{flex: 3}}>
        <View style={{flexDirection: 'column'}}>
          <View style={{flex: 1}}>
            <FlatList
              data={itemList}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => {
                return (
                  <View>
                    <View
                      style={[
                        styles.viewContactContainer,
                        {borderBottomWidth: 0.2, borderColor: '#e0e0e0'},
                      ]}>
                      {this._renderScheduledMeetings1(item)}
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </View>
    );
  };
  _renderDayMeetings = item => {
    var startMettigTime = moment(item.scheduledate).format('h:mm A');
    var EndMeetingTime = moment(item.scheduledate)
      .add(item.meetingMinutes, 'minutes')
      .format('h:mm A');
    var Color = '';
    if (item.status == 'A') {
      Color = 'blue';
    } else if (item.status == 'D') {
      Color = 'gray';
    } else if (item.status == 'T') {
      Color = 'orange';
    }
    return (
      <View style={{flex: 3}}>
        <View style={{flexDirection: 'column'}}>
          <View style={{flex: 1}}>
            <MediumBoldText style={{color: Color, fontSize: 18}}>
              {item.title}
            </MediumBoldText>
            <MediumBoldText style={{color: Color, fontSize: 18}}>
              {startMettigTime + ' - ' + EndMeetingTime}
            </MediumBoldText>
          </View>
        </View>
      </View>
    );
  };
  _handleHeaderText = () => {
    return (
      <View>
        <BoldText style={{color: '#ffff', fontSize: 14}}>Meetings</BoldText>
      </View>
    );
  };
  SchedulemeetingPress = item => {
    if (item.organizedUserid == global.LoginUserId) {
      Actions.ScheduleMetting({
        MeetingId: item.meetingid,
      });
    } else {
      Actions.MeetingInvitations({
        MeetingId: item.meetingid,
      });
    }
  };
  calendarPrevOrFRWDClick = date => {
    this.GetMeetingScheduleByMonth(
      moment(date).format('MM'),
      moment(date).format('YYYY'),
    );
  };
  ondatepress(itemdate) {
    var date = moment(itemdate).format('YYYY-MM-DD');
    this.setState({
      CalenderTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      DayCalenderTabColor: ['rgba(8,155,171,1)', 'rgba(17,203,223,1)'],
      ReceiveTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      CalenderIconColor: '#e0e0e0',
      DayCalenderIconColor: '#ffffff',
      ReceiveIconColor: '#e0e0e0',
      ReceiveIconBGColor: '#ffffff',
      DayORMonthView: true,
      DayView: true,
      DayviewDate: date,
    });
    this.GetMeetingScheduleByDay(date);
  }
  nextday = () => {
    this.GetMeetingScheduleByDay(
      moment(this.state.DayviewDate, 'YYYY-MM-DD')
        .add(1, 'days')
        .format('YYYY-MM-DD'),
    );
    this.setState({
      DayviewDate: moment(this.state.DayviewDate, 'YYYY-MM-DD')
        .add(1, 'days')
        .format('YYYY-MM-DD'),
    });
  };
  Prevday = () => {
    this.GetMeetingScheduleByDay(
      moment(this.state.DayviewDate, 'YYYY-MM-DD')
        .subtract(1, 'days')
        .format('YYYY-MM-DD'),
    );
    this.setState({
      DayviewDate: moment(this.state.DayviewDate, 'YYYY-MM-DD')
        .subtract(1, 'days')
        .format('YYYY-MM-DD'),
    });
  };
  render() {
  //  console.log("123456",this.state.ReceiveInvitationsList)
    return (
      <View style={{backgroundColor: '#f4f6f9', flex: 1}}>
        {this.state.DayORMonthView ? (
          <View style={{backgroundColor: '#f4f6f9', flex: 1}}>
            <View style={{flex: 0.17}}>
              <CommonHeader
                HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
                HeaderRightIcon={() => this._handleHeaderRightIcon()}
                HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
                HeaderLeftIconPress={this._handleHeaderLeftIconPress}
                HeaderText={() => this._handleHeaderText()}
                HeaderProfileIcon={() => {
                  return null;
                }}
                HeaderProfileIconPress={() => {
                  return null;
                }}
                IsShowTextForTabs={true}
                TabLabel1={'Day View'}
                TabLabel2={'Monthly View'}
              />
            </View>
            {this.state.showalert ? (
              <View style={{marginLeft: 20, marginTop: 10}}>
                <Text style={{color: GilRoyMediumColor.fontColor, textAlign:"center"}}>
                  {this.state.Successmsg}
                </Text>
              </View>
            ) : null}
            {!this.state.DayView ? (
              <View style={{flex: 1}}>
                  <View style={{flex: 1}}>
                    <Calendar
                      scrollEnabled
                      // eventDates={this.state.markedDates}
                      customStyle={customStyle}
                      showControls
                      titleFormat={'MMMM YYYY'}
                      events={this.state.markedDates}
                      dayHeadings={[
                        'Sun',
                        'Mon',
                        'Tue',
                        'Wed',
                        'Thu',
                        'Fri',
                        'Sat',
                      ]}
                      prevButtonText={'<'}
                      nextButtonText={'>'}
                      onDateSelect={date => this.ondatepress(date)}
                      onTouchPrev={e => this.calendarPrevOrFRWDClick(e)}
                      onTouchNext={e => this.calendarPrevOrFRWDClick(e)}
                      onSwipePrev={e => {}}
                      onSwipeNext={e => {}}
                      selectedDate={this.state.MeetingDate}
                      showEventIndicators={true}
                    />
                  

                <View style={{flex: 1}}>
                    {this.state.MonthlyMeetingsList.length > 0 ? (
                      <BoldText
                        style={{
                          marginLeft: 10,
                          marginBottom: 8,
                          color: '#A9A9A9',
                          fontSize: 16,
                        }}>
                        Scheduled Meetings
                      </BoldText>
                    ) : null}
                    <FlatList
                      data={this.state.MonthlyMeetingsList}
                      showsVerticalScrollIndicator={false}
                      renderItem={({item}) => {
                        return (
                          <View>
                            <TouchableOpacity
                              onPress={() =>
                                this.DayPressinScheduleMeeting(item)
                              }>
                              <View style={styles.MeetingDayStyle}>
                                <BoldText style={{color: 'black'}}>
                                  {moment(item.scheduledate).format('ddd') +
                                    ' ' +
                                    moment(item.scheduledate).format('DD')}
                                </BoldText>
                              </View>
                            </TouchableOpacity>
                            {this._renderScheduledMeetings(item.item)}
                          </View>
                        );
                      }}
                    />
                    </View>
                  </View>

   <View style={{flex: 0.13}}>
                    <Footer />
                  </View>
              </View>
            ) : (
              <View style={{flex: 1}}>
                <View style={{flex: 1}}>
                  <View
                    style={{
                      justifyContent: 'space-around',
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity onPress={() => this.Prevday()}>
                      <Text style={{fontSize: 18}}>{'<'}</Text>
                    </TouchableOpacity>
                    <Text>
                    {this.state.fromScheduleDate !== '' ? moment(this.state.fromScheduleDate).format('MMM DD YYYY') : moment(this.state.DayviewDate).format('MMM DD YYYY')}
                    </Text>
                    <TouchableOpacity onPress={() => this.nextday()}>
                      <Text style={{fontSize: 18}}>{'>'}</Text>
                    </TouchableOpacity>
                  </View>
                  {this.state.DayMeetingList.length > 0 ? (
                    <FlatList
                      data={this.state.DayMeetingList}
                      showsVerticalScrollIndicator={false}
                      renderItem={({item}) => {
                        return (
                          <TouchableOpacity
                            onPress={() => this.SchedulemeetingPress(item)}>
                            <View
                              style={[
                                styles.viewContactContainer,
                                {borderBottomWidth: 1, borderColor: '#e0e0e0'},
                              ]}>
                              <View style={[styles.viewContact]}>
                                {this._renderDayMeetings(item)}
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      }}
                    />
                  ) : (
                    <View>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontSize: 18,
                          color: 'gray',
                          textAlign: 'center',
                        }}>
                        No Meetings
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{flex: 0.13}}>
                  <Footer />
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={{backgroundColor: '#f4f6f9', flex: 1}}>
            <View style={{flex: 0.2}}>
              <CommonHeader
                HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
                HeaderRightIcon={() => this._handleHeaderRightIcon()}
                HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
                HeaderLeftIconPress={this._handleHeaderLeftIconPress}
                HeaderText={() => this._handleHeaderText()}
                HeaderProfileIcon={() => {
                  return null;
                }}
                HeaderProfileIconPress={() => {
                  return null;
                }}
                IsShowTextForTabs={true}
                TabLabel1={'Day View'}
                TabLabel2={'Monthly View'}
              />
            </View>
            {this.state.showalert ? (
              <View style={{marginLeft: 20, marginTop: 10}}>
                <Text style={{color: GilRoyMediumColor.fontColor, textAlign:"center"}}>
                  {this.state.Successmsg}
                </Text>
              </View>
            ) : null}
            <View style={{flex: 1}}>
              {this.state.ReceiveInvitationsList.length > 0 ? (
                <FlatList
                  data={this.state.ReceiveInvitationsList}
                  renderItem={({item,index}) => (
                    <TouchableOpacity
                      onPress={() =>
                        Actions.MeetingInvitations({
                          MeetingId: item.meetingid,
                        })
                      }>
                      <View style={styles.viewContactContainer}>
                        <View style={[styles.viewContact, {marginTop: 10}]}>
                          <View style={{marginRight: 10}}>
                            {this._renderreceivingInvitationImages(item,index)}
                          </View>
                          {this._renderReceiveDetails(item)}
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <Text style={{color: 'gray'}}>No Meetings</Text>
              )}
            </View>
            <View style={{flex: 0.12, backgroundColor: '#ffffff'}}>
              <Footer />
            </View>
          </View>
        )}
      </View>
    );
  }
}
const mapDispatchToProps = {
  handleGoBack: goBack,
};
const customStyle = {
  dayHeading: {
    color:'gray',
  },
  currentDayText: {
    color: 'gray',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 28,
    height: 28,
    width: 28,
    textAlign: 'center',
    justifyContent: 'center',
  },
  selectedDayCircle: {
    backgroundColor: CommonStyles.appColor,
  },
  // eventIndicator: {
  //   backgroundColor: 'red',
  //   width: 10,
  //   height: 10,
  //   borderRadius: 10,
  // },
  dayButton: {
    borderWidth:0,
  },
  weekendHeading: {
    color: 'gray',
  },
  weekendDayText: {
    color: 'black',
  },
  weekRow:{
    backgroundColor:"#f5f6fa"
  }
};

export default connect(
  null,
  mapDispatchToProps,
)(meetings);
