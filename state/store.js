import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {reducer as formReducer} from 'redux-form';
import * as reducer from './ducks';

export default () => {
  return createStore(
    combineReducers({
      ...reducer,
      form: formReducer,
    }),
    applyMiddleware(thunk),
  );
};
