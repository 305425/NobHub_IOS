// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { PermissionsAndroid, Alert, Platform } from 'react-native';
import { ImageTypes } from '../../shared/Constants';
export const requestExternalWritePermission = async (
  obj,
  imageType,
  PickFrom,
) => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'CameraExample App External Storage Write Permission',
        message:
          'CameraExample App needs access to Storage data in your SD Card ',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return await requestExternalReadPermission(obj, imageType, PickFrom);
    } else {
      Alert.alert('WRITE_EXTERNAL_STORAGE permission denied');
    }
  } catch (err) {
    Alert.alert('Write permission err', err);
  }
};
export const requestExternalReadPermission = async (
  obj,
  imageType,
  PickFrom,
) => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'CameraExample App Read Storage Read Permission',
        message: 'CameraExample App needs access to your SD Card ',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return await selectPhotoTapped(obj, imageType, PickFrom);
    } else {
      Alert.alert('READ_EXTERNAL_STORAGE permission denied');
    }
  } catch (err) {
    Alert.alert('Read permission err', err);
  }
};

const selectPhotoTapped = async (obj, imageType, PickFrom) => {
  const options = {
    quality: 1.0,
    maxWidth: 500,
    maxHeight: 500,
    storageOptions: {
      skipBackup: true,
    },
  };
  if (PickFrom === 'Camera') {
    return await
      ImagePicker.openCamera({
        width: 500,
        height: 500,
        cropping: true,
        //cropperCircleOverlay: true,
        // compressImageMaxWidth: 640,
        // compressImageMaxHeight: 480,
        //  freeStyleCropEnabled: true,
        // includeExif: true,
        includeBase64: true
      }).then(image => {
        console.log("SelectData", image);
        // if (response.didCancel) {
        // } else if (response.error) {
        // } else if (response.customButton) {
        // } else {
        let Source = { uri: image.path, cache: 'reload' };
        var date = new Date();
        date = date.getSeconds();
        var fileName = '';
        var _ext = image.path;
        _ext = _ext.split('.');
        var fileType =
          Platform.OS == 'android'
            ? _ext.length == 2
              ? _ext[1]
              : _ext[2]
            : _ext[1];
        var userPrfoiles = global.MyConnections.props.userProfile;
        //1: Profile Picture, 2: Profile Cover picture, 3:Business Image, 4: Business Cover Image
        switch (imageType) {
          case ImageTypes.profilePicture:
            fileName =
              global.LoginUserId + '_ProfilePicture' + date + '.' + fileType;
            global.PersonalPhoto = Source;
            if (userPrfoiles != null) {
              userPrfoiles.image = fileName;
              global.MyConnections.props.setUserProfile(userPrfoiles);
            }
            break;
          case ImageTypes.profileCoverPicture:
            fileName =
              global.LoginUserId +
              '_ProfileCoverPiture' +
              date +
              '.' +
              fileType;
            global.PersonalCoverPhoto = Source;
            if (userPrfoiles != null) {
              userPrfoiles.profileCoverImage = fileName;
              global.MyConnections.props.setUserProfile(userPrfoiles);
            }
            break;
          case ImageTypes.businessLogo:
            fileName =
              global.LoginUserId + '_BusinessLogo' + date + '.' + fileType;
            global.BusinessLogo = Source;
            if (userPrfoiles != null) {
              userPrfoiles.businessImage = fileName;
              global.MyConnections.props.setUserProfile(userPrfoiles);
            }
            break;
          case ImageTypes.businessCoverPicture:
            fileName =
              global.LoginUserId +
              '_BusinessCoverPicture' +
              date +
              '.' +
              fileType;
            global.BusinessCoverPhoto = Source;
            if (userPrfoiles != null) {
              userPrfoiles.businessCoverImage = fileName;
              global.MyConnections.props.setUserProfile(userPrfoiles);
            }
            break;
        }
        var dataToSend = {
          FrontImgbase64: image.data,
          FileName: fileName,
          UserId: global.LoginUserId,
          ImageType: imageType,
        };
        var formBody = [];
        for (var key in dataToSend) {
          var encodedKey = encodeURIComponent(key);
          var encodedValue = encodeURIComponent(dataToSend[key]);
          formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody.push(
          encodeURIComponent('imageType') + '=' + encodeURIComponent(imageType),
        );
        formBody = formBody.join('&');
        return fetch(global.APIURL + 'api/Card/UploadPicture', {
          method: 'POST', //Request Type
          body: formBody, //post body
          headers: {
            Accept: "application/x-www-form-urlencoded;charset=UTF-8",
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
        })
          .then(_response => _response.text())
          .then(_responseJson => {
            //Alert.alert('uploaded successfully');
            var data = obj.state.tempUserData;
            switch (imageType) {
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
            obj.setState({ tempUserData: data });
            global.profileState.setState({ tempUserData: data });
          })
          .catch(e => Alert.alert('error in' + e));
        // }
      });
  } else if (PickFrom === 'Gallery') {
    return await
      //  ImagePicker.launchImageLibrary(options, response => {
      // if (response.didCancel) {
      // } else if (response.error) {
      // } else if (response.customButton) {
      // } else {
      ImagePicker.openPicker({
        width: 500,
        height: 500,
        cropping: true,
        //cropperCircleOverlay: true,
        // compressImageMaxWidth: 640,
        // compressImageMaxHeight: 480,
        //  freeStyleCropEnabled: true,
        // includeExif: true,
        includeBase64: true
      }).then(image => {
       // console.log("ChooseData", image);
        let Source = { uri: image.path, cache: 'reload' };
        var date = new Date();
        date = date.getSeconds();
        var fileName = '';
        var _ext = image.path;
        _ext = _ext.split('.');
        var fileType = Platform.OS == 'android' ? _ext[1] : _ext[2];
        //console.log("file", _ext);
        var userPrfoiles = global.MyConnections.props.userProfile;
        //1: Profile Picture, 2: Profile Cover picture, 3:Business Image, 4: Business Cover Image
        switch (imageType) {
          case ImageTypes.profilePicture:
            fileName =
              global.LoginUserId + '_ProfilePicture' + date + '.' + fileType;
            global.PersonalPhoto = Source;
            if (userPrfoiles != null) {
              userPrfoiles.image = fileName;
              global.MyConnections.props.setUserProfile(userPrfoiles);
            }
            break;
          case ImageTypes.profileCoverPicture:
            fileName =
              global.LoginUserId +
              '_ProfileCoverPiture' +
              date +
              '.' +
              fileType;
            global.PersonalCoverPhoto = Source;
            if (userPrfoiles != null) {
              userPrfoiles.profileCoverImage = fileName;
              global.MyConnections.props.setUserProfile(userPrfoiles);
            }
            break;
          case ImageTypes.businessLogo:
            fileName =
              global.LoginUserId + '_BusinessLogo' + date + '.' + fileType;
            global.BusinessLogo = Source;
            if (userPrfoiles != null) {
              userPrfoiles.businessImage = fileName;
              global.MyConnections.props.setUserProfile(userPrfoiles);
            }
            break;
          case ImageTypes.businessCoverPicture:
            fileName =
              global.LoginUserId +
              '_BusinessCoverPicture' +
              date +
              '.' +
              fileType;
            global.BusinessCoverPhoto = Source;
            if (userPrfoiles != null) {
              userPrfoiles.businessCoverImage = fileName;
              global.MyConnections.props.setUserProfile(userPrfoiles);
            }
            break;
        }
        var dataToSend = {
          FrontImgbase64: image.data,
          FileName: fileName,
          UserId: global.LoginUserId,
          ImageType: imageType,
        };
        var formBody = [];
        for (var key in dataToSend) {
          var encodedKey = encodeURIComponent(key);
          var encodedValue = encodeURIComponent(dataToSend[key]);
          formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody.push(
          encodeURIComponent('imageType') + '=' + encodeURIComponent(imageType),
        );
        formBody = formBody.join('&');
        return fetch(global.APIURL + 'api/Card/UploadPicture', {
          method: 'POST', //Request Type
          body: formBody, //post body
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
        })
          .then(_response => _response.text())
          .then(_responseJson => {
            //Alert.alert('uploaded successfully');
            var data = obj.state.tempUserData;
            switch (imageType) {
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
            obj.setState({ tempUserData: data });
            global.profileState.setState({ tempUserData: data });
          })
          .catch(e => Alert.alert('error in' + e));
        // }
      });
  }
};
