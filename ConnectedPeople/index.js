import React, {Component} from 'react';
import {
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Image
} from 'react-native';
import CommonHeader from '../shared/CommonHeader';
import {goBack} from '../Services/BackButtonServices';
import {connect} from 'react-redux';
import ServiceCalls from '../Services/APICalls';
import {grpstyles} from '../Groups/GroupsStyles';
import {
  Search,
  PlusCircle,
  ArrowLeft,
  X,
  Pluscircleo,
  Closecircle,
} from '../shared/Icon';
import {styles} from '../Home/Home.styles';
import {Thumbnail} from 'native-base';
import moment from 'moment';
import {Text, MediumBoldText, BoldText} from '../shared/Text';
import {AlertClass} from '../shared/CustomAlert';
import {CommonStyles, GilRoyRegularColor} from '../shared/Constants';
import {
  setMyConnectionDetails,
  clearMyConnectionDetails,
} from '../state/operations';
import crossLogo from '../Images/cross.png';
import {_} from 'lodash';
const colors= [
  '#27BECF','#994F14','#DA291C','#FFCD00','#007A33','#EB9CA8', '#7C878E',
  '#8A004F','#000000','#10069F','#00a3e0','#4CC1A1','#915520', '#b3d962',
  '#67a8e0', '#c06dde', '#1ec952', '#cc1f36', '#0b615f', '#911c16'
]
class ContactconnectedPeople extends Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultAnimationDialog: false,
      GroupName: '',
      GroupDetails: [],
      selectedList: [],
      ConnectedContacts: [],
      tempConnectedContacts: [],
      SearchText: '',
      IsCancel: false,
      SearchCount: '',
      ShownoOfRes: false,
      addIconGrayColor: true,
      addIconTealColor: false,
      CancelViewShow: false,
      AddPeopleList: [],
      IsShowAlertAlreadySelected: false,
    };
    this.searchTextInput = React.createRef();
  }
  _handleHeaderLeftIcon = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
          height: 35,
          width: 35,
          borderRadius: 80,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: '#ffffff',
        }}>
        <ArrowLeft style={{color: '#27BECF', fontSize: 20}} />
      </View>
    );
  };
  _handleHeaderLeftIconPress = () => {
    const {handleGoBack} = this.props;
    handleGoBack();
  };
  _handleHeaderCenterIcon = () => {
    return (
      <View style={grpstyles.GrpSearchStyle}>
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
            ref={this.searchTextInput}
            underlineColor="transparent"
            placeholder="Name/Phone Number"
            placeholderTextColor={'#a9a9a9'}
            onChangeText={value => this._handleMyContactSearch(value)}
            value={this.state.SearchText}
            onFocus={() => this._handleOnTextInputFocus()}
            style={{flex:1, fontSize:13}}
          />
          <View>
            <View
              style={{
                marginTop: 10,
               // flex: 0.1,
              //  right: Platform.OS == 'android' ? 10 : 20,
              left:5,
                alignSelf:"flex-end"
              }}>
              {this.state.IsCancel ? (
                <TouchableOpacity onPress={() => this._handleOnClearPress()}>
                  <X style={{color: 'gray', fontSize: 18}} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    );
  };
  _handleOnTextInputFocus = () => {
    this.setState({IsCancel: true});
  };
  _handleOnClearPress = () => {
    this._handleMyContactSearch('');
    this.searchTextInput.current.blur();
    this.setState({SearchText: '', IsCancel: false, ShownoOfRes: false});
  };
  _handleHeaderRightIcon = () => {
    return (
      <View>
        {this.state.addIconGrayColor ? (
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
            <TouchableOpacity>
              <PlusCircle style={{color: '#a9a9a9', fontSize: 37}} />
            </TouchableOpacity>
          </View>
        ) : null}
        {this.state.addIconTealColor ? (
          <View
            style={{
              flexDirection: 'column',
              height: 35,
              width: 35,
              borderRadius: 80,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: '#ffffff',
            }}>
            <TouchableOpacity
              onPress={() => this._handleHeaderRightIconPress()}>
              <Pluscircleo
                style={{color: CommonStyles.appColor, fontSize: 37}}
              />
            </TouchableOpacity>
          </View>
        ) : null}
        <Text style={{color: '#ffffff', fontSize: 10, textAlign: 'center'}}>
          Add People
        </Text>
      </View>
    );
  };
  handleHeaderText = () => {
    const {GroupName} = this.props;
    return (
      <View>
        <BoldText
          style={{
            fontSize: 14,
            color: '#ffffff',
          }}>
          Add Connection to {GroupName}
        </BoldText>
      </View>
    );
  };
  _handleMyContactSearch = value => {
    var searchItems = value
      .trim()
      .toLowerCase()
      .split(' ');
    this.setState({SearchText: value, IsCancel: false});
    this.setState({ShownoOfRes: false});
    if (value != '' && value != null) {
      this.setState({ShownoOfRes: true, IsCancel: true});
    }
    value = value.trim().toLowerCase();
    var myContactsData = [];
    this.setState({
      SearchCount: myContactsData.length,
    });
    myContactsData = this.state.tempConnectedContacts.filter(contact => {
      if (
        this.state.selectedList.filter(x => x == contact.userId).length > 0 ||
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
      ConnectedContacts: myContactsData,
      SearchCount: myContactsData.length - this.state.selectedList.length,
    });
  };
  _handleHeaderRightIconPress = () => {
    const {GroupID} = this.props;
    var that = this;
    ServiceCalls.SaveAddtoGroupPeople(GroupID, this.state.selectedList).then(
      () => {
        var tempList = global.GrpPeople.state.PeopleInGroup;
        that.state.ConnectedContacts.forEach(function(item) {
          if (
            that.state.selectedList.filter(x => x == item.userId).length > 0
          ) {
            var dataobj = {
              userId: item.userId,
              name: item.name,
              title: item.title,
              connectedStatus: item.connectedStatus,
              companyname: item.companyname,
              image: item.image,
              initials: item.initials,
              mobile: item.mobile,
            };
            tempList.unshift(dataobj);
          }
        });

        global.GrpPeople.setState({PeopleInGroup: tempList});

        var Grps = global.Groups.state.GroupDetails;

        Grps.forEach(function(item) {
          if (item.groupId == GroupID) {
            item.groupCount =
              parseInt(item.groupCount) + that.state.selectedList.length;
          }
        });

        global.Groups.setState({GroupDetails: Grps});

        that._handleHeaderLeftIconPress();
        //  Actions.groupsAdd({
        //   GroupId: GroupID,
        //   GroupName: GroupName,
        // });
      },
    );
  };

  componentDidMount() {
    const {GroupID} = this.props;
    this.GetConnectedProfiles(GroupID);
  }
  GetConnectedProfiles(GroupID) {
    try {
      var dataToSend = {UserId: global.LoginUserId, GroupId: GroupID};
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/GetContactsToAddinGroup', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          for (let i = 0; i < responseJson.length; i++) {
            var status = this.calculateDateDiff(responseJson[i].acceptedDate);
            responseJson[i].connectedStatus = status;
          }
          this.setState({
            ConnectedContacts: responseJson,
            tempConnectedContacts: responseJson,
          });
        })
        .catch(error => Alert.alert(error));
    } catch (e) {
      //     .then(response => response.json())
      //     .then(responseJson => {
      //       this.setState({
      //         ConnectedContacts: responseJson,
      //         tempConnectedContacts: responseJson,
      //       });
      //     });
      // }
      Alert.alert(e);
    }
  }
  calculateDateDiff(InvitedDate) {
    if (InvitedDate == null) {
      return '';
    } else {
      const CurrentDate = moment.utc();
      const _acceptedDate = moment.utc(InvitedDate);
      var dateDiffInYears = _acceptedDate.diff(CurrentDate, 'years').toString();
      var dateDiffInMonths = _acceptedDate
        .diff(CurrentDate, 'months')
        .toString();
      var dateDiffInDays = _acceptedDate.diff(CurrentDate, 'days').toString();
      var dateDiffInHours = _acceptedDate.diff(CurrentDate, 'hour').toString();
      dateDiffInDays = dateDiffInDays.replace(/-/g, '');
      dateDiffInYears = dateDiffInYears.replace(/-/g, '');
      dateDiffInMonths = dateDiffInMonths.replace(/-/g, '');
      dateDiffInHours = dateDiffInHours.replace(/-/g, '');
      if (dateDiffInYears == 0) {
        if (dateDiffInMonths == 0) {
          if (dateDiffInDays == 0) {
            if (dateDiffInHours != 0) {
              return dateDiffInHours + ' hour ago';
            }
          } else {
            if (dateDiffInDays >= 1 && dateDiffInDays < 7) {
              return dateDiffInDays + 'days ago';
            } else if (dateDiffInDays >= 7 && dateDiffInDays < 14) {
              return ' week ago';
            } else if (dateDiffInDays >= 14 && dateDiffInDays < 21) {
              return ' weeks ago';
            } else if (dateDiffInDays >= 21 && dateDiffInDays < 28) {
              return ' weeks ago';
            } else if (dateDiffInDays >= 28) {
              return ' 4 weeks ago';
            }
          }
        } else {
          return dateDiffInMonths + ' month ago';
        }
      } else {
        return dateDiffInYears + ' year ago';
      }
    }
  }

  _renderImageData = (item,index) => {
    if (item.image !== '' && item.image !== null) {
      return (
        <View style={{flexDirection: 'row', position: 'relative', flex: 1}}>
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
      <View
        style={{
          flexDirection: 'column',
          height: 55,
          width: 55,
          borderRadius: 110,
          justifyContent: 'center',
          backgroundColor: colors[index%colors.length],
          // marginBottom: 2,
        }}>
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
  _renderContactDetails = item => {
    return (
      <View style={{flex: 4}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 3}}>
            <MediumBoldText style={styles.textName}>{item.name}</MediumBoldText>
            <Text
              style={{
                color: GilRoyRegularColor.fontColor,
                fontSize: 12,
                paddingBottom: 5,
              }}>
              {item.title + ',' + item.companyname}
            </Text>
            <Text
              style={{
                color: GilRoyRegularColor.fontColor,
                fontSize: 12,
                paddingBottom: 5,
              }}>
              Connected {item.connectedStatus}
            </Text>
            {/* <Text style={styles.textNameteal}>{item.connectedStatus}</Text> */}
          </View>
        </View>
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
                style={{
                  backgroundColor: '#ffffff',
                  height: 55,
                  width: 55,
                  borderRadius: 110,
                }}
                source={{
                  uri:
                    global.APIURL + 'uploadimgs/ProfilePictures/' + item.image,
                }}
              />
              <View style={{position:"absolute",left:38}}>
            <TouchableOpacity
              onPress={() => this._handleUnselectContact(item)}>
              {/* <Closecircle /> */}
              <Image source={crossLogo} style={{ height:25, width:25}} />
            </TouchableOpacity>
            </View>
              <Text style={{fontSize: 14}}>
                {item.name.length > 5
                  ? item.name.substring(0, 5) + '...'
                  : item.name}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{flexDirection: 'row', position: 'relative'}}>
          <TouchableOpacity onPress={() => this._handleUnselectContact(item)}>
            <View
              style={{
                flexDirection: 'column',
                height: 55,
                width: 55,
                borderRadius: 110,
                justifyContent: 'center',
                backgroundColor: colors[index%colors.length],
              }}>
              <MediumBoldText
                style={{
                  fontSize: 26,
                  color: '#ffffff',
                  textAlign: 'center',
                }}>
                {item.initials}
              </MediumBoldText>
              <View style={{position:"absolute", left:38}}>
            <TouchableOpacity
              onPress={() => this._handleUnselectContact(item)}>
              {/* <Closecircle /> */}
              <Image source={crossLogo} style={{ height:25, width:25, bottom:15}} />
            </TouchableOpacity>
            </View>
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
  DisplayList = () => {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={this.state.ConnectedContacts}
        keyExtractor={item => item.userId}
        extraData={this.state}
        renderItem={({item,index}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                this._handleSelectContact(item);
              }}>
              <View
                style={{
                  flex: 1,
                  //backgroundColor: '#ffff',
                  // height: 70,
                  marginLeft: 8,
                  marginRight: 8,
                  marginBottom: 10,
                  borderBottomWidth: 0.5,
                  borderColor: '#e0e0e0',
                }}>
                <View
                  style={{
                    flex: 2,
                    alignSelf: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginBottom: 10,
                  }}>
                  <View style={{marginRight: 10}}>
                    {this._renderImageData(item,index)}
                  </View>
                  {this._renderContactDetails(item)}
                  {/* {this.state.CancelViewShow?
                    <View>
                      <TouchableOpacity onPress={()=>{cancelFlatlistIcon() }}>
                      <Cancel style={{color:CommonStyles.appColor,fontSize:40}}/>
                      </TouchableOpacity>
                    </View>:null} */}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  _handleSelectContact = item => {
    console.log("SelectedItem",item)
    const userIndex = this.state.selectedList.indexOf(item.userId);
    if (this.state.AddPeopleList.filter(data => data.userId === item.userId).length > 0) {
      this.setState({IsShowAlertAlreadySelected: true});
    } else {
      this.press(item, true);
    }
  };
  _handleUnselectContact = item => {
    console.log("UnSelectedItem",item)
    this.press(item, false);
  };
  press = (data, Isselected) => {
    var selectedPeoplesList = this.state.selectedList;
    this.state.ConnectedContacts.map(item => {
      if (item.userId === data.userId) {
        if (Isselected === true) {
          selectedPeoplesList.push(item.userId);
          this.state.AddPeopleList.push({
            userId: item.userId,
            name: item.name,
            image: item.image,
            initials: item.initials,
          });
          // this.setState({
          //   AddPeopleList: _.concat({
          //       userId: item.userId,
          //       name: item.name,
          //       image: item.image,
          //       initials: item.initials,
          //     } , this.state.AddPeopleList),
          // });
          this.setState({addIconTealColor: true, addIconGrayColor: false});
        } else if (Isselected === false) {
          const i = selectedPeoplesList.indexOf(item.userId);
          console.log("ID",data)
         // this.setState({AddPeopleList:this.state.AddPeopleList.filter(x=>x.userId !== data.userId)})
          if (i > -1) {
            selectedPeoplesList.splice(i, 1);
            this.state.AddPeopleList.splice(i, 1);
          }
        }
        return true;
      }
    });

    this.setState({selectedList: selectedPeoplesList});
    if (this.state.selectedList.length === 0) {
      this.setState({addIconTealColor: false, addIconGrayColor: true});
    }
  };

  render() {
    return (
      <View style={{backgroundColor: '#f4f6f9', flex: 1}}>
        <View style={{flex: 0.18}}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
            HeaderRightIcon={() => this._handleHeaderRightIcon()}
            HeaderLeftIconPress={this._handleHeaderLeftIconPress}
            HeaderRightIconPress={() => {
              return null;
            }}
            HeaderText={() => this.handleHeaderText()}
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
            <Text style={{fontSize: 17}}>
              Found Contacts({this.state.SearchCount})
            </Text>
          </View>
        ) : null}
        <View style={{justifyContent: 'center', alignItems: 'center', top: 5}}>
          {this.state.ConnectedContacts.length == 0 ? (
            <Text style={{color: '#a9a9a9'}}>No Result Found</Text>
          ) : null}
        </View>

        <View
          style={{
            borderBottomColor: 'lightgray',
            marginBottom: 10,
            marginTop: 10,
          }}>
          <FlatList
            horizontal
            data={this.state.AddPeopleList}
            keyboardShouldPersistTaps={'always'}
            keyboardDismissMode={'interactive'}
            renderItem={({item,index}) => (
              <View
                style={{
                  marginLeft: 8,
                  marginRight: 8,
                  marginBottom: 10,
                  borderBottomColor: 'lightgray',
                }}>
                {this._renderContactImage(item,index)}
              </View>
            )}
          />
        </View>

        <View style={{flex: 1}}>{this.DisplayList()}</View>
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

export const {width, height} = Dimensions.get('window');
const mapStateToProps = state => {
  return {
    userProfile: state.user.userProfile,
    myConnectionDetails: state.MyConnections.myConnectionDetails,
  };
};
const mapDispatchToProps = {
  handleGoBack: goBack,
  setMyConnectionDetails,
  clearMyConnectionDetails,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactconnectedPeople);
