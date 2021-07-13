import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import FlipComponent from 'react-native-flip-component';
import LinearGradient from 'react-native-linear-gradient';
import {Flip, ShareICon} from '../shared/Icon';
import Communications from 'react-native-communications';
import {cardElementGroupIds, CommonStyles} from '../shared/Constants';
import Mailer from 'react-native-mail';
import Hyperlink from 'react-native-hyperlink';
import openMap from 'react-native-open-maps';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { EventRegister } from 'react-native-event-listeners';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default class BusinessCard extends Component {
  constructor(props) {
    super(props);
  }
  _handleOnPressFlip = () => {
    const {onPressFlip, isFlipped} = this.props;
    onPressFlip(isFlipped);
  };
  UpdateElementDimensions = value => {
    console.log(value);
    console.log(cardElementGroupIds)
    if (
      value.elementgroupId == cardElementGroupIds.Mobile ||
      value.elementgroupId == cardElementGroupIds.CompanyMobile ||
      value.elementgroupId == cardElementGroupIds.Fax ||
      value.elementgroupId == cardElementGroupIds.Extension ||
      value.elementgroupId == cardElementGroupIds.HomePhone
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
          {text: 'Ok', onPress: () => console.log('OK: Email Error Response')},
          {text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response')}
        ],
        { cancelable: true }
      )
    });
    } else if (
      value.elementgroupId === cardElementGroupIds.Website ||
      value.elementgroupId === cardElementGroupIds.CompanyWebsite ||
      value.elementgroupId === cardElementGroupIds.Facebook ||
      value.elementgroupId === cardElementGroupIds.Instagram ||
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
  render() {
    const {
      UserCardDetails,
      ActiveCarddetaills,
      IWidth,
      IHeight,
      HeightMultiple,
      isFlipped,
      OnSharePress,
      isStyleEnable,
      isFromSelectBusinessCard
    } = this.props;
//console.log("CardDetails",UserCardDetails)
//console.log("toggleElement",this.state.toggleElementId + "    "+ this.state.toggleElementValue)
//console.log("dfuggdgfvvf", UserCardDetails.map(x=> x.cardiconsLookup.iconfile))
//y.cardiconsLookup.iconfile

    return (
      <View style={{flex:1}}>
        {isFromSelectBusinessCard?(
      <View
        style={{
          flex: 1,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <FlipComponent
          isFlipped={isFlipped}
          frontView={
            <View
              style={{
               // opacity: 1,
                margin: 5,
                alignSelf: 'center',
              }}>
              <ImageBackground
                style={!isStyleEnable?
                      {width: IWidth - 5, 
                       height: IHeight - 5}:
                      {width: windowWidth-5,
                         height: windowHeight/1.36, 
                         overflow:"hidden", 
                         borderRadius:10,
                         marginBottom:5, 
                         bottom:5}}
                imageStyle={{borderRadius: ActiveCarddetaills.borderradius}}
                source={{
                  uri:
                    global.APIURL +
                    'uploadimgs/cards/' +
                    ActiveCarddetaills.cardfrontfile,
                }}
                >
                {UserCardDetails.map(y => {
                  if (y.cardelElements.cardArea == 'F') {
                    return (
                      <View>
                        {y.cardelElements.elementTypeName == 'F_Logo' ? (
                          <Image
                            style={{
                              position: 'absolute',
                              height: parseFloat(
                                ((IHeight - 20) /
                                  (ActiveCarddetaills.cardshape == 1
                                    ? 280
                                    : 494)) *
                                  y.cardelElements.height,
                              ),
                              width: parseFloat(
                                ((IHeight - 20) /
                                  (ActiveCarddetaills.cardshape == 1
                                    ? 280
                                    : 494)) *
                                  y.cardelElements.width,
                              ),
                              left:
                                ((IWidth - 20) /
                                  (ActiveCarddetaills.cardshape == 1
                                    ? 494
                                    : 280)) *
                                y.cardelElements.positionX ,
                              top:
                                (parseFloat(IHeight - 20) /
                                  parseFloat(
                                    ActiveCarddetaills.cardshape == 1
                                      ? 280
                                      : 494,
                                  )) *
                                parseFloat(y.cardelElements.positionY),
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
                              height: parseFloat(HeightMultiple * 20),
                              width: parseFloat(HeightMultiple * 20),
                              left:
                                (parseFloat(IWidth - 20) /
                                  parseFloat(
                                    ActiveCarddetaills.cardshape == 1
                                      ? 494
                                      : 280,
                                  )) *
                                  parseFloat(y.cardelElements.positionX) -
                                parseFloat(HeightMultiple * 20) -
                                2,
                              top:
                                (parseFloat(IHeight - 20) /
                                  parseFloat(
                                    ActiveCarddetaills.cardshape == 1
                                      ? 280
                                      : 494,
                                  )) *
                                parseFloat(y.cardelElements.positionY),
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
                          <Text
                            style={{
                              flexWrap: 'wrap',
                              position: 'absolute',
                              width:windowWidth/1.5,
                              height:
                                ((IHeight - 20) /
                                  (ActiveCarddetaills.cardshape == 1
                                    ? 280
                                    : 494)) *
                                y.cardelElements.height,
                              fontSize: y.cardelElements.fontSize,
                              color: y.cardelElements.fontColor,
                              fontWeight: y.cardelElements.isBold ? 'bold' : '',
                              fontStyle: y.cardelElements.isItalic
                                ? 'italic'
                                : '',
                              textDecorationLine: y.cardelElements.isUnderline
                                ? 'underline'
                                : '',
                              left:
                                ((IWidth - 20) /
                                  (ActiveCarddetaills.cardshape == 1
                                    ? 494
                                    : 280)) *
                                y.cardelElements.positionX,
                              top:
                                ((IHeight - 20) /
                                  (ActiveCarddetaills.cardshape == 1
                                    ? 280
                                    : 494)) *
                                y.cardelElements.positionY,
                            }}>
                            {y.cardelElements.isShow == true
                              ? y.cardelElements.cardelementtext != '' &&
                                y.cardelElements.cardelementtext != null &&
                                y.cardelElements.cardelementtext != 'null'
                                ? y.cardelElements.cardelementtext
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
                                  ((IHeight - 20) /
                                    (ActiveCarddetaills.cardshape == 1 ? 280 : 494)) *
                                    y.cardelElements.height,
                                ),
                                left:
                                  (parseFloat(IWidth - 20) /
                                    parseFloat(
                                      ActiveCarddetaills.cardshape == 1 ? 494 : 280,
                                    )) *
                                  parseFloat(y.cardelElements.positionX),
                                top:
                                  (parseFloat(IHeight - 20) /
                                    parseFloat(
                                      ActiveCarddetaills.cardshape == 1 ? 280 : 494,
                                    )) *
                                  parseFloat(y.cardelElements.positionY),
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
                margin: 5,
                alignSelf: 'center',
              //  opacity: 1,
              }}>
              <ImageBackground
                style={!isStyleEnable?
                  {width: IWidth - 5, 
                   height: IHeight - 5}:
                  {width: windowWidth-5,
                     height: windowHeight/1.36, 
                     overflow:"hidden", 
                     borderRadius:10,
                     marginBottom:5, 
                     bottom:5}}
                imageStyle={{borderRadius: ActiveCarddetaills.borderradius}}
                source={{
                  uri:
                    global.APIURL +
                    'uploadimgs/cards/' +
                    ActiveCarddetaills.cardbackfile,
                }}>
                {UserCardDetails.map(y => {
                  if (y.cardelElements.cardArea == 'B') {
                    return (
                      <View>
                        {y.cardelElements.elementTypeName ==
                        'B_Profile Picture' ? (
                          <Image
                            style={{
                              position: 'absolute',
                              height: parseFloat(
                                ((IHeight - 20) /
                                  (ActiveCarddetaills.cardshape == 1
                                    ? 280
                                    : 494)) *
                                  y.cardelElements.height,
                              ),
                              width: parseFloat(
                                ((IHeight - 20) /
                                  (ActiveCarddetaills.cardshape == 1
                                    ? 280
                                    : 494)) *
                                  y.cardelElements.width,
                              ),
                              left:
                                ((IWidth - 20) /
                                  (ActiveCarddetaills.cardshape == 1
                                    ? 494
                                    : 280)) *
                                y.cardelElements.positionX,
                              top:
                                (parseFloat(IHeight - 20) /
                                  parseFloat(
                                    ActiveCarddetaills.cardshape == 1
                                      ? 280
                                      : 494,
                                  )) *
                                parseFloat(y.cardelElements.positionY),
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
                              height: parseFloat(HeightMultiple * 20),
                              width: parseFloat(HeightMultiple * 20),
                              left:
                                (parseFloat(IWidth - 20) /
                                  parseFloat(
                                    ActiveCarddetaills.cardshape == 1
                                      ? 494
                                      : 280,
                                  )) *
                                  parseFloat(y.cardelElements.positionX) -
                                parseFloat(HeightMultiple * 20) -
                                2,
                              top:
                                (parseFloat(IHeight - 20) /
                                  parseFloat(
                                    ActiveCarddetaills.cardshape == 1
                                      ? 280
                                      : 494,
                                  )) *
                                parseFloat(y.cardelElements.positionY),
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
                              position: 'absolute',
                              height:
                                ((IHeight - 20) /
                                  (ActiveCarddetaills.cardshape == 1
                                    ? 280
                                    : 494)) *
                                y.cardelElements.height,
                              fontSize: y.cardelElements.fontSize,
                              color: y.cardelElements.fontColor,
                              left:
                                ((IWidth - 20) /
                                  (ActiveCarddetaills.cardshape == 1
                                    ? 494
                                    : 280)) *
                                y.cardelElements.positionX,
                              top:
                                ((IHeight - 20) /
                                  (ActiveCarddetaills.cardshape == 1
                                    ? 280
                                    : 494)) *
                                y.cardelElements.positionY,
                              fontWeight: y.cardelElements.isBold ? 'bold' : '',
                              fontStyle: y.cardelElements.isItalic
                                ? 'italic'
                                : '',
                              textDecorationLine: y.cardelElements.isUnderline
                                ? 'underline'
                                : '',
                            }}>
                            {y.cardelElements.isShow == true
                              ? y.cardelElements.cardelementtext != '' &&
                                y.cardelElements.cardelementtext != null &&
                                y.cardelElements.cardelementtext != 'null'
                                ? y.cardelElements.cardelementtext
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
                                  ((IHeight - 20) /
                                    (ActiveCarddetaills.cardshape == 1 ? 280 : 494)) *
                                    y.cardelElements.height,
                                ),
                                left:
                                  (parseFloat(IWidth - 20) /
                                    parseFloat(
                                      ActiveCarddetaills.cardshape == 1 ? 494 : 280,
                                    )) *
                                  parseFloat(y.cardelElements.positionX),
                                top:
                                  (parseFloat(IHeight - 20) /
                                    parseFloat(
                                      ActiveCarddetaills.cardshape == 1 ? 280 : 494,
                                    )) *
                                  parseFloat(y.cardelElements.positionY),
                              }}
                            />
                      </View>
                    );
                  }
                })}
              </ImageBackground>
            </View>
          }
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            margin: 10,
            borderColor: '#e0e0e0',
            height: 35,
            width: 35,
            borderRadius: 60,
            left: 0
          }}>
          <LinearGradient
            start={{x: 1, y: 0}}
            end={{x: 0, y: 1}}
            colors={['transparent', '#ffffff']}
            style={{height: 30, width: 30, borderRadius: 60, bottom:0}}>
            <TouchableOpacity onPress={() => this._handleOnPressFlip()}>
              <Flip />
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <View
          style={{
            position: 'absolute',
            top: 0,
            margin: 10,
            borderColor: '#e0e0e0',
            height: 35,
            width: 35,
            borderRadius: 60,
            right:0
          }}>
          <LinearGradient
            start={{x: 1, y: 0}}
            end={{x: 0, y: 1}}
            colors={['transparent', '#ffffff']}
            style={{height: 30, width: 30, borderRadius: 60, bottom:0}}>
            <TouchableOpacity onPress={OnSharePress}>
              <ShareICon />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* </TouchableOpacity> */}
      </View>):(
        <View
        style={{
          flex: 1,
         alignSelf: 'center',
         justifyContent: 'center',
         alignItems: 'center',
         height: windowHeight,
         width: windowWidth
       }}>
        <FlipComponent
          isFlipped={isFlipped}
          frontView={
            <View>
              <ImageBackground
                style={{
                  width: windowWidth/1.03,
                  height: hp('85%'),
                  overflow:"hidden",
                  borderRadius:10,
                 // flex:1,
                  flexDirection:"column",
                  position:"relative",
                 // borderWidth:2,
                 // borderColor:"orange"
                 // justifyContent:'space-between'
                }}
                imageStyle={{borderRadius: ActiveCarddetaills.borderradius}}
                source={{
                  uri:
                    global.APIURL +
                    'uploadimgs/cards/' +
                    ActiveCarddetaills.cardfrontfile,
                }}
                >
               {UserCardDetails.map(y =>{
                  if (y.cardelElements.cardArea == 'F') {
                    return (
                      <View>
                        {y.cardelElements.elementTypeName == 'F_Logo' ? (
                          <Image
                            style={{
                              position: 'absolute',
                              height:hp(`${y.cardelElements.height*0.15}%`),
                              width: wp(`${y.cardelElements.height*0.30}%`),
                              left: y.cardelElements.positionX * (windowWidth/260),
                               // y.cardelElements.positionX*wp('0.41%'),
                              top: y.cardelElements.elementTypeName != 'F_Company Address'?
                              y.cardelElements.positionY 
                              *windowHeight/580
                              :windowHeight/1.25 ,
                                // (parseFloat(IHeight - 20) /
                                //   parseFloat(
                                //     ActiveCarddetaills.cardshape == 1
                                //       ? 280
                                //       : 494,
                                //   )) *
                                // parseFloat(y.cardelElements.positionY),
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
                              height: parseFloat(HeightMultiple * 20),
                              width: parseFloat(HeightMultiple * 20),
                              left:   (y.cardelElements.positionX) *0.5,
                                // (parseFloat(IWidth - 20) /
                                //   parseFloat(
                                //     ActiveCarddetaills.cardshape == 1
                                //       ? 494
                                //       : 280,
                                //   )) *
                                //   parseFloat(y.cardelElements.positionX) -
                                // parseFloat(HeightMultiple * 20) -
                                // 2,
                                top:
                                y.cardelElements.elementTypeName != 'F_Company Address'?
                                y.cardelElements.positionY
                                *windowHeight/550
                                :hp('79%'),
                            }}
                            source={{
                              uri:
                                global.APIURL +
                                'uploadimgs/icons/' +
                                y.cardiconsLookup.iconfile,
                            }}
                          />
                        ) : null}
                        {y.cardelElements.elementTypeName != 'F_Logo'? (
                          // <View style={{top:hp('85%')/(UserCardDetails.length-1), borderColor:"red", borderWidth:2}}>
                         <Text
                            style={{
                             flexWrap: 'wrap',
                             position: 'absolute',
                              width:windowWidth-hp("5%"),
                              // height:
                              //   ((IHeight - 20) /
                              //     (ActiveCarddetaills.cardshape == 1
                              //       ? 280
                              //       : 494)) *
                              //   y.cardelElements.height,
                              fontSize: y.cardelElements.fontSize,
                              color: y.cardelElements.fontColor,
                              fontWeight: y.cardelElements.isBold ? 'bold' : '',
                              fontStyle: y.cardelElements.isItalic
                                ? 'italic'
                                : '',
                              textDecorationLine: y.cardelElements.isUnderline
                                ? 'underline'
                                : '',
                              left:
                              y.cardelElements.elementTypeName != 'F_Tag Line'?
                              y.cardelElements.elementTypeName == 'F_Extension'? 
                               y.cardelElements.positionX 
                               *0.5+150 :
                               y.cardelElements.elementTypeName == 'F_Company Address'?
                               (y.cardelElements.positionX * (windowHeight/10)) :
                                (y.cardelElements.positionX *0.5)+25
                                // *1.03 :
                                :0,
                              textAlign:y.cardelElements.elementTypeName != 'F_Tag Line'?y.cardelElements.elementTypeName != "F_Company Name" ? null : 'center' :'center',
                              top:
                             y.cardelElements.elementTypeName != 'F_Company Address'?
                                y.cardelElements.positionY
                                *windowHeight/550
                                :windowHeight/1.25,
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
                                  ((IHeight - 20) /
                                    (ActiveCarddetaills.cardshape == 1 ? 280 : 494)) *
                                    y.cardelElements.height,
                                ),
                                left:
                                y.cardelElements.elementTypeName != 'F_Tag Line'?
                                y.cardelElements.elementTypeName == 'F_Extension'? 
                            y.cardelElements.positionX 
                             *0.5+150 :
                                  (y.cardelElements.positionX *0.5)+25
                                  // *1.03 :
                                  :0,
                                top:
                                y.cardelElements.elementTypeName != 'F_Company Address'?
                                y.cardelElements.positionY
                                *windowHeight/550
                                :windowHeight/1.25,
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
                width: windowWidth/1.03,
               // height: windowHeight/1.2,
               height: hp('85%'),
                overflow:"hidden",
                borderRadius:10,
                flexDirection: 'row',
              }}>
              <ImageBackground
               style={{
                width: windowWidth/1.03,
                height: hp('85%'),
                overflow:"hidden",
                borderRadius:10,
               // flex:1,
                flexDirection:"column",
                position:"relative",
               // borderWidth:2,
               // borderColor:"orange"
               // justifyContent:'space-between'
              }}
                imageStyle={{borderRadius: ActiveCarddetaills.borderradius}}
                source={{
                  uri:
                    global.APIURL +
                    'uploadimgs/cards/' +
                    ActiveCarddetaills.cardbackfile,
                }}>
                {UserCardDetails.map(y => {
                  if (y.cardelElements.cardArea == 'B') {
                    return (
                      <View>
                        {y.cardelElements.elementTypeName ==
                        'B_Profile Picture' ? (
                          <Image
                          style={{
                            position: 'absolute',
                            height:hp(`${y.cardelElements.height*0.15}%`),
                            width: wp(`${y.cardelElements.height*0.30}%`),
                            left: y.cardelElements.positionX * (windowWidth/260),
                             // y.cardelElements.positionX*wp('0.41%'),
                            top: y.cardelElements.elementTypeName != 'B_Address'?
                            y.cardelElements.positionY 
                            *windowHeight/580
                            :windowHeight/1.25
                              // (parseFloat(IHeight - 20) /
                              //   parseFloat(
                              //     ActiveCarddetaills.cardshape == 1
                              //       ? 280
                              //       : 494,
                              //   )) *
                              // parseFloat(y.cardelElements.positionY),
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
                            height: parseFloat(HeightMultiple * 20),
                            width: parseFloat(HeightMultiple * 20),
                            left: y.cardelElements.positionX * (windowHeight/1200),
                              // (parseFloat(IWidth - 20) /
                              //   parseFloat(
                              //     ActiveCarddetaills.cardshape == 1
                              //       ? 494
                              //       : 280,
                              //   )) *
                              //   parseFloat(y.cardelElements.positionX) -
                              // parseFloat(HeightMultiple * 20) -
                              // 2,
                              top:
                              y.cardelElements.elementTypeName != 'B_Address'?
                              y.cardelElements.positionY
                             // *(hp('0.22%')-0.45)
                              // *(hp('0.2%')-0.2)
                              *windowHeight/580
                              :hp('79%'),

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
                             width: y.cardelElements.elementTypeName != 'B_Address'?
                                          windowWidth-hp("5%"): (windowWidth/1.5),
                            //  height:
                            //    ((IHeight - 20) /
                            //      (ActiveCarddetaills.cardshape == 1
                            //        ? 280
                            //        : 494)) *
                            //    y.cardelElements.height,
                             fontSize: y.cardelElements.fontSize,
                             color: y.cardelElements.fontColor,
                             fontWeight: y.cardelElements.isBold ? 'bold' : '',
                             fontStyle: y.cardelElements.isItalic
                               ? 'italic'
                               : '',
                             textDecorationLine: y.cardelElements.isUnderline
                               ? 'underline'
                               : '',
                             left: y.cardelElements.elementTypeName != 'B_Address'?
                             (y.cardelElements.positionX * (windowHeight/1200))/0.5 :
                             (y.cardelElements.positionX * (windowHeight/10)) ,
                            // textAlign:y.cardelElements.elementTypeName != 'F_Tag Line'?y.cardelElements.elementTypeName != "F_Company Name" ? null : 'center' :'center',
                             top:
                            y.cardelElements.elementTypeName != 'B_Address'?
                               y.cardelElements.positionY 
                              // *(hp('0.22%')-0.45)
                               //*(hp('0.2%')-0.2)
                               *windowHeight/580
                               :windowHeight/1.25,
                              
                          
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
                                width: windowHeight/2,
                                position: 'absolute',
                                height: parseInt(
                                  ((IHeight - 20) /
                                    (ActiveCarddetaills.cardshape == 1 ? 280 : 494)) *
                                    y.cardelElements.height,
                                ),
                                left: (y.cardelElements.positionX * (windowHeight/1200))/0.5 ,
                                // textAlign:y.cardelElements.elementTypeName != 'F_Tag Line'?y.cardelElements.elementTypeName != "F_Company Name" ? null : 'center' :'center',
                                 top:
                                y.cardelElements.elementTypeName != 'B_Address'?
                                   y.cardelElements.positionY 
                                  // *(hp('0.22%')-0.45)
                                   //*(hp('0.2%')-0.2)
                                   *windowHeight/580
                                   :windowHeight/1.25,
                              }}
                            />
                      </View>
                    );
                  }
                })}
              </ImageBackground>
            </View>
          }
        />
        <View
          style={{
            position: 'absolute',
            left: 0,
           // top: 55,
            margin: 10,
            top: 20,
            borderColor: '#e0e0e0',
            height: 35,
            width: 35,
            borderRadius: 60,
          }}>
          <LinearGradient
            start={{x: 1, y: 0}}
            end={{x: 0, y: 1}}
            colors={['transparent', '#ffffff']}
            style={{height: 30, width: 30, borderRadius: 60, bottom:0}}>
            <TouchableOpacity onPress={() => this._handleOnPressFlip()}>
              <Flip />
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <View
          style={{
            position: 'absolute',
            top: 20,
            margin: 10,
            borderColor: '#e0e0e0',
            height: 35,
            width: 35,
            borderRadius: 60,
            right:0
          }}>
          <LinearGradient
            start={{x: 1, y: 0}}
            end={{x: 0, y: 1}}
            colors={['transparent', '#ffffff']}
            style={{height: 30, width: 30, borderRadius: 60, bottom:0}}>
            <TouchableOpacity onPress={OnSharePress}>
              <ShareICon/>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* </TouchableOpacity> */}
      </View>
      )}
      </View>
    );
  }
}