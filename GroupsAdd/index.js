import React, {Component} from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Keyboard,
  Platform,
} from 'react-native';
import CommonHeader from '../shared/CommonHeader';
import {goBack} from '../Services/BackButtonServices';
import {connect} from 'react-redux';
import ServiceCalls from '../Services/APICalls';
import {Actions} from 'react-native-router-flux';
import {Thumbnail} from 'native-base';
import {
  CommonStyles,
  GilRoyMediumColor,
  LightGrayColor,
} from '../shared/Constants';
import {AlertClass} from '../shared/CustomAlert';
import {grpstyles} from '../Groups/GroupsStyles';
//import {Liststyles} from './Listcommonstyles';
import {
  Delete,
  Chatting,
  Search,
  ArrowLeft,
  CircleCheck,
  Cancel,
  X,
  Addpeople,
} from '../shared/Icon';
import {Text, MediumBoldText, BoldText} from '../shared/Text';
import {_} from 'lodash';
const colors= [
  '#27BECF','#994F14','#DA291C','#FFCD00','#007A33','#EB9CA8', '#7C878E',
  '#8A004F','#000000','#10069F','#00a3e0','#4CC1A1'
]
class GroupsIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      GroupName: '',
      GrpId: '',
      PeopleInGroup: [],
      IsShow: false,
      SeletedPeopleList: [],
      tempPeopleInGroup: [],
      surewantToDelete: false,
      SearchText: '',
      IsCancel: false,
      SearchCount: '',
      ShownoOfRes: false,
      showalert: false,
      DisplayText: '',
      selectedpeopleObj: [],
    };
    global.GrpPeople = this;
    this.searchTextInput = React.createRef();
  }
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
        <ArrowLeft style={{color: '#27BECF', fontSize: 20}} />
      </View>
    );
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
          <Addpeople style={{color: '#27BECF'}} />
        </View>
        <Text style={{color: '#ffffff', textAlign: 'center', fontSize: 10}}>
          Add People
        </Text>
      </View>
    );
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
            placeholder="Name/Phone Number"
            placeholderTextColor={'#a9a9a9'}
            onChangeText={value => this._handleMyContactSearch(value)}
            value={this.state.SearchText}
            onFocus={() => this._handleOnTextInputFocus()}
            onKeyPress={({nativeEvent}) => {
              this._handleOnkeyPress(nativeEvent);
              //nativeEvent.key === 'Backspace' ? Keyboard.dismiss() : '';
            }}
            style={{flex:1, fontSize:13}}
          />
          <View>
            <View
              style={{
               // flex: 0.1,
                marginTop: 10,
               // right: Platform.OS == 'android' ? 3 : 20,
               left:5,
                alignSelf:"flex-end"
              }}>
              {this.state.IsCancel ? (
                <TouchableOpacity onPress={() => this._handleOnClearPress()}>
                  <X style={{color: '#a9a9a9', fontSize: 18}} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    );
  };
  _handleOnkeyPress = Element => {
    if (Element.key === 'Backspace') {
      if (this.state.SearchText.length == 0) {
        Keyboard.dismiss();
      }
    }
  };
  _handleOnTextInputFocus = () => {
    this.setState({IsCancel: true});
  };
  _handleOnClearPress = () => {
    this._handleMyContactSearch('');
    this.searchTextInput.current.blur();
    this.setState({
      SearchText: '',
      IsCancel: false,
      ShownoOfRes: false,
      // peopleInGroup:this.state.tempPeopleInGroup,
      // SearchPlaceHolder: 'Name/Nick/Phone',
    });
  };
  _handleMyContactSearch = value => {
    var searchItems = value
      .trim()
      .toLowerCase()
      .split(' ');
    this.setState({SearchText: value, IsCancel: false, ShownoOfRes: false});
    if (value != '' && value != null) {
      this.setState({ShownoOfRes: true, IsCancel: true});
    }
    value = value.trim().toLowerCase();
    var myContactsData = [];
    this.setState({
      SearchCount: myContactsData.length,
    });
    myContactsData = this.state.tempPeopleInGroup.filter(contact => {
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
      PeopleInGroup: myContactsData,
      SearchCount: myContactsData.length - this.state.SeletedPeopleList.length,
    });
  };
  _handleHeaderLeftIconPress = () => {
    const {handleGoBack} = this.props;
    handleGoBack();
  };
  _handleRightIconPress = () => {
    const {GroupId, GroupName} = this.props;
    Actions.connectedPeople({GroupID: GroupId, GroupName: GroupName});
  };
  handleHeaderText = () => {
    const {GroupName} = this.props;
    return (
      <View>
        <BoldText
          style={{
            color: '#ffff',
            fontSize: 14,
          }}>
          {GroupName}
        </BoldText>
      </View>
    );
  };

  DeleteMember = () => {
    var that = this;
    const {GroupId} = this.props;
    ServiceCalls.DeleteGroupMembers(GroupId, this.state.SeletedPeopleList).then(
      () => {
        this.state.SeletedPeopleList.forEach(function(data) {
          that.setState({
            PeopleInGroup: that.state.PeopleInGroup.filter(list => {
              return list.userId !== data;
            }),
          });
          that.setState({
            tempPeopleInGroup: that.state.tempPeopleInGroup.filter(list => {
              return list.userId !== data;
            }),
          });
        });
        this.setState({IsShow: false, SeletedPeopleList: []});
        this.renderList();
      },
    );

    var Grps = global.Groups.state.GroupDetails;

    Grps.forEach(function(item) {
      if (item.groupId == GroupId) {
        item.groupCount =
          parseInt(item.groupCount) - that.state.SeletedPeopleList.length;
      }
    });

    global.Groups.setState({GroupDetails: Grps});
  };

  getGrpMembersByGroupId = GroupId => {
    ServiceCalls.handleGetGroupMembersById(GroupId).then(response => {
      this.setState({PeopleInGroup: response, tempPeopleInGroup: response});
    });
  };
  componentDidMount = () => {
    const {GroupId} = this.props;
    this.getGrpMembersByGroupId(GroupId);
  };
  _renderContactDetails = item => {
    return (
      <View style={{flex: 3, marginBottom: -15}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 4}}>
            <MediumBoldText>{item.name}</MediumBoldText>
            <Text style={{color: '#a9a9a9', fontSize: 14}}>
              {item.title + ',' + item.companyname}
            </Text>
            <Text>{item.latestMsg}</Text>
            {/* <Text style={{ color:CommonStyles.appColor,fontSize: 12,paddingBottom: 5,}}>{item.connectedStatus}</Text> */}
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
            <View style={grpstyles.CircleView}>
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
    return (
      <View
        style={{
          flex: 1,
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
        {item.check ? (
          <View style={grpstyles.CircleView}>
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
  };
  _handleOnGroupPress = item => {
    if (this.state.IsShow) {
      this.press(item);
    } else {
      // Actions.groupsAdd({
      //   GroupId: item.groupId,
      //   GroupName: item.groupName,
      //   GroupMembeId: item.groupMemberId,
      // });
      // alert('LongPress to select items');
    }
  };
  press = item => {
    var peopleInGroup = this.state.PeopleInGroup;
    peopleInGroup.map(data => {
      if (data.userId === item.userId) {
        data.check = !data.check;
        if (data.check === true) {
         this.state.selectedpeopleObj.push(data);
         this.state.SeletedPeopleList.push(data.userId);
        //  this.setState({
        //   selectedpeopleObj: _.concat(data , this.state.selectedpeopleObj),
        // });
        //  this.setState({
        //   SeletedPeopleList: _.concat(data.userId, this.state.SeletedPeopleList),
        // });
        } else if (data.check === false) {
          const i = this.state.SeletedPeopleList.indexOf(data.userId);
          if (i > -1) {
            this.state.SeletedPeopleList.splice(i, 1);
          }
          // for (var j = 0; j < this.state.selectedpeopleObj.length; j++) {
          //   if (this.state.selectedpeopleObj[i].id === item.id) {
          //     this.state.selectedpeopleObj.splice(i, 1);
          //   }
          // }
          this.setState({
                     //     SeletedPeopleList:this.state.SeletedPeopleList.filter(x=>x.userId !== data.userId),
                         selectedpeopleObj:this.state.selectedpeopleObj.filter(x=>x.userId !== data.userId)})
        }
        console.log("MyPeople",this.state.SeletedPeopleList)
      }
    });
    this.setState({PeopleInGroup: peopleInGroup});
    if (this.state.SeletedPeopleList.length === 0) {
      this.setState({IsShow: false});
    }
  };
  renderList = () => {
    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={this.state.PeopleInGroup}
        keyboardShouldPersistTaps={'always'}
        keyboardDismissMode={'interactive'}
        renderItem={({item,index}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                this._handleOnGroupPress(item);
              }}
              onLongPress={() => this.ShowIconsTabs(item)}>
              <View
                style={{
                  flex: 1,
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
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    );
  };
  ShowIconsTabs = item => {
    // let _groupMemberUserId = this.state.SeletedPeopleList;
    // _groupMemberUserId.push({
    //   SeletedPeopleList: item.userId,
    // });
    // this.setState({SeletedPeopleList: _groupMemberUserId});

    if (!this.state.IsShow) {
      this.press(item);
      this.setState({IsShow: true});
    }
  };
  cancelIconPress = () => {
    var peopleInGroup = this.state.PeopleInGroup;
    peopleInGroup.map(data => {
      if (data.check) {
        data.check = false;
      }
    });
    this.setState({
      PeopleInGroup: peopleInGroup,
      SeletedPeopleList: [],
      IsShow: false,
    });
  };
  DeleteMemberIconPress = () => {
    this.setState({surewantToDelete: true});
  };
  MeetingsIconpress = () => {
    Actions.ScheduleMetting({
      AttendeesFromgrpMembers: this.state.selectedpeopleObj,
      SchedulingMeeting: true,
    });
    var peopleInGroup = this.state.PeopleInGroup;
    peopleInGroup.map(data => {
      if (data.check) {
        data.check = false;
      }
    });
    this.setState({
      PeopleInGroup: peopleInGroup,
      SeletedPeopleList: [],
      IsShow: false,
      selectedpeopleObj: [],
    });
  };
  ChattingIconPress = () => {
    const {GroupId, GroupName} = this.props;
    if (this.state.SeletedPeopleList.length > 1) {
      var Ids = this.state.SeletedPeopleList.join(',');
      Actions.ChatGroups({
        GroupMemberIds: Ids,
        swipeablePanelActive: true,
        isFromGroups:true,
        isFromGroupsGroupId:GroupId,
        isFromGroupsGroupName:GroupName
      });
    } else {
      var ChatPersonName = '';
      var ChatPersonImg = '';
      var initials = '';
      var peopleInGroup = this.state.PeopleInGroup;

      peopleInGroup.map(data => {
        if (data.userId === this.state.SeletedPeopleList[0]) {
          ChatPersonName = data.name;
          ChatPersonImg = data.image;
          initials = data.initials;
        }
      });
      Actions.chattingUI({
        TouserId: this.state.SeletedPeopleList[0],
        GrpORConatctName: ChatPersonName,
        Img: ChatPersonImg,
        ChannelId: 0,
        initials: initials,
      });
    }
  };

  ShowTabs = () => {
    const {IsShow} = this.state;
    if (IsShow) {
      return (
        <View
          style={{
            //flex: 0.25,
            backgroundColor: '#ffff',
            alignItems: 'center',
            borderColor: '#bdbdbd',
            borderWidth: 0.8,
            borderRadius: 30,
            zIndex: 999,
            flexDirection: 'column',
            height: 125,
            marginTop: 50,
            width: 30,
            marginRight: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.ChattingIconPress();
            }}>
            <Chatting
              style={{
                color: LightGrayColor.fontColor,
                marginTop: 5,
                fontSize: 20,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.MeetingsIconpress();
            }}>
            <Image
              style={{height: 20, width: 20, marginTop: 10}}
              source={require('../Images/meetings.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.DeleteMemberIconPress()}>
            <Delete
              style={{
                color: LightGrayColor.fontColor,
                marginTop: 10,
                fontSize: 18,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.cancelIconPress()}>
            <Cancel
              style={{
                color: LightGrayColor.fontColor,
                marginTop: 10,
                fontSize: 20,
              }}
            />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#f4f6f9'}}>
        <View style={{flex: 0.18}}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
            HeaderRightIcon={() => this._handleHeaderRightIcon()}
            HeaderLeftIconPress={this._handleHeaderLeftIconPress}
            HeaderRightIconPress={() => this._handleRightIconPress()}
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
        {this.state.showalert ? (
          <View style={{marginLeft: 20, marginTop: 10}}>
            <Text style={{color: GilRoyMediumColor.fontColor}}>
              {this.state.DisplayText}
            </Text>
          </View>
        ) : null}
        {this.state.ShownoOfRes ? (
          <View>
            <Text
              style={{fontSize: 17, color: CommonStyles.GilRoyRegularColor}}>
              Found Contacts({this.state.SearchCount})
            </Text>
          </View>
        ) : null}
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          {this.state.PeopleInGroup.length == 0 ? (
            <Text style={{color: '#a9a9a9'}}>No People Found</Text>
          ) : null}
        </View>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 2, marginTop: 10}}>{this.renderList()}</View>
          {this.ShowTabs()}
        </View>
        <View>
          <AlertClass
            AlertMessage={'Are you sure you want to delete?'}
            OkButtonText={'Yes'}
            CancelButtonText={'Cancel'}
            showAlert={this.state.surewantToDelete}
            onOkPress={() => {
              this.DeleteMember();
              this.setState({surewantToDelete: false, IsShow: false});
              this.setState({
                showalert: true,
                DisplayText: 'Deleted successfully',
              });
              setTimeout(() => {
                this.setState({
                  DisplayText: '',
                  showalert: false,
                });
              }, 10000);
            }}
            onAlertClose={() => {
              this.setState({surewantToDelete: false, IsShow: false});
              var peopleInGroup = this.state.PeopleInGroup;
              peopleInGroup.map(data => {
                if (data.check) {
                  data.check = false;
                }
              });
              this.setState({
                PeopleInGroup: peopleInGroup,
                SeletedPeopleList: [],
              });
            }}
          />
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {userProfile: state.user.userProfile};
};
const mapDispatchToProps = {
  handleGoBack: goBack,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupsIndex);