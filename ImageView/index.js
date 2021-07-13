import React, {Component} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import {ArrowLeft, Flip} from '../shared/Icon';
import {connect} from 'react-redux';
import {goBack} from '../Services/BackButtonServices';
import CommonHeader from '../shared/CommonHeader';
import {Text} from '../shared/Text';
import {CommonStyles, LightGrayColor} from '../shared/Constants';
import Communications from 'react-native-communications';
import LinearGradient from 'react-native-linear-gradient';
class ImageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFlipped: false,
    };
  }
  _handleHeaderLeftIcon = () => {
    return (
      <View style={styles.leftHeader}>
        <ArrowLeft style={{color: CommonStyles.appColor, fontSize: 20}} />
      </View>
    );
  };
  _handleHeaderRightIcon = () => {
    return null;
  };
  _handleHeaderCenterIcon = () => {
    const {FileName} = this.props;
    var CardName = FileName.split('_');
    return (
      <View style={{top: 5}}>
        <Text style={{color: '#ffffff', fontSize: 18, textAlign: 'center'}}>
          {CardName[0]}
        </Text>
      </View>
    );
  };
  _handleHeaderText = () => {
    return null;
  };
  _handleHeaderLeftIconPress = () => {
    const {handleGoBack} = this.props;
    handleGoBack();
  };
  _handleOnFlipPress = () => {
    this.setState({isFlipped: !this.state.isFlipped});
  };
  _handleHeaderProfileIcon = () => {
    return null;
  };
  _handleRedirectGmail = Email => {
    if (Email != null && Email != '') {
      Communications.email(
        [Email],
        null,
        null,
        'Demo Subject',
        'Demo Content for the mail',
      );
    }
  };
  _handleRedirectToPhone = number => {
    if (number != null && number != '') {
      Communications.phonecall(number, true);
    }
  };
  _handleRedirectToWeb = website => {
    if (website != null && website != '') {
      Communications.web(website);
    }
  };
  render() {
    const {FileName, ContactData} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: '#f4f6f9'}}>
        <View style={{flex: 0.36}}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => this._handleHeaderRightIcon()}
            HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
            HeaderText={() => this._handleHeaderText()}
            HeaderLeftIconPress={this._handleHeaderLeftIconPress}
            HeaderProfileIcon={() => this._handleHeaderProfileIcon()}
            HeaderProfileIconPress={this._handleHeaderProfileIconPress}
            IsShowTextForTabs={false}
          />
        </View>
        <View style={{flex: 0.1, flexDirection: 'row', margin: 10}}>
          <View style={{flex: 2, top: 5}}>
            <Text>
              {this.state.isFlipped
                ? 'Card Back Side Picture'
                : 'Card Front Side Picture'}
            </Text>
          </View>
          <View style={{flex: 1}} />
          {ContactData.backFileName != null ? (
            <View
              style={{
                flex: 0.5,
              }}>
              <LinearGradient
                start={{x: 1, y: 0}}
                end={{x: 0, y: 1}}
                colors={['transparent', '#ffffff']}
                style={{height: 30, width: 30, borderRadius: 60}}>
                <TouchableOpacity onPress={() => this._handleOnFlipPress()}>
                  <Flip />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          ) : null}
        </View>
        {this.state.isFlipped ? (
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{
              uri:
                global.APIURL +
                'uploadimgs/scannedcards/' +
                ContactData.backFileName,
            }}
          />
        ) : (
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{
              uri: global.APIURL + 'uploadimgs/scannedcards/' + FileName,
            }}
          />
        )}
        {ContactData.status == 'P' ? (
          <View style={{flex: 1}}>
            <ScrollView>
              <View style={styles.container}>
                <View style={styles.floatingTextInputView}>
                  <Text style={{margin: 5, color: LightGrayColor.fontColor}}>
                    Name
                  </Text>
                  <TextInput
                    value={ContactData.name}
                    style={styles.text}
                    editable={false}
                  />
                </View>
                <View style={styles.floatingTextInputView}>
                  <Text style={{color: LightGrayColor.fontColor}}>Email</Text>
                  <TouchableOpacity
                    onPress={() =>
                      this._handleRedirectGmail(ContactData.email)
                    }>
                    <TextInput
                      value={ContactData.email}
                      style={styles.text}
                      editable={false}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.floatingTextInputView}>
                  <Text style={{color: LightGrayColor.fontColor}}>Phone</Text>
                  <TouchableOpacity
                    onPress={() =>
                      this._handleRedirectToPhone(ContactData.mobile)
                    }>
                    <TextInput
                      value={ContactData.mobile}
                      style={styles.text}
                      editable={false}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.floatingTextInputView}>
                  <Text style={{color: LightGrayColor.fontColor}}>
                    Company Name
                  </Text>
                  <TextInput
                    value={ContactData.companyname}
                    style={styles.text}
                    editable={false}
                  />
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.floatingTextInputView}>
                  <Text style={{color: LightGrayColor.fontColor}}>Title</Text>
                  <TouchableOpacity>
                    <TextInput
                      value={ContactData.title}
                      style={styles.text}
                      editable={false}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.floatingTextInputView}>
                  <Text style={{color: LightGrayColor.fontColor}}>Address</Text>
                  <TextInput
                    value={ContactData.address}
                    style={styles.text}
                    editable={false}
                  />
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.floatingTextInputView}>
                  <Text style={{color: LightGrayColor.fontColor}}>
                    Company Email
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      this._handleRedirectGmail(ContactData.cemail)
                    }>
                    <TextInput
                      value={ContactData.cemail}
                      style={styles.text}
                      editable={false}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.floatingTextInputView}>
                  <Text style={{color: LightGrayColor.fontColor}}>
                    Company Address
                  </Text>
                  <TextInput
                    value={ContactData.caddress}
                    style={styles.text}
                    editable={false}
                  />
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.floatingTextInputView}>
                  <Text style={{color: LightGrayColor.fontColor}}>
                    Department
                  </Text>
                  <TextInput
                    value={ContactData.department}
                    style={styles.text}
                    editable={false}
                  />
                </View>
                <View style={styles.floatingTextInputView}>
                  <Text style={{color: LightGrayColor.fontColor}}>
                    Company Mobile
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      this._handleRedirectToPhone(ContactData.cmobile)
                    }>
                    <TextInput
                      value={ContactData.cmobile}
                      style={styles.text}
                      editable={false}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.floatingTextInputView}>
                  <Text style={{color: LightGrayColor.fontColor}}>
                    Profession
                  </Text>
                  <TextInput
                    value={ContactData.profession}
                    style={styles.text}
                    editable={false}
                  />
                </View>
                <View style={styles.floatingTextInputView}>
                  <Text style={{color: LightGrayColor.fontColor}}>Website</Text>
                  <TouchableOpacity
                    onPress={() =>
                      this._handleRedirectToWeb(ContactData.website)
                    }>
                    <TextInput
                      value={ContactData.website}
                      style={styles.text}
                      editable={false}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.floatingTextInputView}>
                  <Text style={{color: LightGrayColor.fontColor}}>Twitter</Text>
                  <TextInput
                    value={ContactData.twitter}
                    style={styles.text}
                    editable={false}
                  />
                </View>
                <View style={styles.floatingTextInputView}>
                  <Text style={{color: LightGrayColor.fontColor}}>
                    FaceBook
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      this._handleRedirectToWeb(ContactData.website)
                    }>
                    <TextInput
                      value={ContactData.facebook}
                      style={styles.text}
                      editable={false}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.floatingTextInputView}>
                  <Text style={{color: LightGrayColor.fontColor}}>Skype</Text>
                  <TouchableOpacity
                    onPress={() =>
                      this._handleRedirectToWeb(ContactData.website)
                    }>
                    <TextInput
                      value={ContactData.skype}
                      style={styles.text}
                      editable={false}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.floatingTextInputView}>
                  <Text style={{color: LightGrayColor.fontColor}}>
                    Linkedin
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      this._handleRedirectToWeb(ContactData.linkedin)
                    }>
                    <TextInput
                      value={ContactData.linkedin}
                      style={styles.text}
                      editable={false}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.container}>
                <View style={styles.floatingTextInputView}>
                  <Text style={{color: LightGrayColor.fontColor}}>Fax</Text>
                  <TouchableOpacity
                    onPress={() =>
                      this._handleRedirectToPhone(ContactData.cmobile)
                    }>
                    <TextInput
                      value={ContactData.fax}
                      style={styles.text}
                      editable={false}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.floatingTextInputView}>
                  <Text style={{color: LightGrayColor.fontColor}}>Others</Text>
                  <TextInput
                    value={ContactData.others}
                    style={styles.text}
                    editable={false}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        ) : (
          <View style={{flex: 1}} />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  leftHeader: {
    flexDirection: 'column',
    height: 38,
    width: 38,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
  },
  headerCustomMenu: {
    marginRight: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 100,
  },
  headerTextMenu: {
    color: 'red',
  },
  container: {
    flex: 0.2,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
  },
  floatingTextInputView: {
    flex: 0.5,
  },
  text: {
    fontSize: 15,
    color: '#6e8f94',
  },
  image: {
    flex: 1,
    borderRadius: 10,
    //borderWidth: 1,
    borderColor: '#9B9B9B',
    margin: 10,
    marginTop: 0,
  },
});
const mapDispatchToProps = {
  handleGoBack: goBack,
};

export default connect(
  null,
  mapDispatchToProps,
)(ImageView);
