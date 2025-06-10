import { Dimensions } from 'react-native';

// Tomamos las dimensiones de la pantalla
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Definimos las dimensiones de los componentes del calendario en base a las dimensiones de la pantalla
const headerHeight = screenHeight * 0.2;
const footerHeight = screenHeight * 0.06; 
const headerText = 25;
const monthHeaderHeight = 50;

// Calculamos el tamaño de los días del calendario
const daySize = ((screenWidth - 32 - 6 * 4) / 7) - 2;

// Espacio para el calendario y margen inferior
const availableHeightInitial = screenHeight - headerHeight - footerHeight - monthHeaderHeight;

// Calculamos el margen inferior del calendario
const marginBottomFactor = 0.7;
const calendarMarginBottom = (availableHeightInitial / 4 - 4) * marginBottomFactor;

// Ajustamos el espacio disponible restando el margen inferior del calendario
const availableHeightFinal = availableHeightInitial - calendarMarginBottom;

// Calculamos la altura de cada día del calendario
const dayHeight = (availableHeightFinal / 8) - 4;

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
