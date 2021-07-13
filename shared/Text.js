import {Text as NBText} from 'native-base';
import React from 'react';
import {StyleSheet, Text as NText, Platform} from 'react-native';
import Variables from '../styles/theme/variables';

export const Text = ({style, children}) => {
  if(Platform.OS == 'android'){
    const styles= StyleSheet.create({
      text: {
        fontFamily: Variables.regularFont,
      },
    });
    return (
      <NBText uppercase={false} style={[styles.text, style]}>
        {children}
      </NBText>
    );
}
  return (
    <NBText uppercase={false} style={style}>
      {children}
    </NBText>
  );
};


export const MediumBoldText = ({style, children}) => {
  if(Platform.OS == 'android'){
    const styles= StyleSheet.create({
      text: {
        fontFamily: Variables.mediumFont,
      },
    });
    return (
      <NBText uppercase={false} style={[styles.text, style]}>
        {children}
      </NBText>
    );
}
  return (
    <NBText uppercase={false} style={[{fontWeight:'bold'},style]}>
      {children}
    </NBText>
  );
};

export const BoldText = ({style, children}) => {
  if(Platform.OS == 'android'){
    const styles= StyleSheet.create({
      text: {
        fontFamily: Variables.boldFont,
      },
    });
    return (
      <NBText uppercase={false} style={[styles.text, style]}>
        {children}
      </NBText>
    );
}
  return (
    <NBText uppercase={false} style={[{fontWeight:'bold'},style]}>
      {children}
    </NBText>
  );
};

export const BolderText = ({style, children}) => {
  if(Platform.OS == 'android'){
    const styles= StyleSheet.create({
      text: {
        fontFamily: Variables.blackFont,
      },
    });
    return (
      <NBText uppercase={false} style={[styles.text, style]}>
        {children}
      </NBText>
    );
}
  return (
    <NBText uppercase={false} style={[{fontWeight:'bold'},style]}>
      {children}
    </NBText>
  );
};

export const ExtraBoldText = ({style, children}) => {
  if(Platform.OS == 'android'){
    const styles= StyleSheet.create({
      text: {
        fontFamily: Variables.extraBold,
      },
    });
    return (
      <NBText uppercase={false} style={[styles.text, style]}>
        {children}
      </NBText>
    );
}
  return (
    <NBText uppercase={false} style={[{fontWeight:'bold'},style]}>
      {children}
    </NBText>
  );
};
