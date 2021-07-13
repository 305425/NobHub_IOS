import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Dimensions
} from 'react-native';
import {Close} from '../shared/Icon';
import {CommonStyles} from '../shared/Constants';
import ReactVideo from 'react-native-video';
//Import React Native Video to play video
import {goBack} from '../Services/BackButtonServices';
import {connect} from 'react-redux';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import crossLogo from '../Images/cross.png';
//Media Controls to control Play/Pause/Seek and full screen

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


class OpenImage extends Component {
  videoPlayer;
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      duration: 0,
      isFullScreen: false,
      isLoading: true,
      paused: false,
      playerState: PLAYER_STATES.PLAYING,
      screenType: 'content',
    };
  }
  _handleHeaderLeftIconPress = () => {
    const {handleGoBack} = this.props;
    handleGoBack();
  };
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

  onLoadStart = data => this.setState({isLoading: true});

  onEnd = () => this.setState({playerState: PLAYER_STATES.ENDED});

  onError = error => alert('Oh! ', error);

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
  onSeeking = currentTime => this.setState({currentTime});

  render() {
    const {FileName, IsVideo, IsFromPost} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: '#f4f6f9'}}>
        {/* <View
          style={{
            flexDirection: 'row',
            flex: 0.1,
            justifyContent: 'flex-end',
            top: Platform.OS == 'android' ? 50 : 40,
          }}>
            <View style={{position:"absolute"}}>
          <TouchableOpacity onPress={() => this._handleHeaderLeftIconPress()}>
            <Image source={crossLogo} style={{ height:30, width:30}} />
          </TouchableOpacity>
          </View>
        </View> */}
        <View style={styles.container}>
          {IsVideo ? (
            <View style={{flex: 1, top:40}}>
              <ReactVideo
                onEnd={this.onEnd}
                onLoad={this.onLoad}
                onLoadStart={this.onLoadStart}
                onProgress={this.onProgress}
                paused={this.state.paused}
                resizeMode={this.state.screenType}
                ref={videoPlayer => (this.videoPlayer = videoPlayer)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                }}
                source={
                  IsFromPost
                    ? {uri: FileName}
                    : {
                        uri:
                          global.APIURL +
                          'uploadimgs/ShoutOutImages/' +
                          FileName,
                      }
                }
                volume={10}
              />
              <MediaControls
                duration={this.state.duration}
                isLoading={this.state.isLoading}
                mainColor="#333"
                onFullScreen={this.onFullScreen}
                onPaused={this.onPaused}
                onReplay={this.onReplay}
                onSeek={this.onSeek}
                onSeeking={this.onSeeking}
                playerState={this.state.playerState}
                progress={this.state.currentTime}
              />
            </View>
          ) : (
            <Image
              style={styles.image}
              resizeMode="stretch"
              source={{
                uri: global.APIURL + 'uploadimgs/ShoutOutImages/' + FileName,
              }}
            />
          )}
        </View>
        <View style={{position:"absolute",alignSelf:"flex-end", top:60}}>
         <TouchableOpacity
            onPress={() => this._handleHeaderLeftIconPress()}>
            {/* <Closecircle /> */}
            <Image source={crossLogo} style={{ height:40, width:40}} />
          </TouchableOpacity>
         </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconColor: {
    color: CommonStyles.appColor,
    fontSize: 20,
  },
  image: {
   // borderRadius: 10,
   width :windowWidth,
   height:windowHeight/1.2,
   top:80,
   // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow:"hidden",
  },
});
const mapDispatchToProps = {
  handleGoBack: goBack,
};
export default connect(
  null,
  mapDispatchToProps,
)(OpenImage);
