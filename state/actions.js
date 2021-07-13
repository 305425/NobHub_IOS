import {
  SET_USER_PROFILE,
  SET_AUTH_STATE,
  CLEAR_USER_PROFILE,
  SET_BUSINESS_CARD_DETAILS,
  CLEAR_BUSINESS_CARD_DETAILS,
  SET_MY_CONNECTION_DETAILS,
  CLEAR_MY_CONNECTION_DETAILS,
} from './types';
export const setAuthenticated = (authenticated, firebaseUserInfo) => {
  return {
    type: SET_AUTH_STATE,
    payload: {
      authenticated,
      firebaseUserInfo,
    },
  };
};

export const setUserProfile = userProfile => {
  return {
    type: SET_USER_PROFILE,
    payload: {
      userProfile,
    },
  };
};

export const clearUserProfile = () => {
  return {
    type: CLEAR_USER_PROFILE,
  };
};
export const setBusinessCardDetails = businessCardDetails => {
  return {
    type: SET_BUSINESS_CARD_DETAILS,
    payload: {
      businessCardDetails,
    },
  };
};

export const clearBusinessCardDetailsStorage = () => {
  return {
    type: CLEAR_BUSINESS_CARD_DETAILS,
  };
};
export const setMyConnectionDetails = myConnectionDetails => {
  return {
    type: SET_MY_CONNECTION_DETAILS,
    payload: {
      myConnectionDetails,
    },
  };
};

export const clearMyConnectionDetailsStorage = () => {
  return {
    type: CLEAR_MY_CONNECTION_DETAILS,
  };
};
