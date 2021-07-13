import {SET_BUSINESS_CARD_DETAILS, CLEAR_BUSINESS_CARD_DETAILS} from '../types';
const initial = {
  businessCardDetails: null,
};
export default (previousState = initial, action) => {
  switch (action.type) {
    case SET_BUSINESS_CARD_DETAILS:
      return {
        ...previousState,
        ...action.payload,
      };

    case CLEAR_BUSINESS_CARD_DETAILS:
      return {
        ...previousState,
        businessCardDetails: null,
      };
    default:
      return previousState;
  }
};
