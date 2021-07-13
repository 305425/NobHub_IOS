import React, {Component} from 'react';
import {View, FlatList, TouchableOpacity, Image} from 'react-native';
import {Block, Cancel, Check} from '../shared/Icon';
import {styles} from './Invitations.styles';
import {GilRoyMediumColor} from '../shared/Constants';
import {MediumBoldText, Text} from '../shared/Text';
const colors= [
  '#27BECF','#994F14','#DA291C','#FFCD00','#007A33','#EB9CA8', '#7C878E',
  '#8A004F','#000000','#10069F','#00a3e0','#4CC1A1','#915520', '#b3d962',
  '#67a8e0', '#c06dde', '#1ec952', '#cc1f36', '#0b615f', '#911c16'
]
export default class ReceiveInvitations extends Component {
  handleAcceptInvitation = (ToUserId, FromUserId, Name) => {
    const {AcceptInvitation} = this.props;
    AcceptInvitation(ToUserId, FromUserId, Name);
  };
  handleDeclineInvitation = (ToUserId, FromUserId, Name, InviteId) => {
    const {DeclineInvitation} = this.props;
    DeclineInvitation(ToUserId, FromUserId, Name, InviteId);
  };
  handleBlockInvitation = (ToUserId, FromUserId, Name, InviteId) => {
    const {BlockInvitation} = this.props;
    BlockInvitation(ToUserId, FromUserId, Name, InviteId);
  };
  InvitationsStyle = ({item,index}) => {
    var firstName = item.firstname == null ? '' : item.firstname;
    var lastName = item.lastname == null ? '' : item.lastname;
    var firstCharInName =
      firstName == null ? '' : firstName.toUpperCase().charAt(0);
    var firstCharInLastName =
      lastName == null ? '' : lastName.toUpperCase().charAt(0);
    return (
      <View style={styles.container}>
        <View style={{flex: 0.17, bottom:8}}>
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
        <View style={{flex: 0.61}}>
          <MediumBoldText style={styles.fromUser}>
            {firstName + ' ' + lastName}
          </MediumBoldText>
          <Text style={styles.title}>
            {item.title + ', ' + item.companyName}
          </Text>
          <Text style={styles.title}>{item.cstatus}</Text>
        </View>
        <View style={{flex: 0.23, flexDirection: 'row', bottom:8}}>
          <View style={styles.iconViewStyle}>
            <TouchableOpacity
              onPress={() =>
                this.handleAcceptInvitation(
                  item.cid,
                  item.refid,
                  item.firstname,
                  item.inviteid,
                )
              }>
              <Check style={styles.iconStyle} />
            </TouchableOpacity>
          </View>
          <View style={[styles.iconViewStyle, {marginLeft: 5}]}>
            <TouchableOpacity
              onPress={() =>
                this.handleDeclineInvitation(
                  item.cid,
                  item.refid,
                  item.firstname,
                  item.inviteid,
                )
              }>
              <Cancel style={styles.iconStyle} />
            </TouchableOpacity>
          </View>
          <View style={[styles.iconViewStyle, {marginLeft: 4}]}>
            <TouchableOpacity
              onPress={() =>
                this.handleBlockInvitation(
                  item.cid,
                  item.refid,
                  item.firstname,
                  item.inviteid,
                )
              }>
              <Block style={styles.iconStyle} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const {ReceiveInvitationLIst, InvitationName, showAlert} = this.props;
    return (
      <View style={{backgroundColor: '#f4f6f9', flex: 1}}>
        {showAlert ? (
          <View style={{marginLeft: 20, marginTop: 10}}>
            <Text style={{color: GilRoyMediumColor.fontColor}}>
              {InvitationName}
            </Text>
          </View>
        ) : null}
        {ReceiveInvitationLIst.length == 0 ? (
          <View>
            <Text style={{fontSize: 17, marginLeft: 10}}>
              No Invitations found.
            </Text>
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={true}
            data={ReceiveInvitationLIst}
            numColumns={1}
            renderItem={this.InvitationsStyle}
          />
        )}
      </View>
    );
  }
}
