import React, {Component} from 'react';
import {connect} from 'react-redux';
import {goBack} from '../Services/BackButtonServices';
import {styles} from './MeetingStyles';
import Button from '../shared/Button';
import {MediumBoldText} from '../shared/Text';
import CommonHeader from '../shared/CommonHeader';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Actions} from 'react-native-router-flux';
import AppStorageService from '../Services/AppStorageService';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
} from 'react-native-popup-dialog';
import {
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Image,
  Text,
  FlatList
} from 'react-native';
import { BoldText} from '../shared/Text';
import {
  CommonStyles,
  GilRoyRegularColor,
  GilRoyMediumColor,
} from '../shared/Constants';
import {
  ArrowLeft,
  SkypeIcon,
  HangoutsIcon,
  Phone,
  Questioncircleo,
  Circlcheckbox,
  Edit,
  X,
} from '../shared/Icon';
import {AlertClass} from '../shared/CustomAlert';
import marker from '../Images/marker.png';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


class GroupMebers extends Component {
  _menu = null;
  constructor(props) {
    super(props);
    this.state = {
      Location: '',
      meetingURL: '',
      MeetingsURLpopup: false,
      MeetingURLType: '',
      isLocationVisible: true,
      isMeetingVisible: true,
      recentFiveLocations:[]
    };
  }

  _handleBackPress = () => {
    const {handleGoBack} = this.props;
    handleGoBack();
  };

  componentDidMount() {
    AppStorageService.getRecentFiveUserLocation(global.LoginUserId).then(
      result => {
        this.setState({recentFiveLocations:result})
      }
    )
  }
  _handleHeaderLeftIcon = () => {
    //  return null;
    return (
      <View style={styles.BgIconStyle}>
        <ArrowLeft style={{color: CommonStyles.appColor, fontSize: 20}} />
      </View>
    );
  };

