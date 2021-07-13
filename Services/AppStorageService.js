import AsyncStorage from '@react-native-community/async-storage';
import {isNil, isUndefined} from 'lodash';

const setValue = (key, value) => {
  AsyncStorage.removeItem(key);
  return AsyncStorage.setItem(key, value);
};

const getValue = key => {
  return AsyncStorage.getItem(key);
};

const remove = key => {
  return AsyncStorage.removeItem(key);
};
const USER_PROFILE = 'USER_PROFILE';
const BUSINESS_CARD_DETAILS = 'BUSINESS_CARD_DETAILS';
const MY_CONNECTION_DETAILS = 'MY_CONNECTION_DETAILS';

const AppStorageService = {
  setUserProfile(value) {
    return setValue(USER_PROFILE, JSON.stringify(value));
  },
  getUserProfile() {
    return getValue(USER_PROFILE).then(value => {
      const valueIsPresent = !isUndefined(value) && !isNil(value);

      if (valueIsPresent) {
        return JSON.parse(value);
      }

      return undefined;
    });
  },
  clearUserProfile() {
    return remove(USER_PROFILE);
  },
  setBusinessCardDetails(value) {
    return setValue(BUSINESS_CARD_DETAILS, JSON.stringify(value));
  },
  clearBusinessCardDetailsStorage() {
    return remove(BUSINESS_CARD_DETAILS);
  },
  setMyConnectionDetails(value) {
    return setValue(MY_CONNECTION_DETAILS, JSON.stringify(value));
  },
  clearMyConnectionDetailsStorage() {
    return remove(MY_CONNECTION_DETAILS);
  },
  async setRecentFiveUserLocation(currentUserId, value) {
  //  console.log("setRecentFiveUserLocation",currentUserId+ "  " +value)
    let existingValue = await this.getRecentFiveUserLocation(currentUserId);
    if(!existingValue){
      await setValue(`MY_LOCATIONS_${currentUserId}`, JSON.stringify([value]));
    }
   else if(existingValue && existingValue.length<5)
    {
      let newValue = [...existingValue,value].reverse()
    await setValue(`MY_LOCATIONS_${currentUserId}`, JSON.stringify(newValue));
    }
    else{
    //  console.log("existingValue",existingValue)
      existingValue.splice(0, 1)
      let newValue = [...existingValue,value]
      await setValue(`MY_LOCATIONS_${currentUserId}`, JSON.stringify(newValue));
    }
  },
 async getRecentFiveUserLocation(currentUserId) {
    let value = await getValue(`MY_LOCATIONS_${currentUserId}`);
    const valueIsPresent = !isUndefined(value) && !isNil(value);

    if (valueIsPresent) {
      return JSON.parse(value);
    }
    else {
      return [];
    }
  }
};

export default AppStorageService;
