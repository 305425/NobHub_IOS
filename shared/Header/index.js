import React, {Component} from 'react';
import Header from './Header';


export default class HeaderContainer extends Component {
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
      onHeaderAddtoGroup
    } = this.props;
    return (
      <Header
        HeaderTitle={HeaderTitle}
        leftIconSource={leftIconSource}
        rightIconSource={rightIconSource}
        IsShowDeleteIcon={IsShowDeleteIcon}
        IsEditIcon={IsEditIcon}
        onHeaderRightIconPress={onHeaderRightIconPress}
        onHeaderLeftIconPress={onHeaderLeftIconPress}
        onHeaderDeleteIconPress={onHeaderDeleteIconPress}
        onHeaderEditIconPress={onHeaderEditIconPress}
        userProfile={userProfile}
        IsGroupCount={IsGroupCount}
        onHeaderAddtoGroup={onHeaderAddtoGroup}
      />
    );
  }
}
