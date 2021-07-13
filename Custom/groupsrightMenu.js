import React, {Component} from 'react';
import {setBusinessCardDetails} from '../state/operations';
import {connect} from 'react-redux';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Menu, {MenuItem} from 'react-native-material-menu';
import {OptionVertical} from '../shared/Icon';
class CustomMenuIconForHeader extends Component {
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
    const {IsAdmin} = this.props;
    return (
      <View>
        <Menu
          style={Styles.menuView}
          ref={this.setMenuRef}
          button={
            <TouchableOpacity onPress={this.showMenu}>
              <OptionVertical style={{color: '#ffffff'}} />
            </TouchableOpacity>
          }>
          {IsAdmin ? (
            <View>
              <View style={Styles.viewDirection}>
                <MenuItem
                  textStyle={{color: '#ffffff'}}
                  onPress={this.option1Click}>
                  Add Participants
                </MenuItem>
              </View>
              <View style={Styles.viewDirection}>
                <MenuItem
                  textStyle={{color: '#ffffff'}}
                  onPress={this.option2Click}>
                  Edit group
                </MenuItem>
              </View>
            </View>
          ) : null}

          <View style={Styles.viewDirection}>
            <MenuItem
              textStyle={{color: '#ffffff'}}
              onPress={this.option3Click}>
              Exit Group
            </MenuItem>
          </View>
        </Menu>
      </View>
    );
  }
}
const Styles = StyleSheet.create({
  viewDirection: {flexDirection: 'row', alignItems: 'center', padding: 2},
  menuView: {
    backgroundColor: '#11cbdf',
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 20,
    top:73
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
)(CustomMenuIconForHeader);
