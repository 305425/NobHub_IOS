import React from 'react';
import { View, TouchableOpacity, Platform, Alert, Keyboard, KeyboardAvoidingView } from 'react-native';
import PersonalProfile from './PersonalProfile';
import Header from './ProfileBusinessHeader';
import { Edit, Save, Cancel } from '../../shared/Icon';
import { styles } from './ProfileBusiness.styles';
import {
  setUserProfile,
  clearUserProfile,
  clearBusinessCardDetails,
  setBusinessCardDetails,
} from '../../state/operations';
import { connect } from 'react-redux';
import APICalls from '../../Services/APICalls';
import { CommonStyles } from '../../shared/Constants';
import { cardElementGroupIds, ImageTypes } from '../../shared/Constants';
import Footer from '../../shared/Footer';
import { requestExternalWritePermission } from './index.service';
import images from '../../Images';
import ImagePicker from 'react-native-image-picker';
import { MediumBoldText } from '../../shared/Text';
import { EventRegister } from 'react-native-event-listeners';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class ProfileBusiness extends React.Component {
  constructor(props) {
    super(props);
    const { userProfile } = this.props;
    this.state = {
      is_PersonalProfile_Tab_Active: true,
      isPersonalProfileEditEabled: false,
      isBusinessProfileEditEabled: false,
      personalTabColor: CommonStyles.appColor,
      busineesTabColor: '#ffffff',
      isEditUserData: false,
      tempUserData: userProfile,
      personalFontColor: '#ffffff',
      businessFontColor: '#777777',
      isShowTabs: false,
      imageType: '',
      Address: '',
      CompanyAddress: '',
      extraScrollHeight: 0,
      hideFooter: false,
      userStory: '',
    };
    global.profileState = this;
  }
  // componentDidMount = () => {
  //   try {
  //     const {userProfile} = this.props;
  //     var obj = userProfile;
  //     this.setState({PersonalCoverPhoto: obj.profielCoverImage});
  //     this.setState({PersonalPhoto: obj.image});
  //     this.setState({BusinessCoverPhoto: obj.businessCoverImage});
  //     this.setState({BusinessLogo: obj.businessImage});
  //   } catch (e) {
  //     Alert.alert(e);
  //   }
  // };
  // GetUserDetailsByUserId = () => {
  //   try {
  //     APICalls.handleGetUserDeatailsById(global.LoginUserId).then(response => {
  //       this.setState({tempUserData: response});
  //     });
  //   } catch (e) {
  //     Alert.alert(e);
  //   }
  // };
  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    console.log('Keyboard Shown');
    this.setState({ hideFooter: true })
  }

  _keyboardDidHide = () => {
    console.log('Keyboard Hidden');
    this.setState({ hideFooter: false })
  }

  _onTabPress = isFromPersonal => {
    if (isFromPersonal) {
      this.setState({
        is_PersonalProfile_Tab_Active: true,
        busineesTabColor: '#ffffff',
        personalTabColor: CommonStyles.appColor,
        personalFontColor: '#ffffff',
        businessFontColor: '#777777',
      });
    } else {
      this.setState({
        is_PersonalProfile_Tab_Active: false,
        busineesTabColor: CommonStyles.appColor,
        personalTabColor: '#FFFF',
        businessFontColor: '#ffffff',
        personalFontColor: '#777777',
      });
    }
    if (this.state.is_PersonalProfile_Tab_Active === true) {
      Keyboard.dismiss();
    }
  };
  _handleOnUserDataUpdate = isUserNameUpdate => {
    this.props.clearUserProfile();
    this.props.setUserProfile(this.state.tempUserData);
    var obj = this.state.tempUserData;
    if (obj.name != null && obj.name.trim() != '') {
    if (obj.lastname != null && obj.lastname.trim() != '') {
      APICalls.UpdateProfile(
        this.state.tempUserData,
        this.state.Address !== '' ? this.state.Address : this.props.userProfile.address,
        this.state.CompanyAddress !== '' ? this.state.CompanyAddress : this.props.userProfile.caddress,
        this.state.userStory !== '' ? this.state.userStory : this.props.userProfile.story,
      ).then(response => {
        this.setState({ tempUserData: response });
        this.props.clearUserProfile();
        this.props.setUserProfile(response);
        Keyboard.dismiss();
      });
      if (isUserNameUpdate) {
        this.setState({ isEditUserData: false });
      }
    } else {
      alert('Lastname should not be empty');
    }
  }
  else {
    alert('Firstname should not be empty');
  }
  };
  _handleOnUserDataChanged = (key, value) => {
    var data = this.state.tempUserData;
    switch (key) {
      case 'FN':
        data.name = value;
        break;
      case 'LN':
        data.lastname = value;
        break;
      case 'JT':
        data.title = value;
        break;
      case 'CN':
        data.companyname = value;
        break;
      case 'CT':
        data.companytagline = value;
        break;
    }
    this.setState({ tempUserData: data });
  };
  _handleOnEditPersonalProfiles = () => {
    this.setState({
      isPersonalProfileEditEabled: true,
      isBusinessProfileEditEabled: true,
    });
    EventRegister.emit('editPersonal', true)
    EventRegister.emit('editBusiness', true)
  };
  _handleDisableTextInputs = () => {
    this.setState({
      isPersonalProfileEditEabled: false,
      isBusinessProfileEditEabled: false,
    });
  };
  onChangeHandler = (Id, value) => {
    var userDataObj = this.state.tempUserData;
    var BusinessCardObj = this.props.businessCardDetails;
    if (Id === 'FirstName') {
      userDataObj.name = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (
          obj.cardelElements.elementgroupId === cardElementGroupIds.FirstName
        ) {
          obj.cardelElements.cardelementtext = value;
          if (value == '') {
            obj.cardelElements.isShow = false;
          } else {
            obj.cardelElements.isShow = true;
          }
        }
        return obj;
      });
    } else if (Id === 'LastName') {
      userDataObj.lastname = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (
          obj.cardelElements.elementgroupId === cardElementGroupIds.LastName
        ) {
          obj.cardelElements.cardelementtext = value;
          if (value == '') {
            obj.cardelElements.isShow = false;
          } else {
            obj.cardelElements.isShow = true;
          }
        }
        return obj;
      });
    } else if (Id === 'Address') {
      userDataObj.address = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (obj.cardelElements.elementgroupId === cardElementGroupIds.Address) {
          obj.cardelElements.cardelementtext = value;
          if (value == '') {
            obj.cardelElements.isShow = false;
          } else {
            obj.cardelElements.isShow = true;
          }
        }
        return obj;
      });
    } else if (Id === 'Email') {
      userDataObj.email = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (obj.cardelElements.elementgroupId === cardElementGroupIds.Email) {
          obj.cardelElements.cardelementtext = value;
          if (value == '') {
            obj.cardelElements.isShow = false;
          } else {
            obj.cardelElements.isShow = true;
          }
        }
        return obj;
      });
    } else if (Id === 'Home') {
      userDataObj.homephone = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (
          obj.cardelElements.elementgroupId === cardElementGroupIds.homephone
        ) {
          obj.cardelElements.cardelementtext = value;
          if (value == '') {
            obj.cardelElements.isShow = false;
          } else {
            obj.cardelElements.isShow = true;
          }
        }
        return obj;
      });
    } else if (Id === 'Facebook') {
      userDataObj.facebook = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (
          obj.cardelElements.elementgroupId === cardElementGroupIds.Facebook
        ) {
          obj.cardelElements.cardelementtext = value;
          if (value == '') {
            obj.cardelElements.isShow = false;
          } else {
            obj.cardelElements.isShow = true;
          }
        }
        return obj;
      });
    } else if (Id === 'Skype') {
      userDataObj.skype = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (obj.cardelElements.elementgroupId === cardElementGroupIds.Skype) {
          obj.cardelElements.cardelementtext = value;
          if (value == '') {
            obj.cardelElements.isShow = false;
          } else {
            obj.cardelElements.isShow = true;
          }
        }
        return obj;
      });
    } else if (Id === 'LinkedIn') {
      userDataObj.linkedin = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (obj.cardelElements.elementgroupId === cardElementGroupIds.twitter) {
          obj.cardelElements.cardelementtext = value;
          if (value == '') {
            obj.cardelElements.isShow = false;
          } else {
            obj.cardelElements.isShow = true;
          }
        }
        return obj;
      });
    } else if (Id === 'Twitter') {
      userDataObj.twitter = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (obj.cardelElements.elementgroupId === cardElementGroupIds.Twitter) {
          obj.cardelElements.cardelementtext = value;
          if (value == '') {
            obj.cardelElements.isShow = false;
          } else {
            obj.cardelElements.isShow = true;
          }
        }
        return obj;
      });
    } else if (Id === 'CompanyName') {
      userDataObj.companyname = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (
          obj.cardelElements.elementgroupId === cardElementGroupIds.ComapanyName
        ) {
          obj.cardelElements.cardelementtext = value;
          if (value == '') {
            obj.cardelElements.isShow = false;
          } else {
            obj.cardelElements.isShow = true;
          }
        }
        return obj;
      });
    } else if (Id === 'JobTitle') {
      userDataObj.title = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (obj.cardelElements.elementgroupId === cardElementGroupIds.Title) {
          obj.cardelElements.cardelementtext = value;
          if (value == '') {
            obj.cardelElements.isShow = false;
          } else {
            obj.cardelElements.isShow = true;
          }
        }
        return obj;
      });
    } else if (Id === 'Department') {
      userDataObj.department = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (
          obj.cardelElements.elementgroupId === cardElementGroupIds.Department
        ) {
          obj.cardelElements.cardelementtext = value;
          if (value == '') {
            obj.cardelElements.isShow = false;
          } else {
            obj.cardelElements.isShow = true;
          }
        }
        return obj;
      });
    } else if (Id === 'Companyemail') {
      userDataObj.cemail = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (
          obj.cardelElements.elementgroupId === cardElementGroupIds.CompanyEmail
        ) {
          obj.cardelElements.cardelementtext = value;
          if (value == '') {
            obj.cardelElements.isShow = false;
          } else {
            obj.cardelElements.isShow = true;
          }
        }
        return obj;
      });
    } else if (Id === 'Companyaddress') {
      userDataObj.caddress = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (
          obj.cardelElements.elementgroupId ===
          cardElementGroupIds.CompanyAdrees
        ) {
          obj.cardelElements.cardelementtext = value;
          if (value == '') {
            obj.cardelElements.isShow = false;
          } else {
            obj.cardelElements.isShow = true;
          }
        }
        return obj;
      });
    } else if (Id === 'companywebsite') {
      userDataObj.website = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (obj.cardelElements.elementgroupId === cardElementGroupIds.website) {
          obj.cardelElements.cardelementtext = value;
          if (value == '') {
            obj.cardelElements.isShow = false;
          } else {
            obj.cardelElements.isShow = true;
          }
        }
        return obj;
      });
    } else if (Id === 'Extension') {
      userDataObj.exten = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (
          obj.cardelElements.elementgroupId === cardElementGroupIds.Extension
        ) {
          obj.cardelElements.cardelementtext = value;
          if (value == '') {
            obj.cardelElements.isShow = false;
          } else {
            obj.cardelElements.isShow = true;
          }
        }
        return obj;
      });
    } else if (Id === 'Fax') {
      userDataObj.fax = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (obj.cardelElements.elementgroupId === cardElementGroupIds.Fax) {
          obj.cardelElements.cardelementtext = value;
          if (value == '') {
            obj.cardelElements.isShow = false;
          } else {
            obj.cardelElements.isShow = true;
          }
        }
        return obj;
      });
    } else if (Id === 'CompanyPhone') {
      userDataObj.cmobile = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (
          obj.cardelElements.elementgroupId === cardElementGroupIds.CompanyPhone
        ) {
          obj.cardelElements.cardelementtext = value;
          if (value == '') {
            obj.cardelElements.isShow = false;
          } else {
            obj.cardelElements.isShow = true;
          }
        }
        return obj;
      });
    } else if (Id === 'Profession') {
      userDataObj.profession = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (
          obj.cardelElements.elementgroupId === cardElementGroupIds.Profession
        ) {
          obj.cardelElements.cardelementtext = value;
          if (value == '') {
            obj.cardelElements.isShow = false;
          } else {
            obj.cardelElements.isShow = true;
          }
        }
        return obj;
      });
    }
    else if (Id === 'Story') {
      this.setState({ userStory: value })
    }
    this.props.clearBusinessCardDetails();
    this.props.setBusinessCardDetails(BusinessCardObj);
  };

  getProfileData = () => {
    const { businessCardDetails } = this.props;
    //console.log("BusinessCardDetailssssss", businessCardDetails);
    var object = {};
    if (businessCardDetails) {
      object.HomePhoneElem = businessCardDetails.filter(obj => {
        return obj.cardelElements.elementgroupId == cardElementGroupIds.HomePhone;
      });
      object.EmailElem = businessCardDetails.filter(obj => {
        return obj.cardelElements.elementgroupId == cardElementGroupIds.Email;
      });

      object.AddresElem = businessCardDetails.filter(obj => {
        return obj.cardelElements.elementgroupId == cardElementGroupIds.Address;
      });
      // object.HomePhoneElem = businessCardDetails.filter(obj => {
      //   return (
      //     obj.cardelElements.elementgroupId == cardElementGroupIds.Home
      //   );
      // });
      object.FbElem = businessCardDetails.filter(obj => {
        return (
          obj.cardelElements.elementgroupId == cardElementGroupIds.Facebook
        );
      });
      object.SkypeElem = businessCardDetails.filter(obj => {
        return obj.cardelElements.elementgroupId == cardElementGroupIds.Skype;
      });
      object.LinkedinElem = businessCardDetails.filter(obj => {
        return (
          obj.cardelElements.elementgroupId == cardElementGroupIds.Linkedin
        );
      });
      object.TwitterEle = businessCardDetails.filter(obj => {
        return obj.cardelElements.elementgroupId == cardElementGroupIds.Twitter;
      });
      object.DepartmentEle = businessCardDetails.filter(obj => {
        return (
          obj.cardelElements.elementgroupId == cardElementGroupIds.Department
        );
      });
      object.CompanyWebsiteEle = businessCardDetails.filter(obj => {
        return (
          obj.cardelElements.elementgroupId ==
          cardElementGroupIds.CompanyWebsite
        );
      });
      object.ExtensionEle = businessCardDetails.filter(obj => {
        return (
          obj.cardelElements.elementgroupId == cardElementGroupIds.Extension
        );
      });
      object.CmobileEle = businessCardDetails.filter(obj => {
        return (
          obj.cardelElements.elementgroupId == cardElementGroupIds.CompanyMobile
        );
      });
      object.FaxEle = businessCardDetails.filter(obj => {
        return obj.cardelElements.elementgroupId == cardElementGroupIds.Fax;
      });
    }
    return object;
  };
  updateclick = () => {
   // console.log("Company Phone toogle",cardElementGroupIds.CompanyMobile )
   // console.log("Extension toogle",cardElementGroupIds.CompanyMobile )
    var BusinessCardObj = this.props.businessCardDetails;

    this.props.setBusinessCardDetails(BusinessCardObj);
    this._handleOnUserDataUpdate(false);
    this.setState({
      isPersonalProfileEditEabled: false,
      isBusinessProfileEditEabled: false,
    });
    EventRegister.emit('editPersonal', false)
    EventRegister.emit('editBusiness', false)
    Keyboard.dismiss();
  };

  toggleEmail = value => {
    APICalls.UpdateToggleSetting(cardElementGroupIds.Email, value).then(
      response => {
        global.CustomMenuIconForHeader.GetUserDefaultCardByUserId();
      },
    );
  };
  toggleHome = value => {
    APICalls.UpdateToggleSetting(cardElementGroupIds.HomePhone, value).then(
      response => {
        global.CustomMenuIconForHeader.GetUserDefaultCardByUserId();
      },
    );
  };
  toggleAddres = value => {
    APICalls.UpdateToggleSetting(cardElementGroupIds.Address, value).then(
      response => {
        global.CustomMenuIconForHeader.GetUserDefaultCardByUserId();
      },
    );
  };
  toggleFacebook = value => {
    APICalls.UpdateToggleSetting(cardElementGroupIds.Facebook, value).then(
      response => {
        global.CustomMenuIconForHeader.GetUserDefaultCardByUserId();
      },
    );
  };
  toggleSkype = value => {
    APICalls.UpdateToggleSetting(cardElementGroupIds.Skype, value).then(
      response => {
        global.CustomMenuIconForHeader.GetUserDefaultCardByUserId();
      },
    );
  };
  toggleTwitter = value => {
    APICalls.UpdateToggleSetting(cardElementGroupIds.Twitter, value).then(
      response => {
        global.CustomMenuIconForHeader.GetUserDefaultCardByUserId();
      },
    );
  };
  toggleLinkedin = value => {
    APICalls.UpdateToggleSetting(cardElementGroupIds.Linkedin, value).then(
      response => {
        global.CustomMenuIconForHeader.GetUserDefaultCardByUserId();
      },
    );
  };

  toggleDepartment = value => {
    APICalls.UpdateToggleSetting(cardElementGroupIds.Department, value).then(
      response => {
        global.CustomMenuIconForHeader.GetUserDefaultCardByUserId();
      },
    );
  };

  toggleCompanyWebsite = value => {
    APICalls.UpdateToggleSetting(cardElementGroupIds.Website, value).then(
      response => {
        global.CustomMenuIconForHeader.GetUserDefaultCardByUserId();
      },
    );
  };
  toggleExtension = value => {
    APICalls.UpdateToggleSetting(cardElementGroupIds.Extension, value).then(
      response => {
        global.CustomMenuIconForHeader.GetUserDefaultCardByUserId();
      },
    );
  };
  toggleCompanyPhone = value => {
   // console.log("Valueeeeee", value)
    APICalls.UpdateToggleSetting(cardElementGroupIds.CompanyMobile, value).then(
      response => {
        global.CustomMenuIconForHeader.GetUserDefaultCardByUserId();
      },
    );
  };
  toggleFax = value => {
    APICalls.UpdateToggleSetting(cardElementGroupIds.Fax, value).then(
      response => {
        global.CustomMenuIconForHeader.GetUserDefaultCardByUserId();
      },
    );
  };
  _handleOnImagesPress = imageType => {
    if (imageType === 1) {
      // profile pictures
      imageType = this.state.is_PersonalProfile_Tab_Active
        ? ImageTypes.profilePicture
        : ImageTypes.businessLogo;
    } else {
      // Cover pictures
      imageType = this.state.is_PersonalProfile_Tab_Active
        ? ImageTypes.profileCoverPicture
        : ImageTypes.businessCoverPicture;
    }
    this.setState({ isShowTabs: true, imageType: imageType });
    // if (Platform.OS === 'android') {
    //   await requestExternalWritePermission(obj, imageType);
    // } else {
    //   await selectPhotoTapped(obj, imageType);
    // }
  };

  _handleOnCameraPress = async () => {
    try {
      var obj = this;
      if (Platform.OS === 'android') {
        await requestExternalWritePermission(
          obj,
          this.state.imageType,
          'Camera',
        );
      } else {
        //await selectPhotoTapped(obj, this.state.imageType, 'Camera');
        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
        };
        //if (PickFrom === 'Camera') {
        ImagePicker.launchCamera(options, response => {
          if (response.didCancel) {
          } else if (response.error) {
          } else if (response.customButton) {
          } else {
            let Source = { uri: response.uri };
            var date = new Date();
            date = date.getSeconds();
            var fileName = '';
            var _ext = response.uri;
            _ext = _ext.split('.');
            var fileType =
              Platform.OS == 'android'
                ? _ext.length == 2
                  ? _ext[1]
                  : _ext[2]
                : _ext[1];
            //1: Profile Picture, 2: Profile Cover picture, 3:Business Image, 4: Business Cover Image
            switch (this.state.imageType) {
              case ImageTypes.profilePicture:
                fileName =
                  global.LoginUserId +
                  '_ProfilePicture' +
                  date +
                  '.' +
                  fileType;
                global.PersonalPhoto = Source;
                break;
              case ImageTypes.profileCoverPicture:
                fileName =
                  global.LoginUserId +
                  '_ProfileCoverPiture' +
                  date +
                  '.' +
                  fileType;
                global.PersonalCoverPhoto = Source;
                break;
              case ImageTypes.businessLogo:
                fileName =
                  global.LoginUserId + '_BusinessLogo' + date + '.' + fileType;
                global.BusinessLogo = Source;
                break;
              case ImageTypes.businessCoverPicture:
                fileName =
                  global.LoginUserId +
                  '_BusinessCoverPicture' +
                  date +
                  '.' +
                  fileType;
                global.BusinessCoverPhoto = Source;
                break;
            }
            var dataToSend = {
              FrontImgbase64: response.data,
              FileName: fileName,
              UserId: global.LoginUserId,
              ImageType: this.state.imageType,
            };
            var formBody = [];
            for (var key in dataToSend) {
              var encodedKey = encodeURIComponent(key);
              var encodedValue = encodeURIComponent(dataToSend[key]);
              formBody.push(encodedKey + '=' + encodedValue);
            }
            formBody.push(
              encodeURIComponent('imageType') +
              '=' +
              encodeURIComponent(this.state.imageType),
            );
            formBody = formBody.join('&');
            return fetch(global.APIURL + 'api/Card/UploadPicture', {
              method: 'POST', //Request Type
              body: formBody, //post body
              headers: {
                'Content-Type':
                  'application/x-www-form-urlencoded;charset=UTF-8',
              },
            })
              .then(_response => _response.text())
              .then(_responseJson => {
                //Alert.alert('uploaded successfully');
                var data = this.state.tempUserData;
                switch (this.state.imageType) {
                  case ImageTypes.profilePicture:
                    data.image = fileName;
                    break;
                  case ImageTypes.profileCoverPicture:
                    data.profielCoverImage = fileName;
                    break;
                  case ImageTypes.businessLogo:
                    data.businessImage = fileName;
                    break;
                  case ImageTypes.businessCoverPicture:
                    data.businessCoverImage = fileName;
                    break;
                }
                this.setState({ tempUserData: data });
              })
              .catch(e => Alert.alert('error in' + e));
          }
        });
        //}
      }
      this.HeaderView();
      this.setState({ isShowTabs: false });
    } catch (e) {
      Alert.alert(e);
    }
  };

  _handleOnGalleryPress = async () => {
    try {
      var obj = this;
      if (Platform.OS === 'android') {
        await requestExternalWritePermission(
          obj,
          this.state.imageType,
          'Gallery',
        );
      } else {
        //await selectPhotoTapped(obj, this.state.imageType, 'Gallery');
        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
        };
        //if (PickFrom === 'Camera') {
        ImagePicker.launchImageLibrary(options, response => {
          if (response.didCancel) {
          } else if (response.error) {
          } else if (response.customButton) {
          } else {
            let Source = { uri: response.uri };
            var date = new Date();
            date = date.getSeconds();
            var fileName = '';
            var _ext = response.uri;
            _ext = _ext.split('.');
            var fileType = Platform.OS == 'android' ? _ext[2] : _ext[1];
            //1: Profile Picture, 2: Profile Cover picture, 3:Business Image, 4: Business Cover Image
            switch (this.state.imageType) {
              case ImageTypes.profilePicture:
                fileName =
                  global.LoginUserId +
                  '_ProfilePicture' +
                  date +
                  '.' +
                  fileType;
                global.PersonalPhoto = Source;
                break;
              case ImageTypes.profileCoverPicture:
                fileName =
                  global.LoginUserId +
                  '_ProfileCoverPiture' +
                  date +
                  '.' +
                  fileType;
                global.PersonalCoverPhoto = Source;
                break;
              case ImageTypes.businessLogo:
                fileName =
                  global.LoginUserId + '_BusinessLogo' + date + '.' + fileType;
                global.BusinessLogo = Source;
                break;
              case ImageTypes.businessCoverPicture:
                fileName =
                  global.LoginUserId +
                  '_BusinessCoverPicture' +
                  date +
                  '.' +
                  fileType;
                global.BusinessCoverPhoto = Source;
                break;
            }
            var dataToSend = {
              FrontImgbase64: response.data,
              FileName: fileName,
              UserId: global.LoginUserId,
              ImageType: this.state.imageType,
            };
            var formBody = [];
            for (var key in dataToSend) {
              var encodedKey = encodeURIComponent(key);
              var encodedValue = encodeURIComponent(dataToSend[key]);
              formBody.push(encodedKey + '=' + encodedValue);
            }
            formBody.push(
              encodeURIComponent('imageType') +
              '=' +
              encodeURIComponent(this.state.imageType),
            );
            formBody = formBody.join('&');
            return fetch(global.APIURL + 'api/Card/UploadPicture', {
              method: 'POST', //Request Type
              body: formBody, //post body
              headers: {
                'Content-Type':
                  'application/x-www-form-urlencoded;charset=UTF-8',
              },
            })
              .then(_response => _response.text())
              .then(_responseJson => {
                //Alert.alert('uploaded successfully');
                var data = this.state.tempUserData;
                switch (this.state.imageType) {
                  case ImageTypes.profilePicture:
                    data.image = fileName;
                    break;
                  case ImageTypes.profileCoverPicture:
                    data.profielCoverImage = fileName;
                    break;
                  case ImageTypes.businessLogo:
                    data.businessImage = fileName;
                    break;
                  case ImageTypes.businessCoverPicture:
                    data.businessCoverImage = fileName;
                    break;
                }
                this.setState({ tempUserData: data });
              })
              .catch(e => Alert.alert('error in' + e));
          }
        });
      }
      this.HeaderView();
      this.setState({ isShowTabs: false });
    } catch (e) {
      Alert.alert(e);
    }
  };
  _handleOnCancelPersonalProfiles = () => {
    this.setState({
      isBusinessProfileEditEabled: false,
      isPersonalProfileEditEabled: false,
    });
    EventRegister.emit('editPersonal', false)
    EventRegister.emit('editBusiness', false)
  };
  _handleOnClosePress = () => {
    this.setState({ isShowTabs: false });
  };
  _handleOnRemovePress = () => {
    try {
      APICalls._handleRemoveUserPictures(this.state.imageType).then(
        response => {
          if (response == 'Successfully Deleted') {
            var data = this.state.tempUserData;
            //1: Profile Picture, 2: Profile Cover picture, 3:Business Image, 4: Business Cover Image
            if (this.state.imageType == 1) {
              global.PersonalPhoto = '';
              data.image = '';
            }
            if (this.state.imageType == 2) {
              global.PersonalCoverPhoto = '';
              data.profielCoverImage = '';
            }
            if (this.state.imageType == 3) {
              global.BusinessLogo = '';
              data.businessImage = '';
            }
            if (this.state.imageType == 4) {
              global.BusinessCoverPhoto = '';
              data.businessCoverImage = '';
            }
            this.setState({ isShowTabs: false, tempUserData: data });
          }
        },
      );
    } catch (e) {
      Alert.alert(e);
    }
  };
  HeaderView = () => {
    return (
      <View style={{ flex: 3.5, backgroundColor: '#f4f6f9' }}>
        <Header
          tempUserData={this.state.tempUserData}
          onUserDataUpdate={() => this._handleOnUserDataUpdate(true)}
          onEditPress={() => this.setState({ isEditUserData: true })}
          onUserDataModalClose={() => this.setState({ isEditUserData: false })}
          isEditUserData={this.state.isEditUserData}
          onFirstNameChange={value =>
            this._handleOnUserDataChanged('FN', value)
          }
          onLastNameChanged={value =>
            this._handleOnUserDataChanged('LN', value)
          }
          onJobTitleChanged={value =>
            this._handleOnUserDataChanged('JT', value)
          }
          onCompanyNameChanged={value =>
            this._handleOnUserDataChanged('CN', value)
          }
          Ispersonal={this.state.is_PersonalProfile_Tab_Active}
          onProfilePicturePress={() => this._handleOnImagesPress(1)} //Profile Picture
          onCoverPiturePress={() => this._handleOnImagesPress(2)} //Cover Picture
          isShowTabs={this.state.isShowTabs}
          onClosePress={this._handleOnClosePress}
          onCameraPress={this._handleOnCameraPress}
          onGalleryPress={this._handleOnGalleryPress}
          onCompanyTagLineChanged={value =>
            this._handleOnUserDataChanged('CT', value)
          }
          onRemovePress={this._handleOnRemovePress}
        />
      </View>
    );
  };
  _handleOnAddressSelect = (value, id) => {
    // console.log("PersonalAdress Called")
    var userDataObj = this.state.tempUserData;
    var BusinessCardObj = this.props.businessCardDetails;
    if (id === '1') {
      this.setState({ Address: value });
      userDataObj.address = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (obj.cardelElements.elementgroupId === cardElementGroupIds.Address) {
          obj.cardelElements.cardelementtext = value;
        }
        return obj;
      });
    } else {
      this.setState({ CompanyAddress: value });
      userDataObj.caddress = value;
      BusinessCardObj = BusinessCardObj.filter(obj => {
        if (
          obj.cardelElements.elementgroupId ===
          cardElementGroupIds.CompanyAdrees
        ) {
          obj.cardelElements.cardelementtext = value;
        }
        return obj;
      });
    }
    //this.props.clearBusinessCardDetails();
    this.props.setBusinessCardDetails(BusinessCardObj);
  };
  render() {
    const objectElements = this.getProfileData();
    return (
      <View style={{ flex: 1, backgroundColor: '#f4f6f9' }}>
        {this.HeaderView()}
        <View style={styles.viewPersonalProfileTabsContainer}>
          <View style={{ flex: 0.2 }} />
          <View style={styles.viewPersonalProfileTabs}>
            <TouchableOpacity
              style={[
                styles.viewTabs,
                { backgroundColor: this.state.personalTabColor },
              ]}
              onPress={() => this._onTabPress(true)}>
              <MediumBoldText
                style={{ marginTop: 5, color: this.state.personalFontColor }}>
                {'Personal'}
              </MediumBoldText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewTabs,
                styles.viewBusinessTab,
                { backgroundColor: this.state.busineesTabColor }
              ]}
              onPress={() => this._onTabPress(false)}>
              <MediumBoldText
                style={{ marginTop: 5, color: this.state.businessFontColor }}>
                {'Business'}
              </MediumBoldText>
            </TouchableOpacity>
          </View>
          {this.state.isPersonalProfileEditEabled ? (
            <View style={{ flexDirection: 'row', flex: 0.2 }}>
              <View style={{ flex: 0.4, alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.updateclick()}>
                  <Save style={{ fontSize: 20 }} />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 0.4, alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => this._handleOnCancelPersonalProfiles()}>
                  <Cancel style={{ fontSize: 20 }} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={{ flex: 0.2, alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => this._handleOnEditPersonalProfiles()}>
                <Edit style={{ fontSize: 20 }} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* <KeyboardAvoidingView
          //keyboardVerticalOffset={Dimensions.get('window').height} // adjust the value here if you need more padding
          style={{ flex: 4, backgroundColor: '#f4f6f9', height:500 }}
          //behavior={"padding"} // you can change that by using Platform
          keyboardVerticalOffset={-500} behavior="padding"
        //keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
        > */}
        <View style={{ flex: 4.5 }}>
          <KeyboardAwareScrollView
            enableOnAndroid
            enableAutomaticScroll
            keyboardOpeningTime={0}
            keyboardShouldPersistTaps='always'
            // style={{flex:1, backgroundColor:"red" }}
            automaticallyAdjustContentInsets={false}
            // onKeyboardWillShow={(item) => {
            //   console.log("Item",item)
            //   this.setState({extraScrollHeight: -400});
            // }}
            // onKeyboardWillHide={() => {
            //   this.setState({extraScrollHeight: 0});
            // }}
            extraScrollHeight={0}
          //contentContainerStyle={Platform.OS == 'android' ? { paddingBottom: -10 } : {paddingBottom: 0}}
          // extraHeight={Platform.select({ android: 200 })}
          >
            <PersonalProfile
              userProfile={this.state.tempUserData}
              onDataChangeHandler={this.onChangeHandler}
              Ispersonal={this.state.is_PersonalProfile_Tab_Active}
              objectElements={objectElements}
              onChangeHandler={(id, value) => this.onChangeHandler(id, value)}
              toggleEmail={this.toggleEmail}
              toggleHome={this.toggleHome}
              toggleAddres={this.toggleAddres}
              toggleFacebook={this.toggleFacebook}
              toggleSkype={this.toggleSkype}
              toggleTwitter={this.toggleTwitter}
              toggleLinkedin={this.toggleLinkedin}
              toggleDepartment={this.toggleDepartment}
              toggleCompanyWebsite={this.toggleCompanyWebsite}
              toggleExtension={this.toggleExtension}
              toggleCompanyPhone={this.toggleCompanyPhone}
              toggleFax={this.toggleFax}
              updateUserPersonalProfile={this.updateclick}
              isPersonalProfileEditEabled={this.state.isPersonalProfileEditEabled}
              isBusinessProfileEditEabled={this.state.isBusinessProfileEditEabled}
              OnAddressSelect={(value, id) =>
                this._handleOnAddressSelect(value, id)
              }
            />
          </KeyboardAwareScrollView>
        </View>
        {/* </KeyboardAvoidingView> */}
        {!this.state.hideFooter && (
          <View style={{ flex: 0.80 }}>
            <Footer />
          </View>
        )}
      </View>
    );
  }
}
export const mapStateToProps = state => {
  return {
    userProfile: state.user.userProfile,
    businessCardDetails: state.BusinessCards.businessCardDetails,
  };
};

const mapDispatchToProps = {
  setUserProfile,
  clearUserProfile,
  clearBusinessCardDetails,
  setBusinessCardDetails,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileBusiness);
