import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {goBack} from '../Services/BackButtonServices';
import CommonHeader from '../shared/CommonHeader';
import {Text, BoldText} from '../shared/Text';
import Button from '../shared/Button';
import {styles} from './Listcommonstyles';
import {View, FlatList, TouchableOpacity, Alert, TextInput, Image} from 'react-native';
import {Thumbnail} from 'native-base';
import {Search, CircleCheck, ArrowLeft, X, Closecircle} from '../shared/Icon';
import {MediumBoldText} from '../shared/Text';
import {AlertClass} from '../shared/CustomAlert';
import {
  CommonStyles,
  GilRoyMediumColor,
  GilRoyRegularColor,
} from '../shared/Constants';
import crossLogo from '../Images/cross.png';
import {_} from 'lodash';
import axios from 'axios';
const colors= [
  '#27BECF','#994F14','#DA291C','#FFCD00','#007A33','#EB9CA8', '#7C878E',
  '#8A004F','#000000','#10069F','#00a3e0','#4CC1A1','#915520', '#b3d962',
  '#67a8e0', '#c06dde', '#1ec952', '#cc1f36', '#0b615f', '#911c16'
]
class ChatConatacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ContactsList: [],
      tempConnectedContacts: [],
      selectedUserIds: [],
      SearchText: '',
      IsCancel: false,
      ShownoOfRes: false,
      AddPeopleList: [],
      IsShowAlertAlreadySelected: false,
      SearchCount:'',
    };
    global.groupchatContacts = this;
  }

  _handleBackPress = () => {
    const {handleGoBack} = this.props;
    handleGoBack();
  };

  GetContactsToAddInChatGrp() {
    const {ChannelId} = this.props;
    try {
      var dataToSend = {UserId: global.LoginUserId, ChannelId: ChannelId};
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/GetContactsToAddInChatGrp', {
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
            ContactsList: responseJson,
            tempConnectedContacts: responseJson,
          });
        })
        .catch(error => Alert.alert(error));
    } catch (e) {
      Alert.alert(e);
    }
  }
  componentDidMount() {
    this.GetContactsToAddInChatGrp();
  }
  _handleHeaderLeftIcon = () => {
    return (
      <View style={styles.arrowBgstyle}>
        <ArrowLeft style={{color: '#27BECF', fontSize: 20}} />
      </View>
    );
  };
  _handleMyContactSearch = value => {
    this.setState({ShownoOfRes: false, IsCancel: false, SearchText: value});
    if (value != '' && value != null) {
      this.setState({ShownoOfRes: true, IsCancel: true});
    }
    var searchItems = value
      .trim()
      .toLowerCase()
      .split(' ');
    value = value.trim().toLowerCase();
    var ContactsData = [];
    ContactsData = this.state.tempConnectedContacts.filter(contact => {
      if (
        searchItems.filter(
          x =>
            (contact.name != null && contact.name.toLowerCase().includes(x)) ||
            (contact.mobile != null &&
              contact.mobile.toLowerCase().includes(x)),
        ).length > 0
      ) {
        return true;
      }
    });
    this.setState({
      ContactsList: ContactsData,
      SearchCount: ContactsData.length,
    });
  };
  ClearYesprofiles = () => {
    this.setState({
      IsCancel: false,
      ContactsList: this.state.tempConnectedContacts,
      SearchText: '',
      ShownoOfRes: false,
      SearchCount: '',
    });
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
          <Search style={{color: '#a9a9a9', fontSize: 20}} />
        </View>
        <View style={{flex: 0.8, flexDirection: 'row', height: 38}}>
          <TextInput
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
            <TouchableOpacity onPress={() => this.ClearYesprofiles()}>
              <X style={{color: '#a9a9a9', fontSize: 18}} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };
  _handleOnTextInputFocus = () => {
    this.setState({IsCancel: true});
  };
  _renderContactDetails = item => {
    return (
      <View style={styles.viewContactDetails}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 2}}>
            <MediumBoldText style={styles.textName}>{item.name}</MediumBoldText>
            <Text style={styles.textDesignation}>
              {item.title + ',' + item.companyname}
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
          {item.check ? (
            <View style={styles.Tickmark}>
              <CircleCheck
                style={{
                  color: CommonStyles.appColor,
                  fontSize: 13,
                  marginTop: 4,
                }}
              />
            </View>
          ) : null}
        </View>
      );
    } else {
      return (
        <View style={{flexDirection: 'column',
        height: 55,
        width: 55,
        borderRadius: 110,
        justifyContent: 'center',
        backgroundColor: colors[index%colors.length]}}>
          <MediumBoldText
            style={{
              fontSize: 26,
              color: '#ffffff',
              textAlign: 'center',
            }}>
            {item.initials}
          </MediumBoldText>
          {item.check ? (
            <View style={styles.Tickmark}>
              <CircleCheck
                style={{
                  color: CommonStyles.appColor,
                  fontSize: 13,
                  marginTop: 4,
                }}
              />
            </View>
          ) : null}
        </View>
      );
    }
  };
  _handleOnContactPress = item => {
    const userIndex = this.state.selectedUserIds.indexOf(item.userId);
    if (userIndex != -1) {
      this.setState({IsShowAlertAlreadySelected: true});
    } else {
      this.selectContact(item, true);
    }
    //this.selectContact(item);
  };
  _handleUnselectContact = item => {
    this.selectContact(item, false);
  };
  _hadleOnContactLongPress = item => {
    const {IsAdmin} = this.props;
    if (IsAdmin) {
      this.selectContact(item, true);
    }
  };
  selectContact = (item, Isselected) => {
    var contactList = this.state.ContactsList;
    var selectedUserIds = this.state.selectedUserIds;
    contactList.map(data => {
      if (data.userId === item.userId) {
        data.check = !data.check;
        if (Isselected === true) {
           selectedUserIds.push(data.userId);
          // this.state.AddPeopleList.push({
          //   userId: data.userId,
          //   name: data.name,
          //   image: data.image,
          //   initials: data.initials,
          // });
          this.setState({
            AddPeopleList: _.concat({
              userId: data.userId,
              name: data.name,
              image: data.image,
              initials: data.initials,
            } , this.state.AddPeopleList),
          //  selectedUserIds: _.concat(data.userId,this.state.selectedUserIds)
          });
        } else if (Isselected === false) {
          var index = selectedUserIds.indexOf(data.userId);
          if (index > -1) {
            selectedUserIds.splice(index, 1);
            this.state.AddPeopleList.splice(this.state.AddPeopleList.findIndex(a => a.userId === item.userId), 1);
          }
        }
      }
    });
    this.setState({
      ContactsList: contactList,
      selectedUserIds: selectedUserIds,
    });
  };
  AddTogroup() {
    var Ids = this.state.selectedUserIds.join(',');
    const {ChannelId, GrpORConatctName, Img, initials, IsAdmin} = this.props;
    try {
      var dataToSend = {
        UserId: global.LoginUserId,
        ChannelId: ChannelId,
        GroupMemberIds: Ids,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      // fetch(global.APIURL + 'api/Card/SaveMembersinChannelGroups', {
      //   method: 'POST', //Request Type
      //   body: formBody, //post body
      //   headers: {
      //     //Header Defination
      //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      //   },
      // })
      //   .then(response => response.text())
      // axios({
      //   method: "post",
      //   url: global.APIURL + 'api/Card/SaveMembersinChannelGroups',
      //   data: formBody,
      // //  headers: {'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8' },
      // })
      axios.post(global.APIURL + 'api/Card/SaveMembersinChannelGroups', formBody)
        .then(response => {
          Actions.groupMembers({
            ChannelId: ChannelId,
            GrpORConatctName: GrpORConatctName,
            Img: Img,
            initials: initials,
            IsAdmin: IsAdmin,
          });
          // that._handleBackPress();
        })
        .catch(error => Alert.alert(error));
    } catch (e) {
      Alert.alert(e);
    }
  }
  _handleHeaderText = () => {
    return (
      <View style={{flex: 1}}>
        <BoldText style={{color: '#ffff', fontSize: 17, textAlign: 'center',marginTop:-5}}>
          Add Members
        </BoldText>
      </View>
    );
  };
  _renderContactImage = (item,index) => {
    if (item.image !== '' && item.image !== null) {
      return (
        <View style={{flexDirection: 'row', position: 'relative'}}>
          <TouchableOpacity onPress={() => this._handleUnselectContact(item)}>
            <View style={{height: 80}}>
              <Thumbnail
                medium
                source={{
                  uri:
                    global.APIURL + 'uploadimgs/ProfilePictures/' + item.image,
                }}
              />
              {/* <View
                style={{
                  position: 'absolute',
                  top: 35,
                  borderRadius: 50,
                  backgroundColor: '#ffffff',
                  left: 45,
                }}>
                <Closecircle style={{color: 'lightgray', fontSize: 16}} />
              </View> */}
              <Image source={crossLogo} style={{ height:25, width:25,flex:1, position:'absolute', alignSelf:"flex-end",left:40}} />
              <Text style={{fontSize: 14}}>
                {item.name.length > 8
                  ? item.name.substring(0, 8) + '...'
                  : item.name}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <TouchableOpacity onPress={() => this._handleUnselectContact(item)}>
            <View style={{flexDirection: 'column',
    height: 55,
    width: 55,
    borderRadius: 110,
    justifyContent: 'center',
    backgroundColor: colors[index%colors.length]}}>
              <MediumBoldText
                style={{
                  fontSize: 26,
                  color: '#ffffff',
                  textAlign: 'center',
                }}>
                {item.initials}
              </MediumBoldText>
              {/* <View
                style={{
                  position: 'absolute',
                  top: 35,
                  borderRadius: 50,
                  backgroundColor: '#ffffff',
                  left: 42,
                }}>
                <Closecircle style={{color: 'lightgray', fontSize: 16}} />
              </View> */}
              <Image source={crossLogo} style={{ height:25, width:25,flex:1, position:'absolute', alignSelf:"flex-end",left:40,top:0}} />
            </View>
            <Text
              style={{
                fontSize: 14,
              }}>
              {item.name.length > 8
                ? item.name.substring(0, 8) + '...'
                : item.name}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };
  render() {
    return (
      <View style={{backgroundColor: '#f4f6f9', flex: 1}}>
        <View style={{flex: 0.2}}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => {
              return null;
            }}
            HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
            HeaderLeftIconPress={this._handleBackPress}
            HeaderText={() => this._handleHeaderText()}
            HeaderProfileIcon={() => {
              return null;
            }}
            HeaderProfileIconPress={() => {
              return null;
            }}
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
        <View
          style={{
            borderBottomColor: 'lightgray',
            marginBottom: 10,
            marginTop: 10,
            marginLeft: 10,
          }}>
          <FlatList
            horizontal
            data={this.state.AddPeopleList}
            renderItem={({item,index}) => (
              <View
                style={{
                  // marginLeft: 10,
                  marginRight: 15,
                  borderBottomColor: 'lightgray',
                }}>
                {this._renderContactImage(item,index)}
              </View>
            )}
          />
        </View>
        <View style={{flex: 1}}>
          <FlatList
            data={this.state.ContactsList}
            keyboardShouldPersistTaps={'always'}
            keyboardDismissMode={'interactive'}
            renderItem={({item,index}) => (
              <TouchableOpacity
                onPress={() => this._handleOnContactPress(item)}
                onLongPress={() => this._hadleOnContactLongPress(item)}>
                <View style={styles.viewContactContainer}>
                  <View style={[styles.viewContact]}>
                    <View style={styles.viewFabContainer}>
                      {this._renderImageData(item,index)}
                    </View>
                    {this._renderContactDetails(item)}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <Button
          touchableOpacity={styles.CreateNeGroupStyle}
          buttonTitle={'Add to Group'}
          onButtonPress={() => this.AddTogroup()}
        />
        <View>
          <AlertClass
            AlertMessage={'You are  already  selected'}
            OkButtonText={'OK'}
            // CancelButtonText={'Cancel'}
            showAlert={this.state.IsShowAlertAlreadySelected}
            onOkPress={() => {
              this.setState({IsShowAlertAlreadySelected: false});
            }}
          />
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
)(ChatConatacts);
