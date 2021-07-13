import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: 65, 
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    backgroundColor: '#FFF',
    top: -8,
    left: 25,
    padding: 5,
    zIndex: 50,
  },
  textInput: {
    flex: 1, 
    borderWidth: 1, 
    borderColor: "green",
    justifyContent: 'flex-end',
    height: 44,
    borderRadius: 65,
    paddingHorizontal: 25,
  }
})

const CustomTextInput = ({ label, style, ...props}) => (
  <View style={styles.container}>
    <View style={styles.labelContainer}>
      <Text>{label}</Text>
    </View>
    <TextInput style={styles.textInput}/>
  </View>
);

export default CustomTextInput;