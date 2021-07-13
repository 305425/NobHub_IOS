import React, {Component} from 'react';
import {View, TouchableOpacity, Dimensions} from 'react-native';
import Modal from 'react-native-modal';
import {styles} from './CustomAlert.styles';
import {Text, BoldText} from '../Text';
import LinearGradient from 'react-native-linear-gradient';
import Dialog, {DialogContent, ScaleAnimation} from 'react-native-popup-dialog';
export class AlertClass extends Component {
  _handleOnClose = () => {
    const {onAlertClose} = this.props;
    onAlertClose();
  };
  _handleOnOkPress = () => {
    const {onOkPress} = this.props;
    onOkPress();
  };
  _renderButtons = () => {
    const {CancelButtonText, OkButtonText} = this.props;
    if (CancelButtonText) {
      return (
        <View style={styles.viewButtons}>
          <LinearGradient
            start={{x: 1, y: 1.5}}
            end={{x: 1, y: 0}}
            colors={['rgba(8,155,171,1)', 'rgba(17,203,223,1)']}
            style={[
              styles.buttonStyle,
              {
                marginLeft: 5,
                marginRight: 8,
                borderRadius: 50,
              },
            ]}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={this._handleOnClose}
              activeOpacity={0.7}>
              <BoldText style={styles.TextStyle}>{CancelButtonText}</BoldText>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            start={{x: 1, y: 1.5}}
            end={{x: 1, y: 0}}
            colors={['rgba(8,155,171,1)', 'rgba(17,203,223,1)']}
            style={[styles.buttonStyle, {borderRadius: 60}]}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={this._handleOnOkPress}
              activeOpacity={0.7}>
              <BoldText style={styles.TextStyle}>{OkButtonText}</BoldText>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      );
    } else {
      return (
        <View style={styles.viewButtons}>
          <View style={{flex: 0.5}} />
          <LinearGradient
            start={{x: 1, y: 1.5}}
            end={{x: 1, y: 0}}
            colors={['rgba(8,155,171,1)', 'rgba(17,203,223,1)']}
            style={[styles.buttonStyle, {borderRadius: 60}]}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={this._handleOnOkPress}
              activeOpacity={0.7}>
              <BoldText style={styles.TextStyle}>{OkButtonText}</BoldText>
            </TouchableOpacity>
          </LinearGradient>
          <View style={{flex: 0.5}} />
        </View>
      );
    }
  };

  render() {
    const {
      AlertTitle,
      AlertMessage,

      showAlert,
      Height,
    } = this.props;

    const windowHeight = Height ? Height : 220;
    return (
      <View style={styles.MainContainer}>
        <Dialog
          onTouchOutside={this._handleOnClose}
          width={0.9}
          // height={windowHeight}
          visible={showAlert}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={this._handleOnClose}>
          <DialogContent>
            <View style={[styles.viewModalInside, {height: windowHeight}]}>
              <View style={styles.Alert_Main_View}>
                <BoldText style={styles.Alert_Title}>{AlertTitle}</BoldText>

                <Text style={styles.Alert_Message}>{AlertMessage}</Text>
                <View style={{height: 20}} />

                {this._renderButtons()}
              </View>
            </View>
          </DialogContent>
        </Dialog>

        {/* <Modal
          visible={showAlert}
          transparent={true}
          animationType={'fade'}
          onRequestClose={this._handleOnClose}>
          <View style={styles.viewModalInside}>
            <View style={styles.Alert_Main_View}>
              <BoldText style={styles.Alert_Title}>{AlertTitle}</BoldText>

              <Text style={styles.Alert_Message}>{AlertMessage}</Text>
              <View style={styles.viewButtons}>
                <LinearGradient
                  start={{x: 1, y: 1.5}}
                  end={{x: 1, y: 0}}
                  colors={['rgba(8,155,171,1)', 'rgba(17,203,223,1)']}
                  style={[styles.buttonStyle, {borderBottomLeftRadius: 10}]}>
                  <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={this._handleOnOkPress}
                    activeOpacity={0.7}>
                    <BoldText style={styles.TextStyle}>
                      {' '}
                      {OkButtonText}{' '}
                    </BoldText>
                  </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                  start={{x: 1, y: 1.5}}
                  end={{x: 1, y: 0}}
                  colors={['rgba(8,155,171,1)', 'rgba(17,203,223,1)']}
                  style={[
                    styles.buttonStyle,
                    {
                      borderBottomRightRadius: 10,
                      marginLeft: 2,
                    },
                  ]}>
                  <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={this._handleOnClose}
                    activeOpacity={0.7}>
                    <BoldText style={styles.TextStyle}>
                      {CancelButtonText}
                    </BoldText>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </View>
        </Modal> */}
      </View>
    );
  }
}
