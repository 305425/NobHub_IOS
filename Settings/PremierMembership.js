import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
  StatusBar,
} from 'react-native';
import LoginButton from '../shared/Button';
import { Text, BoldText } from '../shared/Text';
export default class MemberShip extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f6fa' }}>
        <StatusBar
          hidden={false} />
        <View style={{ flex: 1 }}>
          <ImageBackground
            style={{ width: 300, height: 150 }}
            source={require('../BottomTabImages/curve2.png')}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Image
            style={{
              alignSelf: 'center',
              position: 'absolute',
            }}
            source={require('../Images/newlogo.png')}
          />
          <View
            style={{
              flex: 1,
              alignSelf: 'flex-end',
              position: 'absolute',
              marginTop: 20,
            }}>
            <Image
              style={{
                flex: 1,
                alignSelf: 'flex-end',
                position: 'absolute',
              }}
              source={require('../BottomTabImages/curve1.png')}
            />
          </View>

        </View>
        <View style={{ flex: 1 }}>
          <BoldText style={styles.text}>{'Congratulations !'}</BoldText>
          <BoldText style={[styles.text, { top: 40, margin: 15 }]}>{'Now you are a Premium member !'}</BoldText>
          <BoldText style={[styles.text, { top: 40, margin: 10 }]}>{'Enjoy 1 Year for Free !'}</BoldText>
        </View>

        <View style={styles.viewGetStarted}>
          <LoginButton
            accessibilityLabel="Ok,got it!"
            buttonColor={'rgba(8,155,171,1)', 'rgba(17,203,223,1)'}
            buttonTitle={'Ok,got it!'}
            onButtonPress={() => this.props.navigation.goBack()}
          />
        </View>
        <View style={{ flex: 0.8, justifyContent: 'flex-end' }}>
          <View style={{ position: 'absolute' }}>
            <ImageBackground
              style={styles.imageBackgroundBottom}
              source={require('../BottomTabImages/curve3.png')}
            />
          </View>
        </View>
      </View>
    );
  }
}
export const { width, height } = Dimensions.get('window');

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
    fontSize: 23,
    textAlign: 'center',
    color: '#000',
  },
  swiper: {
    width: 20,
    height: 5,
    borderRadius: 30,
    // marginBottom: 16,
  },
  // pagination: {marginTop: 200},
  image: {
    width: 280,
    height: 221,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#4b230d',
    color: '#ffffff',
    padding: 15,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
    borderRadius: 10,
    // width: 300,
  },
  textTitleTermsAndConditions: {
    fontSize: 20,
    color: '#08a0af',
  },
  textTermsAndConditions: { fontSize: 14, textAlign: 'justify' },
  viewTermsAndConditions: {
    // flex: 1,
    // flexDirection: 'row',
    // paddingTop: 15,
    paddingBottom: 15,
    // paddingLeft: 60,
    // alignItems: 'flex-end',
    // alignSelf:"center"
  },
  viewCloseTermsAndConditions: { flex: 1, alignItems: 'flex-end' },
  viewAgreeTermsAndConditions: {
    flex: 0.4,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  fontSize: {
    fontSize: 15,
    borderBottomWidth: 1,
    color: '#08a0af',
    borderBottomColor: '#08a0af',
  },
  viewLinkTermsAndConditions: { alignItems: 'center' },
  textAgreeTermsAndConditions: {
    color: '#ffffff',
  },
  textLinkTermsAndConditions: {
    fontSize: 15,
    borderBottomWidth: 1,
    color: '#08a0af',
    borderBottomColor: '#08a0af',
  },
  textLogin: {
    fontSize: 15,
    color: '#08a0af',
    textDecorationLine: 'underline',
    textDecorationColor: '#4b230d',
  },
  activeStyle: {
    backgroundColor: '#08a0af',
  },
  inactiveStyle: {
    backgroundColor: '#dcdcdc',
  },
  touchableOpacityGetStarted: {
    alignItems: 'center',
    borderRadius: 60,
    paddingVertical: 10,
    marginBottom: 20,
    marginLeft: 80,
    marginRight: 80,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  viewLogin: { flexDirection: 'row', alignSelf: 'center', marginTop: 0 },
  viewGetStarted: { flex: 1, zIndex: 1000, top: 25 },
  textGetStarted: { color: '#ffffff', fontSize: 15 },
  imageBackgroundBottom: {
    flex: 1,
    flexWrap: 'wrap',
    paddingTop: 130,
    paddingRight: 440,
    paddingLeft: 55,
  },
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
  iconClose: { color: '#ff0000', fontSize: 24 },
  viewSwiperImages: { flex: 1, paddingVertical: 10, paddingHorizontal: 20 },
});
