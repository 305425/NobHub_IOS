import CommonColor from '../../native-base-theme/variables/platform';

const Variables = {
  ...CommonColor,

  brandPrimary: '#1DA1F2',

  get buttonPrimaryBg() {
    return this.brandPrimary;
  },

  normalTextColor: '#20243B',
  lightTextColor: '#414141',

  get smallFontSize() {
    return this.fontSizeBase * 0.8;
  },

  extraBold: 'Gilroy-ExtraBold',
  lightFont: 'Gilroy-Light',
  blackFont: 'Radomir Tinkov - Gilroy-Black',
  boldFont: 'Radomir Tinkov - Gilroy-Bold',
  heavyFont: 'Radomir Tinkov - Gilroy-Heavy',
  mediumFont: 'Radomir Tinkov - Gilroy-Medium',
  regularFont: 'Radomir Tinkov - Gilroy-Regular',
  thinFont: 'Radomir Tinkov - Gilroy-Thin',
  containerBgColor: 'transparant',
};

export default Variables;
