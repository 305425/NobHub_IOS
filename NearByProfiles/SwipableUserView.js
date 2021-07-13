import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {CommonStyles} from '../shared/Constants';
import {PlusCircle, BottomChatIcon, Person, Close, Block} from '../shared/Icon';
import {Text} from '../shared/Text';
import Modal from 'react-native-modal';
import {Thumbnail} from 'native-base';
export default class ScannedPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CompanyName: '',
      Title: '',
      Industry: '',
    };
  }
  _handleOnApplyPress = () => {
    const {onApplyPress} = this.props;
    onApplyPress(this.state.CompanyName, this.state.Title, this.state.Industry);
  };
  _handleOnInvitePress = data => {
    const {onInvitePress} = this.props;
    onInvitePress(data);
  };
  _handleOnChatPress = data => {
    const {onChatPress} = this.props;
    onChatPress(data);
  };
  _handleOnClosePress = () => {
    const {onClosePress} = this.props;
    onClosePress();
  };
  _handleUnBlock = item => {
    const {UnBlock} = this.props;
    UnBlock(item);
  };
  render() {
    const {onRequestClose, UserSwipableViewActive, UserData} = this.props;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        style={styles.modal}
        onRequestClose={onRequestClose}
        isVisible={UserSwipableViewActive}>
        <View style={styles.container}>
          <View style={{flex: 0.2}}>
            {UserData.image != '' && UserData.image != null ? (
              <Thumbnail
                style={{
                  backgroundColor: '#ffffff',
                  height: 35,
                  width: 35,
                  borderRadius: 70,
                }}
                medium
                source={{
                  uri:
                    global.APIURL +
                    'uploadimgs/ProfilePictures/' +
                    UserData.image,
                }}
              />
            ) : (
              <View style={styles.leftHeader}>
                <Person style={{color: CommonStyles.appColor}} />
              </View>
            )}
          </View>
          <View style={{flex: 0.5}}>
            <Text>{UserData.name}</Text>
            <Text>{UserData.title}</Text>
          </View>
          <View style={{flex: 0.5, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => this._handleOnInvitePress(UserData)}>
              <PlusCircle
                style={{color: CommonStyles.appColor, fontSize: 25, margin: 10}}
              />
            </TouchableOpacity>
            {UserData.isChatBlocked ? (
              <TouchableOpacity onPress={() => this._handleUnBlock(UserData)}>
                <Block
                  style={{
                    color: CommonStyles.appColor,
                    fontSize: 25,
                    margin: 10,
                  }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => this._handleOnChatPress(UserData)}>
                <BottomChatIcon
                  style={{
                    color: CommonStyles.appColor,
                    fontSize: 25,
                    margin: 10,
                  }}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => this._handleOnClosePress()}>
              <Close
                style={{color: CommonStyles.appColor, fontSize: 25, margin: 10}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    //borderTopLeftRadius: 35,
    //borderTopRightRadius: 35,
    margin: 10,
    flexDirection: 'row',
  },
  iconColor: {
    color: CommonStyles.appColor,
    fontSize: 20,
  },
  modal: {
    margin: 0,
    backgroundColor: '#f4f6f9',
    height: '20%',
    flex: 0,
    bottom: 0,
    position: 'absolute',
    width: '100%',
    //borderTopLeftRadius: 35,
    //borderTopRightRadius: 35,
  },
  leftHeader: {
    flexDirection: 'column',
    height: 50,
    width: 50,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
  },
});
