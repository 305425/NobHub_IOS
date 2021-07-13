import React, { PureComponent } from 'react';
import { AlertClass } from '../shared/CustomAlert';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  LayoutAnimation,
  BackHandler,
  Keyboard,
  Dimensions,
  ScrollView,
  ImageBackground, Linking
} from 'react-native';
import { Thumbnail } from 'native-base';
import { connect } from 'react-redux';
import { goBack } from '../Services/BackButtonServices';
import { Actions } from 'react-native-router-flux';
import Hyperlink from 'react-native-hyperlink';
import Mailer from 'react-native-mail';
import {
  PlayStoreLink,
  GilRoyRegularColor,
  LightGrayColor,
} from '../shared/Constants';
import {
  PlusCircle,
  Block,
  Cancel,
  Check,
  PhoneBook,
  Gmail,
  Search,
  ToolTip,
  Closecircle,
  Message,
} from '../shared/Icon';
import crossLogo from '../Images/cross.png';
import {
  setMyConnectionDetails,
  clearMyConnectionDetails,
} from '../state/operations';
import ServiceCalls from '../Services/APICalls';
import Footer from '../shared/Footer';
import CommonHeader from '../shared/CommonHeader';
import { styles } from './Home.styles';
import { CommonStyles, GilRoyMediumColor } from '../shared/Constants';
import { MediumBoldText, Text, BoldText } from '../shared/Text';
import Tooltip from 'react-native-walkthrough-tooltip';
import { _ } from 'lodash';
import Share from 'react-native-share';
import files from '../files/filesBase64';
import Communications from 'react-native-communications';
const colors = [
  '#27BECF', '#994F14', '#DA291C', '#FFCD00', '#007A33', '#EB9CA8', '#7C878E',
  '#8A004F', '#000000', '#10069F', '#00a3e0', '#4CC1A1', '#915520', '#b3d962',
  '#67a8e0', '#c06dde', '#1ec952', '#cc1f36', '#0b615f', '#911c16'
]
class HomePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      Lat: '',
      Lang: '',
      NobHubUsers: [],
      tempNobHubUsers: [],
      slideAnimationDialog: false,
      AdvanceSearch: false,
      AdvancesearchDialog: false,
      Professions: [],
      SelectedProfession: '',
      Location: '',
      CompanyName: '',
      UserId: 0,
      UserName: '',
      InviteUserIDs: [],
      expanded: false,
      expandcontacts: false,
      InvitationList: [],
      Receiveinvitername: '',
      FloatingView: false,
      msg: '',
      InvitationStatus: 'Invitation Sent',
      TextInputPlaceHolder: 'Company/location',
      IsCancel: false,
      SearchValue: '',
      InvitationText: 'You are sending invitation to ',
      showAlert: false,
      InvitationName: '',
      SelectedList: [],
      toolTipVisible: false,
      IsNoRecords: false,
      TempList: [],
      Multinames: [],
      surewantToDelete: false,
      BlockedChannelId: 0,
      BlockedUserId: 0,
      displayText: '',
      blockUserName: '',
      blockUserImg: '',
      blockUserId: '',
      blockUserInitials: '',
      blockUserIsBlocked: null,
      blockUserIsFavoriteContact: null,
      SelectedItem: {},
    };
    global.HomePage = this;
    BackHandler.addEventListener('hardwareBackPress', this.back_Button_Press);
  }
  InviteFriends(item) {
    let status = item.status;
    console.log("ItemUser", status)
    if (status === "INVITATION SENT") {
      this.setState({
        showAlert: true,
        displayText: `You already sent the invitation to ${item.fullName}`,
      });
      setTimeout(() => {
        this.setState({
          displayText: '',
          showAlert: false,
        });
      }, 5000);
    }
    else {
      this.state.Multinames.push({ Id: item.userid, Name: item.name });
      Keyboard.dismiss();
      this.state.sendInvitationToUsername = item.name;
      this.sendinvitation(item.userid);
      this.setState({ SelectedList: [], FloatingView: false })
    }
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
  GetAllProfessions() {
    fetch(global.APIURL + 'api/Card/GetAllProfessions')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ Professions: responseJson });
      })
      .catch(error => {
        Alert.alert(error.message);
      });
  }
  componentDidMount() {
    try {
      global.MyConnections.setState({
        // NewInvitation: '',
        InviteIconColor: CommonStyles.appColor,
      });
      this.GetNobHubUsers();
      this.GetAllProfessions();
      this.getInvitations();
    } catch (e) {
      Alert.alert(e.message);
    }
  }
  GetNobHubUsers = () => {
    try {
      var dataToSend = {
        UserId: global.LoginUserId,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/GetNobHubUsers', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          // console.log("Users", responseJson)
          this.setState({
            NobHubUsers: responseJson,
            tempNobHubUsers: responseJson,
          });
          var userPrfoiles = global.MyConnections.props.userProfile;
          if (userPrfoiles != null) {
            userPrfoiles.isnewinvititation = false;
            global.MyConnections.props.setUserProfile(userPrfoiles);
          }
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  sendinvitation(UserID) {
    var Ids = '';
    if (UserID != 0) {
      Ids = UserID;
    } else {
      Ids = this.state.TempList.join(',');
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
          if (UserID == 0) {
            this.setState({
              TempList: [],
              SelectedList: [],
              FloatingView: false,
            });
          }
          this.setState({
            showAlert: true,
            InvitationName:
              'Your invitation send successfully to ' +
              Array.prototype.map
                .call(this.state.Multinames, function (item) {
                  return item.Name;
                })
                .join(','),
          });
          setTimeout(() => {
            this.setState({
              InvitationName: '',
              showAlert: false,
              Multinames: [],
            });
          }, 5000);

          //this.GetNobHubUsers();
          //this.setState({NobHubUsers: object});
          // this.DisplayNobHubUsers();
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  }
  cancelIconPress = () => {
    this.setState({
      FloatingView: false,
      SelectedList: [],
      TempList: [],
      Multinames: [],
    });
  };
  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{ text: 'Accept', onPress: () => this.Accepteinvitation() }],
      { cancelable: false },
    );
  }
  AdvanceFilter = () => {
    this.setState({ AdvancesearchDialog: true });
  };
  renderSeparator = () => {
    return <View style={{ width: '100%' }} />;
  };
  Messageclick = item => {
    this.setState({
      blockUserName: item.name + ' ' + item.lastName,
      blockUserImg: item.image,
      blockUserId: item.userid,
      blockUserInitials: item.initials,
      blockUserIsBlocked: item.isChatblocked,
      blockUserIsFavoriteContact: item.isChatfavorite,
    })
    Actions.chattingUI({
      TouserId: item.userid,
      GrpORConatctName: item.name + ' ' + item.lastName,
      Img: item.image,
      ChannelId: item.channelid,
      initials: item.initials,
      isBlocked: item.isChatblocked,
      IsFavoriteContact: item.isChatfavorite,
    });
  };
  InvitationsStyle = ({ item }) => {
    var firstName = item.firstname == null ? '' : item.firstname;
    var lastName = item.lastname == null ? '' : item.lastname;
    var firstCharInName =
      firstName == null ? '' : firstName.toUpperCase().charAt(0);
    var firstCharInLastName =
      lastName == null ? '' : lastName.toUpperCase().charAt(0);
    return (
      <View
        style={{
          marginBottom: 1,
          borderBottomStartRadius: 25,
          borderBottomEndRadius: 25,
          borderBottomWidth: 0.5,
          borderBottomColor: '#e0e0e0',
        }}>
        <View style={[styles.viewContact]}>
          <View style={{ flex: 0.18 }}>
            {item.image != '' && item.image != null ? (
              <Thumbnail
                medium
                source={{
                  uri:
                    global.APIURL + 'uploadimgs/ProfilePictures/' + item.image,
                }}
                style={[styles.invitationimages]}
              />
            ) : (
              <View style={styles.firstNameText}>
                <Text
                  style={{ fontSize: 26, textAlign: 'center', color: '#ffffff' }}>
                  {firstCharInName + firstCharInLastName}
                </Text>
              </View>
            )}
          </View>
          <View style={{ flex: 0.57 }}>
            <View style={{ flexDirection: 'column' }}>
              <MediumBoldText style={styles.userName}>
                {firstName + ' ' + lastName}
              </MediumBoldText>
              <Text style={{ color: GilRoyRegularColor.fontColor }}>
                {item.title + ',' + item.companyName}
              </Text>
            </View>
          </View>
          <View style={{ flex: 0.2, flexDirection: 'row' }}>
            <View style={styles.iconViewStyle}>
              <TouchableOpacity
                onPress={() =>
                  this.handleAcceptInvitation(item.cid, item.refid, firstName)
                }>
                <Check style={styles.iconStyle} />
              </TouchableOpacity>
            </View>
            <View style={[styles.iconViewStyle, { marginLeft: 5 }]}>
              <TouchableOpacity
                onPress={() =>
                  this.handleDeclineInvitation(item.cid, item.refid, firstName)
                }>
                <Cancel style={styles.iconStyle} />
              </TouchableOpacity>
            </View>
            <View style={[styles.iconViewStyle, { marginLeft: 5 }]}>
              <TouchableOpacity
                onPress={() =>
                  this.handleBlockInvitation(item.cid, item.refid, firstName)
                }>
                <Block style={styles.iconStyle} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 0.05 }} />
        </View>
      </View>
    );
  };

  _handleOnInvitationTextChange = text => {
    this.setState({
      InvitationText:
        this.state.InvitationText +
        this.state.sendInvitationToUsername +
        ' ' +
        text,
    });
  };
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
          this.state.NobHubUsers.forEach(element => {
            if (element.userid == this.state.BlockedUserId) {
              element.isChatblocked = false;
            }
          });
          this.setState({ NobHubUsers: this.state.NobHubUsers });
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

  renderNobhubUserItems = (item,index) => {
    //console.log("InviteUsers", item);
    if (item) {
      return (
        <TouchableOpacity style={styles.cardsWrapper}
          onPress={() => this.IsShowTabs(item)}
          onLongPress={() => this.IsShowTabs(item)}>
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
                        {this.state.SelectedList.length > 0 ? (
                          <View >
                            <PlusCircle style={styles.iconClose} />
                          </View>) : (
                          <View >
                            <TouchableOpacity onPress={() => this.InviteFriends(item)}>
                              <PlusCircle style={styles.iconClose} />
                            </TouchableOpacity>
                          </View>)}
                      </View>
                    </ImageBackground>
                  ) : (
                    <View
                      style={{height: '100%',
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      borderBottomLeftRadius: 8,
                      borderTopLeftRadius: 8,
                    backgroundColor: colors[index%colors.length]}}
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
                        {this.state.SelectedList.length > 0 ? (
                          <View >
                            <PlusCircle style={styles.iconClose} />
                          </View>) : (
                          <View >
                            <TouchableOpacity onPress={() => this.InviteFriends(item)}>
                              <PlusCircle style={styles.iconClose} />
                            </TouchableOpacity>
                          </View>)}
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{height: '100%',
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      borderBottomLeftRadius: 8,
                      borderTopLeftRadius: 8,
                    backgroundColor: colors[index%colors.length]}}
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
                        {this.state.SelectedList.length > 0 ? (
                          <View>
                            <PlusCircle style={styles.iconClose} />
                          </View>) : (
                          <View >
                            <TouchableOpacity onPress={() => this.InviteFriends(item)}>
                              <PlusCircle style={styles.iconClose} />
                            </TouchableOpacity>
                          </View>)}
                      </View>
                    </View>
                  )}
              </View>
              {/* <View style={styles.profileImage}>
                {item.image != '' && item.image != null ? (
                  <Image
                    source={{
                      uri:
                        global.APIURL +
                        'uploadimgs/ProfilePictures/' +
                        item.image,
                    }}
                    style={styles.fab}
                  />
                ) : (
                  <Image
                    source={require('../Images/ProfileIcon.png')}
                    style={styles.fab}
                  />
                )}
              </View> */}
            </View>

            {/* {this.state.SelectedList.length > 0 ? (
              <View style={styles.Ibutton}>
                <PlusCircle style={styles.iconClose} />
              </View>) : (
              <View style={styles.Ibutton}>
                <TouchableOpacity onPress={() => this.InviteFriends(item)}>
                  <PlusCircle style={styles.iconClose} />
                </TouchableOpacity>
              </View>)} */}


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
        </TouchableOpacity>
      );
    }
    return null;
  };
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
  getInvitations() {
    try {
      var dataToSend = {
        UserId: global.LoginUserId,
        IsAll: true,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/GetInvitations', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({ InvitationList: responseJson });
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  InvitationDesign() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f4f6f9' }}>
        <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
          <FlatList
            //style={{backgroundColor:"red"}}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps={'always'}
            keyboardDismissMode={'interactive'}
            data={this.state.InvitationList.slice(0, 3)}
            numColumns={1}
            renderItem={item => this.InvitationsStyle(item)}
          />
        </View>
      </View>
    );
  };
  changeLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: !this.state.expanded });
  };
  changeLayoutcontacts = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expandcontacts: !this.state.expandcontacts });
  };
  _handleBackPress = () => {
    const { handleGoBack } = this.props;
    handleGoBack();
  };
  _handleRedirectToManageInvitations = () => {
    const { UserProfile } = this.props;
    Actions.manageInvitations({
      UserId: global.LoginUserId,
      UserProfile: UserProfile,
    });
  };
  handleAcceptInvitation = (ToUserId, FromUserId, Name) => {
    var that = this;
    Keyboard.dismiss();
    try {
      global.MyConnections._handleAcceptInvitation(ToUserId, FromUserId);
      this.setState({
        showAlert: true,
        InvitationName: 'Now you are connected with ' + Name,
      });
      that.setState({
        InvitationList: that.state.InvitationList.filter(list => {
          return list.refid !== FromUserId;
        }),
      });
      setTimeout(() => {
        this.setState({
          InvitationName: '',
          showAlert: false,
        });
      }, 5000);
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  handleDeclineInvitation = (ToUserId, FromUserId, Name) => {
    var that = this;
    Keyboard.dismiss();
    try {
      ServiceCalls.handleDeclineInvitation(FromUserId, ToUserId).then(
        response => {
          if (response) {
            this.setState({
              showAlert: true,
              InvitationName:
                'You have rejected ' +
                Name +
                'Invitee would not aware of your rejection, Invitee can resend the invite',
            });
            that.setState({
              InvitationList: that.state.InvitationList.filter(list => {
                return list.refid !== FromUserId;
              }),
            });
            setTimeout(() => {
              this.setState({
                InvitationName: '',
                showAlert: false,
              });
            }, 5000);
          }
        },
      );
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  handleBlockInvitation = (ToUserId, FromUserId, Name) => {
    var that = this;
    Keyboard.dismiss();
    try {
      ServiceCalls.handleBlockInvitation(FromUserId, ToUserId).then(
        response => {
          if (response) {
            this.setState({
              showAlert: true,
              InvitationName:
                'You have blocked ' +
                Name +
                'Invitee would not aware of your blocked action the invitee can not resend the invite again unless you unblock or delete from your blocked list.',
            });
            that.setState({
              InvitationList: that.state.InvitationList.filter(list => {
                return list.refid !== FromUserId;
              }),
            });
            setTimeout(() => {
              this.setState({
                InvitationName: '',
                showAlert: false,
              });
            }, 5000);
          }
        },
      );
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  _handleHeaderLeftIcon = () => {
    return (
      <View>
        <View style={styles.leftHeader}>
          <Gmail style={{ color: CommonStyles.appColor, fontSize: 22 }} />
        </View>
        <Text style={{ color: '#ffffff', fontSize: 12.5, textAlign: 'center' }}>
          Email
        </Text>
      </View>
    );
  };
  _handleHeaderRightIcon = () => {
    return (
      <View>
        <View style={styles.leftHeader}>
          <PhoneBook style={{ color: CommonStyles.appColor, fontSize: 22 }} />
        </View>
        <Text style={{ color: '#ffffff', fontSize: 10, textAlign: 'center' }}>
          Phone Contact
        </Text>
      </View>
    );
  };
  _handleHeaderCenterIcon = () => {
    return (
      <View
        style={
          styles.headerCenterView}>
        <View
          style={{
            flex: 0.4,
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
        <View style={{ flex: 1.5, left: 5, bottom: 1 }}>
          <TextInput
            underlineColor="transparent"
            underlineColorAndroid={'rgba(0,0,0,0)'}
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
  _handleOnTextInputFocus = () => {
    this.setState({
      IsCancel: true,
      TextInputPlaceHolder: 'Company/location',
    });
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
  onMyContactSearch = value => {
    var searchItems = value
      .trim()
      .toLowerCase()
      .split(' ');
    //console.log("SearchItem", searchItems)
    this.setState({ SearchValue: value, IsCancel: true });
    value = value.trim().toLowerCase();
    var myNobHubUsers = [];
    myNobHubUsers = this.state.tempNobHubUsers.filter(contact => {
      console.log("Contact", contact)
      let searchLocation = contact.userAddress ? contact.userAddress.toLowerCase().split(" ") : '';
      let newSearchLocation = contact.userAddress != null ? (searchLocation.map(x => /[,\-]/.test(x) === true) ? searchLocation.map(x => x.replace(/,/g, '')) : searchLocation.map(x => x)) : null
      //console.log("searchLocation",contact.userAddress != null ? (searchLocation.map(x=>/[,\-]/.test(x) === true) ?searchLocation.map(x=> x.replace(/,/g, '')) :searchLocation.map(x=>x)) : null)
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
          // (contact.companyname != null &&
          //   contact.companyname.toLowerCase().indexOf(x) === 0)||
          // (contact.title != null &&
          //   contact.title.toLowerCase().indexOf(x) === 0)||
          //  (contact.userAddress != null &&
          //    contact.userAddress.toLowerCase().indexOf(x) === 0) ||
          // (contact.profession != null &&
          //   contact.profession.toLowerCase().indexOf(x) === 0),
        ).length > 0
      ) {
        return true;
      }
    });

    this.setState({ NobHubUsers: myNobHubUsers });
    if (myNobHubUsers.length === 0) {
      this.setState({ IsNoRecords: true });
    } else {
      this.setState({ IsNoRecords: false });
    }
    if (value === '') {
      this.setState({ IsCancel: false });
    }
  };
  // onMyContactSearch = value => {
  //   var searchItems = value
  //     .trim()
  //     .toLowerCase()
  //     .split(' ');
  //   console.log("SearchItem", searchItems)
  //   this.setState({ SearchValue: value, IsCancel: true });
  //   value = value.trim().toLowerCase();
  //   var myNobHubUsers = [];
  //   myNobHubUsers = this.state.tempNobHubUsers.filter(contact => {
  //     console.log("Contact",contact)
  //     if (
  //       searchItems.filter(
  //         x =>
  //           (contact.name != null && contact.name.toLowerCase().indexOf(x) === 0) ||
  //           (contact.lastName != null && contact.lastName.toLowerCase().indexOf(x) === 0) ||
  //           (contact.mobile != null && contact.mobile.toLowerCase().indexOf(x) === 0) ||
  //           (contact.companyname != null && contact.companyname.toLowerCase().indexOf(x) === 0) ||
  //           (contact.title != null && contact.title.toLowerCase().indexOf(x) === 0) ||
  //           (contact.userAddress != null && contact.userAddress.toLowerCase().indexOf(x) === 0) ||
  //           (contact.title != null && contact.title.toLowerCase().indexOf(x) === 0) ||
  //           (contact.caddress != null && contact.caddress.toLowerCase().indexOf(x) === 0) ||
  //           (contact.paddress != null && contact.paddress.toLowerCase().indexOf(x) === 0) ||
  //           (contact.profession != null && contact.profession.toLowerCase().indexOf(x) === 0),
  //         // (contact.companyname != null &&
  //         //   contact.companyname.toLowerCase().indexOf(x) === 0)||
  //         // (contact.title != null &&
  //         //   contact.title.toLowerCase().indexOf(x) === 0)||
  //         //  (contact.userAddress != null &&
  //         //    contact.userAddress.toLowerCase().indexOf(x) === 0) ||
  //         // (contact.profession != null &&
  //         //   contact.profession.toLowerCase().indexOf(x) === 0),
  //       ).length > 0
  //     ) {
  //       return true;
  //     }
  //   });

  //   this.setState({ NobHubUsers: myNobHubUsers });
  //   if (myNobHubUsers.length === 0) {
  //     this.setState({ IsNoRecords: true });
  //   } else {
  //     this.setState({ IsNoRecords: false });
  //   }
  //   if (value === '') {
  //     this.setState({ IsCancel: false });
  //   }
  // };
  // _handleHeaderLeftIconPress = () => {
  //   const {UserProfile} = this.props;
  //   Communications.email(
  //     null,
  //     null,
  //     null,
  //     'CHECK OUT THIS COOL NEW APP - NOBHUB',
  //     'Hey! Download this awesome app from the Google Play Store/Apple App Store. You can install NobHub here: ' +
  //       '\n' +
  //       'Referral code is: ' +
  //       UserProfile.mycode +
  //       '\n' +
  //       PlayStoreLink.android,
  //     // '\n' +
  //     // `${JSON.stringify(
  //     //   <Image
  //     //     source={{
  //     //       uri: global.APIURL + 'global_assets/images/logo_light.png',
  //     //     }}
  //     //   />,
  //     // )}`,
  //   );
  //   // Share.share({
  //   //   title: 'CHECK OUT THIS COOL NEW APP - NOBHUB',
  //   //   message:
  //   //     'Hey! Download this awesome app from the Google Play Store/Apple App Store. You can install NobHub here: ' +
  //   //     '\n' +
  //   //     'Referral code is: ' +
  //   //     UserProfile.mycode +
  //   //     '\n' +
  //   //     PlayStoreLink.android +
  //   //     '\n' +
  //   //     JSON.stringify(
  //   //       <Image
  //   //         source={{
  //   //           uri: global.APIURL + 'global_assets/images/logo_light.png',
  //   //         }}
  //   //       />,
  //   //     ),
  //   // })
  //   //   .then(() => {})
  //   //   .catch(errorMsg => Alert.alert(errorMsg));
  // };
  _handleHeaderLeftIconPress = async () => {
    const { UserProfile } = this.props;
    const shareOptions = {
      social: Share.Social.EMAIL,
      title: 'CHECK OUT THIS COOL NEW APP - NOBHUB',
      message: 'Hey! Download this awesome app from the Google Play Store/Apple App Store. You can install NobHub here: ' +
        '\n' +
        PlayStoreLink.android +
        '\n' +
        'Referral code is :' +
        UserProfile.mycode,
      url: files.appLogo,
      // urls: [files.image1, files.image2]
    }

    try {
      const ShareResponse = await Share.shareSingle(shareOptions);
      console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      console.log('Error => ', error);
    }
  };

  _handleHeaderRightIconPress = () => {
    const { UserProfile } = this.props;
    Actions.phoneContacts({ UserProfile: UserProfile });
  };
  _handleHeaderText = () => {
    return (
      <View>
        <BoldText style={{ color: '#ffffff', fontSize: 14, textAlign: 'center' }}>
          Invite Contacts
        </BoldText>
      </View>
    );
  };
  press = object => {
    let userName = object.fullName;
    let status = object.status;
    console.log("ItemUser", object.status)
    if (status === "INVITATION SENT") {
      this.setState({
        showAlert: true,
        displayText: `You already sent the invitation to ${userName}`,
      });
      setTimeout(() => {
        this.setState({
          displayText: '',
          showAlert: false,
        });
      }, 5000);

    } else {
      if (this.state.TempList.filter(data => data === object.userid).length > 0) {
        // Alert.alert(`You already sent the invitation to ${userName}`);
        this.setState({
          showAlert: true,
          displayText: `You have already selected ${userName}`,
        });
        setTimeout(() => {
          this.setState({
            displayText: '',
            showAlert: false,
          });
        }, 5000);
      } else {
        this.setState({
          SelectedList: _.concat(object, this.state.SelectedList),
        });
        this.state.Multinames.push({ Id: object.userid, Name: object.fullName });
        this.state.TempList.push(object.userid);
        if (this.state.TempList.length > 1) {
          this.setState({ FloatingView: true });
        }
      }
    }
  };
  _handleOnListPress = item => {
    if (this.state.FloatingView) {
      this.press(item);
    }
  };
  _handleUnselectContact = itemId => {
    this.setState({
      SelectedList: _.filter(
        this.state.SelectedList,
        ({ userid }) => userid !== itemId,
      ),
    });
    var users = this.state.TempList.filter(obj => {
      return obj !== itemId;
    });
    this.state.Multinames.forEach(function (item, index, object) {
      if (item.Id == itemId) {
        object.splice(index, 1);
      }
    });
    if (users.length <= 1) {
      this.setState({ FloatingView: false });
    }
    this.setState({ TempList: users });
  };
  ShowTabs = () => {
    if (this.state.FloatingView) {
      return (
        <View
          style={{
            backgroundColor: '#ffff',
            alignItems: 'center',
            borderColor: '#bdbdbd',
            borderWidth: 0.8,
            borderRadius: 70,
            position: 'absolute',
            right: 5,
            top: -50,
            width: 30,
            flexDirection: 'column',
            height: 60,
            marginTop: 80,
            marginRight: 20,
            zIndex: 999,
          }}>
          <TouchableOpacity onPress={() => this.sendinvitation(0)}>
            <PlusCircle
              style={{
                color: LightGrayColor.fontColor,
                marginTop: 5,
                fontSize: 20,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.cancelIconPress()}>
            <Cancel
              style={{
                color: LightGrayColor.fontColor,
                marginTop: 5,
                fontSize: 20,
              }}
            />
          </TouchableOpacity>
        </View>
      );
    }
    // return null
  };
  IsShowTabs = item => {
    this.press(item);
  };
  SeletedPeopleListDesign = item => {
    if (item.image !== '' && item.image !== null) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => this._handleUnselectContact(item.userid)}>
            <View style={[styles.SelectedPeopleView]}>

              <Thumbnail
                style={[styles.DummyProfileStyle]}
                medium
                source={{
                  uri:
                    global.APIURL + 'uploadimgs/ProfilePictures/' + item.image,
                }}
              />
              {/* <Closecircle style={{color: '#fff', fontSize: 18,flex:1, position:'absolute', alignSelf:"flex-end"}} /> */}
              <Image source={crossLogo} style={{ height: 25, width: 25, flex: 1, position: 'absolute', alignSelf: "flex-end", left: 40 }} />
              {/* <View
                style={{
                  position: 'absolute',
                  top: 35,
                  borderRadius: 50,
                  backgroundColor: '#ffffff',
                  left: 45,
                }}>
               
              </View> */}
            </View>
            <Text style={{ fontSize: 14, textAlign: 'center' }}>
              {item.name.length > 5
                ? item.name.substring(0, 5) + '...'
                : item.name}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => this._handleUnselectContact(item.userid)}>
            <View style={[styles.SelectedPeopleView]}>
              {/* <Closecircle style={{color: 'lightgray', fontSize: 20,flex:1, position:'absolute', alignSelf:"flex-end"}} /> */}
              <Image
                source={require('../Images/ProfileIcon.png')}
                style={[styles.DummyProfileStyle]}
              />
              {/* <Closecircle style={{color: '#fff', fontSize: 20,flex:1, position:'absolute', alignSelf:"flex-end"}} /> */}
              <Image source={crossLogo} style={{ height: 25, width: 25, flex: 1, position: 'absolute', alignSelf: "flex-end", left: 40 }} />
              {/* <View
                style={{
                  position: 'absolute',
                  top: 35,
                  borderRadius: 50,
                  backgroundColor: '#ffffff',
                  left: 42,
                }}>
              </View> */}
            </View>
            <Text
              style={{
                fontSize: 16,
                marginLeft: 15,
                textAlign: 'center',
                //marginTop:15
              }}>
              {item.name.length > 5
                ? item.name.substring(0, 5) + '...'
                : item.name}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };
  _handleHeaderProfileIcon = () => {
    return null;
  };
  render() {
    let displayText = this.state.displayText ? this.state.displayText : this.state.InvitationName;
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
            <Text style={{ color: GilRoyMediumColor.fontColor }}>
              {displayText}
            </Text>
          </View>
        ) : null}
        <View style={{ flex: 0.85 }}>
          {this.state.SelectedList.length > 0 ? (
            <View style={{ borderBottomColor: "gray", borderBottomWidth: 0.5, marginTop: 10 }}>
              <FlatList
                horizontal
                keyboardShouldPersistTaps={'always'}
                keyboardDismissMode={'interactive'}
                data={this.state.SelectedList}
                renderItem={({ item }) => (
                  <View
                    style={{
                      marginBottom: 10,
                      borderBottomColor: 'lightgray',
                    }}>
                    {this.SeletedPeopleListDesign(item)}
                  </View>
                )}
              />
            </View>
          ) : null}
          {this.ShowTabs()}
          {/* {this.state.showAlert ? (
            <View style={{marginLeft: 20, marginTop: 10}}>
              <Text style={{color: GilRoyMediumColor.fontColor}}>
                {displayText}
              </Text>
            </View>
          ) : null} */}
          <ScrollView keyboardShouldPersistTaps='handled'>
            <View style={[styles.invitationTextView]}>
              <View style={{ flex: 0.5, alignSelf: 'center', marginLeft: 10 }}>
                {this.state.InvitationList.length === 0 ? (
                  <MediumBoldText>No Invitations</MediumBoldText>
                ) : null}
              </View>
              <View style={{ flex: 0.5, alignSelf: 'center', marginLeft: 55 }}>
                <TouchableOpacity
                  onPress={() => this._handleRedirectToManageInvitations()}>
                  <MediumBoldText style={{ fontSize: 15 }}>Manage Invitations</MediumBoldText>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flex:
                  this.state.InvitationList.length === 1
                    ? 0.65
                    : this.state.InvitationList.length === 2
                      ? 1.5
                      : this.state.InvitationList.length === 3
                        ? 2.3
                        : 0,
              }}>
              {this.InvitationDesign()}
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ margin: 10 }}>
                <BoldText style={styles.peopleText}>
                  Every making connection has a story
                </BoldText>
              </View>
              <View>
                <FlatList
                  showsVerticalScrollIndicator={true}
                  // style={{alignSelf:"center"}}
                  //style={{ alignSelf: "flex-start" }}
                  keyboardShouldPersistTaps={'always'}
                  keyboardDismissMode={'interactive'}
                  data={this.state.NobHubUsers}
                  ///numColumns={2}
                  keyExtractor={item => item.userid}
                  renderItem={({item,index}) => {
                    return ( 
                      <View>{this.renderNobhubUserItems(item,index)}</View>
                    )}}
                //  ItemSeparatorComponent={this.renderSeparator}
                />
              </View>
            </View>
          </ScrollView>
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
              }, 10000);
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
const mapStateToProps = state => {
  return {
    myConnectionDetails: state.MyConnections.myConnectionDetails,
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
)(HomePage);