import React, {Component} from 'react';
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
  Alert
} from 'react-native';
import {CommonStyles} from '../shared/Constants';
import {connect} from 'react-redux';
import Communications from 'react-native-communications';
import {Actions} from 'react-native-router-flux';
import CustomMenuIcon from '../Custom/MenuIconForHeader';
import {Text, BoldText} from '../shared/Text';
import {ArrowLeft} from '../shared/Icon';
const GOOGLE_PACKAGE_NAME = 'agrawal.trial.yourfeedback';
import {goBack} from '../Services/BackButtonServices';
import {
  clearUserProfile,
  setUserProfile,
  clearBusinessCardDetails,
} from '../state/operations';
import Mailer from 'react-native-mail';
import logo from '../Images/newlogo.png'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


class Support extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTermsAndConditions: false,
    };
  }
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
  emailPress = () => {
   // Communications.email('support@nobhub.com',null,null, null, null);
   Mailer.mail({
   // subject: 'need help',
    recipients: ['support@nobhub.com'],
   // ccRecipients: ['supportCC@example.com'],
   // bccRecipients: ['supportBCC@example.com'],
    // body: '<b>A Bold Body</b>',
    // customChooserTitle: 'This is my new title', // Android only (defaults to "Send Mail")
    // isHTML: true,
    // attachments: [{
    //   // Specify either `path` or `uri` to indicate where to find the file data.
    //   // The API used to create or locate the file will usually indicate which it returns.
    //   // An absolute path will look like: /cacheDir/photos/some image.jpg
    //   // A URI starts with a protocol and looks like: content://appname/cacheDir/photos/some%20image.jpg
    //   path: '', // The absolute path of the file from which to read data.
    //   uri: logo, // The uri of the file from which to read the data.
    //   // Specify either `type` or `mimeType` to indicate the type of data.
    //   type: 'png', // Mime Type: jpg, png, doc, ppt, html, pdf, csv
    //   mimeType: 'png', // - use only if you want to use custom type
    //   name: 'Tiger', // Optional: Custom filename for attachment
    // }]
  }, (error, event) => {
    Alert.alert(
      error,
      event,
      [
        {text: 'Ok', onPress: () => console.log('OK: Email Error Response')},
        {text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response')}
      ],
      { cancelable: true }
    )
  });
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop:"10%"
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
          <View style={{margin: 5}}>
            <BoldText style={styles.text}>{'Support'}</BoldText>
          </View>
          <View
            style={{
              justifyContent: 'center',
              top:50
            }}>
            <Image
              style={styles.image}
              source={require('../Images/supportimage1.png')}
            />
          </View>
          <View style={{top:"15%", height:100, justifyContent:"space-between"}}>
          <View style={styles.TextStyle}>
            <Text style={{fontSize: 18}}>
              Click to call with our product advisor
            </Text>
          </View>
          <View style={styles.NumberView}>
            <Image
              style={styles.googleimages}
              source={require('../Images/call.png')}
            />
            <TouchableOpacity onPress={() => this.callPress()}>
              <BoldText>
                Call Us : 
                <Text> 1585481234</Text>
              </BoldText>
            </TouchableOpacity>
          </View>
          <View style={styles.NumberView}>
            <Image
              style={styles.googleimages}
              source={require('../Images/mail.png')}
            />
            <TouchableOpacity onPress={() => this.emailPress()}>
              <BoldText>
                Email Us: 
                <Text> support@nobhub.com</Text>
              </BoldText>
            </TouchableOpacity>
          </View>
          </View>
        </ImageBackground>
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
  handleGoBack: goBack,
  setUserProfile,
  clearUserProfile,
  clearBusinessCardDetails,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Support);
export const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  TextStyle: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  NumberView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
   // top:10,
    right:15
  },
  googleimages: {
    width: 25,
    height: 25,
    tintColor:"#007682"
  },

  text: {
    fontSize: 25,
    textAlign: 'center',
    color: '#000',
  },

  image: {
    width: 300,
    height: 231,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignSelf: 'center',
    //marginBottom:20
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
});
