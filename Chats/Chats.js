import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {goBack} from '../Services/BackButtonServices';
import CommonHeader from '../shared/CommonHeader';
import {BoldText, MediumBoldText} from '../shared/Text';
import {styles} from './Listcommonstyles';
import ServiceCalls from '../Services/APICalls';
import {CommonStyles, GilRoyMediumColor} from '../shared/Constants';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
} from 'react-native-popup-dialog';
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
  Image,
  TouchableHighlight,
  ScrollView,
  BackHandler,
  Text,
} from 'react-native';
import Footer from '../shared/Footer';
import {Thumbnail} from 'native-base';
import Images from '../Images';
import {
  Msgicon,
  People,
  Delete,
  Search,
  Block,
  Cancel,
  X,
  ArrowLeft,
  Closecircle,
  CircleCheck,
  AddUser,
} from '../shared/Icon';
import LinearGradient from 'react-native-linear-gradient';
import {
  requestExternalWritePermission,
  selectPhotoTapped,
} from '../Profile/ProfileBusiness/index.service';
import moment from 'moment';
import Updatenearbystatus from '../Services/UpdateNearbystatus';
import blockLogo from '../Images/blockIcon.png';
const colors= [
  '#27BECF','#994F14','#DA291C','#FFCD00','#007A33','#EB9CA8', '#7C878E',
  '#8A004F','#000000','#10069F','#00a3e0','#4CC1A1','#915520', '#b3d962',
  '#67a8e0', '#c06dde', '#1ec952', '#cc1f36', '#0b615f', '#911c16'
]
class Chats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Tempcontacts: [],
      YesProfiles: [],
      GroupName: '',
      SingleChatTabColor: ['rgba(8,155,171,1)', 'rgba(17,203,223,1)'],
      GroupChatTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      GroupChatIconColor: '#e0e0e0',
      GrpORConatctName: '',
      IsshowDeleteIcon: false,
      selectedChannelIds: [],
      isDisplaySearchTextInput: false,
      SearchCount: '',
      ShownoOfRes: false,
      HaveFav: false,
      IsCancel: false,
      SearchText: '',
      FavContactsList: [],
      IsDelete: false,
      DialogcontentText: '',
      DialogtitleText: '',
      DeleteORBlockdialog: false,
      surewantToUnBlock: false,
      BlockedUsrChnlId: 0,
      Touserid: 0,
      IssingleChatHighlight: true,
      showalert: false,
      multinames: [],
      DisplayText: '',
    };
    global.chats = this;
    BackHandler.addEventListener('hardwareBackPress', this.back_Button_Press);
  }

  groupsClick = () => {
    this.setState({IssingleChatHighlight: false});
    Actions.ChatGroups();
  };
  Contacts = () => {
    Actions.ChatContacts();
  };
  _handleHeaderRightIcon = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => this.Contacts()}>
          {/* <View style={[styles.BgIconStyle]}>
            <AddUser style={{fontSize: 20, color: CommonStyles.appColor}} />
          </View> */}
          <View style={[styles.BgIconStyle]}>
            <Image source={require('../Images/usernew1.png')} style={{height:47, width:47}} />
          </View>
          <Text style={{fontSize: 10, color: '#ffffff', textAlign: 'center'}}>
            New Chat
          </Text>
        </TouchableOpacity>
      </View>
    );
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
          colors={this.state.SingleChatTabColor}
          style={styles.touchableOpacityView_InviteUser}>
          <View style={{justifyContent: 'center'}}>
            <Image source={require('../Images/onetoonechatWhite.png')} />
          </View>
        </LinearGradient>
        <LinearGradient
          start={{x: 1, y: 1.5}}
          end={{x: 1, y: 0}}
          colors={this.state.GroupChatTabColor}
          style={styles.touchableOpacityView_Nearby}>
          <TouchableOpacity onPress={() => this.groupsClick()}>
            <View style={{justifyContent: 'center'}}>
              {/* <People style={{color: this.state.GroupChatIconColor}} /> */}
              <Image source={require('../Images/GrpProfile.png')} style={{height:27, width:27, tintColor:"light-grey"}} />
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  };

  _handleHeaderCenterIcon1 = () => {
    return (
      <View style={styles.ChatSearchStyle}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 10,
            flex: 0.1,
          }}>
          <Search style={{color: '#a9a9a9', fontSize: 20}} />
        </View>
        <View style={{flex: 0.7, flexDirection: 'row', height: 38}}>
          <TextInput
            underlineColor="transparent"
            placeholder="Search by name"
            placeholderTextColor={'#a9a9a9'}
            onChangeText={value => this._handleOnSearchTextChange(value)}
            value={this.state.SearchText}
            onFocus={() => this._handleOnTextInputFocus()}
          />
        </View>
        <View
          style={{
            flex: 0.2,
            marginTop: 10,
          }}>
          {this.state.IsCancel ? (
            <TouchableOpacity onPress={() => this.ClearYesprofiles()}>
              <X style={{color: '#a9a9a9', fontSize: 18}} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };
  IsShowTabs = item => {
    if (!this.state.IsshowDeleteIcon) {
      this.press(item);
      this.setState({IsshowDeleteIcon: true});
    }
  };
  press = item => {
    var recenthistory = this.state.YesProfiles;
    recenthistory.map(data => {
      if (data.channelId === item.channelId) {
        data.check = !data.check;
        if (data.check === true) {
          this.state.selectedChannelIds.push(data.channelId);
          this.state.multinames.push({Id: data.channelId, Name: data.name});
        } else if (data.check === false) {
          const i = this.state.selectedChannelIds.indexOf(data.channelId);
          if (i !== -1) {
            this.state.selectedChannelIds.splice(i, 1);
            this.state.multinames.forEach(function(item, index, object) {
              if (item.Id == data.channelId) {
                object.splice(index, 1);
              }
            });
            return this.state.selectedChannelIds;
          }
        }
      }
    });
    this.setState({YesProfiles: recenthistory});
    if (this.state.selectedChannelIds.length === 0) {
      this.setState({IsshowDeleteIcon: false});
    }
  };
  GetChatProfiles() {
    try {
      var dataToSend = {UserId: global.LoginUserId};
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/GetChatProfiles', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          for (let i = 0; i < responseJson.recentList.length; i++) {
            var status = this.calculateDateDiff(
              responseJson.recentList[i].lastmsgDate,
            );
            responseJson.recentList[i].connectedStatus = status;
          }
          this.setState({
            YesProfiles: responseJson.recentList,
            FavContactsList: responseJson.favoriteList,
            TempfavList: responseJson.favoriteList,
            Tempcontacts: responseJson.recentList,
          });
        })
        .catch(error => Alert.alert(error.message));
    } catch (e) {
      Alert.alert(e.message);
    }
  }
  calculateDateDiff(AcceptDate) {
    if (AcceptDate == null) {
      return '';
    } else {
      const CurrentDate = moment.utc();
      const _acceptedDate = moment.utc(AcceptDate);
      var dateDiffInYears = _acceptedDate.diff(CurrentDate, 'years').toString();
      dateDiffInYears = dateDiffInYears.replace(/-/g, '');
      if (dateDiffInYears == 1) {
        return dateDiffInYears + ' year ago';
      } else if (dateDiffInYears > 1) {
        return dateDiffInYears + ' years ago';
      }

      var dateDiffInMonths = _acceptedDate
        .diff(CurrentDate, 'months')
        .toString();
      dateDiffInMonths = dateDiffInMonths.replace(/-/g, '');
      if (dateDiffInMonths == 1) {
        return dateDiffInMonths + ' month ago';
      } else if (dateDiffInMonths > 1) {
        return dateDiffInMonths + ' months ago';
      }
      var dateDiffInDays = _acceptedDate.diff(CurrentDate, 'days').toString();
      dateDiffInDays = dateDiffInDays.replace(/-/g, '');
      if (dateDiffInDays == 1) {
        return dateDiffInDays + 'day ago';
      } else if (dateDiffInDays > 1 && dateDiffInDays < 7) {
        return dateDiffInDays + 'days ago';
      } else if (dateDiffInDays >= 7 && dateDiffInDays < 14) {
        return '1 week ago';
      } else if (dateDiffInDays >= 14 && dateDiffInDays < 21) {
        return '2 weeks ago';
      } else if (dateDiffInDays >= 21 && dateDiffInDays < 28) {
        return '3 weeks ago';
      } else if (dateDiffInDays >= 28) {
        return '4 weeks ago';
      }
      var dateDiffInHours = _acceptedDate.diff(CurrentDate, 'hour').toString();

      dateDiffInHours = dateDiffInHours.replace(/-/g, '');
      if (dateDiffInHours == 1) {
        return dateDiffInHours + ' hour ago';
      } else if (dateDiffInHours > 1) {
        return dateDiffInHours + ' hours ago';
      }
      var dateDiffInminutes = _acceptedDate
        .diff(CurrentDate, 'minutes')
        .toString();
      dateDiffInminutes = dateDiffInminutes.replace(/-/g, '');
      if (dateDiffInminutes == 1) {
        return dateDiffInminutes + ' minute ago';
      } else if (dateDiffInminutes > 1) {
        return dateDiffInminutes + ' minutes ago';
      } else if (dateDiffInminutes < 1) {
        return ' just now';
      }
    }
  }
  back_Button_Press = () => {
    global.MyConnections.setState({
      IsScan: true,
      IsCancel: false,
      IsShowTabsForMultiple: false,
      IsShowTabs: false,
    });
    global.MyConnections._handleMyContactSearch('');
    global.MyConnections.getInitialData();
  };
  componentDidMount() {
    var userPrfoiles = global.MyConnections.props.userProfile;
    if (userPrfoiles != null) {
      userPrfoiles.hasnewchatmessage = false;
      global.MyConnections.props.setUserProfile(userPrfoiles);
    }
    global.footer.setState({HasChatmsg: false});
    Updatenearbystatus.updateNearbyStatus(
      false,
      global.currentLongitude,
      global.currentLatitude,
    );
    this.GetChatProfiles();
  }
  DeleteChannelMsgs() {
    this.setState({
      IsDelete: true,
      DialogtitleText: 'Delete Chat',
      DialogcontentText:
        'Once you delete, you will loose all your chat history, pictures and any attached files',
      DeleteORBlockdialog: true,
    });
  }
  BlockChannelMsgs() {
    this.setState({
      IsDelete: false,
      DialogtitleText: 'Are you sure you want to block this person?',
      DialogcontentText:
        'If you block a person, you wont receive any further messages from blocked person. Still you want to block',
      DeleteORBlockdialog: true,
    });
  }
  _renderContactDetails = item => {
    return (
      <View style={{flex: 3, marginLeft: 10}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 4}}>
            <MediumBoldText style={styles.textName}>{item.name}</MediumBoldText>
            <Text numberOfLines={1} style={styles.textDesignation}>
              {item.latestMsg}
            </Text>
            <Text style={styles.textDesignation}>{item.connectedStatus}</Text>
          </View>
          <View style={{flex: 1}}>
            {item.unreadmsgCount > 0 ? (
              <Text style={styles.msgCountStyle}>{item.unreadmsgCount}</Text>
            ) : null}
          </View>
        </View>
      </View>
    );
    // }
  };
  _renderImageData = (item,index) => {
    if (item.image !== '' && item.image !== null) {
      return (
        <View style={{flexDirection: 'row', position: 'relative'}}>
          <Thumbnail
            medium
            source={{
              uri: global.APIURL + 'uploadimgs/ProfilePictures/' + item.image,
            }}
          />
          {item.check ? (
            <View style={styles.Tickmark}>
              <CircleCheck
                style={{
                  color: CommonStyles.appColor,
                  fontSize: 13,
                  marginTop: 4,
                }}
              />
            </View>
          ) : null}
        </View>
      );
    }
    return (
      <View style={{height: 58,
        width: 58,
        borderRadius: 116,
        justifyContent: 'center',
        backgroundColor: colors[index%colors.length]
        }}>
        <Text
          style={{
            fontSize: 26,
            color: "#fff",
            textAlign: 'center',
          }}>
          {item.initials}
        </Text>
        {item.check ? (
          <View style={styles.Tickmark}>
            <CircleCheck
              style={{color: CommonStyles.appColor, fontSize: 13, marginTop: 4}}
            />
          </View>
        ) : null}
      </View>
    );
  };
  ContactsOnPress = item => {
    if (this.state.IsshowDeleteIcon) {
      this.press(item);
    } else {
      Actions.chattingUI({
        ChannelId: item.channelId,
        TouserId: item.guid,
        GrpORConatctName: item.name,
        initials: item.initials,
        IsFavoriteContact: item.isFavorite,
        isBlocked: item.isBlocked,
        Img: item.image,
      });
    }
  };
  UploadGrpPhoto = async imageType => {
    var obj = this;
    if (Platform.OS === 'android') {
      await requestExternalWritePermission(obj, imageType);
    } else {
      await selectPhotoTapped(obj, 'GrpPhotoUpload');
    }
  };
  FavoriteContacts = (item,index) => {
    if (!item.isBlocked) {
      return (
        <TouchableOpacity onPress={() => this.ContactsOnPress(item)}>
          <View style={[styles.FavContactStyle]}>
            {item.image !== '' && item.image !== null ? (
              <Thumbnail
                medium
                source={{
                  uri:
                    global.APIURL + 'uploadimgs/ProfilePictures/' + item.image,
                }}
              />
            ) : (
              <View style={{height: 58,
                width: 58,
                borderRadius: 116,
                justifyContent: 'center',
                backgroundColor: colors[index%colors.length]}}>
                <Text
                  style={{
                    fontSize: 26,
                    color: "#fff",
                    textAlign: 'center',
                  }}>
                  {item.initials}
                </Text>
              </View>
            )}
            <View style={{alignSelf: 'center'}}>
              <Text style={{fontSize: 14}}>
                {item.name.length > 8
                  ? item.name.substring(0, 8) + '...'
                  : item.name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this.alertSureUnblock(item.channelId, item.guid)}>
          <View style={[styles.FavContactStyle]}>
            {item.image !== '' && item.image !== null ? (
              <Thumbnail
                style={{height: 58, width: 58, borderRadius: 114}}
                source={{
                  uri:
                    global.APIURL + 'uploadimgs/ProfilePictures/' + item.image,
                }}
              />
            ) : (
              <View style={[styles.fab1]}>
                <Text
                  style={{
                    fontSize: 26,
                    color: CommonStyles.appColor,
                    textAlign: 'center',
                  }}>
                  {item.initials}
                </Text>
              </View>
            )}
            {/* <View
              style={{
                position: 'absolute',
                top: 12,
                borderRadius: 50,
                left: 45,
                backgroundColor: 'gray',
              }}>
              <Block style={{color: '#ffffff', fontSize: 13}} />
            </View> */}
            <View style={{position:"absolute", left :45, bottom:0}}>
            <Image source={blockLogo} style={{ height:27, width:27,bottom:55}} />
        </View>
            <View style={{alignSelf: 'center'}}>
              <Text style={{fontSize: 14}}>
                {item.name.length > 8
                  ? item.name.substring(0, 8) + '...'
                  : item.name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };
  ConfirmDeleteORBlockChannelMsgs = () => {
    this.setState({ 
      IsshowDeleteIcon: false,
      DeleteORBlockdialog: false,
    })
    if (this.state.IsDelete) {
      try {
        var ChannelIds = this.state.selectedChannelIds.join(',');
        ServiceCalls.DeleteChannelMsgs(ChannelIds)
          .then(response => {
            var profiles = this.state.YesProfiles;
            this.state.selectedChannelIds.forEach(function(data) {
              profiles = profiles.filter(obj => {
                return obj.channelId !== data;
              });
            });
            this.setState({
              YesProfiles: profiles,
              IsshowDeleteIcon: false,
              DeleteORBlockdialog: false,
              selectedChannelIds: [],
            });
          })
          .catch(error => {
            Alert.alert(error.message);
          });
      } catch (e) {
        Alert.alert(e.message);
      }
    } else {
      try {
        var ChannelIds = this.state.selectedChannelIds.join(',');
        var dataToSend = {UserId: global.LoginUserId, ChannelIds: ChannelIds};
        var formBody = [];
        for (var key in dataToSend) {
          var encodedKey = encodeURIComponent(key);
          var encodedValue = encodeURIComponent(dataToSend[key]);
          formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');
        return fetch(global.APIURL + 'api/Card/MarkChannelsAsBlocked', {
          method: 'POST', //Request Type
          body: formBody, //post body
          headers: {
            //Header Defination
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
        })
          .then(response => response.json())
          .then(responseJson => {
            var recenhistory = this.state.YesProfiles;
            var FavHistory = this.state.FavContactsList;
            this.state.selectedChannelIds.forEach(function(data) {
              recenhistory.filter(obj => {
                if (obj.channelId == data) {
                  obj.isBlocked = !obj.isBlocked;
                  obj.check = false;
                }
                return recenhistory;
              });
            });
            this.state.selectedChannelIds.forEach(function(data) {
              FavHistory.filter(obj => {
                if (obj.channelId == data) {
                  obj.isBlocked = !obj.isBlocked;
                }
                return FavHistory;
              });
            });
            this.setState({
              YesProfiles: recenhistory,
              FavContactsList: FavHistory,
              IsshowDeleteIcon: false,
              DeleteORBlockdialog: false,
              selectedChannelIds: [],
              DisplayText:
                Array.prototype.map
                  .call(this.state.multinames, function(item) {
                    return item.Name;
                  })
                  .join(',') +
                ' blocked from chatting, you wont receive any further messages',
              showalert: true,
            });
            setTimeout(() => {
              this.setState({
                DisplayText: '',
                showalert: false,
                multinames: [],
              });
            }, 5000);
          });
      } catch (e) {
        Alert.alert(e.message);
      }
    }
  };

  cancelIconPress = () => {
    var recenthis = this.state.YesProfiles;
    recenthis.map(data => {
      if (data.check) {
        data.check = false;
      }
    });
    this.setState({
      YesProfiles: recenthis,
      selectedChannelIds: [],
      IsshowDeleteIcon: false,
    });
  };
  IsShowDeleteView = () => {
    if (this.state.IsshowDeleteIcon) {
      return (
        <View style={styles.floatingstyle}>
          <TouchableOpacity onPress={() => this.DeleteChannelMsgs()}>
            <Delete style={{color: '#D3D3D3', marginTop: 5, fontSize: 18}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.BlockChannelMsgs()}>
            <Block
              style={{
                color: '#D3D3D3',
                fontSize: 17,
                marginTop: 10,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.cancelIconPress()}>
            <Cancel style={{color: '#D3D3D3', marginTop: 10, fontSize: 20}} />
          </TouchableOpacity>
        </View>
      );
    }
  };
  _handleHeaderLeftIcon = () => {
    return (
      <View style={styles.BgIconStyle}>
        <Search style={{color: CommonStyles.appColor}} />
      </View>
    );
  };
  _handleHeaderLeftIconPress = () => {
    this.setState({
      isDisplaySearchTextInput: true,
      SearchText: '',
    });
  };

  _handleClearSearch = () => {
    this.setState({
      isDisplaySearchTextInput: false,
      ShownoOfRes: false,
      YesProfiles: this.state.Tempcontacts,
      FavContactsList: this.state.TempfavList,
    });
  };
  ClearYesprofiles = () => {
    this.setState({
      IsCancel: false,
      YesProfiles: this.state.Tempcontacts,
      FavContactsList: this.state.TempfavList,
      SearchText: '',
      ShownoOfRes: false,
      SearchCount: '',
    });
  };
  _handleOnSearchTextChange = value => {
    var searchItems = value
      .trim()
      .toLowerCase()
      .split(' ');
    this.setState({ShownoOfRes: false, IsCancel: false, SearchText: value});
    if (value != '' && value != null) {
      this.setState({ShownoOfRes: true, IsCancel: true});
    }
    value = value.trim().toLowerCase();
    var RecentChatList = [];
    var FavList = [];
    this.setState({
      SearchCount: RecentChatList.length,
    });
    FavList = this.state.TempfavList.filter(contact => {
      if (
        searchItems.filter(
          x => contact.name != null && contact.name.toLowerCase().includes(x),
        ).length > 0
      ) {
        return true;
      }
    });
    RecentChatList = this.state.Tempcontacts.filter(contact => {
      if (
        searchItems.filter(
          x => contact.name != null && contact.name.toLowerCase().includes(x),
        ).length > 0
      ) {
        return true;
      }
    });
    this.setState({
      YesProfiles: RecentChatList,
      FavContactsList: FavList,
      SearchCount: RecentChatList.length + FavList.length,
    });
  };
  _handleOnTextInputFocus = () => {
    this.setState({IsCancel: true});
  };
  _handleHeaderText = () => {
    return (
      <View>
        <BoldText
          style={{
            color: '#ffff',
            fontSize: 14,
          }}>
          Chats
        </BoldText>
      </View>
    );
  };
  _handleHeaderLeftIcon1 = () => {
    return (
      <View style={styles.arrowBgstyle}>
        <ArrowLeft style={{color: '#27BECF', fontSize: 20}} />
      </View>
    );
  };
  AlertClose = () => {
    var recenthis = this.state.YesProfiles;
    recenthis.map(data => {
      if (data.check) {
        data.check = false;
      }
    });
    this.setState({
      YesProfiles: recenthis,
      selectedChannelIds: [],
      IsshowDeleteIcon: false,
      DeleteORBlockdialog: false,
    });
  };
  recentchatList = (item,index) => {
    if (!item.isBlocked) {
      return (
        <TouchableOpacity
          onPress={() => this.ContactsOnPress(item)}
          onLongPress={() => this.IsShowTabs(item)}>
          <View style={styles.viewContactContainer}>
            <View style={[styles.viewContact]}>
              <View style={{marginLeft: 10}}>
                {this._renderImageData(item,index)}
              </View>
              {this._renderContactDetails(item)}
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this.alertSureUnblock(item.channelId, item.guid)}>
          <View style={styles.viewContactContainer}>
            <View style={[styles.viewContact]}>
              <View style={{marginLeft: 10}}>
                {this._renderImageData(item,index)}
              </View>
              {/* <View
                style={{
                  bottom: 15,
                  right: 15,
                  borderRadius: 50,
                  backgroundColor: 'gray',
                }}>
                <Block style={{color: '#ffffff', fontSize: 13}} />
              </View> */}
              <View style={{position:"absolute", left :45, bottom:35}}>
        <TouchableOpacity
            onPress={() => this.setState({VideoURI:''})}>
            {/* <Closecircle /> */}
            <Image source={blockLogo} style={{ height:27, width:27}} />
          </TouchableOpacity>
        </View>
              {this._renderContactDetails(item)}
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };
  alertSureUnblock = (BlockedUsrChnlId, touserid) => {
    this.setState({
      surewantToUnBlock: true,
      BlockedUsrChnlId: BlockedUsrChnlId,
      Touserid: touserid,
    });
  };
  sureunblock = () => {
    try {
      ServiceCalls.BlockORUnBlock(
        this.state.BlockedUsrChnlId,
        this.state.Touserid,
      )
        .then(response => {
          this.setState({surewantToUnBlock: false});
          var recenhistory = this.state.YesProfiles;
          var FavHistory = this.state.FavContactsList;
          recenhistory.forEach(element => {
            if (element.channelId == this.state.BlockedUsrChnlId) {
              element.isBlocked = !element.isBlocked;
            }
          });
          FavHistory.forEach(ele => {
            if (ele.channelId == this.state.BlockedUsrChnlId) {
              ele.isBlocked = !ele.isBlocked;
            }
          });
          this.setState({
            YesProfiles: recenhistory,
            FavContactsList: FavHistory,
            surewantToUnBlock: false,
          });
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  render() {
    return (
      <View style={{backgroundColor: '#f4f6f9', flex: 1}}>
        {!this.state.isDisplaySearchTextInput ? (
          <View style={{flex: 0.18}}>
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
              TabLabel1={'Individual Chat'}
              TabLabel2={'Group Chat'}
            />
          </View>
        ) : (
          <View style={{flex: 0.18}}>
            <CommonHeader
              HeaderLeftIcon={() => this._handleHeaderLeftIcon1()}
              HeaderRightIcon={() => {
                return null;
              }}
              HeaderCenterIcon={() => this._handleHeaderCenterIcon1()}
              HeaderLeftIconPress={this._handleClearSearch}
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
            />
          </View>
        )}
        <View style={{flex: 1}}>
          {this.state.showalert ? (
            <View style={{marginLeft: 20, marginTop: 10}}>
              <Text style={{color: GilRoyMediumColor.fontColor}}>
                {this.state.DisplayText}
              </Text>
            </View>
          ) : null}
          <View
            style={{
              marginTop: 15,
              marginBottom: 10,
              marginRight: 10,
            }}>
            <BoldText
              style={[
                styles.textName,
                {marginLeft: 15, color: '#A9A9A9', fontSize: 16},
              ]}>
              Favorite Contacts
            </BoldText>
            {this.state.FavContactsList.length < 1 ? (
              <Text
                style={{
                  marginLeft: 15,
                  marginBottom: 10,
                  color: 'gray',
                  fontSize: 14,
                }}>
                No Favorites
              </Text>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <FlatList
                  horizontal
                  keyboardShouldPersistTaps={'always'}
                  keyboardDismissMode={'interactive'}
                  data={this.state.FavContactsList}
                  renderItem={({item,index}) => (
                    <View>{this.FavoriteContacts(item,index)}</View>
                  )}
                />
              </View>
            )}
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{flex: 1}}>
              <BoldText
                style={[
                  styles.textName,
                  {marginLeft: 15, color: '#A9A9A9', fontSize: 16},
                ]}>
                Recent History
              </BoldText>
              {this.state.YesProfiles.length == 0 ? (
                <Text style={{marginLeft: 15, color: 'gray'}}>
                  No Recent History
                </Text>
              ) : null}
              <FlatList
                keyboardShouldPersistTaps={'always'}
                keyboardDismissMode={'interactive'}
                data={this.state.YesProfiles}
                renderItem={({item,index}) => this.recentchatList(item,index)}
              />
            </View>
            <View>{this.IsShowDeleteView()}</View>
          </View>
        </View>
        <View style={{flex: 0.13}}>
          <Footer />
        </View>
        <Dialog
          onTouchOutside={this._handleOnClose}
          onHardwareBackPress={this._handleOnClose}
          onDismiss={() => {
            this.setState({DeleteORBlockdialog: false});
          }}
          width={0.9}
          height={0.39}
          visible={this.state.DeleteORBlockdialog}
          rounded
          actionsBordered
          dialogTitle={
            <DialogTitle
              titleAlign={'center'}
              style={{borderBottomWidth: 1}}
              title={this.state.DialogtitleText}
              textStyle={{}}
              hasTitleBar={true}
              align="center"
            />
          }
          footer={
            <DialogFooter style={{borderColor: '#ffffff'}}>
              <DialogButton
                text="No"
                style={styles.DialogYesORNo}
                textStyle={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}
                onPress={() => {
                  this.AlertClose();
                }}
                key="button-1"
              />
              <DialogButton
                text={'Yes'}
                style={styles.DialogYesORNo}
                textStyle={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}
                onPress={() => {
                  this.ConfirmDeleteORBlockChannelMsgs();
                }}
                key="button-2"
              />
            </DialogFooter>
          }>
          <DialogContent style={{height: 90}}>
            <Text style={{fontSize: 18, marginTop: 10}}>
              {this.state.DialogcontentText}
            </Text>
          </DialogContent>
        </Dialog>
        <Dialog
          onTouchOutside={this._handleOnClose}
          onHardwareBackPress={this._handleOnClose}
          onDismiss={() => {
            this.setState({surewantToUnBlock: false});
          }}
          width={0.9}
          height={0.37}
          visible={this.state.surewantToUnBlock}
          rounded
          actionsBordered
          dialogTitle={
            <DialogTitle
              titleAlign={'center'}
              style={{borderBottomWidth: 1}}
              title="Unblock Person"
              textStyle={{}}
              hasTitleBar={true}
              align="center"
            />
          }
          footer={
            <DialogFooter style={{borderColor: '#ffffff'}}>
              <DialogButton
                text="No"
                style={styles.DialogYesORNo}
                textStyle={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}
                onPress={() => {
                  this.setState({surewantToUnBlock: false});
                }}
                key="button-1"
              />
              <DialogButton
                text={'Yes'}
                style={styles.DialogYesORNo}
                textStyle={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}
                onPress={() => {
                  this.sureunblock();
                }}
                key="button-2"
              />
            </DialogFooter>
          }>
          <DialogContent style={{height: 90}}>
            <Text style={{fontSize: 18, marginTop: 10}}>
              are you sure you want to unblock person
            </Text>
          </DialogContent>
        </Dialog>
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
)(Chats);
