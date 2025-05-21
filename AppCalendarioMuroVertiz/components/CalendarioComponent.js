import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../config/CalendarioConfig';

const CalendarComponent = () => {
  const [tasks, setTasks] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [taskName, setTaskName] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');

  // Cargar tareas al iniciar la app y establecer el mes actual
  useEffect(() => {
    const today = new Date();
    const monthName = today.toLocaleString('default', { month: 'long' });
    setCurrentMonth(monthName);

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

  // Guardar tareas en AsyncStorage
  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error('Error al guardar las tareas:', error);
    }
  };

  // Crear una nueva tarea
  const createTask = () => {
    if (!selectedDate || !taskName.trim()) {
      console.error('Debe seleccionar una fecha y escribir un nombre para la tarea.');
      return;
    }

    const newTasks = {
      ...tasks,
      [selectedDate]: taskName
    };
    setTasks(newTasks);
    saveTasks(newTasks);
    setTaskName('');
  };

  // Cambiar el mes actual en el header
  const handleMonthChange = (month) => {
    const date = new Date(month.dateString);
    const monthName = date.toLocaleString('default', { month: 'long' });
    setCurrentMonth(monthName);
  };

  return (
    <View>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        onMonthChange={handleMonthChange}
        renderHeader={() => (
          <View style={styles.header}>
            <Text style={styles.headerText}>{currentMonth.toUpperCase()}</Text>
          </View>
        )}
        markedDates={{
          ...Object.keys(tasks).reduce((acc, date) => {
            acc[date] = { marked: true, dotColor: 'blue' };
            return acc;
          }, {}),
          [selectedDate]: { selected: true, selectedColor: 'blue' }
        }}
      />
      <View>
        <Text>Fecha seleccionada: {selectedDate || 'Ninguna'}</Text>
        <TextInput
          placeholder="Escribe el nombre de la tarea"
          value={taskName}
          onChangeText={setTaskName}
        />
        <Button title="Crear Tarea" onPress={createTask} />
      </View>
      <View>
        <Text>Tareas guardadas:</Text>
        {Object.entries(tasks).map(([date, task]) => (
          <Text key={date}>{`${date}: ${task}`}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333'
  }
});

export default CalendarComponent;