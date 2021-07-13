import {PixelRatio} from 'react-native';
export const styles = {
  viewTabAndMenu: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
  },
  ImageContainer: {
    borderRadius: 10,
    width: 250,
    height: 250,
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CDDC39',
  },

  MainContainer: {
    // Setting up View inside content in Vertically center.
    justifyContent: 'center',
    // flex: 1,
    margin: 10,
  },
  ImageStyle: {
    //  padding: 10,
    //  marginLeft: 100,
    height: 25,
    width: 25,
    // resizeMode: 'stretch',
    // alignItems: 'center',
  },
};
