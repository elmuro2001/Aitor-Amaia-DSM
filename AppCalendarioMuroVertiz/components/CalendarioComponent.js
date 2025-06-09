import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, ScrollView, Image, Dimensions, } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import '../config/CalendarioConfig';
import styles from '../styles/CalendarioStyle';
import dimensions from '../config/dimensiones';
import GestorActividades from './Actividad';

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    const today = new Date();
    updateMonthYear(today);
  }, []);

  const updateMonthYear = (date) => {
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    setCurrentMonth(monthName.toUpperCase()); // setCurrentMonth(`${monthName.toUpperCase()} ${year}`.toUpperCase());
    setCurrentYear(year.toString());
  };

  const handleMonthChange = (month) => {
    const date = new Date(month.year, month.month - 1);
    updateMonthYear(date);

    // Forzar rerender suave. Si no nos daba problemas (sin y con el render)
    setRefreshFlag(f => !f);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        {/* CABECERA */}
        <View style={styles.headerContainer}>
          <Image
            source={require('../assets/wallpaper1.jpg')}
            style={styles.headerImage}
          />
          <Text style={styles.yearText}>{currentYear}</Text>
          <LinearGradient
            colors={['transparent', 'white']}
            style={styles.gradient}
          />
        </View>

        {/* CALENDARIO */}
        <View style={styles.calendarWrapper}>
          <Calendar
            firstDay={1}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            onMonthChange={handleMonthChange}
            hideExtraDays={false}
            renderHeader={() => (
              <View style={styles.customHeaderContainer}>
                <Text style={styles.customHeaderText}>{currentMonth}</Text>
              </View>
            )}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#c9c9c9' },
            }}
            disableAllTouchEventsForInactiveDays={false}
            style={styles.calendar}
            theme={{
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
            }}
          />
          <GestorActividades selectedDate={selectedDate} />
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Footer</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CalendarComponent;
