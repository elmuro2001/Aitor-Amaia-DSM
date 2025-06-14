// Importaciones necesarias
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GestorActividades from './Actividad';
import '../config/CalendarioConfig';

import styles from '../styles/CalendarioStyle';
import CalendarioTheme from '../styles/CalendarioTheme';
import { LinearGradient } from 'expo-linear-gradient';


const CalendarComponent = () => {
  // Constantes y estados 
  const [tasks, setTasks] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [refreshFlag, setRefreshFlag] = useState(false);

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

    // Forzar rerender suave para evitar problemas de renderizado
    setRefreshFlag(f => !f);
  };

  // Construir markedDates con dots de colores
  const markedDates = {};
  Object.entries(tasks).forEach(([date, actividades]) => {
    if (actividades.length > 0) {
      markedDates[date] = {
        dots: actividades.map((act, idx) => ({
          key: act.name + idx,
          color: act.color || '#000',
        })),
        ...(date === selectedDate ? { selected: true, selectedColor: '#c9c9c9' } : {}),
      };
    }
  });
  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = { selected: true, selectedColor: '#c9c9c9' };
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
