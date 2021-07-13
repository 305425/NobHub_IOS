import React, {Component} from 'react';
import {setBusinessCardDetails} from '../state/operations';
import {connect} from 'react-redux';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  Platform,
  Image
} from 'react-native';
import Menu, {MenuItem} from 'react-native-material-menu';
import {Thumbnail} from 'native-base';
import {
  Settings,
  ReferAFriend,
  RateUs,
  BusinessCards,
  QRCode,
  Person,
  Lock,
  Helpcenter,
  Premiummember,
  MenuIcon,
} from '../shared/Icon';
import {MediumBoldText, Text} from '../shared/Text';
import {CommonStyles} from '../shared/Constants';
class CustomMenuIconForHeader extends Component {
  constructor(props) {
    super(props);
    global.CustomMenuIconForHeader = this;
  }
  _menu = null;
  setMenuRef = ref => {
    this._menu = ref;
  };
  showMenu = () => {
    this._menu.show();
  };
  hideMenu = () => {
    this._menu.hide();
  };
  option1Click = () => {
    this._menu.hide();
    this.props.option1Click();
  };
  option2Click = () => {
    this._menu.hide();
    this.props.option2Click();
  };
  option3Click = () => {
    this._menu.hide();
    this.props.option3Click();
  };
  option4Click = () => {
    this._menu.hide();
    this.props.option4Click();
  };
  option5Click = () => {
    this._menu.hide();
    this.props.option5Click();
  };
  option6Click = () => {
    this._menu.hide();
    this.props.option6Click();
  };
  option7Click = () => {
    this._menu.hide();
    this.props.option7Click();
  };
  option8Click = () => {
    this._menu.hide();
    this.props.option8Click();
  };
  option9Click = () => {
    this._menu.hide();
    this.props.option9Click();
  };
  componentDidMount() {
    this.GetUserDefaultCardByUserId();
  }
  GetUserDefaultCardByUserId = () => {
    try {
      var dataToSend = {Userid: global.LoginUserId};
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/GetUserDefaultCardByUserId', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          this.props.setBusinessCardDetails(responseJson);
          // this.getMainApp();
        });
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleRedirectToProfile() {
    this._menu.hide();
    //Actions.profile();
  }
  renderImage = () => {
    const {userProfile} = this.props;
    if (userProfile.image !== '' && userProfile.image !== null) {
      if (global.PersonalPhoto == '') {
        return (
          <Thumbnail
            style={{
              backgroundColor: '#ffffff',
              height: 38,
              width: 38,
              borderRadius: 80,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}
            small
            source={{
              uri:
                global.APIURL +
                'uploadimgs/ProfilePictures/' +
                userProfile.image,
            }}
          />
        );
      } else {
        return (
          <Thumbnail
            style={{
              backgroundColor: '#ffffff',
              height: 38,
              width: 38,
              borderRadius: 80,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}
            small
            source={global.PersonalPhoto}
          />
        );
      }
    } else {
      return (
        <View style={Styles.fab}>
          <Person style={{color: CommonStyles.appColor}} />
        </View>
      );
    }
  };
  render() {
    const {userProfile, IsProfile, iconColor} = this.props;
   // console.log("UserProfile", userProfile)
    if (userProfile !== null) {
      var FirstName = userProfile.name;
      var lastname =
        userProfile.lastname != null && userProfile.lastname != ''
          ? userProfile.lastname
          : '';
      return (
        <View style={this.props.menuStyle}>
          <Menu
            style={Styles.menuView}
            ref={this.setMenuRef}
            button={
              IsProfile ? (
                <TouchableOpacity onPress={this.showMenu}>
                  {this.renderImage()}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={this.showMenu}>
                  <MenuIcon style={{fontSize: 35, color: iconColor}} />
                </TouchableOpacity>
              )
            }>
            <ImageBackground
              style={{width: '100%', height: '100%'}}
              source={require('../Images/backgroung_image.png')}>
              <View>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <View
                    style={{
                      flexDirection: 'row'
                    }}>
                    <View
                      style={{
                        flex: 0.3,
                        right: 2,
                      }}>
                      {this.renderImage()}
                    </View>
                    <View
                      style={{
                        flex: 1.5,
                        justifyContent: 'space-around',
                      }}>
                      <MediumBoldText style={{color: '#ffffff', top:3}}>
                        {FirstName + ' ' + lastname}
                      </MediumBoldText>
                      {/* <Text
                        style={{
                          color: '#ffffff',
                          fontSize: 12,
                         // marginBottom: 10,
                        }}>
                        {userProfile.email === null ||
                        userProfile.email === 'null'
                          ? ''
                          : userProfile.email}
                      </Text> */}
                      <Text
                        style={{
                          color: '#ffffff',
                          fontSize: 12,
                         // marginBottom: 10,
                        }}>
                        {userProfile.cemail === null ||
                        userProfile.cemail === 'null'
                          ? ''
                          : userProfile.cemail}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{borderWidth:0.5, borderColor:"#fff", marginVertical:8}}/>
                <View style={Styles.viewDirection}>
                  <Lock style={Styles.iconColor} />
                  <MenuItem
                    textStyle={{color: '#ffffff', fontWeight: 'bold'}}
                    onPress={this.option1Click}>
                    Account Info
                  </MenuItem>
                </View>
                <View style={Styles.viewDirection}>
                  <BusinessCards style={Styles.iconColor} />
                  <MenuItem
                    textStyle={{color: '#ffffff', fontWeight: 'bold'}}
                    onPress={this.option2Click}>
                    My BusinessCard
                  </MenuItem>
                </View>
                <View style={Styles.viewDirection}>
                <Image
                   style={{ height: 26, width: 26, tintColor:"#fff" }}
                   source={require('../Images/myconnectionsblue.png')}
                 />
                  <MenuItem
                    textStyle={{color: '#ffffff', fontWeight: 'bold'}}
                    onPress={this.option3Click}>
                    My Connections
                  </MenuItem>
                </View>
                <View style={Styles.viewDirection}>
                  <QRCode style={Styles.iconColor} />
                  <MenuItem
                    textStyle={{color: '#ffffff', fontWeight: 'bold'}}
                    onPress={this.option4Click}>
                    My QR Code
                  </MenuItem>
                </View>
                <View style={Styles.viewDirection}>
                  <ReferAFriend style={Styles.iconColor} />
                  <MenuItem
                    textStyle={{color: '#ffffff', fontWeight: 'bold'}}
                    onPress={this.option5Click}>
                    Refer a Friend
                  </MenuItem>
                </View>
                <View style={Styles.viewDirection}>
                  <RateUs style={Styles.iconColor} />
                  <MenuItem
                    textStyle={{color: '#ffffff', fontWeight: 'bold'}}
                    onPress={this.option6Click}>
                    Rate Us
                  </MenuItem>
                </View>
                <View style={Styles.viewDirection}>
                  <Settings style={Styles.iconColor} />
                  <MenuItem
                    textStyle={{color: '#ffffff', fontWeight: 'bold'}}
                    onPress={this.option7Click}>
                    Settings
                  </MenuItem>
                </View>
                <View style={Styles.viewDirection}>
                  <Helpcenter style={Styles.iconColor} />
                  <MenuItem
                    textStyle={{color: '#ffffff', fontWeight: 'bold'}}
                    onPress={this.option8Click}>
                    Help Center
                  </MenuItem>
                </View>
                <View style={Styles.viewDirection}>
                  <Premiummember style={Styles.iconColor} />
                  <MenuItem
                    textStyle={{color: '#ffffff', fontWeight: 'bold'}}
                    onPress={this.option9Click}>
                    Premium Membership
                  </MenuItem>
                </View>
                {/* <View style={Styles.viewDirection}>
                  <LogOut style={Styles.iconColor} />
                  <MenuItem
                    textStyle={{color: '#ffffff', fontWeight: 'bold'}}
                    onPress={this.option5Click}>
                    Logout
                  </MenuItem>
                </View> */}
              </View>
              {/* <TouchableOpacity onPress={onLogoutPress}>
                <View
                  style={{
                    alignItems: 'center',
                    borderWidth: 1,
                    borderRadius: 20,
                    backgroundColor: '#ffffff',
                    marginLeft: 25,
                    marginRight: 40,
                    flex: 0.1,
                    borderColor: '#ffffff',
                    bottom: -50,
                  }}>
                  <Text
                    style={{color: CommonStyles.appColor, fontWeight: 'bold'}}>
                    Logout
                  </Text>
                </View>
              </TouchableOpacity> */}
            </ImageBackground>
          </Menu>
        </View>
      );
    }
    return null;
  }
}
const Styles = StyleSheet.create({
  viewDirection: {flexDirection: 'row', alignItems: 'center'},
  menuView: {
    backgroundColor: '#11cbdf',
    paddingVertical: 8,
    paddingHorizontal: Platform.OS == 'ios' ? 80 : 40,
    marginTop: 50,
    //borderRadius: 100,
    borderTopLeftRadius: 80,
    borderBottomLeftRadius: 80,
  },
  iconColor: {
    color: '#ffffff',
    fontSize: 30,
  },
  fab: {
    flexDirection: 'column',
    height: 35,
    width: 35,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
  },
});
// export const mapStateToProps = state => {
//   return {
//     userProfile: state.user.userProfile,
//   };
// };

const mapDispatchToProps = {
  setBusinessCardDetails,
};

export default connect(
  null,
  mapDispatchToProps,
)(CustomMenuIconForHeader);
