import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  PixelRatio,
  Alert,
  StyleSheet,
  Platform,
  Modal,
  Dimensions
} from 'react-native';
import Textarea from 'react-native-textarea';
import CommonHeader from '../shared/CommonHeader';
import {
  ArrowLeft,
  Video,
  Hash,
  ImageIcon,
  Closecircle,
  Publish,
  Camera,
} from '../shared/Icon';
import {goBack} from '../Services/BackButtonServices';
import {connect} from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import {Actions} from 'react-native-router-flux';
import ReactVideo from 'react-native-video';
//Import React Native Video to play video
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
//Media Controls to control Play/Pause/Seek and full screen
import {CommonStyles} from '../shared/Constants';
import {MediumBoldText, BoldText} from '../shared/Text';
import {RadioButton} from 'react-native-paper';
import FloatingInput from '../shared/FloatingTextInput';
import SwipeablePanelView from './SwipablePostShoutout';
import crossLogo from '../Images/cross.png';
import RNFetchBlob from 'rn-fetch-blob';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


class PostShoutOut extends Component {
  videoPlayer;
  constructor(props) {
    const {SelectedData} = props;
    super(props);
    this.state = {
      Text: SelectedData.text,
      Images: [],
      PropsImages: [],
      IsBold: false,
      ImageBase64: [],
      isFocused: false,
      SendBase64: '',
      recording: false,
      VideoURI: '',
      PropsVideoURI:
        global.APIURL + 'uploadimgs/ShoutOutImages/' + SelectedData.fileName,
      currentTime: 0,
      duration: 0,
      isFullScreen: false,
      isLoading: true,
      paused: true,
      playerState: PLAYER_STATES.PLAYING,
      screenType: 'content',
      processing: false,
      IsVideo: false,
      Type: '',
      checked: SelectedData.ispublic ? 'first' : 'second',
      Title: SelectedData.shoutoutTitle,
      swipeablePanelActive: false,
      IsNew: false,
      BottomPopup: false,
      HashTagValue: SelectedData.hashTag,
      isDisabledPublish: false,
      videoType: '',
      showAlert: false,
      displayText:'',
      medias:[],
      modalVisible:false,
      videoSize: undefined
    };
  }
  onSeek = seek => {
    //Handler for change in seekbar
    this.videoPlayer.seek(seek);
  };

  onPaused = playerState => {
    //Handler for Video Pause
    this.setState({
      paused: !this.state.paused,
      playerState,
    });
  };

  onReplay = () => {
    //Handler for Replay
    this.setState({playerState: PLAYER_STATES.PLAYING});
    this.videoPlayer.seek(0);
  };

