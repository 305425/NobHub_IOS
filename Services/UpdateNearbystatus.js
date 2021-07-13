import {Alert} from 'react-native';
const Updatenearbystatus = {
  updateNearbyStatus(nearbystatus, long, lat) {
    try {
      var dataToSend = {
        UserId: global.LoginUserId,
        nearbystatus: nearbystatus,
        newLat: lat,
        newLang: long,
        Dist_Unit: 'M',
      };
      var formBody = [];
      for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(global.APIURL + 'api/Card/UpdateNearbyStatus', {
        method: 'POST', //Request Type
        body: formBody, //post body
        headers: {
          //Header Defination
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          //Alert.alert('uodated succesfully');
        });
    } catch (e) {
      Alert.alert(e);
    }
  },
};
export default Updatenearbystatus;
