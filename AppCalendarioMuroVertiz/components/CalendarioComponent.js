import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración del idioma para España
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  monthNamesShort: [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ],
  dayNames: [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const CalendarComponent = () => {
  const [tasks, setTasks] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [taskName, setTaskName] = useState('');

  // Cargar tareas al iniciar la app
  useEffect(() => {
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
    setTaskName(''); // Limpiar el campo de texto
  };

  return (
    <View>
      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
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

export default CalendarComponent;