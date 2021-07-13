import React, { Component } from 'react';
import { GiftedChat, Bubble, Time } from 'react-native-gifted-chat';
import Groupchatoptionmenu from '../Custom/groupchatoptionmenu';
import image from '../Images';
import { Thumbnail } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import { styles } from './Listcommonstyles';
import DocumentPickerHandle from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {
  Alert,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  BackHandler, Linking
} from 'react-native';
import CommonHeader from '../shared/CommonHeader';
import { connect } from 'react-redux';
import { goBack } from '../Services/BackButtonServices';
import { Actions } from 'react-native-router-flux';
import ServiceCalls from '../Services/APICalls';
import {
  CommonStyles,
  MediumBoldText,
  GilRoyMediumColor,
} from '../shared/Constants';
import { ArrowLeft, SendIcon, Camera, AttachFile, AttachIcon } from '../shared/Icon';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
class groupUI extends Component {
  constructor(props) {
    super(props);
    global.GlobalchannelId = 0;
    global.groupChattingUI = this;
    const { IsFavoriteGrp } = this.props;
    this.state = {
      messages: [],
      Imgbase64: [],
      Images: [],
      SendBase64: '',
      IsFavorite: IsFavoriteGrp ? IsFavoriteGrp : false,
      MessageType: '',
      channelid: '',
      Ext: '',
      recentMsg: '',
      Image: '',
      ImgExt: '',
      HasLeft: '',
      showalert: false,
      DisplayText: '',
      userData: []
    };
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
    if(Platform.os == 'android') {
      AndroidKeyboardAdjust.setAdjustPan();
    }
    
  };
  componentDidMount() {
    if(Platform.OS == 'android') {
      AndroidKeyboardAdjust.setAdjustResize();
    }
    
    const { GrpORConatctName, HasLeft } = this.props;
    this.setState({
      NAME: GrpORConatctName,
      HasLeft: HasLeft,
    });
    this.GetUserMessages();
  }
  _handleHeaderLeftIcon = () => {
    return (
      <View style={styles.arrowBgstyle}>
        <ArrowLeft style={{ color: '#27BECF', fontSize: 20 }} />
      </View>
    );
  };

  _handleHeaderLeftIconPress = () => {
    if(Platform.os == 'android') {
      AndroidKeyboardAdjust.setAdjustPan();
    }
   
    Actions.ChatGroups();
  };
  handleMessages(msg) {
    let msgObj = {};
    if (msg.msgType === 1 || msg.msgType === 4 || msg.msgType === 5) {
      msgObj = this.handleTextMessages(msg);
    } else if (msg.msgType === 2) {
      msgObj = this.handleImageMessages(msg);
    } else if (msg.msgType === 10) {
      msgObj = this.handlePdfMessages(msg);
    }
    return msgObj;
  }
  handleTextMessages(messageObj) {
    console.log("messageObj", messageObj)
    var obj = {};
    if (messageObj.msgType == 1) {
      obj = {
        _id: messageObj._id,
        text: messageObj.text,
        createdAt: new Date(messageObj.createdAt).toString(),
        user: {
          _id: messageObj.user._id,
          name: messageObj.user.name,
          avatar: messageObj.user.imageUrl !== null ? messageObj.user.imageUrl : "",
          initials: messageObj.user.initials,
        },
      };
    } else {
      obj = {
        _id: messageObj._id,
        text: messageObj.text,
        avatar: messageObj.user.imageUrl,
        initials: messageObj.user.imageUrl !== null ? messageObj.user.imageUrl : "",
        createdAt: new Date(messageObj.createdAt).toString(),
      };
    }
    return obj;
  }

