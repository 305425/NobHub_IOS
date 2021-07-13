import React, {Component} from 'react';
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {styles} from './Header.styles';
import images from '../../Images';
import LinearGradient from 'react-native-linear-gradient';
import {BoldText, MediumBoldText} from '../Text';
export default class Header extends Component {
  image = () => {
    return (
      <Image
        style={styles.imageLogo}
        source={images.myConnectionsHeaderBackground}
      />
    );
  };
  render() {
    const {
      HeaderLeftIcon,
      HeaderRightIcon,
      HeaderCenterIcon,
      HeaderLeftIconPress,
      HeaderRightIconPress,
      HeaderText,
      HeaderProfileIcon,
      HeaderProfileIconPress,
      IsShowTextForTabs,
      TabLabel1,
      TabLabel2,
    } = this.props;
    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['rgba(8,155,171,1)', 'rgba(17,203,223,1)']}
        style={styles.headerLinerGradient}>
        <Image
          style={[styles.imageLogo]}
          source={images.myConnectionsHeaderBackground}
        />
        <View style={{flex: 0.5}} />
        <View style={{flex: 0.3, alignItems: 'center'}}>{HeaderText()}</View>
        <View style={styles.container}>
          <View style={{flex: 0.05}} />
          <View style={{flex: 0.2}}>
            <TouchableOpacity onPress={HeaderLeftIconPress}>
              {HeaderLeftIcon()}
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.05}} />
          <View style={{flex: 0.4}}>
            <View style={styles.viewHeaderCenterContainer}>
              {HeaderCenterIcon()}
            </View>

            {IsShowTextForTabs ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <Text
                  style={{color: '#ffffff', fontSize: 10, textAlign: 'center'}}>
                  {TabLabel1}
                </Text>
                <Text
                  style={{color: '#ffffff', fontSize: 10, textAlign: 'center'}}>
                  {TabLabel2}
                </Text>
              </View>
            ) : (
              <View style={{flex: 2.7}} />
            )}
          </View>
          <View style={{flex: 0.05}} />
          <View style={{flex: 0.2}}>
            <TouchableOpacity onPress={HeaderRightIconPress}>
              {HeaderRightIcon()}
            </TouchableOpacity>
          </View>
          <View style={{flex: 0.05}}>
            {HeaderProfileIcon() != null ? (
              <View style={styles.viewHeaderRightContainer}>
                {HeaderProfileIcon()}
              </View>
            ) : (
              <View style={{flex: 0.7}} />
            )}
          </View>
        </View>
      </LinearGradient>
    );
  }
}
