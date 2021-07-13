import React, {Component} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
  Text, 
  Alert
} from 'react-native';
import Contact from './Contact';
import {
  Delete,
  EditCard,
  Chatting,
  ShareGroups,
  Cancel,
  BottomGroupIcon,
} from '../Icon';
import {styles} from './Contact.styles';
import {AlertClass} from '../../shared/CustomAlert';
import {Actions} from 'react-native-router-flux';
import ServiceCalls from '../../Services/APICalls';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
} from 'react-native-popup-dialog';
export default class Connections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      NickName: '',
      surewantToDelete: false,
      BlockedChannelId: 0,
      BlockedUserId: 0,
      SelectedItem: {},
    };
  }
 
  _handleContactPress = contactData => {
    const {onContactPress} = this.props;
    onContactPress(contactData);
  };
  _handleOnLongPress = contactData => {
    const {OnLongPress} = this.props;
    this.setState({NickName: contactData.nickName});
    OnLongPress(contactData);
  };
  _renderContact = ({item,index}) => {
    const {onInvitePress} = this.props;
    return (
      <Contact
        contactData={item}
        contactIndex={index}
        onContactPress={contactData => this._handleContactPress(contactData)}
        OnLongPress={contactData => this._handleOnLongPress(contactData)}
        onInvitePress={onInvitePress}
      />
    );
  };
  UnBlock = (item,data) => {
    this.setState({
      surewantToDelete: true,
      BlockedChannelId: item.channelid,
      BlockedUserId: item.touserid,
      SelectedItem: data
    });
  };
  ConfirmUnBlock = () => {
    this.props.onClosePress();
    let item = this.state.SelectedItem;
   // console.log("SelectedItem",item+"  " +this.state.BlockedChannelId+"  " +this.state.BlockedUserId)
    try {
      ServiceCalls.BlockORUnBlock(
        this.state.BlockedChannelId,
        this.state.BlockedUserId,
      )
        .then(() => {
          // this.state.NobHubUsers.forEach(element => {
          //   if (element.userid == this.state.BlockedUserId) {
          //     element.isChatblocked = false;
          //   }
          // });
          // this.setState({NobHubUsers: this.state.NobHubUsers});
          Actions.chattingUI({
            TouserId: item.userId,
            FromUserId: global.LoginUserId,
            GrpORConatctName: item.name,
            Img: item.image,
            ChannelId: 0,
            initials: item.initials,
          });
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  _handleNavigateToChat = () => {
    const {selectedList} = this.props;
    let selectedUserId = selectedList[0].userId;
   // console.log("SelectedConnectionList",selectedList[0].channelDetails.filter(y=>y.touserid === selectedUserId)[0])
   let selectedUser = selectedList[0].channelDetails.filter(y=>y.touserid === selectedUserId)[0];
    var memberids = [];
    selectedList.forEach(element => {
      memberids.push(element.userId);
    });
    var Ids = memberids.join(',');
    if (selectedList[0].nickName != null && selectedList[0].nickName != '') {
      selectedList[0].name = selectedList[0].nickName;
    } else {
      selectedList[0].name =
        selectedList[0].name + ' ' + selectedList[0].lastname;
    }
    if (selectedList.length > 1) {
      Actions.ChatGroups({
        GroupMemberIds: Ids,
        ConnectedMemberIdsCount: selectedList.length,
        swipeablePanelActive: true,
        isFromGroups: true
      });
      this.props.onClosePress();
    } else {
      if(selectedUser && selectedUser !== undefined && selectedUser.isBlocked === true)
      {console.log("This person is blocked")
      this.setState({SelectedItem:selectedUser,
                     BlockedChannelId: selectedUser.channelid,
                     BlockedUserId: selectedUser.touserid})
    this.UnBlock(selectedUser,selectedList[0])
    this.props.onClosePress();}
      else{
      Actions.chattingUI({
        TouserId: selectedList[0].userId,
        FromUserId: global.LoginUserId,
        GrpORConatctName: selectedList[0].name,
        Img: selectedList[0].image,
        ChannelId: 0,
        initials: selectedList[0].initials,
      });
      this.props.onClosePress();
    }
    }
  };
  onChangeText = text => {
    const {OnTextChange} = this.props;
    OnTextChange(text);
  };
  _handleEditPress = () => {
    const {onEditPress} = this.props;
    onEditPress(this.state.NickName);
  };
  ShowTabs = () => {
    const {
      IsShowTabs,
      onClosePress,
      onDeletePress,
      onSharePress,
      OnMeetingPress,
    } = this.props;
    if (IsShowTabs) {
      return (
        <View style={styles.Tabs}>
          <View style={{flex: 0.5, paddingTop: 10}}>
            <TouchableOpacity onPress={() => this._handleEditPress()}>
              <EditCard style={styles.iconColor} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.5}}>
            <TouchableOpacity onPress={() => this._handleNavigateToChat()}>
              <Chatting style={styles.iconColor} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.5}}>
            <TouchableOpacity onPress={OnMeetingPress}>
              <Image
                style={{width: 26, height: 26}}
                source={require('../../Images/meetings.png')}
              />
            </TouchableOpacity>
          </View>
          {/* {IsShowShare ? ( */}
          <View style={{flex: 0.5}}>
            <TouchableOpacity onPress={onSharePress}>
              <ShareGroups style={styles.iconColor} />
            </TouchableOpacity>
          </View>
          {/* ) : null} */}
          <View style={{flex: 0.5}}>
            <TouchableOpacity onPress={onDeletePress}>
              <Delete style={styles.iconColor} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.5}}>
            <TouchableOpacity onPress={onClosePress}>
              <Cancel style={styles.iconColor} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;
  };
  ShowTabsForMultiSelection = () => {
    const {
      IsShowTabsForMultiple,
      onClosePress,
      onDeletePress,
      onSharePress,
      OnNormalGropusPress,
      OnMeetingPress,
    } = this.props;
    if (IsShowTabsForMultiple) {
      return (
        <View style={styles.Tabs}>
          <View style={{flex: 0.5, paddingTop: 10}}>
            <TouchableOpacity onPress={() => this._handleNavigateToChat()}>
              <Chatting style={styles.iconColor} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.5}}>
            <TouchableOpacity onPress={OnNormalGropusPress}>
              <BottomGroupIcon style={styles.iconColor} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.5}}>
            <TouchableOpacity onPress={OnMeetingPress}>
              <Image
                style={{width: 30, height: 30}}
                source={require('../../Images/meetings.png')}
              />
            </TouchableOpacity>
          </View>
          {/* {IsShowShare ? ( */}
          <View style={{flex: 0.4}}>
            <TouchableOpacity onPress={onSharePress}>
              <ShareGroups style={styles.iconColor} />
            </TouchableOpacity>
          </View>
          {/* ) : null} */}
          <View style={{flex: 0.4}}>
            <TouchableOpacity onPress={onDeletePress}>
              <Delete style={styles.iconColor} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.4}}>
            <TouchableOpacity onPress={onClosePress}>
              <Cancel style={styles.iconColor} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;
  };
  render() {
    const {
      MyContacts,
      IsShowTabs,
      IsShowDialog,
      onUpdatePress,
      onDismissPress,
      onCancelPress,
      NickName,
      //IsNoRecords,
      IsShowTabsForMultiple,
      IsNickName,
    } = this.props;
   // console.log("MyContacts", MyContacts)
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={{flex: 5, position: 'relative'}}>
          <FlatList
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps={'always'}
            keyboardDismissMode={'interactive'}
            data={MyContacts}
            scrollToEnd={true}
            renderItem={(item,index) => this._renderContact(item,index)}
          />
        </View>
        {IsShowTabs ? (
          <View
            style={{
              flex: 1,
              position: 'absolute',
              left: Dimensions.get('window').width - 50,
            }}>
            {this.ShowTabs(MyContacts)}
          </View>
        ) : null}
        {IsShowTabsForMultiple ? (
          <View
            style={{
              flex: 1,
              position: 'absolute',
              left: Dimensions.get('window').width - 50,
            }}>
            {this.ShowTabsForMultiSelection(MyContacts)}
          </View>
        ) : null}
        <View>
          <Dialog
            style={{marginBottom: 50}}
            onTouchOutside={this._handleOnClose}
            onHardwareBackPress={this._handleOnClose}
            onDismiss={onDismissPress}
            width={0.9}
            height={0.3}
            visible={IsShowDialog}
            rounded
            actionsBordered
            dialogTitle={
              <DialogTitle
                titleAlign={'center'}
                style={{borderBottomWidth: 1}}
                title={IsNickName ? 'Update Nickname' : 'Nickname'}
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
                  style={styles.DialogButton}
                  textStyle={styles.DialogButtonText}
                  onPress={onCancelPress}
                  key="button-1"
                />
                <DialogButton
                  text={IsNickName ? 'Update' : 'Add'}
                  style={[styles.DialogButton]}
                  textStyle={styles.DialogButtonText}
                  onPress={onUpdatePress}
                  key="button-2"
                />
              </DialogFooter>
            }>
            <DialogContent
              style={{
                height: 90,
              }}>
              <TextInput
                style={{
                  flex: 1,
                  borderColor: '#a9a9a9',
                  borderBottomWidth: 1,
                  marginTop: 20,
                  fontSize: 18,
                }}
                underlineColor="transparent"
                placeholder={
                  IsNickName ? 'Update Nick name' : 'Enter Nick Name'
                }
                placeholderTextColor={'#a9a9a9'}
                onChangeText={text => this.onChangeText(text)}
                value={NickName}
                maxLength={10}
              />
            </DialogContent>
          </Dialog>
        </View>
        <View>
          <AlertClass
            AlertMessage={'Are you sure you want to unblock'}
            OkButtonText={'OK'}
            CancelButtonText={'Cancel'}
            showAlert={this.state.surewantToDelete}
            onOkPress={() => {
              this.ConfirmUnBlock();
              this.setState({surewantToDelete: false});
              this.setState({
                showalert: true,
                // DisplayText: 'Deleted successfully',
              });
              setTimeout(() => {
                this.setState({
                  displayText: '',
                  showalert: false,
                });
              }, 5000);
            }}
            onAlertClose={() => {
              this.setState({surewantToDelete: false, SelectedItem:{}});
              this.props.onCancelPress();
            }}
          />
        </View>
      </View>
    );
  }
}