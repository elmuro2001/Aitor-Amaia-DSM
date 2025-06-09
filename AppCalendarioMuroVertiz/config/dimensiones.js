import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const headerHeight = screenHeight * 0.2;
const footerHeight = screenHeight * 0.06; 
const headerText = 25;
const monthHeaderHeight = 50;

const daySize = ((screenWidth - 32 - 6 * 4) / 7) - 2;

// Espacio para el calendario y margen inferior
const availableHeightInitial = screenHeight - headerHeight - footerHeight - monthHeaderHeight;

const marginBottomFactor = 0.7;
const calendarMarginBottom = (availableHeightInitial / 4 - 4) * marginBottomFactor;

const availableHeightFinal = availableHeightInitial - calendarMarginBottom;

const dayHeight = (availableHeightFinal / 7) - 4;

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
  headerText,
};
