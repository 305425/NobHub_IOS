import React, { Component } from 'react';
import { GiftedChat, Bubble, Time } from 'react-native-gifted-chat';
import { Actions } from 'react-native-router-flux';
import Chattingoptionmenu from '../Custom/chattingoptionsmenu';
import moment from 'moment';
import { styles } from './Listcommonstyles';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  BackHandler,
  StatusBar,
  Linking,
  Image,
} from 'react-native';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation
} from 'react-native-popup-dialog';
import EmojiBoard from 'react-native-emoji-board'
import DocumentPickerHandle from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob'
import ImagePicker from 'react-native-image-picker';
import CommonHeader from '../shared/CommonHeader';
import { connect } from 'react-redux';
import { goBack } from '../Services/BackButtonServices';
import ServiceCalls from '../Services/APICalls';
import { ArrowLeft, SendIcon, Camera, AttachIcon } from '../shared/Icon';
import { Thumbnail } from 'native-base';
import image from '../Images';
import { CommonStyles, GilRoyMediumColor } from '../shared/Constants';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import CustomView from './CustomView';
class ChattingUI extends Component {
  constructor(props) {
    super(props);
    global.GlobalchannelId = 0;
    //global.groupChattingUI=['1'];
    const { IsFavoriteContact, isBlocked } = this.props;
    global.groupChattingUI = this;
    this.state = {
      messages: [],
      IsFavorite: IsFavoriteContact ? IsFavoriteContact : false,
      IsBlock: isBlocked ? isBlocked : false,
      recentMsg: '',
      Imgbase64: [],
      SendBase64: '',
      NAME: '',
      MessageType: '',
      Ext: '',
      lastseenStatus: '',
      CnlId: 0,
      Images: [],
      DisplayText: '',
      showalert: false,
      isActive: false,
      show: false,
    };
    global.ChattingUI = this;
    BackHandler.addEventListener('hardwareBackPress', this.back_Button_Press);
  }
  back_Button_Press = () => {
    global.MyConnections.setState({
      TextInputPlaceHolder: 'Name/Phone number',
      IsScan: true,
      IsCancel: false,
      IsShowTabsForMultiple: false,
      IsShowTabs: false,
    });
    global.MyConnections._handleMyContactSearch('');
    global.MyConnections.getInitialData();
    if (Platform.OS === 'android') {
    AndroidKeyboardAdjust.setAdjustPan();
    }
  };
  componentDidMount() {
    if (Platform.OS === 'android') {
    AndroidKeyboardAdjust.setAdjustResize();
    }
    // console.log("isBlocked", this.props.isBlocked)
    const { GrpORConatctName } = this.props;
    this.setState({ NAME: GrpORConatctName });
    this.GetUserMessages();
  }
  _handleHeaderLeftIcon = () => {
    return (
      <View style={styles.chatArrowBgstyle}>
        <TouchableOpacity onPress={() => { this._handleHeaderLeftIconPress() }}>
          <ArrowLeft style={{ color: CommonStyles.appColor, fontSize: 20 }} />
        </TouchableOpacity>
      </View>
    );
  };

