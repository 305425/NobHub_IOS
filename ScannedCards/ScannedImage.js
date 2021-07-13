import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  PixelRatio,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import CommonHeader from '../shared/CommonHeader';
import {Save, Retake, Camera, Rotate} from '../shared/Icon';
import {goBack} from '../Services/BackButtonServices';
import {connect} from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import {Actions} from 'react-native-router-flux';
import {CommonStyles} from '../shared/Constants';
class ScannedImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ImageSource: '',
      FileName: '',
      FrontImageBase64: '',
      CardName: '',
      ScanCardDetails: [],
      ImageSourceBack: '',
      isFlipped: false,
      BackFileName: '',
      BackImageBase64: '',
      IsDisabled: false,
      IsShowAlert: false,
      Text: '',
      CardNamesList: [],
    };
  }
  renderFrontImage = () => {
    if (this.state.ImageSource === '') {
      const {Source} = this.props;
      return (
        <View style={{flex: 1}}>
          <Image style={styles.image} source={{uri: Source}} />
        </View>
      );
    } else {
      return (
        <View style={{flex: 1}}>
          <Image style={styles.image} source={this.state.ImageSource} />
        </View>
      );
    }
  };
  renderBackImage = () => {
    if (this.state.ImageSourceBack === '') {
      return (
        <View style={{flex: 1, alignSelf: 'center'}}>
          {/* <Image
            style={{flex: 1}}
            resizeMode={'stretch'}
            // style={styles.image}
            source={require('../Images/NoImage.png')}
          /> */}
        </View>
      );
    } else {
      return (
        <View style={{flex: 1}}>
          <Image style={styles.image} source={this.state.ImageSourceBack} />
        </View>
      );
    }
  };
  _handleHeaderLeftIcon = () => {
    return (
      <View>
        <View style={styles.leftHeader}>
          {this.state.isFlipped ? (
            <Camera style={{color: CommonStyles.appColor, fontSize: 20}} />
          ) : (
            <Retake style={{color: CommonStyles.appColor, fontSize: 20}} />
          )}
        </View>
        <Text style={{fontSize: 10, color: '#ffffff', textAlign: 'center'}}>
          {this.state.isFlipped ? 'Camera' : 'ReTake'}
        </Text>
      </View>
    );
  };
  _handleHeaderRightIcon = () => {
    return (
      <View>
        <View
          style={[
            styles.leftHeader,
            {backgroundColor: this.state.IsDisabled ? '#e4e6e9' : '#ffffff'},
          ]}>
          {/* <TouchableOpacity onPress={() => this._handleSaveScannedCard()}> */}
          <Save style={{color: CommonStyles.appColor, fontSize: 20}} />
          {/* </TouchableOpacity> */}
        </View>
        <Text style={{fontSize: 10, color: '#ffffff', textAlign: 'center'}}>
          Save
        </Text>
      </View>
    );
  };
  _handleHeaderCenterIcon = () => {
    return (
      <View>
        <Text style={{color: '#ffffff', fontSize: 18, top:10}}>Scan Card</Text>
      </View>
    );
  };
  _handleHeaderText = () => {
    return null;
  };
  _handleOnCancelPress = () => {
    const {handleGoBack} = this.props;
    handleGoBack();
  };
  _handleHeaderLeftIconPress = () => {
    //const {handleGoBack} = this.props;
    //handleGoBack();
    this.RetakeImage();
  };
  componentDidMount = () => {
    this.GetAllScannedCardNames();
    try {
      fetch(global.APIURL + 'api/Card/GetScannedCardDetails', {
        method: 'GET',
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({ScanCardDetails: responseJson});
        });
    } catch (e) {
      Alert.alert(e);
    }
  };
  GetAllScannedCardNames = () => {
    try {
      fetch(global.APIURL + 'api/Card/GetScnnedCardNames', {
        method: 'GET',
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({CardNamesList: responseJson});
        });
    } catch (e) {
      Alert.alert(e);
    }
  };
  RetakeImage = () => {
    try {
      const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
        storageOptions: {
          skipBackup: true,
        },
      };

      ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
        } else if (response.error) {
        } else if (response.customButton) {
        } else {
          let source = {uri: response.uri};
          var fileType = response.uri;
          fileType = fileType.split('.');
          if (this.state.isFlipped) {
            //true means backside
            this.setState({
              ImageSourceBack: source,
              BackFileName:
                Platform.OS == 'android'
                  ? fileType.length == 2
                    ? fileType[1]
                    : fileType[2]
                  : fileType[1],
              BackImageBase64: response.data,
            });
            this.renderBackImage();
          } else {
            this.setState({
              ImageSource: source,
              FrontImageBase64: response.data,
              FrontFileName:
                Platform.OS == 'android'
                  ? fileType.length == 2
                    ? fileType[1]
                    : fileType[2]
                  : fileType[1],
            });
            this.renderFrontImage();
          }
        }
      });
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleBackSideView = () => {
    this.setState({isFlipped: !this.state.isFlipped});
  };
  _handleValidateCardName = CardName => {
    try {
      var obj = this.state.CardNamesList;
      var objectsAreSame = false;
      for (let index = 0; index < obj.length; index++) {
        var FileName = obj[index].filename.split('_');
        if (FileName[0].toLowerCase() === CardName.toLowerCase()) {
          objectsAreSame = true;
          break;
        }
      }
      return objectsAreSame;
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleSaveScannedCard = () => {
    this.setState({IsDisabled: true});
    const {FileName, ImageBase64, UserId, UserProfile} = this.props;
    const {CardName} = this.state;
    if (CardName) {
      if (this.state.IsDisabled) {
      } else {
        if (this._handleValidateCardName(CardName)) {
          this.setState({
            showAlert: true,
            Text: 'Card name should not be same',
            IsDisabled: true,
          });
          setTimeout(() => {
            this.setState({
              Text: '',
              showAlert: false,
              IsDisabled: false,
            });
          }, 4000);
        } else {
          try {
            var dataToSend = {
              FrontImgbase64:
                this.state.FrontImageBase64 === ''
                  ? ImageBase64
                  : this.state.FrontImageBase64,
              FrontFileName:
                this.state.FileName === '' ? FileName : this.state.FileName,
              UserId: UserId,
              CardName: this.state.CardName,
              BackImgbase64: this.state.BackImageBase64,
              BackFileName: this.state.BackFileName,
            };
            var formBody = [];
            for (var key in dataToSend) {
              var encodedKey = encodeURIComponent(key);
              var encodedValue = encodeURIComponent(dataToSend[key]);
              formBody.push(encodedKey + '=' + encodedValue);
            }
            formBody = formBody.join('&');
            return fetch(global.APIURL + 'api/Card/UploadScannedBusinessCard', {
              method: 'POST', //Request Type
              body: formBody, //post body
              headers: {
                'Content-Type':
                  'application/x-www-form-urlencoded;charset=UTF-8',
              },
            })
              .then(_response => _response.text())
              .then(_responseJson => {
                this.setState({
                  showAlert: true,
                  Text: 'Scanned card uploaded successfully ',
                });
                setTimeout(() => {
                  this.setState({
                    Text: '',
                    showAlert: false,
                    IsDisabled: false,
                  });
                  Actions.scannedCards({userProfile: UserProfile});
                }, 4000);
                //Alert.alert('Scanned card uploaded successfully');
              })
              .catch(e => Alert.alert('error in' + e));
          } catch (e) {
            Alert.alert(e);
          }
        }
      }
    } else {
      this.setState({
        showAlert: true,
        Text: 'Card name should not be empty ',
        IsDisabled: false,
      });
      setTimeout(() => {
        this.setState({
          Text: '',
          showAlert: false,
        });
      }, 4000);
      //Alert.alert('Cad name should not be empty');
    }
  };
  _handleHeaderProfileIcon = () => {
    return null;
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#f4f6f9'}}>
        <View style={{flex: 0.25}}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => this._handleHeaderRightIcon()}
            HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
            HeaderLeftIconPress={this._handleHeaderLeftIconPress}
            HeaderRightIconPress={this._handleSaveScannedCard}
            HeaderText={() => this._handleHeaderText()}
            HeaderProfileIcon={() => this._handleHeaderProfileIcon()}
            HeaderProfileIconPress={this._handleHeaderProfileIconPress}
            IsShowTextForTabs={false}
          />
        </View>
        {this.state.ImageSourceBack === '' && this.state.isFlipped && (
          <Text style={{alignSelf:"center", fontSize:15,margin:"1%"}}>Scan backside of the card</Text>
        )}
        {this.state.showAlert ? (
          <View style={{marginLeft: 20, marginTop: 10}}>
            <Text style={{color: '#a4a6a9'}}>{this.state.Text}</Text>
          </View>
        ) : null}
        <View style={{flex: 0.1, flexDirection: 'row', margin: 10}}>
          <View style={{flex: 1.5}}>
            <Text>
              {this.state.isFlipped
                ? 'Card Back Side Picture'
                : 'Card Front Side Picture'}
            </Text>
          </View>
          <View style={{flex: 1}} />
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <TouchableOpacity onPress={() => this._handleBackSideView()}>
              <Rotate style={{color: CommonStyles.appColor, fontSize: 30}} />
            </TouchableOpacity>
          </View>
        </View>
        {this.state.isFlipped ? (
          <View style={styles.RenderImage}>{this.renderBackImage()}</View>
        ) : (
          <View style={styles.RenderImage}>{this.renderFrontImage()}</View>
        )}
        <View style={{flex: 0.4, margin: 10}}>
          <Text>Card Name</Text>
          <TextInput
            placeholder="Enter Card Name"
            style={{flex: 0.3, borderColor: 'gray', borderBottomWidth: 1}}
            onChangeText={name => this.setState({CardName: name})}
            value={this.state.CardName}
          />
        </View>
        <View style={{flexDirection: 'row', flex: 0.1}}>
          <View style={{flex: 1}} />
          <View style={styles.cancelButtonView}>
            <TouchableOpacity onPress={() => this._handleOnCancelPress()}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}} />
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
)(ScannedImages);
const styles = StyleSheet.create({
  leftHeader: {
    flexDirection: 'column',
    height: 38,
    width: 38,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
  },
  RenderImage: {
    flex: 0.7,
    alignItems: 'stretch',
    //margin: 10,
    borderWidth: 1,
    borderColor: '#9B9B9B',
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  image: {
    borderRadius: 10,
    flex: 1,
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonView: {
    flex: 1,
    backgroundColor: CommonStyles.appColor,
    borderRadius: 20,
    alignSelf: 'center',
    paddingVertical: 8,
    borderColor: '#ffffff',
    borderWidth: 1,
  },
  touchableCancel: {
    flex: 0.15,
    backgroundColor: CommonStyles.appColor,
    //paddingVertical: 1.5,
    borderRadius: 50,
    alignItems: 'center',
    //marginBottom: 12,
    //paddingHorizontal: 30,
    marginLeft: 100,
    marginRight: 100,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    //fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
});
