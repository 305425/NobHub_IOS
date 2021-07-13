import React, {Component} from 'react';
import {
  View,
  TextInput,
  Image,
  FlatList,
  StyleSheet,
  PixelRatio,
  Alert,
  TouchableOpacity,
  Text,
  Linking,
  Dimensions,
} from 'react-native';
import {MediumBoldText} from '../shared/Text';
import {
  CommonStyles,
  GilRoyMediumColor,
  GilRoyRegularColor,
} from '../shared/Constants';
import {Thumbnail} from 'native-base';
//import ReactVideo from 'react-native-video';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
//Import React Native Video to play video
import {
  Like,
  Chatting,
  Report,
  Invite,
  Block,
  PhotoGraph,
} from '../shared/Icon';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
} from 'react-native-popup-dialog';
import ViewMoreText from 'react-native-view-more-text';
import Hyperlink from 'react-native-hyperlink';
import {Actions} from 'react-native-router-flux';
import playIcon from '../Images/playIcon.png'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const colors= [
  '#27BECF','#994F14','#DA291C','#FFCD00','#007A33','#EB9CA8', '#7C878E',
  '#8A004F','#000000','#10069F','#00a3e0','#4CC1A1','#915520', '#b3d962',
  '#67a8e0', '#c06dde', '#1ec952', '#cc1f36', '#0b615f', '#911c16'
]

