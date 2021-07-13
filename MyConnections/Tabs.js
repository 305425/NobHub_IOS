import React, {Component} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {styles} from './Tabs.styles';
import {Location, InviteUser, New} from '../shared/Icon';
import LinearGradient from 'react-native-linear-gradient';
import {CommonStyles} from '../shared/Constants';

export default class ContactTabs extends Component {
  render() {
    const {
      UserId,
      onInvitePeoplePress,
      onNearByProfilePress,
      InviteTabColor,
      NearByTabColor,
      InviteIconColor,
      NearByIconColor,
      InvitationText,
    } = this.props;
    return (
      <View style={styles.viewTabsContainer}>
        <LinearGradient
          start={{x: 1, y: 1.5}}
          end={{x: 1, y: 0}}
          colors={InviteTabColor}
          style={styles.touchableOpacityView_InviteUser}>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={onInvitePeoplePress}>
            <InviteUser style={[styles.iconStyle, {color: InviteIconColor}]} />
            {InvitationText ? (
              <View
                style={{
                  backgroundColor: CommonStyles.appColor,
                  height: 20,
                  width: 20,
                  borderRadius: 40,
                }}>
                <Text
                  style={{color: '#ffffff', fontSize: 12, textAlign: 'center'}}>
                  N
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </LinearGradient>
        <LinearGradient
          start={{x: 1, y: 1.5}}
          end={{x: 1, y: 0}}
          colors={NearByTabColor}
          style={styles.touchableOpacityView_Nearby}>
          {/* <View style={styles.touchableOpacityView_Nearby}> */}
          <TouchableOpacity onPress={onNearByProfilePress}>
            <Location
              style={[styles.nearByIconStyle, {color: NearByIconColor}]}
            />
          </TouchableOpacity>
          {/* </View> */}
        </LinearGradient>
      </View>
    );
  }
}
