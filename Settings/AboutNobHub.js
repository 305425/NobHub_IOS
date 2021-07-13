import React, {Component} from 'react';
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
export default class AboutNobHub extends Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      title: 'About NobHub', // navigation.getParam('Name'),
      headerStyle: {
        backgroundColor: navigation.getParam('BackgroundColor', 'white'),
      },
      headerTintColor: navigation.getParam('HeaderTintColor', '#029fae'),
    };
  };
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 2,
          width: '100%',
          backgroundColor: '#029fae',
        }}
      />
    );
  };
  RedirectTomenu(Value) {
    if (Value == 'Features') {
      this.props.navigation.navigate('Features', {IsFrom: 'Features'});
    }
    if (Value == 'Terms of Services') {
      this.props.navigation.navigate('Features', {IsFrom: 'Terms of service'});
    }
    if (Value == 'Privacy Policy') {
      this.props.navigation.navigate('Features', {IsFrom: 'Privacy Policy'});
    }
  }

  render() {
    return (
      <View>
        <FlatList
          showsVerticalScrollIndicator={true}
          data={[
            {key: 'Features', Value: 'Features'},
            {key: 'Terms of Services', Value: 'Terms of Services'},
            {key: 'Privacy Policy', Value: 'Privacy Policy'},
          ]}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => this.RedirectTomenu(item.Value)}>
              <Text style={{padding: 10, fontSize: 18, height: 44}}>
                {item.key}
              </Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={this.renderSeparator}
        />
      </View>
    );
  }
}
