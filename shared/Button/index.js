import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './Button.styles';
import LinearGradient from 'react-native-linear-gradient';
import { BoldText } from '../../shared/Text';

export default class Button extends Component {
  render() {
    const {
      isDisabled,
      buttonTitle,
      onButtonPress,
      touchableOpacity,
    } = this.props;
    var touchableOpacit = touchableOpacity ? touchableOpacity : styles.touchableOpacityGetStarted;
    var colors = [];
    if (isDisabled) {
      colors = ['rgb(220,220,220)', 'rgb(220,220,220)'];
    } else {
      colors = ['rgba(8,155,171,1)', 'rgba(17,203,223,1)'];
    }
    return (
      <View style={styles.button}>
        <TouchableOpacity disabled={isDisabled} onPress={onButtonPress}>
          <LinearGradient
            start={{ x: 1, y: 1.5 }}
            end={{ x: 1, y: 0 }}
            colors={colors}
            style={touchableOpacit}>
            <BoldText style={styles.textGetStarted}>{buttonTitle}</BoldText>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
}