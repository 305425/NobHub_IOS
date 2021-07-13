import React, {Component} from 'react';
import {View, ImageBackground} from 'react-native';
import {styles} from './BottomBackground.styles';
export default class BottomBackground extends Component {
  render() {
    return (
      <View style={styles.viewBottomBackgroundContainer}>
        <ImageBackground
          style={styles.imageBackgroundBottom}
          source={require('../../BottomTabImages/curve3.png')}
        />
      </View>
    );
  }
}
