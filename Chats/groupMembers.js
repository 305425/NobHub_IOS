import React, {Component} from 'react';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {goBack} from '../Services/BackButtonServices';
import CommonHeader from '../shared/CommonHeader';
import {styles} from './Listcommonstyles';
import ServiceCalls from '../Services/APICalls';
import {CommonStyles, GilRoyMediumColor} from '../shared/Constants';
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
  Image,
} from 'react-native';
import Footer from '../shared/Footer';
import {MediumBoldText} from '../shared/Text';
import {Thumbnail} from 'native-base';
import {ArrowLeft, CircleCheck, Delete, Cancel} from '../shared/Icon';
import image from '../Images';
import GroupRightMenu from '../Custom/groupsrightMenu';
const colors= [
  '#27BECF','#994F14','#DA291C','#FFCD00','#007A33','#EB9CA8', '#7C878E',
  '#8A004F','#000000','#10069F','#00a3e0','#4CC1A1','#915520', '#b3d962',
  '#67a8e0', '#c06dde', '#1ec952', '#cc1f36', '#0b615f', '#911c16'
]

class GroupMebers extends Component {
  _menu = null;
  constructor(props) {
    super(props);
    this.state = {
      GrpMembersList: [],
      selectedUserIds: [],
      IsshowDeleteIcon: false,
      checking: false,
      DeleteORExitdialog: false,
      IsDelete: false,
      IsExit: false,
    };
    global.PeopleInnGrp = this;
  }

