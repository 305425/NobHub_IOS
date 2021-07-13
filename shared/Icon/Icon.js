import React from 'react';
import {StyleSheet} from 'react-native';
import {Icon} from 'native-base';

export default ({iconName, fontName, style}) => {
  const styles = StyleSheet.create({
    icon: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
  });

  return <Icon type={fontName} name={iconName} style={[style, styles.icon]} />;
};
