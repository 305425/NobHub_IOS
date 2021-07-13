import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  StatusBar
} from 'react-native';
import {styles} from './FlagsList.styles';
import SearchTextInput from '../SearchTextInput';
import {Search, Clear, KeyBoardLeft} from '../../shared/Icon';
import {connect} from 'react-redux';
import {goBack} from '../../Services/BackButtonServices';

class FlagsList extends Component {
  constructor(props) {
    super(props);
    const {flagsList} = this.props;
    this.state = {
      isDisplaySearchTextInput: false,
      flagsList: flagsList,
      searchText: '',
    };
  }
  _handleFlagListSearchIconPress = () => {
    this.setState({
      isDisplaySearchTextInput: true,
    });
  };
  _handleGoBack = () => {
    const {handleGoBack} = this.props;
    handleGoBack();
  };
  _handleOnSearchTextChange = value => {
    const {flagsList} = this.props;
    this.setState({searchText: value});
    value = value.trim().toLowerCase();
    var countryData = [];
    var tempCountryData = [];
    countryData = flagsList.filter(country => {
      return (
        country.name.toLowerCase().startsWith(value) ||
        country.dial_code.toLowerCase().startsWith(value)
      );
    });
    tempCountryData = countryData;
    flagsList.filter(country => {
      var checkCountryFlg = tempCountryData.find(
        tempCountry => tempCountry === country,
      );
      if (
        !checkCountryFlg &&
        (country.name.toLowerCase().startsWith(value) ||
          country.dial_code.toLowerCase().startsWith(value))
      ) {
        countryData.push(country);
        return true;
      }
    });
    this.setState({flagsList: countryData});
  };
  _handleClearSearch = () => {
    this._handleOnSearchTextChange('');
    this.setState({searchText: '', isDisplaySearchTextInput: false});
  };
  _renderFlagSearch = () => {
    if (this.state.isDisplaySearchTextInput) {
      return (
        <View style={styles.SectionStyle}>
          <Search style={styles.iconSearch} />
          <TextInput
            underlineColor="transparent"
            placeholder="Search .."
            style={styles.TextInputStyleClass}
            onChangeText={value => this._handleOnSearchTextChange(value)}
            value={this.state.searchText}
          />
          <TouchableOpacity onPress={() => this._handleClearSearch()}>
            <Clear style={{fontSize: 17}} />
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.viewSearchIcon}>
        <TouchableOpacity onPress={this._handleFlagListSearchIconPress}>
          <Search />
        </TouchableOpacity>
      </View>
    );
  };
  _handleSetCountry = (name, dial_code) => {
    global.Country.getCountry(name, dial_code);
    this._handleGoBack();
  };
  render() {
    return (
      <View style={styles.viewFlagsListContainer}>
         <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#00BCD4" translucent = {false}/>
        <View style={styles.viewFlagTitleContainer}>
          <TouchableOpacity onPress={() => this._handleGoBack()}>
            <KeyBoardLeft />
          </TouchableOpacity>
          <View style={styles.viewFlagTitle}>
            <Text style={styles.textFlagTitle}>Select Country</Text>
          </View>
          {this._renderFlagSearch()}
        </View>
        <View>
          <FlatList
            data={this.state.flagsList}
            style={{marginBottom: 100}}
            keyboardShouldPersistTaps={true}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableWithoutFeedback
                onPress={() =>
                  this._handleSetCountry(item.name, item.dial_code)
                }>
                <View style={styles.countryStyle}>
                  <View style={styles.viewCountryName}>
                    <Text style={styles.textFontSize}>{item.name}</Text>
                  </View>
                  <View style={styles.viewCountryFlag}>
                    <Text style={styles.textFontSize}>{item.flag}</Text>
                  </View>
                  <View style={styles.viewCountryCode}>
                    <Text style={styles.textFontSize}>{item.dial_code}</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )}
          />
        </View>
      </View>
    );
  }
}
const mapDispatchToProps = {
  handleGoBack: goBack,
};

export default connect(
  null,
  mapDispatchToProps,
)(FlagsList);
