// Importaciones necesarias
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GestorActividades from './Actividad';
import '../config/CalendarioConfig';

import styles from '../styles/CalendarioStyle';
import CalendarioTheme from '../styles/CalendarioTheme';
import { LinearGradient } from 'expo-linear-gradient';

const CalendarComponent = ({ externalEvents, setVisibleMonth, refreshExternalEvents, setRefreshExternalEvents }) => {
  // Constantes y estados 
  const [tasks, setTasks] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshExternalEvents(prev => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // UseEffect carga datos al recargar el componente
  useEffect(() => {
    // Actualizar el mes y año al cargar el componente
    const today = new Date();
    updateMonthYear(today);

    // Cargar tareas desde AsyncStorage al iniciar el componente
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('TASKS');
        if (storedTasks) {
          const parsed = JSON.parse(storedTasks);
          // MIGRACIÓN: añade id si falta
          Object.keys(parsed).forEach(date => {
            parsed[date] = parsed[date].map(task => ({
              ...task,
              id: task.id || Date.now().toString() + Math.random().toString(36).slice(2, 11),
            }));
          });
          setTasks(parsed);
          // Guarda la migración en AsyncStorage
          await AsyncStorage.setItem('TASKS', JSON.stringify(parsed));
        }
      } catch (error) {
        console.log('Error cargando tareas:', error);
      }
    };
    loadTasks();
  }, []);

  // Función para actualizar el mes y año en el estado
  const updateMonthYear = (date) => {
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    setCurrentMonth(monthName.toUpperCase()); // setCurrentMonth(`${monthName.toUpperCase()} ${year}`.toUpperCase());
    setCurrentYear(year.toString());
  };

  // Función para manejar el cambio de mes en el calendario
  const handleMonthChange = (month) => {
    const date = new Date(month.year, month.month - 1);
    updateMonthYear(date);

    // ACTUALIZA EL MES VISIBLE EN EL COMPONENTE SUPERIOR
    if (setVisibleMonth) {
      const monthStr = `${month.year}-${String(month.month).padStart(2, '0')}`;
      setVisibleMonth(monthStr);
    }

    // Forzar rerender suave para evitar problemas de renderizado
    setRefreshFlag(f => !f);
  };

  // Construir markedDates con dots de colores
  const markedDates = {};

  // Tareas locales
  Object.values(tasks).flat().forEach((task) => {
    const start = task.startDate ? task.startDate.slice(0, 10) : null;
    const end = task.endDate ? task.endDate.slice(0, 10) : start;

    if (start && end) {
      let current = new Date(start);
      const last = new Date(end);
      while (current <= last) {
        const key = current.toISOString().slice(0, 10);
        if (!markedDates[key]) markedDates[key] = { dots: [] };
        markedDates[key].dots.push({
          key: (task.id || task.name || '') + key,
          color: task.color || '#50cebb',
        });
        current.setDate(current.getDate() + 1);
      }
    }
  });

  // Eventos externos
  externalEvents.forEach((event) => {
    const start = event.startDate ? event.startDate.slice(0, 10) : null;
    const end = event.endDate ? event.endDate.slice(0, 10) : start;

    if (start && end) {
      let current = new Date(start);
      const last = new Date(end);
      while (current <= last) {
        const key = current.toISOString().slice(0, 10);
        if (!markedDates[key]) markedDates[key] = { dots: [] };
        markedDates[key].dots.push({
          key: (event.id || event.title || '') + key,
          color: event.color || '#2196F3', // Color para externos
        });
        current.setDate(current.getDate() + 1);
      }
    }
  });

  // Marca la fecha seleccionada (manteniendo el estilo original)
  if (selectedDate) {
    if (!markedDates[selectedDate]) markedDates[selectedDate] = { dots: [] };
    markedDates[selectedDate].selected = true;
    markedDates[selectedDate].selectedColor = '#c9c9c9';
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.wrapper}>

        {/* CABECERA */}
        <View style={styles.headerContainer}>

          {/* Imagen de fondo de la cabecera */}
          <Image
            source={require('../assets/wallpaper1.jpg')}
            style={styles.headerImage}
          />

          {/* Mostramos el año */}
          <Text style={styles.yearText}>{currentYear}</Text>

          {/* Creamos un gradiente de la imagen al calendario */}
          <LinearGradient
            colors={['transparent', 'white']}
            style={styles.gradient}
          />
        </View>

        {/* VIEW DEL CALENDARIO */}
        <View style={styles.calendarWrapper}>
          <Calendar
            // Lunes como primer día de la semana
            firstDay={1}

            // Selección de la fecha a la que se le da click. Si ya está seleccionada, se deselecciona
            onDayPress={(day) => {
              setSelectedDate(prev => prev === day.dateString ? '' : day.dateString);
            }}

            // Selección de la fecha al cambiar de mes
            onMonthChange={handleMonthChange}

            // Enseñar días de otros meses en la página del mes. Por defecto está a false pero lo forzamos para evitar posibles problemas
            hideExtraDays={false}

            // Mostrar el mes actual en la cabecera del calendario
            renderHeader={() => (
              <View style={styles.customHeaderContainer}>
                <Text style={styles.customHeaderText}>{currentMonth}</Text>
              </View>
            )}

            // Configuración fecha seleccionada
            markedDates={markedDates}
            markingType="multi-dot"

            disableAllTouchEventsForInactiveDays={false}

            // Importamos los estilos
            style={styles.calendar}

            // Importamos el tema del calendario
            theme={CalendarioTheme}

            // Habilitamos el swipe para cambiar de mes
            enableSwipeMonths={true}

          />
        </View>

        {/* GESTOR DE ACTIVIDADES */}
        <View>
          <GestorActividades
            selectedDate={selectedDate}
            tasks={tasks}
            setTasks={setTasks}
            refreshExternalEvents={refreshExternalEvents}
            setRefreshExternalEvents={setRefreshExternalEvents}
          />
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
