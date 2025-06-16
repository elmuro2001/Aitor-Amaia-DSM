import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import CalendarComponent from './components/CalendarioComponent';
import useExternalEvents from './hooks/useExternalEvents';
import React, { useState } from 'react';

function getCurrentMonthString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [refreshExternalEvents, setRefreshExternalEvents] = useState(false);
  // const externalEvents = useExternalEvents(selectedDate); 

  const [visibleMonth, setVisibleMonth] = useState(getCurrentMonthString()); 
  const externalEvents = useExternalEvents(visibleMonth, refreshExternalEvents);

  return (
    <View style={styles.container}>
      <CalendarComponent
        tasks={tasks}
        setTasks={setTasks}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        externalEvents={externalEvents}
        setVisibleMonth={setVisibleMonth}
        refreshExternalEvents={refreshExternalEvents}
        setRefreshExternalEvents={setRefreshExternalEvents}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});