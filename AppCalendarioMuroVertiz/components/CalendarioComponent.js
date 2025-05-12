import React from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarComponent = () => {
  return (
    <View>
      <Calendar
        onDayPress={(day) => {
          console.log('Día seleccionado:', day);
        }}
      />
    </View>
  );
};

export default CalendarComponent;