  _handleHeaderLeftIconPress = () => {
    if (Platform.OS === 'android') {
    AndroidKeyboardAdjust.setAdjustPan();
    }
    global.ConnectionsTabColor = '#e0e0e0';
    global.ChatTabColor = CommonStyles.appColor;
    global.MeetingsTabColor = '#e0e0e0';
    global.NotificationsTabColor = '#e0e0e0';
    Actions.Chats();
  };
  GetUserMessages() {
    const { ChannelId, TouserId } = this.props;
    if (ChannelId == 0) {
      try {
        var dataToSend = {
          FromuserId: global.LoginUserId,
          channelId: ChannelId,
          TouserId: TouserId,
        };
        var formBody = [];
        for (var key in dataToSend) {
          var encodedKey = encodeURIComponent(key);
          var encodedValue = encodeURIComponent(dataToSend[key]);
          formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');
        fetch(global.APIURL + 'api/Card/GetUserChannelInfo', {
          method: 'POST', //Request Type
          body: formBody, //post body
          headers: {
            //Header Defination
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
        })
          .then(response => response.json())
          .then(responseJson => {
            global.GlobalchannelId = responseJson.channelId;
            this.setState({
              IsFavorite: responseJson.isFavorite,
              IsBlock: responseJson.isBlocked,
              CnlId: responseJson.channelId,
            });
            if (responseJson.channelId > 0) {
              this.setState({ CnlId: responseJson.channelId });
              this.FetchDBMsgs(responseJson.channelId);
            }
            if (responseJson.logoutTime == null) {
              this.setState({ lastseenStatus: 'Online' });
            } else {
              this.setState({ lastseenStatus: 'offline' });
              // var status = this.calculateDateDiff(responseJson.logoutTime);
              //this.setState({lastseenStatus: status});
            }
          });
      } catch (e) {
        Alert.alert(e.message);
      }
    } else {
      global.GlobalchannelId = ChannelId;
      this.setState({ CnlId: ChannelId });
      this.FetchDBMsgs(ChannelId);
    }
  }

  FetchDBMsgs(ChannelId) {
    const { TouserId } = this.props;
    try {
      var dataToSend = {
        FromuserId: global.LoginUserId,
        channelId: ChannelId,
        TouserId: TouserId,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');

      fetch(global.APIURL + 'api/Card/FetchmessagesbyChannelId', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson[0].logoutTime == null) {
            this.setState({ lastseenStatus: 'Online' });
          } else {
            // var status = this.calculateDateDiff(responseJson[0].logoutTime);
            this.setState({ lastseenStatus: 'offline' });
          }
          if (responseJson[0]._id > 0) {
            var messages1 = responseJson.map(message =>
              this.handleMessages(message),
            );
            console.log("Mesaages", messages1)
            this.setState({
              messages: messages1,
              CnlId: responseJson[0].channelId,
            });
          } else {
            this.setState({ messages: [] });
          }
        });
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
        return 'just now';
      }
    }
  }

  handleMessages(msg) {
    let msgObj = {};
    if (msg.msgType === 1) {
      msgObj = this.handleTextMessages(msg);
    } else if (msg.msgType === 2) {
      msgObj = this.handleImageMessages(msg);
    }
    else if (msg.msgType === 10) {
      msgObj = this.handlePdfMessages(msg);
    }
    return msgObj;
  }
  handleTextMessages(messageObj) {
    const obj = {
      _id: messageObj._id,
      text: messageObj.text,
      createdAt: new Date(messageObj.createdAt).toString(),
      user: {
        _id: messageObj.user._id,
      },
    };
    return obj;
  }

  handleImageMessages(messageObj) {
    const obj = {
      _id: messageObj._id,
      //image:"https://docs.google.com/viewerng/viewer?url=nobhubapi.azurewebsites.net/uploadimgs/ChatImages/1499.pdf",
      //image: "https://docs.google.com/viewerng/viewer?url=nobhubapi.azurewebsites.net/uploadimgs/ChatImages/1499.pdf",
      image: global.APIURL + 'uploadimgs/ChatImages/' + messageObj.image,
      createdAt: new Date(messageObj.createdAt).toString(),
      user: {
        _id: messageObj.user._id,
      },
    };
    return obj;
  }

  handlePdfMessages(messageObj) {
    const obj = {
      _id: messageObj._id,
      //image:"https://docs.google.com/viewerng/viewer?url=nobhubapi.azurewebsites.net/uploadimgs/ChatImages/1499.pdf",
      //image: "https://docs.google.com/viewerng/viewer?url=nobhubapi.azurewebsites.net/uploadimgs/ChatImages/1499.pdf",
      image: global.APIURL + 'uploadimgs/ChatImages/' + messageObj.image,
      createdAt: new Date(messageObj.createdAt).toString(),
      user: {
        _id: messageObj.user._id,
      },
    };
    return obj;
  }

