import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import Groupchatoptionmenu from '../Custom/groupchatoptionmenu';
import image from '../Images';
import { Thumbnail } from 'native-base';
import { CommonStyles } from '../shared/Constants';
import { styles } from './Listcommonstyles';
import {
  Alert,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import CommonHeader from '../shared/CommonHeader';
import { connect } from 'react-redux';
import { goBack } from '../Services/BackButtonServices';
import { Actions } from 'react-native-router-flux';
import ServiceCalls from '../Services/APICalls';
import { ArrowLeft, SendIcon, Camera, FavStar, Addpeople } from '../shared/Icon';
import { throwStatement } from '@babel/types';
class selectedphotos extends Component {
  constructor(props) {
    super(props);
    global.GlobalchannelId = 0;
  }
  componentDidMount() { }
  _handleHeaderLeftIcon = () => {
    return (
      <View style={styles.arrowBgstyle}>
        <ArrowLeft style={{ color: '#27BECF', fontSize: 20 }} />
      </View>
    );
  };

  _handleHeaderLeftIconPress = () => {
    const { handleGoBack } = this.props;
    handleGoBack();
    if (global.ChattingUI != undefined && global.ChattingUI != null) {
      global.ChattingUI.setState({ Images: [] });
    }
    if (global.groupChattingUI != undefined && global.groupChattingUI != null) {
      global.groupChattingUI.setState({ Images: [] });
    }
  };

  centerMiddileView() {
    const { GrpORConatctName, Img } = this.props;
    return (
      <TouchableOpacity onPress={() => this.GetGrpMembersList()}>
        <View style={{ flexDirection: 'row' }}>
          {Img !== '' && Img !== null ? (
            <Thumbnail
              medium
              source={{
                uri: global.APIURL + 'uploadimgs/UploadGroupPhotos/' + Img,
              }}
            />
          ) : (
            <Thumbnail medium source={image.defaultImage} />
          )}

          <Text style={{ fontSize: 20, alignSelf: 'center' }}>
            {GrpORConatctName.length > 16
              ? GrpORConatctName.substring(0, 16) + '...'
              : GrpORConatctName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  renderImage = () => {
    if (
      global.ChattingUI != undefined &&
      global.ChattingUI != null &&
      global.ChattingUI.state.Images.length !== 0
    ) {
      return global.ChattingUI.state.Images.map(item => {
        return (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Image style={styles.chatimage} source={{ uri: item.URL.uri }} />
            {/* <Image source={{ uri: "https://findicons.com/files/icons/1579/devine/256/file.png" }} style={{ height: 300, width: 250,marginLeft:70,alignSelf:"center",overflow: "hidden", tintColor: CommonStyles.appColor }} /> */}
          </View>
        );
      });
    } else if (
      global.groupChattingUI != undefined &&
      global.groupChattingUI != null &&
      global.groupChattingUI.state.Images.length !== 0
    ) {
      return global.groupChattingUI.state.Images.map(item => {
        return (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Image style={styles.chatimage} source={{ uri: item.URL.uri }} />
            {/* <Image source={{ uri: "https://findicons.com/files/icons/1579/devine/256/file.png" }} style={{ height: 300, width: 250,marginLeft:70,alignSelf:"center",overflow: "hidden", tintColor: CommonStyles.appColor }} /> */}
          </View>
        );
      });
    }
    return null;
  };
  savemsg() {
    const { ISComingFrom } = this.props;
    try {
      if (ISComingFrom == 'SingleChat') {
        global.ChattingUI.SaveMessage(2).then(response => {
          this._handleHeaderLeftIconPress();
        });
      }
      else if (ISComingFrom == 'SingleChatWithDoc') {
        global.ChattingUI.SaveMessage(10).then(response => {
          this._handleHeaderLeftIconPress();
        });
      }
      else {
        global.groupChattingUI.SaveMessage(2).then(response => {
          this._handleHeaderLeftIconPress();
        });
      }
    } catch (error) { }
  }
  render() {
    const { HasLeft, ISComingFrom } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.2 }}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => {
              return null;
            }}
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
        {!(ISComingFrom == 'SingleChatWithDoc' ) && !(ISComingFrom == 'GroupChatWithDoc' ) ?
          (<View style={styles.RenderImage}>{this.renderImage()}</View>) : (<View style={styles.RenderImage}>
            <Image source={{ uri: "https://findicons.com/files/icons/1579/devine/256/file.png" }} style={styles.imageStyle} />
          </View>)
        }
       
        {!HasLeft ? (
          <View
            style={{ flex: 0.1, borderTopColor: 'lightgray', borderTopWidth: 1 }}>
            <TouchableOpacity
              onPress={() => {
                this.savemsg();
              }}>
              <SendIcon
                style={{ color: CommonStyles.appColor, alignSelf: 'flex-end' }}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <SendIcon style={{ color: 'gray', alignSelf: 'flex-end' }} />
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
)(selectedphotos);