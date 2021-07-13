import React, { Component } from 'react';
import FloatingInput from '../../shared/FloatingTextInput';
import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  ScrollView,
  Keyboard, KeyboardAvoidingView
} from 'react-native';
import Images from '../../Images';
import Textarea from 'react-native-textarea';
import Autocomplete from 'react-native-autocomplete-input';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';
import { Actions } from 'react-native-router-flux';
import ServiceCalls from '../../Services/APICalls';
import ContinueButton from '../../shared/Button';
import { DropDownIcon } from '../../shared/Icon';
import { Label } from 'native-base';
import Variables from '../../styles/theme';
import { BoldText } from '../../shared/Text';
export default class PersonalDetailsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ProfessionsList: [],
      Profession: '',
      LastName: '',
      FirstName: '',
      JobTitle: '',
      Story: '',
      isShowIndustryLabel: false,
      IndustryPlaceHolder: 'Industry',
      dropDownIconMargin: 15,
      isEmptyViewShow: false,
      viewContainerStyle: { flex: 1 },
      viewTextFieldsContainer: { backgroundColor: '#b6e7ec', flex: 4 },
      isKeyboardActive: false,
      emptyViewFlex: 4,
      isIndustryFocused: false,
    };
  }
  componentDidMount = () => {
    try {
      ServiceCalls.handleGetAllProfessions().then(response => {
        this.setState({ ProfessionsList: response });
      });
    } catch (e) {
      Alert.alert(e.message);
    }
    var isApplyKeyboardView =
      Dimensions.get('window').height > 685 ? false : true;
    if (isApplyKeyboardView) {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this._keyboardDidShow,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this._keyboardDidHide,
      );
    }
  };
  _keyboardDidHide = () => {
    this.setState({
      isEmptyViewShow: false,
      viewContainerStyle: { flex: 1 },
      isKeyboardActive: false,
      viewTextFieldsContainer: { backgroundColor: '#b6e7ec', flex: 4 },
    });
  };
  _keyboardDidShow = e => {
    this.setState({ isEmptyViewShow: true, isKeyboardActive: true });
    if (this.state.isIndustryFocused) {
      this._handleOnIndustryOnFoucs();
    }
  };
  componentWillUnmount() {
    var isApplyKeyboardView =
      Dimensions.get('window').height > 685 ? false : true;
    if (isApplyKeyboardView) {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
  }
  _handleOnIndustryTextChnage = text => {
    if (text !== '' && typeof text === 'object') {
      // this.setState({
      //   isShowIndustryLabel: true,
      //   IndustryPlaceHolder: null,
      //   dropDownIconMargin: 20,
      // });
    } else {
      this.setState({
        isShowIndustryLabel: false,
        IndustryPlaceHolder: 'Industry',
        dropDownIconMargin: 15,
      });
    }
    if (typeof text === 'string') {
      this.setState({ Profession: text });
    }
  };
  _handleOnIndustryOnFoucs = () => {
    var isFocused = this.state.isIndustryFocused;
    var isApplyKeyboardView =
      Dimensions.get('window').height > 685 ? false : true;
    var marginTop = 70 - (Dimensions.get('window').height - 685) * 20;
    if (isApplyKeyboardView) {
      if (this.state.isKeyboardActive) {
        this.setState({
          isEmptyViewShow: true,
          viewContainerStyle: { flex: 1 },
          emptyViewFlex: 4,
          viewTextFieldsContainer: { backgroundColor: '#b6e7ec', flex: 4 },
        });
      } else if (!isFocused) {
        this.setState({
          dropDownIconMargin: 20,
          viewContainerStyle: { flex: 0.7, marginTop: marginTop },
          viewTextFieldsContainer: { backgroundColor: '#b6e7ec', flex: 2 },
          isEmptyViewShow: false,
          emptyViewFlex: 0,
        });
      } else {
        this.setState({
          viewContainerStyle: { flex: 1 },
          isEmptyViewShow: true,
          emptyViewFlex: 4,
        });
      }
    }
    if (!isFocused || this.state.Profession !== '') {
      this.setState({
        isShowIndustryLabel: true,
        IndustryPlaceHolder: null,
        dropDownIconMargin: 20,
        isIndustryFocused: true,
      });
    } else {
      this.setState({
        isShowIndustryLabel: false,
        IndustryPlaceHolder: 'Industry',
        isIndustryFocused: false,
      });
    }
  };
  AutoProfessions = () => {
    const { Profession } = this.state;
    const Professoins = this.findProfessoins(Profession);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    return (
      <View style={styles.viewAutoProfessionContainer}>
        <View style={styles.viewLabelAutoProfession}>
          {this.state.isShowIndustryLabel ? (
            <Label style={[styles.floatingstyle]}>{'Industry'}</Label>
          ) : null}
          <Autocomplete
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.professionAutoCompleteView}
            inputContainerStyle={styles.autocompleteContainer}
            listStyle={{ borderWidth: 0, borderColor: "transparent" }}
            data={
              Professoins.length === 1 && comp(Profession, Professoins[0].name)
                ? []
                : Professoins
            }
            defaultValue={Profession}
            // onFocus={() => this._handleOnIndustryOnFoucs()}
            // onBlur={() => this._handleOnIndustryOnFoucs()}
            onEndEditing={text => this._handleOnIndustryTextChnage(text)}
            scrollEnabled={true}
            onChangeText={text => this._handleOnIndustryTextChnage(text)}
            placeholder={this.state.IndustryPlaceHolder}
            placeholderTextColor="#6e8f94"
            renderItem={({ item }) => (
              <View style={styles.professionRender}>
                <TouchableOpacity
                  onPress={() => this.setState({ Profession: item.name })}>
                  <View style={styles.professionTouchableView}>
                    <Text style={styles.profText} numberOfLines={2}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        <TouchableOpacity
          onPress={() =>
            this.setState({
              Profession:
                this.state.profession === undefined ||
                  this.state.profession === ''
                  ? ' '
                  : this.state.Profession,
              isShowIndustryLabel: true,
            })
          }>
          <DropDownIcon
            style={[
              styles.dropDownProfession,
              { marginTop: this.state.dropDownIconMargin },
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };
  findProfessoins(Profession) {
    if (Profession.trim === undefined || Profession === '') {
      return [];
    }
    const { ProfessionsList } = this.state;
    const regex = new RegExp(`${Profession.trim()}`, 'i');
    return ProfessionsList.filter(
      profession => profession.name.search(regex) >= 0,
    );
  }
  getButtonPersonal = () => {
    var flag = false;
    if (
      this.state.FirstName !== '' &&
      this.state.LastName !== '' &&
      this.state.JobTitle !== '' &&
      this.state.Profession !== ''
    ) {
      flag = false;
    } else {
      flag = true;
    }
    return flag;
  };
  getStylePersonal = () => {
    if (
      this.state.FirstName !== '' &&
      this.state.LastName !== '' &&
      this.state.JobTitle !== '' &&
      this.state.Profession !== ''
    ) {
      return styles.activeStyle;
    } else {
      return styles.inactiveStyle;
    }
  };
  _handleTextType = text => {
    var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (format.test(text)) {
      Alert.alert('Special characters are not allowed');
    } else {
      this.setState();
    }
  };
  _handleNavigateToCompanyDetails = () => {
    const { Mobile, CountryCode } = this.props;
    var UserDetails = {};
    UserDetails.Mobile = Mobile.replace(/ /g, '');
    UserDetails.CountryCode = CountryCode.replace(/ /g, '');
    UserDetails.FirstName = this.state.FirstName;
    UserDetails.LastName = this.state.LastName;
    UserDetails.JobTitle = this.state.JobTitle;
    UserDetails.Profession = this.state.Profession;
    UserDetails.Story = this.state.Story;
    Actions.companyDetails({ UserDetails: UserDetails });
  };
  render() {
    const { Mobile } = this.props;
    return (
      <View style={[{ backgroundColor: '#f5f6fa', flex: 1 }, this.state.viewContainerStyle]}>
        <View style={{ flex: 1 }}>
          <Image
            style={{ alignSelf: 'center', marginTop: 20 }}
            source={require('../../Images/newlogo.png')}
          />
          <ImageBackground
            style={styles.curveShape}
            source={require('../../BottomTabImages/curve1.png')}
          />
        </View>
        <View style={{ marginTop: 60 }}>
          <ImageBackground
            style={{ width: '100%', height: 71 }}
            source={require('../../Images/topshape.png')}>
            <BoldText style={styles.textEnterYourDetails}>
              What's your name?
            </BoldText>
          </ImageBackground>
        </View>
        <KeyboardAvoidingView behavior='padding' style={this.state.viewTextFieldsContainer}>
          <View style={{ flex: 4, backgroundColor: '#b6e7ec' }}>
            <ScrollView >
              <View style={{ flex: 3.2, justifyContent: 'space-between' }}>
                <View
                  style={{
                    flex: 1,
                    marginLeft: 40,
                    marginRight: 40,
                  }}>
                  <View style={{ marginBottom: 10 }}>
                    <FloatingInput
                      borderEnable={true}
                      placeholder="First Name"
                      maxLength={15}
                      onChangeText={value => {
                        //this._handleTextType(value);
                        this.setState({ FirstName: value });
                      }}
                    />
                  </View>
                  <View style={{ marginBottom: 10 }}>
                    <FloatingInput
                      borderEnable={true}
                      placeholder="Last Name "
                      maxLength={15}
                      onChangeText={value => {
                        //this._handleTextType(value);
                        this.setState({ LastName: value });
                      }}
                    />
                  </View>
                  <View style={{ marginBottom: 10 }}>
                    <FloatingInput
                      borderEnable={true}
                      placeholder="Job Title"
                      onChangeText={value => {
                        //this._handleTextType(value);
                        this.setState({ JobTitle: value });
                      }}
                    />
                  </View>
                  {this.AutoProfessions()}
                </View>
                <View style={{ margin: 50, bottom: 25 }}>
                  <Text style={{ color: "#6b9195", fontSize: 16 }}>Your Story (Optional)</Text>
                  <Textarea
                    containerStyle={{
                      flex: 1,
                      height: 100,
                      //backgroundColor: '#F5FCFF',
                      borderColor: '#6b9195',
                      borderWidth: 1,
                    }}
                    style={{
                      textAlignVertical: 'top',  // hack android
                      fontSize: 15,
                      color: '#333',
                      //backgroundColor: "#f4f6f9"
                    }}
                    onFocus={this.onFocusChange}
                    onChangeText={value => this.setState({ Story: value })}
                    maxLength={500}
                    numberOfLines={20}
                    multiline={true}
                    editable={true}
                    fontSize={16}
                    //blurOnSubmit={true}
                    //placeholder={"Type something"}
                    placeholder={"Tell your story to people what you are offering or seeking ...."}
                    placeholderTextColor={'#6b9195'}
                    //placeholderTextColor={'grey'}
                    underlineColorAndroid={'transparent'}
                  />
                </View>
              </View>
              <View style={styles.bottomButton}>
                <ContinueButton
                  buttonColor={this.getStylePersonal()}
                  buttonTitle={'Continue'}
                  isDisabled={this.getButtonPersonal()}
                  onButtonPress={() => this._handleNavigateToCompanyDetails()}
                />
              </View>
            </ScrollView>
          </View>
          {this.state.isEmptyViewShow ? (
            <View style={{ flex: this.state.emptyViewFlex }} />
          ) : null}
        </KeyboardAvoidingView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  textEnterYourDetails: {
    flex: 1,
    fontSize: 22,
    color: '#000',
    textAlign: 'center',
    // fontWeight: 'bold',
    paddingTop: 20,
    // marginRight: 200,
  },
  profText: {
    color: 'black',
    fontSize: 12,
    textAlign: 'left',
    marginRight: 40,
    flexWrap: 'wrap',
    fontWeight: "bold",
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 300,
    marginBottom: 10,
    height: 45,
    alignSelf: 'center',
    padding: 10,
  },
  professionAutoCompleteView: {
    borderRadius: 10,
    position: 'relative',
    color: '#000',
    fontSize: 16,
    paddingVertical: 15,
    paddingLeft: 5,
    paddingRight: 7,
    paddingTop: 2,
    paddingBottom: 2,
  },
  floatingstyle: {
    marginLeft: 2,
    fontSize: 15,
    color: '#6e8f94',
    fontFamily: Variables.normalFont,

  },
  viewAutoProfessionContainer: {
    flex: 1,
    marginHorizontal: 8,
    borderBottomWidth: 1,
    flexDirection: 'row',
    borderBottomColor: '#6e8f94',
    paddingVertical: 5,
  },
  viewLabelAutoProfession: { flexDirection: 'column', flex: 2 },
  professionRender: {
    //marginVertical: 3,
    flex: 1,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 0.4,
    height: 40,
    backgroundColor: "#B6E7EC",
    justifyContent: "center"
  },
  professionTouchableView: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  autocompleteContainer: {
    borderColor: 'transparent',
    fontSize: 20,
  },
  activeStyle: {
    backgroundColor: '#08a0af',
  },
  inactiveStyle: {
    backgroundColor: '#dcdcdc',
  },
  bottomButton: {
    flex: 0.8,
    //marginTop: 30,
    bottom: 20
  },

  curveShape: {
    width: 32,
    height: 95,
    position: 'absolute',
    right: 0,
    top: 70,
  },
  dropDownProfession: { fontSize: 15 },
});