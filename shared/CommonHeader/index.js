import React, {Component} from 'react';
import {View} from 'react-native';
import Header from './Header';
export default class CommonHeader extends Component {
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
      <View style={{flex: 1}}>
        <Header
          HeaderLeftIcon={HeaderLeftIcon}
          HeaderCenterIcon={HeaderCenterIcon}
          HeaderRightIcon={HeaderRightIcon}
          HeaderLeftIconPress={HeaderLeftIconPress}
          HeaderRightIconPress={HeaderRightIconPress}
          HeaderText={HeaderText}
          HeaderProfileIcon={HeaderProfileIcon}
          HeaderProfileIconPress={HeaderProfileIconPress}
          IsShowTextForTabs={IsShowTextForTabs}
          TabLabel1={TabLabel1}
          TabLabel2={TabLabel2}
        />
      </View>
    );
  }
}
