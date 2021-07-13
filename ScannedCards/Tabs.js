import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {styles} from './Tabs.styles';
import {Scan, Folder} from '../shared/Icon';
import LinearGradient from 'react-native-linear-gradient';

export default class InvitationTabs extends Component {
  render() {
    const {
      onScannedCardsPress,
      onArchivedCardsPress,
      ScannedCardsTabColor,
      ArchivedCardsTabColor,
      ScannedCardsIconColor,
      ArchivedCardsIconColor,
    } = this.props;
    return (
      <View style={styles.viewTabsContainer}>
        <LinearGradient
          start={{x: 1, y: 1.5}}
          end={{x: 1, y: 0}}
          colors={ScannedCardsTabColor}
          style={styles.touchableOpacityView_ScannedCards}>
          <TouchableOpacity onPress={onScannedCardsPress}>
            <Scan style={[styles.iconStyle, {color: ScannedCardsIconColor}]} />
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          start={{x: 1, y: 1.5}}
          end={{x: 1, y: 0}}
          colors={ArchivedCardsTabColor}
          style={styles.touchableOpacityView_ArchivedCards}>
          <TouchableOpacity onPress={onArchivedCardsPress}>
            <Folder
              style={[styles.iconStyle, {color: ArchivedCardsIconColor}]}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }
}
