import React, {Suspense} from 'react';

import {StyleSheet, View} from 'react-native';
import {Provider} from 'react-redux';
import {store} from '../state';
import RoutesComponent from './Routes';
import {Spinner, StyleProvider} from 'native-base';
import AppTheme from '../styles/theme';

const styles = StyleSheet.create({container: {flex: 1}});

const Root = () => {
  // useEffect(() => {
  //   SplashScreen.hide();
  // }, []);

  return (
    <View style={styles.container}>
      <Provider store={store}>
        <StyleProvider style={AppTheme}>
          <Suspense fallback={<Spinner />}>
            <RoutesComponent />
          </Suspense>
        </StyleProvider>
      </Provider>
    </View>
  );
};

export default Root;
