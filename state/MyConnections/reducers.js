import {SET_MY_CONNECTION_DETAILS, CLEAR_MY_CONNECTION_DETAILS} from '../types';
const initial = {
  myConnectionDetails: null,
};
export default (previousState = initial, action) => {
  switch (action.type) {
    case SET_MY_CONNECTION_DETAILS:
      return {
        ...previousState,
        ...action.payload,
      };

    case CLEAR_MY_CONNECTION_DETAILS:
      return {
        ...previousState,
        myConnectionDetails: null,
      };
    default:
      return previousState;
  }
};
