import {SET_AUTH_STATE, SET_USER_PROFILE, CLEAR_USER_PROFILE} from '../types';
const initial = {
  userProfile: null,
};
export default (previousState = initial, action) => {
  switch (action.type) {
    case SET_AUTH_STATE:
    case SET_USER_PROFILE:
      return {
        ...previousState,
        ...action.payload,
      };

    case CLEAR_USER_PROFILE:
      return {
        ...previousState,
        userProfile: null,
      };
    default:
      return previousState;
  }
};
