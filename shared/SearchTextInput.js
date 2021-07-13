import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {SearchBar} from 'react-native-elements';

export default class SearchTextInput extends Component {
  _handleOnSearchTextChange = text => {
    const {onSearchTextChange} = this.props;
    onSearchTextChange(text);
  };
  render() {
    const {placeholder, value, searchIcon} = this.props;
    return (
      <SearchBar
        placeholder={placeholder}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.seachInputContainer}
        inputStyle={styles.searchInput}
        onChangeText={text => this._handleOnSearchTextChange(text)}
        value={value}
        searchIcon={searchIcon}
      />
    );
  }
}
const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 0.5,
    borderColor: '#d3d3d3',
  },
  seachInputContainer: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderWidth: 0,
    fontSize: 15,
  },
  searchInput: {flex: 2, borderWidth: 0, paddingVertical: 5},
});
