import React, {Component} from 'react';
import {Dimensions, View, Alert} from 'react-native';
import {connect} from 'react-redux';
import BusinessCard from './BusinessCard';
import {clearUserProfile} from '../state/operations';
import ServiceCalls from '../Services/APICalls';
import {PlayStoreLink} from '../shared/Constants';
import Share from 'react-native-share';
import files from '../files/filesBase64';
import base64 from 'react-native-base64';
class BusinessCardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IWidth: 0,
      IHeight: 0,
      CardHeight: '',
      CardWidth: '',
      AspectRatio: '',
      CardFrontFile: '',
      CardBackFile: '',
      HeightMultiple: '',
      UserCardDetails: [],
      ActiveCarddetaills: [],
      isFlipped: false,
      URL:[]
    };
    global.BusinessCard = this;
  }

  componentDidMount = () => {
    const {userProfile} = this.props;
    const UserId = userProfile.guid;
    const Theme = userProfile.theme;
    this.GetUserDefaultCardByUserId(UserId);
    this.GetActiveCarddetaillsById(Theme);
  };
  GetUserDefaultCardByUserId = UserId => {
    try {
      ServiceCalls.GetUserDefaultCardByUserId(UserId)
        .then(response => {
          this.setState({UserCardDetails: response});
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  // _handleOnSharePress = () => {
  //   try {
  //     //var date = new Date();
  //     //date =
  //     //date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  //     let today = new Date();
  //     let date =
  //       today.getFullYear() +
  //       '-' +
  //       parseInt(today.getMonth() + 1) +
  //       '-' +
  //       today.getDate();
  //     var _data = base64.encode(`${global.LoginUserId}`);
  //     Share.share({
  //       title: 'CHECK OUT THIS COOL NEW APP - NOBHUB',
  //       message:
  //         global.APIURL +
  //         `BusinessCards/ShareCard?UserId=${_data}&datetime=${date}&isShare=${true}&LogInUserId=${
  //           global.LoginUserId
  //         }` +
  //         '\n' +
  //         '\n' +
  //         '\n' +
  //         'Hey! Download this awesome app from the Google Play Store/Apple App Store. You can install NobHub here: ' +
  //         '\n' +
  //         PlayStoreLink.android,
  //     })
  //       .then(() => {})
  //       .catch(errorMsg => Alert.alert(errorMsg.message));
  //     //var _data = base64.encode(`${426}`);
  //   } catch (e) {
  //     Alert.alert(e.message);
  //   }
  // };
  _handleOnSharePress = async () => {
    let today = new Date();
    let date =
      today.getFullYear() +
      '-' +
      parseInt(today.getMonth() + 1) +
      '-' +
      today.getDate();
    var _list = this.state.URL;
    var _data = base64.encode(`${global.LoginUserId}`);
    _list.push(
      global.APIURL +
      `BusinessCards/ShareCard?UserId=${_data}&datetime=${date}&isShare=${true}` +
      '\n',
    );
    this.setState({ URL: _list });
    console.log("Link", this.state.URL)
    await fetch(
      `https://tinyurl.com/api-create.php?url=${this.state.URL}`,
      {
        method: 'GET',
      },
    )
      .then((response) => response.text())
      //Response to text
      .then((responseJson) => {
        //Printing the Response String
        console.log(responseJson);
        const shareOptions = {
          title: 'CHECK OUT THIS COOL NEW APP - NOBHUB',
          message:
            responseJson +
            '\n' +
            '\n' +
            '\n' +
            'Hey! Download this awesome app from the Google Play Store/Apple App Store. You can install NobHub here: ' +
            '\n' +
            PlayStoreLink.android,
          url: files.appLogo,
          // urls: [files.image1, files.image2]
        }

        try {
          const ShareResponse = Share.open(shareOptions);
          console.log(JSON.stringify(ShareResponse));
        } catch (error) {
          console.log('Error => ', error);
        }
      })
  };
  GetActiveCarddetaillsById = Theme => {
    try {
      ServiceCalls.GetActiveCarddetaillsById(Theme)
        .then(response => {
          let _x = JSON.parse(JSON.stringify(response));
          this.setState({ActiveCarddetaills: _x});

          if (_x.cardshape === 1) {
            //horizontal
            var Width = 494;

            var _windowWidth = Dimensions.get('window').width;

            var Height = 280;

            var _aspectRatio = Height / Width;

            this.setState({AspectRatio: _aspectRatio});

            var _refHeight = _aspectRatio * _windowWidth;

            this.setState({IHeight: _refHeight});

            this.setState({IWidth: _windowWidth});
          } else {
            //Vertical
            var Width = 280;

            var Height = 494;

            var _aspectratio = Width / Height;

            this.setState({AspectRatio: _aspectratio});

            var _refWidth = _aspectratio * Height;

            this.setState({IHeight: Height});

            this.setState({IWidth: _refWidth});

            // var Width = 280;

            // var Height = 494;

            // var _aspectRatio = Width / Height;

            // this.setState({AspectRatio: _aspectRatio});

            // var _refWidth = _aspectRatio * Dimensions.get('window').width;

            // this.setState({IHeight: Dimensions.get('window').width});

            // this.setState({IWidth: _refWidth});
          }
          var _height =
            (this.state.IHeight - 20) / (_x.cardshape === 1 ? 280 : 494);
          this.setState({HeightMultiple: _height});
        })
        .catch(error => {
          Alert.alert(error.message);
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  };
  _handleOnFlipPress = () => {
    this.setState({isFlipped: !this.state.isFlipped});
  };
  render() {
    const {userProfile,isFromSelectBusinessCard} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: '#f4f6f9',bottom:0}}>
        <View style={{flex: 1}}>
          <BusinessCard
            isStyleEnable={true}
            onPressFlip={isFlipped => this._handleOnFlipPress(isFlipped)}
            UserCardDetails={this.state.UserCardDetails}
            ActiveCarddetaills={this.state.ActiveCarddetaills}
            IWidth={this.state.IWidth}
            IHeight={this.state.IHeight}
            HeightMultiple={this.state.HeightMultiple}
            isFlipped={this.state.isFlipped}
            userProfile={userProfile}
            isFromSelectBusinessCard={isFromSelectBusinessCard}
            OnSharePress={() => this._handleOnSharePress()}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    userProfile: state.user.userProfile,
    businessCardDetails: state.BusinessCards.businessCardDetails,
  };
};
const mapDispatchToProps = {
  clearUserProfile,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BusinessCardContainer);
