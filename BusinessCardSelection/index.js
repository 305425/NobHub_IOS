import React, { Component } from 'react';
import {
  View,
  Dimensions,
  Alert,
  Share,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import BusinessCard from '../BusinessCard';
import ServiceCalls from '../Services/APICalls';
import { goBack } from '../Services/BackButtonServices';
import base64 from 'react-native-base64';
import { PlayStoreLink } from '../shared/Constants';
import CommonHeader from '../shared/CommonHeader';
import { EditCard, Cards, X, ArrowLeft } from '../shared/Icon';
import { Actions } from 'react-native-router-flux';
import { BoldText, MediumBoldText } from '../shared/Text';
import { CommonStyles } from '../shared/Constants';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
 

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


class BusinessCardSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IHeight: '',
      IWidth: '',
      HeightMultiple: '',
      UserCardDetails: [],
      ActiveCarddetaills: [],
      isFlipped: false,
      CardCategories: [],
      CategoryCardDetails: [],
      TextInputValueHolder:
        'Hey! Download this awesome app from the Google Play Store/Apple App Store. You can install NobHub here: ',
      Title: 'CHECK OUT THIS COOL NEW APP - NOBHUB',
      BusinessCardTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      EditBusinessCardTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      BusinessCardIconColor: '#777777',
      EditBusinessCardIconColor: '#777777',
      CategorieId: '',
    };
    global.BusinessCardSelection = this;
    global.MyBusinesscard = this;
  }
  MyConnectionPress = () => {
     
    Actions.myConnections();

  };
  GetCardCategories() {
    try {
      ServiceCalls.GetCardCategories()
        .then(response => {
          //var _categories = response.slice(0, 4);
          this.setState({ CardCategories: response });
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  }
  _handleGetCardsByCategoryId = categorieID => {
    try {
      fetch(
        global.APIURL +
        `api/Card/GetCardsByCategoryId?CategoryId=${categorieID}`,
        {
          method: 'GET',
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          this.setState({ CategoryCardDetails: responseJson });
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  componentDidMount = () => {
    const { userProfile } = this.props;
    const Theme = userProfile.theme;
    this.GetUserDefaultCardByUserId();
    this.GetActiveCarddetaillsById(Theme);
    this.GetCardCategories();
  };
  GetUserDefaultCardByUserId = () => {
    const { userProfile } = this.props;
    try {
      ServiceCalls.GetUserDefaultCardByUserId(userProfile.guid)
        .then(response => {
          this.setState({ UserCardDetails: response });
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  GetActiveCarddetaillsById = Theme => {
    try {
      ServiceCalls.GetActiveCarddetaillsById(Theme)
        .then(response => {
          let _x = JSON.parse(JSON.stringify(response));
          this.setState({ ActiveCarddetaills: _x });
          this.setState({ CategorieId: _x.category });
          //this._handleGetCardsByCategoryId(this.state.CategorieId);
          if (_x.cardshape === 1) {
            //horizantal
            var Width = 494;

            var _windowWidth = Dimensions.get('window').width;

            var Height = 280;

            var _aspectRatio = Height / Width;

            var _refHeight = _aspectRatio * _windowWidth;

            this.setState({ IHeight: _refHeight });

            this.setState({ IWidth: _windowWidth });
          } else {
            var Width = 280;
            var _windowHeight = Dimensions.get('screen').height;
            // alert(_windowHeight);
            var Height = 494;

            var _aspectRatio = Width / Height;

            var _refWidth = _aspectRatio * _windowHeight;
            //alert(_refWidth);

            this.setState({ IHeight: _windowHeight });

            this.setState({ IWidth: _refWidth });
          }
          var _height =
            (this.state.IHeight - 20) / (_x.cardshape === 1 ? 280 : 494);
          this.setState({ HeightMultiple: _height });
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  _handleOnFlipPress = () => {
    this.setState({ isFlipped: !this.state.isFlipped });
  };
  GetBusinessCard = () => {
    const { userProfile,isFromSelectBusinessCard } = this.props;
    return (
      <BusinessCard
        isStyleEnable={true}
        onPressFlip={isFlipped => this._handleOnFlipPress(isFlipped)}
        UserCardDetails={this.state.UserCardDetails}
        ActiveCarddetaills={this.state.ActiveCarddetaills}
        IWidth={this.state.IWidth}
        IHeight={this.state.IHeight}
        HeightMultiple={this.state.HeightMultiple}
        isFlipped={this.state.isFlipped}
        userProfile={userProfile}
        isFromSelectBusinessCard={isFromSelectBusinessCard}
      />
    );
  };
  _handleBackPress = () => {
    const { handleGoBack } = this.props;
    handleGoBack();
  };
  _handleRightPress = () => {
    const { userProfile } = this.props;

    var UserId = userProfile.guid;
    var date = new Date();
    date =
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    var _data = base64.encode(`${UserId}`);
    var URL =
      global.APIURL +
      `BusinessCards/ShareCard?UserId=${_data}&datetime=${date}`;

    Share.share({
      title: 'Hi',
      message:
        URL +
        '\n' +
        this.state.TextInputValueHolder.toString() +
        '\n' +
        PlayStoreLink.android,
    })
      .then(() => { })
      .catch(errorMsg => Alert.alert(errorMsg.message));
  };
  _handleHeaderRightIcon = () => {
    return (
      <View>
        <View style={styles.leftHeader}>
          <EditCard
            style={{
              color: CommonStyles.appColor,
              fontSize: 25,
              textAlign: 'center',
            }}
          />
        </View>
        <Text style={{ color: '#ffffff', fontSize: 10, textAlign: 'center' }}>
          Edit Card
        </Text>
      </View>
    );
  };
  // _handleHeaderLeftIconPress = () => {
  //   const {handleGoBack} = this.props;
  //   handleGoBack();
  // };
  _handleChooseCards = () => {
    try {
      const { userProfile } = this.props;
      Actions.categories({
        CardCategories: this.state.CardCategories,
        UserProfile: userProfile,
        CategorieId: this.state.CategorieId,
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  _handleHeaderText = () => {
    return (
      <View>
        <BoldText style={{ color: '#ffffff', textAlign: 'center', fontSize: 14 }}>
          My Business Card
        </BoldText>
      </View>
    );
  };
  _handleHeaderLeftIcon = () => {
    // return null;

    return (
      // <View style={styles.leftHeader}>
      //   {/* <TouchableOpacity onPress={() => Actions.myConnections()}>
      //     <ArrowLeft style={{color: CommonStyles.appColor, fontSize: 25}} />
      //   </TouchableOpacity> */}
      //   <TouchableOpacity
      //     style={{ alignItems: 'center' }}
      //     onPress={() => this.MyConnectionPress()}>

      //     <Image
      //       style={{ height: 29, width: 29, top:8 }}
      //       source={require('../Images/myconnectionsblue.png')}
      //     />



      //     <Text style={{ color: '#ffffff', fontSize: 10, textAlign: 'center' }}>
      //       My Connections
      //         </Text>
      //   </TouchableOpacity>
      // </View>
      <View>
        <View style={styles.leftHeader}>
          <TouchableOpacity onPress={() => this.MyConnectionPress()}>
            {/* <Cards style={{ color: CommonStyles.appColor, fontSize: 25 }} /> */}
            <Image
             style={{ height: 26, width: 26 }}
             source={require('../Images/myconnectionsblue.png')}
          />
          </TouchableOpacity>
        </View>
        <Text numberOfLines={1} style={{ color: '#ffffff', fontSize: 10, textAlign: 'center' }}>My Connections</Text>
      </View>
    );
  };
  _handleOnBusinessTabPress = () => {
    const { userProfile } = this.props;
    this.setState({
      BusinessCardTabColor: ['#089bab', '#11cbdf'],
      EditBusinessCardTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      BusinessCardIconColor: '#ffffff',
      EditBusinessCardIconColor: '#777777',
    });
    Actions.categories({
      CardCategories: this.state.CardCategories,
      UserProfile: userProfile,
      CategorieId: this.state.CategorieId,
    });
  };
  _handleHeaderRightIconPress = () => {
    const { userProfile } = this.props;
   // console.log("UsersInfo2",userProfile)
     Actions.profileCard({ userProfile: userProfile });
  };
  _handleHeaderCenterIcon = () => {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 0.2 }} />
        <View>
          <View style={styles.leftHeader}>
            <TouchableOpacity onPress={() => this._handleChooseCards()}>
              {/* <Cards style={{ color: CommonStyles.appColor, fontSize: 25 }} /> */}
              <Image source={require('../Images/stackIcon1.png')} style={{ height: 26, width: 26, color: CommonStyles.appColor }} />
            </TouchableOpacity>
          </View>
          <Text style={{ color: '#ffffff', fontSize: 10 }}>Card Template</Text>
        </View>
        <View style={{ flex: 0.2 }} />
      </View>
    );
  };
  _handleHeaderProfileIcon = () => {
    return null;
  };
  _handleHeaderProfileIconPress = () => {
    Actions.myConnections();
  };
  menuClick = () => {
    // const {userProfile} = this.props;
    // console.log("UsersInfo",userProfile)
    try {
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
    } catch (e) {
      Alert.alert(e.message);
    }
    
  }
  render() {
    const { isFromSelectBusinessCard } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: '#f4f6f9' }}>
        <View style={{ flex: 0.18 }}>
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
        <View style={{ flex: 1 }}>
          
        {isFromSelectBusinessCard ? (
       <View style={{ flex: 0.17 }}>
          <View style={{marginTop:"2%",flexDirection:"row", justifyContent:"space-around"}}>
        <View style={{top:5}}>
        <ProgressBarAnimated
            width={windowWidth/1.5}
            height={20}
            value={32}
            backgroundColorOnComplete="#6CC644"
            backgroundColor="#099cac"
            borderColor="#000000"
            borderRadius={20}
          />
        </View>
          <TouchableOpacity onPress={()=>this.menuClick()} style={{alignItems: 'center',backgroundColor: CommonStyles.appColor,width:80, height:30, borderRadius:30}}>
            <View style={{top:5}}>
            <MediumBoldText style={{fontSize:16, color:"#fff"}}>Profile</MediumBoldText>
            </View>
          </TouchableOpacity>
         </View>
            <View style={{ flex: 0.1 }}>
              <Text
                style={{
                  fontSize: 14,
                  textAlign: 'center',
                  right:"21%",
                  color: "#000",
                  bottom:25, fontWeight:"bold"
                }}>
                {/* {'Your profile is 32% done!'} */}
                32%
              </Text>
              <Text style={{ textAlign: 'center',fontSize: 12, bottom:18 }}>
                {
                  'Please finish your profile so people can view your Business Card with all your details'
                }
              </Text>
            </View>
       </View>
          ) : null}
          {this.GetBusinessCard()}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  headerCustomMenu: {
    marginRight: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 100,
  },
  bottomText: {

    flex: 1,
    color: '#ffffff',
    fontSize: 7.7,
    textAlign: 'center',
    top: 10
    //textAlign: 'center',
  },
  headerTextMenu: {
    color: 'red',
  },
  leftHeader: {
    flexDirection: 'column',
    height: 40,
    width: 40,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
  },
});
const mapStateToProps = state => {
  return {
    userProfile: state.user.userProfile,
  };
};
const mapDispatchToProps = {
  handleGoBack: goBack,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BusinessCardSelection);
