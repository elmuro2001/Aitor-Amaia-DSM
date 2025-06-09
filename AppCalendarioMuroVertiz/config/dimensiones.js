// config/CalendarDimensions.js
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const headerHeight = 250;
const footerHeight = screenHeight * 0.06;
const monthHeaderHeight = 60;

const availableHeight = screenHeight - headerHeight - footerHeight - monthHeaderHeight;

const daySize = ((screenWidth - 32 - 6 * 4) / 7) - 2;
const dayHeight = availableHeight / 6 - 4;

export default {
  screenWidth,
  screenHeight,
  headerHeight,
  footerHeight,
  monthHeaderHeight,
  availableHeight,
  daySize,
  dayHeight,
};
