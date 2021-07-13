import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {CommonStyles} from '../shared/Constants';
import {EditCard} from '../shared/Icon';
import {Text} from '../shared/Text';
import Modal from 'react-native-modal';
export default class ScannedPopup extends Component {
  _handleOnEditShoutoutPress = data => {
    const {onEditIconPress} = this.props;
    onEditIconPress(data);
  };
  _handleOnWipeOutButtonPress = data => {
    const {onWipeOutButtonPress} = this.props;
    onWipeOutButtonPress(data);
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
          <View
            style={{
              flex: 0.2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <View style={{flex: 0.4}} />
            <View style={{flex: 0.4}}>
              <Text>{SelectedData.shoutoutTitle}</Text>
            </View>
            <View style={{flex: 0.4}}>
              <TouchableOpacity
                onPress={() => this._handleOnEditShoutoutPress(SelectedData)}>
                <EditCard />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flex: 0.5,
              flexDirection: 'row',
              marginTop: 10,
              //justifyContent: 'space-between',
            }}>
            <View style={{flex: 0.2}} />
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
            <View style={{flex: 0.2}} />
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
            <View style={{flex: 0.2}} />
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
    //borderTopLeftRadius: 35,
    //borderTopRightRadius: 35,
  },
  iconColor: {
    color: CommonStyles.appColor,
    fontSize: 20,
  },
  modal: {
    margin: 0,
    backgroundColor: '#ffffff',
    height: '20%',
    flex: 0,
    bottom: 0,
    position: 'absolute',
    width: '100%',
    //borderTopLeftRadius: 35,
    //borderTopRightRadius: 35,
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
});
