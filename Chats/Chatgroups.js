import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { goBack } from '../Services/BackButtonServices';
import CommonHeader from '../shared/CommonHeader';
import FloatingInput from '../shared/FloatingTextInput';
import Button from '../shared/Button';
import { CommonStyles, GilRoyMediumColor } from '../shared/Constants';
import { BoldText } from '../shared/Text';
import ServiceCalls from '../Services/APICalls';
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
  PermissionsAndroid,
  TextInput,
  Text,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { styles } from './Listcommonstyles';
import Footer from '../shared/Footer';
import { Thumbnail } from 'native-base';
import SwipeablePanel from 'rn-swipeable-panel';
import LinearGradient from 'react-native-linear-gradient';
import {
  Pluscircleo,
  ExitIcon,
  Delete,
  Cancel,
  Camera,
  Search,
  ArrowLeft,
  X,
  PhotoGraph,
  CircleCheck,
  People,
} from '../shared/Icon';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';
class Chatgroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      GroupsList: [],
      TempGroups: [],
      swipeablePanelActive: false,
      GroupName: '',
      SingleChatTabColor: ['rgba(8,155,171,1)', 'rgba(17,203,223,1)'],
      GroupChatTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      SingleChatIconColor: '#ffffff',
      GroupChatIconColor: '#e0e0e0',
      GrpORConatctName: '',
      Imgbase64: '',
      FileName: '',
      ext: '',
      IsFavoriteGrp: false,
      HasFav: false,
      GroupMemberIds: '',
      ConnGroupId: 0,
      selectedGroupId: 0,
      DeleteView: false,
      IsMembersExist: false,
      StateHasLeft: false,
      surewantToDelete: false,
      DialogHeader: '',
      alertmsg: '',
      IsDelete: false,
      OnlyonetimeLongpress: false,
      isDisplaySearchTextInput: false,
      ShownoOfRes: false,
      IsCancel: false,
      SearchCount: '',
      GrpId: 0,
      GroupIconUrl: '',
      ActivityIndicator: false,
      CreateOrUpdateGrpTitle: '',
      showalert: false,
      DisplayText: '',
    };
    global.grps = this;
  }

  GetGroups = () => {
    this.setState({
      SingleChatTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      GroupChatTabColor: ['rgba(8,155,171,1)', 'rgba(17,203,223,1)'],
      SingleChatIconColor: '#e0e0e0',
      GroupChatIconColor: '#ffffff',
    });
    try {
      var dataToSend = { UserId: global.LoginUserId };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/GetGroupChatProfiles', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          for (let i = 0; i < responseJson.length; i++) {
            if (responseJson[i].lastmsgDate != null) {
              var status = this.calculateDateDiff(responseJson[i].lastmsgDate);
              responseJson[i].connectedStatus = status;
            } else {
              responseJson[i].connectedStatus = '';
            }
            if (responseJson[i].isFavorite == true) {
              this.setState({ HasFav: true });
            }
          }
          this.setState({
            GroupsList: responseJson,
            TempGroups: responseJson,
            ActivityIndicator: false,
          });
        })
        .catch(error => Alert.alert(error.message));
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  PersonClick = () => {
    this.setState({
      SingleChatTabColor: ['rgba(8,155,171,1)', 'rgba(17,203,223,1)'],
      GroupChatTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      SingleChatIconColor: '#ffffff',
      GroupChatIconColor: '#e0e0e0',
    });
    Actions.Chats();
  };
  AddCahhnelGroups = () => {
    this.setState({
      swipeablePanelActive: true,
      GroupMemberIds: '',
      GroupName: '',
      ConnGroupId: 0,
      IsMembersExist: false,
      GroupIconUrl: '',
      CreateOrUpdateGrpTitle: 'Create Group Chat',
    });
    //  this.swipeUpDownRef.showFull();
  };
  closePanel = () => {
    this.setState({ swipeablePanelActive: false });
  };
  _handleHeaderRightIcon = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => this.AddCahhnelGroups()}>
          <View style={[styles.BgIconStyle]}>
            <Pluscircleo style={{ color: CommonStyles.appColor, fontSize: 37 }} />
          </View>
          <Text style={{ fontSize: 10, color: '#ffffff', textAlign: 'center' }}>
            New Group
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
          backgroundColor: '#ffffff',
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          padding: 1,
        }}>
        <LinearGradient
          start={{ x: 1, y: 1.5 }}
          end={{ x: 1, y: 0 }}
          colors={this.state.SingleChatTabColor}
          style={styles.touchableOpacityView_InviteUser}>
          <TouchableOpacity onPress={() => this.PersonClick()}>
            <View style={{ justifyContent: 'center' }}>
              <Image source={require('../Images/onetooneIcon.png')} />
            </View>
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          start={{ x: 1, y: 1.5 }}
          end={{ x: 1, y: 0 }}
          colors={this.state.GroupChatTabColor}
          style={styles.touchableOpacityView_Nearby}>
          <View style={{ justifyContent: 'center' }}>
            {/* <People style={{color: this.state.GroupChatIconColor}} /> */}
            <Image source={require('../Images/GrpProfile.png')} style={{ height: 27, width: 27, tintColor: "#fff" }} />
          </View>
        </LinearGradient>
      </View>
    );
  };
  componentDidMount() {
    global.ConnectionsTabColor = '#e0e0e0';
    global.ChatTabColor = CommonStyles.appColor;
    global.MeetingsTabColor = '#e0e0e0';
    global.NotificationsTabColor = '#e0e0e0';
    const {
      swipeablePanelActive,
      GroupMemberIds,
      ConnGrpId,
      GroupName,
      GruopMembercount,
      GroupId,
      GroupIconUrl,
      Img,
      isFromMyConnection,
      isFromGroups
    } = this.props;
    console.log("IsGroups", isFromGroups)
    if (swipeablePanelActive) {
      this.setState({
        swipeablePanelActive: true,
        GroupName: GroupName,
      });
    }
    if (Img != null && Img != undefined && Img != '') {
      this.setState({ FileName: Img, GroupIconUrl: GroupIconUrl });
    }
    if (GroupMemberIds != undefined && GroupMemberIds != null) {
      this.setState({ GroupMemberIds: GroupMemberIds, IsMembersExist: true });
    }
    if (ConnGrpId != undefined && ConnGrpId != null) {
      this.setState({ ConnGroupId: ConnGrpId });
    }
    if (
      GruopMembercount != undefined &&
      GruopMembercount != null &&
      GruopMembercount != 0
    ) {
      this.setState({ IsMembersExist: true });
    }
    if (GroupId != undefined && GroupId != null && GroupId != 0) {
      this.setState({
        GrpId: GroupId,
        CreateOrUpdateGrpTitle: 'Edit Group Chat',
      });
    }
    this.GetGroups();
  }
  CheckChannelGrpName = () => {
    try {
      var dataToSend = {
        GroupId: this.state.GrpId,
        GroupName: this.state.GroupName,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/CheckChannelGrpName', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson) {
            alert('already exist');
          } else {
            this.SaveChannelGroups();
          }
        })
        .catch(error => Alert.alert(error.message));
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  SaveChannelGroups() {
    const { GroupName } = this.state;
    // if (GroupName.length === 0) {
    //   Alert.alert('Group name should not be empty');
    // } else {
    try {
      var dataToSend = {
        ImageBase64: this.state.Imgbase64,
        UserId: global.LoginUserId,
        GroupMemberIds: this.state.GroupMemberIds,
        GroupId: this.state.GrpId,
        GroupName: this.state.GroupName,
        FileName: this.state.FileName,
        ConnGrpId: this.state.ConnGroupId,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/SaveChannelGroups', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          var imgfile = '';
          if (
            this.state.ext != '' &&
            this.state.ext != null &&
            this.state.ext != undefined
          ) {
            imgfile = responseJson + '.' + this.state.ext;
          }
          if (this.state.IsMembersExist) {
            Actions.GroupChatting({
              ChannelId: responseJson,
              GrpORConatctName: this.state.GroupName,
              Img: imgfile,
              IsFavoriteGrp: false,
              IsAdmin: true,
            });
          } else if (this.state.GrpId == 0) {
            var obj = {
              name: this.state.GroupName,
              channelId: responseJson,
              image: imgfile != '' ? imgfile : this.state.FileName,
              isAdmin: true,
            };
            this.state.GroupsList.unshift(obj);
            Actions.GroupChatContacts({
              ChannelId: responseJson,
              GrpORConatctName: this.state.GroupName,
              IsAdmin: true,
              Img: imgfile != '' ? imgfile : this.state.FileName,
            });
          } else {
            this.state.GroupsList.forEach(element => {
              if (element.channelId == this.state.GrpId) {
                element.name = this.state.GroupName;
                element.image = imgfile != '' ? imgfile : element.image;
              }
            });
          }
          this.setState({
            GroupsList: this.state.GroupsList,
            Imgbase64: '',
            FileName: '',
            swipeablePanelActive: false,
            GroupMemberIds: '',
            ConnGroupId: 0,
          });
        })
        .catch(error => Alert.alert(error.message));
    } catch (e) {
      Alert.alert(e.message);
    }
    //  }
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
        return 'just now';
      }
    }
  }
  _renderContactDetails = item => {
    console.log("dsfguguujvjvjvjv", item)
    return (
      <View style={{ flex: 3 }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 2.7 }}>
            <BoldText style={styles.textName}>{item.name}</BoldText>
            {!item.isDeleted ? (<Text numberOfLines={1} style={styles.textDesignation}>
              {item.latestMsg}
            </Text>) : null}
            <Text style={styles.textDesignation}>{item.connectedStatus}</Text>
          </View>
          <View style={{ flex: 0.3, marginTop: 20 }}>
            {item.unreadmsgCount > 0 ? (
              <Text style={styles.msgCountStyle}>{item.unreadmsgCount}</Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  };
  _renderImageData = item => {
    if (item.image !== '' && item.image !== null) {
      return (
        <View style={{ flexDirection: 'row', position: 'relative' }}>
          <Thumbnail
            medium
            source={{
              uri: global.APIURL + 'uploadimgs/UploadGroupPhotos/' + item.image,
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
      <View>
        <Image
          style={{
            height: 60,
            width: 60,
            borderRadius: 60,
            backgroundColor: '#ffffff',
          }}
          source={require('../Images/GrpProfile.png')}
        />
        {item.check ? (
          <View style={styles.Tickmark}>
            <CircleCheck
              style={{ color: CommonStyles.appColor, fontSize: 13, marginTop: 4 }}
            />
          </View>
        ) : null}
      </View>
    );
  };
  GrpsClick = item => {
    Actions.GroupChatting({
      ChannelId: item.channelId,
      TouserId: item.guid,
      GrpORConatctName: item.name,
      Img: item.image,
      IsFavoriteGrp: item.isFavorite,
      IsAdmin: item.isAdmin,
      HasLeft: item.hasLeft,
    });
  };
  UploadGrpPhoto = async pickfrom => {
    var info = pickfrom;
    if (Platform.OS === 'android') {
      try {
        const grantedForWrite = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'CameraExample App External Storage Write Permission',
            message:
              'CameraExample App needs access to Storage data in your SD Card ',
          },
        );
        if (grantedForWrite === PermissionsAndroid.RESULTS.GRANTED) {
          try {
            const grantedForRead = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                title: 'CameraExample App Read Storage Read Permission',
                message: 'CameraExample App needs access to your SD Card ',
              },
            );
            if (grantedForRead === PermissionsAndroid.RESULTS.GRANTED) {
              this.selectPhotoTapped(info);
            } else {
              Alert.alert('READ_EXTERNAL_STORAGE permission denied');
            }
          } catch (err) {
            Alert.alert('Read permission err', err.message);
          }
        } else {
          Alert.alert('WRITE_EXTERNAL_STORAGE permission denied');
        }
      } catch (err) {
        Alert.alert('Write permission err', err.message);
      }
    } else {
      this.selectPhotoTapped(info);
    }
  };
  selectPhotoTapped(PickFrom) {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };
    if (PickFrom == 'camera') {
      return ImagePicker.launchCamera(options, response => {
        if (response.didCancel) {
          Alert.alert('User cancelled photo picker');
        } else if (response.error) {
          Alert.alert('ImagePicker Error: ', response.error.message);
        } else if (response.customButton) {
          Alert.alert('User tapped custom button: ', response.customButton);
        } else {
          var ext = response.fileName.split('.');
          let source = { uri: response.uri };
          this.setState({ GroupIconUrl: source.uri });
          this.setState({
            Imgbase64: response.data,
            FileName: response.fileName,
            ext: ext[1],
          });
        }
      });
    } else if (PickFrom == 'Gallery') {
      return ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
          Alert.alert('User cancelled photo picker');
        } else if (response.error) {
          Alert.alert('ImagePicker Error: ', response.error.message);
        } else if (response.customButton) {
          Alert.alert('User tapped custom button: ', response.customButton);
        } else {
          var ext = response.fileName.split('.');
          let source = { uri: response.uri };
          this.setState({ GroupIconUrl: source.uri });
          this.setState({
            Imgbase64: response.data,
            FileName: response.fileName,
            ext: ext[1],
          });
        }
      });
    }
  }
  FavoriteGroups = item => {
    if (item.isFavorite) {
      return (
        <TouchableOpacity onPress={() => this.GrpsClick(item)}>
          <View style={styles.FavContactStyle}>
            {item.image !== '' && item.image !== null ? (
              <Thumbnail
                medium
                source={{
                  uri:
                    global.APIURL +
                    'uploadimgs/UploadGroupPhotos/' +
                    item.image,
                }}
              />
            ) : (
              <Image
                style={{
                  height: 56,
                  width: 56,
                  borderRadius: 60,
                  backgroundColor: '#ffffff',
                }}
                source={require('../Images/GrpProfile.png')}
              />
            )}
            <Text style={{ fontSize: 14 }}>
              {item.name.length > 8
                ? item.name.substring(0, 8) + '...'
                : item.name}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
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
  press = item => {
    var grouplist = this.state.GroupsList;
    grouplist.map(data => {
      if (data.channelId === item.channelId) {
        data.check = !data.check;
        if (data.check === true) {
          this.setState({ selectedGroupId: item.channelId, DeleteView: true });
        } else if (data.check === false) {
          this.setState({
            selectedGroupId: 0,
            DeleteView: false,
            OnlyonetimeLongpress: false,
          });
        }
      }
    });
    this.setState({ GroupsList: grouplist });
  };
  ConfirmDeleteOrExitUser() {
    if (this.state.IsDelete) {
      try {
        var dataToSend = {
          ChannelId: this.state.selectedGroupId,
          UserId: global.LoginUserId,
        };
        var formBody = [];
        for (var key in dataToSend) {
          var encodedKey = encodeURIComponent(key);
          var encodedValue = encodeURIComponent(dataToSend[key]);
          formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');
        fetch(global.APIURL + 'api/Card/DeleteChannelGroupForUser', {
          method: 'POST', //Request Type
          body: formBody, //post body
          headers: {
            //Header Defination
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
        })
          .then(response => response.text())
          .then(responseJson => {
            var grps = this.state.GroupsList;
            grps = grps.filter(obj => {
              return obj.channelId != this.state.selectedGroupId;
            });
            this.setState({
              GroupsList: grps,
              DeleteView: false,
              OnlyonetimeLongpress: false,
              surewantToDelete: false,
            });
          })
          .catch(error => Alert.alert(error.message));
      } catch (e) {
        Alert.alert(e.message);
      }
    } else {
      ServiceCalls.LeaveChannelGroup(this.state.selectedGroupId).then(
        response => {
          var object = this.state.GroupsList;
          object.forEach(element => {
            if (element.channelId == this.state.selectedGroupId) {
              element.hasLeft = !element.hasLeft;
              element.check = false;
            }
            return object;
          });
          this.setState({
            GroupsList: object,
            selectedGroupId: 0,
            DeleteView: false,
            OnlyonetimeLongpress: false,
            surewantToDelete: false,
            DisplayText: 'Successfully Exit from the Group',
            showalert: true,
          });
          setTimeout(() => {
            this.setState({
              DisplayText: '',
              showalert: false,
            });
          }, 10000);
        },
      );
    }
  }
  DeleteChannelGroupForUser() {
    this.setState({
      surewantToDelete: true,
      DialogHeader: 'Delete chat Group',
      alertmsg: 'Are you sure you want to delete Group',
      IsDelete: true,
    });
  }
  LeaveChannelGroupForUser() {
    this.setState({
      surewantToDelete: true,
      alertmsg:
        'Once you exit  chat group, you will loose your group chat history, pictures and any attached files.',
      DialogHeader: 'Exit chat Group',
      IsDelete: false,
      OnlyonetimeLongpress: false,
    });
  }
  cancelSelectedGrps = () => {
    var groupdetails = this.state.GroupsList;
    groupdetails.map(data => {
      if (data.check) {
        data.check = false;
      }
    });
    this.setState({
      GroupsList: groupdetails,
      selectedGroupId: 0,
      DeleteView: false,
      OnlyonetimeLongpress: false,
      surewantToDelete: false,
    });
  };
  ShowTabs = item => {
    if (this.state.DeleteView) {
      return (
        <View style={styles.floatingmenustyle}>
          {this.state.StateHasLeft ? (
            <TouchableOpacity onPress={() => this.DeleteChannelGroupForUser()}>
              <Delete
                style={{ color: 'lightgray', marginTop: 5, fontSize: 18 }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => this.LeaveChannelGroupForUser()}>
              <ExitIcon
                style={{ color: 'lightgray', marginTop: 5, fontSize: 18 }}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => this.cancelSelectedGrps()}>
            <Cancel style={{ color: 'lightgray', marginTop: 10, fontSize: 20 }} />
          </TouchableOpacity>
        </View>
      );
    }
    // return null
  };
  IsShowTabs = item => {
    if (!this.state.OnlyonetimeLongpress) {
      this.press(item);
      this.setState({
        StateHasLeft: item.hasLeft,
        OnlyonetimeLongpress: true,
      });
    }
  };
  renderList = () => {
    return (
      <FlatList
        data={this.state.GroupsList}
        keyboardShouldPersistTaps={'always'}
        keyboardDismissMode={'interactive'}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => this.GrpsClick(item)}
            onLongPress={() => this.IsShowTabs(item)}>
            <View style={styles.viewContactContainer}>
              <View style={[styles.viewContact]}>
                <View style={{ marginLeft: 10 }}>
                  {this._renderImageData(item)}
                </View>
                <View style={{ marginLeft: 10 }} />
                {this._renderContactDetails(item)}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  };
  _handleHeaderLeftIconPress = () => {
    this.setState({
      isDisplaySearchTextInput: true,
      SearchText: '',
    });
  };
  _handleHeaderLeftIcon = () => {
    //  return null;
    return (
      <View style={styles.searchIconStyle}>
        <Search style={{ color: CommonStyles.appColor }} />
      </View>
    );
  };
  _handleHeaderLeftIcon1 = () => {
    return (
      <View style={styles.arrowBgstyle}>
        <ArrowLeft style={{ color: '#27BECF', fontSize: 20 }} />
      </View>
    );
  };
  _handleOnSearchTextChange = value => {
    var searchItems = value
      .trim()
      .toLowerCase()
      .split(' ');
    this.setState({ ShownoOfRes: false, IsCancel: false, SearchText: value });
    if (value != '' && value != null) {
      this.setState({ ShownoOfRes: true, IsCancel: true });
    }
    value = value.trim().toLowerCase();
    var RecentChatGrps = [];
    this.setState({
      SearchCount: RecentChatGrps.length,
    });
    RecentChatGrps = this.state.TempGroups.filter(contact => {
      if (contact.name.toLowerCase().startsWith(value)) {
        return true;
      }
    });
    this.setState({
      GroupsList: RecentChatGrps,
      SearchCount: RecentChatGrps.length,
    });
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
          <Search style={{ color: '#a9a9a9', fontSize: 20 }} />
        </View>

        <View style={{ flex: 0.7, flexDirection: 'row', height: 38 }}>
          <TextInput
            underlineColor="transparent"
            placeholder="Group name"
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
            <TouchableOpacity onPress={() => this.ClearGroups()}>
              <X style={{ color: '#a9a9a9', fontSize: 18 }} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };
  ClearGroups = () => {
    this.setState({
      IsCancel: false,
      GroupsList: this.state.TempGroups,
      SearchText: '',
      ShownoOfRes: false,
      SearchCount: '',
    });
  };
  _handleOnTextInputFocus = () => {
    this.setState({ IsCancel: true });
  };
  _handleClearSearch = () => {
    this.setState({
      isDisplaySearchTextInput: false,
      ShownoOfRes: false,
      GroupsList: this.state.TempGroups,
    });
  };
  GrpNameTextChange = value => {
    //Alert.alert('Emojis are not allowed');
    if (value.length > 15) {
      alert('Group name Cannot be more than 15 characters');
    } else {
      this.setState({ GroupName: value });
    }
  };
  renderGrpPhoto = () => {
    return (
      <View>
        {this.state.GroupIconUrl != '' &&
          this.state.GroupIconUrl != null &&
          this.state.GroupIconUrl != undefined ? (
          <Image
            style={{ height: 60, width: 60, borderRadius: 60 }}
            source={{
              uri: this.state.GroupIconUrl,
            }}
          />
        ) : (
          <Image
            style={{
              height: 50,
              width: 50,
              borderRadius: 100,
              backgroundColor: '#ffffff',
              borderWidth: 0.5,
              borderColor: CommonStyles.appColor,
              marginTop: 5,
            }}
            source={require('../Images/GrpProfile.png')}
          />
        )}
      </View>
    );
  };
  onGroupCancelIconPress = () => {
    const {
      isFromGroups,
      isFromGroupsGroupId,
      isFromGroupsGroupName,
      isFromMyConnection
    } = this.props;
    console.log("isFromMyConnection", isFromGroups);
    if (isFromGroups === true) {
      this.setState({
        swipeablePanelActive: false,
        Imgbase64: '',
        FileName: '',
        GroupName: '',
        GroupIconUrl: '',
      });
      // Actions.groupsAdd({
      //   GroupId: isFromGroupsGroupId,
      //   GroupName: isFromGroupsGroupName
      // });
      this.props.navigation.goBack()
    }
    else {
      this.setState({
        swipeablePanelActive: false,
        Imgbase64: '',
        FileName: '',
        GroupName: '',
        GroupIconUrl: '',
      });
    }
  }
  render() {
    const { swipeablePanelActive } = this.props;
    return (
      <View style={{ backgroundColor: '#f4f6f9', flex: 1 }}>
        {this.state.ActivityIndicator ? (
          <ActivityIndicator
            color={CommonStyles.appColor}
            size="large"
            height="80"
            style={{ alignSelf: 'center' }}
          />
        ) : (
          <View style={{ backgroundColor: '#f4f6f9', flex: 1 }}>
            {!this.state.isDisplaySearchTextInput ? (
              <View style={{ flex: 0.18 }}>
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
              <View style={{ flex: 0.16 }}>
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
            <View style={{ flex: 1 }}>
              {this.state.showalert ? (
                <View style={{ marginLeft: 20, marginTop: 10 }}>
                  <Text style={{ color: GilRoyMediumColor.fontColor }}>
                    {this.state.DisplayText}
                  </Text>
                </View>
              ) : null}
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
                  marginBottom: 10,
                  marginTop: 10,
                }}>
                <BoldText
                  style={[
                    styles.textName,
                    { marginLeft: 15, color: '#A9A9A9', fontSize: 16 },
                  ]}>
                  Favorite Groups
                </BoldText>
                {!this.state.HasFav ? (
                  <Text
                    style={{
                      marginLeft: 15,
                      marginBottom: 10,
                      color: 'gray',
                      fontSize: 14,
                    }}>
                    No Favorites
                  </Text>
                ) : null}
                <FlatList
                  horizontal
                  keyboardShouldPersistTaps={'always'}
                  keyboardDismissMode={'interactive'}
                  data={this.state.GroupsList}
                  renderItem={({ item }) => (
                    <View>{this.FavoriteGroups(item)}</View>
                  )}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{ flex: 1 }}>
                  <BoldText
                    style={[
                      styles.textName,
                      { marginLeft: 15, color: '#A9A9A9', fontSize: 16 },
                    ]}>
                    Recent History
                  </BoldText>
                  {this.state.GroupsList.length == 0 ? (
                    <Text
                      style={{
                        marginLeft: 15,
                        marginBottom: 10,
                        color: 'gray',
                        fontSize: 14,
                      }}>
                      No Recent History
                    </Text>
                  ) : null}
                  <View style={{ flex: 2, flexDirection: 'row' }}>
                    <View style={{ flex: 2, marginTop: 10 }}>
                      {this.renderList()}
                    </View>
                    <View>{this.ShowTabs()}</View>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ flex: 0.13 }}>
              <Footer />
            </View>
            <Dialog
              onTouchOutside={this._handleOnClose}
              onHardwareBackPress={this._handleOnClose}
              onDismiss={() => {
                this.setState({ surewantToDelete: false });
              }}
              width={0.9}
              height={0.37}
              visible={this.state.surewantToDelete}
              rounded
              actionsBordered
              dialogTitle={
                <DialogTitle
                  titleAlign={'center'}
                  style={{ borderBottomWidth: 1 }}
                  title={this.state.DialogHeader}
                  textStyle={{}}
                  hasTitleBar={true}
                  align="center"
                />
              }
              footer={
                <DialogFooter style={{ borderColor: '#ffffff' }}>
                  <DialogButton
                    text="Cancel"
                    style={styles.DialogYesORNo}
                    textStyle={{
                      color: 'white',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}
                    onPress={() => {
                      this.cancelSelectedGrps();
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
                      this.ConfirmDeleteOrExitUser();
                    }}
                    key="button-2"
                  />
                </DialogFooter>
              }>
              <DialogContent style={{ height: 90 }}>
                <Text style={{ fontSize: 18, marginTop: 10 }}>
                  {this.state.alertmsg}
                </Text>
              </DialogContent>
            </Dialog>
            <Dialog
              onTouchOutside={this._handleOnClose}
              onHardwareBackPress={this._handleOnClose}
              onDismiss={() => {
                this.setState({ swipeablePanelActive: false });
              }}
              width={0.9}
              height={0.37}
              visible={this.state.swipeablePanelActive}
              rounded
              actionsBordered
              dialogTitle={
                <DialogTitle
                  titleAlign={'center'}
                  style={{ borderBottomWidth: 1 }}
                  title={this.state.CreateOrUpdateGrpTitle}
                  textStyle={{}}
                  hasTitleBar={true}
                  align="center"
                />
              }
              footer={
                <DialogFooter style={{ borderColor: '#ffffff' }}>
                  <DialogButton
                    text="Cancel"
                    style={styles.DialogYesORNo}
                    textStyle={{
                      color: 'white',
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}
                    onPress={() => {
                      this.onGroupCancelIconPress()
                    }}
                    key="button-1"
                  />
                  {this.state.GroupName.length > 0 ? (
                    <DialogButton
                      text={
                        this.state.CreateOrUpdateGrpTitle == 'Edit Group Chat'
                          ? 'Update'
                          : 'Create'
                      }
                      style={styles.DialogYesORNo}
                      textStyle={{
                        color: 'white',
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}
                      onPress={() => {
                        this.SaveChannelGroups();
                      }}
                      key="button-2"
                    />
                  ) : (
                    <DialogButton
                      text={
                        this.state.CreateOrUpdateGrpTitle == 'Edit Group Chat'
                          ? 'Update'
                          : 'Create'
                      }
                      style={styles.DialogYesORNo}
                      textStyle={{
                        color: 'white',
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}
                      onPress={() => {
                        alert('Enter Your Group Name');
                      }}
                      key="button-2"
                    />
                  )}
                </DialogFooter>
              }>
              <DialogContent style={{ height: 90 }}>
                <View
                  style={{ borderBottomWidth: 0.5, borderBottomColor: '#e0e0e0' }}
                />
                <View style={{ alignSelf: 'center' }}>
                  {this.renderGrpPhoto()}
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 0.05 }} />
                  <View style={{ flex: 0.15 }}>
                    <TouchableOpacity
                      onPress={() => this.UploadGrpPhoto('Gallery')}>
                      <View
                        style={{
                          borderWidth: 0.5,
                          borderColor: CommonStyles.appColor,
                          height: 45,
                          width: 45,
                          borderRadius: 90,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <PhotoGraph style={{ color: 'gray' }} />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 0.65 }}>
                    <TextInput
                      placeholder="Enter Group Name"
                      keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                      onChangeText={value => {
                        this.GrpNameTextChange(value);
                      }}
                      value={this.state.GroupName}
                    />
                  </View>
                  <View style={{ flex: 0.15 }}>
                    <TouchableOpacity
                      onPress={() => this.UploadGrpPhoto('camera')}>
                      <View
                        style={{
                          borderWidth: 0.5,
                          borderColor: CommonStyles.appColor,
                          height: 45,
                          width: 45,
                          borderRadius: 90,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Camera style={{ alignSelf: 'center', color: 'gray' }} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </DialogContent>
            </Dialog>
          </View>
        )}
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
)(Chatgroups);
