import React, { Component } from 'react';
import MyConnections from './MyConnections';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
  Alert,
  View,
  AppState,
  Keyboard,
  Platform,
  TouchableOpacity,
  TextInput,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { handleOnScannerPress } from './index.service';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
} from 'react-native-popup-dialog';

import ServiceCalls from '../Services/APICalls';
import { hardWareBackHandler } from '../Services/BackButtonServices';
import { PlayStoreLink, MyConnection } from '../shared/Constants';
import { createNotificationListeners } from '../Services/Firebase';
import Footer from '../shared/Footer';
import {
  setMyConnectionDetails,
  clearMyConnectionDetails,
  setUserProfile,
} from '../state/operations';
import moment from 'moment';
import { CommonStyles, GilRoyMediumColor } from '../shared/Constants';
import SwipeablePanelView from './ScannedPopup';
import base64 from 'react-native-base64';
import Updatenearbystatus from '../Services/UpdateNearbystatus';
import ImagePicker from 'react-native-image-picker';
import CommonHeader from '../shared/CommonHeader';
import { Cancel, Search, Scan, BottomGroupIcon } from '../shared/Icon';
import CustomMenuIcon from '../Custom/MenuIconForHeader';
import logo from '../Images/IOSlogo.png';
import Share from 'react-native-share';
import files from '../files/filesBase64';
class MyConnectionsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MyContactsList: [],
      MyContacts: [],
      IsShow: false,
      IsContact: true,
      IsMultiSelect: false,
      SelectedList: [],
      backGroundColor: '#ffff',
      swipeablePanelActive: false,
      InviteTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      NearByTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      InviteIconColor: '#777777',
      NearByIconColor: '#777777',
      IsCancel: false,
      SearchValue: '',
      IsScan: true,
      TextInputPlaceHolder: 'Name/Phone number',
      HasInvitation: false,
      IsShowTabs: false,
      DeletedPeopleList: [],
      IconColor: CommonStyles.appColor,
      appState: AppState.currentState,
      NickName: '',
      IsShowDialog: false,
      // IsNoRecords: false,
      IsShowTabsForMultiple: false,
      IsUpdate: false,
      showAlert: false,
      DisplayText: '',
      NotificationCount: '',
      URL: [],
      IsShowShare: false,
      ShowDeletedialog: false,
      ShownoOfRes: false,
      SearchCount: '',
      IsNickName: false,
      initialContacts: this.props.myConnectionDetails
    };
    global.MyConnections = this;
  }

  componentDidMount = () => {
    Updatenearbystatus.updateNearbyStatus(
      false,
      global.currentLongitude,
      global.currentLatitude,
    );
    this._handleAppStateChange('Active');
    AppState.addEventListener('change', this._handleAppStateChange);
    hardWareBackHandler();
    this.getInitialData();
    createNotificationListeners();
  };
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange = nextAppState => {
    this.setState({ appState: nextAppState });
    this.UpdateLastSeenStatus();
  };
  UpdateLastSeenStatus() {
    ServiceCalls.UpdateLastSeenStatus(this.state.appState).then(response => {
      if (response) {
      }
    });
  }
  _handleAcceptInvitation = (ToUserId, FromUserId) => {
    var that = this;
    ServiceCalls.handleAcceptInvitation(FromUserId, ToUserId).then(response => {
      if (response) {
        that.getInitialData();
      }
    });
  };
  getInitialData = () => {
    try {
      const { userProfile } = this.props;
      this.setState({ NotificationCount: 10 });
      var UserId = userProfile.guid;
      this.setState({
        HasInvitation: userProfile.isnewinvititation,
      });
      // global.footer.setState({HasChatmsg: userProfile.hasnewchatmessage});
      ServiceCalls.handleGetYesProfiles(UserId).then(response => {
       // console.log("myConnectionResponse", UserId);
        for (let i = 0; i < response.length; i++) {
          var status = this.calculateDateDiff(response[i].acceptedDate);
          response[i].connectedStatus = status;
        }
        this.props.clearMyConnectionDetails();
        this.props.setMyConnectionDetails(response);
        const { myConnectionDetails } = this.props;
        var myContacts = myConnectionDetails == null ? [] : myConnectionDetails;
        this.setState({ MyContacts: myContacts, initialContacts:myConnectionDetails });
      });
    } catch (e) {
      Alert.alert(e);
    }
  };
  calculateDateDiff(AcceptDate) {
    if (AcceptDate == null) {
      return '';
    } else {
      const CurrentDate = moment.utc();
      const _acceptedDate = moment.utc(AcceptDate);
      var dateDiffInYears = _acceptedDate.diff(CurrentDate, 'years').toString();
      dateDiffInYears = dateDiffInYears.replace(/-/g, '');
      if (dateDiffInYears == 1) {
        return 'Connected ' + dateDiffInYears + ' year ago';
      }
      if (dateDiffInYears > 1) {
        return 'Connected ' + dateDiffInYears + ' years ago';
      }

      var dateDiffInMonths = _acceptedDate
        .diff(CurrentDate, 'months')
        .toString();
      dateDiffInMonths = dateDiffInMonths.replace(/-/g, '');
      if (dateDiffInMonths == 1) {
        return 'Connected ' + dateDiffInMonths + ' month ago';
      } else if (dateDiffInMonths > 1) {
        return 'Connected ' + dateDiffInMonths + ' months ago';
      }
      var dateDiffInDays = _acceptedDate.diff(CurrentDate, 'days').toString();
      dateDiffInDays = dateDiffInDays.replace(/-/g, '');
      if (dateDiffInDays == 1) {
        return 'Connected ' + dateDiffInDays + ' day ago';
      } else if (dateDiffInDays > 1 && dateDiffInDays < 7) {
        return 'Connected ' + dateDiffInDays + ' days ago';
      } else if (dateDiffInDays >= 7 && dateDiffInDays < 14) {
        return 'Connected 1 week ago';
      } else if (dateDiffInDays >= 14 && dateDiffInDays < 21) {
        return 'Connected 2 weeks ago';
      } else if (dateDiffInDays >= 21 && dateDiffInDays < 28) {
        return 'Connected 3 weeks ago';
      } else if (dateDiffInDays >= 28) {
        return 'Connected 4 weeks ago';
      }
      var dateDiffInHours = _acceptedDate.diff(CurrentDate, 'hour').toString();

      dateDiffInHours = dateDiffInHours.replace(/-/g, '');
      if (dateDiffInHours == 1) {
        return 'Connected ' + dateDiffInHours + ' hour ago';
      } else if (dateDiffInHours > 1) {
        return 'Connected ' + dateDiffInHours + ' hours ago';
      }
      var dateDiffInMinutes = _acceptedDate
        .diff(CurrentDate, 'minute')
        .toString();
      dateDiffInMinutes = dateDiffInMinutes.replace(/-/g, '');

      if (dateDiffInMinutes == 1) {
        return 'Connected ' + dateDiffInMinutes + ' Minute ago';
      } else if (dateDiffInMinutes > 1) {
        return 'Connected ' + dateDiffInMinutes + ' Minutes ago';
      }
      var dateDiffInSeconds = _acceptedDate
        .diff(CurrentDate, 'second')
        .toString();
      dateDiffInSeconds = dateDiffInSeconds.replace(/-/g, '');

      if (dateDiffInSeconds > 0) {
        return 'Connected just now';
      }
    }
  }

  _handleContactPress = contactData => {
    if (this.state.IsShowTabs) {
      this.onLongPressShowTabs(contactData);
    } else {
      const { userProfile } = this.props;
      //var tempArray = contactData.fileName.split('_');
      // var imgDisplayName =
      // tempArray[0] + ' ' + tempArray[1] + ' ' + tempArray[2];
      if (contactData.isScannedCard) {
        // return Actions.imageView({
        //   FileName: contactData.fileName,
        //   DisplayName: imgDisplayName,
        // });
      } else {
        Actions.viewCard({
          CUserId: contactData.userId,
          Theme: contactData.theme,
          LoggedUserId: userProfile.guid,
        });
      }
    }
  };
  onLongPressShowTabs = item => {
    try {
      var peopleInContacts = this.state.MyContacts;
      peopleInContacts.map(data => {
        if (data.userId === item.userId) {
          data.check = !data.check;
          if (data.check === true) {
            this.state.SelectedList.push(data);
            for (var i = 0; i < this.state.SelectedList.length; i++) {
              if (this.state.SelectedList[i].isShareMyCard) {
                this.setState({ IsShowShare: true });
              }
            }
            this.state.DeletedPeopleList.push(item.id);
            if (this.state.DeletedPeopleList.length === 1) {
              this.setState({ IsShowTabs: true, IsShowTabsForMultiple: false });
            } else {
              this.setState({ IsShowTabsForMultiple: true });
            }
          } else if (data.check === false) {
            for (var i = 0; i < this.state.SelectedList.length; i++) {
              if (this.state.SelectedList[i].id === item.id) {
                if (this.state.SelectedList[i].isShareMyCard) {
                  this.setState({ IsShowShare: false });
                }
                this.state.SelectedList.splice(i, 1);
              }
            }
            var Idindex = this.state.SelectedList.indexOf(item.id);
            if (Idindex > -1) {
              this.state.SelectedList.splice(Idindex, 1);
            }
            var index = this.state.DeletedPeopleList.indexOf(item.id);
            if (index > -1) {
              this.state.DeletedPeopleList.splice(index, 1);
            }
            if (this.state.DeletedPeopleList.length >= 2) {
              this.setState({ IsShowTabsForMultiple: true });
            } else {
              this.setState({ IsShowTabsForMultiple: false, IsShowTabs: true });
            }
          }
        }
      });
      this.setState({
        MyContacts: peopleInContacts,
        SelectedList: this.state.SelectedList,
      });
      if (this.state.DeletedPeopleList.length === 0) {
        this.setState({ IsShowTabs: false, IsShowTabsForMultiple: false });
      }
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleOnLongPress = item => {
    if (!this.state.IsShowTabs) {
      this.setState({ NickName: item.nickName, IsShowTabs: true });
      this.onLongPressShowTabs(item);
    }
  };
  _handleBackPress = () => {
    const { handleGoBack } = this.props;
    handleGoBack();
  };
  _handleOnInvitePeoplePress = () => {
    const { userProfile } = this.props;
    this.setState({
      InviteTabColor: ['#089bab', '#11cbdf'],
      NearByTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      InviteIconColor: '#ffffff',
      NearByIconColor: '#777777',
    });
    Actions.homePage({ UserProfile: userProfile });
  };
  _handleNearByPress = () => {
    const { userProfile } = this.props;
    this.setState({
      InviteTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      NearByTabColor: ['#089bab', '#11cbdf'],
      InviteIconColor: '#777777',
      NearByIconColor: '#ffffff',
    });
    Actions.mapView({ userProfile: userProfile });
  };

  _handleOnImageClosePress = () => {
    this.setState({ showImage: false });
  };
  _handleOnScannerPress = () => {
    this.setState({ swipeablePanelActive: true });
    // const {userProfile} = this.props;
    // handleOnScannerPress(userProfile.guid).then(() => {
    //   this.props.clearMyConnectionDetails();
    //   this.props.setMyConnectionDetails(global.MyConnections.state.MyContacts);
    // });
  };
  closePanel = () => {
    this.setState({ swipeablePanelActive: false });
  };
  // _handleOnInvitePress = () => {
  //   Share.share({
  //     title: 'Hi',
  //     message: MyConnection.inviteFriend + '\n' + PlayStoreLink.android,
  //   })
  //     .then(() => { })
  //     .catch(errorMsg => Alert.alert(errorMsg));
  // };
  _handleOnInvitePress = async () => {
    const shareOptions = {
      title: 'Hi',
      message: MyConnection.inviteFriend + '\n' + PlayStoreLink.android,
      //url: files.appLogo,
      // urls: [files.image1, files.image2]
    }

    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      console.log('Error => ', error);
    }
  };
  _handleMyContactSearch = value => {
    var searchItems = value
      .trim()
      .toLowerCase()
      .split(' ');
    this.setState({
      SearchValue: value,
      IsCancel: true,
      IsScan: false,
      ShownoOfRes: false,
    });
    value = value.trim().toLowerCase();
    if (value != '' && value != null) {
      this.setState({ ShownoOfRes: true });
    }
    var myContactsData = [];
    const { myConnectionDetails } = this.props;
    if (myConnectionDetails.length > this.state.MyContacts.length) {
      this.setState({ MyContacts: myConnectionDetails });
    }
    myContactsData = this.state.MyContacts.filter(contact => {
      if (
        searchItems.filter(
          x =>
          (contact.companyname != null && contact.companyname.toLowerCase().indexOf(x) === 0) ||
          (contact.title != null && contact.title.toLowerCase().indexOf(x) === 0) ||
          (contact.displayname != null && contact.displayname.toLowerCase().indexOf(x) === 0) ||
          (contact.mobile != null && contact.mobile.toLowerCase().indexOf(x) === 0) ||
          (contact.name != null && contact.name.toLowerCase().indexOf(x) === 0) ||
          (contact.lastname != null && contact.lastname.toLowerCase().indexOf(x) === 0) ||
          (contact.profession != null && contact.profession.toLowerCase().indexOf(x) === 0),
        ).length > 0
      ) {
        return true;
      }
    });
    // if (myContactsData.length === 0) {
    //   this.setState({IsNoRecords: true});
    //   //Keyboard.dismiss();
    // } else {
    this.setState({ SearchCount: myContactsData.length, initialContacts:myContactsData });
    // }
    this.props.clearMyConnectionDetails();
    this.props.setMyConnectionDetails(myContactsData);
    if (value === '') {
      this.setState({ IsCancel: false, IsScan: true });
    }
  };
  _handleScanCard = () => {
    const { userProfile } = this.props;
    if (Platform.OS == 'android') {
      this.setState({ swipeablePanelActive: false });
      handleOnScannerPress(userProfile).then(() => {
        //this.props.clearMyConnectionDetails();
        //this.props.setMyConnectionDetails(global.MyConnections.state.MyContacts);
      });
    } else {
      const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
      };
      ImagePicker.showImagePicker(options, response => {
        this.setState({ swipeablePanelActive: false });
        if (response.didCancel) {
        } else if (response.error) {
        } else if (response.customButton) {
        } else {
          var fileType = response.uri;
          fileType = fileType.split('.');
          Actions.scannedImages({
            FileName: fileType[1],
            ImageBase64: response.data,
            UserId: userProfile.guid,
            Source: response.uri,
            UserProfile: userProfile,
          });
        }
      });
    }
  };
  _handleViewScannedCards = () => {
    this.setState({ swipeablePanelActive: false });
    const { userProfile } = this.props;
    Actions.scannedCards({ userProfile: userProfile });
  };
  _handleClearPress = () => {
    this._handleMyContactSearch('');
    Keyboard.dismiss();
    this.setState({
      SearchValue: '',
      IsCancel: false,
      IsScan: true,
      TextInputPlaceHolder: 'Name/Phone number',
    });
    if (this.state.SearchValue.length === 0) {
      this.setState({ TextInputPlaceHolder: 'Name/Phone number' });
    }
  };
  _handleOnTextBoxFocus = () => {
    if (this.state.IsScan) {
      this.setState({
        IsScan: false,
        TextInputPlaceHolder: 'Name/Phone number',
        IsCancel: true,
      });
    }
  };
  _handleOnClosePress = () => {
    //this.setState({IsShowTabs: false});
    this.state.MyContacts.map(data => {
      data.check = false;
      this.setState({
        IsShowTabs: false,
        IsShowTabsForMultiple: false,
        DeletedPeopleList: [],
        SelectedList: [],
        ShowDeletedialog: false,
        ShownoOfRes: false,
        SearchCount: '',
      });
    });
  };
  _handleOnEditPress = Name => {
    if (this.state.DeletedPeopleList.length > 1) {
      Alert.alert('Select only one people');
    } else {
      if (Name != null && Name != '') {
        this.setState({ IsNickName: true });
      } else {
        this.setState({ IsNickName: false });
      }
      this.setState({ IsShowDialog: true });
    }
  };
  _handleOnDeletePress = () => {
    this.setState({ ShowDeletedialog: true });
  };
  DeleteConfirmation = () => {
    this.setState({
      IsShowTabs: false,
      ShowDeletedialog: false,
    });
    var that = this;
    var Names = [];
    this.state.SelectedList.forEach(function (item) {
      Names.push(item.displayname);
    });
    let initialData = that.state.initialContacts;
   // console.log("InitialContacts", initialData)
    let toBeDelete = that.state.SelectedList;
   // console.log("DeletingPeople", toBeDelete)
    let finalData = initialData.filter(function(objFromA) {
      return !toBeDelete.find(function(objFromB) {
        return objFromA.userId === objFromB.userId
      })
    })
  // console.log("AfterDeletingPeople", finalData)

    //  console.log("AfterDeletingPeople", initialData2 + "   " + Names)
    this.setState({
      DeletedPeopleList: [],
      SelectedList: [],
      showAlert: true,
      DisplayText: 'You are deleted ' + Names.join(','),
      IsShowTabs: false,
      IsShowTabsForMultiple: false,
      ShowDeletedialog: false,
      initialContacts: finalData
    });
    setTimeout(() => {
      this.setState({
        DisplayText: '',
        showAlert: false,
      });
    }, 10000);
    this.props.clearMyConnectionDetails();
    this.props.setMyConnectionDetails(finalData);
    //this.getInitialData();
    try {
      ServiceCalls._handleDeleteConnectedContacts(
        this.state.DeletedPeopleList,
      ).then(response => {
        if (response === 'Deleted Sucessfully') {
          //Alert.alert('Successfully deleted');
          this.setState({
            IsShowTabs: false,
            IsShowTabsForMultiple: false,
            // showAlert: true,
            //  DisplayText: 'You are deleted ' + Names.join(','),
            ShowDeletedialog: false,
          });
          that.state.DeletedPeopleList.forEach(function (data) {
            that.setState({
              MyContacts: that.state.MyContacts.filter(list => {
                return list.id !== data;
              }),
            });
            that.setState({
              SelectedList: that.state.SelectedList.filter(list => {
                return list.id !== data;
              }),
            });
          });
          this.props.clearMyConnectionDetails();
          // this.props.setMyConnectionDetails(this.state.MyContacts);
          this.props.setMyConnectionDetails(finalData);
          // this.setState({DeletedPeopleList: [],
          //                SelectedList: [],
          //                showAlert: true,
          //                DisplayText: 'You are deleted ' + Names.join(',')
          //               });
          // setTimeout(() => {
          //   this.setState({
          //     DisplayText: '',
          //     showAlert: false,
          //   });
          // }, 5000);
          this.getInitialData();
        }
      });
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleMettingPress = () => {
    Actions.ScheduleMetting({
      AttendeeData: this.state.SelectedList,
      SchedulingMeeting: true,
    });
    this.state.MyContacts.map(data => {
      data.check = false;
      this.setState({
        IsShowTabs: false,
        IsShowTabsForMultiple: false,
        DeletedPeopleList: [],
        SelectedList: [],
      });
    });
  };

  // _handleOnSharePress = () => {
  //   if (this.state.IsShowShare) {
  //     var obj = this.state.SelectedList;
  //     //  console.log("Shared user List", obj.length)
  //     let today = new Date();
  //     let date =
  //       today.getFullYear() +
  //       '-' +
  //       parseInt(today.getMonth() + 1) +
  //       '-' +
  //       today.getDate();
  //     var count = 0;
  //     if (obj.length > 1) {
  //     //  console.log("Sorry Bhau", obj.length);
  //       this.setState({
  //         IsShowTabs: false,
  //         IsShowTabsForMultiple: false,
  //         showAlert: true,
  //         DisplayText: 'You cannot share multiple business card at a time',
  //         ShowDeletedialog: false,
  //       });
  //       setTimeout(() => {
  //         this.setState({
  //           DisplayText: '',
  //           showAlert: false,
  //         });
  //       }, 5000);
  //       this.getInitialData();
  //       // createNotificationListeners();
  //     }
  //     else {
  //       for (var i = 0; i < obj.length; i++) {
  //         if (obj[i].isShareMyCard) {
  //           count = count + 1;
  //           var _data = base64.encode(`${obj[i].userId}`);
  //           obj[i].URL =
  //             global.APIURL +
  //             `BusinessCards/ShareCard?UserId=${_data}&datetime=${date}&isShare=${false}&LogInUserId=${global.LoginUserId
  //             }`;
  //         }
  //       }
  //       if (obj.length == count) {
  //         try {
  //           var that = this;
  //           //var date = new Date();
  //           //date =
  //           //date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  //           let today = new Date();
  //           let date =
  //             today.getFullYear() +
  //             '-' +
  //             parseInt(today.getMonth() + 1) +
  //             '-' +
  //             today.getDate();
  //           var obj = this.state.SelectedList;
  //           obj.forEach(function (item) {
  //             var _list = that.state.URL;
  //             var _data = base64.encode(`${item.userId}`);
  //             _list.push(
  //               global.APIURL +
  //               `BusinessCards/ShareCard?UserId=${_data}&datetime=${date}&isShare=${false}&LogInUserId=${global.LoginUserId
  //               }` +
  //               '\n',
  //             );
  //             that.setState({ URL: _list });
  //           });
  //          // console.log("Link", this.state.URL)
  //           Share.share({
  //             title: 'CHECK OUT THIS COOL NEW APP - NOBHUB',
  //             message:
  //               this.state.URL +
  //               '\n' +
  //               '\n' +
  //               'Hey! Download this awesome app from the Google Play Store/Apple App Store. You can install NobHub here: ' +
  //               '\n' +
  //               PlayStoreLink.android,
  //           })
  //             .then(this.setState({ URL: [] }))
  //             .catch(errorMsg => Alert.alert(errorMsg));
  //           //var _data = base64.encode(`${426}`);
  //         } catch (e) {
  //           Alert.alert(e);
  //         }
  //       } else {
  //         Actions.shareBusinessCard({ ShareData: obj });
  //       }
  //     }
  //   }
  //   else {
  //     Alert.alert(
  //       'Sorry this person was not gave permission to share his Business Card',
  //     );
  //   }
  // };
  _handleOnSharePress = async () => {
    const { userProfile } = this.props;
    if (this.state.IsShowShare) {
      var obj = this.state.SelectedList;
      //  console.log("Shared user List", obj.length)
      let today = new Date();
      let date =
        today.getFullYear() +
        '-' +
        parseInt(today.getMonth() + 1) +
        '-' +
        today.getDate();
      var count = 0;
      if (obj.length > 1) {
        console.log("Sorry Bhau", obj.length);
        this.setState({
          IsShowTabs: false,
          IsShowTabsForMultiple: false,
          showAlert: true,
          DisplayText: 'You cannot share multiple business card at a time',
          ShowDeletedialog: false,
        });
        setTimeout(() => {
          this.setState({
            DisplayText: '',
            showAlert: false,
          });
        }, 5000);
        this.getInitialData();
        // createNotificationListeners();
      }
      else {
        for (var i = 0; i < obj.length; i++) {
          if (obj[i].isShareMyCard) {
            count = count + 1;
            var _data = base64.encode(`${obj[i].userId}`);
            obj[i].URL =
              global.APIURL +
              `BusinessCards/ShareCard?UserId=${_data}&datetime=${date}&isShare=${false}&LogInUserId=${global.LoginUserId
              }`;
          }
        }
        if (obj.length == count) {
          try {
            var that = this;
            //var date = new Date();
            //date =
            //date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            let today = new Date();
            let date =
              today.getFullYear() +
              '-' +
              parseInt(today.getMonth() + 1) +
              '-' +
              today.getDate();
            var obj = this.state.SelectedList;
            obj.forEach(function (item) {
              var _list = that.state.URL;
              var _data = base64.encode(`${item.userId}`);
              _list.push(
                global.APIURL +
                `BusinessCards/ShareCard?UserId=${_data}&datetime=${date}&isShare=${false}&LogInUserId=${global.LoginUserId
                }` +
                '\n',
              );
              that.setState({ URL: _list });
            });
            console.log("Link", this.state.URL)
            await fetch(
              `https://tinyurl.com/api-create.php?url=${this.state.URL}`,
              {
                method: 'GET',
              },
            )
              .then((response) => response.text())
              //Response to text
              .then((responseJson) => {
                //Printing the Response String
                console.log(responseJson);
                shareOptions = {
                  title: 'CHECK OUT THIS COOL NEW APP - NOBHUB',
                  message: 'The Below Shared Business card link will expire in 48 Hours, Please install the NobHub App and connect with the user before link expires :' +
                    '\n' +
                    responseJson +
                    '\n' +
                    '\n' +
                    'Hey! Download this awesome app from the Google Play Store/Apple App Store. You can install NobHub here : ' +
                    '\n' +
                    PlayStoreLink.android +
                    '\n' +
                    '\n' +
                    'Install the app and redeem the referral code to earn points.  ' +
                    '\n' +
                    'Referral code is :' +
                    userProfile.mycode,
                  url: files.appLogo,
                  // urls: [files.image1, files.image2]
                }
                try {
                  const ShareResponse = Share.open(shareOptions);
                  console.log(JSON.stringify(ShareResponse));
                } catch (error) {
                  console.log('Error => ', error);
                }
              })
              .catch((error) => {
                //Error
                alert('Error -> ' + JSON.stringify(error));
                console.error(error);
              });
            // {
            //   shareOptions = {
            //     title: 'CHECK OUT THIS COOL NEW APP - NOBHUB',
            //     message: 'The Below Shared Business card link will expire in 48 Hours, Please install the NobHub App and connect with the user before link expires :' +
            //       '\n' +
            //       this.state.URL +
            //       '\n' +
            //       '\n' +
            //       'Hey! Download this awesome app from the Google Play Store/Apple App Store. You can install NobHub here : ' +
            //       '\n' +
            //       PlayStoreLink.android +
            //       '\n' +
            //       '\n' +
            //       'Install the app and redeem the referral code to earn points.  ' +
            //       '\n' +
            //       'Referral code is :' +
            //       userProfile.mycode,
            //     url: files.appLogo,
            //     // urls: [files.image1, files.image2]
            //   }
            //   try {
            //     const ShareResponse = await Share.open(shareOptions);
            //     console.log(JSON.stringify(ShareResponse));
            //   } catch (error) {
            //     console.log('Error => ', error);
            //   }
            // }
            // Share.share({
            //   title: 'CHECK OUT THIS COOL NEW APP - NOBHUB',
            //   message:
            //     this.state.URL +
            //     '\n' +
            //     '\n' +
            //     'Hey! Download this awesome app from the Google Play Store/Apple App Store. You can install NobHub here: ' +
            //     '\n' +
            //     PlayStoreLink.android,
            // })
            // .then(this.setState({ URL: [] }))
            //   .catch(errorMsg => Alert.alert(errorMsg));
            //var _data = base64.encode(`${426}`);
          } catch (e) {
            Alert.alert(e);
          }
        } else {
          Actions.shareBusinessCard({ ShareData: obj });
        }
      }
    }
    else {
      Alert.alert(
        'Sorry this person was not gave permission to share his Business Card',
      );
    }
  };
  _handleOnChangeText = text => {
    //  this.setState({NickName: text});
    if (text != '') {
      this.setState({ NickName: text, IsUpdate: true });
    } else {
      this.setState({ NickName: '', IsUpdate: false });
    }
  };
  _handleOnDismissPress = () => {
    this.state.MyContacts.map(data => {
      data.check = false;
      this.setState({
        IsShowTabs: false,
        IsShowDialog: false,
        DeletedPeopleList: [],
        SelectedList: [],
        IsUpdate: false,
      });
    });
  };
  _handleOnDialogCancelPress = () => {
    this.state.MyContacts.map(data => {
      data.check = false;
      this.setState({
        IsShowTabs: false,
        IsShowDialog: false,
        DeletedPeopleList: [],
      });
    });
  };
  _handleOnUpdatePress = () => {
    var obj = this.state.SelectedList;
    try {
      var dataToSend = {
        UserId: global.LoginUserId,
        Nickname: this.state.NickName,
        ToUserId: obj[0].userId,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/UpdateUserNickName', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(() => {
          this.state.MyContacts.map(data => {
            if (obj[0].userId == data.userId) {
              data.check = false;
              data.displayname =
                this.state.NickName == ''
                  ? data.name + ' ' + data.lastname
                  : this.state.NickName;
              data.nickName = this.state.NickName;
            }
            this.setState({
              IsShowTabs: false,
              IsShowDialog: false,
              DeletedPeopleList: [],
              SelectedList: [],
              IsUpdate: false,
              NickName: '',
            });
          });
          this.props.clearMyConnectionDetails();
          this.props.setMyConnectionDetails(this.state.MyContacts);

          //this.getInitialData();
        })
        .catch(error => Alert.alert(error));
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleOnChatPress = () => {
    var obj = this.state.SelectedList;
    if (obj.length > 1) {
      Actions.ChatGroups({
        GroupIDs: this.state.DeletedPeopleList,
        Gruopcount: obj.length,
        swipeablePanelActive: true,
        isFromGroups: true
      });
    } else {
      Actions.chattingUI({
        TouserId: this.state.DeletedPeopleList,
        GrpORConatctName: obj.name + ' ' + obj.lastname,
        Img: obj.image,
        initials: obj.initials,
        ChannelId: 0,
      });
    }
  };
  NormalGroupIconpress = () => {
    var Ids = Array.prototype.map
      .call(this.state.SelectedList, function (item) {
        return item.userId;
      })
      .join(',');
    Actions.groups({
      ConnectedMemberIds: Ids,
      ConnectedMemberIdsCount: this.state.DeletedPeopleList.length,
      defaultAnimationDialog: true,
      isfromMyConnection: true
    });
    this.state.MyContacts.map(data => {
      data.check = false;
      this.setState({
        IsShowTabs: false,
        IsShowTabsForMultiple: false,
        DeletedPeopleList: [],
        SelectedList: [],
      });
    });
  };
  _handleHeaderProfileIcon = () => {
    return null;
  };
  _handleHeaderLeftIcon = () => {
    return (
      <View>
        <View style={styles.leftHeader}>
          <BottomGroupIcon
            style={{ color: CommonStyles.appColor, fontSize: 20 }}
          />
        </View>
        <Text style={{ color: '#ffffff', fontSize: 10, textAlign: 'center' }}>
          Groups
        </Text>
      </View>
    );
  };
  _handleHeaderRightIcon = () => {
    const { userProfile } = this.props;
    return (
      <View>
        <View>
          <CustomMenuIcon
            menutext="Menu"
            menuStyle={styles.customMenu}
            //Menu Text Style
            textStyle={styles.textMenu}
            //Click functions for the menu items
            option1Click={() => {
              const { userProfile } = this.props;
              const UserId = userProfile.guid;
              const Mobile = userProfile.mobile;
              var CountryCode = userProfile.countryCode;
              Actions.profileBusiness({
                UserId: UserId,
                Mobile: Mobile,
                CountryCode: CountryCode,
                FirstName: userProfile.name + ' ' + userProfile.lastname,
                Title: userProfile.title,
              });
            }}
            option2Click={() => {
              Actions.businessCard({ userProfile: userProfile });
            }}
            option3Click={() => {
              Actions.myConnections();
            }}
            option4Click={() => {
              Actions.qrCode({ userProfile: userProfile });
            }}
            option5Click={() => {
              Actions.referAfriend({
                userProfile: userProfile,
              });
            }}
            option6Click={() => {
              Actions.rateUs({ userProfile: userProfile });
            }}
            option7Click={() => {
              Actions.settings({
                UserId: userProfile.guid,
                IsShow: userProfile.sharecard,
                UserProfile: userProfile,
              });
            }}
            option8Click={() => {
              Actions.helpCenter({ userProfile: userProfile });
            }}
            option9Click={() => {
              Actions.premierMembership({ userProfile: userProfile });
            }}
            userProfile={userProfile}
            IsProfile={true}
            iconColor={'#ffffff'}
          />
        </View>
        <Text style={{ color: '#ffffff', fontSize: 10, textAlign: 'center' }}>
          Profile
        </Text>
      </View>
    );
  };
  _handleHeaderCenterIcon = () => {
    return (
      <View
        style={[
          styles.headerCenterView,
          { width: Dimensions.get('window').width * 0.56 },
        ]}>
        <View
          style={{
            //flex: 0.4,
            paddingTop: 10,
            marginLeft: 8,
          }}>
          <Search style={styles.iconSearch} />
        </View>
        <View style={{ flex: 1.8 }}>
          <TextInput
            //underlineColor="transparent"
            underlineColorAndroid={'rgba(0,0,0,0)'}
            placeholder={this.state.TextInputPlaceHolder}
            placeholderTextColor={'#a9a9a9'}
            style={styles.TextInputStyleClass}
            onChangeText={value => this._handleMyContactSearch(value)}
            onFocus={() => this._handleOnTextBoxFocus()}
            value={this.state.SearchValue}
            onKeyPress={({ nativeEvent }) => {
              this._handleOnkeyPress(nativeEvent);
              //nativeEvent.key === 'Backspace' ? Keyboard.dismiss() : '';
            }}
          />
        </View>
        <View style={styles.viewScanner}>
          {this.state.IsCancel ? (
            <TouchableOpacity onPress={() => this._handleClearPress()}>
              <Cancel style={[styles.icnScanner, { color: '#a9a9a9' }]} />
            </TouchableOpacity>
          ) : null}
          {this.state.IsScan ? (
            <TouchableOpacity onPress={() => this._handleOnScannerPress()}>
              <Scan style={styles.icnScanner} />
            </TouchableOpacity>
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
  _handleHeaderLeftIconPress = () => {
    const { userProfile } = this.props;
    Actions.groups({ UserId: userProfile.guid });
  };
  _handleHeaderText = () => {
    return null;
  };

  render() {
    const { userProfile, myConnectionDetails } = this.props;
    // if (this.state.MyContacts.length === 0 && userProfile !== null) {
    //   this.getInitialData();
    // } else if (userProfile === null && this.state.MyContacts.length !== 0) {
    //   this.setState({MyContacts: []});
    // }
    return (
      <View style={{ flex: 1, backgroundColor: '#f4f6f9' }}>
        {/* Header View */}
        <StatusBar translucent backgroundColor="transparent" />
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
        {/* Success Text View */}
        {this.state.ShownoOfRes ? (
          <View>
            <Text
              style={{
                fontSize: 17,
                color: GilRoyMediumColor.fontColor,
                marginBottom: 15,
              }}>
              Found Contacts({this.state.SearchCount})
            </Text>
          </View>
        ) : null}
        {this.state.showAlert ? (
          <View style={{ textAlign: "center", marginTop: 10 }}>
            <Text style={{ textAlign: "center" }}>{this.state.DisplayText}</Text>
          </View>
        ) : null}
        {/* Connected people View */}
        <View style={{ flex: 1 }}>
          <MyConnections
            IsShow={this.state.IsShow}
            IsContact={this.state.IsContact}
            //MyContacts={myConnectionDetails}
            MyContacts={this.state.initialContacts}
            ScannedCardDetails={this.state.ScannedCardDetails}
            onContactPress={contactData =>
              this._handleContactPress(contactData)
            }
            OnLongPress={contactData => this._handleOnLongPress(contactData)}
            AssigntoGroups={contactData =>
              this._handleAssigntoGroups(contactData)
            }
            onNearByProfilePress={this._handleNearByPress}
            onInvitePeoplePress={this._handleOnInvitePeoplePress}
            onScannerPress={this._handleOnScannerPress}
            userProfile={userProfile}
            onInvitePress={this._handleOnInvitePress}
            onMyContactSearch={value => this._handleMyContactSearch(value)}
            selectedList={this.state.SelectedList}
            IsMultiSelect={this.state.IsMultiSelect}
            backGroundColor={this.state.backGroundColor}
            InviteTabColor={this.state.InviteTabColor}
            NearByTabColor={this.state.NearByTabColor}
            InviteIconColor={this.state.InviteIconColor}
            NearByIconColor={this.state.NearByIconColor}
            SearchValue={this.state.SearchValue}
            IsCancel={this.state.IsCancel}
            onCancelPress={this._handleClearPress}
            IsScan={this.state.IsScan}
            OnTextBoxFocus={this._handleOnTextBoxFocus}
            TextInputPlaceHolder={this.state.TextInputPlaceHolder}
            InvitationText={this.state.HasInvitation}
            IsShowTabs={this.state.IsShowTabs}
            IconColor={this.state.IconColor}
            OnNormalGropusPress={this.NormalGroupIconpress}
            onClosePress={this._handleOnClosePress}
            onDeletePress={this._handleOnDeletePress}
            OnMeetingPress={this._handleMettingPress}
            onSharePress={this._handleOnSharePress}
            onEditPress={Name => this._handleOnEditPress(Name)}
            SelectedContacts={this.state.DeletedPeopleList}
            IsShowDialog={this.state.IsShowDialog}
            onUpdatePress={this._handleOnUpdatePress}
            onDismissPress={this._handleOnDismissPress}
            onDialogCancelPress={this._handleOnDialogCancelPress}
            NickName={this.state.NickName}
            onChangeText={text => this._handleOnChangeText(text)}
            //IsNoRecords={this.state.IsNoRecords}
            IsShowTabsForMultiple={this.state.IsShowTabsForMultiple}
            onChatPress={this._handleOnChatPress}
            IsUpdate={this.state.IsUpdate}
            // ShowAlert={this.state.showAlert}
            // DisplayText={this.state.DisplayText}
            IsShowShare={this.state.IsShowShare}
            IsNickName={this.state.IsNickName}
          />
        </View>
        {/* Footer View */}
        <View style={{ flex: 0.13 }}>
          <Footer />
        </View>
        {/* Scan View */}
        <SwipeablePanelView
          onScanCardPress={this._handleScanCard}
          onViewScanCardPress={this._handleViewScannedCards}
          onCancelPress={this.closePanel}
          swipeablePanelActive={this.state.swipeablePanelActive}
        />
        {/* Delete success popup View */}
        <Dialog
          onTouchOutside={this._handleOnClose}
          onHardwareBackPress={this._handleOnClose}
          onDismiss={() => {
            this.setState({ ShowDeletedialog: false });
          }}
          width={0.9}
          height={0.39}
          visible={this.state.ShowDeletedialog}
          rounded
          actionsBordered
          dialogTitle={
            <DialogTitle
              titleAlign={'center'}
              style={{ borderBottomWidth: 1 }}
              title={'Are you sure you want to delete?'}
              hasTitleBar={true}
              align="center"
            />
          }
          footer={
            <DialogFooter style={{ borderColor: '#ffffff' }}>
              <DialogButton
                text="No"
                style={styles.DialogYesORNo}
                textStyle={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}
                onPress={() => {
                  this._handleOnClosePress();
                }}
                key="button-1"
              />
              <DialogButton
                text={'Yes'}
                style={styles.DialogYesORNo}
                textStyle={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}
                onPress={() => {
                  this.DeleteConfirmation();
                }}
                key="button-2"
              />
            </DialogFooter>
          }>
          <DialogContent style={{ height: 90 }}>
            <Text style={{ fontSize: 18, marginTop: 10 }}>
              While deleting, Person will no longer appear anywhere. Still you
              want to delete?
            </Text>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    userProfile: state.user.userProfile,
    myConnectionDetails: state.MyConnections.myConnectionDetails,
  };
};
const mapDispatchToProps = {
  setMyConnectionDetails,
  clearMyConnectionDetails,
  setUserProfile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyConnectionsContainer);
const styles = StyleSheet.create({
  headerViewMenu: { flex: 1, marginLeft: 20 },
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
    //left: 10,
    // width:250
  },
  icnScanner: { color: CommonStyles.appColor, fontSize: 16 },
  viewScanner: {
    flex: 0.3,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    //marginTop: 5,
    //marginRight: 10,
    zIndex: 999,
    right: Platform.OS == 'android' ? 10 : 20,
  },
  iconSearch: { flex: 1, fontSize: 17, color: '#a9a9a9' },
  TextInputStyleClass: {
    flex: 2,
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
  DialogYesORNo: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
    height: 40,
    marginTop: 35,
    margin: 10,
    backgroundColor: CommonStyles.appColor,
  },
});
