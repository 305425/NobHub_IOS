import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
  Slider,
  Alert,
  ScrollView,
  TextInput
} from 'react-native';
import FlipComponent from 'react-native-flip-component';
import { connect } from 'react-redux';
import { goBack } from '../Services/BackButtonServices';
import MovableView from 'react-native-movable-view';
import Draggable from 'react-native-draggable';
import CommonHeader from '../shared/CommonHeader';
import { styles } from './ProfileCards.styles';
import LinearGradient from 'react-native-linear-gradient';
//import TextInput from './CustomTextInput';
import { setUserProfile, clearUserProfile } from '../state/operations';
import {
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Downarrow,
  Save,
  Selectall,
  Flip,
  LeftAlign,
  RightAlign,
  Undo,
} from '../shared/Icon';
import images from '../Images';
import { CommonStyles } from '../shared/Constants';
import { BoldText } from '../shared/Text';
import { Actions } from 'react-native-router-flux';
import {
  clearBusinessCardDetails,
  setBusinessCardDetails,
} from '../state/operations';
// import _ from 'lodash';
import CustomMenuIcon from '../Custom/MenuIconForHeader';
//import ColorPanel from 'react-native-color-panel';
//import {BitMapColorPicker as ColorPicker} from 'react-native-bitmap-color-picker';
import ColorPicker from 'react-native-rectangle-color-picker';
//import { ColorPicker } from 'react-native-color-picker'
import tinycolor from 'tinycolor2';
import FastImage from 'react-native-fast-image';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      IWidth: 0,
      IHeight: 0,
      isFlipped: false,
      CardHeight: '',
      CardWidth: '',
      AspectRatio: '',
      CardFrontFile: '',
      CardBackFile: '',
      CardShape: '',
      BorderRadius: 0,
      Theme: '',
      HeightMultiple: 0,
      isModalOpen: false,
      isEdit: false,
      isSlider: false,
      fullColor: true,
      IsDimensions: false,
      SliderView: false,
      EditView: false,
      SliderValue: 0,
      IsFont: false,
      IsContacts: true,
      IsColor: false,
      PositionX: 0,
      PositionY: 0,
      tempDataSource: [],
      SelectedElementsList: [],
      IsLayers: false,
      StyleName: '',
      ButtonName: '',
      switchView: false,
      Dimensions: '',
      tempSelectedElements: [],
      IsMultiple: false,
      FontColor: '',
      FontSize: 0,
      IsBold: false,
      IsItalic: false,
      IsUnderline: false,
      selectedColor: '#f4f6f9',
      ElementId: 0,
      CardId: 0,
      tempDimensions: [],
      isMoving: false,
      oldColor: '#0000',
      movingElementId: undefined,
      isDisabled:false
    };
    global.tempSelectedElements = [];
    global.IsBold = false;
    global.IsItalic = false;
    global.IsUnderline = false;
  }

  componentDidMount() {
    const { userProfile } = this.props;
    const UserId = userProfile.guid;
    const Theme = userProfile.theme;
    setTimeout(() => this.setState({ FontColor: '#fde200' }), 1000);
    this.GetActiveCarddetaillsById(Theme);
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
          this.setState({
            dataSource: responseJson,
            tempDataSource: responseJson,
          });
          this.getMainApp();
        });
    } catch (e) {
      Alert.alert(e);
    }
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
          this.setState({ CardFrontFile: _x.cardfrontfile });
          this.setState({ BorderRadius: _x.borderradius });
          this.setState({ CardBackFile: _x.cardbackfile });
          this.setState({ cardshape: _x.cardshape });

          if (_x.cardshape === 1) {
            //horizantal
            var Width = 494;

            var _windowwidth = Dimensions.get('window').width;

            var Height = 280;

            var _aspectRatio = Height / Width;

            this.setState({ AspectRatio: _aspectRatio });

            var _refHeight = _aspectRatio * _windowwidth;

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
        .catch(error => Alert.alert(error));
    } catch (e) {
      Alert.alert(e);
    }
  }
  UpdateElementDimensions = data => {
    console.log("UpdateElementDimensions called")
    // this.state.tempSelectedElements = [];
    var obj = this.state.tempSelectedElements;
    let requiredIndex = obj.findIndex((item) => {
      return item.id === data.id
    })
    console.log("Data123446", data)
    console.log("requiredIndex", requiredIndex)
    if (requiredIndex > -1) {
      obj.splice(requiredIndex, 1)
      this.setState({
        tempSelectedElements: this.state.tempSelectedElements.length ? this.state.tempSelectedElements.filter(x => x.id !== data.id) : [],
        IsMultiple: false
      }, () => {
        this.selectConsecutiveElement()
      })

    }
    else {
     // obj.push(data);
     obj = [data]
      this.setState({
        ElementId: data.id,
        FontColor: data.fontColor,
        FontSize: data.fontSize,
        PositionX: Math.trunc(data.positionX),
        PositionY: Math.trunc(data.positionY),
        IsBold: data.isBold ? true : false,
        IsItalic: data.isItalic ? true : false,
        IsUnderline: data.isUnderline ? true : false,
        IsMultiple: false,
        tempSelectedElements: obj,
      });
    }
    // obj.push(data);
    console.log("Obj", obj)

    // obj.push(data);
    //  this.setState({tempSelectedElements: obj});
  };

  UpdateElementDimensionsForSelectAll = data => {
    console.log("UpdateElementDimensionsForSelectAll called")
    console.log("DataFromselectConsecutiveElement", data)
    let dimensions = [...this.state.Dimensions, {
      elementId: data.id,
      fontColor: data.fontColor,
      fontSize: data.fontSize,
      positionX: Math.trunc(data.positionX),
      positionY: Math.trunc(data.positionY),
      isBold: data.isBold ? true : false,
      isItalic: data.isItalic ? true : false,
      isUnderline: data.isUnderline ? true : false,
      isMultiple: false,
    }]
    this.state.tempSelectedElements = [];
    var obj = this.state.tempSelectedElements;
    this.setState({
      Dimensions: JSON.stringify(dimensions),
      // PositionX: Math.trunc(FinalLeft),
      // PositionY: Math.trunc(FinalTop),
    });
    // obj.push(data);
    // this.setState({tempSelectedElements: obj});
  };

  // UpdateElementDimensions = data => {
  //   var that = this;
  //   global.tempSelectedElements = data;
  //   that.setState({
  //     IsMultiple: false,
  //     fontSize: data.fontSize,
  //     fontColor: data.fontColor,
  //   });
  //   try {
  //     if (that.state.SelectedElementsList.indexOf(data) < 0) {
  //       that.setState({
  //         SelectedElementsList: _.concat(that.state.SelectedElementsList, data),
  //       });
  //     } else {
  //       that.setState({
  //         SelectedElementsList: _.remove(that.state.SelectedElementsList, data),
  //       });
  //     }
  //   } catch (e) {
  //     Alert.alert(e);
  //   }
  // };

  NewElementDimensions = () => {
    const { userProfile } = this.props;
    var UserId = userProfile.guid;
    console.log("Data",this.state.Dimensions)
    try {
      var dataToSend = {
        UserId: UserId,
        //IsMultiple: this.state.IsMultiple,
        Dimensions: this.state.Dimensions,
        PositionX:this.state.tempSelectedElements.length>0? 0:this.state.PositionX,
        PositionY:  this.state.tempSelectedElements.length>0? 0: this.state.PositionY,
      };
     // console.log("DataToSend", dataToSend)
      var formBody = new FormData();
      for (var key in dataToSend) {
        // var encodedKey = encodeURIComponent(key);
        // var encodedValue = encodeURIComponent(dataToSend[key]);
        // formBody.push(encodedKey + '=' + encodedValue);
        formBody.append(key, dataToSend[key])
      }
      //formBody = formBody.join('&');
       console.log("DataToSend",formBody)
      fetch(global.APIURL + 'api/Card/UpdateElementDimensions', {
        method: 'POST', //Request Type
        body: formBody, //post body
        // headers: {
        //   //Header Defination
        //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        // },
      })
        .then(response => response.text())
        .then(() => {
          this.state.tempSelectedElements = [];
          Actions.businessCard({ userProfile: userProfile });
        });
    } catch (e) {
      Alert.alert(e);
    }
  };
  //Dragable function
  GetPositions(event,gestureState, bounds, eleData, cardName) {
    console.log("cardName" ,cardName)
    try {
      if (!this.state.IsMultiple) {
        // console.log("prev cordinates: (x,y)", "("+eleData.positionX+"," + eleData.positionY + ")")
        // console.log(" event current cordinates: (x,y)", "("+event.locationX+"," + event.locationY + ")")
        // console.log(" event page current cordinates: (x,y)", "("+event.pageX+"," + event.pageY + ")")
        // console.log("moveX  gestureState  current cordinates: (x,y)", "("+gestureState.moveX+"," + gestureState.moveY + ")")
        // console.log("dx  gestureState  current cordinates: (x,y)", "("+gestureState.dx+"," + gestureState.dy + ")")
        // console.log("x0  gestureState  current cordinates: (x,y)", "("+gestureState.x0+"," + gestureState.y0 + ")")
        // console.log("x0  bounds  current cordinates: (x,y)", "("+bounds.left+"," + bounds.top + ")")
      
       if(cardName=== 'BackCard'){
        var FinalLeft = bounds.left / (windowHeight/1200)
        var FinalTop = bounds.top / (windowHeight/580)  
       }
       else if(cardName=== 'Image'){
        var FinalLeft = bounds.left / (windowWidth/260)
        var FinalTop = bounds.top / (windowHeight/580)  
       }
       else{
        var FinalLeft = bounds.left * 2
        //eleData.positionX + event.pageX -  eleData.positionX
        var FinalTop = bounds.top / (windowHeight/550)
        //eleData.positionY + event.locationY + event.pageY;
       }
        console.log("final cordinates: (x,y)", "("+FinalLeft+"," + FinalTop + ")")
        this.setState({
          ElementId: eleData.id,
        });
        var obj = [];
        obj.push({...eleData, positionX:Math.trunc(FinalLeft), positionY:Math.trunc(FinalTop)});
        // if (FinalLeft < windowWidth && FinalTop < windowHeight / 1.18) {
          this.setState({
            Dimensions: JSON.stringify(obj),
            PositionX:Math.trunc(FinalLeft),
            PositionY: Math.trunc(FinalTop),
          });
        //}
        //this.ApplyDimensions('D');
      }
    } catch (e) {
      Alert.alert(e);
    }
  }

  // GetPositions(values, eleData) {
  //   try {
  //     if (!this.state.IsMultiple) {
  //       var FinalLeft = eleData.positionX + values.x;
  //       var FinalTop = eleData.positionY + values.y;
  //       this.setState({
  //         ElementId: eleData.id,
  //       });
  //       var obj = [];
  //       obj.push(eleData);
  //       this.setState({
  //         Dimensions: JSON.stringify(obj),
  //         PositionX: Math.trunc(FinalLeft),
  //         PositionY: Math.trunc(FinalTop),
  //       });
  //       //this.ApplyDimensions('D');
  //     }
  //   } catch (e) {
  //     Alert.alert(e);
  //   }
  // }

  OnDragEnd = () => {
    try {
      this.ApplyDimensions('D');
    } catch (ex) {
      Alert.alert(ex);
    }
  };
  getMainApp() {
    console.log("isDisabled",this.state.isDisabled)
    const { businessCardDetails } = this.props;
    return (
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
          isFlipped={this.state.isFlipped}
          backView={
            <View>
              <FastImage
                style={{
                  // width: windowWidth / 1.03,
                  // height: windowHeight / 1.2,
                  // overflow: "hidden",
                  // borderRadius: 10
                width: windowWidth/1.03,
                height: hp('85%'),
                overflow:"hidden",
                borderRadius:10,
                flexDirection:"column",
                position:"relative",
                }}
                imageStyle={{ borderRadius: this.state.BorderRadius }}
                source={{
                  uri:
                    global.APIURL +
                    'uploadimgs/cards/' +
                    this.state.CardBackFile,
                }}
              >
                {this.state.dataSource.map(y => {
                  if (y.cardelElements.cardArea == 'B') {
                    return (
                      <View>
                        <Draggable
                             onDragRelease={(event, gestureState, bounds) => {
                              console.log("Values",event)
                              console.log("gestureState",gestureState)
                              console.log("bound", bounds)
                              this.GetPositions(event.nativeEvent,gestureState,bounds ,y.cardelElements,'Image')
                              // if (this.state.PositionX > windowWidth || this.state.PositionY > windowHeight / 1.18) {
                              //   this.move.changeDisableStatus()
                              // }
                            }}
                        maxX={windowWidth} maxY={windowHeight / 1.18} minX={0} minY={0}
                         disabled={this.state.isDisabled} 
                         x={ y.cardelElements.positionX * (windowWidth/260)}
                         y={ y.cardelElements.elementTypeName != 'B_Address'?
                         y.cardelElements.positionY 
                         *windowHeight/580
                         :windowHeight/1.25
                        // *(hp('0.22%')-0.45)
                         //*(hp('0.2%')-0.2)
                         //:hp('80%')
                        }  
                            children={<View>{y.cardelElements.elementTypeName ==
                            'B_Profile Picture' ? (
                              <View>
                                <TouchableOpacity
                          onPress={() =>
                            this.UpdateElementDimensions(y.cardelElements)
                          }
                          style={{
                            flexWrap: 'wrap',
                           // position: 'absolute',
                            width:wp(`${y.cardelElements.height*0.30}%`)+2,
                            borderColor: this.state.IsMultiple
                              ? '#029fae'
                              : (this.state.tempSelectedElements.length && this.state.tempSelectedElements.findIndex(x => x && x.id === y.cardelElements.id) > -1)
                                ? '#029fae'
                                : 'white',
                            borderWidth: this.state.IsMultiple
                              ? 1
                              : (this.state.tempSelectedElements.length && this.state.tempSelectedElements.findIndex(x => x && x.id === y.cardelElements.id) > -1)
                                ? 1
                                : 0,
                            height: hp(`${y.cardelElements.height*0.15}%`)+2
                          }}>
                            <Image
                            style={{
                              //position: 'absolute',
                              height:hp(`${y.cardelElements.height*0.15}%`),
                             width:  wp(`${y.cardelElements.height*0.30}%`),
                             
                            }}
                              source={{
                                uri:
                                  global.APIURL +
                                  'uploadimgs/ProfilePictures/' +
                                  y.cardelElements.cardelementtext,
                              }}
                            />
                            </TouchableOpacity>
                          </View>
                          ) : null}
                          </View>}/>
                          <Draggable
                          onDragRelease={(event, gestureState, bounds) => {
                            console.log("Values",event)
                            console.log("gestureState",gestureState)
                            console.log("bound", bounds)
                            this.GetPositions(event.nativeEvent,gestureState,bounds ,y.cardelElements,'BackCard')
                            // if (this.state.PositionX > windowWidth || this.state.PositionY > windowHeight / 1.18) {
                            //   this.move.changeDisableStatus()
                            // }
                          }}
                          maxX={windowWidth*wp("0.92%")} maxY={windowHeight / 1.18} minX={0} minY={0}
                           disabled={this.state.isDisabled}
                                 x={ y.cardelElements.elementTypeName != 'B_Address'?
                                 y.cardelElements.positionX * (windowHeight/1200) :
                                 (y.cardelElements.positionX * (windowHeight/10))}
                                 y={ y.cardelElements.elementTypeName != 'B_Address'?
                                 y.cardelElements.positionY 
                                 *windowHeight/580
                                 :windowHeight/1.25
                                // *(hp('0.22%')-0.45)
                                 //*(hp('0.2%')-0.2)
                                 //:hp('80%')
                                } 
                                children={<View style={{flexDirection:"row",justifyContent:"center", alignItems:"center"}}><View>
                            {y.cardiconsLookup != null &&
                            y.cardelElements.isShow == true &&
                            y.cardelElements.cardelementtext != '' &&
                            y.cardelElements.cardelementtext != 'null' &&
                            y.cardelElements.cardelementtext != null ? (
                            <Image
                            style={{
                             // position: 'absolute',
                              height: parseFloat(this.state.HeightMultiple * 20),
                              width: parseFloat(this.state.HeightMultiple * 20),
                             
                            }}
                              source={{
                                uri:
                                  global.APIURL +
                                  'uploadimgs/icons/' +
                                  y.cardiconsLookup.iconfile,
                              }}
                            />
                          ) : null}
                          </View>
                          {y.cardelElements.elementTypeName !==
                            'B_Profile Picture' ? (
                        <View style={{marginTop:hp('1%'), marginLeft:wp('2%')}}>
                          <TouchableOpacity
                            onPress={() =>
                              this.UpdateElementDimensions(y.cardelElements)
                            }
                            style={{
                              flexWrap: 'wrap',
                             // position: 'absolute',
                              width:windowWidth-hp("5%"),
                              borderColor: this.state.IsMultiple
                                ? '#029fae'
                                : (this.state.tempSelectedElements.length && this.state.tempSelectedElements.findIndex(x => x && x.id === y.cardelElements.id) > -1)
                                  ? '#029fae'
                                  : 'white',
                              borderWidth: this.state.IsMultiple
                                ? 1
                                : (this.state.tempSelectedElements.length && this.state.tempSelectedElements.findIndex(x => x && x.id === y.cardelElements.id) > -1)
                                  ? 1
                                  : 0,
                              height: parseInt(
                                ((this.state.IHeight - 20) /
                                  (this.state.cardshape == 1 ? 280 : 494)) *
                                y.cardelElements.height,
                              )
                            }}>
                            <Text
                                  style={{
                                    flexWrap: 'wrap',
                                    // position: 'absolute',
                                     width:windowWidth-hp("5%"),
                                    // height:
                                    //   ((this.state.IHeight - 20) /
                                    //     (this.state.cardshape == 1 ? 280 : 494)) *
                                    //   y.cardelElements.height,
                                    fontSize: y.cardelElements.fontSize,
                                    color: y.cardelElements.fontColor,
                                    fontWeight: y.cardelElements.isBold
                                      ? 'bold'
                                      : '',
                                    fontStyle: y.cardelElements.isItalic
                                      ? 'italic'
                                      : '',
                                    textDecorationLine: y.cardelElements.isUnderline
                                      ? 'underline'
                                      : '',
                                  }}
                                  numberOfLines={3}>
                                  {y.cardelElements.isShow == true
                                    ? y.cardelElements.cardelementtext != '' &&
                                      y.cardelElements.cardelementtext != null &&
                                      y.cardelElements.cardelementtext != 'null'&&
                                      y.cardelElements.elementTypeName != 'B_Address' &&
                                      y.cardelElements.elementTypeName !='B_Profile Picture'
                                      ? y.cardelElements.cardelementtext.trim()
                                      :y.cardelElements.cardelementtext != '' &&
                                      y.cardelElements.cardelementtext != null &&
                                      y.cardelElements.cardelementtext != 'null' &&
                                      y.cardelElements.elementTypeName == 'B_Address'
                                      ? y.cardelElements.cardelementtext.split("////")[0]
                                      : ''
                                    : null}
                                </Text>
                                </TouchableOpacity>
                          </View>):null}
                        </View>}/>
                      </View>
                    );
                  }
                })}
              </FastImage>
              {this.state.CardShape == 2 ? (
                <View>{this.renderEditOptionsVerticalCards()}</View>
              ) : null}
            </View>
          }
          frontView={
            <View
              style={{
                width: windowWidth / 1.03,
               // height: windowHeight / 1.2,
               height: hp('85%'),
                overflow: "hidden",
                borderRadius: 10,
                flexDirection: 'row',
              }}>
              <FastImage
                style={{  width: windowWidth/1.03,
                  height: hp('85%'),
                  overflow:"hidden",
                  borderRadius:10,
                 // flex:1,
                  flexDirection:"column",
                  position:"relative",
                 // borderWidth:2, 
                }}
               // imageStyle={{ borderRadius: this.state.BorderRadius }}
                source={{
                  uri:
                    global.APIURL +
                    'uploadimgs/cards/' +
                    this.state.CardFrontFile,
                }}
              >
                {this.state.dataSource.map(y => {
                  if (y.cardelElements.cardArea == 'F') {
                    return (
                      <View>
                      <Draggable
                       onDragRelease={(event, gestureState, bounds) => {
                        console.log("Values",event)
                        console.log("gestureState",gestureState)
                        console.log("bound", bounds)
                        this.GetPositions(event.nativeEvent,gestureState,bounds ,y.cardelElements,'Image')
                        // if (this.state.PositionX > windowWidth || this.state.PositionY > windowHeight / 1.18) {
                        //   this.move.changeDisableStatus()
                        // }
                      }}
                      maxX={windowWidth} maxY={windowHeight / 1.18} minX={0} minY={0}
                      disabled={this.state.isDisabled} 
                      x={ y.cardelElements.positionX * (windowWidth/260)}
                      y={ y.cardelElements.elementTypeName != 'F_Company Address'?
                      y.cardelElements.positionY 
                      *windowHeight/580
                      :windowHeight/1.25
                     // *(hp('0.22%')-0.45)
                      //*(hp('0.2%')-0.2)
                      //:hp('80%')
                     } 
                              children={<View>{y.cardelElements.elementTypeName == 'F_Logo'  ? (
                                <View>
                                     <TouchableOpacity
                          onPress={() =>
                            this.UpdateElementDimensions(y.cardelElements)
                          }
                          style={{
                            flexWrap: 'wrap',
                           // position: 'absolute',
                            width:wp(`${y.cardelElements.height*0.30}%`)+2,
                            borderColor: this.state.IsMultiple
                              ? '#029fae'
                              : (this.state.tempSelectedElements.length && this.state.tempSelectedElements.findIndex(x => x && x.id === y.cardelElements.id) > -1)
                                ? '#029fae'
                                : 'white',
                            borderWidth: this.state.IsMultiple
                              ? 1
                              : (this.state.tempSelectedElements.length && this.state.tempSelectedElements.findIndex(x => x && x.id === y.cardelElements.id) > -1)
                                ? 1
                                : 0,
                            height: hp(`${y.cardelElements.height*0.15}%`)+2
                          }}>
                          <Image
                          style={{
                            //position: 'absolute',
                            height:hp(`${y.cardelElements.height*0.15}%`),
                            width:  wp(`${y.cardelElements.height*0.30}%`),
                           
                          }}
                          source={{
                            uri:
                              global.APIURL +
                              'uploadimgs/BusinessProfilePictures/' +
                              y.cardelElements.cardelementtext,
                          }}
                          />
                          </TouchableOpacity>
                          </View>
                        ) : null}</View>}/>
                        <Draggable
                        onDragRelease={(event, gestureState, bounds) => {
                          console.log("Values",event)
                          console.log("gestureState",gestureState)
                          console.log("bound", bounds)
                          this.GetPositions(event.nativeEvent,gestureState,bounds ,y.cardelElements)
                          // if (this.state.PositionX > windowWidth || this.state.PositionY > windowHeight / 1.18) {
                          //   this.move.changeDisableStatus()
                          // }
                        }}
                        maxX={windowWidth*hp("0.25%")} maxY={windowHeight / 1.18} minX={0} minY={0}
                         disabled={this.state.isDisabled} 
                         x={ y.cardelElements.elementTypeName != 'F_Extension'? 
                         y.cardelElements.elementTypeName == 'F_Company Address'?
                         (y.cardelElements.positionX * (windowHeight/10)) :
                          y.cardelElements.positionX * 0.5 
                          :   y.cardelElements.positionX
                          // *1.03
                           }
                              y={ y.cardelElements.elementTypeName != 'F_Company Address'?
                              y.cardelElements.positionY * windowHeight/550
                              :windowHeight/1.25
                             // *(hp('0.22%')-0.45)
                             // :hp('80%')
                              } children={<View style={{flexDirection:"row",justifyContent:"center", alignItems:"center"}}><View>
                          {y.cardiconsLookup != null &&
                          y.cardelElements.isShow == true &&
                          y.cardelElements.cardelementtext != '' &&
                          y.cardelElements.cardelementtext != 'null' &&
                          y.cardelElements.cardelementtext != null ? (
                          <Image
                          style={{
                           // position: 'absolute',
                            height: parseFloat(this.state.HeightMultiple * 20),
                            width: parseFloat(this.state.HeightMultiple * 20),
                            
                           
                          }}
                            source={{
                              uri:
                                global.APIURL +
                                'uploadimgs/icons/' +
                                y.cardiconsLookup.iconfile,
                            }}
                          />
                        ) : null}
                        </View>
                        {y.cardelElements.elementTypeName !==
                            'F_Logo' ? (
                        <View style={{marginTop:hp('1%'), marginLeft:wp('2%')}}>
                       
                        <TouchableOpacity
                          onPress={() =>
                            this.UpdateElementDimensions(y.cardelElements)
                          }
                          style={{
                            flexWrap: 'wrap',
                           // position: 'absolute',
                            width:windowWidth-hp("5%"),
                            borderColor: this.state.IsMultiple
                              ? '#029fae'
                              : (this.state.tempSelectedElements.length && this.state.tempSelectedElements.findIndex(x => x && x.id === y.cardelElements.id) > -1)
                                ? '#029fae'
                                : 'white',
                            borderWidth: this.state.IsMultiple
                              ? 1
                              : (this.state.tempSelectedElements.length && this.state.tempSelectedElements.findIndex(x => x && x.id === y.cardelElements.id) > -1)
                                ? 1
                                : 0,
                            height: parseInt(
                              ((this.state.IHeight - 20) /
                                (this.state.cardshape == 1 ? 280 : 494)) *
                              y.cardelElements.height,
                            )
                          }}>
                          <Text
                                style={{
                                  flexWrap: 'wrap',
                                   position: 'absolute',
                                   width:windowWidth-hp("5%"),
                                  fontSize: y.cardelElements.fontSize,
                                  color: y.cardelElements.fontColor,
                                  fontWeight: y.cardelElements.isBold
                                    ? 'bold'
                                    : '',
                                  fontStyle: y.cardelElements.isItalic
                                    ? 'italic'
                                    : '',
                                  textDecorationLine: y.cardelElements.isUnderline
                                    ? 'underline'
                                    : '',
                                  textAlign:y.cardelElements.elementTypeName != 'F_Tag Line'?
                                  y.cardelElements.elementTypeName != "F_Company Name" ?
                                   null : 'center' :'center' 
                                }}
                               
                                numberOfLines={3}>
                            {y.cardelElements.isShow == true
                              ? y.cardelElements.cardelementtext != '' &&
                                y.cardelElements.cardelementtext != null &&
                                y.cardelElements.cardelementtext != 'null'&&
                                y.cardelElements.elementTypeName != 'F_Logo'&&
                                y.cardelElements.elementTypeName != 'F_Company Address' &&
                                y.cardelElements.elementTypeName != 'F_Extension'?
                                 y.cardelElements.cardelementtext : 
                                 y.cardelElements.cardelementtext != '' &&
                                 y.cardelElements.cardelementtext != null &&
                                 y.cardelElements.cardelementtext != 'null'&&
                                 y.cardelElements.elementTypeName != 'F_Logo'&&
                                 y.cardelElements.elementTypeName != 'F_Company Address' &&
                                 y.cardelElements.elementTypeName == 'F_Extension'?
                                 'Ext: '+ y.cardelElements.cardelementtext :
                                 y.cardelElements.cardelementtext != '' &&
                                 y.cardelElements.cardelementtext != null &&
                                 y.cardelElements.cardelementtext != 'null'&&
                                 y.cardelElements.elementTypeName != 'F_Logo'&&
                                 y.cardelElements.elementTypeName == 'F_Company Address' &&
                                 y.cardelElements.elementTypeName != 'F_Extension'?
                                 y.cardelElements.cardelementtext.split("////")[0]
                                    : ''
                                  : null}
                              </Text>
                              </TouchableOpacity>
                             
                        </View>
                           ):null }
                      </View>}/>
                      </View>
                    
                    );
                  } else {
                    return <View />;
                  }
                })}
              </FastImage>
              {this.state.CardShape == 2 ? (
                <View>{this.renderEditOptionsVerticalCards()}</View>
              ) : null}
            </View>
          }
        />
      </View>
    );
  }
  OnsliderChange(ChangedValue) {
    try {
      this.setState({ FontSize: ChangedValue });
      this.ApplyDimensions('F');
    } catch (e) {
      Alert.alert(e);
    }
  }
  // changeColor = (color) => {
  //   this.setState({FontColor: color});
  //   this.ApplyDimensions('C');
  // };
  changeColor = colorHsv => {
    let colorCode = tinycolor(colorHsv).toHexString();
    let existingFontcolor = this.state.FontColor
     this.setState({ oldColor:colorCode,  FontColor: colorCode });
     this.ApplyDimensions('C', colorCode);
    // this.setState((prevState, props) => ({ oldColor: prevState.FontColor, FontColor: colorCode }), () => {
    //   this.ApplyDimensions('C', colorCode);
    // });



  }
  setUpdatedValue = (fieldName, value) => {
    var obj = this.state.tempSelectedElements;
    obj.forEach(x=>{
      x[fieldName] = value
    })
  }
  ApplyDimensions(isCallFun, colorCode) {
    console.log("colorChoosen", isCallFun + "    " + colorCode)
    try {
      let _x = this.state.dataSource;
      var obj = this.state.tempSelectedElements;
      if (this.state.tempSelectedElements.length > 0 && this.state.ElementId && this.state.tempSelectedElements.findIndex(x => x.id == this.state.ElementId) > -1) {
        console.log("ifBlock", this.state.ElementId)
        switch (isCallFun) {
          case 'I':
            //obj.isItalic = global.IsItalic;
            this.setUpdatedValue("isItalic",global.IsItalic)
            break;
          case 'B':
            //obj.isBold = global.IsBold;
            this.setUpdatedValue("isBold",global.IsBold)
            break;
          case 'U':
           // obj.isUnderline = global.IsUnderline;
           this.setUpdatedValue("isUnderline",global.IsUnderline)
            break;
          case 'C':
            //obj.fontColor = colorCode;
            this.setUpdatedValue("fontColor",colorCode)
            break;
          case 'F':
           // obj.fontSize = this.state.FontSize;
           this.setUpdatedValue("fontSize",this.state.FontSize)
            break;
        }
        
        this.setState({
          Dimensions: JSON.stringify(obj),
          tempSelectedElements: obj,
        });
        console.log("BlockColor", obj)
        var ElementId = this.state.ElementId;
        for (let index = 0; index < _x.length; index++) {
          if (_x[index].cardelElements.id == ElementId) {
            _x[index].cardelElements.fontSize = this.state.FontSize;
            _x[index].cardelElements.fontColor = colorCode !== undefined ? colorCode : this.state.FontColor;
            _x[index].cardelElements.isBold = global.IsBold;
            _x[index].cardelElements.isItalic = global.IsItalic;
            _x[index].cardelElements.isUnderline = global.IsUnderline;
            _x[index].cardelElements.positionY = this.state.PositionY;
            _x[index].cardelElements.positionX = this.state.PositionX;
            break;
          }
        }
        this.state.dataSource = _x;
      } else {
        console.log("elseBlock", obj)
        switch (isCallFun) {
          case 'I':
            for (let index = 0; index < obj.length; index++) {
              obj[index].isItalic = global.IsItalic;
            }
            break;
          case 'B':
            for (let index = 0; index < obj.length; index++) {
              obj[index].isBold = global.IsBold;
            }
            break;
          case 'U':
            for (let index = 0; index < obj.length; index++) {
              obj[index].isUnderline = global.IsUnderline;
            }
            break;
          case 'C':
            for (let index = 0; index < obj.length; index++) {
              obj[index].fontColor = colorCode;
            }
            break;
          case 'F':
            for (let index = 0; index < obj.length; index++) {
              obj[index].fontSize = this.state.FontSize;
            }
            break;
        }
        this.setState({
          Dimensions: JSON.stringify(obj),
          tempSelectedElements: obj,
        });
      }
      //this.getMainApp();
      //this.props.clearBusinessCardDetails();
      //this.props.setBusinessCardDetails(_x);
    } catch (e) {
      Alert.alert(e);
    }
  }
  _handleHeaderRightIconPress = () => {
    this._handleResetAllDimensions();
  };
  _handleHeaderRightIcon = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'column',
            height: 38,
            width: 38,
            borderRadius: 80,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            backgroundColor: '#ffffff',
          }}>
          <Undo style={{ color: '#27BECF', fontSize: 20 }} />
        </View>
        <Text
          style={{
            color: '#ffffff',
            fontSize: 10,
            textAlign: 'center',
          }}>
          Reset
        </Text>
      </View>
    );
  };
  _handleResetAllDimensions = () => {
    // const {userProfile} = this.props;
    // const Theme = userProfile.theme;
    // try {
    //   const {userProfile} = this.props;
    //   const Theme = userProfile.theme;
    //   var obj = this.state.tempDataSource;
    //   //this.props.clearBusinessCardDetails();
    //   //this.props.setBusinessCardDetails(obj);
    //   this.setState({
    //     dataSource: obj,
    //     SliderView: false,
    //     IsLayers: false,
    //   });
    //   Actions.businessCard({userProfile: userProfile});
    // } catch (e) {
    //   Alert.alert(e);
    // }
    // try {
    //   var dataToSend = {
    //     Theme: Theme,
    //     UserId: userProfile.guid,
    //   };
    //   var formBody = [];
    //   for (var key in dataToSend) {
    //     var encodedKey = encodeURIComponent(key);
    //     var encodedValue = encodeURIComponent(dataToSend[key]);
    //     formBody.push(encodedKey + '=' + encodedValue);
    //   }
    //   formBody = formBody.join('&');
    //   fetch(global.APIURL + 'api/Card/UpdateCardThemeforUser', {
    //     method: 'POST', //Request Type
    //     body: formBody, //post body
    //     headers: {
    //       //Header Defination
    //       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    //     },
    //   })
    //     .then(response => response.json())
    //     .then(responseJson => {
    //       var obj = responseJson;
    //       this.props.clearUserProfile();
    //       this.props.setUserProfile(obj);
    //       Actions.businessCard({userProfile: obj});
    //     });
    // } catch (e) {
    //   Alert.alert(e.message);
    // }

    //this.getMainApp();
    const { userProfile } = this.props;
    const UserId = userProfile.guid;
    const Theme = userProfile.theme;
    setTimeout(() => this.setState({ FontColor: '#fde200' }), 1000);
    this.GetActiveCarddetaillsById(Theme);
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
          this.setState({
            dataSource: responseJson,
            tempDataSource: responseJson,
            tempSelectedElements: [],
            SelectedElementsList: [],
            ElementId: 0,
            FontColor: '',
            FontSize: 0,
            PositionX: 0,
            PositionY: 0,
            IsBold: false,
            IsItalic: false,
            IsUnderline: false,
            IsMultiple: false,
            SliderView: false,
            IsColor: false
          });
          this.getMainApp();
          global.IsBold = false;
          global.IsItalic = false;
          global.IsUnderline = false;
        });
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleHeaderLeftIconPress = () => {
    const { handleGoBack } = this.props;
    handleGoBack();
  };
  _handleHeaderText = () => {
    return null;
  };
  _handleHeaderLeftIcon = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
          height: 38,
          width: 38,
          borderRadius: 80,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: '#ffffff',
        }}>
        <ArrowLeft style={{ color: CommonStyles.appColor, fontSize: 20 }} />
      </View>
    );
  };
  _handleHeaderCenterIcon = () => {
    return (
      <View style={{ top: 5 }}>
        <BoldText style={{ color: '#ffffff', textAlign: 'center', fontSize: 14 }}>
          Edit Business Card
        </BoldText>
      </View>
    );
  };
  boldPress = () => {
    if (global.IsBold) {
      global.IsBold = false;
    } else {
      global.IsBold = true;
    }
    console.log("Bold Pressed")
    this.ApplyDimensions('B');
  };
  italicPress = () => {
    if (global.IsItalic) {
      global.IsItalic = false;
    } else {
      global.IsItalic = true;
    }
    console.log("Italic Pressed")
    this.ApplyDimensions('I');
  };
  underlinePress = () => {
    if (global.IsUnderline === true) {
      global.IsUnderline = false;
    } else {
      global.IsUnderline = true;
    }
    console.log("Underline Pressed")
    this.ApplyDimensions('U');
  };
  textSizePress = () => {
    this.setState(prevState => ({ SliderView: !prevState.SliderView }));
  };
  colorPress = () => {
    this.setState(prevState => ({ IsColor: !prevState.IsColor }));
  };
  saveAllPress = () => {
    try {
      this.NewElementDimensions();
    } catch (e) {
      Alert.alert(e);
    }
  };
  // selectAllElement = () => {
  //   try {
  //     var that = this;
  //     this.setState({SelectedElementsList: []});
  //     var elementsList = [];
  //     var obj = [];
  //     this.props.businessCardDetails.map(data => {
  //       if (that.state.isFlipped) {
  //         if (data.cardelElements.cardArea === 'B') {
  //           elementsList = _.concat(elementsList, data.cardelElements);
  //           obj.push(data.cardelElements);
  //         }
  //       } else {
  //         if (data.cardelElements.cardArea === 'F') {
  //           elementsList = _.concat(elementsList, data.cardelElements);
  //           obj.push(data.cardelElements);
  //         }
  //       }
  //       that.setState({tempSelectedElements: obj, IsMultiple: true});
  //     });
  //     that.setState({
  //       SelectedElementsList: elementsList,
  //     });
  //   } catch (e) {
  //     Alert.alert(e);
  //   }
  // };
  // leftAlignPress = () => {
  //   try {
  //     let min = 0;
  //     this.state.SelectedElementsList.forEach(item => {
  //       //  min = item.positionX;
  //       if (min > item.positionX) {
  //         min = item.positionX;
  //       }
  //     });
  //     this.state.SelectedElementsList.forEach(item => {
  //       item.positionX = min;
  //     });
  //     this.setState({SelectedElementsList: this.state.SelectedElementsList});
  //   } catch (e) {
  //     Alert.alert(e);
  //   }
  // };

  // rightAlignPress = () => {
  //   try {
  //     let min = 0;
  //     this.state.SelectedElementsList.forEach(item => {
  //       //  min = item.positionX;
  //       if (min < item.positionX) {
  //         min = item.positionX;
  //       }
  //     });
  //     this.state.SelectedElementsList.forEach(item => {
  //       item.positionX = min;
  //     });
  //     this.setState({SelectedElementsList: this.state.SelectedElementsList});
  //   } catch (e) {
  //     Alert.alert(e);
  //   }
  // };
  selectConsecutiveElement = () => {
    var that = this;
    that.setState({ IsMultiple: false });
    if (that.state.isFlipped) {
      var obj = that.state.tempSelectedElements;
      console.log("lengthofobject", obj.length)
      var _tempBack = [];
      for (let index = 0; index < obj.length; index++) {
        console.log("objectOfIndex", obj[index])
        this.UpdateElementDimensionsForSelectAll(obj[index])
        if (obj[index].cardArea == 'B') {
          _tempBack.push(obj[index]);
        }
      }
      that.setState({ tempSelectedElements: _tempBack });
    } else {
      var obj = that.state.tempSelectedElements;
      var _tempFront = [];
      for (let index = 0; index < obj.length; index++) {
        this.UpdateElementDimensionsForSelectAll(obj[index])
        if (obj[index].cardArea == 'F') {
          _tempFront.push(obj[index]);
        }
      }
      that.setState({ tempSelectedElements: _tempFront });
    }
  }
  selectAllElement = () => {
    var that = this;
    if (that.state.IsMultiple) {
      that.setState({ IsMultiple: false, tempSelectedElements: [], ElementId: "" });
    } else {
      that.setState({ IsMultiple: true, ElementId: "" });
      if (that.state.isFlipped) {
        var obj = that.state.dataSource;
        var _tempBack = [];
        for (let index = 0; index < obj.length; index++) {
          this.UpdateElementDimensionsForSelectAll(obj[index].cardelElements)
          if (obj[index].cardelElements.cardArea == 'B') {
            _tempBack.push(obj[index].cardelElements);
          }
        }
        that.setState({ tempSelectedElements: _tempBack });
      } else {
        var obj = that.state.dataSource;
        var _tempFront = [];
        for (let index = 0; index < obj.length; index++) {
          this.UpdateElementDimensionsForSelectAll(obj[index].cardelElements)
          if (obj[index].cardelElements.cardArea == 'F') {
            _tempFront.push(obj[index].cardelElements);
          }
        }
        that.setState({ tempSelectedElements: _tempFront });
      }
    }
  };
  styleTabs = () => {
    if (this.state.tempSelectedElements.length > 0 || this.state.ElementId > 0) {
      return (
        <Draggable maxX={windowWidth} maxY={windowHeight / 1.18} minX={0} minY={0}>
          <View
            style={{
              // position: 'absolute',
              backgroundColor: '#ffff',
              borderColor: '#bdbdbd',
              borderWidth: 0.5,
              borderRadius: 30,
              // height: 330,
              //  width: 48,
              justifyContent: 'space-between',
              paddingHorizontal: 5,
              paddingVertical: 5,
              marginVertical: 5
            }}>
            <View
              style={[
                styles.leftHeader,
                {
                  backgroundColor: global.IsBold
                    ? CommonStyles.appColor
                    : '#ffffff',
                  marginTop: 6,
                },
              ]}>
              <TouchableOpacity onPress={() => this.boldPress()}>
                <Bold
                  style={{
                    color: global.IsBold ? '#ffffff' : '#000',
                    fontSize: 18,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.leftHeader,
                {
                  backgroundColor: global.IsItalic
                    ? CommonStyles.appColor
                    : '#ffffff',
                },
              ]}>
              <TouchableOpacity onPress={() => this.italicPress()}>
                <Italic
                  style={{
                    color: global.IsItalic ? '#ffffff' : '#000',
                    fontSize: 20,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.leftHeader,
                {
                  borderColor: '#e0e0e0',
                  backgroundColor: global.IsUnderline
                    ? CommonStyles.appColor
                    : '#ffffff',
                },
              ]}>
              <TouchableOpacity onPress={() => this.underlinePress()}>
                <Underline
                  style={{
                    color: global.IsUnderline ? '#ffffff' : '#000',
                    fontSize: 20,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.leftHeader,
                {
                  borderColor: '#e0e0e0',
                  backgroundColor: this.state.SliderView
                    ? CommonStyles.appColor
                    : '#ffffff',
                },
              ]}>
              <TouchableOpacity onPress={() => this.textSizePress()}>
                <View style={{ flexDirection: 'row' }}>
                  <Downarrow
                    style={{
                      color: this.state.SliderView ? '#ffffff' : '#000',
                      fontSize: 15,
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.leftHeader}>
              <TouchableOpacity onPress={() => this.colorPress()}>
                <Image
                  style={{ width: 30, height: 30, color: CommonStyles.appColor }}
                  source={images.colorIcon}
                />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.leftHeader,
                {
                  borderColor: '#e0e0e0',
                  backgroundColor: this.state.Save
                    ? CommonStyles.appColor
                    : '#ffffff',
                  // bottom:5
                },
              ]}>
              <TouchableOpacity onPress={() => this.saveAllPress()}>
                <Save
                  style={{
                    color: this.state.Save ? '#ffffff' : '#000',
                    fontSize: 20,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.leftHeader,
                {
                  borderColor: '#e0e0e0',
                  backgroundColor: this.state.Selectall
                    ? CommonStyles.appColor
                    : '#ffffff',
                  marginBottom: 6,
                },
              ]}>
              <TouchableOpacity onPress={() => this.selectAllElement()}>
                <Selectall
                  style={{
                    color: this.state.Selectall ? '#ffffff' : '#000',
                    fontSize: 20,
                  }}
                />
              </TouchableOpacity>
            </View>
            {/* <View
            style={[
              styles.leftHeader,
              {
                borderColor: '#e0e0e0',
                backgroundColor: this.state.LeftAlign
                  ? CommonStyles.appColor
                  : '#ffffff',
                marginBottom: 5,
              },
            ]}>
            <TouchableOpacity onPress={() => this.leftAlignPress()}>
              <LeftAlign
                style={{
                  color: this.state.LeftAlign ? '#ffffff' : '#000',
                  fontSize: 20,
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.leftHeader,
              {
                borderColor: '#e0e0e0',
                backgroundColor: this.state.RightAlign
                  ? CommonStyles.appColor
                  : '#ffffff',
                marginBottom: 5,
              },
            ]}>
            <TouchableOpacity onPress={() => this.rightAlignPress()}>
              <RightAlign
                style={{
                  color: this.state.RightAlign ? '#ffffff' : '#000',
                  fontSize: 20,
                }}
              />
            </TouchableOpacity>
          </View> */}
          </View>
        </Draggable>
      );
    } else {
      return null;
    }
  };


  _handleHeaderProfileIcon = () => {
    const { userProfile } = this.props;
    return (
      <View >
        {/* <CustomMenuIcon
          menutext="Menu"
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
            Actions.qrCode({userProfile: userProfile});
          }}
          option4Click={() => {
            Actions.referAfriend({
              userProfile: userProfile,
            });
          }}
          option5Click={() => {
            Actions.rateUs({userProfile: userProfile});
          }}
          option6Click={() => {
            Actions.settings({
              UserId: userProfile.guid,
              IsShow: userProfile.sharecard,
              UserProfile: userProfile,
            });
          }}
          option7Click={() => {
            Actions.helpCenter({userProfile: userProfile});
          }}
          option8Click={() => {
            Actions.premierMembership({userProfile: userProfile});
          }}
          // option5Click={() => {
          //   this._handleClearLocalDB();
          // }}
          userProfile={userProfile}
          IsProfile={false}
          iconColor={'#ffffff'}
        /> */}
      </View>
    );
  };
  render() {
    console.log("Render Called")
    return (
      <View style={{ flex: 1, backgroundColor: '#ededed' }}>
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
        <View style={{ flex: 1, margin: "1%" }}>
          <View style={{ flex: 2, flexDirection: 'row', alignSelf: 'center' }}>
            {this.getMainApp()}
            <View
              style={{
                position: 'absolute',
                left: 5,
                top: 25,
                borderColor: '#e0e0e0',
                height: 35,
                width: 35,
                borderRadius: 60,
                // borderWidth:1,
              }}>
              <LinearGradient
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={['transparent', '#ffffff']}
                style={{ height: 35, width: 35, borderRadius: 60 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      isFlipped: !this.state.isFlipped,
                      SliderView: false,
                      ShowBottomStyles: false,
                      IsLayers: false,
                    });
                  }}>
                  <Flip
                    style={{
                      color: this.state.Flip ? '#ffffff' : '#000',
                      fontSize: 32,
                      // marginLeft: 5,
                    }}
                  />
                </TouchableOpacity>
              </LinearGradient>
            </View>
            <View style={{ position: "absolute" }}>{this.styleTabs()}</View>
            {this.state.IsColor
              && (
                <Draggable  maxX={windowWidth} maxY={windowHeight / 1.18} minX={0} minY={0}>
                  <View
                    style={{
                      //  position: 'absolute',
                      backgroundColor: '#fff',
                      borderColor: '#fff',
                      borderWidth: 0.5,
                      borderRadius: 15,
                      height: 240,
                      width: 160,
                      justifyContent: 'center',
                      paddingHorizontal:5,
                      paddingVertical: 5,
                      alignItems: 'center'
                    }}>
                    {/* <ColorPicker
                  ref={view => {
                    this.colorPicker = view;
                  }}
                  oldColor={this.state.oldColor}
                  onColorChange={this.changeColor}
                  style={{width: 150, height: 150}}
                /> */}
                    {/* <ColorPanel
                  style={{width: windowWidth, height: windowHeight/2}}
                  fullColor={true}
                  color={this.state.oldColor}
                  brightnessLowerLimit={0}
                  onColorChange={this.changeColor}
                 // onColorChange={color => {this.changeColor(color)}}
                /> */}
                    <ColorPicker
                    ref={view => {this.colorPicker = view;}}
                    oldColor={this.state.FontColor}
                    onColorChange={this.changeColor}
                    textSaturation={' '}
                    diamond={false}
                    staticPalette={true}
                    />
                    {/* <ColorPicker
                   
                     // onColorSelected={this.changeColor}
                     onOldColorSelected={ (color)=>this.setState({oldColor:color})}
                     color={this.state.FontColor}
                     onColorChange={ (color)=>this.changeColor(color)}
                      oldColor={this.state.oldColor}
                      onColorSelected={(color)=>this.changeColor(color)}
                      style={{ height: 200, width: 150, position: "relative" }}
                    /> */}
                  </View>
                </Draggable>
              )}
            {this.state.SliderView && (
              <Draggable maxX={windowWidth} maxY={windowHeight / 1.18} minX={0} minY={0}>
                <View
                  style={{
                    //  position: 'absolute',
                    backgroundColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 0.5,
                    borderRadius: 15,
                    // height: 330,
                    //  width: 48,
                    justifyContent: 'center',
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    alignItems: 'center',
                    //  flex:1
                  }}>
                  <Slider
                    step={1}
                    minimumValue={0}
                    maximumValue={30}
                    minimumTrackTintColor="#009688"
                    onValueChange={ChangedValue =>
                      this.OnsliderChange(ChangedValue)
                    }
                    style={styles.sliderstyle}
                    value={this.state.FontSize}
                  />
                </View>
              </Draggable>
            )}
          </View>
          {/* {this.state.SliderView ? (
              <View style={styles.SliderViewstyle}>
                <Slider
                  step={1}
                  minimumValue={0}
                  maximumValue={30}
                  minimumTrackTintColor="#009688"
                  onValueChange={ChangedValue =>
                    this.OnsliderChange(ChangedValue)
                  }
                  style={styles.sliderstyle}
                  value={this.state.FontSize}
                />
              </View>
            ) : null} */}
          {/* {this.state.IsColor ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  backgroundColor: '#f4f6f9',
                }}>
                <ColorPicker
                  ref={view => {
                    this.colorPicker = view;
                  }}
                  oldColor={this.state.oldColor}
                  onColorChange={this.changeColor}
                  style={{width: 150, height: 150}}
                />
                <ColorPanel
                  style={{width: windowWidth, height: windowHeight/2}}
                  fullColor={true}
                  color={this.state.oldColor}
                  brightnessLowerLimit={0}
                  onColorChange={this.changeColor}
                 // onColorChange={color => {this.changeColor(color)}}
                />
                 <Text>Recent Color:{this.state.FontColor}</Text> 
                <View style={{position:"absolute"}}>{this.colorTabs()}</View>
              </View>
            ) : null} */}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return { businessCardDetails: state.BusinessCards.businessCardDetails };
};
const mapDispatchToProps = {
  handleGoBack: goBack,
  clearBusinessCardDetails,
  setBusinessCardDetails,
  setUserProfile,
  clearUserProfile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);