  _handleBackPress = () => {
    const {handleGoBack} = this.props;
    handleGoBack();
  };
  closeLocationpanel = () => {
    this._handleBackPress();
  };
  SelectLocation = () => {
    global.scheduleMeetings.setState({Location: this.state.Location !== '' ? (this.state.Location || this.state.meetingURL) : this.state.meetingURL});
    this._handleBackPress();
  };
  AddMeetingURL = () => {
    this.setState({
      MeetingsURLpopup: false,
      LocationPanelActive: false,
    });
    global.scheduleMeetings.setState({Location: this.state.meetingURL,MeetingURLType:this.state.MeetingURLType});
  };
  MeetingsIconPress = item => {
    if (item == 'P') {
      this.setState({
        MeetingURLType: 'P',
        meetingURL: global.scheduleMeetings.state.PhoneNumber,
        maxlength: 10,
        isLocationVisible: false
      });
    } else if (item == 'Z') {
      this.setState({
        MeetingURLType: 'Z',
        meetingURL: global.scheduleMeetings.state.ZoomMeetingURL,
        isLocationVisible: false
      });
    } else if (item == 'H') {
      this.setState({
        MeetingURLType: 'H',
        meetingURL: global.scheduleMeetings.state.HangoutMeetingURL,
        isLocationVisible: false
      });
    } else if (item == 'S') {
      this.setState({
        MeetingURLType: 'S',
        meetingURL: global.scheduleMeetings.state.SkypeMeetingURL,
        isLocationVisible: false
      });
    }

    this.setState({MeetingsURLpopup: true});
  };
  _handleHeaderText = () => {
    return (
      <View style={{flex: 1}}>
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
  AddUrl = Value => {
    if (this.state.MeetingURLType == 'Z') {
      this.setState({
        meetingURL: Value,
        ZoomMeetingURL: Value,
        GoogleLocation: '',
        isLocationVisible: false
      });
    } else if (this.state.MeetingURLType == 'H') {
      this.setState({
        meetingURL: Value,
        HangoutMeetingURL: Value,
        GoogleLocation: '',
        isLocationVisible: false
      });
    } else if (this.state.MeetingURLType == 'S') {
      this.setState({
        meetingURL: Value,
        SkypeMeetingURL: Value,
        GoogleLocation: '',
        isLocationVisible: false
      });
    } else if (this.state.MeetingURLType == 'P') {
      this.setState({
        meetingURL: Value,
        PhoneNumber: Value,
        GoogleLocation: '',
        isLocationVisible: false
      });
    }
  };
  OnCancelPress = () => {
    this.setState({MeetingsURLpopup: false, meetingURL: ''});
  };
  _handleHeaderLeftIcon = () => {
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
  _handleHeaderCenterIcon = () => {
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
  };
  _renderFiveLocationDetails = (item) => {
    return (
      <View style={{flexDirection:"row"}}>
        <View style={{height:40,width:40,borderRadius:20, backgroundColor:"#cdf0f4", marginVertical:2}}>
          <Image source={marker} style={{height:16, width:11, alignSelf:"center", top:12}}/>
        </View>
        <TouchableOpacity onPress={()=>this.setState({Location:item})} style={{justifyContent:"center", marginLeft:10}}>
        <Text style={{color:"gray"}}>{item}</Text>
        </TouchableOpacity>
      </View>
          )
  }
  render() {
    let meetingVisible = this.state.Location === '' ? true : false
    let locationVisible = this.state.meetingURL === '' ? true : false
    console.log("RecentFiveLocation",this.state.recentFiveLocations)
    return (
      <View style={{backgroundColor: '#f4f6f9', flex: 1}}>
         <View style={{flex: 0.14}}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => {
              return null;
            }}
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
        <View style={{flex: 0.86, flexDirection: 'column'}}>
          <View
            style={{
              flex: 0.1,
            }}
          />
         {locationVisible &&(
         <View style={{flex:1}}>
            <View style={{flexDirection: 'row',
              justifyContent: 'space-between',
              //flex: 0.08,
              }}>
            <MediumBoldText
              style={{fontSize: 18, marginBottom: 15, marginLeft: 10, color:"grey"}}>
              Select Meeting Location
            </MediumBoldText>
            {/* <TouchableOpacity onPress={() => this.closeLocationpanel()}>
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
            </TouchableOpacity> */}
          </View>
          <View>
            <GooglePlacesAutocomplete
              placeholder="Select Address"
              placeholderTextColor="#6e8f94"
              keyboardShouldPersistTaps="handled"
              minLength={2} // minimum length of text to search
              autoFocus={false}
              returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
              keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
              listViewDisplayed={false} // true/false/undefined
              fetchDetails={true}
              renderDescription={row => row.description} // custom description render
              onPress={async (_data) => {
                this.setState({Location: _data.description});
                await AppStorageService.setRecentFiveUserLocation(global.LoginUserId,_data.description)
              }}
              textInputProps={{
                onChangeText:(text) => {
                  this.setState({Location:text});
                 console.log("Location",text)
                },
                value: this.state.Location,
              }}
              getDefaultValue={() => {this.state.Location}}
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: 'AIzaSyDEc6y2PP50c3529HoVRWY5wru5wLE_6hY',
                language: 'en', // language of the results
                types: 'geocode', // default: 'geocode'
              }}
              suppressDefaultStyles = {true}
              styles={{
                textInputContainer: styles.CompanyAddressTextInputContainer,
                textInput: styles.CompanyAddressTextInput,
                description: styles.CompanyAddressTextInputDescription,
              }}
            />
          </View>
          <View>
            <Text style={{fontSize:15, color:"gray", fontWeight:"bold", marginVertical:10, marginLeft:10}}>Recent</Text>
          </View>
         <View style={{borderBottomColor:"gray", borderBottomWidth:0.2, height:200}}>
           <FlatList
                  vertical
                  nestedScrollEnabled={true}
                  height={180}
                  data={this.state.recentFiveLocations}
                  renderItem={({item}) => (
                    this._renderFiveLocationDetails(item)
                  )}
                />
         </View>
         </View>
          )}
          {meetingVisible && (
         <View style={!locationVisible?{flex:1}:{flex:1, top:50}}>
            <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
             // flex: 0.05,
              //bottom:140
            }}>
            <MediumBoldText style={{fontSize: 18, marginLeft: 10, color:"grey"}}>
              Or Choose Remote Meeting
            </MediumBoldText>
          </View>
          {this.state.meetingURL !== '' && (
          <View style={{flex:0.12, bottom:0, marginBottom:0, borderBottomColor:"gray", borderBottomWidth:1, flexDirection:"row"}}>
            <Text style={{color:"grey", fontSize:15,top:15, left:15}} numberOfLines={1}>
              {this.state.MeetingURLType !== 'P' ? "MeetingURL : " : "Contact Number : "} 
            </Text>
            <Text style={{color:"#32a0db", fontSize:15,top:15, left:15}} numberOfLines={2}>{this.state.meetingURL}</Text>
          </View>
            )}
          <View style={{flex: 0.1,bottom:0, justifyContent:"center", top:40}}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',alignItems:"center"
              }}>
              <TouchableOpacity onPress={() => this.MeetingsIconPress('S')}>
                <View style={{bottom:4}}>
                  <SkypeIcon
                    style={{color: CommonStyles.appColor, fontSize: 30,alignSelf:"center"}}
                  />
                  <Text style={{color:"grey"}}>Skype</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.MeetingsIconPress('H')}>
                <View>
                  <HangoutsIcon style={{color: 'green', fontSize: 30, alignSelf:"center"}} />
                  <Text style={{color:"grey"}}>Hangout</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.MeetingsIconPress('Z')}>
                <View>
                  <Image source={require('../Images/zoomicon.png')} style={{height:30, width:30,alignSelf:"center"}}/>
                  <Text style={{color:"grey"}}>Zoom</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.MeetingsIconPress('P')}>
                <View>
                  <Phone style={{color: CommonStyles.appColor, fontSize: 30,alignSelf:"center"}} />
                  <Text style={{color:"grey"}}>Phone</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
         </View>
          )}
          <View style={{flex: 0.15}}>
            <Button
              touchableOpacity={styles.CreateNeGroupStyle}
              buttonTitle={'Select'}
              onButtonPress={() => this.SelectLocation()}
            />
          </View>
        </View>
        <View>
          <Dialog
            style={{marginBottom: 50}}
            onTouchOutside={this._handleOnClose}
            onHardwareBackPress={() => {
              this.setState({MeetingsURLpopup: false});
            }}
            onDismiss={() => {
              this.setState({MeetingsURLpopup: false});
            }}
            width={0.9}
            height={0.3}
            visible={this.state.MeetingsURLpopup}
            rounded
            actionsBordered
            dialogTitle={
              <DialogTitle
                titleAlign={'center'}
                style={{borderBottomWidth: 1}}
                title={
                  this.state.MeetingURLType == 'P'
                    ? 'Add Phone number'
                    : 'Add Meeting URL'
                }
                textStyle={{color: 'black'}}
                hasTitleBar={true}
                align="center"
              />
            }
            footer={
              <DialogFooter style={{borderColor: '#fff'}}>
                <DialogButton
                  text="Cancel"
                  // bordered={1}
                  style={styles.DialogButton}
                  textStyle={styles.DialogButtonText}
                  onPress={() => this.OnCancelPress()}
                  key="button-1"
                />
                <DialogButton
                  text="Add"
                  style={[styles.DialogButton]}
                  textStyle={styles.DialogButtonText}
                  onPress={() => this.AddMeetingURL()}
                  key="button-2"
                />
              </DialogFooter>
            }>
            <DialogContent style={{height: 90}}>
              <TextInput
                style={styles.DialogTextinputStyle}
                keyboardType={this.state.MeetingURLType == 'P' ? 'number-pad' : 'default'}
                underlineColor="transparent"
                placeholder={
                  this.state.MeetingURLType == 'P'
                    ? 'Enter Phone number'
                    : ' Enter Url'
                }
                placeholderTextColor="lightgray"
                onChangeText={text => this.AddUrl(text)}
                value={this.state.meetingURL}
              />
            </DialogContent>
          </Dialog>
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
)(GroupMebers);
