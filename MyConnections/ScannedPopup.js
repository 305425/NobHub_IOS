import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {CommonStyles} from '../shared/Constants';
import {Scan, PhotoGraph} from '../shared/Icon';
import {MediumBoldText, BoldText} from '../shared/Text';
import Modal from 'react-native-modal';
export default class ScannedPopup extends Component {
  render() {
    const {
      onScanCardPress,
      onViewScanCardPress,
      onCancelPress,
      swipeablePanelActive,
    } = this.props;
    return (
      <Modal style={styles.modal} isVisible={swipeablePanelActive}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.scanCard_touchable}
            onPress={onScanCardPress}>
            <View style={{flex: 0.12, marginLeft: 20}}>
              <Scan style={styles.iconColor} />
            </View>
            <View style={{flex: 1}}>
              <MediumBoldText>Scan Card</MediumBoldText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.scanCard_touchable}
            onPress={onViewScanCardPress}>
            <View style={{flex: 0.12, marginLeft: 20}}>
              <PhotoGraph style={[styles.iconColor, {fontSize: 25}]} />
            </View>
            <View style={{flex: 1}}>
              <MediumBoldText>View Scanned Cards</MediumBoldText>
            </View>
          </TouchableOpacity>

          <View style={{flex: 0.5, alignItems: 'center'}}>
            <View style={{flex: 1}}>
            <TouchableOpacity
                style={{alignItems: 'center',backgroundColor: CommonStyles.appColor,width:100, height:35, borderRadius:30, marginVertical:"2%"}}
                onPress={onCancelPress}>
                {/* <Closecircle style={styles.iconColor} /> */}
                <BoldText style={{marginLeft: 0, color: '#fff',fontSize:18, top:7}}>
                  Cancel
                </BoldText>
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
    height: 150,
    flex: 0,
    bottom: 0,
    position: 'absolute',
    width: '100%',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  scanCard_touchable: {
    flex: 0.35,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    // borderTopLeftRadius: 35,
    // borderTopRightRadius: 35,
  },
  scanCard_View: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    // borderTopLeftRadius: 35,
    // borderTopRightRadius: 35,
  },
});
