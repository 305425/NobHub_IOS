import {Platform} from 'react-native';
export const styles = {
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },

  Alert_Main_View: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFF',
    width: '100%',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
  },

  Alert_Title: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    paddingTop: 20,
    height: '28%',
  },

  Alert_Message: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    height: '50%',
  },

  buttonStyle: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  TextStyle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  viewButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 40,
  },
  viewModalInside: {
    alignItems: 'center',
    justifyContent: 'center',
  },
};
