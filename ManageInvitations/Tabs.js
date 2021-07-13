import React, {Component} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {styles} from './Tabs.styles';
import {Receive, Block, SendIcon} from '../shared/Icon';
import LinearGradient from 'react-native-linear-gradient';

export default class InvitationTabs extends Component {
  render() {
    const {
      onReceivePress,
      onSendPress,
      onBlockPress,
      receiveTabColor,
      sendTabColor,
      blockTabColor,
      ReceiveIconColor,
      SentIconColor,
      BlockIconColor,
    } = this.props;
    return (
      <View style={styles.viewTabsContainer}>
        <LinearGradient
          start={{x: 1, y: 1.5}}
          end={{x: 1, y: 0}}
          colors={receiveTabColor}
          style={styles.touchableOpacityView_Receive}>
          <TouchableOpacity onPress={onReceivePress}>
            <Receive style={[styles.iconStyle, {color: ReceiveIconColor}]} />
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          start={{x: 1, y: 1.5}}
          end={{x: 1, y: 0}}
          colors={sendTabColor}
          style={styles.touchableOpacityView_Send}>
          <TouchableOpacity onPress={onSendPress}>
            <SendIcon style={[styles.iconStyle, {color: SentIconColor}]} />
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          start={{x: 1, y: 1.5}}
          end={{x: 1, y: 0}}
          colors={blockTabColor}
          style={styles.touchableOpacityView_Send}>
          <TouchableOpacity onPress={onBlockPress}>
            <Block style={[styles.iconStyle, {color: BlockIconColor}]} />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }
}
