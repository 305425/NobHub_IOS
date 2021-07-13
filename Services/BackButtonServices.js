import {Actions} from 'react-native-router-flux';
import {Scenes} from '../shared/Constants';
import {fromPairs} from 'lodash';
import {BackHandler} from 'react-native';

const exitApp = () => {
  BackHandler.exitApp();
};

export const goBack = () => {
  return handleGoBack;
};

export const handleGoBack = (dispatch, getState) => {
  const scene = Actions.currentScene;
  const handler = backActionHandlers[scene];

  if (handler) {
    handler(dispatch, getState);
  } else {
    Actions.pop();
  }
};
export const hardWareBackHandler = () => {
  BackHandler.addEventListener('hardwareBackPress', handleBackButton);
};
const handleBackButton = () => {
  var previousScene = Actions.prevScene;
  if (
    Actions.currentScene === Scenes.myConnections ||
    previousScene === Scenes.selectBusinessCard ||
    previousScene === Scenes.otp ||
    Actions.currentScene === Scenes.startPage
  ) {
    return true;
  }
  return false;
};

const backActionHandlers = fromPairs([[Scenes.startPage, exitApp]]);
