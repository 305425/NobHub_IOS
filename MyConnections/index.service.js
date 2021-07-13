import ImagePicker from 'react-native-image-picker';
import {PermissionsAndroid, Alert, Platform} from 'react-native';
import {Actions} from 'react-native-router-flux';
export const handleOnScannerPress = async userProfile => {
  var responseData = '';
  if (Platform.OS === 'android') {
    responseData = await requestCameraPermission(userProfile);
    return responseData;
  } else {
    selectPhotoTapped(userProfile);
    //return true;
  }
};
const requestCameraPermission = async userProfile => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'CameraExample App Camera Permission',
        message: 'CameraExample App needs access to your camera ',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      var responseData = '';
      responseData = await requestExternalWritePermission(userProfile);
      return responseData;
    } else {
      Alert.alert('CAMERA permission denied');
    }
  } catch (err) {
    Alert.alert('Camera permission err', err);
  }
};
const requestExternalWritePermission = async userProfile => {
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
      return await requestExternalReadPermission(userProfile);
    } else {
      Alert.alert('WRITE_EXTERNAL_STORAGE permission denied');
    }
  } catch (err) {
    Alert.alert('Write permission err', err);
  }
};
const requestExternalReadPermission = async userProfile => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'CameraExample App Read Storage Read Permission',
        message: 'CameraExample App needs access to your SD Card ',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return await selectPhotoTapped(userProfile);
    } else {
      Alert.alert('READ_EXTERNAL_STORAGE permission denied');
    }
  } catch (err) {
    Alert.alert('Read permission err', err);
  }
};

const selectPhotoTapped = async userProfile => {
  const options = {
    quality: 1.0,
    maxWidth: 500,
    maxHeight: 500,
    storageOptions: {
      skipBackup: true,
    },
  };
  return ImagePicker.showImagePicker(options, response => {
    if (response.didCancel) {
    } else if (response.error) {
    } else if (response.customButton) {
    } else {
      var fileType = response.uri;
      fileType = fileType.split('.');
      Actions.scannedImages({
        FileName: fileType.length == 2 ? fileType[1] : fileType[2],
        ImageBase64: response.data,
        UserId: userProfile.guid,
        Source: response.uri,
        UserProfile: userProfile,
      });
    }
  });
};
