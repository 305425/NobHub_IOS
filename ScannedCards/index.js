import React, {Component} from 'react';
import {View, Alert, Share, StyleSheet, Text, Image, Platform} from 'react-native';
import CommonHeader from '../shared/CommonHeader';
import {ArrowLeft} from '../shared/Icon';
import {goBack} from '../Services/BackButtonServices';
import {connect} from 'react-redux';
import Tabs from './Tabs';
import ScannedCardsProfiles from './ScannedCards';
import ArchivedCardsProfiles from './ArchivedCards';
import ServiceCalls from '../Services/APICalls';
import {Actions} from 'react-native-router-flux';
import {PlayStoreLink} from '../shared/Constants';
import {CommonStyles} from '../shared/Constants';
import {BoldText, MediumBoldText} from '../shared/Text';
import scanIcon from '../Images/scan.png';
import {handleOnScannerPress} from '../MyConnections/index.service';
import ImagePicker from 'react-native-image-picker';
class ScannedCardsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ScannedCardsTabColor: ['rgba(8,155,171,1)', 'rgba(17,203,223,1)'],
      ArchivedCardsTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      ScannedCardsIconColor: '#ffffff',
      ArchivedCardsIconColor: '#b3b3b3',
      IsScannedCards: true,
      IsArchivedCards: false,
      ScannedProfiles: [],
      ArchivedProfiles: [],
      IsDelete: false,
      DeletedPeopleList: [],
      BackGroundColor: '#f4f6f9',
      HeaderText: 'Scan cards',
      SuccessText: '',
      ShowAlert: false,
    };
  }
  componentDidMount = () => {
    const {userProfile} = this.props;
    try {
      ServiceCalls.handleGetUserScannedCardProfiles(userProfile.guid).then(
        response => {
          var _scannedProfiles = this.state.ScannedProfiles;
          var _archivedProfiles = this.state.ArchivedProfiles;
          var obj = response;
          obj.map(item => {
            if (item.status === 'U' || item.status === 'P') {
              _scannedProfiles.push(item);
              this.setState({ScannedProfiles: _scannedProfiles});
            } else {
              _archivedProfiles.push(item);
              this.setState({ArchivedProfiles: _archivedProfiles});
            }
          });
        },
      );
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleHeaderLeftIcon = () => {
    return (
      <View style={styles.leftHeader}>
        <ArrowLeft style={{color: CommonStyles.appColor, fontSize: 20}} />
      </View>
    );
  };
  _handleHeaderRightIcon = () => {
    return (
      <View>
        <View style={styles.leftHeader}>
      <Image source={scanIcon} style={{height:25, width:25, tintColor:CommonStyles.appColor}}/>
    </View>
    <Text style={{ color: '#ffffff', fontSize: 10, textAlign: 'center' }}>
    Scan
  </Text>
      </View>
    );
  };
  _handleHeaderCenterIcon = () => {
    return (
      <View style={styles.headerCenterView}>
        <Tabs
          onScannedCardsPress={() => this._handleOnScannedCardsTabPress()}
          onArchivedCardsPress={() => this._handleOnArchivedCardsTabPress()}
          ScannedCardsTabColor={this.state.ScannedCardsTabColor}
          ArchivedCardsTabColor={this.state.ArchivedCardsTabColor}
          ScannedCardsIconColor={this.state.ScannedCardsIconColor}
          ArchivedCardsIconColor={this.state.ArchivedCardsIconColor}
        />
      </View>
    );
  };
  _handleHeaderText = () => {
    return (
        <BoldText style={{color: '#ffffff', fontSize: 14, bottom:3}}>
          {this.state.HeaderText}
        </BoldText>
    );
  };
  _handleOnScannedCardsTabPress = () => {
    this.setState({
      ScannedCardsTabColor: ['rgba(8,155,171,1)', 'rgba(17,203,223,1)'],
      ArchivedCardsTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      ScannedCardsIconColor: '#ffffff',
      ArchivedCardsIconColor: '#b3b3b3',
      IsScannedCards: true,
      IsArchivedCards: false,
      HeaderText: 'Scan cards',
    });
  };
  _handleOnArchivedCardsTabPress = () => {
    this.setState({
      ScannedCardsTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      ArchivedCardsTabColor: ['rgba(8,155,171,1)', 'rgba(17,203,223,1)'],
      ScannedCardsIconColor: '#b3b3b3',
      ArchivedCardsIconColor: '#ffffff',
      IsScannedCards: false,
      IsArchivedCards: true,
      HeaderText: 'Archived cards',
    });
  };
  _handleHeaderLeftIconPress = () => {
    //const {handleGoBack} = this.props;
    //handleGoBack();
    Actions.myConnections();
  };
  _handleHeaderRightIconPress = () => {
    const {userProfile} = this.props;
    if (Platform.OS == 'android') {
     // this.setState({swipeablePanelActive: false});
      handleOnScannerPress(userProfile).then(() => {
        //this.props.clearMyConnectionDetails();
        //this.props.setMyConnectionDetails(global.MyConnections.state.MyContacts);
      });
    } else {
      const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
      };
      ImagePicker.showImagePicker(options, response => {
        this.setState({swipeablePanelActive: false});
        if (response.didCancel) {
        } else if (response.error) {
        } else if (response.customButton) {
        } else {
          var fileType = response.uri;
          fileType = fileType.split('.');
          Actions.scannedImages({
            FileName: fileType[1],
            ImageBase64: response.data,
            UserId: userProfile.guid,
            Source: response.uri,
            UserProfile: userProfile,
          });
        }
      });
    }
  };
  _handleOnScanCardPress = (contactData, type) => {
    try {
      if (this.state.IsDelete) {
        this.onLongPressShowTabs(contactData, type);
      } else {
        var tempArray = contactData.fileName.split('_');
        var imgDisplayName =
          tempArray[0] + ' ' + tempArray[1] + ' ' + tempArray[2];
        Actions.imageView({
          FileName: contactData.fileName,
          DisplayName: imgDisplayName,
          ContactData: contactData,
        });
      }
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleOnInvitePress = () => {
    try {
      Share.share({
        title: 'CHECK OUT THIS COOL NEW APP - NOBHUB',
        message:
          'Hey! Download this awesome app from the Google Play Store/Apple App Store. You can install NobHub here: ' +
          '\n' +
          PlayStoreLink.android,
      })
        .then(() => {})
        .catch(errorMsg => Alert.alert(errorMsg));
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleOnScannedCardsLongPress = (contactData, type) => {
    try {
      if (!this.state.IsDelete) {
        this.onLongPressShowTabs(contactData, type);
        this.setState({IsDelete: true, BackGroundColor: 'red'});
      }
    } catch (e) {
      Alert.alert(e);
    }
  };
  onLongPressShowTabs = (item, type) => {
    try {
      var scannedPeopleInContacts = [];
      if (type == 'A') {
        scannedPeopleInContacts = this.state.ArchivedProfiles;
      } else {
        scannedPeopleInContacts = this.state.ScannedProfiles;
      }

      scannedPeopleInContacts.map(data => {
        if (data.guid === item.guid) {
          data.check = !data.check;
          if (data.check === true) {
            this.state.DeletedPeopleList.push(item.guid);
          } else if (data.check === false) {
            const index = this.state.DeletedPeopleList.indexOf(item.guid);
            if (index > -1) {
              this.state.DeletedPeopleList.splice(index, 1);
            }
          }
        }
      });
      if (type == 'A') {
        this.setState({ArchivedProfiles: scannedPeopleInContacts});
      } else {
        this.setState({ScannedProfiles: scannedPeopleInContacts});
      }

      if (this.state.DeletedPeopleList.length === 0) {
        this.setState({IsDelete: false, BackGroundColor: '#f4f6f9'});
      }
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleOnDeletePress = () => {
    var that = this;
    try {
      ServiceCalls._handleDeleteScannedCards(this.state.DeletedPeopleList).then(
        response => {
          if (response === 'Deleted Sucessfully') {
            this.setState({
              IsDelete: false,
              SuccessText: 'Successfully deleted',
              ShowAlert: true,
            });
            this.state.DeletedPeopleList.forEach(function(data) {
              that.setState({
                ScannedProfiles: that.state.ScannedProfiles.filter(list => {
                  return list.guid !== data;
                }),
              });
            });
            setTimeout(() => {
              this.setState({
                SuccessText: '',
                ShowAlert: false,
              });
            }, 5000);
          }
        },
      );
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleHeaderProfileIcon = () => {
    const {userProfile} = this.props;
    return null;
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#f4f6f9'}}>
        <View style={{flex: 0.2}}>
          <CommonHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderRightIcon={() => this._handleHeaderRightIcon()}
            HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
            HeaderLeftIconPress={this._handleHeaderLeftIconPress}
            HeaderRightIconPress={() => this._handleHeaderRightIconPress()}
            HeaderText={() => this._handleHeaderText()}
            HeaderProfileIcon={() => this._handleHeaderProfileIcon()}
            HeaderProfileIconPress={this._handleHeaderProfileIconPress}
            IsShowTextForTabs={true}
            TabLabel1={'List'}
            TabLabel2={'Archived'}
          />
        </View>
        {this.state.ShowAlert ? (
          <View>
            <Text style={{textAlign: 'center'}}>{this.state.SuccessText}</Text>
          </View>
        ) : null}
        <View style={{flex: 1.2}}>
          {this.state.ScannedProfiles.length > 0 &&
          this.state.IsScannedCards ? (
            <ScannedCardsProfiles
              ScannedContacts={this.state.ScannedProfiles}
              onScanCardPress={(contactData, type) =>
                this._handleOnScanCardPress(contactData, type)
              }
              onInvitePress={this._handleOnInvitePress}
              onScannedCardsLongPress={(contactData, type) =>
                this._handleOnScannedCardsLongPress(contactData, type)
              }
              IsDelete={this.state.IsDelete}
              backgroundColor={this.state.BackGroundColor}
              onDeletePress={this._handleOnDeletePress}
            />
          ) : this.state.IsArchivedCards ? (
            <ArchivedCardsProfiles
              ArchivedContacts={this.state.ArchivedProfiles}
              onArchivedCardPress={(contactData, type) =>
                this._handleOnScanCardPress(contactData, type)
              }
              onArchivedCardsLongPress={(contactData, type) =>
                this._handleOnScannedCardsLongPress(contactData, type)
              }
              IsDelete={this.state.IsDelete}
              backgroundColor={this.state.BackGroundColor}
              onDeletePress={this._handleOnDeletePress}
            />
          ) : null}
        </View>
      </View>
    );
  }
}
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
  headerCenterView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 1,
  },
});
const mapDispatchToProps = {
  handleGoBack: goBack,
};

export default connect(
  null,
  mapDispatchToProps,
)(ScannedCardsContainer);
