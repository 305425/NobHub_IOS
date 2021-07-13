import Variables from './variables';
import getTheme from '../../native-base-theme/components';
import StartPage from '../../Account/StartPage';
const AppTheme = {
  ...getTheme(Variables),
  ...StartPage,
};
export default AppTheme;
