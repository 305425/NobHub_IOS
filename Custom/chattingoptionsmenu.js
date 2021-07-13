import React, {Component} from 'react';
import {setBusinessCardDetails} from '../state/operations';
import {connect} from 'react-redux';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import Menu, {MenuItem} from 'react-native-material-menu';
import {OptionVertical} from '../shared/Icon';
class chattingoptionsmenu extends Component {
  constructor(props) {
    super(props);
  }
  _menu = null;
  setMenuRef = ref => {
    this._menu = ref;
  };
  showMenu = () => {
    this._menu.show();
  };
  hideMenu = () => {
    this._menu.hide();
  };
  option1Click = () => {
    this._menu.hide();
    this.props.option1Click();
  };
  option2Click = () => {
    this._menu.hide();
    this.props.option2Click();
  };
  option3Click = () => {
    this._menu.hide();
    this.props.option3Click();
  };
  render() {
    const{IsFavoriteContact,IsBlockedContact}=this.props;
    return (
      <View style={this.props.menuStyle}>
        <Menu
          style={Styles.menuView}
          ref={this.setMenuRef}
          button={
            <TouchableOpacity onPress={this.showMenu}>
              <OptionVertical style={{color: '#ffffff'}} />
            </TouchableOpacity>
          }>
          <View>
            {IsFavoriteContact ? (
              <View style={Styles.viewDirection}>
                <MenuItem
                  textStyle={{color: '#ffffff'}}
                  onPress={this.option1Click}>
                  Delete As Favorite
                </MenuItem>
              </View>
            ) : (
              <View style={Styles.viewDirection}>
                <MenuItem
                  textStyle={{color: '#ffffff'}}
                  onPress={this.option1Click}>
                  Mark As Favorite
                </MenuItem>
              </View>
            )}
            {IsBlockedContact ? (
              <View style={Styles.viewDirection}>
                <MenuItem
                  textStyle={{color: '#ffffff'}}
                  onPress={this.option2Click}>
                  UnBlock
                </MenuItem>
              </View>
            ) : (
              <View style={Styles.viewDirection}>
                <MenuItem
                  textStyle={{color: '#ffffff'}}
                  onPress={this.option2Click}>
                  Mark As Block
                </MenuItem>
              </View>
            )}
            <View style={Styles.viewDirection}>
              <MenuItem
                textStyle={{color: '#ffffff'}}
                onPress={this.option3Click}>
                Clear chat
              </MenuItem>
            </View>
          </View>
        </Menu>
      </View>
    );
  }
}
const Styles = StyleSheet.create({
  viewDirection: {flexDirection: 'row', alignItems: 'center'},
  menuView: {
    backgroundColor: '#11cbdf',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    top:73
  },
  iconColor: {
    color: '#ffffff',
  },
});
// export const mapStateToProps = state => {
//   return {
//     userProfile: state.user.userProfile,
//   };
// };

const mapDispatchToProps = {
  setBusinessCardDetails,
};

export default connect(
  null,
  mapDispatchToProps,
)(chattingoptionsmenu);
