import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageBackground,
  BackHandler,
} from 'react-native';
import FlipComponent from 'react-native-flip-component';
import Communications from 'react-native-communications';
import { cardElementGroupIds, CommonStyles } from '../shared/Constants';
import { goBack } from '../Services/BackButtonServices';
import { connect } from 'react-redux';
import { Close, Rotate, Flip, Cross } from '../shared/Icon';
import LinearGradient from 'react-native-linear-gradient';
import crossLogo from '../Images/cross.png';
import openMap from 'react-native-open-maps';
import Mailer from 'react-native-mail';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


class ViewCardForUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      IWidth: 0,
      IHeight: 0,
      width: '',
      height: '',
      isFlipped: false,
      CardHeight: '',
      CardWidth: '',
      AspectRatio: '',
      CardFrontFile: '',
      CardBackFile: '',
      BorderRadius: 0,
      UserId: '',
      Theme: '',
      cardshape: 0,
      NickName: '',
      HeightMultiple: 0,
    };
    BackHandler.addEventListener('hardwareBackPress', this.back_Button_Press);
  }
  back_Button_Press = () => {
    global.MyConnections.setState({
      TextInputPlaceHolder: 'Name/Phone number',
      IsScan: true,
      IsCancel: false,
    });
    global.MyConnections._handleMyContactSearch('');
  };
  componentDidMount() {
    const { CUserId, Theme } = this.props;
    this.GetUserCardElements(CUserId);
    this.GetActiveCarddetaillsById(Theme);
  }
  GetUserCardElements(UserId) {
    try {
      var dataToSend = { Userid: UserId };
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
          this.setState({ dataSource: responseJson });
        });
    } catch (e) { }
  }
  GetActiveCarddetaillsById(Theme) {
    try {
      var dataToSend = { CardId: Theme };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/GetActiveCarddetaillsById', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          let _x = JSON.parse(JSON.stringify(responseJson));
          this.setState({ cardshape: _x.cardshape });
          this.setState({ CardFrontFile: _x.cardfrontfile });
          this.setState({ BorderRadius: _x.borderradius });
          this.setState({ CardBackFile: _x.cardbackfile });

          if (_x.cardshape == 1) {
            var Width = 494;

            var _windowwidth = Dimensions.get('window').width;

            var Height = 280;

            var _aspectratio = Height / Width;

            this.setState({ AspectRatio: _aspectratio });

            var _refHeight = _aspectratio * _windowwidth;

            this.setState({ IHeight: _refHeight });

            this.setState({ IWidth: _windowwidth });
          } else {
            var Width = 280;

            var Height = 494;

            var _aspectratio = Width / Height;

            this.setState({ AspectRatio: _aspectratio });

            var _refWidth = _aspectratio * Height;

            this.setState({ IHeight: Height });

            this.setState({ IWidth: _refWidth });
          }
          var _height =
            (this.state.IHeight - 20) / (_x.cardshape === 1 ? 280 : 494);
          this.setState({ HeightMultiple: _height });
        })
        // eslint-disable-next-line no-alert
        .catch(error => alert(error.message));
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e.message);
    }
  }

  UpdateElementDimensions = value => {
    console.log(value);
    console.log(cardElementGroupIds)
    if (
      value.elementgroupId == cardElementGroupIds.Mobile ||
      value.elementgroupId == cardElementGroupIds.HomePhone ||
      value.elementgroupId == cardElementGroupIds.CompanyMobile ||
      value.elementgroupId == cardElementGroupIds.Fax ||
      value.elementgroupId == cardElementGroupIds.Extension
    ) {
      Communications.phonecall(value.cardelementtext, true);
    } else if (
      value.elementgroupId == cardElementGroupIds.Email ||
      value.elementgroupId == cardElementGroupIds.CompanyEmail
    ) {
      // Communications.email(value.cardelementtext, null, null, '', '');
      Mailer.mail({
        // subject: 'need help',
        recipients: [`${value.cardelementtext}`],
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
    } else if (
      value.elementgroupId === cardElementGroupIds.Website ||
      value.elementgroupId === cardElementGroupIds.CompanyWebsite ||
      value.elementgroupId === cardElementGroupIds.Facebook ||
      value.elementgroupId === cardElementGroupIds.Skype ||
      value.elementgroupId === cardElementGroupIds.Linkedin ||
      value.elementgroupId === cardElementGroupIds.Twitter
    ) {
      Communications.web(`https://${value.cardelementtext}`);
    }
    else if (
      value.elementgroupId == cardElementGroupIds.Address ||
      value.elementgroupId == cardElementGroupIds.CompanyAdrees
    )
    {
      let latitude = parseFloat(value.cardelementtext.split("////")[1])
      let longitude = parseFloat(value.cardelementtext.split("////")[2])
      console.log("locationLat",latitude);
      console.log("locationLng",longitude);
      openMap({ latitude: latitude, longitude: longitude });
        console.log(value.cardelementtext)
    }
  };
  _handleHeaderLeftIconPress = () => {
    const { handleGoBack } = this.props;
    global.MyConnections.setState({
      TextInputPlaceHolder: 'Name/Phone number',
      IsScan: true,
      IsCancel: false,
    });
    global.MyConnections._handleMyContactSearch('');
    handleGoBack();
  };
  _handleOnClosePress = () => {
    const { handleGoBack } = this.props;
    handleGoBack();
  };
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f4f6f9' }}>
        <View style={{ flex: 5 }}>
          <View style={{ flex: 0.7 }} />
          <View style={{ alignItems: 'center' }}>
            <FlipComponent
              isFlipped={this.state.isFlipped}
              frontView={
                <View>
                  <ImageBackground
                    style={{
                      width: windowWidth / 1.05,
                      height: windowHeight / 1.05,
                      overflow: "hidden",
                      borderRadius: 20
                    }}
                    imageStyle={{ borderRadius: this.state.BorderRadius }}
                    source={{
                      uri:
                        global.APIURL +
                        'uploadimgs/cards/' +
                        this.state.CardFrontFile,
                    }}>
                    {this.state.dataSource.map(y => {
                      if (y.cardelElements.cardArea == 'F') {
                        return (
                          <View>
                            {y.cardelElements.elementTypeName == 'F_Logo' ? (
                              <Image
                                style={{
                                  position: 'absolute',
                                  height: hp(`${y.cardelElements.height * 0.20}%`),
                                  width: wp(`${y.cardelElements.height * 0.40}%`),
                                  left: y.cardelElements.positionX * (windowWidth/260),
                                    top: y.cardelElements.elementTypeName != 'F_Company Address'?
                                    y.cardelElements.positionY 
                                    *windowHeight/580
                                    :windowHeight/1.25 ,
                                }}
                                source={
                                  global.BusinessLogo == ''
                                    ? {
                                      uri:
                                        global.APIURL +
                                        'uploadimgs/BusinessProfilePictures/' +
                                        y.cardelElements.cardelementtext,
                                    }
                                    : global.BusinessLogo
                                }
                              />
                            ) : null}
                            {y.cardiconsLookup != null &&
                              y.cardelElements.isShow == true &&
                              y.cardelElements.cardelementtext != '' &&
                              y.cardelElements.cardelementtext != 'null' &&
                              y.cardelElements.cardelementtext != null ? (
                              <Image
                                style={{
                                  position: 'absolute',
                                  height: parseFloat(this.state.HeightMultiple * 20),
                                  width: parseFloat(this.state.HeightMultiple * 20),
                                  left:   (y.cardelElements.positionX) *0.5,
                                    top:
                                    y.cardelElements.elementTypeName != 'F_Company Address'?
                                    y.cardelElements.positionY
                                    *windowHeight/480
                                    :windowHeight / 1.1,
                                }}
                                source={{
                                  uri:
                                    global.APIURL +
                                    'uploadimgs/icons/' +
                                    y.cardiconsLookup.iconfile,
                                }}
                              />
                            ) : null}
                            {y.cardelElements.elementTypeName != 'F_Logo' ? (
                              // <View style={{top:hp('85%')/(UserCardDetails.length-1), borderColor:"red", borderWidth:2}}>
                              <Text
                                style={{
                                  flexWrap: 'wrap',
                                  position: 'absolute',
                                  width: windowWidth - hp("5%"),
                                  fontSize: y.cardelElements.fontSize * hp("0.16%"),
                                  color: y.cardelElements.fontColor,
                                  fontWeight: y.cardelElements.isBold ? 'bold' : '',
                                  fontStyle: y.cardelElements.isItalic
                                    ? 'italic'
                                    : '',
                                  textDecorationLine: y.cardelElements.isUnderline
                                    ? 'underline'
                                    : '',
                                  left: y.cardelElements.elementTypeName != 'F_Tag Line' ?
                                    y.cardelElements.elementTypeName == 'F_Extension' ?
                                      y.cardelElements.positionX
                                      * 0.5 + 150 :
                                      (y.cardelElements.positionX * 0.5) + 25
                                    // *1.03 :
                                    : 0,
                                  textAlign: y.cardelElements.elementTypeName != 'F_Tag Line' ?
                                    y.cardelElements.elementTypeName != "F_Company Name" ?
                                    y.cardelElements.elementTypeName != 'F_Company Address'? null : 'center' : 'center' : 'center',
                                  top: y.cardelElements.elementTypeName != 'F_Company Address' ?
                                      y.cardelElements.positionY
                                      * windowHeight / 480
                                      : windowHeight / 1.1,
                                }}
                                numberOfLines={3}>
                                {y.cardelElements.isShow == true
                              ? y.cardelElements.cardelementtext != '' &&
                                y.cardelElements.cardelementtext != null &&
                                y.cardelElements.cardelementtext != 'null'&&
                                y.cardelElements.elementTypeName != 'F_Company Address' &&
                                y.cardelElements.elementTypeName != 'F_Extension'?
                                 y.cardelElements.cardelementtext : 
                                 y.cardelElements.cardelementtext != '' &&
                                 y.cardelElements.cardelementtext != null &&
                                 y.cardelElements.cardelementtext != 'null'&&
                                 y.cardelElements.elementTypeName != 'F_Company Address' &&
                                 y.cardelElements.elementTypeName == 'F_Extension'?
                                 'Ext: '+ y.cardelElements.cardelementtext :
                                 y.cardelElements.cardelementtext != '' &&
                                 y.cardelElements.cardelementtext != null &&
                                 y.cardelElements.cardelementtext != 'null'&&
                                 y.cardelElements.elementTypeName == 'F_Company Address' &&
                                 y.cardelElements.elementTypeName != 'F_Extension'?
                                 y.cardelElements.cardelementtext.split("////")[0]
                                : ''
                              : null}
                              </Text>
                              // </View>
                            ) : null}
                            {/* {y.cardelElements.elementTypeName === 'F_Company Address'?(
  
  
                          ):null} */}
                            <TouchableOpacity
                              onPress={() =>
                                this.UpdateElementDimensions(y.cardelElements)
                              }
                              style={{
                                width: 170,
                                position: 'absolute',
                                height: parseInt(
                                  ((this.state.IHeight - 20) /
                                    (this.state.cardshape == 1 ? 280 : 494)) *
                                  y.cardelElements.height,
                                ),
                                left: y.cardelElements.elementTypeName != 'F_Tag Line' ?
                                y.cardelElements.elementTypeName == 'F_Extension' ?
                                  y.cardelElements.positionX
                                  * 0.5 + 150 :
                                  (y.cardelElements.positionX * 0.5) + 25
                                // *1.03 :
                                : 0,
                                  top: y.cardelElements.elementTypeName != 'F_Company Address' ?
                                    y.cardelElements.positionY
                                    * windowHeight / 480
                                    : windowHeight / 1.1,
                              }}
                            />
                          </View>
                        );
                      } else {
                        return <View />;
                      }
                    })}
                  </ImageBackground>
                </View>
              }
              backView={
                <View
                  style={{
                    //width: IWidth ,
                    // height: IHeight,
                    //margin: 10,
                    //  marginLeft:25,
                    // margin: 5,
                    alignSelf: 'center',
                   // opacity: 1,
                  }}>
                  <ImageBackground
                    style={{
                      width: windowWidth / 1.05,
                      height: windowHeight / 1.05,
                      overflow: "hidden",
                      borderRadius: 20
                    }}
                    imageStyle={{ borderRadius: this.state.BorderRadius }}
                    source={{
                      uri:
                        global.APIURL +
                        'uploadimgs/cards/' +
                        this.state.CardBackFile,
                    }}>
                    {this.state.dataSource.map(y => {
                      if (y.cardelElements.cardArea == 'B') {
                        return (

                          <View>
                            {y.cardelElements.elementTypeName ==
                              'B_Profile Picture' ? (
                              <Image
                                style={{
                                  position: 'absolute',
                                  height: hp(`${y.cardelElements.height * 0.20}%`),
                                  width: wp(`${y.cardelElements.height * 0.40}%`),
                                  left: y.cardelElements.positionX * (windowWidth/260),
                             // y.cardelElements.positionX*wp('0.41%'),
                            top: y.cardelElements.elementTypeName != 'B_Address'?
                            y.cardelElements.positionY 
                            *windowHeight/580
                            :windowHeight/1.25
                                }}
                                source={
                                  global.PersonalPhoto == ''
                                    ? {
                                      uri:
                                        global.APIURL +
                                        'uploadimgs/ProfilePictures/' +
                                        y.cardelElements.cardelementtext,
                                    }
                                    : global.PersonalPhoto
                                }
                              />
                            ) : null}
                            {y.cardiconsLookup != null &&
                              y.cardelElements.isShow == true &&
                              y.cardelElements.cardelementtext != '' &&
                              y.cardelElements.cardelementtext != 'null' &&
                              y.cardelElements.cardelementtext != null ? (
                              <Image
                                style={{
                                  position: 'absolute',
                                  height: parseFloat(this.state.HeightMultiple * 20),
                                  width: parseFloat(this.state.HeightMultiple * 20),
                                  left: y.cardelElements.positionX * (windowHeight/1200),
                                  top: y.cardelElements.elementTypeName != 'B_Address'?
                                    y.cardelElements.positionY
                                    *windowHeight/500
                                    :windowHeight/1.1,
                                }}
                                source={{
                                  uri:
                                    global.APIURL +
                                    'uploadimgs/icons/' +
                                    y.cardiconsLookup.iconfile,
                                }}
                              />
                            ) : null}
                            {y.cardelElements.elementTypeName !=
                              'B_Profile Picture' ? (
                              <Text
                                style={{
                                  flexWrap: 'wrap',
                                  position: 'absolute',
                                  width: windowWidth - hp("5%"),
                                  fontSize: y.cardelElements.fontSize * hp("0.16%"),
                                  color: y.cardelElements.fontColor,
                                  fontWeight: y.cardelElements.isBold ? 'bold' : '',
                                  fontStyle: y.cardelElements.isItalic
                                    ? 'italic'
                                    : '',
                                  textDecorationLine: y.cardelElements.isUnderline
                                    ? 'underline'
                                    : '',
                                    left: (y.cardelElements.positionX * (windowHeight/1200))/0.5 ,
                                   textAlign:y.cardelElements.elementTypeName != 'B_Address' ? null : 'center',
                                     top:
                                    y.cardelElements.elementTypeName != 'B_Address'?
                                       y.cardelElements.positionY 
                                       *windowHeight/500
                                       :windowHeight/1.1,
                                }}
                                numberOfLines={3}>
                                {y.cardelElements.isShow == true
                              ? y.cardelElements.cardelementtext != '' &&
                                y.cardelElements.cardelementtext != null &&
                                y.cardelElements.cardelementtext != 'null' &&
                                y.cardelElements.elementTypeName != 'B_Address'
                                ? y.cardelElements.cardelementtext
                                :y.cardelElements.cardelementtext != '' &&
                                y.cardelElements.cardelementtext != null &&
                                y.cardelElements.cardelementtext != 'null' &&
                                y.cardelElements.elementTypeName == 'B_Address'
                                ? y.cardelElements.cardelementtext.split("////")[0]
                                : ''
                              : null}
                              </Text>
                            ) : null}
                            <TouchableOpacity
                              onPress={() =>
                                this.UpdateElementDimensions(y.cardelElements)
                              }
                              style={{
                                width: 170,
                                position: 'absolute',
                                height: parseInt(
                                  ((this.state.IHeight - 20) /
                                    (this.state.cardshape == 1 ? 280 : 494)) *
                                  y.cardelElements.height,
                                ),
                                left: (y.cardelElements.positionX * (windowHeight/1200))/0.5 ,
                                  top: y.cardelElements.elementTypeName != 'B_Address'?
                                     y.cardelElements.positionY 
                                     *windowHeight/500
                                     :windowHeight/1.1,
                              }}
                            />
                          </View>
                        );
                        // }
                      } else {
                        return <View />;
                      }
                    })}
                  </ImageBackground>
                </View>
              }
            />
            <View
              style={{
                position: 'absolute',
                left: -1,
                top: -3,
                margin: 10,
              }}>
              <LinearGradient
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={['transparent', '#ffffff']}
                style={{ height: 30, width: 30, borderRadius: 60, bottom: 0, left: 5 }}>
                <TouchableOpacity onPress={() => this._handleHeaderLeftIconPress()}>
                  <Cross />
                  {/* <Image source={crossLogo} style={{ height: 30, width: 30 }} /> */}
                </TouchableOpacity>
              </LinearGradient>
            </View>
            <View
              style={{
                margin: 10,
                position: 'absolute',
                right: -1,
                top: -3,
              }}>
              <LinearGradient
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={['transparent', '#ffffff']}
                style={{ height: 30, width: 30, borderRadius: 60, bottom: 0, right: 5 }}>
                <TouchableOpacity onPress={() => {
                  this.setState({ isFlipped: !this.state.isFlipped });
                }}>
                  <Flip />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
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
)(ViewCardForUser);