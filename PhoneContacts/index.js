import React, { Component } from 'react';
import {
  View,
  PermissionsAndroid,
  FlatList,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  Dimensions,
} from 'react-native';
import Contacts from 'react-native-contacts';
import Share from 'react-native-share';
import files from '../files/filesBase64';
import CommonHeader from '../shared/CommonHeader';
import { ArrowLeft, Search, Cancel } from '../shared/Icon';
import { goBack } from '../Services/BackButtonServices';
import { connect } from 'react-redux';
import { Thumbnail } from 'native-base';
import { PlayStoreLink, GilRoyMediumColor } from '../shared/Constants';
import { CommonStyles } from '../shared/Constants';
import { Text, MediumBoldText, BoldText } from '../shared/Text';
const colors = [
  '#27BECF', '#994F14', '#DA291C', '#FFCD00', '#007A33', '#EB9CA8', '#7C878E',
  '#8A004F', '#000000', '#10069F', '#00a3e0', '#4CC1A1', '#915520', '#b3d962',
  '#67a8e0', '#c06dde', '#1ec952', '#cc1f36', '#0b615f', '#911c16'
]
class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PhoneContacts: [],
      count: '',
      tempContacts: [],
      IsCancel: false,
      SearchValue: '',
      idList: [],
      connectedUserContacts: [],
      pcontacts: [],
      NobHubUsers: [],
      buttonText: "",
    };
  }
  componentDidMount = () => {
    try {
      var that = this;
      //Checking for the permission just after component loaded
      async function requestCameraPermission() {
        //Calling the permission function
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts',
            message: 'This app would like to view your contacts.',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          that.loadContacts();
        } else {
          alert('CAMERA Permission Denied.');
        }
      }
      if (Platform.OS === 'android') {
        requestCameraPermission();
      } else {
        this.loadContacts();
      }
      this.GetNobHubUsers();
    } catch (e) {
      Alert.alert(e);
    }
  };

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
          //console.log("Database Users", responseJson && responseJson.length > 0 ? responseJson.map(x => x.mobile) : null)
          this.setState({
            NobHubUsers: responseJson,
            connectedUserContacts: responseJson && responseJson.length > 0 ?
              responseJson.map(x => x.mobile) : [],
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
    //console.log("alluser",);
  };

  loadContacts() {
    try {
      Contacts.getAll((err, fetchedContactsList) => {
        //console.log("contact", fetchedContactsList.map(y => y.phoneNumbers.map(x => x.number)).flat());
        this.setState({ pcontacts: fetchedContactsList.map(y => y.phoneNumbers.map(x => x.number)).flat() })
        if (err === 'denied') {
        } else {
          let contactsList = null;
          let data = [];
          contactsList = fetchedContactsList;
          //console.log("mobile", contactsList[0]);
          contactsList.map(val => {
            if (val.recordID) {
              //console.log("Number",val);
              let tempObject = { phoneNumbers: val.phoneNumbers.map(x => x.number) }
              //console.log("Number",tempObject);
              if (val.givenName && !val.middleName && !val.familyName) {
                tempObject = {
                  ...tempObject,
                  name: val.givenName,
                  id: val.recordID,
                  familyName: val.familyName,
                  givenName: val.givenName
                };
                data.push(tempObject);
              } else if (val.givenName && val.middleName && !val.familyName) {
                tempObject = {
                  ...tempObject,
                  name: val.givenName + ' ' + val.middleName,
                  id: val.recordID,
                  familyName: val.familyName,
                  givenName: val.givenName
                };
                data.push(tempObject);
              } else if (val.givenName && !val.middleName && val.familyName) {
                tempObject = {
                  ...tempObject,
                  name: val.givenName + ' ' + val.familyName,
                  id: val.recordID,
                  familyName: val.familyName,
                  givenName: val.givenName
                };
                data.push(tempObject);
              } else if (val.givenName && val.middleName && val.familyName) {
                tempObject = {
                  ...tempObject,
                  name:
                    val.givenName + ' ' + val.middleName + ' ' + val.familyName,
                  id: val.recordID,
                  familyName: val.familyName,
                  givenName: val.givenName
                };
                data.push(tempObject);
              } else if (!val.givenName && val.middleName && !val.familyName) {
                tempObject = {
                  ...tempObject,
                  name: val.middleName,
                  id: val.recordID,
                  familyName: val.familyName,
                  givenName: val.givenName
                };
                data.push(tempObject);
              } else if (!val.givenName && val.middleName && val.familyName) {
                tempObject = {
                  ...tempObject,
                  name: val.middleName + ' ' + val.familyName,
                  id: val.recordID,
                  familyName: val.familyName,
                  givenName: val.givenName
                };
                data.push(tempObject);
              } else if (!val.givenName && !val.middleName && val.familyName) {
                tempObject = {
                  ...tempObject,
                  name: val.familyName,
                  id: val.recordID,
                  familyName: val.familyName,
                  givenName: val.givenName
                };
                data.push(tempObject);
              }
              // else if (val.number) {
              //   console.log("number", val.number);
              //   let tempObject = {
              //     name: val.number,
              //     id: val.recordID,
              //   };
              //   data.push(tempObject);
              // }
            }
          });
          data.sort((a, b) => {
            if (a.name > b.name) {
              return 1;
            }
            if (b.name > a.name) {
              return -1;
            }
            return 0;
          });

          this.setState({ PhoneContacts: data, tempContacts: data });
        }
      });
    } catch (e) {
      Alert.alert(e);
    }
  }
  _handleHeaderLeftIcon = () => {
    return (
      <View accessibilityLabel="phoneContactsBackArrowView" accessible={true} style={styles.leftHeader}>
        <ArrowLeft accessibilityLabel="phoneContactsBackArrow" accessible={true} style={{ color: CommonStyles.appColor, fontSize: 20 }} />
      </View>
    );
  };
  _handleHeaderCenterIcon = () => {
    return (
      <View style={styles.headerCenterView}>
        <View
          style={{
            flex: 0.1,
            paddingTop: 10,
            marginLeft: 8,
            flexDirection: 'row',
          }}>
          <Search style={styles.iconSearch} />
        </View>
        <View accessibilityLabel="phoneContactsNameView" accessible={true} style={{ flex: 0.7 }}>
          <TextInput
            accessibilityLabel="phoneContactsName"
            accessible={true}
            //underlineColor="transparent"
            underlineColorAndroid={'rgba(0,0,0,0)'}
            placeholder={'Name'}
            placeholderTextColor={'#a9a9a9'}
            style={styles.TextInputStyleClass}
            onChangeText={value => this.onMyContactSearch(value)}
            onFocus={() => this._handleOnFocus()}
            value={this.state.SearchValue}
            onKeyPress={({ nativeEvent }) => {
              this._handleOnkeyPress(nativeEvent);
            }}
          />
        </View>
        <View accessibilityLabel="phoneContactsCancelView" accessible={true} style={styles.viewScanner}>
          {this.state.IsCancel ? (
            <TouchableOpacity accessibilityLabel="phoneContactsCancel" accessible={true} onPress={() => this._handleClearPress()}>
              <Cancel style={styles.icnScanner} />
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
  _handleClearPress = () => {
    this.onMyContactSearch('');
    Keyboard.dismiss();
    this.setState({
      SearchValue: '',
      IsCancel: false,
    });
  };
  _handleOnFocus = () => {
    this.setState({ IsCancel: true });
  };
  _handleHeaderRightIcon = () => {
    return null;
  };
  _handleHeaderLeftIconPress = () => {
    const { handleGoBack } = this.props;
    handleGoBack();
  };
  // InvitePhoneFriend = () => {
  //   const { UserProfile } = this.props;
  //   Share.share({
  //     title: 'CHECK OUT THIS COOL NEW APP - NOBHUB',
  //     message:
  //       'Hey! Download this awesome app from the Google Play Store/Apple App Store. You can install NobHub here: ' +
  //       '\n' +
  //       PlayStoreLink.android +
  //       '\n' +
  //       'Referral code is :' +
  //       UserProfile.mycode,
  //   })
  //     .then(() => { })
  //     .catch(errorMsg => Alert.alert(errorMsg));
  // };
  InvitePhoneFriend = async () => {
    const { UserProfile } = this.props;
    const shareOptions = {
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
      const ShareResponse = await Share.open(shareOptions);
      console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      console.log('Error => ', error);
    }
  };

  onMyContactSearch = value => {
    var searchItems = value
      .trim()
      .toLowerCase()
      .split(' ');
    console.log("SearchItem", searchItems)
    this.setState({ SearchValue: value, IsCancel: true });
    value = value.trim().toLowerCase();
    var myContacts = [];
    myContacts = this.state.tempContacts.filter(contact => {
      if (
        searchItems.filter(
          x =>
            (contact.name != null && contact.name.toLowerCase().indexOf(x) === 0)
        ).length > 0
      ) {
        return true;
      }
    });
    // (users => {
    //   if (users.name != null && users.name.toLowerCase().match(value)) {
    //     return true;
    //   }
    // });
    this.setState({ PhoneContacts: myContacts });
    if (value === '') {
      this.setState({ IsCancel: false });
    }
  };
  formatMobileNumber = (value) => {
    //var value = "+91 99 16 489165";
    var mobile = "";
    //First remove all spaces:
    //value = value.split(/\s+/).join('');
    value = value.replace(/-|\s/g, "").replace(/^0+/, '');
    // temp = value.replace(/\s\s+/g,'');
    // mobile = temp;
    //splitValues= value.split(' ')

    // If there is a countrycode, this IF will remove it..
    if (value.startsWith("+")) {
      var temp = value.substring(3, value.length);
      // mobile = "0" + temp;
      mobile = temp;
      //Mobile number:
      //console.log(mobile);
    }
    // If there is no countrycode, only remove spaces
    else {
      mobile = value;
      //Mobile number:
      //console.log(mobile);
    }
    return mobile;
  }
  _handleHeaderText = () => {
    return (
      <View>
        <BoldText style={{ color: '#ffffff', fontSize: 14 }}>
          Phone Contacts
        </BoldText>
      </View>
    );
  };
  _handleHeaderProfileIcon = () => {
    return null;
  };
  getButtonText = (item) => {
    //console.log("phoneNumbers", item.phoneNumbers.map(x => this.formatMobileNumber(x)))
    //console.log("connectedUserContacts", this.state.connectedUserContacts.map(x => this.formatMobileNumber(x)));
    //console.log("pcontacts", item.phoneNumbers.map(x => this.formatMobileNumber(x)));
    // let result = -1
    // if (this.state.pcontacts.map(x => this.formatMobileNumber(x))
    //   .some(y => this.state.connectedUserContacts.includes(y))) { result = true } else { result = false }
    // console.log("Result", this.state.pcontacts.map(x => this.formatMobileNumber(x))
    //   .some(y => this.state.connectedUserContacts.includes(y)));
    // item.phoneNumbers.forEach((phone) => {
    // for (let i = 0; i < item.phoneNumbers.length; i++) {
    //   result = this.state.connectedUserContacts.map(x => this.formatMobileNumber(x))
    //     .indexOf(this.formatMobileNumber(item.phoneNumbers[i]));
    //   if (result > -1) { break; }
    // }
    let requiredPhoneNumbers = item.phoneNumbers.map(x => this.formatMobileNumber(x))
    let phoneBookNumbers = this.state.pcontacts.map(x => this.formatMobileNumber(x));
    let result = this.state.connectedUserContacts.map(x => this.formatMobileNumber(x))
      .some(item => requiredPhoneNumbers.indexOf(item) > -1)

    // let result = this.state.connectedUserContacts.map(x => this.formatMobileNumber(x))
    //   .some(item => this.state.pcontacts.map(x => this.formatMobileNumber(x)).indexOf(item) >= 0)

    if (result) {
      //this.setState({ buttonText: "Connected" });
      return 'Connected'
    }
    else {
      return 'Invite'
    }
    //    //  console.log("result", result);
    // console.log("DatabaseResult", this.state.connectedUserContacts.length);
    //  return result > -1 ? 'Connected' : 'Invite'
  }

  InvitationsStyle = ({ item, index }) => {
    //console.log("Item",item.phoneNumbers)
    // let initialName = item.name.split(" ");
    //   let initialNameData = initialName.length>0 ? (initialName[0].charAt(0).toUpperCase()) : initialName[0].charAt(0).toUpperCase();
    //console.log("Item", item)
    var name = item.givenName && item.givenName !== null && item.givenName !== undefined ? item.givenName : '';
    var lastName = item.familyName == null ? '' : item.familyName;
    var firstCharInName =
      name === null ? '' : name.toUpperCase().charAt(0);
    var firstCharInLastName =
      lastName === null ? '' : lastName.toUpperCase().charAt(0);
    return (
      //console.log("Item",item.number)
      <View style={styles.PhoneView}>
        <View style={styles.displayView}>
          <View style={{ flex: 0.17 }}>
            {/* <Thumbnail
            medium
            source={require('../Images/ProfileIcon.png')}
          /> */}
            {item.image != '' && item.image != null ? (
              <Image
                source={{
                  uri: global.APIURL + 'uploadimgs/ProfilePictures/' + item.image,
                }}
                style={[styles.fab]}
              />
            ) : (
              <View style={[styles.name, { backgroundColor: colors[index % colors.length] }]}>
                <Text
                  style={{
                    fontSize: 26,
                    color: '#ffffff',
                    textAlign: 'center',
                  }}>
                  {firstCharInName + firstCharInLastName}
                </Text>
              </View>
            )}
          </View>
          <View style={{ flex: 0.50, alignSelf: 'center' }}>
            <MediumBoldText
              style={{
                color: GilRoyMediumColor.fontColor,
                fontSize: 18,
              }}>
              {item.name}
            </MediumBoldText>
          </View>
          <>
            {/* <View style={styles.touchableMessage1}>
                         <TouchableOpacity onPress={() => this.InvitePhoneFriend()}>
                <Text style={styles.buttonText1}>{this.getButtonText(item)}</Text>
              </TouchableOpacity>
            </View> */}

            {this.getButtonText(item) === "Connected" ? (
              <View style={styles.touchableMessage1}>
                <TouchableOpacity onPress={() => alert("Already Connected !")}>
                  <Text style={styles.buttonText}>{this.getButtonText(item)}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.touchableMessage1}>
                <TouchableOpacity onPress={() => this.InvitePhoneFriend()}>
                  <Text style={styles.buttonText1}>Invite</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        </View>
      </View >
    );
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f4f6f9' }}>
        <View style={{ flex: 0.18 }}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
            HeaderRightIcon={() => this._handleHeaderRightIcon()}
            HeaderLeftIconPress={this._handleHeaderLeftIconPress}
            HeaderText={() => this._handleHeaderText()}
            HeaderProfileIcon={() => this._handleHeaderProfileIcon()}
            HeaderProfileIconPress={this._handleHeaderProfileIconPress}
            IsShowTextForTabs={false}
          />
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            showsVerticalScrollIndicator={true}
            numColumns={1}
            data={this.state.PhoneContacts}
            renderItem={(item, index) => this.InvitationsStyle(item, index)}
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
)(Contact);
const styles = StyleSheet.create({
  displayView: {
    flex: 1,
    //backgroundColor: '#ffff',
    //padding: 10,
    //marginVertical: 5,
    //marginHorizontal: 18,
    marginBottom: 8,
    //  borderBottomWidth: 1,
    flexDirection: 'row',
    // borderColor: 'red',
  },
  PhoneView: {
    borderBottomWidth: 1,
    margin: 8,
    borderColor: '#e0e0e0',
  },
  iconSearch: { flex: 1, fontSize: 17, color: '#a4a6a9' },
  TextInputStyleClass: {
    flex: 2,
  },
  buttonStyle: {
    flex: 0.4,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: CommonStyles.appColor,
    borderColor: CommonStyles.appColor,
    paddingTop: 15,
  },
  touchableMessage: {
    borderWidth: 1,
    backgroundColor: CommonStyles.appColor,
    flex: 0.2,
    //borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
    borderRadius: 30,
    borderColor: '#ffffff',
  },
  touchableMessage1: {
    borderWidth: 1,
    backgroundColor: CommonStyles.appColor,
    flex: 0.3,
    //borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
    borderRadius: 30,
    borderColor: '#ffffff',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  buttonText1: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
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
  viewScanner: {
    flex: 0.2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    right: Platform.OS == 'android' ? 10 : 20,
  },
  headerCustomMenu: {
    marginRight: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 100,
  },
  icnScanner: { color: '#a9a9a9', fontSize: 16 },
  headerCenterView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: Dimensions.get('window').width * 0.56,
  },
  fab: {
    height: 55,
    width: 55,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 26,
    color: '#ffffff',
    height: 55,
    width: 55,
    borderRadius: 110,
    backgroundColor: CommonStyles.appColor,
    justifyContent: 'center',
  },
});