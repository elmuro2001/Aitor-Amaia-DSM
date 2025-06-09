// constantes/dimensions.js
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const headerHeight = 250;
export const footerHeight = screenHeight * 0.06;
export const monthHeaderHeight = 60;

export const availableHeight = screenHeight - headerHeight - footerHeight - monthHeaderHeight;

export const daySize = ((screenWidth - 32 - 6 * 4) / 7) - 2;
export const dayHeight = availableHeight / 6 - 4;