  _handleBackPress = () => {
    const {handleGoBack} = this.props;
    handleGoBack();
  };
  componentDidMount() {
    const {ChannelId} = this.props;
    try {
      var dataToSend = {
        UserId: global.LoginUserId,
        GroupId: ChannelId,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/GetChatGrpMembers', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({GrpMembersList: responseJson, checking: true});
        });
    } catch (e) {
      Alert.alert(e);
    }
  }
  _handleHeaderLeftIcon = () => {
    return (
      <View style={styles.arrowBgstyle}>
        <ArrowLeft style={{color: '#27BECF', fontSize: 20}} />
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
    }
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
              style={{color: CommonStyles.appColor, fontSize: 13, marginTop: 4}}
            />
          </View>
        ) : null}
      </View>
    );
  };
  _handleOnContactPress = item => {
    if (
      this.state.selectedUserIds.length > 0 &&
      item.userId != global.LoginUserId
    ) {
      this.selectContact(item);
    }
  };
  _hadleOnContactLongPress = item => {
    const {IsAdmin} = this.props;
    if (IsAdmin && item.userId != global.LoginUserId) {
      this.setState({IsshowDeleteIcon: true});
      this.selectContact(item);
    }
  };
  selectContact = item => {
    var GrmMembersList = this.state.GrpMembersList;
    var selectedUserIds = this.state.selectedUserIds;
    GrmMembersList.map(data => {
      if (data.userId === item.userId) {
        data.check = !data.check;
        if (data.check) {
          selectedUserIds.push(data.userId);
        } else {
          var index = selectedUserIds.indexOf(data.groupId);
          console.log("Index",selectedUserIds)
          selectedUserIds.splice(this.state.selectedUserIds.findIndex(a => a === item.userId), 1);
          if (selectedUserIds == 0) {
            this.setState({IsshowDeleteIcon: false});
          }
        }
      }
    });
    this.setState({
      GrpMembersList: GrmMembersList,
      selectedUserIds: selectedUserIds,
    });
  };
  DeleteORExitMembersinGroup = () => {
    const {ChannelId} = this.props;
    if (this.state.IsDelete) {
      var profiles = this.state.GrpMembersList;
            this.state.selectedUserIds.forEach(function(data) {
              profiles = profiles.filter(obj => {
                return obj.userId !== data;
              });
            });
            this.setState({
              GrpMembersList: profiles,
              selectedUserIds: [],
              IsshowDeleteIcon: false,
              DeleteORExitdialog: false,
            });
      console.log("HelloDelete",this.state.selectedUserIds.join(','))
      try {
        var UersIds = this.state.selectedUserIds.join(',');
        ServiceCalls.DeleteMembersinGroup(UersIds, ChannelId)
          .then(response => {
            var profiles = this.state.GrpMembersList;
            this.state.selectedUserIds.forEach(function(data) {
              profiles = profiles.filter(obj => {
                return obj.userId !== data;
              });
            });
            this.setState({
              GrpMembersList: profiles,
              selectedUserIds: [],
              IsshowDeleteIcon: false,
              DeleteORExitdialog: false,
            });
          })
          .catch(error => {
            Alert.alert(error);
          });
      } catch (e) {
        Alert.alert(e);
      }
    } else {
      ServiceCalls.LeaveChannelGroup(ChannelId).then(response => {
        Alert.alert('Succesfully Left');
        Actions.ChatGroups();
        var object = global.grps.state.GroupsList;
        object.forEach(element => {
          if (element.channelId == ChannelId) {
            object.hasLeft = !object.hasLeft;
          }
          return object;
        });
        global.grps.setState({
          GroupsList: object,
        });
        this.setState({
          DeleteORExitdialog: false,
        });
      });
    }
  };
  centerMiddileView() {
    const {GrpORConatctName, Img} = this.props;
    return (
      <View
        style={{
          justifyContent: 'space-around',
          alignSelf: 'center',
          alignItems: 'center',
          textAlign: 'center',
          marginTop:-10
        }}>
        <View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            {Img !== '' && Img !== null ? (
              <Thumbnail
                medium
                source={{
                  uri: global.APIURL + 'uploadimgs/UploadGroupPhotos/' + Img,
                }}
              />
            ) : (
              <Image
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 100,
                  backgroundColor: '#ffffff',
                }}
                source={require('../Images/GrpProfile.png')}
              />
            )}
            <Text style={{fontSize: 17, alignSelf: 'center', color: '#ffffff'}}>
              {GrpORConatctName.length > 16
                ? GrpORConatctName.substring(0, 16) + '...'
                : GrpORConatctName}
            </Text>
          </View>
          </View>
      </View>
    );
  }
  // centerMiddileView() {
  //   const {GrpORConatctName, Img} = this.props;
  //   return (
  //     <View
  //       style={{
  //         flexDirection: 'column',
  //         justifyContent: 'center',
  //         alignSelf: 'center',
  //         alignItems: 'center',
  //       }}>
  //       {Img !== '' && Img !== null ? (
  //         <Thumbnail
  //           medium
  //           source={{
  //             uri: global.APIURL + 'uploadimgs/UploadGroupPhotos/' + Img,
  //           }}
  //         />
  //       ) : (
  //         <Image
  //           style={{
  //             height: 50,
  //             width: 50,
  //             borderRadius: 100,
  //             backgroundColor: '#ffffff',
  //           }}
  //           source={require('../Images/GrpProfile.png')}
  //         />
  //       )}
  //       <Text style={{fontSize: 20, alignSelf: 'center', color: '#ffffff'}}>
  //         {GrpORConatctName.length > 16
  //           ? GrpORConatctName.substring(0, 16) + '...'
  //           : GrpORConatctName}
  //       </Text>
  //     </View>
  //   );
  // }
  GetMembersToAddinGrp = () => {
    const {ChannelId, IsAdmin, GrpORConatctName, initials, Img} = this.props;
    try {
      Actions.GroupChatContacts({
        ChannelId: ChannelId,
        IsAdmin: IsAdmin,
        GrpORConatctName: GrpORConatctName,
        initials: initials,
        Img: Img,
      });
    } catch (e) {
      Alert.alert(e);
    }
  };
  EditGroup = () => {
    const {ChannelId, GrpORConatctName, Img} = this.props;
    try {
      Actions.ChatGroups({
        GroupId: ChannelId,
        ConnGrpId: this.state.GroupId,
        GroupName: GrpORConatctName,
        swipeablePanelActive: true,
        Img: Img,
        GruopMembercount: this.state.Gruopcount,
        GroupIconUrl: global.APIURL + 'uploadimgs/UploadGroupPhotos/' + Img,
      });
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleHeaderRightIcon = () => {
    const {IsAdmin, HasLeft} = this.props;
    return (
      <View style={{alignSelf:"center", left:15}}>
        {!HasLeft ? (
          <GroupRightMenu
            menutext="Menu"
            option1Click={() => {
              this.GetMembersToAddinGrp();
            }}
            option2Click={() => {
              this.EditGroup();
            }}
            option3Click={() => {
              this.ExitDialog();
            }}
            IsAdmin={IsAdmin}
          />
        ) : null}
      </View>
    );
  };
  _handleHeaderLeftIconPress = () => {
    const {
      ChannelId,
      GrpORConatctName,
      Img,
      IsAdmin,
      initials,
      HasLeft,
    } = this.props;
    Actions.GroupChatting({
      ChannelId: ChannelId,
      GrpORConatctName: GrpORConatctName,
      Img: Img,
      IsAdmin: IsAdmin,
      initials: initials,
      HasLeft: HasLeft,
    });
    // const {handleGoBack} = this.props;
    // handleGoBack();
  };
  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };
  IsShowDeleteView = () => {
    if (this.state.IsshowDeleteIcon) {
      return (
        <View
          style={{
            position: 'absolute',
            right: 5,
            height: 65,
            backgroundColor: '#ffffff',
            alignItems: 'center',
            borderRadius: 50,
            flexDirection: 'column',
            marginTop: 80,
            marginRight: 20,
            width: 25,
          }}>
          <TouchableOpacity onPress={() => this.DeleteDialog()}>
            <Delete style={{color: 'gray', marginTop: 8, fontSize: 18}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.AlertClose()}>
            <Cancel style={{color: 'gray', marginTop: 10, fontSize: 20}} />
          </TouchableOpacity>
        </View>
      );
    }
  };
  GrpMembers = (item,index) => {
    const {IsAdmin} = this.props;
    if (IsAdmin) {
      return (
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => this._handleOnContactPress(item)}
          onLongPress={() => this._hadleOnContactLongPress(item)}>
          <View style={styles.viewContactContainer}>
            <View style={styles.viewContact}>
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
        <View style={styles.viewContactContainer}>
          <View style={[styles.viewContact]}>
            <View style={styles.viewFabContainer}>
              {this._renderImageData(item,index)}
            </View>
            {this._renderContactDetails(item)}
          </View>
        </View>
      );
    }
  };
  DeleteDialog = () => {
    this.setState({
      DeleteORExitdialog: true,
      dialogContent: 'are you sure you want to delete the person',
      dialogTitle: 'Delete Member',
      IsDelete: true,
    });
  };
  ExitDialog = () => {
    this.setState({
      DeleteORExitdialog: true,
      dialogContent:
        ' Once you exit  chat group, you will lose your group chat history, pictures and any attached files.',
      dialogTitle: 'Exit chat Group',
      IsExit: true,
    });
  };
  AlertClose = () => {
    var recenthis = this.state.GrpMembersList;
    recenthis.map(data => {
      if (data.check) {
        data.check = false;
      }
    });
    this.setState({
      GrpMembersList: recenthis,
      selectedUserIds: [],
      IsshowDeleteIcon: false,
      DeleteORExitdialog: false,
    });
  };
  render() {
    return (
      <View style={{backgroundColor: '#f4f6f9', flex: 1}}>
        <View style={{flex: 0.14}}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => this._handleHeaderRightIcon()}
            HeaderCenterIcon={() => this.centerMiddileView()}
            HeaderLeftIconPress={this._handleHeaderLeftIconPress}
            HeaderRightIconPress={() => {
              return null;
            }}
            HeaderText={() => {
              return null;
            }}
            HeaderProfileIcon={() => {
              return null;
            }}
            HeaderProfileIconPress={() => {
              return null;
            }}
            IsShowTextForTabs={false}
          />
        </View>
        <View
          style={{
            flex: 0.86,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <FlatList
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps={'always'}
              keyboardDismissMode={'interactive'}
              data={this.state.GrpMembersList}
              renderItem={({item,index}) => this.GrpMembers(item,index)}
            />
        <View>{this.IsShowDeleteView()}</View>
        </View>
        <Dialog
          onTouchOutside={this._handleOnClose}
          onHardwareBackPress={this._handleOnClose}
          onDismiss={() => {
            this.setState({DeleteORExitdialog: false});
          }}
          width={0.9}
          height={0.37}
          visible={this.state.DeleteORExitdialog}
          rounded
          actionsBordered
          dialogTitle={
            <DialogTitle
              titleAlign={'center'}
              style={{borderBottomWidth: 1}}
              title={this.state.dialogTitle}
              hasTitleBar={true}
              align="center"
            />
          }
          footer={
            <DialogFooter style={{borderColor: '#ffffff'}}>
              <DialogButton
                text="Cancel"
                style={styles.DialogYesORNo}
                textStyle={{color: 'white', fontSize: 18, fontWeight: 'bold'}}
                onPress={() => {
                  this.AlertClose();
                }}
                key="button-1"
              />
              <DialogButton
                text={'YES'}
                style={styles.DialogYesORNo}
                textStyle={{color: 'white', fontSize: 18, fontWeight: 'bold'}}
                onPress={() => {
                  this.DeleteORExitMembersinGroup();
                }}
                key="button-2"
              />
            </DialogFooter>
          }>
          <DialogContent style={{height: 90}}>
            <Text style={{fontSize: 18, marginTop: 10}}>
              {this.state.dialogContent}
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
)(GroupMebers);
