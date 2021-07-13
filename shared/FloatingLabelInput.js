import React, {Component} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
export default class FloatingLabelInput extends Component {
  state = {
    isFocused: false,
  };

  handleFocus = () => this.setState({isFocused: true});
  handleBlur = () => this.setState({isFocused: false});

  render() {
    const {label, textStyle, ...props} = this.props;
    const {isFocused} = this.state;
    const labelStyle = {
      position: 'absolute',
      fontSize: !isFocused ? 14 : 10,
      color: !isFocused ? 'red' : 'red',
      marginLeft: 10,
      flex: 1,
    };
    return (
      <View style={styles.container}>
        <Text style={labelStyle}>{label}</Text>
        <TextInput
          {...props}
          style={[styles.textInput, {Text}]}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 120,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 15,
  },
  textInput: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 100,
  },
});
