import React, {Component} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  Share,
  Platform,
  BackHandler,
} from 'react-native';
import CommonHeader from '../shared/CommonHeader';
import {ArrowLeft, SendIcon, Appstore, GooglePlay} from '../shared/Icon';
import {
  CommonStyles,
  GilRoyMediumColor,
  GilRoyRegularColor,
  PlayStoreLink,
} from '../shared/Constants';
import {Text, MediumBoldText, BoldText} from '../shared/Text';
import {Thumbnail} from 'native-base';
import base64 from 'react-native-base64';
import {Actions} from 'react-native-router-flux';
export default class ShareBusinessCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      URL: [],
      ShareCardDetails: [],
    };
    BackHandler.addEventListener('hardwareBackPress', this.back_Button_Press);
  }
  back_Button_Press = () => {
    global.MyConnections.setState({
      TextInputPlaceHolder: 'Name/Phone number',
      IsScan: true,
      IsCancel: false,
      IsShowTabsForMultiple: false,
      IsShowTabs: false,
    });
    global.MyConnections._handleMyContactSearch('');
    global.MyConnections.getInitialData();
  };
  _handleHeaderLeftIcon = () => {
    return (
      <View style={styles.leftHeader}>
        <ArrowLeft style={{color: CommonStyles.appColor, fontSize: 22}} />
      </View>
    );
  };
  _handleHeaderRightIcon = () => {
    return (
      <View style={styles.leftHeader}>
        <SendIcon style={{color: CommonStyles.appColor, fontSize: 22}} />
      </View>
    );
  };
  _handleHeaderCenterIcon = () => {
    return (
      <View>
        <Text style={{color: '#ffffff', fontSize: 14}}>Share BusinessCard</Text>
      </View>
    );
  };
  _handleHeaderText = () => {
    return null;
  };
  _handleHeaderProfileIcon = () => {
    return null;
  };
  _handleHeaderLeftIconPress = () => {
    //const {handleGoBack} = this.props;
    //handleGoBack();
    global.MyConnections.setState({
      TextInputPlaceHolder: 'Name/Phone number',
      IsScan: true,
      IsCancel: false,
      IsShowTabsForMultiple: false,
      IsShowTabs: false,
    });
    global.MyConnections._handleMyContactSearch('');
    global.MyConnections.getInitialData();
    Actions.myConnections();
  };
  _handleRenderImageDetails = item => {
    if (item.image !== '' && item.image !== null) {
      return (
        <View>
          <Thumbnail
            medium
            source={{
              uri: global.APIURL + 'uploadimgs/ProfilePictures/' + item.image,
            }}
          />
        </View>
      );
    }
    //return <Thumbnail medium source={Images.defaultProfile} />;
    return (
      <View style={styles.fab}>
        <MediumBoldText
          style={{
            fontSize: 26,
            color: '#ffffff',
            textAlign: 'center',
          }}>
          {item.initials}
        </MediumBoldText>
      </View>
    );
  };
  componentDidMount = () => {
    const {ShareData} = this.props;
    try {
      var that = this;
      let today = new Date();
      let date =
        today.getFullYear() +
        '-' +
        parseInt(today.getMonth() + 1) +
        '-' +
        today.getDate();
      var obj = ShareData;
      obj.forEach(function(item) {
        if (item.isShareMyCard) {
          var _list = that.state.URL;
          var _data = base64.encode(`${item.userId}`);
          _list.push(
            global.APIURL +
              `BusinessCards/ShareCard?UserId=${_data}&datetime=${date}&isShare=${false}&LogInUserId=${
                global.LoginUserId
              }` +
              '\n',
          );
          that.setState({URL: _list});
        }
      });
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleRenderContactDetails = item => {
    return (
      <View style={styles.viewContactDetails}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 2}}>
            <MediumBoldText style={styles.textName}>
              {item.displayname}
            </MediumBoldText>
            <Text style={styles.textDesignation}>
              {item.title + ', ' + item.companyname}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  _handleRenderURL = item => {
    return (
      <View style={{margin: 10}}>
        <Text style={{color: CommonStyles.appColor}}>{item.URL}</Text>
      </View>
    );
  };
  _handleRenderItem = ({item}) => {
    if (item.isShareMyCard) {
      return (
        <View style={{borderBottomWidth: 0.5}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.2}}>
              {this._handleRenderImageDetails(item)}
            </View>
            <View style={{flex: 0.3}}>
              {this._handleRenderContactDetails(item)}
            </View>
          </View>
          <View style={{flex: 0.3}}>{this._handleRenderURL(item)}</View>
        </View>
      );
    } else {
      return null;
    }
  };
  _handleHeaderRightIconPress = () => {
    try {
      Share.share({
        title: 'CHECK OUT THIS COOL NEW APP - NOBHUB',
        message:
          this.state.URL +
          '\n' +
          '\n' +
          'Hey! Download this awesome app from the Google Play Store/Apple App Store. You can install NobHub here: ' +
          '\n' +
          PlayStoreLink.android,
      })
        .then(() => {})
        .catch(errorMsg => Alert.alert(errorMsg));
    } catch (e) {
      Alert.alert(e);
    }
  };
  render() {
    const {ShareData} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: '#f4f6f9'}}>
        <View style={{flex: 0.16}}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => this._handleHeaderRightIcon()}
            HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
            HeaderLeftIconPress={this._handleHeaderLeftIconPress}
            HeaderRightIconPress={this._handleHeaderRightIconPress}
            HeaderText={() => this._handleHeaderText()}
            HeaderProfileIcon={() => this._handleHeaderProfileIcon()}
          />
        </View>
        <View style={{flex: 1}}>
          <View style={{flex: 0.5}}>
            <Text>
              Note: If you are not seeing all the selected people here, it means
              they haven't gave their consent. Delete this message before you
              share link.
            </Text>
          </View>
          <View style={{flex: 2, marginTop: 10}}>
            <FlatList
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps={'always'}
              keyboardDismissMode={'interactive'}
              data={ShareData}
              renderItem={item => this._handleRenderItem(item)}
            />
          </View>
          <View style={{flex: 1}}>
            <Text>
              Note: The above link will expire in 48 Hours, please install
              NobHub mobile application and connect for an ever lasting
              relationship! Down load from the below link.
            </Text>
          </View>
          <View>
            <Text>Hey! Download this awesome app from ...</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
            <View style={{flex: 1}} />
            {Platform.OS == 'android' ? (
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  borderWidth: 1,
                  borderRadius: 15,
                }}>
                <GooglePlay />
                <View>
                  <Text style={{color: '#000', fontSize: 13}}>Rate us on</Text>
                  <BoldText style={{color: '#000'}}>Google play</BoldText>
                </View>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  borderWidth: 1,
                  borderRadius: 15,
                }}>
                <Appstore />
                <View>
                  <Text style={{color: '#000', fontSize: 13}}>Rate us on</Text>
                  <BoldText style={{color: '#000'}}> App store</BoldText>
                </View>
              </View>
            )}
            <View style={{flex: 1}} />
          </View>
        </View>
      </View>
    );
  }
}
// const mapDispatchToProps = {
//   handleGoBack: goBack,
// };
// export default connect(
//   null,
//   mapDispatchToProps,
// )(ShareBusinessCard);
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
  fab: {
    flexDirection: 'column',
    height: 55,
    width: 55,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: CommonStyles.appColor,
  },
  viewContactDetails: {
    flex: 3,
    //flexDirection: 'column',
    //marginBottom: 8,
  },
  textName: {
    color: GilRoyMediumColor.fontColor,
    fontSize: 16,
    paddingBottom: 5,
  },
  textDesignation: {
    color: GilRoyRegularColor.fontColor,
    fontSize: 12,
    paddingBottom: 5,
  },
});
