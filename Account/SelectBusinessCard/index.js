import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  TouchableHighlight,
} from 'react-native';
import {MediumBoldText} from '../../shared/Text';
import Carousel from 'react-native-snap-carousel';
import {Actions} from 'react-native-router-flux';
import {setUserProfile} from '../../state/operations';
import {connect} from 'react-redux';
import ServiceCalls from '../../Services/APICalls';
import FinishButton from '../../shared/Button';
import TopBackground from '../TopBackground';
import BottomBackground from '../BottomBackground';
import Dialog, {DialogContent, ScaleAnimation} from 'react-native-popup-dialog';

const height = Dimensions.get('window').height;
    const width = Dimensions.get('window').width;

class PersonalDetailsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      BusinessCard: '',
      GeneralCards: [],
      Lat: '',
      Long: '',
      TimeZone: '',
      //isOpen: false,
      FrontORBackimg: '',
      cardFront: false,
      modalVisible: false,
      CArdShape: '',
      MDImgCardHeight: '',
      MDImgCardWidth: '',
      ModalWidth: 1,
    };
  }
  componentDidMount = () => {
    this.getLocationDetails();
    try {
      var categorieID = 2;
      fetch(
        global.APIURL +
          `api/Card/GetGeneralCategoryCards?CategoryId=${categorieID}`,
        {
          method: 'GET',
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          this.setState({GeneralCards: responseJson});
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  CheckTokenExitorNot() {
    try {
      var dataToSend = {
        UserId: global.LoginUserId,
        FCMToken: global.LoginUserFcmToken,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/GetUserFCMToken', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(() => {})
        .catch(error => Alert.alert(error.message));
    } catch (e) {
      Alert.alert(e);
    }
  }
  toggleModal(visible) {
    this.setState({modalVisible: visible});
  }
  getLocationDetails = () => {
    try {
      fetch('http://www.geoplugin.net/json.gp')
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            Lat: global.currentLatitude,
            Long: global.currentLongitude,
            TimeZone: responseJson.geoplugin_timezone,
          });
        })
        .catch(error => Alert.alert(error.message)); //to catch the errors if any
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  getButtonCheck = () => {
    var flag = true;
    if (this.state.BusinessCard !== '') {
      flag = false;
    } else {
      flag = true;
    }
    return flag;
  };
  getStyleCheck = () => {
    if (this.state.BusinessCard !== '') {
      return styles.activeStyle;
    } else {
      return styles.inactiveStyle;
    }
  };
  GenerateReferalCode(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  generalCardsClick(CardfrontFile, CardBackFile, visible, cardId, cardShape) {
    var MDImgCardHeight;
    var MDImgCardWidth;
    var ModalWidth;
    const height = Dimensions.get('window').height;
    const width = Dimensions.get('window').width;
    //CardShape==1 : Horizontal, 2=Vertical, 3= Circle
    if (cardShape === 1) {
      MDImgCardHeight = height * 0.3;
      MDImgCardWidth = width;
      ModalWidth = 1;
    } else if (cardShape === 2) {
      MDImgCardHeight = height * 0.6;
      MDImgCardWidth = width * 0.5;
      ModalWidth = 0.8;
    } else if (cardShape === 3) {
      MDImgCardHeight = height * 0.5;
      MDImgCardWidth = width * 0.5;
    }
    this.setState({
      modalVisible: visible,
      BusinessCard: cardId,
      FrontORBackimg: CardfrontFile,
      FrontImage: CardfrontFile,
      BackImage: CardBackFile,
      MDImgCardHeight: MDImgCardHeight,
      MDImgCardWidth: MDImgCardWidth,
      ModalWidth: ModalWidth,
    });
  }
  imageFlip() {
    if (this.state.cardFront) {
      this.setState({cardFront: !this.state.cardFront});
      this.setState({FrontORBackimg: this.state.FrontImage});
    } else {
      this.setState({cardFront: !this.state.cardFront});
      this.setState({FrontORBackimg: this.state.BackImage});
    }
  }
  _handleUserRegistration = () => {
    var ReferralCode = this.GenerateReferalCode(6);
    const {UserDetails} = this.props;
    UserDetails.BusinessCard = this.state.BusinessCard;
    UserDetails.Lat = this.state.Lat;
    UserDetails.Long = this.state.Long;
    UserDetails.TimeZone = this.state.TimeZone;
    try {
      ServiceCalls.handleUserRegistration(UserDetails, ReferralCode).then(
        response => {
          var data = JSON.parse(response);
          global.LoginUserId = data.guid;
          global.LoginUserName = data.name;
          global.PhoneNumber=data.mobile;
          this.props.setUserProfile(data);
          this.CheckTokenExitorNot();

          Actions.businessCard({
            userProfile: data,
            isFromSelectBusinessCard: true,
          });
        },
      );
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  render() {
   // console.log("Data",this.state.GeneralCards)
    return (
      <View style={styles.viewFlex}>
        <TopBackground />
        <View style={{flex: 6, marginTop: 20}}>
          <MediumBoldText style={styles.text}>
            Choose your Business Card
          </MediumBoldText>
          <Carousel
            ref={c => {
              this._carousel = c;
            }}
            data={this.state.GeneralCards}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={width/1.8}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  this.generalCardsClick(
                    item.sampleCardfrontfile,
                    item.sampleCardbackfile,
                    true,
                    item.cardId,
                    item.cardshape,
                  )
                }>
                <View
                  style={{
                    width:
                      item.cardshape == 1
                        ? Dimensions.get('window').width
                        : 350,
                    height:
                      item.cardshape == 1
                        ? (280 / 494) * Dimensions.get('window').width
                        : 250,
                    margin: 10,
                    alignSelf: 'center',
                  }}>
                     {/* {item.cardId == this.state.BusinessCard ? (
                      <View>
                        <Image
                          source={require('../../Images/correctMark.png')}
                          style={{
                            width: 30,
                            height: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            alignContent: 'center',
                            tintColor:"#11cbdf"
                          }}
                        />
                      </View>
                    ) : null} */}
                  <ImageBackground
                    style={{flex: 1}}
                    imageStyle={{
                      borderRadius: item.borderradious,
                      resizeMode: 'contain',
                    }}
                    source={{
                      uri:
                        global.APIURL +
                        'uploadimgs/samplecards/' +
                        item.sampleCardfrontfile,
                    }}>
                         {item.cardId == this.state.BusinessCard ? (
                      <View style={{top:20}}>
                        <Image
                          source={require('../../BottomTabImages/correct.png')}
                          style={{
                            width: 45,
                            height: 45,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            alignContent: 'center',
                           // tintColor:"#11cbdf"
                          }}
                        />
                      </View>
                    ) : null}
                  </ImageBackground>
                </View>
              </TouchableOpacity>
            )}
          />

          <View style={styles.bottomButton}>
            <FinishButton
              buttonColor={this.getStyleCheck()}
              buttonTitle={'Finish'}
              isDisabled={this.getButtonCheck()}
              onButtonPress={() => this._handleUserRegistration()}
            />
          </View>
          {/* <View style={styles.container}>
            <Dialog
              onTouchOutside={() => this.toggleModal(!this.state.modalVisible)}
              width={width/1.45}
              height={height/1.52}
              visible={this.state.modalVisible}
              style={{backgroundColor: 'red'}}
              dialogAnimation={new ScaleAnimation()}
              onHardwareBackPress={() =>
                this.toggleModal(!this.state.modalVisible)
              }>
            <DialogContent>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginVertical:8

                    }}>
                    <TouchableOpacity
                     onPress={() => {
                      this.imageFlip();
                    }}>
                      <Image
                        source={require('../../Images/flip-icon.png')}
                        style={{
                          alignSelf: 'center',
                          height:15,
                          width:25,
                          tintColor:"gray"
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableHighlight
                      style={styles.touchableButton}
                      onPress={() =>
                        this.toggleModal(!this.state.modalVisible)
                      }
                      >
                      <Image
                        source={require('../../Images/cross.png')}
                        style={{
                          alignSelf: 'center',
                          height:25,
                          width:25,
                          tintColor:"gray",
                          left:10
                        }}
                      />
                    </TouchableHighlight>
                  </View>
                  <View>
                    <Image
                      style={{
                        width:width/1.5,
                        right:15,
                        height: this.state.MDImgCardHeight,
                        resizeMode: 'stretch',
                      }}
                      source={{
                        uri:
                          global.APIURL +
                          'uploadimgs/samplecards/' +
                          this.state.FrontORBackimg,
                      }}
                    />
                  </View>
                </View>
              </DialogContent>
            </Dialog>
          </View> */}
           <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => this.toggleModal(!this.state.modalVisible)}
      >
        <View style={styles.centeredView}>
        <View style={styles.modalView}>
        <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      margin:10,
                      width: width/1.5
                    }}>
                    <TouchableHighlight
                    style={{alignSelf: 'flex-start'}}
                     onPress={() => {
                      this.imageFlip();
                    }}>
                      <Image
                        source={require('../../Images/flip-icon.png')}
                        style={{
                          height:15,
                          width:25,
                          tintColor:"gray"
                        }}
                      />
                    </TouchableHighlight>
                    <TouchableHighlight
                      style={{alignSelf: 'flex-end'}}
                      onPress={() =>
                        this.toggleModal(!this.state.modalVisible)
                      }
                      >
                      <Image
                        source={require('../../Images/cross.png')}
                        style={{
                         // alignSelf: 'flex-end',
                          height:25,
                          width:25,
                          //tintColor:"gray",
                          bottom:4
                        }}
                      />
                    </TouchableHighlight>
                  </View>
                  <View>
                    <Image
                      style={{
                        width:width/1.5,
                        height: height/1.5,
                        resizeMode: 'stretch',
                      }}
                      source={{
                        uri:
                          global.APIURL +
                          'uploadimgs/samplecards/' +
                          this.state.FrontORBackimg,
                      }}
                    />
                  </View>
                  </View>
        </View>
      </Modal>
    </View>
        </View>
        <BottomBackground />
      </View>
    );
  }
}
export const mapStateToProps = state => {
  return {userProfile: state.user.userProfile};
};

const mapDispatchToProps = {
  setUserProfile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonalDetailsView);
const styles = StyleSheet.create({
  viewHeight: {marginTop: 10},
  finishText: {color: 'white', fontSize: 15},
  viewFlex: {flex: 1, backgroundColor: '#f4f6f9'},
  imageAlign: {alignSelf: 'center'},

  imageBackground: {width: '100%', height: '100%'},

  activeStyle: {
    backgroundColor: '#4b230d',
  },
  inactiveStyle: {
    backgroundColor: 'grey',
  },
  text: {
    fontSize: 20,
    color: '#000',
    padding: 20,
    alignSelf: 'center',
  },
  bottomButton: {
    justifyContent: 'flex-end',
    flex: 1,
    marginBottom: 45,
    zIndex: 1000,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 5,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
