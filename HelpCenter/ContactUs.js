import React, {Component} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Communications from 'react-native-communications';
import {Text, BoldText} from '../shared/Text';
import {CommonStyles} from '../shared/Constants';
import CustomMenuIcon from '../Custom/MenuIconForHeader';
import {Dropdown} from 'react-native-material-dropdown';
import CheckBox from 'react-native-check-box';
import {connect} from 'react-redux';
import {ArrowLeft, Search} from '../shared/Icon';
import {goBack} from '../Services/BackButtonServices';

class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      CaptchaNumber: '',
      EnterdCaptcha: '',
      IssueMsg: '',
    };
  }
  onChangeText = this.onChangeText.bind(this);
  onChangeText(text) {
    this.setState({
      selected: text,
    });
  }
  _handleHeaderProfileIcon = () => {
    const {userProfile} = this.props;
    return (
      <View style={[styles.leftHeader, {borderRadius: 0, backgroundColor: ''}]}>
        <CustomMenuIcon
          menutext="Menu"
          menuStyle={styles.customMenu}
          //Menu Text Style
          textStyle={styles.textMenu}
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
  GenerateReferalCode(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.setState({CaptchaNumber: result});
    return result;
  }
  AmnotRobotClicked = () => {
    this.setState({
      isChecked: !this.state.isChecked,
    });
    var ReferralCode = this.GenerateReferalCode(6);
    this.setState({CaptchaNumber: ReferralCode});
  };
  ContactAppAdmin = () => {
    if (this.state.CaptchaNumber == this.state.EnterdCaptcha) {
      Communications.email(
        ['thanuja.b@mwebware.com'],
        null,
        null,
        'Demo Subject',
        this.state.IssueMsg,
      );
    } else {
      alert('Enterd Captcha is wrong');
    }
  };
  render() {
    var dataitems = [
      {value: 'MyConnection'},
      {value: 'Invite Friends'},
      {value: 'Near BY'},
      {value: 'Groups'},
      {value: 'Chat'},
      {value: 'Meetings'},
      {value: 'Notifications'},
      {value: 'Business shoutout'},
      {value: 'My Business card'},
      {value: 'Account info'},
    ];
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
            <BoldText style={styles.text}>{'Help Center'}</BoldText>
          </View>
          <View
            style={{
              flex: 0.35,
              justifyContent: 'center',
            }}>
            <ImageBackground
              style={{width: '100%', height: '100%'}}
              imageStyle={{
                resizeMode: 'stretch',
              }}
              source={require('../Images/helpcenter.png')}>
              <View style={{position: 'absolute', right: 5, left: 10, top: 49}}>
                <BoldText style={{color: '#000000', fontSize: 20}}>
                  How can we help you{' '}
                </BoldText>
                <BoldText
                  style={{color: '#000000', fontSize: 20, marginLeft: 50}}>
                  today ?
                </BoldText>
              </View>
            </ImageBackground>
          </View>
          <View style={{flex: 0.05}}>
            <Text style={{textAlign: 'center'}}>Contact Us</Text>
          </View>
          <View style={{flex: 0.03}}>
            <Text style={{alignSelf: 'center', fontSize: 12}}>
              Please fill in the form below so we can respond to your enquiry
            </Text>
          </View>
          <View style={{flex: 0.01}}>
            <BoldText style={{alignSelf: 'center', fontSize: 12}}>
              What is your questions about ?
            </BoldText>
          </View>
          <View style={{flex: 0.1, marginLeft: 10, marginRight: 10}}>
            <Dropdown
              data={dataitems}
              baseColor="gray"
              itemColor="gray"
              selectedItemColor="black"
              valueExtractor={({value}) => value}
              onChangeText={this.onChangeText}
              rippleCentered={true}
              label="Please select a topic"
            />
          </View>
          <View style={{flex: 0.02, margin: 10}}>
            <Text
              style={{
                color: '#a4a6a9',
              }}>
              Message
            </Text>
          </View>
          <View style={styles.MSGInputstyle}>
            <TextInput
              style={{
                justifyContent: 'flex-start',
                textAlignVertical: 'top',
                height: 80,
              }}
              onFocus={this.onFocusChange}
              placeholder="Please  describe your issue"
              underlineColorAndroid="transparent"
              numberOfLines={20}
              multiline={true}
              editable={true}
              onChangeText={text => this.setState({IssueMsg: text})}
              value={this.state.IssueMsg}
              maxLength={500}
            />
          </View>
          <View
            style={{
              flex: 0.05,
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 10,
            }}>
            <View style={{flexDirection: 'row'}}>
              <CheckBox
                onClick={() => {
                  this.AmnotRobotClicked();
                }}
                checkBoxColor={'#08a0af'}
                checkedCheckBoxColor={'#08a0af'}
                isChecked={this.state.isChecked}
              />
              <Text style={{fontSize: 15, marginRight: 20}}>
                {' '}
                I'm not a robot{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.GenerateReferalCode(6);
                }}>
                <Image  source={require('../Images/CaptchaImg.png')} />
              </TouchableOpacity>
            </View>
          </View>
          {this.state.isChecked &&
          this.state.CaptchaNumber != '' &&
          this.state.CaptchaNumber != null ? (
            <View style={{flex:0.22}}>
              <BoldText style={{fontSize: 20,marginLeft:10}}>
                {this.state.CaptchaNumber}
              </BoldText>

          <Text style={{fontSize: 10,marginLeft:10}}> Enter Captcha </Text>
              <View
                style={{
                  flex: 0.1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 10,
                }}>
                <View
                  style={{
                    borderColor: '#e0e0e0',
                    borderWidth: 1,
                    height: 40,
                    width: 100,
                  }}>
                  <TextInput
                    style={{
                      justifyContent: 'flex-start',
                      textAlignVertical: 'top',
                    }}
                    onFocus={this.onFocusChange}
                    placeholder="Enter Captcha"
                    underlineColorAndroid="transparent"
                    numberOfLines={20}
                    multiline={true}
                    editable={true}
                    onChangeText={text => this.setState({EnterdCaptcha: text})}
                    value={this.state.EnterdCaptcha}
                    maxLength={500}
                  />
                </View>
                <View>
                  {this.state.IssueMsg != '' ? (
                    <TouchableOpacity
                      style={{
                        borderRadius: 30,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        backgroundColor: CommonStyles.appColor,
                      }}
                      onPress={() => {
                        this.ContactAppAdmin();
                      }}>
                      <BoldText style={{color: '#ffffff'}}>Send</BoldText>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        borderRadius: 30,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        backgroundColor: 'lightgray',
                      }}>
                      <BoldText style={{color: '#ffffff'}}>Send</BoldText>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ) : null}
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
)(ContactUs);
export const {width, height} = Dimensions.get('window');

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
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
  },
  MSGInputstyle: {
    flex: 0.1,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    margin: 10,
  },
});
