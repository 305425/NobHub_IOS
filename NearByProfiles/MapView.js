import React, { Component } from 'react';
import {
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  PermissionsAndroid,
  Platform,
  Keyboard,
  Text,
  Dimensions,
  BackHandler, Image,
} from 'react-native';
import CommonHeader from '../shared/CommonHeader';
import { styles } from './MapView.styles';
import { Cancel, Search, ArrowLeft, Person, MenuListIcon, BottomChatIcon, PlusCircle } from '../shared/Icon';
import { CommonStyles, GilRoyMediumColor } from '../shared/Constants';
//import MapView from 'react-native-maps';
import MapView from "react-native-map-clustering";
import { Marker } from 'react-native-maps';
import { Thumbnail } from 'native-base';
import { goBack } from '../Services/BackButtonServices';
import { connect } from 'react-redux';
import UserSwipableView from './SwipableUserView';
import { Actions } from 'react-native-router-flux';
import GetLocation from 'react-native-get-location';
import Updatenearbystatus from '../Services/UpdateNearbystatus';
import { AlertClass } from '../shared/CustomAlert';
import ServiceCalls from '../Services/APICalls';
import Modal from 'react-native-modal';
import Hyperlink from 'react-native-hyperlink';
import Mailer from 'react-native-mail';
import { MediumBoldText, BoldText } from '../shared/Text';
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
class MapViewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TextInputPlaceHolder: 'Search...',
      IsCancel: false,
      SearchValue: '',
      currentLatitude: 0,
      currentLongitude: 0,
      UserSwipableView: false,
      // SelectedData: [],
      SelectedData: {},
      showAlert: false,
      SuccessText: '',
      SureWantToDelete: false,
      BlockedChannelId: 0,
      BlockedUserId: 0,
      NearByProfiles: [],
      tempNearByProfiles: [],
    };
    global.MapView = this;
    BackHandler.addEventListener('hardwareBackPress', this.back_Button_Press);
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
    Actions.myConnections();
  };
  componentDidMount = () => {
    var that = this;
    //Checking for the permission just after component loaded
    if (Platform.OS === 'ios') {
      this.callLocation();
    } else {
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            that.callLocation(that);
          } else {
            alert('Permission Denied');
          }
        } catch (err) {
          Alert.alert('err', err);
        }
      }
      requestLocationPermission();
    }
  };
  callLocation() {
    var that = this;
    try {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then(location => {
          console.log("Location", JSON.stringify(location.longitude) + "   " + JSON.stringify(location.latitude))
          const currentLongitude = JSON.stringify(location.longitude);
          const currentLatitude = JSON.stringify(location.latitude);
          that.setState({ currentLongitude: currentLongitude });
          that.setState({ currentLatitude: currentLatitude });
          this.GetNearbyProfiles(currentLongitude, currentLatitude);
        })
        .catch(error => {
          const { code, message } = error;
          console.log("LocationError", message)
        });
    } catch (e) {
      Alert.alert(e);
    }
  }
  GetNearbyProfiles(long, lat) {
    var dataToSend = {
      UserId: global.LoginUserId,
      newLat: lat,
      newLang: long,
      Dist_Unit: 'M',
    };
    console.log("LocationdataToSend", dataToSend)
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
        console.log("Users", responseJson.length)
        this.setState({
          NearByProfiles: responseJson,
          tempNearByProfiles: responseJson,
        });
      });
  }
  _handleHeaderLeftIcon = () => {
    return (
      <View style={styles.leftHeader}>
        <ArrowLeft style={{ color: CommonStyles.appColor, fontSize: 20 }} />
      </View>
    );
  };
  _handleHeaderRightIcon = () => {
    return (
      <View>
        <View style={styles.leftHeader}>
          <MenuListIcon style={{ color: CommonStyles.appColor }} />
        </View>
        <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: 10 }}>
          ListView
        </Text>
      </View>
    );
  };
  _handleHeaderRightIconPress = () => {
    const { userProfile } = this.props;
    Actions.nearByProfilesPage({ userProfile: userProfile });
  };
  _handleHeaderCenterIcon = () => {
    // return (
    //   <View style={styles.headerCenterView}>
    //     <View
    //       style={{
    //         flex: 0.2,
    //         paddingTop: 10,
    //         marginLeft: 8,
    //         flexDirection: 'row',
    //       }}>
    //       <Search style={styles.iconSearch} />
    //     </View>
    //     <View style={{flex: 1.5}}>
    //       <TextInput
    //         underlineColor="transparent"
    //         placeholder={this.state.TextInputPlaceHolder}
    //         placeholderTextColor={'#a9a9a9'}
    //         style={styles.TextInputStyleClass}
    //         onChangeText={value => this.onMyContactSearch(value)}
    //         onFocus={() => this._handleOnTextInputFocus()}
    //         value={this.state.SearchValue}
    //         onKeyPress={({nativeEvent}) => {
    //           this._handleOnkeyPress(nativeEvent);
    //           //nativeEvent.key === 'Backspace' ? Keyboard.dismiss() : '';
    //         }}
    //       />
    //     </View>
    //     <View style={styles.viewScanner}>
    //       {this.state.IsCancel ? (
    //         <View style={{flex: 0.8, marginTop: 10}}>
    //           <TouchableOpacity onPress={() => this._handleClearPress()}>
    //             <Cancel style={styles.icnScanner} />
    //           </TouchableOpacity>
    //         </View>
    //       ) : null}
    //     </View>
    //   </View>
    // );
    return (
      <View>
        <Text style={{ color: '#ffffff', fontSize: 18, top: 10 }}>Nearby</Text>
      </View>
    );
  };
  onMyContactSearch = value => {
    var searchItems = value
      .trim()
      .toLowerCase()
      .split(' ');
    this.setState({ SearchValue: value, IsCancel: true });
    value = value.trim().toLowerCase();
    var myNearByUsers = [];
    myNearByUsers = this.state.tempNearByProfiles.filter(contact => {
      if (
        searchItems.filter(
          x =>
            (contact.fullName != null &&
              contact.fullName.toLowerCase().includes(x)) ||
            (contact.mobile != null &&
              contact.mobile.toLowerCase().includes(x)) ||
            (contact.companyname != null &&
              contact.companyname.toLowerCase().includes(x)) ||
            (contact.title != null &&
              contact.title.toLowerCase().includes(x)) ||
            (contact.userAddress != null &&
              contact.userAddress.toLowerCase().includes(x)) ||
            (contact.profession != null &&
              contact.profession.toLowerCase().includes(x)),
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
  _handleOnkeyPress = Element => {
    if (Element.key === 'Backspace') {
      if (this.state.SearchValue.length == 0) {
        Keyboard.dismiss();
      }
    }
  };
  _handleClearPress = () => {
    //this.onMyContactSearch('');
    Keyboard.dismiss();
    this.setState({
      SearchValue: '',
      IsCancel: false,
      TextInputPlaceHolder: 'Company/location/Title',
    });
  };
  _handleOnTextInputFocus = () => {
    this.setState({
      IsCancel: true,
      TextInputPlaceHolder: 'Company/location',
    });
  };

  // _handleHeaderLeftIconPress = () => {
  //   const {handleGoBack} = this.props;
  //   handleGoBack();
  // };
  _handleHeaderText = () => {
    return null;
  };
  _handleOnImagePress = item => {
    console.log("User", item)
    this.setState({ UserSwipableView: true, SelectedData: item });
  };
  _handleOnInvitePress = data => {
    this.setState({ UserSwipableView: false });
    var Ids = '';
    if (data.userid != 0) {
      Ids = data.userid;
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
            SuccessText: 'Invitation sent successfully to ' + data.name,
          });
          setTimeout(() => {
            this.setState({
              SuccessText: '',
              showAlert: false,
            });
          }, 5000);
        });
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleOnClosePress = () => {
    this.setState({ UserSwipableView: false });
  };
  _handleOnChatPress = data => {
    this.setState({ UserSwipableView: false });
    Actions.chattingUI({
      TouserId: data.userid,
      FromUserId: global.LoginUserId,
      GrpORConatctName: data.name + ' ' + data.lastName,
      Img: data.image,
      ChannelId: 0,
      isBlocked: this.state.SelectedData.isChatblocked
    });
  };
  _handleHeaderProfileIcon = () => {
    return null;
  };
  _handleHeaderLeftIconPress = () => {
    const { handleGoBack } = this.props;
    this.back_Button_Press();
    // handleGoBack();
    Actions.myConnections();
  };
  onMapPress(e) {
    var that = this;
    global.MapView.setState({
      currentLatitude: e.nativeEvent.coordinate.latitude,
      currentLongitude: e.nativeEvent.coordinate.longitude,
    });
    // that.setState({
    //   currentLatitude: e.nativeEvent.coordinate.latitude,
    //   currentLongitude: e.nativeEvent.coordinate.longitude,
    // });
    Updatenearbystatus.updateNearbyStatus(
      global.IsNearBy,
      e.nativeEvent.coordinate.longitude,
      e.nativeEvent.coordinate.latitude,
    );
    global.MapView.GetNearbyProfiles(
      e.nativeEvent.coordinate.longitude,
      e.nativeEvent.coordinate.latitude,
    );
    global.MapView._handleRenderMapView();
  }
  UnBlock = item => {
    this.setState({
      UserSwipableView: false,
      SureWantToDelete: true,
      BlockedChannelId: item.channelid,
      BlockedUserId: item.userid,
    });
  };
  ConfirmUnBlock = () => {
    // console.log("blockusers",this.state.SelectedData.channelid + "  " +this.state.BlockedUserId )
    let item = this.state.SelectedData;
    try {
      ServiceCalls.BlockORUnBlock(
        this.state.SelectedData.channelid,
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
          Alert.alert(error);
        });
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleRenderMapView = () => {
    return (
      <View style={styles.MainContainer}>
        <MapView
          clusteringEnabled={true}
          style={styles.mapStyle}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          followsUserLocation={true}
          loadingEnabled={true}
          toolbarEnabled={true}
          zoomEnabled={true}
          zoomControlEnabled={true}
          onPress={this.onMapPress}
          //onRegionChangeComplete={this.onRegionChange.bind(this)}
          initialRegion={{
            //latitude: parseFloat(17.4498),
            //longitude: parseFloat(78.3856),
            latitude: parseFloat(this.state.currentLatitude), //17.4498,
            longitude: parseFloat(this.state.currentLongitude), //78.3856,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          {this.state.NearByProfiles.map(y => {
            //{
            /* if (y.distance <= 100) { */
            //}
            return (
              <Marker
                coordinate={{
                  latitude:
                    y.lati,

                  longitude:
                    y.longi,

                }}
                // title={y.name}
                // description={y.title}
                onPress={() => this._handleOnImagePress(y)}>
                {y.image != '' && y.image != null ? (
                  <View style={{ flexDirection: "row", backgroundColor: CommonStyles.appColor, borderRadius: 20, paddingRight: 10 }}>
                    <Thumbnail
                      style={{
                        backgroundColor: '#ffffff',
                        height: 30,
                        width: 30,
                        borderRadius: 70,
                      }}
                      small
                      source={{
                        uri:
                          global.APIURL +
                          'uploadimgs/ProfilePictures/' +
                          y.image,
                      }}
                    />
                    <View style={{ marginHorizontal: 2 }}>
                      <Text style={{ color: "#fff", fontWeight: "bold" }} numberOfLines={1}>{y.fullName}</Text>
                      <Text style={{ color: "#fff", fontSize: 10 }} numberOfLines={1}>{y.title}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", backgroundColor: CommonStyles.appColor, borderRadius: 20, paddingRight: 10 }}>
                    <View style={styles.personBg}>
                      <Person style={{ color: CommonStyles.appColor, fontSize: 25 }} />
                    </View>
                    <View style={{ marginHorizontal: 2 }}>
                      <Text style={{ color: "#fff", fontWeight: "bold" }} numberOfLines={1}>{y.name}</Text>
                      <Text style={{ color: "#fff", fontSize: 10 }} numberOfLines={1}>{y.title}</Text>
                    </View>
                  </View>
                )}
              </Marker>
            );
            //{
            /* } else {
                  return null;
                } */
            //}
          })}
        </MapView>
      </View>
    );
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
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f4f6f9' }}>
        <View style={{ flex: 0.18, position: 'relative' }}>
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
              {this.state.SuccessText}
            </Text>
          </View>
        ) : null}
        {this.state.currentLongitude != 0 ? this._handleRenderMapView() : null}
        {/* <UserSwipableView
          onRequestClose={this._handleOnRequestClose}
          onApplyPress={(CompanyName, Title, Industry) => {
            this._handleOnApplyPress(CompanyName, Title, Industry);
          }}
          UserSwipableViewActive={this.state.UserSwipableView}
          UserData={this.state.SelectedData}
          onInvitePress={data => {
            this._handleOnInvitePress(data);
          }}
          onChatPress={data => {
            this._handleOnChatPress(data);
          }}
          onClosePress={this._handleOnClosePress}
          UnBlock={item => this.UnBlock(item)}
        /> */}
        <Modal style={styles.modal} isVisible={this.state.UserSwipableView}>
          <View style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", borderBottomColor: "grey", borderBottomWidth: 0.5, height: 70, marginVertical: 10 }}>
              <View style={{ textAlign: "center", alignSelf: "center" }}>
                {this.state.SelectedData.image != '' && this.state.SelectedData.image != null ? (
                  <View style={{ borderColor: CommonStyles.appColor, borderWidth: 1, borderRadius: 50 / 2, width: 50, height: 50 }}>
                    <Thumbnail
                      style={{
                        backgroundColor: '#ffffff',
                        height: 45,
                        width: 45,
                        borderRadius: 70,
                        alignSelf: "center"
                      }}
                      small
                      source={{
                        uri:
                          global.APIURL +
                          'uploadimgs/ProfilePictures/' +
                          this.state.SelectedData.image,
                      }}
                    />
                  </View>
                ) : (
                  <View style={{ borderColor: CommonStyles.appColor, borderWidth: 1, borderRadius: 50 / 2, width: 50, height: 50 }}>
                    <Person style={{ color: CommonStyles.appColor, fontSize: 45, alignSelf: "center" }} />
                  </View>
                )}
              </View>
              <View style={{ textAlign: "center", alignSelf: "center" }}>
                <MediumBoldText style={{ color: "#000", fontSize: 17 }}>{this.state.SelectedData.fullName}</MediumBoldText>
                <Text style={{ color: "#A9A9A9", fontSize: 13 }}>{this.state.SelectedData.title}</Text>
              </View>
              <View style={{ textAlign: "center", alignSelf: "center" }}>
                {this.state.SelectedData.isChatblocked ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.UnBlock(this.state.SelectedData);
                    }}>
                    <BottomChatIcon
                      style={{
                        color: CommonStyles.appColor,
                        opacity: 0.2,
                        fontSize: 28,
                        margin: 5,
                      }}
                    />
                  </TouchableOpacity>) : (
                  <TouchableOpacity
                    onPress={() => {
                      this._handleOnChatPress(this.state.SelectedData);
                    }}>
                    <BottomChatIcon
                      style={{
                        color: CommonStyles.appColor,
                        fontSize: 28,
                        margin: 5,
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View style={{ textAlign: "center", alignSelf: "center" }}>
                <TouchableOpacity
                  onPress={() => {
                    this._handleOnInvitePress(this.state.SelectedData);
                  }}>
                  <PlusCircle
                    style={{ color: CommonStyles.appColor, fontSize: 25, margin: 5 }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ textAlign: "center", alignSelf: "center" }}>
                <TouchableOpacity onPress={() => this.emailPress(this.state.SelectedData)}>
                  <Image
                    source={require('../Images/Email.png')}
                    style={{ height: 30, width: 30 }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ textAlign: "center", alignSelf: "center" }}>
                <TouchableOpacity onPress={() => { }}>
                  <Image
                    source={require('../Images/Tick.png')}
                    style={{ height: 25, width: 25 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ textAlign: "center", alignSelf: "center" }}>
              <Hyperlink linkDefault={true} linkStyle={{ color: '#2980b9', fontSize: 13 }}>
                {/* <MediumBoldText style={{ color: "#000", fontSize: 17 }}>{this.state.SelectedData.story}</MediumBoldText> */}
                <Text style={{ color: "#A9A9A9", fontSize: 13, color: 'black', marginLeft: 10, marginRight: 10 }}>{this.state.SelectedData.story}</Text>
              </Hyperlink>
            </View>

            <View style={{ flex: 0.5, alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={{ alignItems: 'center', backgroundColor: CommonStyles.appColor, width: 100, height: 35, borderRadius: 30, marginVertical: "2%" }}
                  onPress={this._handleOnClosePress}>
                  {/* <Closecircle style={styles.iconColor} /> */}
                  <BoldText style={{ marginLeft: 0, color: '#fff', fontSize: 18, top: 7 }}>
                    Cancel
                  </BoldText>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }} />
            </View>
          </View>
        </Modal>
        <View>
          <AlertClass
            AlertMessage={`Are you sure you want to unblock ${this.state.SelectedData.fullName}`}
            OkButtonText={'OK'}
            CancelButtonText={'Cancel'}
            showAlert={this.state.SureWantToDelete}
            onOkPress={() => {
              this.ConfirmUnBlock();
              this.setState({ SureWantToDelete: false });
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
              this.setState({ SureWantToDelete: false });
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
)(MapViewPage);
