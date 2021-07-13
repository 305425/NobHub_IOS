import React, {Component} from 'react';
import {TouchableOpacity, View, Text, Image} from 'react-native';
import {styles} from './Tabs.style';
import {Msgicon, People} from '../shared/Icon';
import LinearGradient from 'react-native-linear-gradient';

export default class InvitationTabs extends Component {
  render() {
    const {
      onSingleChatPress,
      onGroupChatPress,
      SingleChatTabColor,
      GroupChatTabColor,
      SingleChatIconColor,
      GroupChatIconColor,
    } = this.props;
    return (
      <View style={styles.viewTabsContainer}>
        <LinearGradient
          start={{x: 1, y: 1.5}}
          end={{x: 1, y: 0}}
          colors={SingleChatTabColor}
          style={styles.touchableOpacityView_SingleChat}>
          <TouchableOpacity onPress={onSingleChatPress}>
            <Image
              source={require('../Images/onetooneIcon.png')}
              tyle={[styles.iconStyle, {color: SingleChatIconColor}]}
            />
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          start={{x: 1, y: 1.5}}
          end={{x: 1, y: 0}}
          colors={GroupChatTabColor}
          style={styles.touchableOpacityView_GroupChat}>
          <TouchableOpacity onPress={onGroupChatPress}>
            <People style={[styles.iconStyle, {color: GroupChatIconColor}]} />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }
}
