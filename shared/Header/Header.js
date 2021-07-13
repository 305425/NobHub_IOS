import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from './Header.styles';
import {
  ArrowLeft,
  FileEdit,
  ShareICon,
  Plus,
  Delete,
  Edit,
  Close,
  Addpeople
} from '../Icon';
import {Actions} from 'react-native-router-flux';
//import ServiceCalls from '../Services/APICalls';
export default class Header extends Component {
  _renderIcon = iconName => {
    switch (iconName) {
      case 'back':
        return <ArrowLeft style={styles.IconStyle} />;
      case 'fileEdit':
        return <FileEdit style={styles.IconStyle} />;
      case 'share':
        return <ShareICon style={styles.IconStyle} />;
      case 'plus':
        return <Plus style={styles.IconStyle} />;
      case 'Close':
        return <Close style={styles.IconStyle} />;
      case 'delete':
        return <Delete style={styles.IconStyle} />;
      case 'edit':
        return <Edit style={styles.IconStyle} />;
        case 'group-add':
          return <Addpeople style={styles.IconStyle} />; 
    }
  };
  render() {
    const {
      HeaderTitle,
      leftIconSource,
      rightIconSource,
      IsShowDeleteIcon,
      IsEditIcon,
      onHeaderRightIconPress,
      onHeaderLeftIconPress,
      onHeaderDeleteIconPress,
      onHeaderEditIconPress,
      userProfile,
      IsGroupCount,
      GroupCount,
      GroupName,
      onHeaderAddtoGroup,
    } = this.props;
    return (
      <View style={styles.viewHeaderContainer}>
        <View style={styles.viewHeaderLeftContainer}>
          <TouchableOpacity onPress={onHeaderLeftIconPress}>
            {this._renderIcon(leftIconSource)}
          </TouchableOpacity>
        </View>
        <View style={styles.viewHeaderCenterContainer}>
          <Text style={styles.textHeader}>{HeaderTitle}</Text>
        </View>
        <View style={styles.viewHeaderDeleteContainer}>
          {IsShowDeleteIcon ? (
            <TouchableOpacity onPress={onHeaderDeleteIconPress}>
              <Delete style={styles.IconStyle} />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.viewHeaderEditContainer}>
          {IsEditIcon ? (
            <TouchableOpacity onPress={onHeaderEditIconPress}>
              <Edit style={styles.IconStyle} />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.viewHeaderRightContainer}>
          <TouchableOpacity onPress={onHeaderRightIconPress}>
            {this._renderIcon(rightIconSource)}
          </TouchableOpacity>
        </View>
        {IsGroupCount?
          <View style={styles.ViewHeaderGroupCount}>
        <TouchableOpacity onPress={onHeaderAddtoGroup}>
        <Addpeople style={styles.IconStyle} />
          </TouchableOpacity>
        </View>:null}
      </View>
    );
  }
}