  SendMsg = () => {
    // console.log("MessageTypeState",this.state.MessageType)
    this.setState({ recentMsg: '' });
    if (this.state.MessageType) { this.SaveMessage(this.state.MessageType) } else { this.SaveMessage(1) }
    // this.SaveMessage(1);
  };
  SaveMessage(MessageType) {
    console.log("MessageType", MessageType)
    const { TouserId, Img } = this.props;
    try {
      var dataToSend = {
        FromuserId: global.LoginUserId,
        strmessage: this.state.recentMsg,
        LoginUserFcmToken: global.LoginUserFcmToken,
        channelId: this.state.CnlId,
        TouserId: TouserId,
        msgtype: MessageType,
        Image: this.state.SendBase64,
        ImgExt: this.state.Ext,
        //SenderImage: Img,
      };
      //  console.log("ddddddddddddddddddd", dataToSend);
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/SaveChannelMessage', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response =>

          response.json())
        //console.log("Resonse",response)

        .then(responseJson => {
          global.GlobalchannelId = responseJson.channelid;
          this.setState({ SendBase64: '', Ext: '', Imgbase64: [] });
          this.setState({ Images: [] });
          console.log("messagetype", responseJson.messagetype);
          if (responseJson.messagetype == 1) {
            var datamsgObj = {
              _id: 0,
              text: responseJson.message,
              user: { _id: global.LoginUserId },
              channelId: global.GlobalchannelId,
              createdAt: new Date(),
            };
          } else if (responseJson.messagetype == 2) {
            var datamsgObj = {
              _id: 0,
              image:
                global.APIURL + 'uploadimgs/ChatImages/' + responseJson.message,
              user: { _id: global.LoginUserId },
              channelId: global.GlobalchannelId,
              createdAt: new Date(),
            };
          }
          else if (responseJson.messagetype == 10) {
            var datamsgObj = {
              _id: 0,
              image:
                global.APIURL + 'uploadimgs/ChatImages/' + responseJson.message,
              user: { _id: global.LoginUserId },
              channelId: global.GlobalchannelId,
              createdAt: new Date(),
            };
          }
          this.GiftedChatdesign(datamsgObj);
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  }
  GiftedChatdesign(lastesmsg) {
    if (this.state.messages.length == 0) {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, lastesmsg),
      }));
    } else {
      //var tempList = this.state.messages;
      var tempList = [];
      tempList.push(lastesmsg);
      this.state.messages.forEach(function (item) {
        tempList.push(item);
      });
      // tempList.unshift(lastesmsg);
      this.setState({ messages: tempList });
    }
  }
  centerMiddileView = () => {
    const { GrpORConatctName, Img, initials } = this.props;
    return (
      <View style={{ flexDirection: 'column', bottom: 15 }}>
        <View style={{ justifyContent: "center", alignSelf: "center" }}>
          {Img !== '' && Img !== null ? (
            <Thumbnail
              medium
              source={{
                uri: global.APIURL + 'uploadimgs/ProfilePictures/' + Img,
              }}
            />
          ) : (
            <View
              style={{
                height: 60,
                width: 60,
                borderRadius: 120,
                justifyContent: 'center',
                backgroundColor: '#ffffff',
              }}>
              <Text
                style={{
                  fontSize: 30,
                  color: CommonStyles.appColor,
                  textAlign: 'center',
                }}>
                {initials}
              </Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 16, alignSelf: 'center', color: "#fff" }}>
          {GrpORConatctName.length > 20
            ? GrpORConatctName.substring(0, 20) + '...'
            : GrpORConatctName}
        </Text>
        <View>
          {this.state.lastseenStatus == 'OnLine' ? (
            <Text style={{ color: '#fff', textAlign: "center", bottom: 55, left: 55 }}>
              {this.state.lastseenStatus}
            </Text>
          ) : (
            <Text style={{ textAlign: "center", color: '#fff', bottom: 55, left: 55 }}>
              {this.state.lastseenStatus}
            </Text>
          )}
        </View>
      </View>
    );
  };
  AddORRemoveFavourite = () => {
    const { TouserId, GrpORConatctName } = this.props;
    try {
      ServiceCalls.AddORRemoveFavourite(this.state.CnlId, TouserId)
        .then(response => {
          this.setState({ IsFavorite: !this.state.IsFavorite });
          if (this.state.IsFavorite) {
            this.setState({
              DisplayText:
                GrpORConatctName + ' ' + 'is added to your favorite list',
              showalert: true,
            });
          } else {
            this.setState({
              DisplayText:
                GrpORConatctName + ' ' + 'is deleted from favorite list',
              showalert: true,
            });
          }
          setTimeout(() => {
            this.setState({
              DisplayText: '',
              showalert: false,
            });
          }, 10000);
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  BlockORUnBlock = () => {
    const { TouserId, GrpORConatctName } = this.props;
    try {
      ServiceCalls.BlockORUnBlock(this.state.CnlId, TouserId)
        .then(response => {
          this.setState({ IsBlock: !this.state.IsBlock });
          if (this.state.IsBlock) {
            this.setState({
              DisplayText: 'you succesfully blocked' + ' ' + GrpORConatctName,
              showalert: true,
            });
            setTimeout(() => {
              this.setState({
                DisplayText: '',
                showAlert: false,
              });
            }, 5000);
          } else {
            // this.setState({isActive: true})
            this.setState({
              DisplayText: 'you succesfully unblocked' + ' ' + GrpORConatctName,
              showalert: true,
            });
            setTimeout(() => {
              this.setState({
                DisplayText: '',
                showAlert: false,
              });
            }, 5000);
          }
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  // onUnblockPress = () => {
  //   const {TouserId, GrpORConatctName} = this.props;
  //   try {
  //     ServiceCalls.BlockORUnBlock(this.state.CnlId, TouserId)
  //       .then(response => {
  //         this.setState({
  //           IsBlock: !this.state.IsBlock,
  //           isActive: false,
  //           DisplayText: 'you succesfully unblocked' + ' ' + GrpORConatctName,
  //           showalert: true,
  //         });
  //         setTimeout(() => {
  //           this.setState({
  //             DisplayText: '',
  //             showAlert: false,
  //           });
  //         }, 5000);
  //       })
  //       .catch(error => {
  //         Alert.alert(error.message);
  //       });
  //   } catch (e) {
  //     Alert.alert(e.message);
  //   }
  // };
  ClearChat = () => {
    try {
      var ChannelIds = global.GlobalchannelId;
      ServiceCalls.DeleteChannelMsgs(ChannelIds)
        .then(response => {
          this.setState({ messages: [] });
          if (global.chats != undefined && global.chats != null) {
            var profiles = global.chats.state.YesProfiles;
            global.chats.state.selectedChannelIds.forEach(function (data) {
              profiles = profiles.filter(obj => {
                return obj.channelId !== data;
              });
            });
            global.chats.setState({ YesProfiles: profiles });
          }
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  openGallery = () => {
    this.UploadGrpPhoto();
  };

  UploadGrpPhoto = async () => {
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
              this.selectPhotoTapped();
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
      this.selectPhotoTapped();
    }
  };
  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };
    return ImagePicker.showImagePicker(options, response => {
      //  console.log("Response", response)
      if (response.didCancel) {
        //Alert.alert('User cancelled photo picker');
      } else if (response.error) {
        Alert.alert('ImagePicker Error: ', response.error.message);
      } else if (response.customButton) {
        Alert.alert('User tapped custom button: ', response.customButton);
      } else {
        var ext = response.fileName.split('.');
        let source = { uri: response.uri };
        var _saveBase64 = this.state.Imgbase64;
        _saveBase64.push({ Base64: response.data, FileName: response.fileName });
        this.setState({
          Imgbase64: _saveBase64,
        });
        this.setState({
          SendBase64: JSON.stringify(this.state.Imgbase64),
          Ext: ext[1],
        });
        var _displayImage = this.state.Images;
        _displayImage.push({ URL: source });
        this.setState({ Images: _displayImage });
        Actions.SelectedPhotos({
          GrpORConatctName: this.state.NAME,
          ISComingFrom: 'SingleChat',
        });
      }
    });
  }

  openDocumentFile = () => {
    this.uploadDocumentFile();
  };
  uploadDocumentFile = async () => {
    // async uploadDocumentFile() {
    try {
      const res = await DocumentPickerHandle.pick({
        type: [DocumentPickerHandle.types.allFiles],
        //readContent:true
      });
      //console.log("content",res);
      var ext = res.name.split('.');
      var docExt = ext[ext.length - 1];
      var Ext = docExt;
      //const fileName = res.uri.replace("file://", "")
      //let data = ''
      RNFetchBlob.fs.readFile(res.uri, 'base64')
        // files will an array contains filenames
        .then((Base64) => {
          let base64 = [{ Base64 }]
          //this.setState({ SendBase64: base64 })
          //   console.log("DATA", base64)
          var _saveBase64 = this.state.Imgbase64;
          //var ext = res.fileName.split('.');
          let source = { uri: res.uri };
          var _saveBase64 = this.state.Imgbase64;
          _saveBase64.push({ Base64: base64 });
          this.setState({
            Imgbase64: _saveBase64, SendBase64: JSON.stringify(base64), Ext: Ext, MessageType: 10
          });
          var _displayImage = this.state.Images;
          _displayImage.push({ URL: source });
          this.setState({ Images: _displayImage });
          Actions.SelectedPhotos({
            GrpORConatctName: this.state.NAME,
            ISComingFrom: 'SingleChatWithDoc',
          });
        })
    } catch (err) {
      console.log("error", err);
      if (DocumentPickerHandle.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  rendersend(thispage) {
    return (
      <View style={{ marginRight: 10, marginBottom: 5, flexDirection: 'row' }}>
        {thispage.state.IsBlock ? (
          <View style={{ marginRight: 7 }}>
            <AttachIcon style={{ color: 'lightgray', fontSize: 27 }} />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              thispage.openDocumentFile();
            }}>
            <View style={{ marginRight: 7 }}>
              <AttachIcon style={{ color: CommonStyles.appColor, fontSize: 27 }} />
            </View>
          </TouchableOpacity>
        )}
        {thispage.state.IsBlock ? (
          <View style={{ marginRight: 5 }}>
            <Camera style={{ color: 'lightgray' }} />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              thispage.openGallery();
            }}>
            <View style={{ marginRight: 5 }}>
              <Camera style={{ color: CommonStyles.appColor }} />
            </View>
          </TouchableOpacity>
        )}
        {thispage.state.IsBlock ? (
          <View style={{ marginLeft: 5 }}>
            <SendIcon style={{ color: 'lightgray' }} />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              thispage.SendMsg();
            }}>
            <View style={{ marginLeft: 5 }}>
              <SendIcon style={{ color: CommonStyles.appColor }} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
  _handleHeaderRightIcon = () => {
    return (
      <View style={{ left: 40 }}>
        <Chattingoptionmenu
          menutext="Menu"
          option1Click={() => {
            this.AddORRemoveFavourite();
          }}
          option2Click={() => {
            this.BlockORUnBlock();
          }}
          option3Click={() => {
            this.ClearChat();
          }}
          IsFavoriteContact={this.state.IsFavorite}
          IsBlockedContact={this.state.IsBlock}
        />
      </View>
    );
  };
  renderSenderIcon = () => {
    const { Img, initials } = this.props;
    // console.log("TimeTestPersonalChat", this.props.Img)
    return (
      <View>
        {Img !== '' && Img !== null ? (
          <Thumbnail
            small
            source={{
              uri: global.APIURL + 'uploadimgs/ProfilePictures/' + Img,
            }}
          />
        ) : (
          <View
            style={{
              height: 60,
              width: 60,
              borderRadius: 120,
              justifyContent: 'center',
              backgroundColor: '#ffffff',
            }}>
            <Text
              style={{
                fontSize: 30,
                color: CommonStyles.appColor,
                textAlign: 'center',
              }}>
              {initials}
            </Text>
          </View>
        )}
      </View>
    );
  };
  renderBubble(props) {
    let newData = props.currentMessage.image ? props.currentMessage.image.toLowerCase().match(/\.(jpg|png|gif|jpeg|pdf|doc|docx|xls|xlsx|zip|csv|ppt|pptx|txt|undefined)/g)[0] : ""
    console.log("Image", props.currentMessage.image ? newData : props.currentMessage);
    let image = props.currentMessage.image ? props.currentMessage.image.split('//')[1] : ""
    let imageDetails = props.currentMessage.image ? props.currentMessage.image.split("/") : null
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#fff"
          },
          left: {
            backgroundColor: CommonStyles.appColor
          },
        }}
        textStyle={{
          right: {
            color: CommonStyles.appColor,
          },
          left: {
            color: "#fff"
          },
        }}
        touchableProps={{ disabled: true }}
        renderMessageImage={props.currentMessage.image && !props.currentMessage.text && (newData === '.pdf' || newData === '.doc' || newData === '.xls' || newData === '.xlsx' || newData === '.docx' || newData === '.txt' || newData === '.ppt' || newData === '.pptx' || newData === '.zip' || newData === '.csv') ? () => (
          <View>
            {props.currentMessage.image && !props.currentMessage.text && (newData === '.pdf' || newData === '.doc' || newData === '.xls' || newData === '.xlsx' || newData === '.docx' || newData === '.txt' || newData === '.ppt' || newData === '.pptx' || newData === '.zip' || newData === '.csv') ? (
              <TouchableOpacity onPress={() => Linking.openURL(`https://docs.google.com/viewerng/viewer?url=${image}`)}>
                <View style={{ backgroundColor: "#fff" }}>
                  <Image source={{ uri: "https://findicons.com/files/icons/1579/devine/256/file.png" }} style={{ height: 100, width: 100, borderRadius: 10, overflow: "hidden", tintColor: CommonStyles.appColor }} />
                  {imageDetails && imageDetails !== null && (<Text style={{ color: CommonStyles.appColor, textAlign: "center" }}>{imageDetails[imageDetails.length - 1]}</Text>)}
                </View>
              </TouchableOpacity>) : (
              <Image source={{ uri: props.currentMessage.image }} style={{ height: 110, width: 150, borderRadius: 10, overflow: "hidden" }} />
            )}
          </View>
        )
          : null}
      />
    );
  }

  renderTime(props) {
    return (
      <Time
        {...props}
        timeTextStyle={{
          left: {
            color: '#fff',
          },
          right: {
            color: CommonStyles.appColor,
          },
        }}
      />
    );
  };

  onClick = emoji => {
    // console.log(emoji);
  };

  renderCustomView(props) {
    //  console.log("Propsss", props.currentMessage);
    return (
      <CustomView
        {...props}
      />
    );
  };

  render() {
    var thispage = this;
    //console.log("MessageData",this.state.messages)
    return (
      <View style={{ flex: 1, backgroundColor: '#ededed' }}>
        {/* <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#00BCD4" translucent = {false}/> */}
        <View style={{ height: 98 }}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => this._handleHeaderRightIcon()}
            HeaderCenterIcon={() => {
              return null;
            }}
            HeaderLeftIconPress={this._handleHeaderLeftIconPress}
            HeaderRightIconPress={() => {
              return null;
            }}
            HeaderText={() => this.centerMiddileView()}
            HeaderProfileIcon={() => {
              return null;
            }}
            HeaderProfileIconPress={() => {
              return null;
            }}
            IsShowTextForTabs={false}
          />
        </View>
        <View style={{ flex: 1 }}>
          {this.state.showalert ? (
            <View style={{ marginLeft: 20, marginTop: 10 }}>
              <Text style={{ color: GilRoyMediumColor.fontColor }}>
                {this.state.DisplayText}
              </Text>
            </View>
          ) : null}
          {/* <Dialog
          visible={this.state.isActive}
          onTouchOutside={() => {
            this.setState({ isActive: !this.state.isActive });
          }}
          dialogAnimation={new SlideAnimation({
            slideFrom: 'bottom',
          })}
        >
          <DialogContent style={{height: 90}}>
            <Text style={{fontSize: 18, marginTop: 10}}>
              Are you sure you want to unblock {this.props.GrpORConatctName}
            </Text>
          </DialogContent>
           <DialogFooter style={{borderColor: '#fff'}}>
                <DialogButton
                  text="No"
                  // bordered={1}
                  style={styles.DialogButton}
                  textStyle={styles.DialogButtonText}
                  onPress={() => {this.setState({ isActive: false })}}
                  key="button-1"
                />
                <DialogButton
                  text="Yes"
                  style={[styles.DialogButton]}
                  textStyle={styles.DialogButtonText}
                  onPress={() => this.onUnblockPress()}
                  key="button-2"
                />
              </DialogFooter>
          </Dialog> */}
          <GiftedChat
            showAvatarForEveryMessage={true}
            text={this.state.recentMsg}
            messages={this.state.messages}
            onInputTextChanged={value => this.setState({ recentMsg: value })}
            // onSend={messages => this.onSend(messages)}
            renderSend={() => this.rendersend(thispage)}
            user={{
              _id: global.LoginUserId,
            }}
            //  touchableProps={{ disabled: true }}
            renderTime={this.renderTime}
            // renderUsernameOnMessage={true}
            renderAvatar={() => this.renderSenderIcon()}
            // renderAvatar={props => {
            //   this.renderSenderIcaon();
            // }}
            // renderCustomView={this.renderCustomView}
            renderBubble={this.renderBubble}
            onPress={(context, message) => { console.log(context + message) }}
          />
          <EmojiBoard showBoard={this.state.show} onClick={this.onClick} />
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
)(ChattingUI);
