import dimensions from '../config/dimensiones';

const CalendarioTheme = {
  todayTextColor: '#00adf5',
  arrowColor: '#333',
  textDayFontSize: 16,
  textDayHeaderFontSize: 14,
  textDisabledColor: '#999999',
  'stylesheet.day.basic': {
    base: {
      width: dimensions.daySize,
      height: dimensions.dayHeight - 1,
      backgroundColor: '#f7f7f7',
      borderRadius: 8,
      margin: 2,
      paddingTop: 4,
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'column',
    },
    text: {
      fontSize: 14,
      color: '#2d4150',
      textAlign: 'center',
    },
    today: {
      backgroundColor: '#d0f0ff',
      borderRadius: 8,
    },
  },
};

export default CalendarioTheme;
