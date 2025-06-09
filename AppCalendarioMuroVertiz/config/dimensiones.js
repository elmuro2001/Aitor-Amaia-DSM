import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const headerHeight = 250;
const footerHeight = screenHeight * 0.06;
const monthHeaderHeight = 60;

const daySize = ((screenWidth - 32 - 6 * 4) / 7) - 2;

// 1. availableHeight inicial sin margen
const availableHeightInitial = screenHeight - headerHeight - footerHeight - monthHeaderHeight;

// 2. dayHeight provisional
const dayHeightProvisional = (availableHeightInitial / 4) - 4;

// 3. margen proporcional al dayHeight provisional
const marginBottomFactor = 0.7;
const calendarMarginBottom = dayHeightProvisional * marginBottomFactor;

// 4. availableHeight final restando margen
const availableHeightFinal = availableHeightInitial - calendarMarginBottom;

// 5. dayHeight final
const dayHeight = availableHeightFinal / 6 - 4;

export default {
  screenWidth,
  screenHeight,
  headerHeight,
  footerHeight,
  monthHeaderHeight,
  marginBottomFactor,
  calendarMarginBottom,
  availableHeight: availableHeightFinal,
  daySize,
  dayHeight,
};
