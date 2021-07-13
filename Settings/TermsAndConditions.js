import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  //Text,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Linking,
  ScrollView,
} from 'react-native';
import Communications from 'react-native-communications';
import {Actions} from 'react-native-router-flux';
import CustomMenuIcon from '../Custom/MenuIconForHeader';
import {Text, BoldText} from '../shared/Text';
import {ArrowLeft, Treedotmenu} from '../shared/Icon';
import {CommonStyles} from '../shared/Constants';
const GOOGLE_PACKAGE_NAME = 'agrawal.trial.yourfeedback';
import {goBack} from '../Services/BackButtonServices';
class TermsAndConditions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTermsAndConditions: false,
      isChecked: false,
    };
  }
  maybelaterPress = () => {
    Actions.myConnections();
  };
  googlePress = () => {
    if (Platform.OS != 'ios') {
      Linking.openURL(`market://details?id=${GOOGLE_PACKAGE_NAME}`).catch(() =>
        alert('Please check for the Google Play Store'),
      );
    }
  };
  _handleHeaderProfileIcon = () => {
    const {userProfile} = this.props;
    return (
      <View style={[styles.leftHeader, {borderRadius: 0, backgroundColor: ''}]}>
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
          iconColor={'#00000'}
        />
      </View>
    );
  };
  callPress = () => {
    Communications.phonecall('1585481234', true);
  };
  leftArrowPress = () => {
    const {handleGoBack} = this.props;
    handleGoBack();
  };
  render() {
    return (
      <View style={{flex: 1}}>
      <ImageBackground
        style={{width: '100%', height: '100%'}}
        imageStyle={{
          resizeMode: 'stretch',
        }}
        source={require('../Images/curvesbg.jpg')}>
        <View style={{flex: 0.04}} />
        <View
          style={{
            flexDirection: 'row',
            flex: 0.07,
            justifyContent: 'space-between',
          }}>
          <View style={{marginLeft:10}}>
            <TouchableOpacity onPress={() => this.leftArrowPress()}>
            <View style={styles.arrowBgstyle}>
              <ArrowLeft
                style={{fontSize: 20, color: CommonStyles.appColor}}
              />
              </View>
            </TouchableOpacity>
          </View>


      <View>
      {this._handleHeaderProfileIcon()}
          </View>
        </View>
        <View style={{flex: 0.05, margin: 5}}>
            <BoldText style={styles.text}>{'Terms of Service'}</BoldText>
          </View>
        <View style={{flex: 0.89,marginLeft:10,marginRight:10}}>
        <ScrollView>
          <Text style={styles.Textstyle}>
            NobHub, a product of Nob Hub Incorporation thereby makes the “Site”
            (websites including , without restriction, www.nobhub.com and all
            its subdomains), Mobile Application and Services “including without
            restriction, payment, logs for practices, individual and global
            statistical data, location services, contact management, business
            card distribution) to enable business owners and professionals
            design virtual business cards, store and share business information
            of contacts with a single click. Access to and the use of NobHub
            Site, Mobile Application and Services and also future Sites, Mobile
            Application or Services rendered by NobHub is governed by this Terms
            of Use and User’s Agreement (“this Agreement”).
          </Text>
          <BoldText style={[styles.Textstyle,{fontSize: 12}]}>Notice of Agreement:</BoldText>
          <Text style={styles.Textstyle}>
            “…Any participation in this service whether through the website or
            the mobile application will signify the acceptance of this
            agreement…”
          </Text>
          <Text style={styles.Textstyle} >Acceptance of Terms :</Text>
          <Text style={styles.Textstyle}>
            "BY ACCESSING AND USING THIS SERVICE, YOU ACCEPT AND CONSENT TO BE
            BOUND BY THE TERMS AND PROVISION OF THIS AGREEMENT. ALSO, WHEN USING
            THESE PARTICULAR SERVICES, YOU SHALL BE SUBJECT TO ANY POSTED
            GUIDELINES OR RULES APPLICABLE TO SUCH SERVICES. ANY PARTICIPATION
            IN THIS SERVICE WILL CONSTITUTE UNDERSTANDING AND ACCEPTANCE OF THIS
            AGREEMENT.”
          </Text>
          <Text style={styles.Textstyle}>
            If you are a free user, or are accessing the Site to use as a
            premium member of the Services or Mobile Application, otherwise
            browsing the Site, this Agreement is between you, exclusively, and
            Manbrosys LLC. Acceptance of this agreement indicates that you fully
            understand and agree to the terms written therein. Do not proceed
            with the use of these services if you do not agree.
          </Text>
        </ScrollView>
         </View>
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
)(TermsAndConditions);
const styles = StyleSheet.create({
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
  text: {
    fontSize: 25,
    textAlign: 'center',
    color: '#000',
  },
  Textstyle:
  {textAlign: 'justify'}
});
