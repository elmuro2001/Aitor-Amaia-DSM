import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import GestorActividades from './Actividad';

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={
          selectedDate
            ? { [selectedDate]: { selected: true, selectedColor: 'blue' } }
            : {}
        }
      />
      <GestorActividades selectedDate={selectedDate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40, // Ajusta este valor según lo que necesites
  },
});

export default CalendarComponent;