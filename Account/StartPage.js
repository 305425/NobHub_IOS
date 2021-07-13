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
  PermissionsAndroid,
  ScrollView,
  Alert, 
  StatusBar, 
  Modal,
 // Pressable
} from 'react-native';
import {Button} from 'react-native-elements';
import firebase from 'react-native-firebase';
import SwiperFlatList from 'react-native-swiper-flatlist';
import Dialog, {DialogContent, ScaleAnimation} from 'react-native-popup-dialog';
import CheckBox from 'react-native-check-box';
import {Close} from '../shared/Icon';
import {Actions} from 'react-native-router-flux';
import LoginButton from '../shared/Button';
import {Text, BoldText} from '../shared/Text';
import {CommonStyles} from '../shared/Constants';
import LinearGradient from 'react-native-linear-gradient';
export default class StartPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTermsAndConditions: false,
      isChecked: false,
    };
  }
  _handleGetStartedPress() {
    try {
      if (this.state.isChecked) {
        Actions.login1({
          IsCallRegistration: true,
          ButtonText: 'Continue',
          LabelText: 'What' + "'s" + ' your phone number?',
          IsFromChangeNumber: false,
        });
      }
    } catch (e) {
      Alert.alert(e.message);
    }
  }

  _handleCloseTermsAndConditons = () => {
    this.setState({
      showTermsAndConditions: false,
    });
  };
  _handleOnTermsAndConditionsPress = () => {
    this.setState({
      showTermsAndConditions: true,
    });
  };
  getstartedStyle() {
    if (this.state.isChecked) {
      return styles.activeStyle;
    } else {
      return styles.inactiveStyle;
    }
  }
  _renderTermsAndCondition = () => {
    return (
      // <Dialog
      //   onTouchOutside={this._handleCloseTermsAndConditons}
      //   width={0.9}
      //   height={height/1.35}
      //   visible={this.state.showTermsAndConditions}
      //   dialogAnimation={new ScaleAnimation()}
      //   onHardwareBackPress={this._handleCloseTermsAndConditons}>
      //   <DialogContent>
      //     <ScrollView showsVerticalScrollIndicator={false}>
      //       <View style={styles.viewTermsAndConditions}>
      //         <Text style={styles.textTitleTermsAndConditions}>
      //           {'Terms & Conditions'}
      //         </Text>
      //         {/* <View style={styles.viewCloseTermsAndConditions}>
      //           <TouchableOpacity onPress={this._handleCloseTermsAndConditons}>
      //             <Close style={styles.iconClose} />
      //           </TouchableOpacity>
      //         </View> */}
      //       </View>
      //     </ScrollView>
      //     <ScrollView showsVerticalScrollIndicator={false}>
      //       <View style={{paddingBottom: 30}}>
      //         <Text style={styles.textTermsAndConditions}>
      //           {
      //             '  A product of Nob Hub Incorporation thereby makes the “Site” (websites including, without restriction, www.nobhub.com and all its subdomains), Mobile Application and Services “including without restriction, payment, logs for practices, individual and global statistical data, location services, contact management business card distribution) to enable business owners and professionals design virtual business cards, store and share business information of contacts with a single click. Access to and the use of NobHub Site, Mobile Application and Services and also future Sites, Mobile Application or Services rendered by NobHub is governed by this Terms of Use and User’s Agreement (“this Agreement”).\n \n Notice of Agreement \n“…Any participation in this service whether through the website or the mobile application will signify the acceptance of this agreement…” \n \n Acceptance of Terms \n "BY ACCESSING AND USING THIS SERVICE, YOU ACCEPT AND CONSENT TO BE BOUND BY THE TERMS AND PROVISION OF THIS AGREEMENT. ALSO, WHEN USING THESE PARTICULAR SERVICES, YOU SHALL BE SUBJECT TO ANY POSTED GUIDELINES OR RULES APPLICABLE TO SUCH SERVICES. ANY PARTICIPATION IN THIS SERVICE WILL CONSTITUTE UNDERSTANDING AND ACCEPTANCE OF THIS AGREEMENT.” \n \n If you are a free user, or are accessing the Site to use as a premium member of the Services or Mobile Application, or are otherwise browsing the Site, this Agreement is between you, exclusively, and Manbrosys LLc.\n\n Acceptance of this agreement indicates that you fully understand and agree to the terms written therein. Do not proceed with the use of these services if you do not agree'
      //           }
      //         </Text>
      //         {/* <View style={styles.viewAgreeTermsAndConditions}>
      //         <CheckBox onClick={this._handleChkCloseTermsAndCondition} />
      //         <Text style={styles.fontSize}>I Agree Terms & Conditions</Text>
      //       </View> */}
      //       {/* <Button
      //       onPress={this._handleCloseTermsAndConditons}
      //       title="Cancel"
      //       color="#08a0af"
      //       /> */}
      //       <Button
      //          title="Cancel"
      //          onPress={this._handleCloseTermsAndConditons}
      //          buttonStyle={{backgroundColor:"#08a0af", borderRadius:30,top:15}}
      //          containerStyle={{width:"50%", alignSelf:"center"}}
      //       />
      //       </View>
      //     </ScrollView>
      //   </DialogContent>
      // </Dialog>
      <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showTermsAndConditions}
        onRequestClose={this._handleCloseTermsAndConditons}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <View style={styles.viewTermsAndConditions}>
               <Text style={styles.textTitleTermsAndConditions}>
                 {'Terms & Conditions'}
               </Text>
             </View>
             <ScrollView showsVerticalScrollIndicator={false}>
             <View>
               <Text style={styles.textTermsAndConditions}>
                 {
                  '  A product of Nob Hub Incorporation thereby makes the “Site” (websites including, without restriction, www.nobhub.com and all its subdomains), Mobile Application and Services “including without restriction, payment, logs for practices, individual and global statistical data, location services, contact management business card distribution) to enable business owners and professionals design virtual business cards, store and share business information of contacts with a single click. Access to and the use of NobHub Site, Mobile Application and Services and also future Sites, Mobile Application or Services rendered by NobHub is governed by this Terms of Use and User’s Agreement (“this Agreement”).\n \n Notice of Agreement \n“…Any participation in this service whether through the website or the mobile application will signify the acceptance of this agreement…” \n \n Acceptance of Terms \n "BY ACCESSING AND USING THIS SERVICE, YOU ACCEPT AND CONSENT TO BE BOUND BY THE TERMS AND PROVISION OF THIS AGREEMENT. ALSO, WHEN USING THESE PARTICULAR SERVICES, YOU SHALL BE SUBJECT TO ANY POSTED GUIDELINES OR RULES APPLICABLE TO SUCH SERVICES. ANY PARTICIPATION IN THIS SERVICE WILL CONSTITUTE UNDERSTANDING AND ACCEPTANCE OF THIS AGREEMENT.” \n \n If you are a free user, or are accessing the Site to use as a premium member of the Services or Mobile Application, or are otherwise browsing the Site, this Agreement is between you, exclusively, and Manbrosys LLc.\n\n Acceptance of this agreement indicates that you fully understand and agree to the terms written therein. Do not proceed with the use of these services if you do not agree'
                }
              </Text>
             </View>
             </ScrollView> 
            <Button
             ViewComponent={LinearGradient}
             linearGradientProps={{
               colors: ['rgba(17,203,223,1)' , 'rgba(8,155,171,1)'],
              //  start: { x: 0, y: 0.5 },
              //  end: { x: 1, y: 0.5 },
             }}
               title="Cancel"
               onPress={this._handleCloseTermsAndConditons}
               buttonStyle={{backgroundColor:"#08a0af", borderRadius:30,top:15}}
               containerStyle={{width:width/3, alignSelf:"center"}}
            />
          </View>
        </View>
      </Modal>
    </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#f5f6fa'}}>
        <StatusBar
        hidden={false} />
        <View style={{flex: 1}}>
          <ImageBackground
            style={{width: 300, height: 150}}
            source={require('../BottomTabImages/curve2.png')}
          />
        </View>
        <View style={{flex: 1}}>
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
          {/* <ImageBackground
            style={{
              flexWrap: 'wrap',
              paddingRight: 50,
              paddingVertical: 65,
              marginLeft: 350,
              position: 'absolute',
              // right: 0,
              // top: -70,
            }}
            source={require('../BottomTabImages/curve1.png')}
          /> */}
        </View>
        <View style={{flex: 5, marginTop: 40}}>
          <SwiperFlatList
            renderAll={false}
            autoplay
            autoplayDelay={3}
            paginationActiveColor={'#08a0af'}
            paginationDefaultColor={'#c5e5ea'}
            autoplayLoop
            index={0}
            paginationStyleItem={styles.swiper}
            //paginationStyle={styles.pagination}
            showPagination>
            <View style={styles.child}>
              <BoldText style={styles.text}>{'Come together!'}</BoldText>
              <View style={styles.viewSwiperImages}>
                <Image
                  style={styles.image}
                  source={require('../Images/slide1.png')}
                />
              </View>
            </View>
            <View style={styles.child}>
              <BoldText style={styles.text}>
                {'Connect and Exchange Business Cards'}
              </BoldText>
              <View style={styles.viewSwiperImages}>
                <Image
                  style={styles.image}
                  source={require('../Images/slide2.png')}
                />
              </View>
            </View>
            <View style={styles.child}>
              <BoldText style={styles.text}>
                {'Celebrate & Nurture Relationships'}
              </BoldText>
              <View style={styles.viewSwiperImages}>
                <Image
                  style={styles.image}
                  source={require('../Images/slide3.png')}
                />
              </View>
            </View>
            <View style={styles.child}>
              <BoldText style={styles.text}>{'Schedule Meetings'}</BoldText>
              <View style={styles.viewSwiperImages}>
                <Image
                  style={styles.image}
                  source={require('../Images/slide4.png')}
                />
              </View>
            </View>
            <View style={styles.child}>
              <BoldText style={styles.text}>
                {'One on One or Group Chat'}
              </BoldText>
              <View style={styles.viewSwiperImages}>
                <Image
                  style={styles.image}
                  source={require('../Images/slide5.png')}
                />
              </View>
            </View>
            <View style={styles.child}>
              <BoldText style={styles.text}>
                {'Choose & Customize Business Card Templates'}
              </BoldText>
              <View style={styles.viewSwiperImages}>
                <Image
                  style={styles.image}
                  source={require('../Images/slide6.png')}
                />
              </View>
            </View>
            <View style={styles.child}>
              <BoldText style={styles.text}>{'Promote Your Business'}</BoldText>
              <View style={styles.viewSwiperImages}>
                <Image
                  style={styles.image}
                  source={require('../Images/slide7.png')}
                />
              </View>
            </View>
          </SwiperFlatList>
        </View>
        <View style={styles.viewAgreeTermsAndConditions}>
          <CheckBox
            onClick={() => {
              this.setState({
                isChecked: !this.state.isChecked,
              });
            }}
            checkBoxColor={'#08a0af'}
            checkedCheckBoxColor={'#08a0af'}
            isChecked={this.state.isChecked}
            accessibilityLabel="agree"
          />
          <Text style={{fontSize: 15}}> I Agree </Text>
          <TouchableOpacity
            style={{zIndex: 999}}
            onPress={this._handleOnTermsAndConditionsPress}>
            <Text style={styles.textLinkTermsAndConditions}>
              {'Terms & Conditions'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.viewGetStarted}>
          <LoginButton
            accessibilityLabel="getStarted"
            buttonColor={this.getstartedStyle()}
            buttonTitle={'Get Started'}
            isDisabled={!this.state.isChecked}
            onButtonPress={() => this._handleGetStartedPress()}
          />
        </View>
        <View style={{flex: 0.8, justifyContent: 'flex-end'}}>
          <View style={styles.viewAlreadyAMember}>
            <BoldText style={styles.textAlreadyAMember}>
              Already a Member?
            </BoldText>
            <TouchableOpacity
            accessibilityLabel="login"
              onPress={() =>
                Actions.login1({
                  IsCallRegistration: false,
                  ButtonText: 'Login',
                  LabelText: 'What' + "'s" + ' your phone number?',
                  IsFromChangeNumber: false,
                })
              }>
              <BoldText style={styles.textLogin}>Login</BoldText>
            </TouchableOpacity>
          </View>
          {this._renderTermsAndCondition()}
          <View style={{position: 'absolute'}}>
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
export const {width, height} = Dimensions.get('window');

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
  textTermsAndConditions: {fontSize: 14, textAlign: 'justify'},
  viewTermsAndConditions: {
  // flex: 1,
   // flexDirection: 'row',
   // paddingTop: 15,
    paddingBottom: 15,
   // paddingLeft: 60,
   // alignItems: 'flex-end',
  // alignSelf:"center"
  },
  viewCloseTermsAndConditions: {flex: 1, alignItems: 'flex-end'},
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
  viewLinkTermsAndConditions: {alignItems: 'center'},
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
  viewLogin: {flexDirection: 'row', alignSelf: 'center', marginTop: 0},
  viewGetStarted: {flex: 1, zIndex: 1000},
  textGetStarted: {color: '#ffffff', fontSize: 15},
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
  iconClose: {color: '#ff0000', fontSize: 24},
  viewSwiperImages: {flex: 1, paddingVertical: 10, paddingHorizontal: 20},
});
