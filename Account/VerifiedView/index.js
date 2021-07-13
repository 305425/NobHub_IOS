import React, {Component} from 'react';
import {
  View,
  // Text,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Images from '../../Images';
import {Actions} from 'react-native-router-flux';
import ContinueButton from '../../shared/Button';
import TopBackground from '../TopBackground';
import BottomBackground from '../BottomBackground';
import {Text, BoldText} from '../../shared/Text';
export default class VerifiedView extends Component {
  constructor(props) {
    super(props);
  }
  _handleOnContinueButtonPress = () => {
    const {MobileNumber, CountryCode, Registration} = this.props;
    if (Registration) {
      Actions.personalDetails({
        Mobile: MobileNumber,
        CountryCode: CountryCode,
      });
    } else {
      Actions.myConnections();
    }
  };
  render() {
    const {Text1, Text2, Text3} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: '#f5f6fa'}}>
        <TopBackground />
        <View style={styles.textView}>
          <View style={styles.viewFlex}>
            <Text style={styles.text}>{Text1}</Text>
            <Text style={styles.text}>{Text2}</Text>
            <Text style={styles.text}>{Text3}</Text>
          </View>
          <View style={styles.bottomButton}>
            <ContinueButton
              accessibilityLabel="loginVerified"
              buttonColor={styles.button}
              buttonTitle={'Continue'}
              isDisabled={false}
              onButtonPress={() => this._handleOnContinueButtonPress()}
            />
          </View>
        </View>
        <BottomBackground />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewHeight: {marginTop: 10},
  continueText: {color: 'white', fontSize: 15},
  viewFlex: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  imageAlign: {alignSelf: 'center'},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  imageBackground: {width: '100%', height: '100%'},
  text: {
    fontSize: 20,
    color: '#000',
    padding: 20,
  },
  button: {
    backgroundColor: '#08a0af',
  },
  bottomButton: {
    justifyContent: 'flex-end',
    flex: 0.5,
    marginBottom: 45,
    zIndex: 1000,
  },
  imageBackgroundBottom: {
    flex: 1,
    flexWrap: 'wrap',
    paddingTop: 115,
    paddingRight: 450,
    paddingLeft: 55,
  },
  textView: {
    flex: 5,
  },
  curveShape: {
    width: 32,
    height: 95,
    position: 'absolute',
    right: 0,
    top: 70,
  },
});
