import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Item, Input, Label} from 'native-base';
import Variables from '../../styles/theme/variables';
class Floatinginput extends Component {
  render() {
    const {
      placeholder,
      onChangeText,
      onPress,
      keyboardType,
      maxLength,
      value,
      // textAlign,
      textInputStyle,
      labelStyle,
      isDisabled,
      onFocus,
      borderEnable
    } = this.props;
    const marginTop =
      labelStyle && labelStyle.marginTop && labelStyle.marginTop === 0 ? 0 : 5;
    return (
      <View style={borderEnable ? styles.viewstyle : styles.viewstyle2}>
        <Item floatingLabel style={{borderColor: 'transparent'}}>
          <Label
            style={[
              styles.floatingstyle,
              labelStyle,
              {marginTop: marginTop, fontFamily: Variables.normalFont},
            ]}>
            {placeholder}
          </Label>
          <Input
            style={[
              {paddingVertical: 15, fontSize: 16},
              styles.input,
              textInputStyle,
            ]}
            onChangeText={onChangeText}
            onPress={onPress}
            keyboardType={keyboardType}
            maxLength={maxLength}
            value={value}
            disabled={isDisabled}
            onFocus={onFocus}
            autoCapitalize='words'
          />
        </Item>
      </View>
    );
  }
}
export default Floatinginput;
const styles = StyleSheet.create({
  input: {
    fontFamily: Variables.normalFont,
  },
  floatingstyle: {
    fontSize: 15,

    color: '#6e8f94',
  },
  viewstyle: {
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    paddingLeft: 10,
    bottom:4.5
  },
  viewstyle2: {
    borderRadius: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: 'grey',
    paddingLeft: 10,
    bottom:4.5
  },
});