  handleImageMessages(messageObj) {
    const obj = {
      _id: messageObj._id,
      image: global.APIURL + 'uploadimgs/ChatImages/' + messageObj.image,
      createdAt: new Date(messageObj.createdAt).toString(),
      user: {
        _id: messageObj.user._id,
        //  name: messageObj.user.name,
        avatar: messageObj.user.imageUrl !== null ? messageObj.user.imageUrl : "",
        initials: messageObj.user.initials,
      },
    };
    this.setState({ userData: obj })
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
        //  name: messageObj.user.name,
        avatar: messageObj.user.imageUrl !== null ? messageObj.user.imageUrl : "",
        initials: messageObj.user.initials,
      },
    };
    this.setState({ userData: obj })
    return obj;
  }
  GetUserMessages() {
    const { ChannelId } = this.props;
    try {
      var dataToSend = {
        FromuserId: global.LoginUserId,
        channelId: ChannelId,
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
          if (responseJson[0]._id > 0) {
            var messages1 = responseJson.map(message =>
              this.handleMessages(message),
            );
            this.setState({
              messages: messages1,
              channelid: responseJson[0].channelId,
            });
          } else {
            this.setState({ messages: [] });
          }
        });
    } catch (e) {
      Alert.alert(e);
    }
  }
  SendMsg = () => {
    this.onSend(1);
  };

  onSend(msgType) {
    // console.log("MessageTypeState",this.state.MessageType)
    this.setState({ recentMsg: '' });
    if (this.state.MessageType) { this.SaveMessage(this.state.MessageType) } else { this.SaveMessage(msgType) }
    // this.SaveMessage(msgType);
    // this.setState({ recentMsg: '' });
  }
  SaveMessage(MessageType) {
    const { ChannelId } = this.props;
    try {
      var dataToSend = {
        FromuserId: global.LoginUserId,
        strmessage: this.state.recentMsg,
        LoginUserFcmToken: global.LoginUserFcmToken,
        channelId: ChannelId,
        msgtype: MessageType,
        Image: this.state.SendBase64,
        ImgExt: this.state.Ext,
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
        .then(response => response.json())
        //console.log("Resonse",response)
        .then(responseJson => {
          global.GlobalchannelId = responseJson.channelid;
          this.setState({ SendBase64: '', Ext: '', Imgbase64: [], Images: [] });
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
          } else if (responseJson.messagetype == 10) {
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
      Alert.alert(e);
    }
  }
  GiftedChatdesign(lastesmsg) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, lastesmsg),
    }));
  }
  centerMiddileView() {
    const { GrpORConatctName, Img } = this.props;
    return (
      <View
        style={{
          justifyContent: 'space-around',
          alignSelf: 'center',
          alignItems: 'center',
          textAlign: 'center',
          bottom: 15,
        }}>
        <TouchableOpacity onPress={() => this.GetGrpMembersList()}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            {Img !== '' && Img !== null ? (
              <Thumbnail
                medium
                source={{
                  uri: global.APIURL + 'uploadimgs/UploadGroupPhotos/' + Img,
                }}
              />
            ) : (
              <Image
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 100,
                  backgroundColor: '#ffffff',
                }}
                source={require('../Images/GrpProfile.png')}
              />
            )}
            <Text style={{ fontSize: 16, alignSelf: 'center', color: '#ffffff' }}>
              {GrpORConatctName.length > 16
                ? GrpORConatctName.substring(0, 16) + '...'
                : GrpORConatctName}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  AddORRemoveFavouriteGrp = () => {
    const { ChannelId, GrpORConatctName } = this.props;
    try {
      ServiceCalls.AddORRemoveFavourite(ChannelId, 0)
        .then(response => {
          var object = global.grps.state.GroupsList;
          object.forEach(element => {
            if (element.channelId == ChannelId) {
              element.isFavorite = !element.isFavorite;
            }
            return object;
          });
          global.grps.setState({
            GroupsList: object,
          });
          this.setState({ IsFavorite: !this.state.IsFavorite });
          if (this.state.IsFavorite) {
            this.setState({
              DisplayText: GrpORConatctName + ' ' + 'added as favorite',
              showalert: true,
            });
          } else {
            this.setState({
              DisplayText: GrpORConatctName + ' ' + 'removed as favorite',
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
          Alert.alert(error);
        });
    } catch (e) {
      Alert.alert(e);
    }
  };
  BlockORUnBlock = () => {
    const { ChannelId } = this.props;
    try {
      ServiceCalls.BlockORUnBlock(ChannelId, 0)
        .then(response => {
          this.setState({ UserCardDetails: response });
        })
        .catch(error => {
          Alert.alert(error);
        });
    } catch (e) {
      Alert.alert(e);
    }
  };
  ClearChat = () => {
    const { ChannelId } = this.props;
    try {
      ServiceCalls.DeleteChannelMsgs(ChannelId)
        .then(response => {
          this.setState({ messages: [] });
        })
        .catch(error => {
          Alert.alert(error);
        });
    } catch (e) {
      Alert.alert(e);
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
            Alert.alert('Read permission err', err);
          }
        } else {
          Alert.alert('WRITE_EXTERNAL_STORAGE permission denied');
        }
      } catch (err) {
        Alert.alert('Write permission err', err);
      }
    } else {
      this.selectPhotoTapped();
    }
  };
  selectPhotoTapped() {
    const { HasLeft } = this.props;
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };
    return ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        //Alert.alert('User cancelled photo picker');
      } else if (response.error) {
        Alert.alert('ImagePicker Error: ', response.error);
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
          ISComingFrom: 'GroupChat',
          HasLeft: HasLeft,
        });
      }
    });
  }

  openDocumentFile = () => {
    this.uploadDocumentFile();
  };
  uploadDocumentFile = async () => {
    const { HasLeft } = this.props;
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
            ISComingFrom: 'GroupChatWithDoc',
            HasLeft: HasLeft,
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



  GetGrpMembersList() {
    const {
      ChannelId,
      GrpORConatctName,
      IsAdmin,
      Img,
      initials,
      HasLeft,
    } = this.props;
    Actions.groupMembers({
      ChannelId: ChannelId,
      GrpORConatctName: GrpORConatctName,
      IsAdmin: IsAdmin,
      initials: initials,
      HasLeft: HasLeft,
      Img: Img,
    });
  }

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
    const { HasLeft } = this.props;
    return (
      <View style={{ alignSelf: "center", left: 15 }}>
        {!HasLeft ? (
          <Groupchatoptionmenu
            menutext="Menu"
            option1Click={() => {
              this.AddORRemoveFavouriteGrp();
            }}
            option2Click={() => {
              this.ClearChat();
            }}
            IsFavoriteGrp={this.state.IsFavorite}
          />
        ) : null}
      </View>
    );
  };



  // renderBubble(props) {
  //   return (
  //     <Bubble
  //       {...props}
  //       wrapperStyle={{
  //         left: {
  //           backgroundColor: CommonStyles.appColor,
  //         },
  //         right: {
  //           backgroundColor: 'white',
  //         },
  //       }}
  //       textStyle={{
  //         right: {
  //           color: 'Black',
  //         },
  //         left: {
  //           color: 'white',
  //         },
  //       }}
  //     />
  //   );
  // }

  // renderSenderIcon = (item) => {
  //   const {Img, initials} = this.props;
  //   let data = item.map(x=>x.user)
  //   let result = {};
  //         data.forEach(date=>{
  //           result[date]
  //         })
  //   //let Initials = item.user.name.Substring(0, 1).ToUpper() + item.user.name.Substring(0, 2).ToUpper()
  //   console.log("TimeTestChat",data)
  //   return (
  //     <View>
  //       { item.user && item.user.imageUrl ? (
  //         <Thumbnail
  //           source={{
  //             uri: global.APIURL + 'uploadimgs/ProfilePictures/' + data.user.avatar,
  //           }}
  //           style={{
  //             height: 60,
  //             width: 60,
  //             borderRadius: 120,
  //             justifyContent: 'center',
  //             backgroundColor: '#ffffff',
  //           }} 
  //         />
  //       ) : (
  //         <View
  //           style={{
  //             height: 60,
  //             width: 60,
  //             borderRadius: 120,
  //             justifyContent: 'center',
  //             backgroundColor: '#ffffff',
  //           }}>
  //           {/* <Text
  //             style={{
  //               fontSize: 30,
  //               color: CommonStyles.appColor,
  //               textAlign: 'center',
  //             }}>
  //             {data.user.initials ? data.user.initials : ""}
  //           </Text> */}
  //         </View>
  //       )}
  //     </View>
  //   );
  // };


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
  render() {
    var thispage = this;
    // console.log("Props", this.state.messages)
    return (
      <View style={{ flex: 1, backgroundColor: '#ededed' }}>
        <View style={{ height: 98 }}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => this._handleHeaderRightIcon()}
            HeaderCenterIcon={() => this.centerMiddileView()}
            HeaderLeftIconPress={this._handleHeaderLeftIconPress}
            HeaderRightIconPress={() => {
              return null;
            }}
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
        {this.state.showalert ? (
          <View style={{ marginLeft: 20, marginTop: 10 }}>
            <Text style={{ color: GilRoyMediumColor.fontColor }}>
              {this.state.DisplayText}
            </Text>
          </View>
        ) : null}
        <View style={{ flex: 1 }}>
          <GiftedChat
            showAvatarForEveryMessage={true}
            text={this.state.recentMsg}
            messages={this.state.messages}
            onInputTextChanged={value => this.setState({ recentMsg: value })}
            renderSend={() => this.rendersend(thispage)}
            user={{
              _id: global.LoginUserId,
            }}
            renderAvatar={(props) => {
              // console.log("Props12345", props.currentMessage)
              const avatarProps = props.currentMessage.user;
              if (avatarProps) {
                return (
                  <View>
                    {avatarProps.avatar ? (
                      <Thumbnail
                        source={{
                          uri: global.APIURL + 'uploadimgs/ProfilePictures/' + avatarProps.avatar,
                        }}
                        style={{
                          height: 45,
                          width: 45,
                          borderRadius: 45 / 2,
                          justifyContent: 'center',
                          backgroundColor: '#ffffff',
                        }}
                      />) : (avatarProps.initials ?
                        (<View
                          style={{
                            height: 45,
                            width: 45,
                            borderRadius: 45 / 2,
                            justifyContent: 'center',
                            backgroundColor: '#ffffff',
                          }}>
                          <Text
                            style={{
                              fontSize: 25,
                              color: CommonStyles.appColor,
                              textAlign: 'center',
                            }}>
                            {avatarProps.initials ? avatarProps.initials : null}
                          </Text>
                        </View>) : null
                    )}
                  </View>
                );
              }
              return (null);
            }}
            renderBubble={this.renderBubble}
            renderTime={this.renderTime}
          // renderUsernameOnMessage={true}
          //  renderAvatar={() => this.renderSenderIcon(this.state.messages)}
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
)(groupUI);
