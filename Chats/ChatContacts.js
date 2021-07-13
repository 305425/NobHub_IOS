import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {goBack} from '../Services/BackButtonServices';
import CommonHeader from '../shared/CommonHeader';
import Button from '../shared/Button';
import {styles} from './Listcommonstyles';
import {AlertClass} from '../shared/CustomAlert';
import ServiceCalls from '../Services/APICalls';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
} from 'react-native-popup-dialog';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  TextInput,
  Image
} from 'react-native';
import {Thumbnail} from 'native-base';
import {MediumBoldText} from '../shared/Text';
import {X, Search, ArrowLeft, Block, CircleCheck} from '../shared/Icon';
import blockLogo from '../Images/blockIcon.png';
import {
  CommonStyles,
  GilRoyMediumColor,
  GilRoyRegularColor,
} from '../shared/Constants';
const colors= [
  '#27BECF','#994F14','#DA291C','#FFCD00','#007A33','#EB9CA8', '#7C878E',
  '#8A004F','#000000','#10069F','#00a3e0','#4CC1A1','#915520', '#b3d962',
  '#67a8e0', '#c06dde', '#1ec952', '#cc1f36', '#0b615f', '#911c16'
]
class ChatConatacts extends Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      contacts: [],
      YesProfiles: [],
      IsContacts: true,
      UserId: navigation.getParam('UserId', 0),
      GroupName: '',
      IssingleChat: false,
      tempConnectedContacts: [],
      IsCancel: false,
      SearchText: '',
      ShownoOfRes: false,
      SearchCount: '',
      surewantToUnBlock: false,
      BlockedUsrChnlId: 0,
      Touserid: 0,
    };
    this.searchTextInput = React.createRef();
  }
  _handleBackPress = () => {
    const {handleGoBack} = this.props;
    handleGoBack();
  };

  GetContactsToChat() {
    try {
      var dataToSend = {UserId: global.LoginUserId};
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/GetContactsToChat', {
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
            YesProfiles: responseJson,
            tempConnectedContacts: responseJson,
          });
        })
        .catch(error => Alert.alert(error.message));
    } catch (e) {
      Alert.alert(e.message);
    }
  }
  componentDidMount() {
    this.GetContactsToChat();
  }
  _handleHeaderLeftIcon = () => {
    return (
      <View style={styles.arrowBgstyle}>
        <ArrowLeft style={{color: '#27BECF', fontSize: 20}} />
      </View>
    );
  };
  _handleOnTextInputFocus = () => {
    this.setState({IsCancel: true});
  };
  _handleMyContactSearch = value => {
    this.setState({SearchText: value, ShownoOfRes: false, IsCancel: true});
    if (value != '' && value != null) {
      this.setState({ShownoOfRes: true});
    }
    var searchItems = value
      .trim()
      .toLowerCase()
      .split(' ');
    value = value.trim().toLowerCase();
    var ContactsData = [];
    this.setState({
      SearchCount: ContactsData.length,
    });
    ContactsData = this.state.tempConnectedContacts.filter(contact => {
      if (
        searchItems.filter(
          x =>
          //console.log("SearchInput", x)
            (contact.name != null && contact.name.toLowerCase().indexOf(x)===0) ||
            (contact.mobile != null &&
              contact.mobile.toLowerCase().indexOf(x)===0),
        ).length > 0
      ) {
        return true;
      }
    });
    this.setState({
      YesProfiles: ContactsData,
      SearchCount: ContactsData.length,
    });
  };
  _handleOnClearPress = () => {
    this.setState({
      SearchText: '',
      IsCancel: false,
      ShownoOfRes: false,
      YesProfiles: this.state.tempConnectedContacts,
    });
    this.searchTextInput.current.blur();
  };

  _handleHeaderCenterIcon = () => {
    return (
      <View
        style={styles.ChatSearchStyle}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 10,
            flex: 0.1,
          }}>
          <Search style={styles.iconSearch} />
        </View>
        <View style={{flex: 0.8, flexDirection: 'row', height: 38}}>
          <TextInput
            ref={this.searchTextInput}
            underlineColor="transparent"
            placeholder="Name/Phone number"
            placeholderTextColor={'#a9a9a9'}
            onChangeText={value => this._handleMyContactSearch(value)}
            value={this.state.SearchText}
            onFocus={() => this._handleOnTextInputFocus()}
          />
        </View>
        <View
          style={{
            flex: 0.1,
            marginTop: 10,
          }}>
          {this.state.IsCancel ? (
            <TouchableOpacity onPress={() => this._handleOnClearPress()}>
              <X style={{color: '#a9a9a9', fontSize: 18}} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };
  _renderContactDetails = item => {
    return (
      <View style={styles.viewContactDetails}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 2}}>
            <MediumBoldText style={styles.textName}>{item.name}</MediumBoldText>
            <Text style={styles.textDesignation}>
              {item.title + ', ' + item.companyname}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  _renderImageData = (item,index) => {
    if (item.image !== '' && item.image !== null) {
      return (
        <View style={{flexDirection: 'row', position: 'relative'}}>
          <Thumbnail
            medium
            source={{
              uri: global.APIURL + 'uploadimgs/ProfilePictures/' + item.image,
            }}
          />
        </View>
      );
    }
    return (
      <View style={{flexDirection: 'column',
      height: 55,
      width: 55,
      borderRadius: 110,
      justifyContent: 'center',
      backgroundColor:colors[index%colors.length]}}>
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
  _handleHeaderText = () => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <MediumBoldText
          style={{
            color: '#ffff',
            fontSize: 17,
            marginBottom: 10,
            fontWeight: 'bold',
          }}>
          Invite Chat Users
        </MediumBoldText>
      </View>
    );
  };
  alertSureUnblock = (BlockedUsrChnlId, Touserid) => {
    this.setState({
      surewantToUnBlock: true,
      BlockedUsrChnlId: BlockedUsrChnlId,
      TouserId: Touserid,
    });
  };
  ChatConatactsRender = (item,index) => {
    if (!item.isBlocked) {
      return (
        <TouchableOpacity
          onPress={() =>
            Actions.chattingUI({
              ChannelId: 0,
              TouserId: item.userId,
              GrpORConatctName: item.name,
              Img: item.image,
              initials: item.initials,
              IsFavoriteContact: false,
              isBlocked: false,
            })
          }>
          <View style={styles.viewContactContainer}>
            <View style={[styles.viewContact]}>
              <View style={styles.viewFabContainer}>
                {this._renderImageData(item,index)}
              </View>
              {this._renderContactDetails(item)}
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this.alertSureUnblock(item.channelid, item.userId)}>
          <View style={styles.viewContactContainer}>
            <View style={[styles.viewContact]}>
              <View style={styles.viewFabContainer}>
                {this._renderImageData(item,index)}
                {/* <View
                  style={{
                    position: 'absolute',
                    top: 5,
                    borderRadius: 50,
                    left: 60,
                    backgroundColor: 'gray',
                  }}>
                  <Block style={{color: '#ffffff', fontSize: 13}} />
                </View> */}
                 <View style={{position:"absolute", left :52, bottom:35}}>
            <Image source={blockLogo} style={{ height:27, width:27}} />
        </View>
              </View>
              {this._renderContactDetails(item)}
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };
  AlertClose = () => {
    this.setState({surewantToUnBlock: false});
  };
  sureunblock = () => {
    try {
      ServiceCalls.BlockORUnBlock(
        this.state.BlockedUsrChnlId,
        this.state.Touserid,
      )
        .then(response => {
          var contacts = this.state.YesProfiles;
          contacts.forEach(element => {
            if (element.channelid == this.state.BlockedUsrChnlId) {
              element.isBlocked = !element.isBlocked;
            }
          });
          var object = global.chats.state.FavContactsList;
          var Recenthistory = global.chats.state.YesProfiles;
          object.forEach(element => {
            if (element.channelId == this.state.BlockedUsrChnlId) {
              element.isBlocked = !element.isBlocked;
            }
            return object;
          });
          Recenthistory.forEach(element => {
            if (element.channelId == this.state.BlockedUsrChnlId) {
              element.isBlocked = !element.isBlocked;
            }
            return object;
          });
          global.chats.setState({
            FavContactsList: object,
            YesProfiles: Recenthistory,
          });
          this.setState({
            YesProfiles: contacts,
            surewantToUnBlock: false,
          });
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  render() {
    return (
      <View style={{backgroundColor: '#f4f6f9', flex: 1}}>
        <View style={{flex: 0.17}}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => {
              return null;
            }}
            HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
            HeaderLeftIconPress={this._handleBackPress}
            HeaderProfileIcon={() => {
              return null;
            }}
            HeaderProfileIconPress={() => {
              return null;
            }}
            HeaderText={() => this._handleHeaderText()}
            IsShowTextForTabs={false}
          />
        </View>
        {this.state.ShownoOfRes ? (
          <View>
            <Text
              style={{
                fontSize: 17,
                color: GilRoyMediumColor.fontColor,
                marginBottom: 15,
              }}>
              Found Contacts({this.state.SearchCount})
            </Text>
          </View>
        ) : null}
        <View style={{flex: 1, marginTop: 5}}>
          <FlatList
            data={this.state.YesProfiles}
            keyboardShouldPersistTaps={'always'}
            keyboardDismissMode={'interactive'}
            renderItem={({item,index}) => this.ChatConatactsRender(item,index)}
          />
        </View>
        <Dialog
          onTouchOutside={this._handleOnClose}
          onHardwareBackPress={this._handleOnClose}
          onDismiss={() => {
            this.setState({surewantToUnBlock: false});
          }}
          width={0.9}
          height={0.37}
          visible={this.state.surewantToUnBlock}
          rounded
          actionsBordered
          dialogTitle={
            <DialogTitle
              titleAlign={'center'}
              style={{borderBottomWidth: 1}}
              title="Unblock Person"
              textStyle={{}}
              hasTitleBar={true}
              align="center"
            />
          }
          footer={
            <DialogFooter style={{borderColor: '#ffffff'}}>
              <DialogButton
                text="No"
                style={styles.DialogYesORNo}
                textStyle={{color: 'white', fontSize: 18, fontWeight: 'bold'}}
                onPress={() => {
                  this.AlertClose();
                }}
                key="button-1"
              />
              <DialogButton
                text={'Yes'}
                style={styles.DialogYesORNo}
                textStyle={{color: 'white', fontSize: 18, fontWeight: 'bold'}}
                onPress={() => {
                  this.sureunblock();
                }}
                key="button-2"
              />
            </DialogFooter>
          }>
          <DialogContent style={{height: 90}}>
            <Text style={{fontSize: 18, marginTop: 10}}>
              are you sure you want to unblock person
            </Text>
          </DialogContent>
        </Dialog>
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
)(ChatConatacts);