  onProgress = data => {
    const {isLoading, playerState} = this.state;
    // Video Player will continue progress even if the video already ended
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      this.setState({currentTime: data.currentTime});
    }
  };

  onLoad = data => this.setState({duration: data.duration, isLoading: false});

  onLoadStart = () => this.setState({isLoading: true});

  onEnd = () => this.setState({playerState: PLAYER_STATES.ENDED});

  onError = () => alert('Oh! ');

  exitFullScreen = () => {
    alert('Exit full screen');
  };

  enterFullScreen = () => {};

  onFullScreen = () => {
    if (this.state.screenType == 'content') {
      this.setState({screenType: 'cover'});
    } else {
      this.setState({screenType: 'content'});
    }
  };
  onFocusChange = () => {
    this.setState({isFocused: true});
  };
  componentDidMount = () => {
    try {
      const {SelectedData} = this.props;
      var obj = SelectedData.imageList;
      this.setState({PropsImages: obj, 
                    // medias:obj, 
                     Images:obj.filter(x=>x.isVideo === false),
                     medias:obj.filter(x=>x.isVideo === true)});
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  _handleHeaderLeftIcon = () => {
    return (
      <View style={styles.leftHeader}>
        <ArrowLeft style={{color: CommonStyles.appColor, fontSize: 20}} />
      </View>
    );
  };
  _handleHeaderRightIcon = () => {
    const {SelectedData} = this.props;
    if (
      (this.state.Text != null && this.state.Text != '' > 0) ||
      this.state.IsVideo != '' ||
      this.state.Images != ''||
      this.state.Title != ''
    ) {
      if (this.state.isDisabledPublish) {
        return null;
      } else {
        return (
          <View>
            <View style={styles.leftHeader}>
              <Publish style={{color: CommonStyles.appColor, fontSize: 20}} />
            </View>
            <View style={{flex: 0.5}}>
              <Text
                style={{
                  color: '#ffffff',
                  flexWrap: 'nowrap',
                  fontSize: 10,
                  textAlign: 'center',
                }}>
                {SelectedData.isDraft ? 'Publish' : 'RePublish'}
              </Text>
            </View>
          </View>
        );
      }
    } else {
      return null;
    }
  };
  _handleHeaderCenterIcon = () => {
    return (
      <View>
        <BoldText style={styles.headerText}>Edit Shoutout</BoldText>
      </View>
    );
  };
  _handleHeaderText = () => {
    return null;
  };
  _handleHeaderLeftIconPress = () => {
    const {userProfile} = this.props;
    Actions.manageShoutout({userProfile: userProfile});
  };
  Save = IsDraft => {
    const {SelectedData} = this.props;
    // this.setState({
    //   showAlert: true,
    //   displayText: 'Shoutout successfully Republished',
    // });
    if(!SelectedData.isDraft){
      this.setState({
        showAlert: true,
        displayText: 'Shoutout successfully Republished',

      });
      }
      else{
        this.setState({
          showAlert: true,
          displayText: 'Shoutout successfully Published',
        });
      }
    setTimeout(() => {
      this.setState({
        displayText: '',
        showAlert: false,
      });
      if(this.state.VideoURI === '' || this.state.medias.map(x=>x.fileName) === '')
      {
        if (IsDraft) {
          const {ShoutOutDetails} = this.props;
          Actions.manageShoutout({ShoutOutDetails: ShoutOutDetails});
        } else {
          Actions.businessShoutOut({Id: 0, IsAll: false});
          this.setState({showAlert:false})
        }
      }
    }, 5000);
    try {
      var dataToSend = {
        Id: SelectedData.id,
        Userid: global.LoginUserId,
        Ispublic: this.state.checked == 'first' ? true : false,
        Image: this.state.SendBase64,
        Text:
          SelectedData.text != null || SelectedData.text != ''
            ? this.state.Text
            : SelectedData.text,
        IsDraft: IsDraft,
        ShoutoutTitle:
          SelectedData.shoutoutTitle != '' || SelectedData.shoutoutTitle != null
            ? this.state.Title
            : SelectedData.shoutoutTitle,
        IsNew: this.state.IsNew,
        HashTag: this.state.HashTagValue,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/SaveShoutOutBusinessDetails', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(response => {
          if (this.state.VideoURI != '') {
            const uri = this.state.VideoURI !== '' ? this.state.VideoURI : this.state.medias.map(x=>x.fileName);
            const type = 'video/mp4';

            const data = new FormData();
            console.log("VideotoSave",data)
            data.append('body', {
              name: 'Name ' + response+ '' + this.state.videoType,
              type,
              uri,
            });
            try {
              fetch(global.APIURL + 'api/Card/PostVideo', {
                method: 'post',
                body: data,
              })
              .then(response => response.json())
              .then((response)=>{
                //handle success
                console.log("Video posted successfully",response);
                if (IsDraft) {
                  const {ShoutOutDetails} = this.props;
                  Actions.manageShoutout({ShoutOutDetails: ShoutOutDetails});
                } else {
                   Actions.businessShoutOut({Id: 0, IsAll: true});
                   this.setState({showAlert:false})
                }
              })
            } catch (e) {
              Alert.alert(e.message);
            }
          }
          if(this.state.VideoURI == '' || this.state.medias.map(x=>x.fileName) == '')
          {
          if (IsDraft) {
            const {ShoutOutDetails} = this.props;
            Actions.manageShoutout({ShoutOutDetails: ShoutOutDetails});
          } else {
            Actions.businessShoutOut({Id: 0, IsAll: true});
            this.setState({showAlert:false})
          }
        }
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  selectVideoTapped() {
    // this.setState({VideoURI: ''});
    const {SelectedData} = this.props;
    var obj = SelectedData.imageList;
    var videoFile ;
    if (obj.length != 0) {
          obj.map(item => {
        var Name = item.fileName;
        Name = Name.split('.');
        if (Name[1] === 'mp4')
        {videoFile=item.fileName}
          })
        }
    if (this.state.VideoURI !== '' ||this.state.medias.length >= 1) {
    //  Alert.alert('You can upload only one Video');
    console.log("VideoUri",videoFile)
    this.setState({
      showAlert: true,
      displayText: 'You can upload only one Video',
    });
    setTimeout(() => {
      this.setState({
        displayText: '',
        showAlert: false,
      });
    }, 2000);
    } else {
      this.setState({VideoURI: ''});
    const options = {
      title: 'Video Picker',
      mediaType: 'video',
      takePhotoButtonTitle: "Take Video",
      quality: 1,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (Platform.OS == 'android')
      {
        if (response.didCancel) {
          console.log('User cancelled video picker');
          return
        }
        else{
          var fileType = response.path;
          fileType = fileType.split('.');
          this.setState({VideoURI: response.uri, IsVideo: false,videoType: fileType[1]});
        }
      }
      else
      {
        var fileType = response.path;
        fileType = fileType.split('.');
        this.setState({VideoURI: response.uri, IsVideo: false,videoType: fileType[1]})
      }
      this.setState({VideoURI: response.uri, IsVideo: false});
     // this.renderVideo();
     RNFetchBlob.fs.stat(response.uri)
     .then((stats) => { 
        
      console.log("RNFetchBlob",stats)
      this.bytesToSize(stats.size)
     // console.log("VideoSize",this.state.videoSize)
         });
    });
  }
  }

  bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   // var j = Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  // var j = Math.round(bytes / Math.pow(1024, i), 2)
  var j = (bytes / (1024*1024)).toFixed(2)
    console.log("j",j)
    this.setState({videoSize:j})
    if(j > 200){
      this.setState({
        showAlert: true,
        displayText: 'Video size should not exceed 200 MB',
        VideoURI:'',
      });
      setTimeout(() => {
        this.setState({
          displayText: '',
          showAlert: false,
        });
      }, 5000);
    }
    else if(j < 200){
     // console.log("nsfvknsdfijnjsdnfjsdnjfhjsdnf")
      this.renderVideo();
    }
 }

  selectPhotoTapped(value) {
    const {SelectedData} = this.props;
    var obj = SelectedData.imageList;
    var imageFile ;
    if (obj.length != 0) {
          obj.map(item => {
        var Name = item.fileName;
        Name = Name.split('.');
        if (Name[1] !== 'mp4' && item.fileName !== '')
        {imageFile=item.fileName}
          })
        }
    // if (this.state.SendBase64.length > 1 || imageFile !== undefined) {
     // Alert.alert('You can upload only one image');
     if (this.state.Images.length >= 1) {
     console.log("ImageUri",imageFile)
     this.setState({
      showAlert: true,
      displayText: 'You can upload only one Image',
    });
    setTimeout(() => {
      this.setState({
        displayText: '',
        showAlert: false,
      });
    }, 2000);
    } else {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };
    if (value == 1) {
      ImagePicker.launchCamera(options, response => {
        if (response.didCancel) {
        } else if (response.error) {
        } else if (response.customButton) {
        } else {
          let source = {uri: response.uri};
          var fileType = response.uri;
          fileType = fileType.split('.');
          var _saveBase64 = this.state.ImageBase64;
          _saveBase64.push({
            Base64: response.data,
            FileName:
              Platform.OS == 'android'
                ? fileType.length == 2
                  ? fileType[1]
                  : fileType[2]
                : fileType[1],
          });
          this.setState({
            ImageBase64: _saveBase64,
            IsNew: true,
          });
          this.setState({SendBase64: JSON.stringify(this.state.ImageBase64)});
          var _displayImage = this.state.Images;
          _displayImage.push({URL: source});
          console.log("Images Custom",_displayImage)
          this.setState({Images: _displayImage});
          this.renderImage();
        }
      });
    } else {
      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
        } else if (response.error) {
        } else if (response.customButton) {
        } else {
          let source = {uri: response.uri};
          var fileType = response.uri;
          fileType = fileType.split('.');
          var _saveBase64 = this.state.ImageBase64;
          _saveBase64.push({
            Base64: response.data,
            FileName: Platform.OS == 'android' ? fileType[2] : fileType[1],
          });
          this.setState({
            ImageBase64: _saveBase64,
            IsNew: true,
          });
          this.setState({SendBase64: JSON.stringify(this.state.ImageBase64)});
          var _displayImage = this.state.Images;
          _displayImage.push({URL: source});
          this.setState({Images: _displayImage});
          this.renderImage();
        }
      });
    }
  }
  }
  _handleOpenImage = (item) => {
    Actions.openImage({
      FileName: item,
      IsVideo: false,
      IsFromPost: true,
    });
  };
  renderImage = () => {
    console.log("Item",this.state.Images)
    if (this.state.Images.length !== 0) {
      return this.state.Images.map(item => {
        return (
          <View style={{flex: 1, flexDirection: 'row', justifyContent:"flex-end", marginHorizontal:15, marginVertical:10}}>
             <TouchableOpacity style={styles.videoContainer} onPress={() => {(item.URL && item.URL.uri ) ? this.setState({modalVisible: ! this.state.modalVisible}): this._handleOpenImage(item.fileName)}}>
            <Image style={styles.image} source={{uri: item.URL ? item.URL.uri : global.APIURL +  'uploadimgs/ShoutOutImages/' + item.fileName}} resizeMode="cover" />
            <View style={{position:"absolute"}}>
            <TouchableOpacity
              onPress={() => this.RemoveImageFromList(item)}>
              {/* <Closecircle /> */}
              <Image source={crossLogo} style={{ height:30, width:30, bottom:5, left:5}} />
            </TouchableOpacity>
            </View>
            </TouchableOpacity>
          </View>
        );
      });
    } 
    // else if (this.props.SelectedData.imageList != 0) {
    //   const {SelectedData} = this.props;
    //   var obj = SelectedData.imageList;
    // //  console.log("Edit Image data",obj.map(item => {return item.fileName}))
    //  // console.log("Edit Video data",this.state.VideoURI)
    //   if (obj.length > 0) {
    //     return obj.map(item => {
    //       var Name = item.fileName;
    //       Name = Name.split('.');
    //       if (Name[1] !== 'mp4' && item.fileName !== '') {
    //         return (
    //           <View style={{flex: 1, flexDirection: 'row', justifyContent:"flex-end", marginHorizontal:15, marginVertical:10}}>
    //            <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent:"flex-end", marginHorizontal:15, marginVertical:10}} onPress={() => this._handleOpenImage(item.fileName)}>
    //             <Image
    //               style={styles.image}
    //               resizeMode="cover"
    //               source={{
    //                 uri:
    //                   global.APIURL +
    //                   'uploadimgs/ShoutOutImages/' +
    //                   item.fileName,
    //               }}
    //             />
    //             <View style={{position:"absolute"}}>
    //             <TouchableOpacity
    //               onPress={() => this.RemoveImageFromList(item.fileName, true)}>
    //               {/* <Closecircle /> */}
    //               <Image source={crossLogo} style={{ height:30, width:30, bottom:5, left:5}} />
    //             </TouchableOpacity>
    //             </View>
    //             </TouchableOpacity>
    //           </View>
    //         );
    //       } else {
    //         return null;
    //       }
    //     });
    //   }
    //   else {
    //     return null;
    //   }
    // }
    else {
      return null;
    }
  };
  _handleOpenVide = (item) => {
    Actions.openImage({
      FileName: this.state.VideoURI || global.APIURL +'uploadimgs/ShoutOutImages/' +item.fileName,
      IsVideo: true,
      IsFromPost: true,
    });
  };
  _handleOpenVideo = (item) => {
    Actions.openImage({
      FileName: this.state.VideoURI || global.APIURL +'uploadimgs/ShoutOutImages/' + item,
      IsVideo: true,
      IsFromPost: true,
    });
  };
  renderVideo = () => {
    console.log("Item2",this.state.medias)
    let videoData = this.state.medias.map(x=>x.fileName)
    console.log("Item3",videoData)
    if (this.state.VideoURI != ''  && this.state.videoSize < 200) {
      return (
        <View style={styles.videoContainer}>
          <TouchableOpacity style={styles.videoContainer} onPress={() => this._handleOpenVide(this.state.VideoURI)}>
          <ReactVideo
            onEnd={this.onEnd}
            onLoad={this.onLoad}
            onLoadStart={this.onLoadStart}
            onProgress={this.onProgress}
            paused={this.state.paused}
            ref={videoPlayer => (this.videoPlayer = videoPlayer)}
            resizeMode={this.state.screenType}
            onFullScreen={this.state.isFullScreen}
            source={{
              uri: this.state.VideoURI,
            }}
            style={styles.mediaPlayer}
            volume={10}
          />
          </TouchableOpacity>
          <View style={{position:"absolute"}}>
        <TouchableOpacity
            onPress={() => this.setState({VideoURI:''})}>
            {/* <Closecircle /> */}
            <Image source={crossLogo} style={{ height:30, width:30, bottom:5, left:5}} />
          </TouchableOpacity>
        </View>
          </View>
      );
    }
    else if(this.state.medias.length !== 0) {
      return (
        <View style={styles.videoContainer}>
          <TouchableOpacity style={styles.videoContainer} onPress={() => this._handleOpenVideo(videoData)}>
          <ReactVideo
            onEnd={this.onEnd}
            onLoad={this.onLoad}
            onLoadStart={this.onLoadStart}
            onProgress={this.onProgress}
            paused={this.state.paused}
            ref={videoPlayer => (this.videoPlayer = videoPlayer)}
            resizeMode={this.state.screenType}
            onFullScreen={this.state.isFullScreen}
            source={{
              uri: global.APIURL + 'uploadimgs/ShoutOutImages/' + videoData,
            }}
            style={styles.mediaPlayer}
            volume={10}
          />
          </TouchableOpacity>
          <View style={{position:"absolute"}}>
        <TouchableOpacity
            onPress={() => this.setState({medias:[]})}>
            {/* <Closecircle /> */}
            <Image source={crossLogo} style={{ height:30, width:30, bottom:5, left:5}} />
          </TouchableOpacity>
        </View>
          </View>
      );
    }
    else {
      return null;
    }
  };

  RemoveVideoFromList = (FileName, IsFromProps) => {
    console.log("removeVideoPressed",FileName,this.props.SelectedData.imageList,this.props.SelectedData.imageList.length)
    if (IsFromProps) {
      const {SelectedData} = this.props;
      var obj = SelectedData.imageList;
      obj.map(item => {
        if (FileName === item.fileName) {
          item.FileName = '';
          item.fileName = '';
        }
      });
      global.ManageShoutOuts.setState({SelectedData: obj});
    } else {
      this.setState({
        VideoURI: ''
      });
    }
    this.renderImage();
  };


  RemoveImageFromList = (FileName, IsFromProps) => {
   // console.log("removeImagePressed",FileName,this.props.SelectedData.imageList,this.props.SelectedData.imageList.length)
    // if (IsFromProps) {
    //   const {SelectedData} = this.props;
    //   var obj = SelectedData.imageList;
    //   obj.map(item => {
    //     if (FileName === item.fileName) {
    //       item.FileName = '';
    //       item.fileName = '';
    //     }
    //   });
    //   global.ManageShoutOuts.setState({SelectedData: []});
    // } else {
    //   this.setState({
    //     Images: []});
    // }
    this.setState({ Images: [], ImageBase64: [], SendBase64:''});
  };
  renderPostShoutOutData = () => {
    const {checked} = this.state;
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 0.1, marginBottom: 10}}>
          <MediumBoldText style={{color: '#000', textAlign: 'center'}}>
            What do you want to promote?
          </MediumBoldText>
        </View>
        <View
          style={{
            flex: 0.2,
            marginLeft: 15,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{flex: 0.3}}>
            <Text>Who can see</Text>
          </View>
          <View style={{flex: 0.3, flexDirection: 'row'}}>
            <RadioButton
              value="first"
              status={checked === 'first' ? 'checked' : 'unchecked'}
              onPress={() => {
                this.setState({checked: 'first'});
              }}
            />
            <Text style={{alignSelf:"center"}}>EveryOne</Text>
          </View>
          <View style={{flex: 0.5, flexDirection: 'row'}}>
            <RadioButton
              value="second"
              status={checked === 'second' ? 'checked' : 'unchecked'}
              onPress={() => {
                this.setState({checked: 'second'});
              }}
            />
            <Text style={{alignSelf:"center"}}>MyConnections</Text>
          </View>
        </View>
        {/* {this.state.HashTagValue != '' && this.state.HashTagValue != null ? (
          <View
            style={{
              flex: 0.2,
            }}>
            <TextInput
              placeholder={'Enter HashTag'}
              maxLength={6}
              value={this.state.HashTagValue}
              onChangeText={text => this._handleOnHashTagTextChange(text)}
            />
          </View>
        ) : null} */}
        <View>
          <FloatingInput
          borderEnable={true}
            placeholder="Enter Title"
            onChangeText={value => {
              this.setState({Title: value});
            }}
          //  maxLength={15}
          textInputStyle={{color:"gray"}}
            value={
              this.state.Title != '' &&
              this.state.Title != null &&
              this.state.Title != 'null'
                ? this.state.Title
                : ''
            }
          />
        </View>
        <View style={styles.textInputView}>
        {/* {this.state.Text === '' &&(<View><Text style={{color: '#a4a6a9', fontSize:14,marginLeft:15, marginTop:5, marginBottom:5}}>Enter Shoutout Description</Text></View>)} */}
          {/* <TextInput
            style={[styles.textInput]}
            onFocus={this.onFocusChange}
            underlineColorAndroid="transparent"
            placeholder="Type something"
            placeholderTextColor="grey"
            numberOfLines={20}
            multiline={true}
            editable={true}
            maxLength={500}
            blurOnSubmit={true}
            onChangeText={text => this.setState({Text: text})}
            value={
              this.state.Text != '' &&
              this.state.Text != null &&
              this.state.Text != 'null'
                ? this.state.Text
                : ''
            }
          /> */}
          <Textarea
            containerStyle={styles.textareaContainer}
            style={styles.textarea}
            onFocus={this.onFocusChange}
            onChangeText={text => this.setState({ Text: text })}
            defaultValue={
              this.state.Text != '' &&
                this.state.Text != null &&
                this.state.Text != 'null'
                ? this.state.Text
                : ''
            }
            maxLength={500}
            numberOfLines={20}
            multiline={true}
            editable={true}
            //blurOnSubmit={true}
            //placeholder={"Type something"}
            placeholder={"Enter Shoutout Description"}
            placeholderTextColor={'#c7c7c7'}
            //placeholderTextColor={'grey'}
            underlineColorAndroid={'transparent'}
          />
        </View>
        {this.state.Images !== 0 ? this.renderImage() : null}
        {this.renderVideo()}
      </View>
    );
  };
  _handleOnContinuePress = () => {
    this.setState({swipeablePanelActive: false});
  };
  _handleOnDeleteDraftPress = () => {
    this.setState({swipeablePanelActive: false});
    //Actions.businessShoutOut();
    const {handleGoBack} = this.props;
    handleGoBack();
  };
  _handleOnSaveDraftPress = () => {
    this.setState({swipeablePanelActive: false});
    this.Save(true);
  };
  _handleHeaderRightIconPress = () => {
    const {userProfile} = this.props;
    // this.Save(false);
    if (userProfile != null) {
      if (!userProfile.isshoutoutdisabled) {
        this.Save(false);
      } else {
        this.setState({
          showAlert: true,
         // displayText: 'Shoutout post was disable.Please contact admin once',
         displayText: 'Admin blocked you. Please contact admin',
        });
        setTimeout(() => {
          this.setState({
            SuccessText: '',
            displayText: false,
          });
        }, 10000);
      }
    }
  };
  _handleHeaderProfileIcon = () => {
    return null;
  };
  _handleOnHashTagTextChange = text => {
    this.setState({HashTagValue: text});
  };
  render() {
    const {checked} = this.state;
    console.log("ImagesLintu",this.state.Images.map(x=>x.URL ? x.URL.uri :null)[0])
    return (
      <View style={styles.container}>
        <View style={{flex: 0.18, marginBottom: 10}}>
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
        {/* {this.state.showAlert ? (
          <Text>Shoutout successfully Republished</Text>
        ) : null} */}
        {this.state.showAlert ? (
            <View style={{alignSelf:"center", marginTop: 10}}>
              <MediumBoldText style={{color: '#000', textAlign: 'center'}}>
              {this.state.displayText}
          </MediumBoldText>
            </View>
          ) : null}
        {this.renderPostShoutOutData()}
        <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.setState({modalVisible:false})
        }}
      >
        <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{flex: 1, flexDirection: 'row', justifyContent:"flex-end",marginBottom:15}}>
          <Image
            resizeMode="cover"
            style={{width:windowWidth-10, height:windowHeight/1.1, alignSelf:"center",top:10}}
            source={{uri: this.state.Images.map(x=>x.URL ? x.URL.uri :null)[0]}}
          />
         <View style={{position:"absolute"}}>
         <TouchableOpacity
            onPress={() => this.setState({modalVisible: false})}>
            <Image source={crossLogo} style={{ height:40, width:40, top:15, left:10}} />
          </TouchableOpacity>
         </View>
        </View>
          </View>
        </View>
      </Modal>
        <View style={styles.bottomIconsView}>
          <View style={[styles.IconsView, {marginLeft: 5}]}>
            <TouchableOpacity onPress={this.selectPhotoTapped.bind(this, 1)}>
              <Camera
                style={{color: '#a4a6a9', fontSize: 25, textAlign: 'center'}}
              />
              <Text style={{textAlign: 'center'}}>Camera</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.IconsView}>
            <TouchableOpacity onPress={this.selectPhotoTapped.bind(this, 2)}>
              <ImageIcon
                style={{color: '#a4a6a9', fontSize: 25, textAlign: 'center'}}
              />
              <Text style={{textAlign: 'center'}}>Gallery</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.IconsView}>
            <TouchableOpacity onPress={this.selectVideoTapped.bind(this)}>
              <Video
                style={{color: '#a4a6a9', fontSize: 25, textAlign: 'center'}}
              />
              <Text style={{textAlign: 'center'}}>Video</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.IconsView}>
            <TouchableOpacity>
              <Hash
                style={{color: '#a4a6a9', fontSize: 25, textAlign: 'center'}}
              />
              <Text style={{textAlign: 'center'}}>HashTag</Text>
            </TouchableOpacity>
          </View>
        </View>
        <SwipeablePanelView
          onSaveDraftPress={this._handleOnSaveDraftPress}
          onDeleteDraftPress={this._handleOnDeleteDraftPress}
          onContinuePress={this._handleOnContinuePress}
          swipeablePanelActive={this.state.swipeablePanelActive}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //marginTop: 22,
    backgroundColor: "white",
    paddingVertical:15,
    paddingHorizontal:5
  },
  modalView: {
   // margin: 10,
  //  backgroundColor: "white",
   // borderRadius: 20,
   // padding: 15,
    alignItems: "center",
    justifyContent:"center",
    alignSelf:"center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width:windowWidth,
    height:windowHeight
  //  elevation: 5
  },
  textInput: {
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
  textareaContainer: {
   // height: 400,
    //padding: 5,
    flex: 1,
    backgroundColor: '#F5FCFF',
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  textarea: {
    textAlignVertical: 'top',  // hack android
   // height: 400,
    fontSize: 15,
    color: '#333',
    backgroundColor:"#f4f6f9"
  },
  textInputView: {
    flex: 0.3,
    // borderColor: '#e0e0e0',
    // borderWidth: 1,
    margin: 10,
  },
  image: {
    borderRadius: 10,
    flex: 1,
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomIconsView: {
    flex: 0.1,
    borderColor: '#e0e0e0',
    //borderWidth: 1,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  IconsView: {
    flex: 1,
  },
  RenderImage: {
    flex: 2,
    alignItems: 'stretch',
    //backgroundColor: '#ffffff',
    marginLeft: 10,
    marginRight: 10,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 16,
    top:12
  },
  videoContainer: {
    flex: 1,
    flexDirection:"row",
    justifyContent:"flex-end",
    marginHorizontal:10, 
    marginVertical:5, 
    borderRadius:10
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
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
const mapDispatchToProps = {
  handleGoBack: goBack,
};

export default connect(
  null,
  mapDispatchToProps,
)(PostShoutOut);