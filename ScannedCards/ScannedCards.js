import React, {Component} from 'react';
import {View, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import {styles} from './ScannedCars.styles';
import Images from '../Images';
import {Thumbnail} from 'native-base';
import {Text, MediumBoldText} from '../shared/Text';
import {CircleCheck, Delete} from '../shared/Icon';
import {CommonStyles} from '../shared/Constants';
export default class ContactsList extends Component {
  constructor(props) {
    super(props);
  }
  _renderImageData = contactData => {
    return (
      <View>
        <Thumbnail
          medium
          source={{
            uri:
              global.APIURL + 'uploadimgs/scannedcards/' + contactData.fileName,
          }}
        />
        {contactData.check ? (
          <View style={styles.CircleView}>
            <CircleCheck
              style={{
                color: CommonStyles.appColor,
                fontSize: 13,
                marginTop: 4,
              }}
            />
          </View>
        ) : null}
      </View>
    );
  };
  _handleOnScannedPress = item => {
    const {onScanCardPress} = this.props;
    onScanCardPress(item, 'S');
  };
  _handleOnLongPress = item => {
    const {onScannedCardsLongPress} = this.props;
    onScannedCardsLongPress(item, 'S');
  };
  _renderContactDetails = item => {
    const {onInvitePress} = this.props;
    var tempArray = item.fileName.split('_');
    //var fileName = tempArray[0] + ' ' + tempArray[1] + ' ' + tempArray[2];
    var fileName = tempArray[0];
    var dateArray = item.date.split('T');
    var date = dateArray[0];
    var displayDate = date.split('-');

    return (
      <View style={styles.viewContactDetails}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <MediumBoldText style={styles.textName_fileName}>
              {fileName}
            </MediumBoldText>
            <Text style={styles.textName_date}>
              {displayDate[2] + '-' + displayDate[1] + '-' + displayDate[0]}
            </Text>
          </View>
          <View style={{flex: 0.8, marginTop: 5}}>
            {item.status == 'U' ? (
              <TouchableOpacity
                style={[
                  styles.touchableOpacity_Processing,
                  {backgroundColor: '#e0e0e0'},
                ]}>
                <Text style={styles.textName_Processing}>Processing.....</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.touchableOpacity_Processing}
                onPress={onInvitePress}>
                <Text style={styles.textName_Invite}>Invite</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };
  renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => this._handleOnScannedPress(item)}
        onLongPress={() => this._handleOnLongPress(item)}>
        <View style={styles.viewContact}>
          <View style={styles.viewFabContainer}>
            {this._renderImageData(item)}
          </View>
          {this._renderContactDetails(item)}
        </View>
      </TouchableOpacity>
    );
  };
  ShowTabs = () => {
    const {IsDelete, onDeletePress} = this.props;
    if (IsDelete) {
      return (
        <View style={styles.Tabs}>
          <View style={{flex: 0.5, paddingTop: 10}}>
            <TouchableOpacity onPress={onDeletePress}>
              <Delete style={{color: CommonStyles.appColor}} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;
  };
  render() {
    const {ScannedContacts, BackGroungColor, IsDelete} = this.props;
    return (
      <View
        style={[
          styles.viewContactContainer,
          {backgroundColor: BackGroungColor},
        ]}>
        <View style={{flex: 5, position: 'relative'}}>
          <FlatList
            showsVerticalScrollIndicator={true}
            data={ScannedContacts}
            renderItem={item => this.renderItem(item)}
          />
        </View>
        {IsDelete ? (
          <View
            style={{
              flex: 1,
              position: 'absolute',
              left: Dimensions.get('window').width - 50,
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            {this.ShowTabs()}
          </View>
        ) : null}
      </View>
    );
  }
}
