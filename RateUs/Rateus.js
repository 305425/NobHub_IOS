import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import {goBack} from '../Services/BackButtonServices';
import {connect} from 'react-redux';
import {RateUs, AppStoreIcon} from '../shared/Icon';
import {ArrowLeft} from '../shared/Icon';
import {Actions} from 'react-native-router-flux';
import CustomMenuIcon from '../Custom/MenuIconForHeader';
import {Text, BoldText} from '../shared/Text';
import {CommonStyles} from '../shared/Constants';

class RateUS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTermsAndConditions: false,
      isChecked: false,
    };
  }
  googlePress = () => {
    Linking.openURL(`market://details?id=${GOOGLE_PACKAGE_NAME}`).catch(() =>
      alert('Please check for the Google Play Store'),
    );
  };
  appStorePress = () => {
    Linking.openURL(
      `itms://itunes.apple.com/in/app/apple-store/${APPLE_STORE_ID}`,
    ).catch(() => alert('Please check for the App Store'));
  };
  leftArrowPress = () => {
    const {handleGoBack} = this.props;
    handleGoBack();
  };
  maybelaterPress = () => {
    Actions.myConnections();
  };
  _handleHeaderProfileIcon = () => {
    const {userProfile} = this.props;
    return (
      <View style={{borderRadius: 0}}>
        <CustomMenuIcon
          menutext="Menu"
          menuStyle={styles.headerCustomMenu}
          //Menu Text Style
          textStyle={styles.headerTextMenu}
          //Click functions for the menu items
          option1Click={() => {
            const {userProfile} = this.props;
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
            Actions.businessCard({userProfile: userProfile});
          }}
          option3Click={() => {
          Actions.myConnections();
          }}
          option4Click={() => {
            Actions.qrCode({userProfile: userProfile});
          }}
          option5Click={() => {
            Actions.referAfriend({
              userProfile: userProfile,
            });
          }}
          option6Click={() => {
            Actions.rateUs({userProfile: userProfile});
          }}
          option7Click={() => {
            Actions.settings({
              UserId: userProfile.guid,
              IsShow: userProfile.sharecard,
              UserProfile: userProfile,
            });
          }}
          option8Click={() => {
            Actions.helpCenter({userProfile: userProfile});
          }}
          option9Click={() => {
            Actions.premierMembership({userProfile: userProfile});
          }}
          // option5Click={() => {
          //   this._handleClearLocalDB();
          // }}
          userProfile={userProfile}
          IsProfile={false}
          iconColor={'#000000'}
        />
      </View>
    );
  };
  render() {
    return (
      <View style={{flex: 1}}>
        <ImageBackground
        style={{ width: '100%',
        height: '100%',
}}
  imageStyle={{
    resizeMode: 'stretch',
  }}
          source={require('../Images/curvesbg.jpg')}>
          <View style={{flex: 0.04}} />
          <View
            style={{
              flexDirection: 'row',
              flex: 0.1,
              justifyContent: 'space-between',
            }}>
            <View style={{marginLeft: 10}}>
              <TouchableOpacity onPress={() => this.leftArrowPress()}>
                <View style={styles.arrowBgstyle}>
                  <ArrowLeft
                    style={{fontSize: 20, color: CommonStyles.appColor}}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {this._handleHeaderProfileIcon()}
          </View>
          <View style={{flex: 0.05}} />
          <View style={{flex: 0.05}}>
            <BoldText style={styles.text}>{'Rate Us'}</BoldText>
          </View>
          <View style={{flex: 0.3, margin: 10}}>
            <Image
              style={styles.image}
              source={require('../Images/rateimage.png')}
            />
          </View>
          <View
            style={{flex: 0.2, alignSelf: 'center', justifyContent: 'center'}}>
            <BoldText style={{textAlign: 'center', fontSize: 21}}>
              Your opinion matters to us!
            </BoldText>
            <Text style={{fontSize: 14}}>
              {' '}
              We work super hard serve you better and would love to know
            </Text>
            <Text style={{textAlign: 'center'}}>
              how would you rate our app?
            </Text>
          </View>
          <View
            style={{
              flex: 0.05,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <RateUs style={{backgroundColor: 'blue'}} />
            <RateUs />
            <RateUs />
            <RateUs />
            <RateUs />
          </View>
          <View style={styles.viewTouchable}>
            {Platform.OS == 'android' ? (
              <TouchableOpacity
                onPress={() => this.googlePress()}
                style={{
                  borderRadius: 10,
                  paddingVertical: 4,
                  paddingHorizontal: 5,
                  backgroundColor: 'black',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                  style={styles.googleimages}
                    source={require('../Images/googleplay.png')}
                  />
                  <View>
                    <Text style={{color: '#ffffff', fontSize: 13}}>
                      Rate us on
                    </Text>
                    <BoldText style={{color: '#ffffff'}}>Google play</BoldText>
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => this.appStorePress()}
                style={{
                  borderRadius: 10,
                  paddingVertical: 4,
                  paddingHorizontal: 5,
                }}>
                <View style={{flexDirection: 'row'}}>
                <Image
                
                source={require('../Images/Appleplay.png')}
              />
                  <View>
                    <Text style={{color: '#ffffff', fontSize: 13}}>
                      Rate us on
                    </Text>
                    <BoldText style={{color: '#ffffff'}}>Apple play</BoldText>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>

          <View style={{alignItems: 'center', flex: 0.05}}>
            <TouchableOpacity
              onPress={() => this.maybelaterPress()}
              style={{
                borderRadius: 5,
                paddingVertical: 5,
                paddingHorizontal: 9,
                backgroundColor: CommonStyles.appColor,
              }}>
              <BoldText style={{color: '#ffffff'}}>May be later</BoldText>
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.06}} />
        </ImageBackground>
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
)(RateUS);
const styles = StyleSheet.create({
  googleimages: {
    width: 25,
    height: 25,
  },
  text: {
    fontSize: 25,
    textAlign: 'center',
    color: '#000',
  },
  arrowBgstyle: {
    flexDirection: 'column',
    height: 35,
    width: 35,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
  },
  image: {
    width: 280,
    height: 200,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  viewTouchable: {
    alignSelf: 'center',
    alignItems: 'center',
    flex: 0.1,
  },
  headerCustomMenu: {
    marginRight: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 100,
  },
  headerTextMenu: {
    color: 'red',
    backgroundColor:'red'
  },
});
