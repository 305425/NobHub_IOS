import React, {Component} from 'react';
import {
  View,
  //Text,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import {BoldText} from '../shared/Text';
import {goBack} from '../Services/BackButtonServices';
import {connect} from 'react-redux';
import {ArrowLeft} from '../shared/Icon';
import CustomMenuIcon from '../Custom/MenuIconForHeader';
import {CommonStyles} from '../shared/Constants';
import {Actions} from 'react-native-router-flux';
class Features extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
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
          iconColor={'#000000'}
        />
      </View>
    );
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
              flex: 0.06,
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

            <View>{this._handleHeaderProfileIcon()}</View>
          </View>
          <View style={{flex: 0.05, margin: 5}}>
            <BoldText style={styles.text}>{'Features'}</BoldText>
          </View>
          <View style={{flex: 0.9, marginLeft: 10, marginRight: 10}}>
          <ScrollView>
          <View style={{flex:0.15}}>
          <BoldText style={{textAlign:'center'}}>
          Business Card
          </BoldText>
          <Text>
          Create your virtual business card with a single click.
          </Text>
          </View>
          <View style={{flex:0.15}}>
          <BoldText style={{textAlign:'center'}}>
          Fast And Easy Setup
          </BoldText>
          <Text>
          Sign up, log in and choose your template. Now you're good to go!
          </Text>
          </View>
          <View style={{flex:0.15}}>
          <BoldText style={{textAlign:'center'}}>
          Fast And Easy Setup
          </BoldText>
          <Text>
          Sign up, log in and choose your template. Now you're good to go!
          </Text>
          </View>
          <View style={{flex:0.15}}>
          <BoldText style={{textAlign:'center'}}>
          100+ Premium
          </BoldText>
          <Text>
          Professional business card templates
          </Text>
          </View>
          <View style={{flex:0.15}}>
          <BoldText style={{textAlign:'center'}}>
          Customized Experience
          </BoldText>
          <Text>
          Easily customize your business card for a unique look. Add your company logo and information to any template.
          </Text>
          </View>
          <View style={{flex:0.15}}>
          <BoldText style={{textAlign:'center'}}>
          Save Time
          </BoldText>
          <Text>
          Spend less time exchanging contacts and more time creating meaningful relationships.
          </Text>
          </View>
          <View style={{flex:0.2}}>
          <BoldText style={{textAlign:'center'}}>
          Organized Interface
          </BoldText>
          <Text>
          Save customers and business associate info seamlessly and access them quickly when needed with the easy-to-use, user friendly interface.
          </Text>
          </View>
          <View style={{flex:0.15}}>
          <BoldText style={{textAlign:'center'}}>
          Professional
          </BoldText>
          <Text>
          Design virtual business cards like a professional graphic designer with our inbuilt tools
          </Text>
          </View>
          <View style={{flex:0.15}}>
          <BoldText style={{textAlign:'center'}}>
          Social Platforms
          </BoldText>
          <Text>
          Easily share business cards on many different social platforms such as Facebook, Twitter, LinkedIn, Pinterest, WhatsApp, and Skype
          </Text>
          </View>
          </ScrollView>
          </View>
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
)(Features);
const styles = StyleSheet.create({
  container: {
    //flex: 1,
  },
  child: {
    height: height * 0.5,
    width,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
  },
  // pagination: {marginTop: 200},
  image: {
    width: 280,
    height: 221,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  imageBackgroundBottom: {
    flex: 1,
    flexWrap: 'wrap',
    paddingTop: 130,
    paddingRight: 440,
    paddingLeft: 55,
  },
  viewSwiperImages: {flex: 1, paddingVertical: 10, paddingHorizontal: 20},
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
  text: {
    fontSize: 25,
    textAlign: 'center',
    color: '#000',
  },
});
