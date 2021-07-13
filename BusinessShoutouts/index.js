import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Keyboard,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import CommonHeader from '../shared/CommonHeader';
import {BoldText} from '../shared/Text';
import {CommonStyles, LightGrayColor} from '../shared/Constants';
import {Search, Settings, Cancel, ShoutOut} from '../shared/Icon';
import {goBack} from '../Services/BackButtonServices';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import ViewShoutOut from './ViewShoutOut';
import Footer from '../shared/Footer';
import {
  setMyConnectionDetails,
  clearMyConnectionDetails,
} from '../state/operations';
import {AlertClass} from '../shared/CustomAlert';
import ServiceCalls from '../Services/APICalls';
class ShoutOutContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ShoutOutDetails: [],
      IsCancel: false,
      SearchValue: '',
      tempShoutoutDetails: [],
      abuseReport: '',
      IsShowDialog: false,
      ShoutoutId: 0,
      ShoutoutPostUserId: 0,
      showAlert: false,
      SuccessText: '',
      IsNoRecords: false,
      SureWantToDelete: false,
      BlockedChannelId: 0,
      BlockedUserId: 0,
      SelectedItem:{}
    };
    global.BusinessShoutout = this;
  }
  _handleHeaderLeftIcon = () => {
    return (
      <View>
        <View style={styles.leftHeader}>
          <ShoutOut style={{color: CommonStyles.appColor, fontSize: 25}} />
          {/* <EditCard style={{color: CommonStyles.appColor, fontSize: 20}} /> */}
        </View>
        <Text style={{color: '#ffffff', fontSize: 10, textAlign: 'center'}}>
          Create
        </Text>
      </View>
    );
  };
  _handleHeaderRightIcon = () => {
    return (
      <View>
        <View style={styles.leftHeader}>
          <Settings style={{color: CommonStyles.appColor, fontSize: 30}} />
        </View>
        <Text style={{color: '#ffffff', textAlign: 'center', fontSize: 10}}>
          Manage
        </Text>
      </View>
    );
  };
  _handleHeaderCenterIcon = () => {
    return (
      <View style={styles.headerCenterView}>
        <View style={{flex: 0.2, paddingTop: 10, paddingLeft: 10}}>
          <Search style={styles.iconSearch} />
        </View>
        <View style={{flex: 1}}>
          <TextInput
            underlineColor="transparent"
            placeholder="Title/#Tag"
            placeholderTextColor="#a4a6a9"
            style={{flex: 2}}
            onChangeText={value => this.onShoutOutDetailsSearch(value)}
            onFocus={() => this._handleOnFocus()}
            value={this.state.SearchValue}
            onKeyPress={({nativeEvent}) => {
              this._handleOnkeyPress(nativeEvent);
              //nativeEvent.key === 'Backspace' ? Keyboard.dismiss() : '';
            }}
          />
        </View>
        <View style={styles.viewScanner}>
          {this.state.IsCancel ? (
            <View style={{flex: 0.8,paddingLeft: 25}}>
              <TouchableOpacity onPress={() => this._handleClearPress()}>
                <Cancel style={[styles.iconSearch]} />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    );
  };
  _handleOnkeyPress = Element => {
    if (Element.key === 'Backspace') {
      if (this.state.SearchValue.length == 0) {
        Keyboard.dismiss();
      }
    }
  };
  _handleOnFocus = () => {
    this.setState({IsCancel: true});
  };
  _handleClearPress = () => {
    this.onShoutOutDetailsSearch('');
    Keyboard.dismiss();
    this.setState({
      SearchValue: '',
      IsCancel: false,
    });
  };
  onShoutOutDetailsSearch = value => {
    this.setState({SearchValue: value, IsCancel: true});
    value = value.trim().toLowerCase();
    var ShoutOuts = [];
    ShoutOuts = this.state.tempShoutoutDetails.filter(users => {
      if (
        users.shoutoutTitle != null &&
        users.shoutoutTitle.toLowerCase().match(value)
      ) {
        return true;
      }
      if (users.hashTag != null && users.hashTag.toLowerCase().match(value)) {
        return true;
      }
      if (users.text != null && users.text.toLowerCase().includes(value)) {
        return true;
      }
    });
    if (ShoutOuts.length === 0) {
      this.setState({IsNoRecords: true});
    } else {
      this.setState({IsNoRecords: false});
    }
    if (value === '') {
      this.setState({IsCancel: false, IsNoRecords: false});
    }
    this.setState({ShoutOutDetails: ShoutOuts});
  };
  _handleHeaderText = () => {
    return (
      <View>
        <BoldText style={{color: '#ffffff', fontSize: 16}}>
          Business Shoutout
        </BoldText>
      </View>
    );
  };
  _handleHeaderRightIconPress = () => {
    const {userProfile} = this.props;
    Actions.manageShoutout({userProfile: userProfile});
  };
  _handleHeaderLeftIconPress = () => {
    //const {handleGoBack} = this.props;
    //handleGoBack();
    const {userProfile} = this.props;
   // console.log("ShoutoutProfile",userProfile)
    if (userProfile != null) {
      if (!userProfile.isshoutoutdisabled) {
        Actions.postShoutOut({
          ShoutOutDetails: this.state.ShoutOutDetails,
          userProfile: userProfile,
        });
      } else {
        this.setState({
          showAlert: true,
         // SuccessText: 'Shoutout post was disable.Please contact admin once',
         SuccessText: 'Admin blocked you. Please contact admin',
        });
        setTimeout(() => {
          this.setState({
            SuccessText: '',
            showAlert: false,
          });
        }, 10000);
      }
    }
  };
  _handleGetShoutoutDetails = () => {
    try {
      const data = {UserId: global.LoginUserId};
      fetch(
        global.APIURL +
          `api/Card/GetShoutOutBusinessDetails?LoginUserId=${data.UserId}`,
        {
          method: 'GET',
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            ShoutOutDetails: responseJson,
            tempShoutoutDetails: responseJson,
          });
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  componentDidMount = () => {
    try {
      var userPrfoiles = global.MyConnections.props.userProfile;
      if (userPrfoiles != null) {
        userPrfoiles.hasnewshoutout = false;
        global.MyConnections.props.setUserProfile(userPrfoiles);
      }
      this._handleGetShoutoutDetails();
    } catch (e) {
      Alert.alert(e.message);
    }
    global.footer.setState({hasnewshoutout: false});
    this._handleGetShoutoutDetails();
  };
  _handleOnLikePress = id => {
    try {
      var dataToSend = {Id: id, Userid: global.LoginUserId};
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/SaveShoutOutLike', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(() => {
          this._handleGetShoutoutDetails();
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  _handleOnInvitePress = (UserID, Name, NickName) => {
    var Ids = '';
    if (UserID != 0) {
      Ids = UserID;
    }
    try {
      var dataToSend = {
        Refid: global.LoginUserId,
        UserIds: Ids,
        body: global.LoginUserName + 'sent you invitation',
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/sendNearbyInvite', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(() => {
          this.setState({
            showAlert: true,
            SuccessText: 'Invitation sent successfully to ' + Name,
          });
          setTimeout(() => {
            this.setState({
              SuccessText: '',
              showAlert: false,
            });
          }, 5000);
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  ConfirmUnBlock = () => {
    let item = this.state.SelectedItem;
    try {
      ServiceCalls.BlockORUnBlock(
        this.state.BlockedChannelId,
        this.state.BlockedUserId,
      )
        .then(response => {
          // this.state.NobHubUsers.forEach(element => {
          //   if (element.userid == this.state.BlockedUserId) {
          //     element.isChatblocked = false;
          //   }
          // });
          // this.setState({NobHubUsers: this.state.NobHubUsers});
          global.ConnectionsTabColor = LightGrayColor.fontColor;
          global.ChatTabColor = CommonStyles.appColor;
          global.MeetingsTabColor = LightGrayColor.fontColor;
          global.NotificationsTabColor = LightGrayColor.fontColor;
          global.ShoutoutTabColor = '#000';
          global.ShoutoutBgColor = ['#D3D3D3', '#D3D3D3'];
          global.Active = 'rgba(211, 211, 211, .2)';
          Actions.chattingUI({
            TouserId: item.userid,
            FromUserId: global.LoginUserId,
            GrpORConatctName: item.firstName + " " + item.lastName,
            Img: item.profilePicture,
            ChannelId: 0,
            initials: item.initials,
          });
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  UnBlock = item => {
    this.setState({
      SureWantToDelete: true,
      BlockedChannelId: item.channelId,
      BlockedUserId: item.userid,
      SelectedItem: item
    });
  };
  _handleOnReportPress = item => {
    if (item.userid != global.LoginUserId) {
      this.setState({
        IsShowDialog: true,
        ShoutoutId: item.id,
        ShoutoutPostUserId: item.userid,
      });
    }
  };
  _handleOnChatPress = item => {
    try {
      if (item.userid != global.LoginUserId) {
        global.ConnectionsTabColor = LightGrayColor.fontColor;
        global.ChatTabColor = CommonStyles.appColor;
        global.MeetingsTabColor = LightGrayColor.fontColor;
        global.NotificationsTabColor = LightGrayColor.fontColor;
        global.ShoutoutTabColor = '#000';
        global.ShoutoutBgColor = ['#D3D3D3', '#D3D3D3'];
        global.Active = 'rgba(211, 211, 211, .2)';
        Actions.chattingUI({
          TouserId: item.userid,
          GrpORConatctName: item.firstName + ' ' + item.lastName,
          Img: item.profilePicture,
          ChannelId: 0,
          initials: item.initials,
          isBlocked: false,
          IsFavoriteContact: false,
        });
      }
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  _handleOnChangeText = text => {
    this.setState({abuseReport: text});
  };
  _handleOnDialogCancelPress = () => {
    this.setState({IsShowDialog: false});
  };
  _handleOnDialogReportPress = () => {
    this.setState({IsShowDialog: false});
    try {
      var dataToSend = {
        Id: this.state.ShoutoutId,
        Userid: global.LoginUserId,
        Text: this.state.abuseReport,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/SaveShoutOutAbuseReport', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(() => {
          this.setState({
            showAlert: true,
            SuccessText: 'your report is submitted to admin successfully',
          });
          setTimeout(() => {
            this.setState({
              SuccessText: '',
              showAlert: false,
            });
          }, 5000);
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  _handleHeaderProfileIcon = () => {
    return null;
  };
  render() {
    const {Id, IsAll} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: '#f4f6f9'}}>
        <View style={{flex: 0.18}}>
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
        <View style={{flex: 1}}>
          {/* {this.state.ShoutOutDetails.length > 0 ? ( */}
          <ViewShoutOut
            ShoutOutDetails={this.state.ShoutOutDetails}
            onLikePress={id => this._handleOnLikePress(id)}
            onHasTagPress={value => this.onShoutOutDetailsSearch(value)}
            onReportPress={item => this._handleOnReportPress(item)}
            onChatPress={item => this._handleOnChatPress(item)}
            onDialogReportPress={this._handleOnDialogReportPress}
            onDismissPress={this._handleOnDialogCancelPress}
            onCancelPress={this._handleOnDialogCancelPress}
            Report={this.state.abuseReport}
            OnChangeText={text => this._handleOnChangeText(text)}
            IsShowDialog={this.state.IsShowDialog}
            showAlert={this.state.showAlert}
            SuccessText={this.state.SuccessText}
            onInvitePress={(UserId, Name, NickName) =>
              this._handleOnInvitePress(UserId, Name, NickName)
            }
            IsNoRecords={this.state.IsNoRecords}
            UnBlock={item => this.UnBlock(item)}
            Id={Id}
            IsAll={IsAll}
          />
          {/* ) : ( */}
          {/* <View style={{flex: 0.5, marginLeft: 10}}>
              <Text style={{color: '#000'}}>Search not found</Text>
            </View>
          )} */}
        </View>
        <View style={{flex: 0.13}}>
          <Footer />
        </View>
        <View>
          <AlertClass
            AlertMessage={'Are you sure you want to unblock'}
            OkButtonText={'OK'}
            CancelButtonText={'Cancel'}
            showAlert={this.state.SureWantToDelete}
            onOkPress={() => {
              this.ConfirmUnBlock();
              this.setState({SureWantToDelete: false});
              this.setState({
                showAlert: true,
                // DisplayText: 'Deleted successfully',
              });
              setTimeout(() => {
                this.setState({
                  DisplayText: '',
                  showAlert: false,
                });
              }, 10000);
            }}
            onAlertClose={() => {
              this.setState({SureWantToDelete: false});
            }}
          />
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    userProfile: state.user.userProfile,
  };
};
const mapDispatchToProps = {
  setMyConnectionDetails,
  clearMyConnectionDetails,
  handleGoBack: goBack,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShoutOutContainer);
const styles = StyleSheet.create({
  TextInputStyleClass: {
    flex: 2,
    //height: 20,
    //paddingRight: 90,
  },
  iconSearch: {flex: 1, fontSize: 17, color: '#a4a6a9'},
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
  viewScanner: {
    flex: 0.5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 7,
    right: Platform.OS == 'android' ? 10 : 20,
    //marginRight: 10,
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
  headerCenterView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: Dimensions.get('window').width * 0.56,
    top:5
  },
});
