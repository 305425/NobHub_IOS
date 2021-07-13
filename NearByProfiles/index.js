import React, { Component } from 'react';
import {
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  Keyboard,
  FlatList,
  Image,
  BackHandler,
  ImageBackground, Linking
} from 'react-native';
import { AlertClass } from '../shared/CustomAlert';
import Updatenearbystatus from '../Services/UpdateNearbystatus';
import CommonHeader from '../shared/CommonHeader';
import { Actions } from 'react-native-router-flux';
import { Cancel, Map, Search, PlusCircle, ToolTip, Message } from '../shared/Icon';
import { CommonStyles } from '../shared/Constants';
import { MediumBoldText, Text, BoldText } from '../shared/Text';
import { styles } from './index.styles';
import Footer from '../shared/Footer';
import { goBack } from '../Services/BackButtonServices';
import { connect } from 'react-redux';
import Tooltip from 'react-native-walkthrough-tooltip';
import ServiceCalls from '../Services/APICalls';
import Hyperlink from 'react-native-hyperlink';
import Mailer from 'react-native-mail';
const colors = [
  '#27BECF', '#994F14', '#3bc91e', '#5c2518', '#4255cf', '#a0a33e', '#a0a33e', '#DA291C', '#FFCD00', '#007A33', '#EB9CA8', '#7C878E',
  '#8A004F', '#000000', '#10069F', '#00a3e0', '#4CC1A1'
]

class NearByContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CurrentLati: 0,
      CurrentLong: 0,
      NearByProfiles: [],
      SearchValue: '',
      TextInputPlaceHolder: 'Company/location',
      showAlert: false,
      InvitationName: '',
      IsNoRecords: false,
      tempNearByProfiles: [],
      toolTipVisible: false,
      InvitationText: 'You are sending invitation to ',
      displayText: '',
      surewantToDelete: false,
      BlockedChannelId: 0,
      BlockedUserId: 0,
      SelectedItem: {},
    };
    BackHandler.addEventListener('hardwareBackPress', this.back_Button_Press);
    global.NearByContainer = this;
  }
  back_Button_Press = () => {
    global.MyConnections._handleMyContactSearch('');
    global.MyConnections.setState({
      InviteTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      NearByTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      InviteIconColor: '#b3b3b3',
      NearByIconColor: '#b3b3b3',
      TextInputPlaceHolder: 'Name/Phone Number',
      IsScan: true,
      IsCancel: false,
    });
  };
  componentDidMount = () => {
    try {
      fetch('http://www.geoplugin.net/json.gp')
        .then(response => response.json())
        .then(() => {
          this.setState({ CurrentLong: global.currentLatitude });
          this.setState({ CurrentLati: global.currentLongitude });
          global.IsNearBy = true;
          if (global.IsNearBy) {
            console.log("global.IsNearBy", global.IsNearBy)
            Updatenearbystatus.updateNearbyStatus(
              global.IsNearBy,
              global.currentLongitude,
              global.currentLatitude,
            );
          }
          this.GetNearbyProfiles(
            global.currentLongitude,
            global.currentLatitude,
          );
        });
    } catch (e) {
      Alert.alert(e);
    }
  };
  GetNearbyProfiles(long, lat) {
    var dataToSend = {
      UserId: global.LoginUserId,
      newLat: lat,
      newLang: long,
      Dist_Unit: 'M',
    };
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    fetch(global.APIURL + 'api/Card/GetNearByProfiles', {
      method: 'POST', //Request Type
      body: formBody, //post body
      headers: {
        //Header Defination
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          NearByProfiles: responseJson,
          tempNearByProfiles: responseJson,
        });
      });
  }
  UnBlock = item => {
    this.setState({
      surewantToDelete: true,
      BlockedChannelId: item.channelid,
      BlockedUserId: item.userid,
      SelectedItem: item
    });
  };
  ConfirmUnBlock = () => {
    let item = this.state.SelectedItem;
    try {
      ServiceCalls.BlockORUnBlock(
        this.state.BlockedChannelId,
        this.state.BlockedUserId,
      )
        .then(() => {
          this.state.NearByProfiles.forEach(element => {
            if (element.userid == this.state.BlockedUserId) {
              element.isChatblocked = false;
            }
          });
          this.setState({ NearByProfiles: this.state.NearByProfiles });
          Actions.chattingUI({
            TouserId: this.state.blockUserId,
            GrpORConatctName: item.fullName,
            Img: item.image,
            ChannelId: this.state.BlockedChannelId,
            initials: item.initials,
            isBlocked: item.isChatblocked,
            IsFavoriteContact: item.isChatfavorite
          });
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  _handleHeaderLeftIcon = () => {
    // const {userProfile} = this.props;
    // if (userProfile.image !== '' && userProfile.image !== null) {
    //   return (
    //     <View style={{flexDirection: 'row'}}>
    //       <Thumbnail
    //         style={{
    //           backgroundColor: '#ffffff',
    //           height: 38,
    //           width: 38,
    //           borderRadius: 80,
    //         }}
    //         small
    //         source={{
    //           uri:
    //             global.APIURL +
    //             'uploadimgs/ProfilePictures/' +
    //             userProfile.image,
    //         }}
    //       />
    //       <View style={{top: -10, right: 0}}>
    //         <OnLine style={{color: 'green', fontSize: 20}} />
    //       </View>
    //     </View>
    //   );
    // } else {
    //   return (
    //     <View style={{flexDirection: 'row'}}>
    //       <View style={styles.leftHeader}>
    //         <Person style={{color: CommonStyles.appColor}} />
    //       </View>
    //       <View style={{top: -10, right: 0}}>
    //         <OnLine style={{color: 'green', fontSize: 20}} />
    //       </View>
    //     </View>
    //   );
    // }
    return null;
  };
  _handleHeaderRightIcon = () => {
    const { userProfile } = this.props;
    return (
      <View>
        <View style={styles.leftHeader}>
          <TouchableOpacity
            onPress={() =>
              Actions.mapView({
                userProfile: userProfile,
                NearProfiles: this.state.NearByProfiles,
                Latitude: parseFloat(this.state.CurrentLati),
                Longitude: parseFloat(this.state.CurrentLong),
              })
            }>
            <Map style={{ color: CommonStyles.appColor, fontSize: 22 }} />
          </TouchableOpacity>
        </View>
        <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 10 }}>
          MapView
        </Text>
      </View>
    );
  };
  _handleHeaderCenterIcon = () => {
    return (
      <View style={styles.headerCenterView}>
        <View
          style={{
            flex: 0.5,
            paddingTop: 10,
            marginLeft: 8,
            flexDirection: 'row',
            justifyContent: "space-around"
          }}>
          <TouchableOpacity
            onPress={() =>
              this.setState({ toolTipVisible: !this.state.toolTipVisible })
            }>
            <ToolTip style={styles.toolScanner} />
          </TouchableOpacity>
          <Search style={styles.iconSearch} />
        </View>
        <View style={{ flex: 1.5 }}>
          <TextInput
            underlineColor="transparent"
            placeholder={this.state.TextInputPlaceHolder}
            placeholderTextColor={'#a9a9a9'}
            style={styles.TextInputStyleClass}
            onChangeText={value => this.onMyContactSearch(value)}
            onFocus={() => this._handleOnTextInputFocus()}
            value={this.state.SearchValue}
            onKeyPress={({ nativeEvent }) => {
              this._handleOnkeyPress(nativeEvent);
              //nativeEvent.key === 'Backspace' ? Keyboard.dismiss() : '';
            }}
          />
        </View>
        <View style={styles.viewScanner}>
          {this.state.IsCancel ? (
            <View style={{ flex: 0.8 }}>
              <TouchableOpacity onPress={() => this._handleClearPress()}>
                <Cancel style={styles.icnScanner} />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        <Tooltip
          animated={true}
          //(Optional) When true, tooltip will animate in/out when showing/hiding
          arrowSize={{ width: 16, height: 8 }}
          //(Optional) Dimensions of arrow bubble pointing to the highlighted element
          backgroundColor="rgba(0,0,0,0.5)"
          //(Optional) Color of the fullscreen background beneath the tooltip.
          isVisible={this.state.toolTipVisible}
          //(Must) When true, tooltip is displayed
          content={<Text>Search by name/Company/Location/Title/Industry</Text>}
          //(Must) This is the view displayed in the tooltip
          placement="top"
          //(Must) top, bottom, left, right, auto.
          onClose={() => this.setState({ toolTipVisible: false })}
        //(Optional) Callback fired when the user taps the tooltip
        />
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
  _handleClearPress = () => {
    this.onMyContactSearch('');
    Keyboard.dismiss();
    this.setState({
      SearchValue: '',
      IsCancel: false,
      TextInputPlaceHolder: 'Company/location',
    });
  };
  _handleOnTextInputFocus = () => {
    this.setState({
      IsCancel: true,
      TextInputPlaceHolder: 'Company/location',
    });
  };
  onMyContactSearch = value => {
    var searchItems = value
      .trim()
      .toLowerCase()
      .split(' ');
    this.setState({ SearchValue: value, IsCancel: true });
    value = value.trim().toLowerCase();
    var myNearByUsers = [];
    console.log("Data to search", this.state.tempNearByProfiles)
    myNearByUsers = this.state.tempNearByProfiles.filter(contact => {
      let searchLocation = contact.userAddress ? contact.userAddress.toLowerCase().split(" ") : '';
      let newSearchLocation = contact.userAddress != null ? (searchLocation.map(x => /[,\-]/.test(x) === true) ? searchLocation.map(x => x.replace(/,/g, '')) : searchLocation.map(x => x)) : null
      if (
        searchItems.filter(
          x =>
            (contact.name != null && contact.name.toLowerCase().indexOf(x) === 0) ||
            (contact.lastName != null && contact.lastName.toLowerCase().indexOf(x) === 0) ||
            (contact.mobile != null && contact.mobile.toLowerCase().indexOf(x) === 0) ||
            (contact.companyname != null && contact.companyname.toLowerCase().indexOf(x) === 0) ||
            (contact.title != null && contact.title.toLowerCase().indexOf(x) === 0) ||
            (contact.userAddress != null && newSearchLocation.filter(item => {
              const textData = x.toLowerCase()
              if (item.toLowerCase().indexOf(textData) === 0) {
                return item
              }
            }).indexOf(x) === 0) ||
            // (contact.userAddress != null && contact.userAddress.toLowerCase().indexOf(x) === 0) ||
            (contact.title != null && contact.title.toLowerCase().indexOf(x) === 0) ||
            (contact.caddress != null && contact.caddress.toLowerCase().indexOf(x) === 0) ||
            (contact.paddress != null && contact.paddress.toLowerCase().indexOf(x) === 0) ||
            (contact.profession != null && contact.profession.toLowerCase().indexOf(x) === 0),
        ).length > 0
      ) {
        return true;
      }
    });
    if (myNearByUsers.length === 0) {
      this.setState({ IsNoRecords: true });
    } else {
      this.setState({ IsNoRecords: false });
    }
    this.setState({ NearByProfiles: myNearByUsers });
    if (value === '') {
      this.setState({ IsCancel: false });
    }
  };

  _handleHeaderLeftIconPress = () => {
    const { handleGoBack } = this.props;
    handleGoBack();
  };
  _handleHeaderRightIconPress = () => {
    const { userProfile } = this.props;
    Actions.mapView({
      userProfile: userProfile,
      NearProfiles: this.state.NearByProfiles,
      currentLongitude: global.currentLongitude,
      currentLatitude: global.currentLatitude,
    });
  };
  _handleHeaderText = () => {
    return (
      <View>
        <BoldText style={{ color: '#ffffff', textAlign: 'center', fontSize: 15, bottom: 4 }}>
          Nearby
        </BoldText>
      </View>
    );
  };
  itemView = (item) => {
    console.log("SelectedItem", item)
  }
  emailPress = (item) => {
    // Communications.email('support@nobhub.com',null,null, null, null);
    Mailer.mail({
      // subject: 'need help',
      recipients: [JSON.stringify(item.cemail)],
    }, (error, event) => {
      Alert.alert(
        error,
        event,
        [
          { text: 'Ok', onPress: () => console.log('OK: Email Error Response') },
          { text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response') }
        ],
        { cancelable: true }
      )
    });
  }
  renderDisplayNearByProfiles = (item, index) => {
    if (item) {
      // if (item.distance <= 100) {
      return (
        <View style={styles.cardsWrapper}
          onPress={() => this.itemView(item)}
        //onLongPress={() => this.IsShowTabs(item)}
        >
          <View style={styles.card}>
            <View style={styles.cardImgWrapper}>
              <View>
                {item.image != '' && item.image != null ?
                  item.profielCoverImage != '' && item.profielCoverImage != null ? (
                    <ImageBackground
                      source={{
                        uri:
                          global.APIURL +
                          'uploadimgs/ProfilePictures/' +
                          item.profielCoverImage,
                      }}
                      resizeMode="cover"
                      style={styles.cardImg}
                    >
                      <View style={styles.touchableMessage}>
                        {item.isChatblocked ? (
                          <TouchableOpacity onPress={() => this.UnBlock(item)}>
                            <Message style={styles.iconMessage} />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity onPress={() => this.Messageclick(item)}>
                            <Message style={styles.iconMessage} />
                          </TouchableOpacity>
                        )}
                      </View>

                      <Image
                        source={{
                          uri:
                            global.APIURL +
                            'uploadimgs/ProfilePictures/' +
                            item.image,
                        }}
                        style={styles.fab}
                      />
                      <View style={styles.touchablePlus}>
                        <TouchableOpacity onPress={() => this.InviteFriends(item)}>
                          <PlusCircle style={styles.iconClose} />
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                  ) : (
                    <View
                      style={{
                        height: '100%',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        borderBottomLeftRadius: 8,
                        borderTopLeftRadius: 8,
                        backgroundColor: colors[index % colors.length]
                      }}
                    >
                      <View style={styles.touchableMessage}>
                        {item.isChatblocked ? (
                          <TouchableOpacity onPress={() => this.UnBlock(item)}>
                            <Message style={styles.iconMessage} />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity onPress={() => this.Messageclick(item)}>
                            <Message style={styles.iconMessage} />
                          </TouchableOpacity>
                        )}
                      </View>

                      <Image
                        source={{
                          uri:
                            global.APIURL +
                            'uploadimgs/ProfilePictures/' +
                            item.image,
                        }}
                        style={styles.fab}
                      />
                      <View style={styles.touchablePlus}>
                        <TouchableOpacity onPress={() => this.InviteFriends(item)}>
                          <PlusCircle style={styles.iconClose} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        height: '100%',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        borderBottomLeftRadius: 8,
                        borderTopLeftRadius: 8,
                        backgroundColor: colors[index % colors.length]
                      }}
                    >
                      <View style={styles.touchableMessage}>
                        {item.isChatblocked ? (
                          <TouchableOpacity onPress={() => this.UnBlock(item)}>
                            <Message style={styles.iconMessage} />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity onPress={() => this.Messageclick(item)}>
                            <Message style={styles.iconMessage} />
                          </TouchableOpacity>
                        )}
                      </View>

                      <Image
                        source={require('../Images/ProfileIcon.png')}
                        style={styles.fab}
                      />
                      <View style={styles.touchablePlus}>
                        <TouchableOpacity onPress={() => this.InviteFriends(item)}>
                          <PlusCircle style={styles.iconClose} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
              </View>
              {/* <View style={styles.Ibutton}>
                <TouchableOpacity onPress={() => this.InviteFriends(item)}>
                  <PlusCircle style={styles.iconClose} />
                </TouchableOpacity>
              </View> */}
            </View>

            <View style={styles.cardInfo}>
              <MediumBoldText style={styles.cardTitle}>
                {item.name + ' ' + item.lastName}
              </MediumBoldText>
              <Text style={styles.cardDetails}>
                {item.title}
              </Text>
              <Text style={styles.cardDetails}>
                {item.companyname}
              </Text>
              <Hyperlink linkDefault={true} linkStyle={{ color: '#2980b9', fontSize: 13 }}>
                <MediumBoldText style={{ fontSize: 13, color: 'black' }}>
                  {item.story}
                </MediumBoldText>
              </Hyperlink>
              <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-end", flexDirection: "row", bottom: 70, right: 0, position: "absolute" }}>
                <TouchableOpacity onPress={() => this.emailPress(item)}>
                  <Image
                    source={require('../Images/Email.png')}
                    style={{ height: 30, width: 30 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ paddingHorizontal: 5 }}
                  onPress={() => { }}>
                  <Image
                    source={require('../Images/Tick.png')}
                    style={{ height: 25, width: 25 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* <View style={styles.nameTitleView}>
              <MediumBoldText style={styles.buttonText}>
                {item.name + ' ' + item.lastName}
              </MediumBoldText>
              <Text
                style={[styles.buttonText, { fontSize: 15, color: '#777777' }]}>
                {item.title}
              </Text>
            </View> */}
            {/* <View style={styles.touchableMessage}>
              <TouchableOpacity onPress={() => this.Messageclick(item)}>
                <Text style={[styles.buttonText, {color: '#ffffff'}]}>
                  Message
                </Text>
              </TouchableOpacity>
            </View> */}
            {/* <View style={styles.touchableMessage}>
              {item.isChatblocked ? (
                <TouchableOpacity onPress={() => this.UnBlock(item)}>
                  <Text style={[styles.buttonText, { color: '#ffffff' }]}>
                    Blocked
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => this.Messageclick(item)}>
                  <Text style={[styles.buttonText, { color: '#ffffff' }]}>
                    Message
                  </Text>
                </TouchableOpacity>
              )}
            </View> */}
          </View>
        </View>

      );
      // } else {
      //   return null;
      // }
    }
    return null;
  };
  InviteFriends(item) {
    Keyboard.dismiss();
    this.setState({
      showAlert: true,
      displayText: 'Your invitation send successfully to' + item.name,
    });
    this.sendinvitation(item.userid, item.name);
    this.onMyContactSearch('');
  }
  sendinvitation(UserID, name) {
    var obj = [];
    obj.push(UserID);
    var ids = obj.join(',');
    try {
      var dataToSend = {
        Refid: global.LoginUserId,
        UserIds: ids,
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
            displayText: 'Your invitation send successfully to' + name,
          });
          setTimeout(() => {
            this.setState({
              displayText: '',
              showAlert: false,
            });
          }, 10000);
        });
    } catch (e) {
      Alert.alert(e);
    }
  }
  Messageclick = item => {
    Actions.chattingUI({
      TouserId: item.userid,
      FromUserId: global.LoginUserId,
      GrpORConatctName: item.name + ' ' + item.lastName,
      Img: item.image,
      ChannelId: 0,
    });
  };
  _handleOnApplyPress = (CompanyName, Title, Industry) => {
    this.setState({ swipeablePanelActive: false });
    if (CompanyName != null && CompanyName != '') {
      this.onMyContactSearch(CompanyName);
    }
    if (Title != null && Title != '') {
      this.onMyContactSearch(Title);
    }
    if (Industry != null && Industry != '') {
      this.onMyContactSearch(Industry);
    }
    // var obj = {};
    // obj.companyname = CompanyName;
    // obj.title = Title;
    // obj.profession = Industry;
    // var users = [];
    // users = this.state.tempNearByProfiles.filter(function(item) {
    //   if (
    //     (item.profession.toLowerCase() == obj.profession.toLowerCase() &&
    //       obj.profession != '') ||
    //     (item.companyname.toLowerCase() == obj.companyname.toLowerCase() &&
    //       obj.companyname != '') ||
    //     (item.title.toLowerCase() == obj.title.toLowerCase() && obj.title != '')
    //   ) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });
    // this.setState({NearByProfiles: users});
  };
  _handleHeaderProfileIcon = () => {
    return null;
  };
  render() {
    console.log("Friends", this.state.NearByProfiles)
    return (
      <View style={{ flex: 1, backgroundColor: '#f4f6f9' }}>
        <View style={{ flex: 0.18 }}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => this._handleHeaderRightIcon()}
            HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
            HeaderLeftIconPress={this._handleHeaderLeftIconPress}
            HeaderRightIconPress={this._handleHeaderRightIconPress}
            HeaderText={() => this._handleHeaderText()}
            HeaderProfileIcon={() => this._handleHeaderProfileIcon()}
            HeaderProfileIconPress={this._handleHeaderProfileIconPress}
            IsShowTextForTabs={false}
          />
        </View>
        {this.state.showAlert ? (
          <View style={{ marginLeft: 20, marginTop: 10 }}>
            <Text style={{ color: "#000" }}>
              {this.state.displayText}
            </Text>
          </View>
        ) : null}
        <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
          <FlatList
            showsVerticalScrollIndicator={true}
            //style={{ alignSelf: "flex-start" }}
            keyboardShouldPersistTaps={'always'}
            keyboardDismissMode={'interactive'}
            data={this.state.NearByProfiles}
            //numColumns={2}
            keyExtractor={item => item.userid}
            renderItem={({ item, index }) => {
              return (
                <View>{this.renderDisplayNearByProfiles(item, index)}</View>
              )
            }}
          />
        </View>
        <View style={{ flex: 0.13 }}>
          <Footer />
        </View>
        <View>
          <AlertClass
            AlertMessage={'Are you sure you want to unblock'}
            OkButtonText={'OK'}
            CancelButtonText={'Cancel'}
            showAlert={this.state.surewantToDelete}
            onOkPress={() => {
              this.ConfirmUnBlock();
              this.setState({ surewantToDelete: false });
              this.setState({
                showalert: true,
                // DisplayText: 'Deleted successfully',
              });
              setTimeout(() => {
                this.setState({
                  displayText: '',
                  showalert: false,
                });
              }, 5000);
            }}
            onAlertClose={() => {
              this.setState({ surewantToDelete: false });
            }}
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
)(NearByContainer);