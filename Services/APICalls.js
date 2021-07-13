import {Alert} from 'react-native';
import axios from 'axios';
const APICalls = {
  GetUserDefaultCardByUserId(UserId) {
    try {
      var dataToSend = {Userid: UserId};
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/GetUserDefaultCardByUserId', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
        //  console.log("UserCardResponse",responseJson)
          return responseJson;
          //this.setState({UserCardDetails: responseJson});
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  UpdateProfile(data, Address, CAddress,story) {
    console.log("UserStory",story);
    try {
      var dataToSend = {
        Userid: global.LoginUserId,
        Name: data.name,
        LastName: data.lastname,
        PEmail: data.email,
        Homephone: data.homephone,
        Paddress: Address,
        facebook: data.facebook,
        Skype: data.skype,
        linkedin: data.linkedin,
        twitter: data.twitter,
        Story:story,
        Companyname: data.companyname,
        Title: data.title,
        Department: data.department,
        Cemail: data.cemail,
        Caddress: CAddress,
        Website: data.website,
        Fax: data.fax,
        Cmobile: data.cmobile,
        Extension: data.exten,
        CompanyTagLine: data.companytagline,
        Profession: data.profession,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/UpdateProfile', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  UpdateToggleSetting(ElementGrpId, status) {
    //const {businessCardDetails} = this.props;
    try {
      var dataToSend = {
        UserId: global.LoginUserId,
        ElementGrpId: ElementGrpId,
        ToggleStatus: status,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/UpdateToggleSetting', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          return responseJson;
          //alert('Updated Succesfully');
          // global.datasourceList.dataSource = responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  GetActiveCarddetaillsById(Theme) {
    try {
      var dataToSend = {CardId: Theme};
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/GetActiveCarddetaillsById', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          return responseJson;
          // let _x = JSON.parse(JSON.stringify(responseJson));
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  GetCardCategories() {
    try {
      return fetch(global.APIURL + 'api/Card/GetCardCategories')
        .then(response => response.json())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleLoginClick(Mobile, CountryCode) {
    try {
      var dataToSend = {MobileNumber: Mobile, CountryCode: CountryCode};
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Account/GetUserDetailsByMobileNumber', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleRegistrationClick(MobileNumber) {
    try {
      var dataToSend = {
        MobileNumber: MobileNumber.replace(/ /g, ''),
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Account/CheckMobileNumberExist', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleGetAllProfessions() {
    try {
      return fetch(global.APIURL + 'api/Card/GetAllProfessions')
        .then(response => response.json())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleGetGeneralCards(CategoryId) {
    try {
      var dataToSend = {
        categorieID: CategoryId,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/GetCardsByCategoryId', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleUserRegistration(UserDetails, ReferralCode) {
    try {
      var dataToSend = {
        MobileNumber: UserDetails.Mobile,
        FirstName: UserDetails.FirstName,
        LastName: UserDetails.LastName,
        JobTitle: UserDetails.JobTitle,
        CompanyName: UserDetails.CompanyName,
        CompanyEmail: UserDetails.CompanyEmail,
        CompanyAddress: UserDetails.CompanyAddress,
        Profession: UserDetails.Profession,
        Story: UserDetails.Story,
        Lat: UserDetails.Lat,
        Lang: UserDetails.Long,
        TimeZone: UserDetails.TimeZone,
        BusinessCard: UserDetails.BusinessCard,
        CountryCode: UserDetails.CountryCode,
        MyReferralCode: 'NH' + ReferralCode,
        FCMToken: global.LoginUserFcmToken,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Account/UserRegistration', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleGetYesProfiles(UserId) {
    try {
      var dataToSend = {UserId: UserId};
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/GetYesProfiles', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleGetScannedCardDetails(UserId) {
    try {
      const data = {UserId: UserId};
      return fetch(
        global.APIURL + `api/Card/GetScannedCardDetails?UserId=${data.UserId}`,
        {
          method: 'GET',
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleGetUserGroupsCount(UserId) {
    try {
      const data = {UserId: UserId};
      return fetch(
        global.APIURL + `api/Card/GetUserGroupCount?UserId=${data.UserId}`,
        {
          method: 'GET',
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleSaveGroups(UserId, GroupName, GroupId, ConnectedMemberIds) {
    try {
      var dataToSend = {
        UserId: UserId,
        GroupName: GroupName,
        GroupId: GroupId,
        GroupMemberIds: ConnectedMemberIds,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/SaveUserGroups', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleDeletedGroupMembers(GroupId) {
    try {
      var dataToSend = {GroupId: GroupId};
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/DeleteGroup', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleGetGroupMembersById(GroupId) {
    try {
      var dataToSend = {GroupId: GroupId, UserId: global.LoginUserId};
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/GetGrpMembersById', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleGetUserDeatailsById(UserId) {
    try {
      var dataToSend = {UserId: UserId};
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Account/GetUserDetailsByUserId', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleGetSentInvitations(UserId) {
    try {
      const data = {UserId: UserId};
      return fetch(
        global.APIURL + `api/Card/GetSentInvitations?UserId=${data.UserId}`,
        {
          method: 'GET',
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleGetReceiveInvitationList(UserId) {
    try {
      var dataToSend = {
        UserId: UserId,
        IsAll: true,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/GetInvitations', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleSendInvitation(FromUserId, ToUserId, UserName) {
    try {
      var dataToSend = {
        Refid: FromUserId,
        Cid: ToUserId,
        body: UserName + 'sent you inviation',
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/sendNearbyInvite', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleDeleteSentInvitations(InvitationId) {
    try {
      const data = {InvitationId: InvitationId};
      return fetch(
        global.APIURL +
          `api/Card/DeleteInvitation?InvitationId=${data.InvitationId}`,
        {
          method: 'POST',
        },
      )
        .then(response => response.text())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleAcceptInvitation(FromUserId, ToUserId) {
    try {
      var dataToSend = {
        FromUserId: FromUserId,
        LoginUserId: ToUserId,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/Accepteinvitation', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(response => {
          return response;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleDeclineInvitation(FromUserId, ToUserId) {
    try {
      var dataToSend = {
        FromUserId: FromUserId,
        LoginUserId: ToUserId,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/Declineinvitation', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(response => {
          return response;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleBlockInvitation(FromUserId, ToUserId) {
    try {
      var dataToSend = {
        FromUserId: FromUserId,
        LoginUserId: ToUserId,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/BlockInvitation', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(response => {
          return response;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },

  SaveAddtoGroupPeople(GroupId, SelectedmebIDs) {
    try {
      var ids = SelectedmebIDs.join(',');
      var dataToSend = {
        GroupId: GroupId,
        GroupMemberIds: ids,
        UserId: global.LoginUserId,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/SaveGroupMembers', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },

  handleGetBlockedInvitations(UserId) {
    try {
      const data = {UserId: UserId};
      return fetch(
        global.APIURL + `api/Card/GetBlockInvitations?UserId=${data.UserId}`,
        {
          method: 'GET',
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleDeleteUserFCMToken(UserId, FCMToken) {
    try {
      var dataToSend = {
        UserId: UserId,
        FCMToken: FCMToken,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/DeleteUserFCMToken', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(response => {
          return response;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  DeleteGroupMembers(GroupId, DeletedmebIDs) {
    try {
      var ids = DeletedmebIDs.join(',');
      var dataToSend = {
        GroupId: GroupId,
        DelteMembersIds: ids,
        UserId: global.LoginUserId,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      // return fetch(global.APIURL + 'api/Card/DeleteMembersinGroup', {
      //   method: 'POST', //Request Type
      //   body: formBody, //post body
      //   headers: {
      //     //Header Defination
      //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      //   },
      // })
      //   .then(response => response.text())
      return  axios({
        method: "post",
        url: global.APIURL + 'api/Card/DeleteMembersinGroup',
        data: formBody,
       // headers: {'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8' },
      })
        .then(response => {
          return response;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleDeleteGroups(DeleteGroupIDs) {
    try {
      var ids = DeleteGroupIDs.join(',');
      var dataToSend = {DeletGrpId: ids};
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/DeleteGroup', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          // alert(responseJson);
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleUnBlockInvitation(FromUserId, ToUserId) {
    try {
      var dataToSend = {
        FromUserId: FromUserId,
        LoginUserId: ToUserId,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/UnBlockInvitation', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(response => {
          return response;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleDeleteBlockInvitation(FromUserId, ToUserId) {
    try {
      var dataToSend = {
        FromUserId: FromUserId,
        LoginUserId: ToUserId,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/DeleteBlockInvitation', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(response => {
          return response;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  AddORRemoveFavourite(ChannelId, Touserid) {
    try {
      var dataToSend = {
        LoggedinUserId: global.LoginUserId,
        ChannelId: ChannelId,
        toUserId: Touserid,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/MarkChannelsAsFavorites', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  BlockORUnBlock(ChannelId, Touserid) {
    try {
      var dataToSend = {
        LoggedinUserId: global.LoginUserId,
        channelid: ChannelId,
        toUserId: Touserid,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/MarkSingleChannelAsBlocked', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  DeleteChannelMsgs(ChannelIds) {
    try {
      var dataToSend = {
        UserId: global.LoginUserId,
        ChannelIds: ChannelIds,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/DeleteChannelMsgs', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          return responseJson;
        })
        .catch(error => Alert.alert(error));
    } catch (e) {
      Alert.alert(e);
    }
  },
  handleGetUserScannedCardProfiles(UserId) {
    try {
      const data = {UserId: UserId};
      return fetch(
        global.APIURL +
          `api/Card/GetUserScannedCardsDetails?UserId=${data.UserId}`,
        {
          method: 'GET',
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          return responseJson;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },

  DeleteMembersinGroup(MemberIds, ChannelId) {
    try {
      var dataToSend = {
        GroupMemberIds: MemberIds,
        ChannelId: ChannelId,
        UserId: global.LoginUserId,
        FCMToken: global.LoginUserFcmToken,
      };

      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/RemoveMembersinChannelGroups', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          return responseJson;
        })
        .catch(error => Alert.alert(error));
    } catch (e) {
      Alert.alert(e);
    }
  },
  _handleDeleteScannedCards(Id) {
    try {
      var ids = Id.join(',');
      var dataToSend = {
        ScanCardId: ids,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/DeleteScannedCards', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          return responseJson;
        })
        .catch(error => Alert.alert(error));
    } catch (e) {
      Alert.alert(e);
    }
  },
  _handleDeleteConnectedContacts(Id) {
    try {
      var ids = Id.join(',');
      var dataToSend = {
        ConnectedContactId: ids,
        FCMToken: global.LoginUserFcmToken,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/DeleteConnectedContact', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          return responseJson;
        })
        .catch(error => Alert.alert(error));
    } catch (e) {
      Alert.alert(e);
    }
  },
  UpdateLastSeenStatus(CurrentStatus) {
    try {
      var dataToSend = {
        UserId: global.LoginUserId,
        Status: CurrentStatus,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/updateAppstate', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(response => {
          return response;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  _handleGetUserNotifications(UserId) {
    try {
      var dataToSend = {
        UserId: global.LoginUserId,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/GetUserNotifications', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(response => {
          return response;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  _handleRemoveUserPictures(ImageType) {
    try {
      var dataToSend = {
        UserId: global.LoginUserId,
        ImageType: ImageType,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/RemoveProfilePictures', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(response => {
          return response;
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
  LeaveChannelGroup(ChannelId) {
    try {
      var dataToSend = {
        ChannelId: ChannelId,
        UserId: global.LoginUserId,
        FCMToken: global.LoginUserFcmToken,
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      return fetch(global.APIURL + 'api/Card/LeaveChannelGroup', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          return responseJson;
        })
        .catch(error => Alert.alert(error));
    } catch (e) {
      Alert.alert(e);
    }
  },
};

export default APICalls;
