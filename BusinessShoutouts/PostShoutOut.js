/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import axios from 'axios';
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
  ActivityIndicator,
  Dimensions
} from 'react-native';
import Textarea from 'react-native-textarea';
import CommonHeader from '../shared/CommonHeader';
import {
  Video,
  Hash,
  ImageIcon,
  Closecircle,
  Cancel,
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
import Logo from '../Images/logoRotate.gif';
import RNFetchBlob from 'rn-fetch-blob';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


class PostShoutOut extends Component {
  videoPlayer;
  constructor(props) {
    super(props);
    this.state = {
      Text: '',
      Images: [],
      IsBold: false,
      ImageBase64: [],
      isFocused: false,
      SendBase64: '',
      recording: false,
      VideoURI: '',
      currentTime: 0,
      duration: 0,
      isFullScreen: false,
      isLoading: true,
      paused: false,
      playerState: PLAYER_STATES.PLAYING,
      screenType: 'content',
      processing: false,
      IsVideo: false,
      Type: '',
      checked: 'first',
      Title: '',
      swipeablePanelActive: false,
      showAlert: false,
      BottomPopup: false,
      IsHashTag: false,
      HashTagValue: '',
      isDisabledPublish: false,
      videoType: '',
      isRefreshing: false,
      displayText:'',
      modalVisible: false,
      imageToView:null,
      videoSize: undefined
    };
    global.PostShoutOut = this;
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
  onSeeking = currentTime => this.setState({currentTime});
  _handleHeaderLeftIcon = () => {
    return (
      <View>
        <View style={styles.leftHeader}>
          <Cancel style={{color: CommonStyles.appColor, fontSize: 16}} />
        </View>
        <Text style={{color: '#ffffff', textAlign: 'center', fontSize: 10}}>Cancel</Text>
      </View>
    );
  };
  _handleHeaderRightIcon = () => {
    if (
      this.state.Text.length != 0 ||
      this.state.IsVideo != '' ||
      this.state.Images != '' ||
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
            <Text style={{color: '#ffffff', fontSize: 10, textAlign: 'center'}}>Publish</Text>
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
        <BoldText style={styles.headerText}>
          Create Shoutout
        </BoldText>
      </View>
    );
  };
  _handleHeaderText = () => {
    return null;
  };
  _handleHeaderLeftIconPress = () => {
    if (
      this.state.Text.length > 0 ||
      this.state.IsVideo != '' ||
      this.state.Images != '' ||
      this.state.Title != ''
    ) {
      this.setState({swipeablePanelActive: true});
    } else {
      this.setState({SwipeablePanelView: false});
      //Actions.businessShoutOut({Id: 0, IsAll: false});
      const {handleGoBack} = this.props;
      handleGoBack();
    }
  };
  Save = IsDraft => {
   // console.log(IsDraft)
    if(!IsDraft){
    this.setState({
      showAlert: true,
      displayText: 'Shoutout successfully publish',
    });
    }
    else{
      this.setState({
        showAlert: true,
        displayText: 'Your draft saved successfully',
      });
    }
    setTimeout(() => {
      this.setState({
        displayText: '',
        showAlert: false,
      });
      if(this.state.VideoURI == '')
        {
        Actions.businessShoutOut({Id: 0, IsAll: false});
        }
    }, 10000);
    if(this.state.Title === ''){
      this.setState({
        showAlert: true,
        displayText: "Shoutout title can't be empty",
        isDisabledPublish: false
      });
      setTimeout(() => {
        this.setState({
          displayText: '',
          showAlert: false,
        });
        if(this.state.VideoURI === '')
        {}
       // Actions.businessShoutOut({Id: 0, IsAll: false});
      }, 5000);
      return
    }
    else if(this.state.Title !== ''){
    try {
      var dataToSend = {
        Userid: global.LoginUserId,
        Ispublic: this.state.checked == 'first' ? true : false,
        Image: this.state.SendBase64,
        Text: this.state.Text,
        IsDraft: IsDraft,
        ShoutoutTitle: this.state.Title,
        IsNew: true,
        HashTag: this.state.HashTagValue,
      };
      console.log("Datato send", dataToSend)
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      // fetch(global.APIURL + 'api/Card/SaveShoutOutBusinessDetails', {
      //   method: 'POST', //Request Type
      //   body: formBody, //post body
      //   headers: {
      //     //Header Defination
      //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      //   },
      // })
      axios({
        method: "post",
        url: global.APIURL + 'api/Card/SaveShoutOutBusinessDetails',
        data: formBody,
        headers: {"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8" },
      })
       // .then(response => response.json())
        .then(response => {
          console.log("Post posted successfully",response);
          if (this.state.VideoURI != '') {
            const type = 'video/mp4';
            const uri = this.state.VideoURI;

            const data = new FormData();
            data.append('body', {
              name: 'Name _' + response.data + '_' + this.state.videoType,
              type,
              uri,
            });
            try {
              // fetch(global.APIURL + 'api/Card/PostVideo', {
              //   method: 'Post',
              //   body: data,
              // });
              axios({
                method: "post",
                url: global.APIURL + 'api/Card/PostVideo',
                data: data,
               // headers: { "Content-Type": "multipart/form-data" },
              })
              .then((response)=>{
                //handle success
                console.log("Video posted successfully",response);
                if (IsDraft) {
                  const {ShoutOutDetails} = this.props;
                  Actions.manageShoutout({ShoutOutDetails: ShoutOutDetails});
                } else {
                   Actions.businessShoutOut({Id: 0, IsAll: false});
                   this.setState({showAlert:false})
                }
              })
            } catch (e) {
              Alert.alert(e.message);
            }
          }
          if(this.state.VideoURI == '')
          {
          if (IsDraft) {
            const {ShoutOutDetails} = this.props;
            Actions.manageShoutout({ShoutOutDetails: ShoutOutDetails});
          } else {
            // this.setState({
            //   showAlert: true,
            // });
            // setTimeout(() => {
            //   this.setState({
            //     showAlert: false,
            //   });
            // }, 1000);
             Actions.businessShoutOut({Id: 0, IsAll: false});
            this.setState({showAlert:false})
          }
        }
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  }
  };
  selectVideoTapped() {
    // this.setState({VideoURI: ''});
    if (this.state.VideoURI !== '') {
      this.setState({
        showAlert: true,
        displayText: 'You can upload only one Video',
      });
      setTimeout(() => {
        this.setState({
          displayText: '',
          showAlert: false,
        });
      }, 5000);
     // Alert.alert('You can upload only one Video');
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
        this.setState({videoType: fileType[1]});
        }
      }
      else
      {
        var fileType = response.uri;
        fileType = fileType.split('.');
        this.setState({videoType: fileType[1]});
      }
      this.setState({VideoURI: response.uri, IsVideo: false});
      // console.log("video picked",this.state.VideoURI)
      // this.renderVideo();
      RNFetchBlob.fs.stat(response.uri)
      .then((stats) => { 
         
       console.log("RNFetchBlob",stats)
       this.bytesToSize(stats.size)
          });

    });
  }
  }

  bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   // var j = Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
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
    if (this.state.SendBase64.length > 1) {
      this.setState({
        showAlert: true,
        displayText: 'You can upload only one Image',
      });
      setTimeout(() => {
        this.setState({
          displayText: '',
          showAlert: false,
        });
      }, 5000);
     // Alert.alert('You can upload only one image');
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
              FileName: Platform.OS == 'android' ? fileType.length == 2
                    ? fileType[1]
                    : fileType[2] : fileType[1],
            });
            this.setState({
              ImageBase64: _saveBase64,
            });
            this.setState({SendBase64: JSON.stringify(this.state.ImageBase64)});
            var _displayImage = this.state.Images;
            _displayImage.push({URL: source});
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
  renderImage = () => {
    return this.state.Images.map(item => {
      return (
        <View style={{flex: 1, flexDirection: 'row', justifyContent:"flex-end", marginHorizontal:15, marginVertical:10}}>
         <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent:"flex-end", marginHorizontal:15, marginVertical:10}} onPress={() => this._handleOpenImage(item.URL.uri)}>
          <Image
            resizeMode="cover"
            style={styles.image}
            source={{uri: item.URL.uri}}
          />
         <View style={{position:"absolute"}}>
         <TouchableOpacity
            onPress={() => this.RemoveImageFromList(item.URL.uri)}>
            {/* <Closecircle /> */}
            <Image source={crossLogo} style={{ height:30, width:30, bottom:15, left:10}} />
          </TouchableOpacity>
         </View>
         </TouchableOpacity>
        </View>
      );
    });
  };
  _handleOpenImage = (item) => {
    console.log("Item",item)
    this.setState({modalVisible:!this.state.modalVisible, imageToView:item})
    // Actions.openImage({
    //   FileName: item,
    //   IsVideo: false,
    //   IsFromPost: false,
    // });
  };
  _handleOpenVide = () => {
    Actions.openImage({
      FileName: this.state.VideoURI,
      IsVideo: true,
      IsFromPost: true,
    });
  };
  renderVideo = () => {
    return (
      <View style={styles.videoContainer}>
      <TouchableOpacity style={styles.videoContainer} onPress={() => this._handleOpenVide()}>
        <ReactVideo
          paused={true}
          fullscreen={true}
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
          source={{
            uri: this.state.VideoURI,
          }}
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
  };
  RemoveImageFromList = FileName => {
    this.setState({
      Images: this.state.Images.filter(list => {
        return list.URL.uri !== FileName;
      }),
    });
    this.setState({SendBase64: '', ImageBase64: []});
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
        <View style={{flex: 0.2, marginLeft: 15, flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 0.3}}>
            <Text>Who can see</Text>
          </View>
          <View style={{flex: 0.3, flexDirection: 'row'}}>
            <RadioButton
              color="#0cb1c4"
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
              color="#0cb1c4"
              value="second"
              status={checked === 'second' ? 'checked' : 'unchecked'}
              onPress={() => {
                this.setState({checked: 'second'});
              }}
            />
            <Text style={{alignSelf:"center"}}>MyConnections</Text>
          </View>
        </View>
        <View>
          <FloatingInput
            borderEnable={true}
            placeholder="Enter Title"
            onChangeText={value => {
              this.setState({Title: value});
            }}
            textInputStyle={{color:"gray"}}
           // maxLength={15}
          />
        </View>
        <View style={styles.textInputView}>
          {/* {this.state.Text === '' &&(<View><Text style={{color: '#a4a6a9', fontSize:18,marginLeft:15, marginTop:15}}>Enter Shoutout Description</Text></View>)} */}
          {/* <TextInput
            style={styles.textInput}
            onFocus={this.onFocusChange}
            underlineColorAndroid="transparent"
            placeholder="Enter Shoutout Description"
            numberOfLines={20}
            multiline={true}
            editable={true}
            onChangeText={text => this._handleOnDescription(text)}
            value={this.state.Text}
            maxLength={500}
            blurOnSubmit={true}
           /> */}
           <Textarea
            containerStyle={styles.textareaContainer}
            style={styles.textarea}
            onFocus={this.onFocusChange}
            onChangeText={text => this._handleOnDescription(text)}
            defaultValue={this.state.Text}
            maxLength={500}
            numberOfLines={20}
            multiline={true}
            editable={true}
            //blurOnSubmit={true}
            placeholder={"Enter Shoutout Description"}
            placeholderTextColor={'#c7c7c7'}
            underlineColorAndroid={'transparent'}
          />
        </View>
        {this.state.Images.length !== 0 ? (
         this.renderImage()
        ) : null}
        {this.state.VideoURI !== '' && this.state.videoSize < 200 ? (
          this.renderVideo()
        ) : null}
      </View>
    );
  };
  _handleOnDescription = text => {
    try {
      this.setState({Text: text});
    }
    catch (e)
    {
      Alert.alert(e.message);
    }
  }
  _handleOnContinuePress = () => {
    this.setState({swipeablePanelActive: false});
  };
  _handleOnDeleteDraftPress = () => {
    this.setState({swipeablePanelActive: false});
    const {handleGoBack} = this.props;
    handleGoBack();
  };
  _handleOnSaveDraftPress = () => {
    this.setState({swipeablePanelActive: false});
    this.Save(true);
  };
  _handleHeaderRightIconPress = () => {
    this.setState({isDisabledPublish: true});
    this.Save(false);
  };
  _handleHeaderProfileIcon = () => {
    return null;
  };
  _handleOnHashTagPress = () => {
    var _text = this.state.Text;
    _text = _text + ' ' + '#';
    this.setState({Text: _text});
  };
  render() {
    return (
      <View style={styles.container}>
       <View style={styles.container}>
          <View style={{flex: 0.18, marginBottom: 10}}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => this._handleHeaderRightIcon()}
            HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
            HeaderText={() => this._handleHeaderText()}
            HeaderLeftIconPress={this._handleHeaderLeftIconPress}
            HeaderRightIconPress={this._handleHeaderRightIconPress}
            HeaderProfileIcon={() => this._handleHeaderProfileIcon}
            HeaderProfileIconPress={this._handleHeaderProfileIconPress}
            IsShowTextForTabs={false}
          />
        </View>
        {/* {this.state.showAlert ? (
          <Text>Shoutout successfully publish</Text>
        ) : null} */}
         {this.state.showAlert ? (
            <View style={{alignSelf:"center", marginTop: 10, marginBottom:10}}>
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
            source={{uri: this.state.imageToView}}
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
          <View style={styles.IconsView}>
            <TouchableOpacity onPress={this.selectPhotoTapped.bind(this, 1)}>
              <Camera style={{color: '#a4a6a9', fontSize: 25, textAlign: 'center'}} />
              <Text style={{textAlign: 'center'}}>Camera</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.IconsView}>
            <TouchableOpacity onPress={this.selectPhotoTapped.bind(this, 2)}>
              <ImageIcon style={{color: '#a4a6a9', fontSize: 25, textAlign: 'center'}} />
              <Text style={{textAlign: 'center'}}>Gallery</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.IconsView}>
            <TouchableOpacity onPress={this.selectVideoTapped.bind(this)}>
              <Video style={{color: '#a4a6a9', fontSize: 25, textAlign: 'center'}} />
              <Text style={{textAlign: 'center'}}>Video</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.IconsView}>
            <TouchableOpacity onPress={() => this._handleOnHashTagPress()}>
              <Hash style={{color: '#a4a6a9', fontSize: 25, textAlign: 'center'}} />
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
  textareaContainer: {
   // height: 170,
    //padding: 5,
    flex: 1,
    backgroundColor: '#f4f6f9',
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  textarea: {
    textAlignVertical: 'top',  // hack android
   // height: 170,
    fontSize: 15,
    color: '#333',
    backgroundColor:"#f4f6f9"
  },
  textInput: {
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    fontSize:15
  },
  textInputView: {
    flex: 0.3,
    // borderColor: '#e0e0e0',
    // borderWidth: 1,
    marginHorizontal: 10,
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
    //borderWidth: 1,
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
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
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
