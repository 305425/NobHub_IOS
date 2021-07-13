import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {CommonStyles} from '../shared/Constants';
import {EditCard} from '../shared/Icon';
import {MediumBoldText, Text} from '../shared/Text';
import Modal from 'react-native-modal';
import {Thumbnail} from 'native-base';
export default class BottomPopup extends Component {
  _handleOnWipeOutButtonPress = data => {
    const {onWipeOutButtonPress} = this.props;
    onWipeOutButtonPress(data);
  };
  _renderImageData = item => {
    //var _profile = (item && item[0]) ? item[0].name.split(' ') : [];
    if (item && item[0] && item[0].image !== '' && item[0].image !== null) {
      return (
        <View style={{flexDirection: 'row', marginBottom: 10, marginTop: 10}}>
          <Thumbnail
            medium
            source={{
              uri:
                global.APIURL + 'uploadimgs/ProfilePictures/' + item[0].image,
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
            fontSize: 15,
            color: '#ffffff',
            textAlign: 'center',
          }}>
          {(item[0] && item[0].initials && item[0].initials !== '' && item[0].initials !== null) ? item[0].initials : ''}
        </MediumBoldText>
      </View>
    );
  };
  render() {
    const {
      onCancelButtonPress,
      swipeablePanelActive,
      SelectedData,
    } = this.props;
    return (
      <Modal style={styles.modal} isVisible={swipeablePanelActive}>
        <View style={styles.container}>
          {SelectedData != null && SelectedData != '' ? (
            <View style={{flex: 0.5, alignSelf: 'center'}}>
              {this._renderImageData(SelectedData.userDetails)}
            </View>
          ) : null}
          <View style={{flex: 1, marginTop: 50, alignSelf: 'center'}}>
            {SelectedData.notificationtype == 'MS' ? (
              <MediumBoldText>Meeting Invitation</MediumBoldText>
            ) : null}
            {SelectedData.notificationtype == 'F' ? (
              <MediumBoldText>New Invitation</MediumBoldText>
            ) : null}
            {SelectedData.notificationtype == 'S' ? (
              <MediumBoldText>New Business shoutout</MediumBoldText>
            ) : null}
            {SelectedData.notificationtype == 'C' ? (
              <MediumBoldText>Business card shared!</MediumBoldText>
            ) : null}
            {SelectedData.notificationtype == 'A' ? (
              <MediumBoldText>Accept Invitation</MediumBoldText>
            ) : null}
            {SelectedData.notificationtype == 'MA' ? (
              <MediumBoldText>Meeting Accepted</MediumBoldText>
            ) : null}
            {SelectedData.notificationtype == 'MC' ? (
              <MediumBoldText>Meeting Canceled</MediumBoldText>
            ) : null}
            {SelectedData.notificationtype == 'MT' ? (
              <MediumBoldText>Meeting Accepted Tentatively</MediumBoldText>
            ) : null}
            {SelectedData.notificationtype == 'MD' ? (
              <MediumBoldText>Meeting Declined</MediumBoldText>
            ) : null}
            {SelectedData.notificationtype == 'MU' ? (
              <MediumBoldText>Meeting Schedule Updated</MediumBoldText>
            ) : null}
            {SelectedData.notificationtype == 'RS' ? (
              <MediumBoldText>Reshared Business Shoutout</MediumBoldText>
            ) : null}
          </View>
          <View
            style={{
              flex: 0.8,
              flexDirection: 'row',
              bottom: 15,
            }}>
            <View style={{flex: 0.4}} />
            <View
              style={{
                borderWidth: 1,
                backgroundColor: CommonStyles.appColor,
                flex: 0.5,
                borderRadius: 20,
                alignSelf: 'center',
                paddingVertical: 8,
                borderColor: '#ffffff',
              }}>
              <TouchableOpacity onPress={onCancelButtonPress}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 0.3}} />
            <View
              style={{
                borderWidth: 1,
                backgroundColor: CommonStyles.appColor,
                flex: 0.5,
                borderRadius: 20,
                alignSelf: 'center',
                paddingVertical: 8,
                borderColor: '#ffffff',
              }}>
              <TouchableOpacity
                onPress={() => this._handleOnWipeOutButtonPress(SelectedData)}>
                <Text style={styles.buttonText}>Wipe out</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 0.4}} />
          </View>
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  iconColor: {
    color: CommonStyles.appColor,
    fontSize: 20,
  },
  modal: {
    margin: 0,
    backgroundColor: '#ffffff',
    height: '25%',
    flex: 0,
    bottom: 0,
    position: 'absolute',
    width: '100%',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  OvalShapeView: {
    marginTop: 20,
    width: 40,
    height: 40,
    backgroundColor: CommonStyles.appColor,
    borderRadius: 45,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    transform: [{scaleX: 2}],
    flex: 0.15,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    //fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
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
});
