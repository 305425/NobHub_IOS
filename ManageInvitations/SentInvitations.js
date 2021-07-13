import React, {Component} from 'react';
import {View, FlatList, TouchableOpacity, Image} from 'react-native';
import {Delete, Repeat} from '../shared/Icon';
import {styles} from './Invitations.styles';
import {CommonStyles, GilRoyMediumColor} from '../shared/Constants';
import {MediumBoldText, Text} from '../shared/Text';
const colors= [
  '#27BECF','#994F14','#DA291C','#FFCD00','#007A33','#EB9CA8', '#7C878E',
  '#8A004F','#000000','#10069F','#00a3e0','#4CC1A1','#915520', '#b3d962',
  '#67a8e0', '#c06dde', '#1ec952', '#cc1f36', '#0b615f', '#911c16'
]
export default class SentInvitations extends Component {
  InvitationsStyle = ({item,index}) => {
    var firstName = item.firstname == null ? '' : item.firstname;
    var lastName = item.lastname == null ? '' : item.lastname;
    var firstCharInName =
      firstName == null ? '' : firstName.toUpperCase().charAt(0);
    var firstCharInLastName =
      lastName == null ? '' : lastName.toUpperCase().charAt(0);
    return (
      <View style={styles.container}>
        <View style={{flex: 0.17}}>
          {item.image != '' && item.image != null ? (
            <Image
              source={{
                uri: global.APIURL + 'uploadimgs/ProfilePictures/' + item.image,
              }}
              style={[styles.fab]}
            />
          ) : (
            <View style={{fontSize: 26,
              color: '#ffffff',
              height: 55,
              width: 55,
              borderRadius: 110,
              backgroundColor: colors[index%colors.length],
              justifyContent: 'center'}}>
              <Text
                style={{
                  fontSize: 26,
                  color: '#ffffff',
                  textAlign: 'center',
                }}>
                {firstCharInName + firstCharInLastName}
              </Text>
            </View>
          )}
        </View>
        <View style={{flex: 0.66}}>
          <MediumBoldText style={styles.fromUser}>
            {firstName + ' ' + lastName}
          </MediumBoldText>
          <Text style={styles.title}>
            {item.title + ', ' + item.companyName}
          </Text>
          <Text style={[styles.title, {marginTop: 8}]}>{item.cstatus}</Text>
        </View>
        <View style={{flex: 0.18, flexDirection: 'row'}}>
          <View style={styles.iconViewStyle}>
            <TouchableOpacity
              onPress={() =>
                this.handleDeleteInvitation(item.inviteid, item.firstname)
              }>
              <Delete style={styles.iconStyle} />
            </TouchableOpacity>
          </View>
          <View style={[styles.iconViewStyle, {marginLeft: 5}]}>
            <TouchableOpacity
              onPress={() =>
                this.handleSendInvitationAgain(
                  item.cid,
                  item.refid,
                  item.firstname,
                )
              }>
              <Repeat style={styles.iconStyle} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  handleSendInvitationAgain = (ToUserId, FromUserId, Name) => {
    const {SendInvitationAgain} = this.props;
    SendInvitationAgain(ToUserId, FromUserId, Name);
  };
  handleDeleteInvitation = (InvitationId, Name) => {
    const {DeleteInvitation} = this.props;
    DeleteInvitation(InvitationId, Name);
  };
  render() {
    const {SentInvitationList, InvitationName, showAlert} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: '#f4f6f9'}}>
        {showAlert ? (
          <View style={{marginLeft: 20, marginTop: 10}}>
            <Text style={{color: GilRoyMediumColor.fontColor}}>
              {InvitationName}
            </Text>
          </View>
        ) : null}
        {SentInvitationList.length === 0 ? (
          <View style={{flex: 1}}>
            <Text style={{fontSize: 17, marginLeft: 10}}>
              No Invitations found.
            </Text>
          </View>
        ) : (
          <View>
            <FlatList
              showsVerticalScrollIndicator={true}
              data={SentInvitationList}
              numColumns={1}
              renderItem={item => this.InvitationsStyle(item)}
            />
          </View>
        )}
      </View>
    );
  }
}
