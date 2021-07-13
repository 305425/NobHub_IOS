import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Picker,
  Alert,
} from 'react-native';
import CountryFlagList from '../shared/Login/Countries';
export default class ChangeNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SelectedCcode: '',
      CountryCode: CountryFlagList,
      Ccode: '',
      Cname: '',
      MobileNumber: 0,
      UserId: 0,
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('Change Number', 'Change Number'),
      headerStyle: {
        backgroundColor: navigation.getParam('BackgroundColor', 'white'),
      },
      headerTintColor: navigation.getParam('HeaderTintColor', '#029fae'),
    };
  };
  componentDidMount = () => {
    const {navigation} = this.props;
    const UserId = navigation.getParam('UserId', 0);
    this.setState({UserId: UserId});
    try {
      fetch('http://www.geoplugin.net/json.gp')
        .then(response => response.json())
        .then(responseJson => {
          var Ccode = responseJson.geoplugin_countryCode;
          var resultObject = this.search(Ccode, this.state.CountryCode);
          this.setState({
            Ccode: resultObject.dial_code.replace(/[^a-zA-Z0-9+ ]/g, ''),
          });
          this.setState({Cname: resultObject.code});
        })
        .catch(error => Alert.alert(error)); //to catch the errors if any
    } catch (e) {
      Alert.alert(e);
    }
  };
  search(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].code === nameKey) {
        return myArray[i];
      }
    }
  }
  loadUserTypes() {
    return this.state.CountryCode.map(user => (
      <Picker.Item label={user.name + user.dial_code} value={user.dial_code} />
    ));
  }
  UpdateMobileNumber() {
    const {MobileNumber} = this.state;
    const {SelectedCcode} = this.state;
    try {
      if (MobileNumber) {
        var dataToSend = {
          MobileNumber: MobileNumber,
          CountryCode: SelectedCcode == '' ? this.state.Ccode : SelectedCcode,
          SelectedCcode,
          UserId: this.state.UserId,
        };
        var formBody = [];
        for (var key in dataToSend) {
          var encodedKey = encodeURIComponent(key);
          var encodedValue = encodeURIComponent(dataToSend[key]);
          formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');
        fetch(global.APIURL + 'api/Account/UpdateMobileNumber', {
          method: 'POST', //Request Type
          body: formBody, //post body
          headers: {
            //Header Defination
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
        })
          .then(response => response.text())
          .then(responseJson => {
            if (responseJson) {
              Alert.alert('successfully updated');
            }
          });
      } else {
        Alert.alert('Enter Mobile Number');
      }
    } catch (e) {}
  }
  render() {
    return (
      <View>
        <View style={{height: 20}} />
        <View style={{width: Dimensions.get('window').width - 20, margin: 10}}>
          <Text style={styles.text}>
            Changing your phone number will migrate your account info and
            settings.
          </Text>
          <Text style={[styles.text, {marginBottom: 20}]}>
            Before proceeding, please confirm that you are able to receive SMS
            at your new number
          </Text>
          <View style={styles.inputContainer}>
            <Picker
              style={styles.pickerStyle}
              placeholder="Select country code"
              selectedValue={this.state.SelectedCcode}
              onValueChange={(itemValue) =>
                this.setState({SelectedCcode: itemValue})
              }>
              <Picker.Item
                label={this.state.Cname + this.state.Ccode}
                value={this.state.Ccode}
              />
              {this.loadUserTypes()}
            </Picker>
          </View>
          <TextInput
            placeholder={'Phone Number'}
            style={styles.textinput}
            onChangeText={MobileNumber => this.setState({MobileNumber})}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.UpdateMobileNumber()}>
            <Text style={[styles.text, {backgroundColor: '#029fae'}]}>
              UPDATE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#029fae',
    color: 'black',
    padding: 10,
    marginLeft: 35,
    marginRight: 35,
    borderRadius: 30,
  },
  text: {
    fontSize: 18,
    color: 'black',
    padding: 5,
    backgroundColor: 'white',
  },
  textinput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 30,
    textAlign: 'center',
    fontSize: 15,
  },
  inputContainer: {
    borderBottomColor: '#34abeb',
    borderBottomWidth: 1,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  pickerStyle: {
    fontSize: 14,
    height: 45,
    width: 350,
    color: '#344953',
    justifyContent: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'red',
    overflow: 'hidden',
    margin: 10,
  },
});
