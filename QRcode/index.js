import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import CustomMenuIcon from '../Custom/MenuIconForHeader';
import {Text, BoldText} from '../shared/Text';
import {ArrowLeft} from '../shared/Icon';
import {goBack} from '../Services/BackButtonServices';
import {CommonStyles} from '../shared/Constants';
class QRCodeContainer extends Component {
  constructor(props) {
    super(props);
  }
  _handleHeaderProfileIcon = () => {
    const {userProfile} = this.props;
    return (
      <View style={[styles.leftHeader]}>
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
          IconColor={'#000000'}
        />
      </View>
    );
  };
  leftArrowPress = () => {
    const {handleGoBack} = this.props;
    handleGoBack();
  };
  render() {
    const {userProfile} = this.props;
    var Address =
      userProfile.address != null && userProfile.address != ''
        ? userProfile.address
        : '';
    var Email =
      userProfile.email != null && userProfile.email != ''
        ? userProfile.email
        : '';
    return (
      <View style={{flex: 1, backgroundColor: '#f5f6fa'}}>
          <ImageBackground
            style={{width: '100%', height: '100%'}}
            imageStyle={{
              resizeMode: 'stretch',
            }}
            source={require('../Images/curvesbg.jpg')}
          >
          <View style={{flex:0.04}}></View>
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
          <View style={{flex:0.05}}></View>
          <View style={{flex: 0.05}}>
              <BoldText style={styles.text}>{'Quick Phone Share'}</BoldText>
          </View>
              <View style={{flex: 0.3,marginLeft:10,marginRight:10,justifyContent:'center'}}>
                <Text>
                  Instantly share your contact details with new people by
                  scanning your QR code with their native camera.No need of
                  NobHub app
                </Text>
                <Text style={{marginTop: 20}}>
                  Your business card mandatory fields will be transferred into
                  their phone bool seamlessly!
                </Text>
                <Text style={{marginTop: 10}}>
                  Keep expanding your business network!
                </Text>
              </View>
            <View style={{flex:0.3,alignSelf:'center',justifyContent:'center'}}>
            <Image
            style={{width: 180, height: 180}}
            source={{
              uri: `https://qrcode.tec-it.com/API/QRCode?data=MECARD%3aN%3a${
                userProfile.name
              }%3bTEL%3a${
                userProfile.mobile
              }%3bEMAIL%3a${Email}%3bADR%3a${Address}%3b&backcolor=%23ffffff`,
            }}
          />
          </View>
          <View style={{flex:0.16}}></View>
          </ImageBackground>
      </View>
    );
  }
}
export const {width, height} = Dimensions.get('window');
const mapDispatchToProps = {
  handleGoBack: goBack,
};

export default connect(
  null,
  mapDispatchToProps,
)(QRCodeContainer);
const styles = StyleSheet.create({
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
  headerCustomMenu: {
    marginRight: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 100,
  },
  headerTextMenu: {
    color: 'red',
  },
  leftHeader: {
    flexDirection: 'column',
    height: 38,
    width: 38,
    //borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
});
