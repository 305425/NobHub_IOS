import React, {Component} from 'react';
import {View, Alert, StyleSheet, BackHandler, Text} from 'react-native';
import {goBack} from '../Services/BackButtonServices';
import {connect} from 'react-redux';
import ServiceCalls from '../Services/APICalls';
import {
  setMyConnectionDetails,
  clearMyConnectionDetails,
} from '../state/operations';
import CustomHeader from '../shared/CommonHeader';
import {ArrowLeft} from '../shared/Icon';
import Tabs from './Tabs';
import ReceiveInvitations from './ReceiveInvitations';
import SentInvitations from './SentInvitations';
import BlockInvitations from './BlockedInvitations';
import moment from 'moment';
import {MediumBoldText, BoldText} from '../shared/Text';
import {CommonStyles} from '../shared/Constants';
class ManageInvitations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IsReceived: true,
      IsSent: false,
      IsBlock: false,
      SentInvitationList: [],
      ReceiveInvitationLIst: [],
      BlockedInvitationList: [],
      receiveTabColor: ['#089bab', '#11cbdf'],
      sendTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      blockTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      ReceiveIconColor: '#ffffff',
      SentIconColor: '#777777',
      BlockIconColor: '#777777',
      HeaderText: 'Received Invitations',
      showAlert: false,
      Name: '',
    };
    global.MyInvitations = this;
    BackHandler.addEventListener('hardwareBackPress', this.back_Button_Press);
  }
  back_Button_Press = () => {
    global.HomePage.getInvitations();
  };
  _handleOnReceivedPress = () => {
    this.setState({
      IsSent: false,
      receiveTabColor: ['#089bab', '#11cbdf'],
      sendTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      blockTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      IsReceived: true,
      IsBlock: false,
      ReceiveIconColor: '#ffffff',
      SentIconColor: '#777777',
      BlockIconColor: '#777777',
      HeaderText: 'Received Invitations',
    });
  };
  _handleOnSentPress = () => {
    this.setState({
      IsSent: true,
      receiveTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      sendTabColor: ['#089bab', '#11cbdf'],
      blockTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      IsReceived: false,
      IsBlock: false,
      ReceiveIconColor: '#777777',
      SentIconColor: '#ffffff',
      BlockIconColor: '#777777',
      HeaderText: 'Pending Invitations',
    });
  };
  _handleBlockPress = () => {
    this.setState({
      IsSent: false,
      receiveTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      sendTabColor: ['rgb(255,255,255)', 'rgb(255,255,255)'],
      blockTabColor: ['#089bab', '#11cbdf'],
      IsReceived: false,
      IsBlock: true,
      ReceiveIconColor: '#777777',
      SentIconColor: '#777777',
      BlockIconColor: '#ffffff',
      HeaderText: 'Blocked Requests',
    });
  };
  GetSentInvitationList = UserId => {
    try {
      ServiceCalls.handleGetSentInvitations(UserId).then(response => {
        for (let i = 0; i < response.length; i++) {
          var status = this.calculateDateDiff(response[i].inviteddate);
          response[i].cstatus = status;
        }
        this.setState({SentInvitationList: response});
      });
    } catch (e) {}
  };
  GetReceiveInvitationList = UserId => {
    try {
      ServiceCalls.handleGetReceiveInvitationList(UserId).then(response => {
        this.setState({ReceiveInvitationLIst: response});
      });
    } catch (e) {}
  };
  GetBlockedInvitationList = UserId => {
    try {
      ServiceCalls.handleGetBlockedInvitations(UserId).then(response => {
        for (let i = 0; i < response.length; i++) {
          var status = this.calculateDateDiff(response[i].inviteddate);
          response[i].cstatus = status;
        }
        this.setState({BlockedInvitationList: response});
      });
    } catch (e) {}
  };
  calculateDateDiff(InvitedDate) {
    if (InvitedDate == null) {
      return '';
    } else {
      const CurrentDate = moment.utc();
      const _acceptedDate = moment.utc(InvitedDate);
      var dateDiffInYears = _acceptedDate.diff(CurrentDate, 'years').toString();
      var dateDiffInMonths = _acceptedDate
        .diff(CurrentDate, 'months')
        .toString();
      var dateDiffInDays = _acceptedDate.diff(CurrentDate, 'days').toString();
      var dateDiffInHours = _acceptedDate.diff(CurrentDate, 'hour').toString();
      dateDiffInDays = dateDiffInDays.replace(/-/g, '');
      dateDiffInYears = dateDiffInYears.replace(/-/g, '');
      dateDiffInMonths = dateDiffInMonths.replace(/-/g, '');
      dateDiffInHours = dateDiffInHours.replace(/-/g, '');
      if (dateDiffInYears == 0) {
        if (dateDiffInMonths == 0) {
          if (dateDiffInDays == 0) {
            if (dateDiffInHours != 0) {
              return 'Sent ' + dateDiffInHours + ' hour ago';
            }
          } else {
            if (dateDiffInDays >= 1 && dateDiffInDays < 7) {
              return 'Sent ' + dateDiffInDays + 'days ago';
            } else if (dateDiffInDays >= 7 && dateDiffInDays < 14) {
              return 'Sent 1 week ago';
            } else if (dateDiffInDays >= 14 && dateDiffInDays < 21) {
              return 'Sent 2 weeks ago';
            } else if (dateDiffInDays >= 21 && dateDiffInDays < 28) {
              return 'Sent 3 weeks ago';
            } else if (dateDiffInDays >= 28) {
              return 'Sent 4 weeks ago';
            }
          }
        } else {
          return 'Sent ' + dateDiffInMonths + ' month ago';
        }
      } else {
        return 'Sent ' + dateDiffInYears + ' year ago';
      }
    }
  }
  componentDidMount = () => {
    const {UserId} = this.props;
    this.GetReceiveInvitationList(UserId);
    this.GetSentInvitationList(UserId);
    this.GetBlockedInvitationList(UserId);
  };
  _handleSendInvitationAgain = (ToUserId, FromUserId, Name) => {
    try {
      ServiceCalls.handleSendInvitation(
        FromUserId,
        ToUserId,
        global.LoginUserName,
      ).then(response => {
        this.setState({
          showAlert: true,
          Name: 'Your invitation was resent to ' + Name,
        });
        setTimeout(() => {
          this.setState({
            Name: '',
            showAlert: false,
          });
        }, 10000);
      });
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleDeleteInvitation = InvitationId => {
    try {
      ServiceCalls.handleDeleteSentInvitations(InvitationId).then(() => {
        var obj = this.state.SentInvitationList;
        this.setState({
          SentInvitationList: obj.filter(list => {
            return list.inviteid !== InvitationId;
          }),
        });
        this.setState({
          showAlert: true,
          Name: 'Your invitation was deleted successfully',
        });
        setTimeout(() => {
          this.setState({
            Name: '',
            showAlert: false,
          });
        }, 10000);
      });
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleAcceptInvitation = (ToUserId, FromUserId, Name, InvitationId) => {
    try {
      const {UserId} = this.props;
      ServiceCalls.handleAcceptInvitation(FromUserId, ToUserId).then(
        response => {
          if (response) {
            this.setState({
              showAlert: true,
              Name: 'Now you are connected with ' + Name,
            });
            var obj = this.state.ReceiveInvitationLIst;
            this.setState({
              ReceiveInvitationLIst: obj.filter(list => {
                return list.inviteid !== InvitationId;
              }),
            });
            //this.GetReceiveInvitationList(UserId);
            ServiceCalls.handleGetYesProfiles(UserId).then(response => {
              this.props.clearMyConnectionDetails();
              this.props.setMyConnectionDetails(response);
            });
            setTimeout(() => {
              this.setState({
                Name: '',
                showAlert: false,
              });
            }, 10000);
          }
        },
      );
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleBlockInvitation = (ToUserId, FromUserId, Name, InviteId) => {
    try {
      const {UserId} = this.props;
      ServiceCalls.handleBlockInvitation(FromUserId, ToUserId).then(
        response => {
          if (response) {
            var obj = this.state.ReceiveInvitationLIst;
            this.setState({
              ReceiveInvitationLIst: obj.filter(list => {
                return list.inviteid !== InviteId;
              }),
            });
            this.GetBlockedInvitationList(UserId);
            this.setState({
              showAlert: true,
              Name:
                'You have blocked ' +
                Name +
                'Invitee would not aware of your blocked action the invitee can not resend the invite again unless you unblock or delete from your blocked list.',
            });
            setTimeout(() => {
              this.setState({
                Name: '',
                showAlert: false,
              });
            }, 10000);
          }
        },
      );
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleDeclineInvitation = (ToUserId, FromUserId, Name, InviteId) => {
    try {
      ServiceCalls.handleDeclineInvitation(FromUserId, ToUserId).then(
        response => {
          if (response) {
            var obj = this.state.ReceiveInvitationLIst;
            this.setState({
              ReceiveInvitationLIst: obj.filter(list => {
                return list.inviteid !== InviteId;
              }),
            });
            this.setState({
              showAlert: true,
              Name:
                'You have rejected ' +
                Name +
                'Invitee would not aware of your rejection, Invitee can resend the invite',
            });
            setTimeout(() => {
              this.setState({
                Name: '',
                showAlert: false,
              });
            }, 10000);
          }
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
  _handleHeaderCenterIcon = () => {
    const {UserId} = this.props;
    return (
      <View style={styles.headerCenterView}>
        <Tabs
          UserId={UserId}
          onReceivePress={() => this._handleOnReceivedPress()}
          onSendPress={() => this._handleOnSentPress()}
          onBlockPress={() => this._handleBlockPress()}
          receiveTabColor={this.state.receiveTabColor}
          sendTabColor={this.state.sendTabColor}
          blockTabColor={this.state.blockTabColor}
          ReceiveIconColor={this.state.ReceiveIconColor}
          SentIconColor={this.state.SentIconColor}
          BlockIconColor={this.state.BlockIconColor}
        />
      </View>
    );
  };
  _handleHeaderRightIcon = () => {
    return null;
  };
  _handleHeaderLeftIconPress = () => {
    global.HomePage.getInvitations();
    const {handleGoBack} = this.props;
    handleGoBack();
  };
  _handleHeaderText = () => {
    return (
      <View style={{bottom:3}}>
        <BoldText style={{color: '#ffffff', fontSize: 14}}>
          {this.state.HeaderText}
        </BoldText>
      </View>
    );
  };
  _handleUnBlockInvitation = (ToUserId, FromUserId, Name, InvitationId) => {
    try {
      const {UserId} = this.props;
      ServiceCalls.handleUnBlockInvitation(FromUserId, ToUserId).then(
        response => {
          if (response) {
            this.setState({
              showAlert: true,
              Name: 'Now you are connected with ' + Name,
            });
            var obj = this.state.BlockedInvitationList;
            this.setState({
              BlockedInvitationList: obj.filter(list => {
                return list.inviteid !== InvitationId;
              }),
              //this.GetBlockedInvitationList(UserId);
            });
            //this.GetBlockedInvitationList(UserId);
            ServiceCalls.handleGetYesProfiles(UserId).then(response => {
              this.props.clearMyConnectionDetails();
              this.props.setMyConnectionDetails(response);
            });
            setTimeout(() => {
              this.setState({
                Name: '',
                showAlert: false,
              });
            }, 10000);
          }
        },
      );
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleDeleteBlockInvitation = (ToUserId, FromUserId, InvitationId) => {
    console.log(ToUserId, FromUserId, InvitationId)
    const {UserId} = this.props;
    try {
      ServiceCalls.handleDeleteBlockInvitation(FromUserId, ToUserId).then(
        response => {
          if (response) {
            var obj = this.state.BlockedInvitationList;
            this.setState({
              BlockedInvitationList: obj.filter(list => {
                return list.inviteid !== InvitationId;
              }),
              //this.GetBlockedInvitationList(UserId);
            });
          }
          this.GetBlockedInvitationList(UserId);
        },
      );
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleHeaderProfileIcon = () => {
    return null;
  };
  render() {
    const {UserId} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: '#f4f6f9'}}>
        <View style={{flex: 0.16}}>
          <CustomHeader
            HeaderLeftIcon={() => this._handleHeaderLeftIcon()}
            HeaderCenterIcon={() => this._handleHeaderCenterIcon()}
            HeaderRightIcon={() => this._handleHeaderRightIcon()}
            HeaderLeftIconPress={this._handleHeaderLeftIconPress}
            HeaderText={() => this._handleHeaderText()}
            HeaderProfileIcon={() => this._handleHeaderProfileIcon()}
            HeaderProfileIconPress={this._handleHeaderProfileIconPress}
          />
        </View>
        <View style={{flex: 1}}>
          {this.state.IsReceived ? (
            <View style={{flex: 2}}>
              <ReceiveInvitations
                UserId={UserId}
                ReceiveInvitationLIst={this.state.ReceiveInvitationLIst}
                AcceptInvitation={(ToUserId, FromUserId, Name, InvitationId) =>
                  this._handleAcceptInvitation(
                    ToUserId,
                    FromUserId,
                    Name,
                    InvitationId,
                  )
                }
                BlockInvitation={(ToUserId, FromUserId, Name, InviteId) =>
                  this._handleBlockInvitation(
                    ToUserId,
                    FromUserId,
                    Name,
                    InviteId,
                  )
                }
                DeclineInvitation={(ToUserId, FromUserId, Name, InviteId) =>
                  this._handleDeclineInvitation(
                    ToUserId,
                    FromUserId,
                    Name,
                    InviteId,
                  )
                }
                InvitationName={this.state.Name}
                showAlert={this.state.showAlert}
              />
            </View>
          ) : null}
          {this.state.IsSent ? (
            <View style={{flex: 2}}>
              <SentInvitations
                UserId={UserId}
                SentInvitationList={this.state.SentInvitationList}
                SendInvitationAgain={(ToUserId, FromUserId, Name) =>
                  this._handleSendInvitationAgain(ToUserId, FromUserId, Name)
                }
                DeleteInvitation={InvitationId =>
                  this._handleDeleteInvitation(InvitationId)
                }
                InvitationName={this.state.Name}
                showAlert={this.state.showAlert}
              />
            </View>
          ) : null}
          {this.state.IsBlock ? (
            <View style={{flex: 2}}>
              <BlockInvitations
                UserId={UserId}
                BlockInvitationsList={this.state.BlockedInvitationList}
                UnBlockInvitation={(ToUserId, FromUserId, Name, InvitationId) =>
                  this._handleUnBlockInvitation(
                    ToUserId,
                    FromUserId,
                    Name,
                    InvitationId,
                  )
                }
                DeleteBlockInvitation={(ToUserId, FromUserId, InvitationId) =>
                  this._handleDeleteBlockInvitation(
                    ToUserId,
                    FromUserId,
                    InvitationId,
                  )
                }
                InvitationName={this.state.Name}
                showAlert={this.state.showAlert}
              />
            </View>
          ) : null}
        </View>
        {/* <AlertClass
          AlertMessage={this.state.Name}
          OkButtonText={'OK'}
          showAlert={this.state.showAlert}
          onOkPress={() => {
            this.setState({showAlert: false});
          }}
          onAlertClose={() => {
            this.setState({showAlert: false});
          }}
          Height={120}
        /> */}
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
  headerCustomMenu: {
    marginRight: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 100,
  },
  headerTextMenu: {
    color: 'red',
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
    top:2
  },
});
const mapStateToProps = state => {
  return {
    myConnectionDetails: state.MyConnections.myConnectionDetails,
  };
};
const mapDispatchToProps = {
  setMyConnectionDetails,
  clearMyConnectionDetails,
  handleGoBack: goBack,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageInvitations);