export default class ViewShoutOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      swipeablePanelActive: false,
      FileName: '',
      IsVideo: false,
      SureWantToDelete: false,
      showAlert: false,
      DisplayText: '',
      paused: true,
    };
  }
  _handleOpenImageOrVideo = (FileName, IsVideo) => {
    Actions.openImage({
      FileName: FileName,
      IsVideo: IsVideo,
      IsFromPost: false,
    });
  };
  _handleOnTouchableImagePress = () => {
    this.setState({swipeablePanelActive: false});
  };
  renderViewMore(onPress) {
    return (
      <Text style={{color: '#a4a6a9', alignSelf:"flex-end"}} onPress={onPress}>
        View more
      </Text>
    );
  }
  renderViewLess(onPress) {
    return (
      <Text style={{color: '#a4a6a9', alignSelf:"flex-end"}} onPress={onPress}>
        View less
      </Text>
    );
  }
  renderItem = ({item,index}) => {
  //  console.log("ItemWithhashTag",item.text.match(/#[a-z]+/gi))
  console.log("VideoiscomingorNot",item.imageList[0])
   // let hashLiterals = item.text.match(/#[a-z]+/gi);
    var formatted = new Date(item.createddate).toLocaleString();
    formatted = formatted.split(':');
    const text = item.text ? item.text.split(' ') : [];
    var day = formatted[0];
    var year = formatted[2].split(' ');
    year = year[1];
    var time = formatted[1];
    if (!item.isDraft) {
      return (
        <View style={{flex: 1, margin: 5}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 0.2}}>
              {item.profilePicture !== '' && item.profilePicture != null ? (
                <Thumbnail
                  style={{backgroundColor: CommonStyles.appColor}}
                  medium
                  source={{
                    uri:
                      global.APIURL +
                      'uploadimgs/ProfilePictures/' +
                      item.profilePicture,
                  }}
                />
              ) : (
                <View style={{fontSize: 18,
                  color: '#ffffff',
                  height: 50,
                  width: 50,
                  borderRadius: 100,
                  backgroundColor: colors[index%colors.length],
                  textAlign: 'center',
                  paddingTop: 10}}>
                  <MediumBoldText
                    style={{
                      fontSize: 26,
                      color: '#ffffff',
                      textAlign: 'center',
                    }}>
                    {item.firstName.charAt(0) + item.lastName.charAt(0)}
                  </MediumBoldText>
                </View>
              )}
            </View>
            <View style={{flex: 1}}>
              <MediumBoldText style={{color: GilRoyMediumColor.fontColor}}>
                {item.nickName != '' && item.nickName != null
                  ? item.nickName
                  : item.firstName + ' ' + item.lastName}
              </MediumBoldText>
              <View style={{flexDirection: 'row', flex: 1}}>
                <View style={{flex: 1}}>
                  <Text style={{color: GilRoyRegularColor.fontColor}}>
                    {item.title + ', ' + item.companyName}
                  </Text>
                </View>
                <View style={{flex: 0.3, flexDirection: 'row', left: 8, top:15}}>
                  <Like style={{color: CommonStyles.appColor, fontSize:22}} />
                  <Text style={{left:5, fontSize:17}}>{item.likesCount}</Text>
                </View>
              </View>
              <Text style={{color: GilRoyRegularColor.fontColor, bottom:5}}>
                {day + ':' + time + ' ' + year}
              </Text>
            </View>
          </View>
          <View style={{flex: 1, borderTopWidth: 1, borderTopColor: '#e0e0e0'}}>
            {item.shoutoutTitle != '' &&
            item.shoutoutTitle != null &&
            item.shoutoutTitle != 'null' ? (
              <View style={{flex: 0.5}}>
                <MediumBoldText>{item.shoutoutTitle}</MediumBoldText>
              </View>
            ) : null}
            {/* <View style={{flexDirection:"row"}}>
            {hashLiterals !== null &&
            hashLiterals.length ? hashLiterals.map(x=>(
              <View style={{marginHorizontal:5}}>
                <TouchableOpacity onPress={() => this._handleOnHastagPress(x)}>
                <MediumBoldText style={{color:"#0000EE"}}>{x}</MediumBoldText>
                </TouchableOpacity>
              </View>
            )): null}
            </View> */}
            {item.text != null && item.text != '' && item.text != 'null' ? (
              <View style={{flex: 1.2}}>
                <Hyperlink
                  linkStyle={{color: 'blue'}}
                  onPress={(url, text) => Linking.openURL(url)}>
                  <ViewMoreText
                    numberOfLines={2}
                    renderViewMore={this.renderViewMore}
                    renderViewLess={this.renderViewLess}>
                    {/* <Text>{item.text}</Text> */}
                    <Text>{text.length && text.map(text => {
      if (text.startsWith('#')) {
        return( 
        <Text style={{ color: 'blue' }} onPress={() => this._handleOnHastagPress(text)}>{text} </Text>
        );
      }
      return `${text} `;
    })}</Text>
                  </ViewMoreText>
                </Hyperlink>
              </View>
            ) : null}
            <View style={{flex: 1, marginBottom: 10, top: 5}}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={item.imageList}
               // numColumns={2}
                renderItem={imgData => this.renderItemImage(imgData)}
              />
            </View>
            <View
              style={{
                flex: 0.2,
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 5,
                alignItems: 'center',
              }}>
              <View>
                <TouchableOpacity
                  onPress={() => this._handleOnLikePress(item.id)}>
                  <View style={{flexDirection: 'row'}}>
                    <Like
                      style={{
                        color: item.likeByMe
                          ? CommonStyles.appColor
                          : '#a4a6a9',
                        marginRight: 5,
                        fontSize: 22,
                        bottom:3
                      }}
                    />
                    <Text style={{textAlign: 'center'}}>Like</Text>
                  </View>
                </TouchableOpacity>
              </View>
              {!item.isConnect && item.userid != global.LoginUserId ? (
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() =>
                      this._handleOnInvitePress(
                        item.userid,
                        item.firstName,
                        item.nickName,
                      )
                    }>
                    <View style={{flexDirection: 'row'}}>
                      <Invite
                        style={{color: '#a4a6a9', marginRight: 5, fontSize: 25, bottom:3}}
                      />
                      <Text style={{textAlign: 'center'}}>Connect</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
              {item.userid != global.LoginUserId ? (
                item.isChatBlocked ? (
                  <View
                    style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => this._handleUnBlock(item)}>
                      <View style={{flexDirection: 'row'}}>
                        <Block
                          style={{
                            fontSize: 22,
                            color: '#a4a6a9',
                            marginRight: 5,
                            bottom:3
                          }}
                        />
                        <Text style={{textAlign: 'center'}}>Blocked</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onPress={() => this._handleOnChatPress(item)}>
                      <View style={{flexDirection: 'row'}}>
                        <Chatting
                          style={{
                            color: '#a4a6a9',
                            marginRight: 5,
                            fontSize: 22,
                            bottom:3
                          }}
                        />
                        <Text style={{textAlign: 'center'}}>Chat</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )
              ) : null}
              {item.userid != global.LoginUserId ? (
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => this._handleOnReportPress(item)}>
                    <View style={{flexDirection: 'row'}}>
                      <Report style={{color: '#a4a6a9', fontSize: 23,bottom:3}} />
                      <Text style={{textAlign: 'center'}}>Report Abuse</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
          <View style={{borderColor:"gray", borderWidth:0.9}}/>
        </View>
      );
    } else {
      return null;
    }
  };
  _handleUnBlock = item => {
    const {UnBlock} = this.props;
    UnBlock(item);
  };
  _handleOnInvitePress = (UserId, Name, NickName) => {
    try {
      const {onInvitePress} = this.props;
      onInvitePress(UserId, Name, NickName);
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  _handleOnLikePress = id => {
    try {
      const {onLikePress} = this.props;
      onLikePress(id);
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  _handleOnHastagPress = value => {
    console.log("value",value)
    try {
      const {onHasTagPress} = this.props;
      onHasTagPress(value);
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  _handleOnReportPress = item => {
    try {
      const {onReportPress} = this.props;
      onReportPress(item);
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  _handleOnChatPress = item => {
    try {
      const {onChatPress} = this.props;
      onChatPress(item);
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  renderItemImage = imgData => {
    if (imgData.item.isVideo == true) {
     // console.log("RenderVideo",imgData)
      return (
        <View  style={{
          flex: 1.5,
          flexDirection: 'row',
          height: 200,
         // width: 150,
          alignItems: 'stretch',
        }}>
        <TouchableOpacity
          style={{
            flex: 1.5,
            flexDirection: 'row',
            height: 200,
           // width: 150,
            alignItems: 'stretch',
          }}
          onPress={() =>
            this._handleOpenImageOrVideo(imgData.item.fileName, true)
          }>
          <View
            style={{
              flex: 1.5,
              flexDirection: 'row',
              height: 200,
              width: 150,
              borderRadius: 10,
              overflow:"hidden"
              //alignItems: 'stretch',
            }}>
            {/* <ReactVideo
              paused={this.state.paused}
              source={{
                uri:
                  global.APIURL +
                  'uploadimgs/ShoutOutImages/' +
                  imgData.item.fileName,
              }}
              resizeMode="cover"
              style={StyleSheet.absoluteFill}
              volume={0}
              fullscreenOrientation="all"
            /> */}
              <Video source={{
                  uri:
                    global.APIURL +
                    'uploadimgs/ShoutOutImages/' +
                    imgData.item.fileName,
                }}   // Can be a URL or a local file.
      //  ref={(ref) => {
      //    this.player = ref
      //  }}                                      // Store reference
      // onBuffer={this.onBuffer}                // Callback when remote video is buffering
       onError={(error)=>console.log(error)}               // Callback when video cannot be loaded
       style={StyleSheet.absoluteFill} 
       resizeMode="cover"
       paused
       />
          </View>
        </TouchableOpacity>
        <View style={{position:"absolute", alignSelf:"center",left:130}}>
          <TouchableOpacity onPress={() =>this._handleOpenImageOrVideo(imgData.item.fileName, true)}>
              <Image source={playIcon} style={{height:70, width:70, tintColor:"#fff"}}/>
          </TouchableOpacity>
            </View>
        </View>
      );
    } else {
      return (
        <View>
          <TouchableOpacity
            style={{
              flex: 1.5,
              flexDirection: 'row',
              height: 200,
              width: Dimensions.get('window').width - 10,
            }}
            onPress={() =>
              this._handleOpenImageOrVideo(imgData.item.fileName, false)
            }>
            {/* <Image
              style={styles.image}
              resizeMode="cover"
              source={{
                uri:
                  global.APIURL +
                  'uploadimgs/ShoutOutImages/' +
                  imgData.item.fileName,
              }}
            /> */}
            <FastImage
                  style={styles.image}
                  resizeMode={FastImage.resizeMode.cover}
                  source={{
                    uri:
                      global.APIURL +
                      'uploadimgs/ShoutOutImages/' +
                      imgData.item.fileName,
                  }}
                />
          </TouchableOpacity>
        </View>
      );
    }
  };
  onChangeText = text => {
    const {OnChangeText} = this.props;
    OnChangeText(text);
  };
  render() {
    var obj = [];
    const {
      ShoutOutDetails,
      onDismissPress,
      IsShowDialog,
      onCancelPress,
      onDialogReportPress,
      Report,
      showAlert,
      SuccessText,
      IsNoRecords,
      Id,
    } = this.props;
    if (Id != 0) {
      ShoutOutDetails.forEach(element => {
        if (element.id == Id) {
          obj.push(element);
        }
      });
    }
    return (
      <View style={{flex: 1, backgroundColor: '#f4f6f9'}}>
        {showAlert ? (
          <View style={{marginLeft: 20, marginTop: 10}}>
            <Text style={{color: GilRoyMediumColor.fontColor}}>
              {SuccessText}
            </Text>
          </View>
        ) : null}

        {Id != 0 ? (
          <View>
            <FlatList
              showsVerticalScrollIndicator={true}
              data={obj}
              renderItem={(item) => this.renderItem(item)}
              keyExtractor={item => item.id}
            />
            <TouchableOpacity
              onPress={() => Actions.businessShoutOut({Id: 0, IsAll: true})}>
              <Text
                style={{
                  color: 'blue',
                  textDecorationColor: 'blue',
                  textDecorationLine: 'underline',
                }}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
        ) : IsNoRecords ? (
          <View style={{flex: 0.5, marginLeft: 10}}>
            <Text style={{color: '#000'}}>Search not found</Text>
          </View>
        ) : (
          <View style={{flex: 1}}>
            <FlatList
              showsVerticalScrollIndicator={true}
              data={ShoutOutDetails}
              renderItem={item => this.renderItem(item)}
              keyExtractor={item => item.id}
            />
          </View>
        )}
        <View>
          <Dialog
            style={{marginBottom: 50}}
            onTouchOutside={onDismissPress}
            onHardwareBackPress={onDismissPress}
            onDismiss={onDismissPress}
            width={0.9}
            height={0.3}
            visible={IsShowDialog}
            rounded
            actionsBordered
            dialogTitle={
              <DialogTitle
                titleAlign={'center'}
                style={{borderBottomWidth: 1}}
                title={'Report Abuse'}
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
                  onPress={onCancelPress}
                  key="button-1"
                />
                <DialogButton
                  text={'Report'}
                  style={[styles.DialogButton]}
                  textStyle={styles.DialogButtonText}
                  onPress={onDialogReportPress}
                  key="button-2"
                />
              </DialogFooter>
            }>
            <DialogContent
              style={{
                height: 90,
              }}>
              <TextInput
                style={{
                  flex: 1,
                  borderColor: '#a9a9a9',
                  borderWidth: 1,
                  marginTop: 20,
                  fontSize: 18,
                }}
                underlineColor="transparent"
                placeholder="Enter Comment"
                placeholderTextColor={'#a9a9a9'}
                onChangeText={text => this.onChangeText(text)}
                value={Report}
              />
            </DialogContent>
          </Dialog>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  name: {
    fontSize: 18,
    color: '#ffffff',
    height: 50,
    width: 50,
    borderRadius: 100,
    backgroundColor: CommonStyles.appColor,
    textAlign: 'center',
    paddingTop: 10,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  image: {
    borderRadius: 10,
    flex: 1,
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    flex: 1,
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
    //backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  DialogButton: {
    borderRadius: 20,
    width: 20,
    borderColor: '#fff',
    height: 10,
    margin: 10,
    borderWidth: 1,
    backgroundColor: CommonStyles.appColor,
  },
  DialogButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});