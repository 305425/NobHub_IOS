import React, {Component} from 'react';
import {View, Dimensions} from 'react-native';
import {styles} from './MyConnections.styles';
import Tabs from './Tabs';
import Connections from '../shared/Connections';
export default class ConnectedContacts extends Component {
  _handleContactPress = contactData => {
    const {onContactPress} = this.props;
    onContactPress(contactData);
  };
  _handleOnLongPress = contactData => {
    const {OnLongPress} = this.props;
    OnLongPress(contactData);
  };
  _handleOnChangeText = text => {
    const {onChangeText} = this.props;
    onChangeText(text);
  };
  _handleOnEditPress = Name => {
    const {onEditPress} = this.props;
    onEditPress(Name);
  };
  render() {
    const {
      onNearByProfilePress,
      onInvitePeoplePress,
      onScannerPress,
      userProfile,
      IsShow,
      IsContact,
      onMyContactSearch,
      MyContacts,
      onInvitePress,
      InviteTabColor,
      NearByTabColor,
      InviteIconColor,
      NearByIconColor,
      SearchValue,
      IsCancel,
      onCancelPress,
      IsScan,
      OnTextBoxFocus,
      TextInputPlaceHolder,
      InvitationText,
      IsShowTabs,
      IconColor,
      OnNormalGropusPress,
      onClosePress,
      onDeletePress,
      onSharePress,
      OnMeetingPress,
      selectedList,
      IsShowDialog,
      onUpdatePress,
      onDismissPress,
      onDialogCancelPress,
      NickName,
      onEditPress,
      IsNoRecords,
      IsShowTabsForMultiple,
      onChatPress,
      IsUpdate,
      ShowAlert,
      DisplayText,
      IsShowShare,
      IsNickName,
    } = this.props;
   // console.log("contacts", MyContacts)
    return (
      <View style={{flex: 1, backgroundColor: '#f4f6f9'}}>
        <View style={styles.viewTabAndMenu}>
          {/* <View style={styles.viewTab}> */}
          <View style={{flex: 1.2}} />
          <View style={{flex: 1.5}}>
            <Tabs
              onNearByProfilePress={onNearByProfilePress}
              onInvitePeoplePress={onInvitePeoplePress}
              InviteTabColor={InviteTabColor}
              NearByTabColor={NearByTabColor}
              InviteIconColor={InviteIconColor}
              NearByIconColor={NearByIconColor}
              InvitationText={InvitationText}
            />
          </View>
          <View style={{flex: 1.2}} />

          {/* </View> */}
        </View>
        <View style={{flex: 4}}>
          <Connections
            MyContacts={MyContacts}
            onInvitePress={onInvitePress}
            onContactPress={contactData =>
              this._handleContactPress(contactData)
            }
            OnLongPress={contactData => this._handleOnLongPress(contactData)}
            IsShowTabs={IsShowTabs}
            IconColor={IconColor}
            OnNormalGropusPress={OnNormalGropusPress}
            onClosePress={onClosePress}
            onDeletePress={onDeletePress}
            OnMeetingPress={OnMeetingPress}
            onSharePress={onSharePress}
            selectedList={selectedList}
            IsShowDialog={IsShowDialog}
            onUpdatePress={onUpdatePress}
            onDismissPress={onDismissPress}
            onCancelPress={onDialogCancelPress}
            NickName={NickName}
            onEditPress={Name => this._handleOnEditPress(Name)}
            OnTextChange={text => this._handleOnChangeText(text)}
            IsNoRecords={IsNoRecords}
            IsShowTabsForMultiple={IsShowTabsForMultiple}
            onChatPress={onChatPress}
            IsUpdate={IsUpdate}
            ShowAlert={ShowAlert}
            DisplayText={DisplayText}
            IsShowShare={IsShowShare}
            IsNickName={IsNickName}
          />
        </View>
      </View>
    );
  }
}
export const {width, height} = Dimensions.get('window');
