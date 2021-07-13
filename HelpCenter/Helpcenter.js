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
import {Text, BoldText} from '../shared/Text';
import {CommonStyles} from '../shared/Constants';
import {Search} from '../shared/Icon';
import Accordian from './Accordian';
import CustomMenuIcon from '../Custom/MenuIconForHeader';
import {ArrowLeft} from '../shared/Icon';
import {goBack} from '../Services/BackButtonServices';
import {connect} from 'react-redux';
class HelpCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTermsAndConditions: false,
      isChecked: false,
      SearchPlaceHolder: 'Search for Help Topics here',
      SearchText: '',
      menu: [
        {
          title: 'Q: What Is NobHub And Its Benefits? What Do I Do Here?',
          data:
            'NobHub is a revolutionary mobile app that allows professionals all across the walks of life to share Phone contacts & Professional information quickly and seamlessly across the Globe and enhance professionals save all their business contacts in one easy click and Eliminates the use of traditional paper business cards, no need to pile up your wallet with business cards.',
        },
        {
          title: 'Q: Who Is The Audience For NobHub?',
          data:
            'NobHub is for everyone over the age of 18 years who wants share their phone numbers and business cards with a click of button. Meet nearby people at events, seminars and connect.Since NobHub shows people nearby, its easy to meet in person at any events, seminars, friends & family get-togethers and exchange contacts with ease.You can share your Facebook, Twitter, Instagram & Skype links on the business cards and the app will take you to the respective applications.You can make calls by simply clicking on the phone number on the business card. The app will make the call using your mobile carrier or any other installed calling applications such as Skype, WhatsApp etc.',
        },

        {
          title: 'Q: Which Devices Can I Use?',
          data:
            'You can use NobHub on smartphones. We have the app available for iOS (Version 6 and above) and Android (Version 4.1 and up).',
        },
        {
          title: 'Q: Where Is NobHub Located?',
          data:
            'The NobHub located in USA and have development teams in India & Dubai.',
        },
        {
          title:
            'Q: How Can I Share My Business Card With My Prospects And Partners?',
          data:
            'Selects the name you want to share your business card with on your contact list and click on share',
        },
        {
          title: 'Q: Will You Have Ads? Or Sell My Data?',
          data:
            'Yes, there will be ads for non-premium members. There are no ads for premium members. We don’t sell your data to anyone.',
        },
        {
          title: 'Q: Is The App Free Of Charge?',
          data:
            'We strive to provide the app 100% free, it is free for everyone to download and use. We charge a very minimal fee for premium membership for those who want to choose from the unlimited Premium cards collection.',
        },
        {
          title: 'Q: What Is NobHub’s Internet Privacy Policies?',
          data:
            'At NobHub, Internet privacy is important and we strive to protect your personal data from third parties such as marketers, advertisers, etc. We use a complex algorithm to encrypt your data.',
        },
        {
          title: 'Q: Who Can I Invite To Connect With Me?',
          data:
            'You can send invites to people who are in your phone contacts, email contacts, LinkedIn contacts, google contacts. Those who do not have NobHub will receive an invitation to download the app. Your business card can only be exchanged through NobHub.',
        },
        {
          title: 'Q: How Do I Invite My Friends To NobHub?',
          data:
            'Open the Contacts Tab, open the menu (to the right of the search box) and click on “Invite Friends”. Then choose the application you would like use to send out the invitation. The basic invitations are simple SMS messages. They will be charged as standard outgoing SMS by your carrier. Naturally, you have other options to bring your friends here. Try sending them a download link through any other messaging service such as email, Facebook, WhatsApp etc.',
        },
        {
          title: 'Q: How Do I Know My Invitation Status?',
          data:
            'You can see your invitation status in the Nearby tab next to the contact’s name. When your invite is accepted or rejected, you will receive an alert message in the Alerts tab.',
        },
        {
          title: 'Q: Who Can See Me Once I Create An Account?',
          data: 'People can see you online once you register with NobHub.',
        },
        {
          title: 'Q: How Do I Delete My Account?',
          data:
            'Go to Settings and click on “Delete my account”. This will remove your account; you will lose all your contacts & people will no longer be able to find you in the nearby search.',
        },
        {
          title:
            'Q: What Do I Do If I Receive Annoying Invites Multiple Times?',
          data:
            'Go to the Alerts tab and click on Block invite. You will no longer receive invites from that contact until you unblock them.',
        },
        {
          title: 'Q: What Do I Do If I Accidentally Reject An Invite?',
          data:
            'You don’t need to worry; the other person can resend the invite or you can send one to them.',
        },
        {
          title: 'Q: What Do I Do If I Accidentally Block An Invite?',
          data:
            'Go to Contacts tab, click on the menu (right to the search box) – Blocked List, unblock the person. Now you or your contact can resend the invite.',
        },
        {
          title: 'Q: How Can I Hide My Mobile Number?',
          data:
            'No, you cannot hide your mobile number, this app is designed to share the phone contacts.',
        },
        {
          title: 'Q: How Can I Change My Business Card Template?',
          data:
            'Go to settings, click on Cards and choose your desired card template from the list.',
        },
        {
          title: 'Q: How Can I Hide My Personal Details?',
          data:
            'Go to settings, click on personal profile and toggle the button to turn off and save the settings. You will no longer see the details on the business card.',
        },
        {
          title: 'Q: How Can I Send Multiple Invites?',
          data:
            'In the Nearby tab, select all the people you want to send an invite to and click on “Invite” in the top right corner. This will send the same Invite to all chosen contacts at the same time.',
        },
        {
          title: 'Q: What Does A Premium Membership Include?',
          data:
            'A premium membership allows you access to a wider array of business card templates to choose from. It also removes all ads.',
        },
        {
          title: 'Q: How Do I Change My Phone Number For My Account?',
          data:
            'Go to settings, click on “Change My Number” at the bottom. When you enter a new number, you will receive the OTP to the new phone number. Then, enter the OTP to authenticate and you will be logged in with all your contacts intact.',
        },
        {
          title: 'Q: Will The Other Person Know If I Block Them?',
          data:
            'No, the other person will only see that the invitation has been sent. This will disappear with they are unblocked.',
        },
        {
          title: 'Q: Can I Call People Directly From The App?',
          data:
            'The app will allow you to click on all phone numbers, emails, and links that will take you to their respective applications without the hassle of having to copy and paste them.',
        },
      ],
      TempMenu: [],
    };
  }
  componentDidMount() {
    this.setState({TempMenu: this.state.menu});
  }
  renderAccordians = () => {
    const items = [];
    for (let item of this.state.menu) {
      items.push(<Accordian title={item.title} data={item.data} />);
    }
    return items;
  };
  filterSearch(value) {
    this.setState({SearchText: value, TempMenu: this.state.TempMenu});
    var searchItems = value
      .trim()
      .toLowerCase()
      .split(' ');
    value = value.trim().toLowerCase();
    var ContactsData = [];
    ContactsData = this.state.TempMenu.filter(contact => {
      if (
        searchItems.filter(
          x => contact.title != null && contact.title.toLowerCase().includes(x),
        ).length > 0
      ) {
        return true;
      }
    });
    this.setState({
      menu: ContactsData,
    });
  }
  _handleHeaderProfileIcon = () => {
    const {userProfile} = this.props;
    return (
      <View>
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
  ContactUsClick = () => {
    const {userProfile} = this.props;
    Actions.ContactUs({userProfile: userProfile});
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
              flex: 0.3,
              justifyContent: 'center',
            }}>
            <ImageBackground
              style={{width: '100%', height: '100%'}}
              imageStyle={{
                resizeMode: 'stretch',
              }}
              source={require('../Images/helpcenter.png')}>
              <View style={{position: 'absolute', right: 5, left: 10, top: 40}}>
                <BoldText style={{color: '#000000', fontSize: 20}}>
                  How can we help you{' '}
                </BoldText>
                <BoldText
                  style={{color: '#000000', fontSize: 25, marginLeft: 50}}>
                  today ?
                </BoldText>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: 'blue',
                    margin: 30,
                  }}>
                  <View style={{flex: 0.9, backgroundColor: '#ffffff'}}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Search for Help Topics here"
                      onChangeText={text => this.filterSearch(text)}
                      value={this.state.SearchText}
                    />
                  </View>
                  <View
                    style={{
                      alignSelf: 'center',
                      flex: 0.1,
                      backgroundColor: 'blue',
                    }}>
                    <Search style={{color: '#a9a9a9', fontSize: 25}} />
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
          <View style={{flex: 0.05}}>
            <Text style={{textAlign: 'center'}}>Application Support</Text>
          </View>
          <View style={{flex: 0.3}}>
            <ScrollView>{this.renderAccordians()}</ScrollView>
          </View>
          <View style={{flex: 0.05}}>
            {this.state.questionsNotFoundView ? (
              <View style={{flex: 0.2, margin: 5}}>
                <Text style={{textAlign: 'center'}}>Result: Sorry</Text>
                <Text style={{marginLeft: 20}}>
                  We are not able to find search result
                </Text>
              </View>
            ) : null}
          </View>
          <View style={{flex: 0.05}}>
            <View style={styles.viewAlreadyAMember}>
              <BoldText style={styles.textAlreadyAMember}>
                Still can't find what are you looking for?
              </BoldText>
              <TouchableOpacity onPress={() => this.ContactUsClick()}>
                <BoldText style={styles.textLogin}>Contact US</BoldText>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 0.09}} />
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
)(HelpCenter);

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
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
  textLogin: {
    fontSize: 15,
    color: '#08a0af',
    textDecorationLine: 'underline',
    textDecorationColor: '#4b230d',
  },
  textGetStarted: {color: '#ffffff', fontSize: 15},
  viewAlreadyAMember: {
    flexDirection: 'row',
    zIndex: 999,
    justifyContent: 'center',
    marginBottom: 20,
  },
  textAlreadyAMember: {
    fontSize: 15,
    textAlign: 'center',
    color: '#000',
  },
});
