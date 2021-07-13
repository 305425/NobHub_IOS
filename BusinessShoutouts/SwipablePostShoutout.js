import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {CommonStyles} from '../shared/Constants';
import {MediumBoldText} from '../shared/Text';
import Modal from 'react-native-modal';
export default class ScannedPopup extends Component {
  render() {
    const {
      onSaveDraftPress,
      onDeleteDraftPress,
      onContinuePress,
      swipeablePanelActive,
    } = this.props;
    return (
      <Modal style={styles.modal} isVisible={swipeablePanelActive}>
        <View style={styles.container}>
          <TouchableOpacity
            style={{
              flex: 0.5,
              borderBottomWidth: 1,
              borderColor: '#e0e0e0',
              marginTop: 10,
            }}
            onPress={onSaveDraftPress}>
            <View
              style={{
                flex: 0.5,
                backgroundColor: '#ffffff',
                alignItems: 'center',
              }}>
              <MediumBoldText>Save Draft</MediumBoldText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 0.5,
              borderBottomWidth: 1,
              borderColor: '#e0e0e0',
              marginTop: 10,
            }}
            onPress={onDeleteDraftPress}>
            <View
              style={{
                flex: 0.5,
                alignItems: 'center',
              }}>
              <MediumBoldText>Delete Draft</MediumBoldText>
            </View>
          </TouchableOpacity>

          <View style={{flex: 0.5, alignItems: 'center'}}>
            <View style={{flex: 1}} />
            <View style={{flex: 1}}>
              <TouchableOpacity
                style={{alignItems: 'center'}}
                onPress={onContinuePress}>
                {/* <Closecircle style={styles.iconColor} /> */}
                <MediumBoldText>Continue</MediumBoldText>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1}} />
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
});
