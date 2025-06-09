import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, ScrollView, Image, Dimensions, } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import '../config/CalendarioConfig';
import styles from '../styles/CalendarioStyle';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const headerHeight = 250;
const footerHeight = screenHeight * 0.06;
const monthHeaderHeight = 60;

const availableHeight = screenHeight - headerHeight - footerHeight - monthHeaderHeight;

const daySize = ((screenWidth - 32 - 6 * 4) / 7) - 2;
const dayHeight = availableHeight / 6 - 4;

const CalendarComponent = () => {
  const [tasks, setTasks] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [taskName, setTaskName] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    const today = new Date();
    updateMonthYear(today);

    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Error al cargar las tareas:', error);
      }
    };
    loadTasks();
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
  };

  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error('Error al guardar las tareas:', error);
    }
  };

  const createTask = () => {
    if (!selectedDate || !taskName.trim()) {
      console.error('Debe seleccionar una fecha y escribir un nombre para la tarea.');
      return;
    }

    const newTasks = {
      ...tasks,
      [selectedDate]: taskName,
    };
    setTasks(newTasks);
    saveTasks(newTasks);
    setTaskName('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View>
          {/* CABECERA CON IMAGEN */}
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
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            onMonthChange={handleMonthChange}
            renderHeader={() => (
              <View style={styles.customHeaderContainer}>
                <Text style={styles.customHeaderText}>{currentMonth}</Text>
              </View>
            )}
            markedDates={{
              ...Object.keys(tasks).reduce((acc, date) => {
                acc[date] = { marked: true, dotColor: 'blue' };
                return acc;
              }, {}),
              [selectedDate]: { selected: true, selectedColor: 'blue' },
            }}
            style={styles.calendar}
            theme={{
              todayTextColor: '#00adf5',
              selectedDayBackgroundColor: '#00adf5',
              arrowColor: '#333',
              textDayFontSize: 16,
              textDayHeaderFontSize: 14,
              'stylesheet.day.basic': {
                base: {
                  width: daySize,
                  height: dayHeight - 1,
                  backgroundColor: '#e6e6e6',
                  borderRadius: 8,
                  margin: 2,
                  paddingTop: 4, // espacio arriba
                  alignItems: 'center',
                  justifyContent: 'flex-start', // número arriba
                  flexDirection: 'column',
                },
                text: {
                  fontSize: 14,
                  color: '#2d4150',
                  textAlign: 'center',
                },
              }
            }}
          />
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Footer</Text>
        </View>
      </View>

      {/* TAREAS 
      <ScrollView contentContainerStyle={styles.taskSection}>
        <Text>Fecha seleccionada: {selectedDate || 'Ninguna'}</Text>
        <TextInput
          placeholder="Escribe el nombre de la tarea"
          value={taskName}
          onChangeText={setTaskName}
          style={styles.input}
        />
        <Button title="Crear Tarea" onPress={createTask} />

        <Text style={styles.taskTitle}>Tareas guardadas:</Text>
        {Object.entries(tasks).map(([date, task]) => (
          <Text key={date}>{`${date}: ${task}`}</Text>
        ))}
      </ScrollView> */}

    </SafeAreaView>
  );
};

export default CalendarComponent;
