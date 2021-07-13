import React, {Component} from 'react';
import {View, ImageBackground, Image} from 'react-native';
import {styles} from './TopBackground.styles';
export default class TopBackground extends Component {
  render() {
    return (
      <View style={styles.TopBackgroundContainer}>
        <View style={styles.viewImgBackgroundContainer}>
          <ImageBackground
            style={styles.imgBackground}
            source={require('../../BottomTabImages/curve2.png')}
          />
        </View>
        <View style={styles.logoContainer}>
          <Image
            style={styles.imgLogo}
            source={require('../../Images/newlogo.png')}
          />
          <View style={styles.viewImgRightCurve}>
            <Image
              style={styles.imgRightCurve}
              source={require('../../BottomTabImages/curve1.png')}
            />
          </View>
        </View>
      </View>
    );
  }
}
