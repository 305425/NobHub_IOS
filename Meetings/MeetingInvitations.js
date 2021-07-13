import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {goBack} from '../Services/BackButtonServices';
import CommonHeader from '../shared/CommonHeader';
import {BoldText} from '../shared/Text';
import {styles} from './MeetingStyles';
import ServiceCalls from '../Services/APICalls';
import Footer from '../shared/Footer';
import {CommonStyles, GilRoyMediumColor} from '../shared/Constants';
import {Thumbnail, Label} from 'native-base';
import Communications from 'react-native-communications';
import moment from 'moment';
import {
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  TextInput,
  Image,
  Text,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import Button from '../shared/Button';
import {
  Plus,
  ArrowLeft,
  Closecircle,
  CircleCheck,
  Circlcheckbox,
  Questioncircleo,
  User,
} from '../shared/Icon';
import image from '../Images';
import crossLogo from '../Images/cross.png';
import {ScrollView} from 'react-native-gesture-handler';
import Tooltip from 'react-native-walkthrough-tooltip';
import Hyperlink from 'react-native-hyperlink';
const colors= [
  '#27BECF','#994F14','#DA291C','#FFCD00','#007A33','#EB9CA8', '#7C878E',
  '#8A004F','#000000','#10069F','#00a3e0','#4CC1A1','#915520', '#b3d962',
  '#67a8e0', '#c06dde', '#1ec952', '#cc1f36', '#0b615f', '#911c16'
]
class MeetingInvitations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MeetingDate: '',
      MeetingTime: null,
      AttendeesList: [],
      Title: '',
      Message: '',
      Location: '',
      isChecked: false,
      MeetingMsg: '',
      AttendeesDynamicHeight: null,
      toolTipVisible: false,
      ReceiveInvitationsList: [],
      meetingPhone:'',
      isMeetingPhoneVisible:false,
      meetingUrl:'',
      isMeetingUrlVisible:false,
      isMoreVisible: false
    };
    global.MeetingInvitations = this;
  }
  componentDidMount() {
    const {MeetingId} = this.props;
    try {
      this.ReceiveInvitation();
     
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
          this.setState({AttendeesList: responseJson});
          if (responseJson.attendees.length > 3) {
            this.setState({AttendeesDynamicHeight: 180});
          }
        })
        .catch(error => Alert.alert(error));
    } catch (e) {
      Alert.alert(e);
    }
  }
 
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

  _handleHeaderLeftIcon = () => {
    //  return null;
    return (
      <View style={styles.BgIconStyle}>
        <ArrowLeft style={{color: CommonStyles.appColor, fontSize: 20}} />
      </View>
    );
  };
  _handleHeaderLeftIconPress = () => {
    const {handleGoBack} = this.props;
    handleGoBack();
  };

  renderMeetingAttendees = item => {
    if (item.image !== '' && item.image !== null) {
      return (
        <View style={[styles.AttendeeContactStyle]}>
          <Thumbnail
            medium
            source={{
              uri: global.APIURL + 'uploadimgs/ProfilePictures/' + item.image,
            }}
          />
          <Text style={{fontSize: 14}}>
            {item.name.length > 8
              ? item.name.substring(0, 8) + '...'
              : item.name}
          </Text>
        </View>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => this.ContactsOnPress(item)}>
          <View style={styles.FavContactStyle}>
            <Thumbnail medium source={image.defaultImage} />
            <Text>
              {item.name.length > 8
                ? item.name.substring(0, 8) + '...'
                : item.name}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  };
  _renderImageData = item => {
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
      <View style={styles.fab}>
        <User style={{color: CommonStyles.appColor, fontSize: 40}} />
      </View>
    );
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
              backgroundColor:colors[index%colors.length] }}>
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
          <BoldText style={[styles.textName,, {textAlignVertical: 'center',top:5, left:25}]}>
            {item.name}
            </BoldText>
              {/* <Text style={{fontSize: 18, marginLeft: 10}} numberOfLines={1}>
                {item.optionalMessage}
              </Text> */}
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
      </View>
    );
  };
  AcceptORDeclineOrTentatvePress = status => {
    const {MeetingId} = this.props;
    var bodytext = '';
    var bodyMessage= '';
    if (status == 'A') {
      bodytext = 'Accepted';
      bodyMessage= 'Meeting accepted.';
    } else if (status == 'D') {
      bodytext = 'Declined';
      bodyMessage= 'Meeting declined.';
    } else if (status == 'T') {
      bodytext = 'Tentative';
      bodyMessage= 'Meeting tentatively accepted.'
    }
    try {
      var dataToSend = {
        Userid: global.LoginUserId,
        Meetingid: MeetingId,
        Status: status,
        OptionalMsg: this.state.MeetingMsg,
        body:
          global.LoginUserName + ' ' + bodytext + ' your meeting invitation',
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/UpdateMeetingStatus', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          var schduledMeetings = this.state.ReceiveInvitationsList
            // global.MeetingIndex.state.ReceiveInvitationsList;
          schduledMeetings = schduledMeetings.filter(obj => {
            return obj.meetingid != MeetingId;
          });
          global.MeetingIndex.setState({
            ReceiveInvitationsList: schduledMeetings,
            showalert: true,
            Successmsg: bodyMessage,
          });
          setTimeout(() => {
            global.MeetingIndex.setState({
              showalert: false,
            });
          }, 10000);
          var schduledMeetings = global.MeetingIndex.state.MonthlyMeetingsList;
          schduledMeetings.forEach(element => {
            if (element.meetingid == MeetingId) {
              element.status = status;
            }
          });
          global.MeetingIndex.setState({MonthlyMeetingsList: schduledMeetings});
          this._handleHeaderLeftIconPress();
          // if (status == 'A') {
          //   alert('Invitation aceepted');
          // } else if (status == 'D') {
          //   alert('Invitation Declined');
          // } else  {
          //   alert('Invitation Tentavie');
          // }
        })
        .catch(error => Alert.alert(error));
    } catch (e) {
      Alert.alert(e);
    }
  };
  handleHeaderText() {
  //  console.log("Initial check",this.state.AttendeesList)
    return (
      <View
        style={{
         // marginTop:15,
          flexDirection: 'column',
          justifyContent:'center',
          textAlign:'center',
          alignSelf:'center',
          alignItems:'center'

        }}>
        {(this.state.AttendeesList.image !== '' && this.state.AttendeesList.image !== null) ? (
          <Thumbnail
            medium
            source={{
              uri: global.APIURL + 'uploadimgs/ProfilePictures/' + this.state.AttendeesList.image,
            }}
          />
        ) : (
          // <Image
          //   style={{
          //     height: 60,
          //     width: 60,
          //     borderRadius: 120,
          //     justifyContent: 'center',
          //     backgroundColor: '#ffffff',
          //   }}
          //   source={require('../Images/GrpProfile.png')}
          // />
          <View style={{ height: 60,
            width: 60,
            borderRadius: 120,
            justifyContent: 'center',
            backgroundColor: "#fff",}}>
              <Text
                style={{
                  fontSize: 26,
                  color: CommonStyles.appColor,
                  textAlign: 'center',
                }}>
                {this.state.AttendeesList.organizer.initials}
              </Text>
            </View>
        )}
          <Text numberOfLines={1} style={{fontSize: 18, alignSelf: 'center', color: '#ffffff'}}>
          {this.state.AttendeesList.name}
          </Text>
        {/* <Text numberOfLines={1} style={{fontSize: 13, alignSelf: 'center' ,color: '#ffffff'}}>
            {this.state.AttendeesList.userTitle}
          </Text> */}
      </View>
    );
  }

  render() {
    return (
      <View style={{backgroundColor: '#f4f6f9', flex: 1}}>
        <View style={{flex: 0.18}}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => {
              return null;
            }}
            HeaderCenterIcon={() => {
              return null;
            }}
            HeaderLeftIconPress={this._handleHeaderLeftIconPress}
            HeaderText={() => this.handleHeaderText()}
            HeaderProfileIcon={() => {
              return null;
            }}
            HeaderProfileIconPress={() => {
              return null;
            }}
            IsShowTextForTabs={false}
          />
        </View>
        <View style={{flex: 1}}>
          <ScrollView nestedScrollEnabled = {true}>
            <View style={{marginBottom: 5}}>
              <Text style={styles.TextStyle}>Title</Text>
              <TextInput
                style={styles.MeetinginviTIstyle}
                placeholder="Enter Meeting Title"
                value={this.state.AttendeesList.title}
                editable={false}
              />
            </View>
            <Text style={styles.TextStyle}>Message</Text>
            <View style={styles.MSGInputstyle}>
              {/* <TextInput
                style={{
                  justifyContent: 'flex-start',
                  textAlignVertical: 'top',
                  height: 80,
                  color:"#000"
                }}
                placeholder="Enter Details"
                underlineColorAndroid="transparent"
                numberOfLines={20}
                multiline={true}
                value={this.state.AttendeesList.message}
                maxLength={500}
                editable={false}
              /> */}
               <ScrollView nestedScrollEnabled = {true} showsVerticalScrollIndicator={false} style={{height:80}}>
                {/* <Text style={{ color: "gray" }}>{this.state.AttendeesList.message}</Text> */}
                <Hyperlink linkDefault={ true } linkStyle={ { color: '#2980b9', fontSize: 15 } }>
                <Text style={ { fontSize: 15 } }>
                {this.state.AttendeesList.message}
                </Text>
              </Hyperlink>
              </ScrollView>
            </View>
            <View style={{marginBottom: 5}}>
              <Text style={styles.TextStyle}>Who</Text>
              <FlatList
                Vertical
                nestedScrollEnabled={true}
                data={this.state.AttendeesList.attendees}
                height={this.state.AttendeesDynamicHeight}
                renderItem={({item,index}) => (
                  <View style={{marginBottom: 5}}>
                    {this._renderAttendeeDetails(item,index)}
                  </View>
                )}
              />
            </View>
            <View style={{marginBottom: 5}}>
              <Text style={styles.TextStyle}>When</Text>
              <TextInput
                style={styles.MeetinginviTIstyle}
                placeholder="Enter Details"
                value={
                  moment(this.state.AttendeesList.scheduledate).format(
                    'MMM DD YYYY ddd',
                  ) +
                  ' ' +
                  moment(this.state.AttendeesList.scheduledate).format(
                    'h:mm A',
                  ) +
                  ' - ' +
                  moment(this.state.AttendeesList.scheduledate)
                    .add(this.state.AttendeesList.meetingMinutes, 'minutes')
                    .format('h:mm A')
                }
                editable={false}
              />
            </View>
            <View>
              <Text style={styles.TextStyle}>Where</Text>
              {this.state.AttendeesList.meetingurltype === 'P'?(
                <TouchableOpacity onPress={() =>Communications.phonecall(this.state.AttendeesList.location, true)}>
              <TextInput
                style={styles.MeetingLinkstyle}
                placeholder="Enter Meeting place"
                value={this.state.AttendeesList.location}
                editable={false}
              />
              </TouchableOpacity>):(
                <TouchableOpacity onPress={() =>Communications.web(`https://${this.state.AttendeesList.location}`)}>
                <TextInput
                  style={styles.MeetingLinkstyle}
                  placeholder="Enter Meeting place"
                  value={this.state.AttendeesList.location}
                  editable={false}
                />
                </TouchableOpacity>
              )}
            </View>
            {this.state.isChecked ? (
              <View style={styles.MSGInputstyle}>
                <Text
                  style={{
                    color: '#a4a6a9',
                    textAlign: 'center',
                    borderWidt: 1,
                    borderBottomWidth: 0.2,
                  }}>
                  Message
                </Text>
                <TextInput
                  style={{
                    justifyContent: 'flex-start',
                    textAlignVertical: 'top',
                    height: 80,
                  }}
                  onFocus={this.onFocusChange}
                  placeholder="Enter here(Optional)"
                  underlineColorAndroid="transparent"
                  numberOfLines={20}
                  multiline={true}
                  editable={true}
                  onChangeText={text => this.setState({MeetingMsg: text})}
                  value={this.state.MeetingMsg}
                  maxLength={500}
                />
              </View>
            ) : null}
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                onClick={() => {
                  this.setState({
                    isChecked: !this.state.isChecked,
                    MeetingMsg:''
                  });
                }}
                checkBoxColor={'black'}
                checkedCheckBoxColor={'black'}
                isChecked={this.state.isChecked}
              />
              <Text style={styles.TextStyle}>Add Message</Text>
            </View>
            <View
              style={{
                flex: 0.6,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: 15,
              }}>
              <View>
                {moment(this.state.AttendeesList.scheduledate).format(
                  'YYYY-MM-DD',
                ) < moment().format('YYYY-MM-DD') ? (
                  <Circlcheckbox
                    style={{
                      color: 'gray',
                      fontSize: 40,
                    }}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => this.AcceptORDeclineOrTentatvePress('A')}>
                    <Circlcheckbox
                      style={{
                        color: CommonStyles.appColor,
                        fontSize: 40,
                      }}
                    />
                  </TouchableOpacity>
                )}
                <Text
                  style={{
                    color: GilRoyMediumColor.fontColor,
                  }}>
                  Accept
                </Text>
              </View>
              <View>
                {moment(this.state.AttendeesList.scheduledate).format(
                  'YYYY-MM-DD',
                ) < moment().format('YYYY-MM-DD') ? (
                  <Closecircle
                    style={{
                      color: 'gray',
                      fontSize: 35,
                      marginTop: 4,
                    }}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => this.AcceptORDeclineOrTentatvePress('D')}>
                    <Closecircle
                      style={{
                        color: CommonStyles.appColor,
                        fontSize: 35,
                        marginTop: 4,
                      }}
                    />
                  </TouchableOpacity>
                )}
                <Text
                  style={{
                    color: GilRoyMediumColor.fontColor,
                  }}>
                  Decline
                </Text>
              </View>
              <View>
                {moment(this.state.AttendeesList.scheduledate).format(
                  'YYYY-MM-DD',
                ) < moment().format('YYYY-MM-DD') ? (
                  <Questioncircleo
                    style={{
                      color: 'gray',
                      fontSize: 35,
                      marginTop: 4,
                    }}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => this.AcceptORDeclineOrTentatvePress('T')}>
                    <Questioncircleo
                      style={{
                        color: CommonStyles.appColor,
                        fontSize: 35,
                        marginTop: 4,
                      }}
                    />
                  </TouchableOpacity>
                )}

                <Text
                  style={{
                    color: GilRoyMediumColor.fontColor, right:10
                  }}>
                  Tentative
                </Text>
              </View>
            </View>
            <View style={{flex: 0.2}} />
          </ScrollView>
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
)(MeetingInvitations);
