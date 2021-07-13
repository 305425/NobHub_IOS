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
import {
  Circlcheckbox,
  Chatting,
  Search,
  ArrowLeft,
  Delete,
  Edit,
  Cancel,
} from '../shared/Icon';
import {AlertClass} from '../shared/CustomAlert';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
} from 'react-native-popup-dialog';
import {Text, BoldText} from '../shared/Text';
import {
  CommonStyles,
  GilRoyMediumColor,
  LightGrayColor,
} from '../shared/Constants';
import images from '../Images';
import {grpstyles} from './GroupsStyles';

class GroupsIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultAnimationDialog: false,
      defaultAnimationDialogForDelete: false,
      GroupName: '',
      GroupDetails: [],
      GrpId: 0,
      IsCreateOREdit: '',
      IconViews: false,
      DeleteView: false,
      tempGroupDetails: [],
      selectedPeople: [],
      showGroupNameCannotbeEmpty: false,
      showGroupNameAlredyExit: false,
      SearchText: '',
      IsCancel: false,
      SearchPlaceHolder: 'Group Name',
      SearchCount: '',
      ShownoOfRes: false,
      showalert: false,
      DisplayText: '',
      GroupId: 0,
      Gruopcount: 0,
      ConnectedMemberIds: '',
      GroupMemCount: 0,
    };
    global.Groups = this;
    this.searchTextInput = React.createRef();
  }
  _handleOnClose = () => {
    this.setState({defaultAnimationDialog: false});
  };
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
          <Image
            style={{width: 30, height: 30, color: CommonStyles.appColor}}
            source={images.createGroup}
          />
        </View>
        <Text style={{color: '#ffffff', textAlign: 'center', fontSize: 10}}>
          Create Group
        </Text>
      </View>
    );
  };
  onMyContactSearch = value => {
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
    ContactsData = this.state.tempGroupDetails.filter(contact => {
      if (
        searchItems.filter(
          x =>
            contact.groupName != null &&
            contact.groupName.toLowerCase().includes(x),
        ).length > 0
      ) {
        return true;
      }
    });
    this.setState({
      GroupDetails: ContactsData,
      SearchCount: ContactsData.length,
    });
  };
  _handleHeaderCenterIcon = () => {
    return (
      <View style={grpstyles.GrpSearchStyle}>
        <View
          style={{
            flex: 0.4,
            paddingTop: 10,
            marginLeft: 8,
          }}>
          <Search style={{color: '#a9a9a9', fontSize: 20}} />
        </View>
        <View style={{flex: 1.5}}>
          <TextInput
            ref={this.searchTextInput}
            underlineColor="transparent"
            placeholder={this.state.SearchPlaceHolder}
            placeholderTextColor={'#a9a9a9'}
            onChangeText={value => this.onMyContactSearch(value)}
            value={this.state.SearchText}
            style={{flex: 2}}
            onFocus={() => this._handleOnTextInputFocus()}
            onKeyPress={({nativeEvent}) => {
              this._handleOnkeyPress(nativeEvent);
              //nativeEvent.key === 'Backspace' ? Keyboard.dismiss() : '';
            }}
          />
        </View>
        <View
          style={{
            flex: 0.3,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            right: Platform.OS == 'android' ? 10 : 20,
          }}>
          {this.state.IsCancel ? (
            <TouchableOpacity onPress={() => this._handleOnClearPress()}>
              <Cancel style={{color: '#a9a9a9', fontSize: 18}} />
            </TouchableOpacity>
          ) : null}
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
    this.setState({
      SearchText: '',
      IsCancel: false,
      GroupDetails: this.state.tempGroupDetails,
      ShownoOfRes: false,
    });
    this.searchTextInput.current.blur();
  };
  _handleHeaderLeftIconPress = () => {
    const {handleGoBack} = this.props;
    handleGoBack();
  };
  _handleHeaderText = () => {
    return (
      <View>
        <BoldText
          style={{
            color: '#ffffff',
            fontSize: 14,
          }}>
          Groups
        </BoldText>
      </View>
    );
  };
  AddGroupIconClick = () => {
    this.setState({
      GrpId: 0,
      GroupName: '',
      IsCreateOREdit: 'Create',
      SearchText: '',
      IsCancel: false,
      GroupDetails: this.state.tempGroupDetails,
      ConnectedMemberIds: '',
      GroupMemCount: 0,
    });
    this.searchTextInput.current.blur();
    this.setState(prevState => ({
      defaultAnimationDialog: !prevState.defaultAnimationDialog,
    }));
  };
  CreateORUpdateGroups = () => {
    this.setState({IconViews: false, ShownoOfRes: false});
    if (this.state.GroupName.trim() == '' || this.state.GroupName == null) {
      this.setState({showGroupNameCannotbeEmpty: true});
    } else if (
      this.state.GroupDetails.filter(
        x =>
          x.groupName.toLowerCase() == this.state.GroupName.toLowerCase() &&
          this.state.GrpId != x.groupId,
      ).length > 0
    ) {
      this.setState({showGroupNameAlredyExit: true});
    } else {
      this.setState(prevState => ({
        defaultAnimationDialog: !prevState.defaultAnimationDialog,
      }));

      ServiceCalls.handleSaveGroups(
        global.LoginUserId,
        this.state.GroupName,
        this.state.GrpId,
        this.state.ConnectedMemberIds,
      ).then(response => {
        if (this.state.IsCreateOREdit == 'Create') {
          let obj = this.state.GroupDetails;
          obj.unshift({
            groupId: response,
            groupName: this.state.GroupName,
            groupCount: this.state.GroupMemCount,
          });
          this.setState({
            showalert: true,
            DisplayText:
              this.state.GroupName + ' ' + 'group successfully created',
            GroupDetails: obj,
            tempGroupDetails: obj,
          });
          setTimeout(() => {
            this.setState({
              DisplayText: '',
              showalert: false,
            });
          }, 10000);
        } else if (this.state.IsCreateOREdit === 'Edit') {
          var object = this.state.GroupDetails;
          object = object.filter(obj => {
            if (obj.groupId == this.state.GrpId) {
              obj.groupName = this.state.GroupName;
            }
            return obj;
          });
          this.setState({
            showalert: true,
            DisplayText: 'updated successfully',
            ConnectedMemberIds: '',
            GroupDetails: object,
          });
          setTimeout(() => {
            this.setState({
              DisplayText: '',
              showalert: false,
            });
          }, 10000);
        }
        //this.renderList();
      });
    }
  };

  EditGroupsIconPress = () => {
    this.setState({IsCreateOREdit: 'Edit', selectedPeople: []});
    this.setState(prevState => ({
      defaultAnimationDialog: !prevState.defaultAnimationDialog,
    }));
    this.setState({
      GroupDetails: this.state.tempGroupDetails.filter(list => {
        if (this.state.GrpId == list.groupId) {
          list.check !== list.check;
        }
        return list;
      }),
    });
  };
  componentDidMount = () => {
    const {
      userProfile,
      defaultAnimationDialog,
      ConnectedMemberIds,
      ConnectedMemberIdsCount,
      isfromMyConnection
    } = this.props;
    if (defaultAnimationDialog) {
      this.setState({defaultAnimationDialog: true, IsCreateOREdit: 'Create'});
    }
    if (ConnectedMemberIds != undefined || ConnectedMemberIds != null) {
      this.setState({
        ConnectedMemberIds: ConnectedMemberIds,
        GroupMemCount: ConnectedMemberIdsCount,
      });
    }
    const UserId = userProfile.guid;
    ServiceCalls.handleGetUserGroupsCount(UserId).then(response => {
      console.log("GroupUserData",response.length)
      this.setState({GroupDetails: response, tempGroupDetails: response});
    });
  };
  onChangeText = text => {
    this.setState({GroupName: text});
  };
  IsShowTabs = item => {
    if (!this.state.IconViews) {
      this.press(item);
      this.setState({
        IconViews: true,
        GroupName: item.groupName,
        GrpId: item.groupId,
      });
    }
  };
  DeleteMultipleGroups = () => {
    this.setState(prevState => ({
      defaultAnimationDialogForDelete: !prevState.defaultAnimationDialogForDelete,
    }));
    var that = this;
    ServiceCalls.handleDeleteGroups(this.state.selectedPeople).then(() => {
      that.state.selectedPeople.forEach(function(data) {
        that.setState({
          GroupDetails: that.state.GroupDetails.filter(list => {
            return list.groupId !== data;
          }),
        });
        that.setState({
          tempGroupDetails: that.state.tempGroupDetails.filter(list => {
            return list.groupId !== data;
          }),
        });
      });
      this.setState({
        IconViews: false,
        DeleteView: false,
        selectedPeople: [],
        ShownoOfRes: false,
      });
    });
  };
  press = item => {
    var groupDetails = this.state.GroupDetails;
    groupDetails.map(data => {
      if (data.groupId === item.groupId) {
        data.check = !data.check;
        if (data.check === true) {
          this.setState({GroupId: data.groupId, Gruopcount: data.groupCount});
          this.state.selectedPeople.push(data.groupId);
        } else if (data.check === false) {
          const i = this.state.selectedPeople.indexOf(data.groupId);
          if (i !== -1) {
            this.state.selectedPeople.splice(i, 1);
            return this.state.selectedPeople;
          }
        }
      }
    });
    this.setState({GroupDetails: groupDetails});
    if (this.state.selectedPeople.length >= 2) {
      this.setState({DeleteView: false});
    } else if (this.state.selectedPeople.length === 0) {
      this.setState({IconViews: false, DeleteView: false});
    } else {
      this.setState({DeleteView: true});
    }
  };
  _handleOnGroupPress = item => {
    if (this.state.IconViews) {
      this.press(item);
    } else {
      Actions.groupsAdd({
        GroupId: item.groupId,
        GroupName: item.groupName,
        GroupMembeId: item.groupMemberId,
        UserId: item.UserId,
      });
    }
  };
  renderList = () => {
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={this.state.GroupDetails}
          keyboardShouldPersistTaps={'always'}
          keyboardDismissMode={'interactive'}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={{
                  // borderWidth:1,
                  borderBottomWidth: 0.5,
                  borderColor: '#e0e0e0',
                  flexDirection: 'row',
                  marginLeft: 5,
                }}
                onPress={() => this._handleOnGroupPress(item)}
                onLongPress={() => this.IsShowTabs(item)}
                >
                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingVertical: 10,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 0.1}}>
                      {item.check ? (
                        <Circlcheckbox style={{color: '#27BECF'}} />
                      ) : null}
                    </View>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: 20,
                      }}>
                      {item.groupName + ' (' + item.groupCount + ')'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };
  cancelIconPress = () => {
    var groupDetails = this.state.GroupDetails;
    groupDetails.map(data => {
      if (data.check) {
        data.check = false;
      }
    });
    this.setState({
      GroupDetails: groupDetails,
      selectedPeople: [],
      IconViews: false,
      DeleteView: false,
    });
  };
  DeleteMultpleGroupsOk = () => {
    this.setState({IconViews: false, DeleteView: false});
    this.setState(prevState => ({
      defaultAnimationDialogForDelete: !prevState.defaultAnimationDialogForDelete,
    }));
  };
  MeetingsIconpress = () => {
    Actions.ScheduleMetting({
      ConnGrpId: this.state.GroupId,
      SchedulingMeeting: true,
    });
    var groupDetails = this.state.GroupDetails;
    groupDetails.map(data => {
      if (data.check) {
        data.check = false;
      }
    });
    this.setState({
      GroupDetails: groupDetails,
      selectedPeople: [],
      IconViews: false,
      DeleteView: false,
    });
  };
  ChattingIconPress = () => {
    Actions.ChatGroups({
      ConnGrpId: this.state.GroupId,
      swipeablePanelActive: true,
      GroupName: this.state.GroupName,
      GruopMembercount: this.state.Gruopcount,
      isFromGroups: true
    });
  };
  ShowTabs = () => {
    const {IconViews, DeleteView} = this.state;
    if (IconViews) {
      if (DeleteView) {
        return (
          <View style={grpstyles.floatingViewAll}>
            <TouchableOpacity onPress={() => this.EditGroupsIconPress()}>
              <Edit
                style={{
                  color: LightGrayColor.fontColor,
                  marginTop: 5,
                  fontSize: 18,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.MeetingsIconpress()}>
              <Image
                style={{height: 20, width: 20, marginTop: 10}}
                source={require('../Images/meetings.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.ChattingIconPress()}>
              <Chatting
                style={{
                  color: LightGrayColor.fontColor,
                  marginTop: 10,
                  fontSize: 18,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.DeleteMultpleGroupsOk()}>
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
      } else {
        return (
          <View style={grpstyles.DeleteView}>
            <TouchableOpacity onPress={() => this.DeleteMultpleGroupsOk()}>
              <Delete
                style={{
                  color: LightGrayColor.fontColor,
                  fontSize: 18,
                  marginTop: 5,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.cancelIconPress()}>
              <Cancel
                style={{
                  color: LightGrayColor.fontColor,
                  fontSize: 20,
                  marginTop: 10,
                }}
              />
            </TouchableOpacity>
          </View>
        );
      }
    }
  };
  onGroupCancelIconPress = () => {
    if(this.props.isfromMyConnection===true){
    this.setState(prevState => ({
      defaultAnimationDialog: !prevState.defaultAnimationDialog,
      IconViews: false,
    }));
    var groupDetails = this.state.GroupDetails;
    groupDetails.map(data => {
      if (data.check) {
        data.check = false;
      }
    });
    this.setState({
      GroupDetails: groupDetails,
      selectedPeople: [],
    });
    this.props.navigation.goBack()
  }
  else{
    this.setState(prevState => ({
      defaultAnimationDialog: !prevState.defaultAnimationDialog,
      IconViews: false,
    }));
    var groupDetails = this.state.GroupDetails;
    groupDetails.map(data => {
      if (data.check) {
        data.check = false;
      }
    });
    this.setState({
      GroupDetails: groupDetails,
      selectedPeople: [],
    });
  }
  }
  render() {
    return (
      <View style={{backgroundColor: '#f4f6f9', flex: 1}}>
        <View style={{flex: 0.17}}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => this._handleHeaderRightIcon()}
            HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
            HeaderLeftIconPress={this._handleHeaderLeftIconPress}
            HeaderRightIconPress={() => this.AddGroupIconClick()}
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
        {this.state.showalert ? (
          <View style={{marginLeft: 20, marginTop: 10}}>
            <Text style={{color: GilRoyMediumColor.fontColor}}>
              {this.state.DisplayText}
            </Text>
          </View>
        ) : null}
        {this.state.ShownoOfRes ? (
          <View style={{margin: 12}}>
            <Text style={{fontSize: 17}}>
              Found Groups({this.state.SearchCount})
            </Text>
          </View>
        ) : null}

        {this.state.GroupDetails.length == 0 ? (
          <View
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#a9a9a9'}}>No Groups Found</Text>
          </View>
        ) : null}
       
        <View style={{flex: 0.83, flexDirection: 'row'}}>
        {this.renderList()}
         
         <View>{this.ShowTabs()}</View>
        </View>
         <Dialog
          style={{marginBottom: 50}}
          onTouchOutside={this._handleOnClose}
          onHardwareBackPress={this._handleOnClose}
          onDismiss={() => {
            this.setState({defaultAnimationDialog: false});
          }}
          width={0.9}
          height={0.38}
          visible={this.state.defaultAnimationDialog}
          rounded
          actionsBordered
          dialogTitle={
            <DialogTitle
              titleAlign={'center'}
              style={{borderBottomWidth: 1}}
              title={
                this.state.IsCreateOREdit == 'Create'
                  ? 'Create New Group'
                  : 'Edit Group'
              }
              textStyle={{color: 'black'}}
              hasTitleBar={true}
              align="center"
            />
          }
          footer={
            <DialogFooter style={{borderColor: '#fff'}}>
              <DialogButton
                text="Cancel"
                // bordered={1}
                Height={0.3}
                style={{
                  borderRadius: 20,
                  width: 20,
                  borderColor: '#fff',
                  height: 40,
                  margin: 10,
                  marginTop: 35,
                  borderWidth: 1,
                  backgroundColor: CommonStyles.appColor,
                }}
                textStyle={{color: 'white', fontSize: 18, fontWeight: 'bold'}}
                // onPress={() => {
                //   this.setState(prevState => ({
                //     defaultAnimationDialog: !prevState.defaultAnimationDialog,
                //     IconViews: false,
                //   }));
                //   var groupDetails = this.state.GroupDetails;
                //   groupDetails.map(data => {
                //     if (data.check) {
                //       data.check = false;
                //     }
                //   });
                //   this.setState({
                //     GroupDetails: groupDetails,
                //     selectedPeople: [],
                //   });
                // }}
                onPress={() => {
                  this.onGroupCancelIconPress()
                }}
                key="button-1"
              />
              <DialogButton
                text={
                  this.state.IsCreateOREdit == 'Create' ? 'Create' : 'Update'
                }
                style={{
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: '#fff',
                  height: 40,
                  marginTop: 35,
                  margin: 10,
                  backgroundColor: CommonStyles.appColor,
                }}
                textStyle={{color: 'white', fontSize: 18, fontWeight: 'bold'}}
                onPress={() => {
                  this.CreateORUpdateGroups();
                  var groupDetails = this.state.GroupDetails;
                  groupDetails.map(data => {
                    if (data.check) {
                      data.check = false;
                    }
                  });
                  this.setState({
                    GroupDetails: groupDetails,
                    selectedPeople: [],
                  });
                }}
                key="button-2"
              />
            </DialogFooter>
          }>
          <DialogContent
            style={{
              height: 90,
              // backgroundColor: '#fff',
              // borderBottomWidth:0.5,
              // borderColor:'#fff'
            }}>
            <TextInput
              style={{
                flex: 1,
                borderColor: '#a9a9a9',
                borderBottomWidth: 1,
                marginTop: 20,
                fontSize: 18,
              }}
              maxLength={15}
              underlineColor="transparent"
              placeholder="Enter Group Name"
              placeholderTextColor={'#a9a9a9'}
              onChangeText={text => this.onChangeText(text)}
              value={this.state.GroupName}
            />
          </DialogContent>
        </Dialog>
        <Dialog
          onTouchOutside={this._handleOnClose}
          onHardwareBackPress={this._handleOnClose}
          onDismiss={() => {
            this.setState({defaultAnimationDialogForDelete: false});
          }}
          width={0.9}
          height={0.37}
          visible={this.state.defaultAnimationDialogForDelete}
          rounded
          actionsBordered
          dialogTitle={
            <DialogTitle
              titleAlign={'center'}
              style={{borderBottomWidth: 1}}
              title={'Are you sure you want to do that?'}
              textStyle={{}}
              hasTitleBar={true}
              align="center"
            />
          }
          footer={
            <DialogFooter style={{borderColor: '#ffffff'}}>
              <DialogButton
                text="No"
                style={{
                  borderRadius: 20,
                  width: 20,
                  borderColor: '#ffffff',
                  margin: 10,
                  height: 40,
                  marginTop: 35,
                  borderWidth: 1,
                  backgroundColor: CommonStyles.appColor,
                }}
                textStyle={{color: 'white', fontSize: 18, fontWeight: 'bold'}}
                onPress={() => {
                  this.setState(prevState => ({
                    defaultAnimationDialogForDelete: !prevState.defaultAnimationDialogForDelete,
                    IconViews: false,
                  }));
                  var groupDetails = this.state.GroupDetails;
                  groupDetails.map(data => {
                    if (data.check) {
                      data.check = false;
                    }
                  });
                  this.setState({
                    GroupDetails: groupDetails,
                    selectedPeople: [],
                  });
                }}
                key="button-1"
              />
              <DialogButton
                text={'Yes'}
                style={{
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: '#fff',
                  height: 40,
                  marginTop: 35,
                  margin: 10,
                  backgroundColor: CommonStyles.appColor,
                }}
                textStyle={{color: 'white', fontSize: 18, fontWeight: 'bold'}}
                onPress={() => {
                  this.DeleteMultipleGroups();
                  var groupDetails = this.state.GroupDetails;
                  groupDetails.map(data => {
                    if (data.check) {
                      data.check = false;
                    }
                  });
                  this.setState({
                    showalert: true,
                    DisplayText: 'Deleted successfully',
                  });
                  setTimeout(() => {
                    this.setState({
                      DisplayText: '',
                      showalert: false,
                    });
                  }, 5000);
                  this.setState({GroupDetails: groupDetails});
                }}
                key="button-2"
              />
            </DialogFooter>
          }>
          <DialogContent style={{height: 90}}>
            <Text style={{fontSize: 18, marginTop: 10}}>
              Clicking yes will make you to organize the contacts difficult,
              still you want to delete?
            </Text>
          </DialogContent>
        </Dialog>
<View>
<AlertClass
// style={{marginTop:80}}
AlertMessage={'Group name cannot be Empty'}
OkButtonText={'OK'}
// CancelButtonText={'Cancel'}
showAlert={this.state.showGroupNameCannotbeEmpty}
onOkPress={() => {
  this.setState({showGroupNameCannotbeEmpty: false});
  setTimeout(() => {
    this.setState({
      DisplayText: '',
      showalert: false,
    });
  }, 10000);
}}
onAlertClose={() => {
  this.setState({showGroupNameCannotbeEmpty: false});
  var groupDetails = this.state.GroupDetails;
  groupDetails.map(data => {
    if (data.check) {
      data.check = false;
    }
  });
  this.setState({GroupDetails: groupDetails});
}}
Height={120}
/>
<AlertClass
AlertMessage={'Group name already exists'}
OkButtonText={'OK'}
// CancelButtonText={'Cancel'}
showAlert={this.state.showGroupNameAlredyExit}
onOkPress={() => {
  this.setState({showGroupNameAlredyExit: false});
}}
onAlertClose={() => {
  this.setState({showGroupNameAlredyExit: false});
  var groupDetails = this.state.GroupDetails;
  groupDetails.map(data => {
    if (data.check) {
      data.check = false;
    }
  });
  this.setState({GroupDetails: groupDetails});
}}
Height={120}
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
