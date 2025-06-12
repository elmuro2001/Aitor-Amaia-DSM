// components/TaskList.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dimensiones from '../config/dimensiones';
import styles from '../styles/CalendarioStyle';

const TaskList = ({ tasks, externalEvents, selectedDate, setTasks, openViewModal }) => {
  const allEvents = [
    ...(tasks[selectedDate] || []),
    ...externalEvents,
  ];

  const dias = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => !item.external && openViewModal(item)}
      disabled={item.external}
    >
      <View style={styles.taskItem}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.taskTitle, { color: item.color || '#333' }]}>
            {item.name}{item.external && ' (calendario)'}
          </Text>

          {item.type === 'evento' && item.startDate && item.startHour && (
            <Text style={styles.taskSubtext}>
              {(() => {
                const startD = new Date(item.startDate);
                const endD = item.endDate ? new Date(item.endDate) : null;
                const sameDay = endD && startD.toDateString() === endD.toDateString();

                if (item.endHour && endD) {
                  if (sameDay) {
                    return `${item.startHour} - ${item.endHour} ${dias[startD.getDay()]}, ${startD.getDate()} ${meses[startD.getMonth()]}`;
                  } else {
                    return `${item.startHour} ${dias[startD.getDay()]}, ${startD.getDate()} ${meses[startD.getMonth()]} - ${item.endHour} ${dias[endD.getDay()]}, ${endD.getDate()} ${meses[endD.getMonth()]}`;
                  }
                } else {
                  return `${item.startHour} ${dias[startD.getDay()]}, ${startD.getDate()} ${meses[startD.getMonth()]}`;
                }
              })()}
            </Text>
          )}

          {item.type === 'tarea' && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox
                checked={(tasks[selectedDate] || []).find(t => t.id === item.id)?.done}
                onPress={async () => {
                  const updatedDateTasks = [...(tasks[selectedDate] || [])];
                  const idx = updatedDateTasks.findIndex(t => t.id === item.id);
                  if (idx !== -1) {
                    updatedDateTasks[idx] = {
                      ...updatedDateTasks[idx],
                      done: !updatedDateTasks[idx].done,
                    };
                    const updatedTasks = { ...tasks, [selectedDate]: updatedDateTasks };
                    setTasks(updatedTasks);
                    await AsyncStorage.setItem('TASKS', JSON.stringify(updatedTasks));
                  }
                }}
                checkedColor="#4CAF50"
                uncheckedColor="#ccc"
                containerStyle={styles.checkBoxCompact}
                wrapperStyle={{ margin: 0, padding: 0 }}
                title=""
              />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        height: ((dimensiones.dayHeight + 4) * 2),
        width: dimensiones.screenWidth - 120,
        marginRight: 10,
        marginLeft: 10,
        marginTop: -((dimensiones.dayHeight + 4) * 2),
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 8,
        overflow: 'hidden',
        elevation: 0,
      }}
    >
      <FlatList
        contentContainerStyle={{ paddingRight: 20 }}
        data={allEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default TaskList;
