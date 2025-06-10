// Importaciones necesarias
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, ScrollView, Image, } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import '../config/CalendarioConfig';
import styles from '../styles/CalendarioStyle';
import GestorActividades from './Actividad';
import CalendarioTheme from '../styles/CalendarioTheme';


const CalendarComponent = () => {
  // Constantes y estados 
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Cargamos el mes y año actual al iniciar el componente
  useEffect(() => {
    const today = new Date();
    updateMonthYear(today);
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
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#c9c9c9' },
            }}

            disableAllTouchEventsForInactiveDays={false}

            // Importamos los estilos
            style={styles.calendar}

            // Importamos el tema del calendario
            theme={CalendarioTheme}
          />
        </View>

        {/* GESTOR RE ACTIVIDADES */}
        <View>
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
