import {
  setAuthenticated,
  setUserProfile as setUserProfileAction,
  clearUserProfile as clearUserProfileAction,
  setBusinessCardDetails as setBusinessCardDetailsAction,
  clearBusinessCardDetailsStorage as clearBusinessCardDetailsStorageAction,
  setMyConnectionDetails as setMyConnectionDetailsAction,
  clearMyConnectionDetailsStorage as clearMyConnectionDetailsStorageAction,
} from './actions';
import {isNil, isUndefined} from 'lodash';
import StorageService from '../Services/AppStorageService';

export const setAuthenticationInfo = info => {
  return dispatch => {
    dispatch(setAuthenticated(!isNil(info), info));
    saveAuthenticationInfoToStorage(info);
  };
};

const saveAuthenticationInfoToStorage = info => {
  StorageService.setAuthenticationInfo(info).catch(() => {});
};

export const setUserProfile = userProfile => {
  return dispatch => {
    dispatch(setUserProfileAction(userProfile));
    saveUserProfileToStorage(userProfile);
  };
};

const saveUserProfileToStorage = userProfile => {
  if (isNil(userProfile) || isUndefined(userProfile)) {
    StorageService.clearUserProfile();
  } else {
    StorageService.setUserProfile(userProfile).catch(() => {});
  }
};

export const clearUserProfile = () => {
  return dispatch => {
    dispatch(clearUserProfileAction());
    clearUserProfileToStorage();
  };
};

const clearUserProfileToStorage = () => {
  StorageService.clearUserProfile().catch(() => {});
};

export const loadFromStorage = () => {
  return async dispatch => {
    await _loadUSERProfileFromStorage(dispatch);
  };
};
const _loadUSERProfileFromStorage = async dispatch => {
  try {
    const userProfile = await StorageService.getUserProfile();

    if (userProfile) {
      setUserProfile(userProfile)(dispatch);
    }
  } catch (err) {}
};

export const setBusinessCardDetails = businessCardDetails => {
  return dispatch => {
    dispatch(setBusinessCardDetailsAction(businessCardDetails));
    setBusinessCardDetailsToStorage(businessCardDetails);
  };
};

const setBusinessCardDetailsToStorage = businessCardDetails => {
  if (isNil(businessCardDetails) || isUndefined(businessCardDetails)) {
    StorageService.clearBusinessCardDetailsStorage();
  } else {
    StorageService.setBusinessCardDetails(businessCardDetails).catch(() => {});
  }
};

export const clearBusinessCardDetails = () => {
  return dispatch => {
    dispatch(clearBusinessCardDetailsStorageAction());
    clearBusinessCardDetailsStorage();
  };
};

const clearBusinessCardDetailsStorage = () => {
  StorageService.clearBusinessCardDetailsStorage().catch(() => {});
};

export const setMyConnectionDetails = myConnectionDetails => {
  return dispatch => {
    dispatch(setMyConnectionDetailsAction(myConnectionDetails));
    setMyConnectionDetailsToStorage(myConnectionDetails);
  };
};

const setMyConnectionDetailsToStorage = myConnectionDetails => {
  if (isNil(myConnectionDetails) || isUndefined(myConnectionDetails)) {
    StorageService.clearMyConnectionDetailsStorage();
  } else {
    StorageService.setMyConnectionDetails(myConnectionDetails).catch(() => {});
  }
};

export const clearMyConnectionDetails = () => {
  return dispatch => {
    dispatch(clearMyConnectionDetailsStorageAction());
    clearMyConnectionDetailsStorage();
  };
};

const clearMyConnectionDetailsStorage = () => {
  StorageService.clearBusinessCardDetailsStorage().catch(() => {});
};
